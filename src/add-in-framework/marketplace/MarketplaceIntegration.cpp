#include "MarketplaceIntegration.h"
#include "../interfaces/IAddIn.h"
#include "../interfaces/IAddInHost.h"
#include "../security/PermissionManager.h"
#include "../discovery/AddInDiscovery.h"
#include "../utils/ErrorHandler.h"
#include "../utils/AddInLogger.h"
#include <string>
#include <vector>
#include <memory>
#include <stdexcept>
#include <cpprest/http_client.h>
#include <cpprest/json.h>

using namespace web;
using namespace web::http;
using namespace web::http::client;

MarketplaceIntegration::MarketplaceIntegration(IAddInHost* host)
    : m_host(host),
      m_permissionManager(std::make_unique<PermissionManager>()),
      m_addInDiscovery(std::make_unique<AddInDiscovery>()) {
    // Initialize the MarketplaceIntegration with the given add-in host
    if (!m_host) {
        throw std::invalid_argument("Invalid add-in host provided");
    }
    AddInLogger::Log("MarketplaceIntegration initialized");
}

std::vector<AddInInfo> MarketplaceIntegration::BrowseAddIns() {
    std::vector<AddInInfo> availableAddIns;

    try {
        // Create an HTTP client to connect to the marketplace API
        http_client client(U("https://marketplace.api.example.com/addins"));

        // Send a GET request to fetch available add-ins
        http_response response = client.request(methods::GET).get();

        if (response.status_code() == status_codes::OK) {
            // Parse the JSON response
            json::value jsonResponse = response.extract_json().get();
            
            // Convert JSON to AddInInfo objects
            for (const auto& jsonAddIn : jsonResponse.as_array()) {
                AddInInfo addIn;
                addIn.id = utility::conversions::to_utf8string(jsonAddIn.at(U("id")).as_string());
                addIn.name = utility::conversions::to_utf8string(jsonAddIn.at(U("name")).as_string());
                addIn.description = utility::conversions::to_utf8string(jsonAddIn.at(U("description")).as_string());
                addIn.version = utility::conversions::to_utf8string(jsonAddIn.at(U("version")).as_string());

                // Filter add-ins based on compatibility and permissions
                if (IsCompatible(addIn) && m_permissionManager->CheckPermission(addIn.id, "install")) {
                    availableAddIns.push_back(addIn);
                }
            }
        } else {
            throw std::runtime_error("Failed to retrieve add-ins from marketplace");
        }
    } catch (const std::exception& e) {
        ErrorHandler::HandleError("Error browsing add-ins: " + std::string(e.what()));
    }

    return availableAddIns;
}

bool MarketplaceIntegration::InstallAddIn(const std::string& addInId) {
    try {
        // Verify permissions for installing the add-in
        if (!m_permissionManager->CheckPermission(addInId, "install")) {
            throw std::runtime_error("Permission denied for installing add-in: " + addInId);
        }

        // Fetch add-in details and download URL from the marketplace API
        http_client client(U("https://marketplace.api.example.com/addins/") + utility::conversions::to_string_t(addInId));
        http_response response = client.request(methods::GET).get();

        if (response.status_code() == status_codes::OK) {
            json::value jsonAddIn = response.extract_json().get();
            std::string downloadUrl = utility::conversions::to_utf8string(jsonAddIn.at(U("downloadUrl")).as_string());

            // Download the add-in package
            std::vector<unsigned char> addInPackage = DownloadAddInPackage(downloadUrl);

            // Verify the integrity and authenticity of the downloaded package
            if (!VerifyAddInPackage(addInPackage)) {
                throw std::runtime_error("Add-in package verification failed");
            }

            // Extract and install the add-in files
            std::string installPath = ExtractAndInstallAddIn(addInPackage);

            // Use m_addInDiscovery to load and register the new add-in
            if (m_addInDiscovery->LoadAddIn(installPath)) {
                // Log the successful installation
                AddInLogger::Log("Add-in installed successfully: " + addInId);
                return true;
            } else {
                throw std::runtime_error("Failed to load and register the add-in");
            }
        } else {
            throw std::runtime_error("Failed to retrieve add-in details from marketplace");
        }
    } catch (const std::exception& e) {
        ErrorHandler::HandleError("Error installing add-in: " + std::string(e.what()));
        return false;
    }
}

bool MarketplaceIntegration::UpdateAddIn(const std::string& addInId) {
    try {
        // Check if a newer version is available in the marketplace
        if (!IsUpdateAvailable(addInId)) {
            AddInLogger::Log("No update available for add-in: " + addInId);
            return false;
        }

        // Verify permissions for updating the add-in
        if (!m_permissionManager->CheckPermission(addInId, "update")) {
            throw std::runtime_error("Permission denied for updating add-in: " + addInId);
        }

        // Download the updated version of the add-in
        std::string downloadUrl = GetUpdateDownloadUrl(addInId);
        std::vector<unsigned char> updatedPackage = DownloadAddInPackage(downloadUrl);

        // Verify the integrity and authenticity of the downloaded package
        if (!VerifyAddInPackage(updatedPackage)) {
            throw std::runtime_error("Updated add-in package verification failed");
        }

        // Unload the current version of the add-in
        if (!m_addInDiscovery->UnloadAddIn(addInId)) {
            throw std::runtime_error("Failed to unload the current version of the add-in");
        }

        // Install the new version of the add-in
        std::string installPath = ExtractAndInstallAddIn(updatedPackage);

        // Use m_addInDiscovery to load and register the updated add-in
        if (m_addInDiscovery->LoadAddIn(installPath)) {
            // Log the successful update
            AddInLogger::Log("Add-in updated successfully: " + addInId);
            return true;
        } else {
            throw std::runtime_error("Failed to load and register the updated add-in");
        }
    } catch (const std::exception& e) {
        ErrorHandler::HandleError("Error updating add-in: " + std::string(e.what()));
        return false;
    }
}

bool MarketplaceIntegration::RemoveAddIn(const std::string& addInId) {
    try {
        // Verify permissions for removing the add-in
        if (!m_permissionManager->CheckPermission(addInId, "remove")) {
            throw std::runtime_error("Permission denied for removing add-in: " + addInId);
        }

        // Use m_addInDiscovery to unload and unregister the add-in
        if (!m_addInDiscovery->UnloadAddIn(addInId)) {
            throw std::runtime_error("Failed to unload the add-in");
        }

        // Remove the add-in files from the system
        if (!RemoveAddInFiles(addInId)) {
            throw std::runtime_error("Failed to remove add-in files");
        }

        // Update any local database or configuration to reflect the removal
        UpdateLocalConfiguration(addInId, "removed");

        // Log the successful removal
        AddInLogger::Log("Add-in removed successfully: " + addInId);
        return true;
    } catch (const std::exception& e) {
        ErrorHandler::HandleError("Error removing add-in: " + std::string(e.what()));
        return false;
    }
}

std::vector<AddInInfo> MarketplaceIntegration::GetInstalledAddIns() {
    std::vector<AddInInfo> installedAddIns;

    try {
        // Use m_addInDiscovery to get a list of discovered add-ins
        std::vector<std::string> addInIds = m_addInDiscovery->GetDiscoveredAddIns();

        for (const auto& addInId : addInIds) {
            // Retrieve additional metadata for each add-in from local storage
            AddInInfo addIn = GetAddInMetadata(addInId);
            installedAddIns.push_back(addIn);
        }
    } catch (const std::exception& e) {
        ErrorHandler::HandleError("Error retrieving installed add-ins: " + std::string(e.what()));
    }

    return installedAddIns;
}

// Helper functions

bool MarketplaceIntegration::IsCompatible(const AddInInfo& addIn) {
    // Implement compatibility check logic here
    // This could involve checking the add-in's required Excel version, supported platforms, etc.
    return true; // Placeholder implementation
}

std::vector<unsigned char> MarketplaceIntegration::DownloadAddInPackage(const std::string& url) {
    // Implement download logic here
    // This should securely download the add-in package from the given URL
    return std::vector<unsigned char>(); // Placeholder implementation
}

bool MarketplaceIntegration::VerifyAddInPackage(const std::vector<unsigned char>& package) {
    // Implement package verification logic here
    // This should check the integrity and authenticity of the downloaded package
    return true; // Placeholder implementation
}

std::string MarketplaceIntegration::ExtractAndInstallAddIn(const std::vector<unsigned char>& package) {
    // Implement extraction and installation logic here
    // This should safely extract the add-in files and install them in the appropriate location
    return ""; // Placeholder implementation, should return the installation path
}

bool MarketplaceIntegration::IsUpdateAvailable(const std::string& addInId) {
    // Implement update check logic here
    // This should compare the installed version with the latest version in the marketplace
    return false; // Placeholder implementation
}

std::string MarketplaceIntegration::GetUpdateDownloadUrl(const std::string& addInId) {
    // Implement logic to get the download URL for the update
    return ""; // Placeholder implementation
}

bool MarketplaceIntegration::RemoveAddInFiles(const std::string& addInId) {
    // Implement file removal logic here
    // This should safely remove all files associated with the add-in
    return true; // Placeholder implementation
}

void MarketplaceIntegration::UpdateLocalConfiguration(const std::string& addInId, const std::string& status) {
    // Implement logic to update local configuration or database
    // This should reflect the current status of the add-in (e.g., installed, removed)
}

AddInInfo MarketplaceIntegration::GetAddInMetadata(const std::string& addInId) {
    // Implement logic to retrieve add-in metadata from local storage
    AddInInfo addIn;
    addIn.id = addInId;
    // Populate other fields of addIn
    return addIn;
}
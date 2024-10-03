#include "AddInDiscovery.h"
#include "../interfaces/IAddIn.h"
#include "../interfaces/IAddInHost.h"
#include "../security/PermissionManager.h"
#include "../versioning/VersionManager.h"
#include "../utils/AddInLogger.h"
#include <vector>
#include <string>
#include <filesystem>
#include <memory>

#ifdef _WIN32
#include <windows.h>
#else
#include <dlfcn.h>
#endif

AddInDiscovery::AddInDiscovery(IAddInHost* addInHost, PermissionManager* permissionManager, VersionManager* versionManager)
    : m_addInHost(addInHost), m_permissionManager(permissionManager), m_versionManager(versionManager) {}

void AddInDiscovery::DiscoverAddIns(const std::string& directory) {
    AddInLogger::Log("Starting add-in discovery in directory: " + directory);

    try {
        for (const auto& entry : std::filesystem::directory_iterator(directory)) {
            if (entry.is_regular_file() && IsPotentialAddIn(entry.path().string())) {
                if (LoadAddIn(entry.path().string())) {
                    AddInLogger::Log("Successfully loaded add-in: " + entry.path().string());
                } else {
                    AddInLogger::Log("Failed to load add-in: " + entry.path().string(), AddInLogger::LogLevel::Error);
                }
            }
        }
    } catch (const std::filesystem::filesystem_error& e) {
        AddInLogger::Log("Error scanning directory: " + std::string(e.what()), AddInLogger::LogLevel::Error);
    }
}

bool AddInDiscovery::LoadAddIn(const std::string& filePath) {
    AddInLogger::Log("Attempting to load add-in: " + filePath);

    void* handle = nullptr;
    IAddIn* (*createAddIn)() = nullptr;

#ifdef _WIN32
    handle = LoadLibraryA(filePath.c_str());
    if (!handle) {
        AddInLogger::Log("Failed to load library: " + filePath, AddInLogger::LogLevel::Error);
        return false;
    }
    createAddIn = reinterpret_cast<IAddIn* (*)()>(GetProcAddress(static_cast<HMODULE>(handle), "CreateAddIn"));
#else
    handle = dlopen(filePath.c_str(), RTLD_LAZY);
    if (!handle) {
        AddInLogger::Log("Failed to load library: " + filePath + " - " + dlerror(), AddInLogger::LogLevel::Error);
        return false;
    }
    createAddIn = reinterpret_cast<IAddIn* (*)()>(dlsym(handle, "CreateAddIn"));
#endif

    if (!createAddIn) {
        AddInLogger::Log("Failed to get CreateAddIn function pointer", AddInLogger::LogLevel::Error);
        return false;
    }

    std::unique_ptr<IAddIn> addIn(createAddIn());
    if (!addIn) {
        AddInLogger::Log("Failed to create add-in instance", AddInLogger::LogLevel::Error);
        return false;
    }

    if (!ValidateAddIn(addIn.get())) {
        AddInLogger::Log("Add-in validation failed", AddInLogger::LogLevel::Error);
        return false;
    }

    if (!addIn->Initialize(m_addInHost)) {
        AddInLogger::Log("Add-in initialization failed", AddInLogger::LogLevel::Error);
        return false;
    }

    m_discoveredAddIns.push_back(std::move(addIn));
    return true;
}

void AddInDiscovery::UnloadAddIn(IAddIn* addIn) {
    if (!addIn) {
        AddInLogger::Log("Attempt to unload null add-in", AddInLogger::LogLevel::Error);
        return;
    }

    AddInLogger::Log("Unloading add-in: " + addIn->GetName());

    addIn->Shutdown();

    auto it = std::find_if(m_discoveredAddIns.begin(), m_discoveredAddIns.end(),
                           [addIn](const std::unique_ptr<IAddIn>& ptr) { return ptr.get() == addIn; });

    if (it != m_discoveredAddIns.end()) {
        m_discoveredAddIns.erase(it);
        AddInLogger::Log("Add-in unloaded successfully");
    } else {
        AddInLogger::Log("Add-in not found in discovered add-ins list", AddInLogger::LogLevel::Error);
    }

    // Note: We don't need to explicitly unload the library as std::unique_ptr will handle that for us
}

const std::vector<std::unique_ptr<IAddIn>>& AddInDiscovery::GetDiscoveredAddIns() const {
    return m_discoveredAddIns;
}

bool AddInDiscovery::ValidateAddIn(IAddIn* addIn) {
    if (!m_permissionManager->CheckPermissions(addIn)) {
        AddInLogger::Log("Add-in failed permission check: " + addIn->GetName(), AddInLogger::LogLevel::Error);
        return false;
    }

    if (!m_versionManager->CheckCompatibility(addIn)) {
        AddInLogger::Log("Add-in is not compatible with current Excel version: " + addIn->GetName(), AddInLogger::LogLevel::Error);
        return false;
    }

    return true;
}

bool AddInDiscovery::IsPotentialAddIn(const std::string& filePath) {
    std::string extension = std::filesystem::path(filePath).extension().string();
    std::transform(extension.begin(), extension.end(), extension.begin(), ::tolower);

#ifdef _WIN32
    return extension == ".dll";
#else
    return extension == ".so";
#endif
}
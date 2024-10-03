#ifndef MARKETPLACE_INTEGRATION_H
#define MARKETPLACE_INTEGRATION_H

#include <string>
#include <vector>
#include <memory>
#include "../interfaces/IAddIn.h"
#include "../interfaces/IAddInHost.h"
#include "../security/PermissionManager.h"
#include "../discovery/AddInDiscovery.h"

// Forward declarations
class IAddInHost;
class PermissionManager;
class AddInDiscovery;

/**
 * @struct AddInInfo
 * @brief Represents information about an add-in available in the marketplace.
 */
struct AddInInfo {
    std::string id;
    std::string name;
    std::string description;
    std::string version;
    // Add other relevant fields as needed
};

/**
 * @class MarketplaceIntegration
 * @brief Manages the integration between Excel and the add-in marketplace.
 * 
 * This class provides functionality for browsing, installing, updating, and removing add-ins.
 */
class MarketplaceIntegration {
public:
    /**
     * @brief Constructs a MarketplaceIntegration object.
     * @param host Pointer to the IAddInHost interface.
     */
    explicit MarketplaceIntegration(IAddInHost* host);

    /**
     * @brief Retrieves a list of available add-ins from the marketplace.
     * @return A vector of AddInInfo structures representing available add-ins.
     */
    std::vector<AddInInfo> BrowseAddIns();

    /**
     * @brief Installs the specified add-in from the marketplace.
     * @param addInId The unique identifier of the add-in to install.
     * @return True if installation was successful, false otherwise.
     */
    bool InstallAddIn(const std::string& addInId);

    /**
     * @brief Updates the specified add-in to the latest version available in the marketplace.
     * @param addInId The unique identifier of the add-in to update.
     * @return True if update was successful, false otherwise.
     */
    bool UpdateAddIn(const std::string& addInId);

    /**
     * @brief Removes the specified add-in from Excel.
     * @param addInId The unique identifier of the add-in to remove.
     * @return True if removal was successful, false otherwise.
     */
    bool RemoveAddIn(const std::string& addInId);

    /**
     * @brief Retrieves a list of add-ins currently installed in Excel.
     * @return A vector of AddInInfo structures representing installed add-ins.
     */
    std::vector<AddInInfo> GetInstalledAddIns();

private:
    IAddInHost* m_host;
    std::unique_ptr<PermissionManager> m_permissionManager;
    std::unique_ptr<AddInDiscovery> m_addInDiscovery;

    // Private helper methods
    bool VerifyPermissions(const std::string& addInId, const std::string& operation);
    bool DownloadAddIn(const std::string& addInId);
    bool UnloadAddIn(const std::string& addInId);
    bool RemoveAddInFiles(const std::string& addInId);
};

#endif // MARKETPLACE_INTEGRATION_H
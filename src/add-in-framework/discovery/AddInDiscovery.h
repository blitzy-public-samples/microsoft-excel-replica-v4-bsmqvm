#ifndef ADD_IN_DISCOVERY_H
#define ADD_IN_DISCOVERY_H

#include <vector>
#include <string>
#include "../interfaces/IAddIn.h"
#include "../interfaces/IAddInHost.h"
#include "../security/PermissionManager.h"
#include "../versioning/VersionManager.h"

class AddInDiscovery {
public:
    AddInDiscovery(IAddInHost* addInHost, PermissionManager* permissionManager, VersionManager* versionManager);
    ~AddInDiscovery();

    // Scans the specified directory for Excel add-ins and loads them
    void DiscoverAddIns(const std::string& directory);

    // Loads a single add-in from the specified file path
    bool LoadAddIn(const std::string& filePath);

    // Unloads and removes the specified add-in from the framework
    void UnloadAddIn(IAddIn* addIn);

    // Returns a const reference to the vector of discovered add-ins
    const std::vector<IAddIn*>& GetDiscoveredAddIns() const;

private:
    // Validates the add-in by checking its permissions and version compatibility
    bool ValidateAddIn(IAddIn* addIn);

    std::vector<IAddIn*> m_discoveredAddIns;
    IAddInHost* m_addInHost;
    PermissionManager* m_permissionManager;
    VersionManager* m_versionManager;
};

#endif // ADD_IN_DISCOVERY_H
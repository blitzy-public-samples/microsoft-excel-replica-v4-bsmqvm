#ifndef ADD_IN_SANDBOX_H
#define ADD_IN_SANDBOX_H

#include <memory>
#include <string>
#include <vector>
#include "../interfaces/IAddIn.h"
#include "PermissionManager.h"

namespace ExcelAddInFramework {
namespace Security {

/**
 * @class AddInSandbox
 * @brief Implements a sandboxed environment for executing Excel add-ins, ensuring they operate within defined security boundaries.
 */
class AddInSandbox {
public:
    /**
     * @brief Creates and returns a new instance of the AddInSandbox.
     * @return A unique pointer to the created AddInSandbox instance.
     */
    static std::unique_ptr<AddInSandbox> CreateSandbox();

    /**
     * @brief Executes the given add-in within the sandboxed environment.
     * @param addIn Pointer to the add-in to be executed.
     */
    void ExecuteAddIn(const IAddIn* addIn);

    /**
     * @brief Sets the permissions for a specific add-in.
     * @param addInName The name of the add-in.
     * @param permissions A vector of permission strings.
     */
    void SetPermissions(const std::string& addInName, const std::vector<std::string>& permissions);

private:
    AddInSandbox() = default;
    std::unique_ptr<PermissionManager> m_permissionManager;

    // Private helper methods
    void SetupSandboxEnvironment();
    void CheckPermissions(const IAddIn* addIn);
    void EnforceSecurityConstraints();
    void CleanupSandboxEnvironment();
};

} // namespace Security
} // namespace ExcelAddInFramework

#endif // ADD_IN_SANDBOX_H
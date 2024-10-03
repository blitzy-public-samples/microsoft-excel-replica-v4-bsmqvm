#ifndef PERMISSION_MANAGER_H
#define PERMISSION_MANAGER_H

#include <string>
#include <unordered_map>
#include <set>

// Forward declaration of IAddIn
class IAddIn;

/**
 * @class PermissionManager
 * @brief Manages and enforces permissions for Excel add-ins within the add-in framework.
 * 
 * This class is responsible for setting, removing, checking, and enforcing permissions
 * for Excel add-ins to ensure they only access allowed resources and perform authorized operations.
 */
class PermissionManager {
public:
    /**
     * @brief Sets a specific permission for an add-in.
     * @param addInName The name of the add-in.
     * @param permission The permission to be set.
     */
    void SetPermission(const std::string& addInName, const std::string& permission);

    /**
     * @brief Removes a specific permission from an add-in.
     * @param addInName The name of the add-in.
     * @param permission The permission to be removed.
     */
    void RemovePermission(const std::string& addInName, const std::string& permission);

    /**
     * @brief Checks if an add-in has a specific permission.
     * @param addInName The name of the add-in.
     * @param permission The permission to check.
     * @return True if the add-in has the specified permission, false otherwise.
     */
    bool HasPermission(const std::string& addInName, const std::string& permission) const;

    /**
     * @brief Enforces permissions for a given add-in and action.
     * @param addIn Pointer to the IAddIn interface of the add-in.
     * @param action The action to be performed.
     * @throw std::runtime_error if the add-in doesn't have the necessary permission.
     */
    void EnforcePermissions(const IAddIn* addIn, const std::string& action);

private:
    /**
     * @brief Stores the permissions for each add-in.
     * 
     * The key is the add-in name, and the value is a set of permissions granted to that add-in.
     */
    std::unordered_map<std::string, std::set<std::string>> m_permissions;
};

#endif // PERMISSION_MANAGER_H
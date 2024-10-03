#include "PermissionManager.h"
#include "../interfaces/IAddIn.h"
#include "../utils/ErrorHandler.h"
#include "../utils/AddInLogger.h"
#include <unordered_map>
#include <set>
#include <string>
#include <stdexcept>

class PermissionManager {
private:
    std::unordered_map<std::string, std::set<std::string>> permissions;
    AddInLogger logger;
    ErrorHandler errorHandler;

public:
    PermissionManager() : logger("PermissionManager"), errorHandler() {}

    void SetPermission(const std::string& addInName, const std::string& permission) {
        try {
            permissions[addInName].insert(permission);
            logger.Log(AddInLogger::LogLevel::INFO, "Permission '" + permission + "' added for add-in: " + addInName);
        } catch (const std::exception& e) {
            errorHandler.HandleError("Error setting permission: " + std::string(e.what()));
            logger.Log(AddInLogger::LogLevel::ERROR, "Failed to set permission '" + permission + "' for add-in: " + addInName);
        }
    }

    void RemovePermission(const std::string& addInName, const std::string& permission) {
        try {
            auto it = permissions.find(addInName);
            if (it != permissions.end()) {
                it->second.erase(permission);
                logger.Log(AddInLogger::LogLevel::INFO, "Permission '" + permission + "' removed for add-in: " + addInName);
            } else {
                logger.Log(AddInLogger::LogLevel::WARNING, "Attempted to remove permission '" + permission + "' for non-existent add-in: " + addInName);
            }
        } catch (const std::exception& e) {
            errorHandler.HandleError("Error removing permission: " + std::string(e.what()));
            logger.Log(AddInLogger::LogLevel::ERROR, "Failed to remove permission '" + permission + "' for add-in: " + addInName);
        }
    }

    bool HasPermission(const std::string& addInName, const std::string& permission) const {
        try {
            auto it = permissions.find(addInName);
            if (it != permissions.end()) {
                bool hasPermission = it->second.find(permission) != it->second.end();
                logger.Log(AddInLogger::LogLevel::INFO, 
                    "Permission check for '" + permission + "' on add-in '" + addInName + "': " + (hasPermission ? "Granted" : "Denied"));
                return hasPermission;
            }
            logger.Log(AddInLogger::LogLevel::INFO, "Permission check for non-existent add-in: " + addInName);
            return false;
        } catch (const std::exception& e) {
            errorHandler.HandleError("Error checking permission: " + std::string(e.what()));
            logger.Log(AddInLogger::LogLevel::ERROR, "Failed to check permission '" + permission + "' for add-in: " + addInName);
            return false;
        }
    }

    void EnforcePermissions(const IAddIn* addIn, const std::string& action) {
        try {
            std::string addInName = addIn->GetName();
            if (!HasPermission(addInName, action)) {
                std::string errorMessage = "Permission denied: Add-in '" + addInName + "' does not have permission for action '" + action + "'";
                logger.Log(AddInLogger::LogLevel::WARNING, errorMessage);
                throw std::runtime_error(errorMessage);
            }
            logger.Log(AddInLogger::LogLevel::INFO, "Permission granted for add-in '" + addInName + "' to perform action '" + action + "'");
        } catch (const std::exception& e) {
            errorHandler.HandleError("Error enforcing permissions: " + std::string(e.what()));
            logger.Log(AddInLogger::LogLevel::ERROR, "Failed to enforce permissions for action '" + action + "'");
            throw; // Re-throw the exception after logging
        }
    }
};

// Implement any additional helper functions or class methods here if needed
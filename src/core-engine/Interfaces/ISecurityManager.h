#ifndef ISECURITY_MANAGER_H
#define ISECURITY_MANAGER_H

#include <string>
#include <vector>
#include <cstdint>

namespace Microsoft {
namespace Excel {
namespace CoreEngine {

/**
 * @class ISecurityManager
 * @brief This abstract class defines the interface for the Security Manager, which is a critical component
 *        responsible for handling security-related operations within the Microsoft Excel core engine.
 * 
 * The Security Manager is designed to maintain robust security measures and adhere to global compliance
 * standards to protect user data, as specified in the system objectives.
 */
class ISecurityManager {
public:
    /**
     * @brief Virtual destructor to ensure proper cleanup of derived classes.
     */
    virtual ~ISecurityManager() = default;

    /**
     * @brief Authenticates a user with the provided credentials.
     * 
     * @param username The username of the user attempting to authenticate.
     * @param password The password of the user attempting to authenticate.
     * @return true if authentication is successful, false otherwise.
     */
    virtual bool AuthenticateUser(const std::string& username, const std::string& password) = 0;

    /**
     * @brief Authorizes a user's action on a specific resource.
     * 
     * @param userId The unique identifier of the user.
     * @param action The action the user is attempting to perform.
     * @param resource The resource on which the action is to be performed.
     * @return true if the action is authorized, false otherwise.
     */
    virtual bool AuthorizeAction(const std::string& userId, const std::string& action, const std::string& resource) = 0;

    /**
     * @brief Encrypts the provided data using the specified key.
     * 
     * @param data The data to be encrypted.
     * @param key The encryption key.
     * @return The encrypted data.
     */
    virtual std::vector<uint8_t> EncryptData(const std::vector<uint8_t>& data, const std::string& key) = 0;

    /**
     * @brief Decrypts the provided encrypted data using the specified key.
     * 
     * @param encryptedData The data to be decrypted.
     * @param key The decryption key.
     * @return The decrypted data.
     */
    virtual std::vector<uint8_t> DecryptData(const std::vector<uint8_t>& encryptedData, const std::string& key) = 0;

    /**
     * @brief Validates the integrity of data using a digital signature.
     * 
     * @param data The data to be validated.
     * @param signature The digital signature to be used for validation.
     * @return true if the data integrity is valid, false otherwise.
     */
    virtual bool ValidateDataIntegrity(const std::vector<uint8_t>& data, const std::vector<uint8_t>& signature) = 0;
};

} // namespace CoreEngine
} // namespace Excel
} // namespace Microsoft

#endif // ISECURITY_MANAGER_H
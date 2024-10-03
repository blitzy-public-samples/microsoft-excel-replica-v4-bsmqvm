#ifndef OFFICE_ADD_IN_MANIFEST_H
#define OFFICE_ADD_IN_MANIFEST_H

#include <string>
#include <vector>

/**
 * @class OfficeAddInManifest
 * @brief Represents and manages the manifest information for Microsoft Office Excel add-ins.
 * 
 * This class is responsible for handling and managing the manifest information
 * for Microsoft Office Excel add-ins. It provides functionality to load manifest
 * information from a file and access various properties defined in the manifest.
 */
class OfficeAddInManifest {
public:
    /**
     * @brief Constructs an OfficeAddInManifest object by loading manifest information from the specified file path.
     * @param manifestPath The path to the manifest file.
     */
    explicit OfficeAddInManifest(const std::string& manifestPath);

    /**
     * @brief Returns the name of the add-in.
     * @return The name of the add-in as a string.
     */
    std::string GetAddInName() const;

    /**
     * @brief Returns the version of the add-in.
     * @return The version of the add-in as a string.
     */
    std::string GetAddInVersion() const;

    /**
     * @brief Returns the list of supported functions defined in the manifest.
     * @return A vector of strings containing the supported functions.
     */
    std::vector<std::string> GetSupportedFunctions() const;

    /**
     * @brief Returns the custom UI XML defined in the manifest.
     * @return The custom UI XML as a string.
     */
    std::string GetCustomUI() const;

    /**
     * @brief Loads and parses the manifest file from the given path.
     * @param manifestPath The path to the manifest file.
     * @return True if loading was successful, false otherwise.
     */
    bool LoadManifest(const std::string& manifestPath);

private:
    std::string m_addInName;
    std::string m_addInVersion;
    std::vector<std::string> m_supportedFunctions;
    std::string m_customUI;
};

#endif // OFFICE_ADD_IN_MANIFEST_H
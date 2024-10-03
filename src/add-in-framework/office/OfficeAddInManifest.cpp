#include "OfficeAddInManifest.h"
#include <fstream>
#include <sstream>
#include <stdexcept>
#include "rapidxml/rapidxml.hpp"
#include "rapidxml/rapidxml_utils.hpp"

OfficeAddInManifest::OfficeAddInManifest(const std::string& manifestPath) {
    LoadManifest(manifestPath);
}

std::string OfficeAddInManifest::GetAddInName() const {
    return m_addInName;
}

std::string OfficeAddInManifest::GetAddInVersion() const {
    return m_addInVersion;
}

std::vector<std::string> OfficeAddInManifest::GetSupportedFunctions() const {
    return m_supportedFunctions;
}

std::string OfficeAddInManifest::GetCustomUI() const {
    return m_customUI;
}

bool OfficeAddInManifest::LoadManifest(const std::string& manifestPath) {
    try {
        // Open and read the manifest file
        rapidxml::file<> xmlFile(manifestPath.c_str());
        rapidxml::xml_document<> doc;
        doc.parse<0>(xmlFile.data());

        // Extract add-in name
        rapidxml::xml_node<>* nameNode = doc.first_node("OfficeApp")->first_node("DisplayName");
        if (nameNode) {
            m_addInName = nameNode->value();
        }

        // Extract add-in version
        rapidxml::xml_node<>* versionNode = doc.first_node("OfficeApp")->first_node("Version");
        if (versionNode) {
            m_addInVersion = versionNode->value();
        }

        // Extract supported functions
        rapidxml::xml_node<>* functionsNode = doc.first_node("OfficeApp")->first_node("FunctionFile");
        if (functionsNode) {
            for (rapidxml::xml_node<>* functionNode = functionsNode->first_node("Function");
                 functionNode; functionNode = functionNode->next_sibling("Function")) {
                m_supportedFunctions.push_back(functionNode->first_attribute("Name")->value());
            }
        }

        // Extract custom UI
        rapidxml::xml_node<>* customUINode = doc.first_node("OfficeApp")->first_node("CustomUI");
        if (customUINode) {
            std::stringstream ss;
            ss << *customUINode;
            m_customUI = ss.str();
        }

        return true;
    }
    catch (const std::exception& e) {
        // Handle any errors during file I/O or XML parsing
        // In a production environment, you might want to log this error
        return false;
    }
}
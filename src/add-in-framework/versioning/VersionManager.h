#ifndef VERSION_MANAGER_H
#define VERSION_MANAGER_H

#include <string>
#include <vector>
#include "../interfaces/IAddIn.h"

class VersionManager {
public:
    VersionManager();
    ~VersionManager();

    void SetSupportedExcelVersions(const std::string& minVersion, const std::string& maxVersion);
    void RegisterAddIn(IAddIn* addIn);
    bool CheckCompatibility(const std::string& excelVersion);
    std::string GetAddInVersion(const std::string& addInName);

private:
    std::string m_minExcelVersion;
    std::string m_maxExcelVersion;
    std::vector<IAddIn*> m_addIns;
};

#endif // VERSION_MANAGER_H
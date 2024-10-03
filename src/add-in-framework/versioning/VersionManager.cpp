#include "VersionManager.h"
#include "../interfaces/IAddIn.h"
#include "../utils/ErrorHandler.h"
#include <algorithm>

VersionManager::VersionManager() : m_minExcelVersion(""), m_maxExcelVersion("") {}

VersionManager::~VersionManager() {
    m_addIns.clear();
}

void VersionManager::SetSupportedExcelVersions(const std::string& minVersion, const std::string& maxVersion) {
    m_minExcelVersion = minVersion;
    m_maxExcelVersion = maxVersion;
}

void VersionManager::RegisterAddIn(IAddIn* addIn) {
    if (addIn != nullptr) {
        m_addIns.push_back(addIn);
    } else {
        ErrorHandler::LogError("Attempted to register a null add-in pointer");
    }
}

bool VersionManager::CheckCompatibility(const std::string& excelVersion) const {
    // Check if the Excel version is within the supported range
    if (excelVersion < m_minExcelVersion || excelVersion > m_maxExcelVersion) {
        return false;
    }

    // Check compatibility for each registered add-in
    for (const auto& addIn : m_addIns) {
        if (!addIn->IsCompatibleWithExcelVersion(excelVersion)) {
            return false;
        }
    }

    return true;
}

std::string VersionManager::GetAddInVersion(const std::string& addInName) const {
    auto it = std::find_if(m_addIns.begin(), m_addIns.end(),
        [&addInName](const IAddIn* addIn) { return addIn->GetName() == addInName; });

    if (it != m_addIns.end()) {
        return (*it)->GetVersion();
    } else {
        ErrorHandler::LogWarning("Add-in not found: " + addInName);
        return "";
    }
}
```

This implementation of the VersionManager class provides the following functionality:

1. The constructor initializes the minimum and maximum Excel versions to empty strings.
2. The destructor clears the vector of registered add-ins.
3. `SetSupportedExcelVersions` sets the minimum and maximum supported Excel versions.
4. `RegisterAddIn` adds a new add-in to the vector of registered add-ins, with null pointer checking.
5. `CheckCompatibility` verifies if the given Excel version is compatible with the supported range and all registered add-ins.
6. `GetAddInVersion` retrieves the version of a specific add-in by its name.

Note that this implementation assumes the existence of the following files and interfaces:

- `../interfaces/IAddIn.h`: Interface for Excel add-ins
- `../utils/ErrorHandler.h`: Error handling utility

Make sure to implement these dependencies if they don't exist yet. Also, you may need to create a corresponding VersionManager.h file with the class declaration. Here's a suggested content for VersionManager.h:

```cpp
#pragma once

#include <string>
#include <vector>

class IAddIn;

class VersionManager {
public:
    VersionManager();
    ~VersionManager();

    void SetSupportedExcelVersions(const std::string& minVersion, const std::string& maxVersion);
    void RegisterAddIn(IAddIn* addIn);
    bool CheckCompatibility(const std::string& excelVersion) const;
    std::string GetAddInVersion(const std::string& addInName) const;

private:
    std::string m_minExcelVersion;
    std::string m_maxExcelVersion;
    std::vector<IAddIn*> m_addIns;
};
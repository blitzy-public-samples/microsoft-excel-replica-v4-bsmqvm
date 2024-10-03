#ifndef OFFICE_ADD_IN_HOST_H
#define OFFICE_ADD_IN_HOST_H

#include "../interfaces/IAddInHost.h"
#include "../interfaces/IExcelInterop.h"
#include "OfficeAddInManifest.h"
#include "../utils/AddInLogger.h"

#include <Windows.h>
#include <comdef.h>

class OfficeAddInHost : public IAddInHost {
public:
    // Constructor
    OfficeAddInHost(IExcelInterop* pExcelInterop, OfficeAddInManifest* pManifest);

    // Destructor
    virtual ~OfficeAddInHost();

    // IAddInHost interface implementation
    IExcelInterop* GetExcelInterop() override;
    bool RegisterFunction(const char* functionName, void* functionPointer) override;
    bool UnregisterFunction(const char* functionName) override;
    bool AddMenuItem(const char* menuName, const char* itemName, const char* macroName) override;
    bool RemoveMenuItem(const char* menuName, const char* itemName) override;
    void LogMessage(const char* message) override;

private:
    IExcelInterop* m_pExcelInterop;
    AddInLogger* m_pLogger;
    OfficeAddInManifest* m_pManifest;
};

#endif // OFFICE_ADD_IN_HOST_H
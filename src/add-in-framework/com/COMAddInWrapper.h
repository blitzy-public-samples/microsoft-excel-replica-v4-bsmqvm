#ifndef COM_ADDIN_WRAPPER_H
#define COM_ADDIN_WRAPPER_H

#include <windows.h>
#include <ole2.h>
#include "../interfaces/IAddIn.h"
#include "../interfaces/IAddInHost.h"
#include "../interfaces/IExcelInterop.h"

class COMAddInWrapper : public IAddIn {
public:
    COMAddInWrapper(IDispatch* pComAddIn);
    virtual ~COMAddInWrapper();

    // IAddIn interface implementation
    void Initialize(IAddInHost* host, IExcelInterop* excelInterop) override;
    void Shutdown() override;
    const char* GetName() const override;
    const char* GetVersion() const override;
    void OnCalculate() override;
    void OnCommand(const char* command) override;

private:
    IDispatch* m_pComAddIn;
    IAddInHost* m_pHost;
    IExcelInterop* m_pExcelInterop;

    // Helper methods
    void ReleaseInterfaces();
};

#endif // COM_ADDIN_WRAPPER_H
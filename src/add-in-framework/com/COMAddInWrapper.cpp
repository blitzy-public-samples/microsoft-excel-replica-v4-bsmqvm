#include "COMAddInWrapper.h"
#include "../interfaces/IAddIn.h"
#include "../interfaces/IAddInHost.h"
#include "../interfaces/IExcelInterop.h"
#include <windows.h>
#include <ole2.h>
#include <string>
#include <stdexcept>

COMAddInWrapper::COMAddInWrapper(IDispatch* pComAddIn) : m_pComAddIn(pComAddIn), m_pHost(nullptr), m_pExcelInterop(nullptr) {
    if (m_pComAddIn) {
        m_pComAddIn->AddRef();
    } else {
        throw std::runtime_error("Invalid COM AddIn object pointer");
    }
}

COMAddInWrapper::~COMAddInWrapper() {
    if (m_pComAddIn) {
        m_pComAddIn->Release();
        m_pComAddIn = nullptr;
    }
    // Note: We don't release m_pHost and m_pExcelInterop here as they are owned by the host application
}

void COMAddInWrapper::Initialize(IAddInHost* host, IExcelInterop* excelInterop) {
    if (!host || !excelInterop) {
        throw std::invalid_argument("Invalid host or excelInterop pointer");
    }
    m_pHost = host;
    m_pExcelInterop = excelInterop;

    // Initialize the COM add-in
    HRESULT hr = S_OK;
    DISPID dispidMethod;
    OLECHAR* methodName = L"Initialize";
    hr = m_pComAddIn->GetIDsOfNames(IID_NULL, &methodName, 1, LOCALE_USER_DEFAULT, &dispidMethod);
    if (SUCCEEDED(hr)) {
        DISPPARAMS params = { nullptr, nullptr, 0, 0 };
        VARIANT result;
        VariantInit(&result);
        hr = m_pComAddIn->Invoke(dispidMethod, IID_NULL, LOCALE_USER_DEFAULT, DISPATCH_METHOD, &params, &result, nullptr, nullptr);
        VariantClear(&result);
    }
    if (FAILED(hr)) {
        throw std::runtime_error("Failed to initialize COM add-in");
    }
}

void COMAddInWrapper::Shutdown() {
    if (m_pComAddIn) {
        HRESULT hr = S_OK;
        DISPID dispidMethod;
        OLECHAR* methodName = L"Shutdown";
        hr = m_pComAddIn->GetIDsOfNames(IID_NULL, &methodName, 1, LOCALE_USER_DEFAULT, &dispidMethod);
        if (SUCCEEDED(hr)) {
            DISPPARAMS params = { nullptr, nullptr, 0, 0 };
            VARIANT result;
            VariantInit(&result);
            hr = m_pComAddIn->Invoke(dispidMethod, IID_NULL, LOCALE_USER_DEFAULT, DISPATCH_METHOD, &params, &result, nullptr, nullptr);
            VariantClear(&result);
        }
        if (FAILED(hr)) {
            // Log the error, but don't throw an exception during shutdown
            // TODO: Use a proper logging mechanism
            OutputDebugStringA("Failed to shutdown COM add-in");
        }
    }
}

const char* COMAddInWrapper::GetName() {
    HRESULT hr = S_OK;
    DISPID dispidProperty;
    OLECHAR* propertyName = L"Name";
    hr = m_pComAddIn->GetIDsOfNames(IID_NULL, &propertyName, 1, LOCALE_USER_DEFAULT, &dispidProperty);
    if (SUCCEEDED(hr)) {
        DISPPARAMS params = { nullptr, nullptr, 0, 0 };
        VARIANT result;
        VariantInit(&result);
        hr = m_pComAddIn->Invoke(dispidProperty, IID_NULL, LOCALE_USER_DEFAULT, DISPATCH_PROPERTYGET, &params, &result, nullptr, nullptr);
        if (SUCCEEDED(hr) && result.vt == VT_BSTR) {
            static std::string name;
            name = _com_util::ConvertBSTRToString(result.bstrVal);
            VariantClear(&result);
            return name.c_str();
        }
        VariantClear(&result);
    }
    return "Unknown COM AddIn";
}

const char* COMAddInWrapper::GetVersion() {
    HRESULT hr = S_OK;
    DISPID dispidProperty;
    OLECHAR* propertyName = L"Version";
    hr = m_pComAddIn->GetIDsOfNames(IID_NULL, &propertyName, 1, LOCALE_USER_DEFAULT, &dispidProperty);
    if (SUCCEEDED(hr)) {
        DISPPARAMS params = { nullptr, nullptr, 0, 0 };
        VARIANT result;
        VariantInit(&result);
        hr = m_pComAddIn->Invoke(dispidProperty, IID_NULL, LOCALE_USER_DEFAULT, DISPATCH_PROPERTYGET, &params, &result, nullptr, nullptr);
        if (SUCCEEDED(hr) && result.vt == VT_BSTR) {
            static std::string version;
            version = _com_util::ConvertBSTRToString(result.bstrVal);
            VariantClear(&result);
            return version.c_str();
        }
        VariantClear(&result);
    }
    return "Unknown Version";
}

void COMAddInWrapper::OnCalculate() {
    HRESULT hr = S_OK;
    DISPID dispidMethod;
    OLECHAR* methodName = L"OnCalculate";
    hr = m_pComAddIn->GetIDsOfNames(IID_NULL, &methodName, 1, LOCALE_USER_DEFAULT, &dispidMethod);
    if (SUCCEEDED(hr)) {
        DISPPARAMS params = { nullptr, nullptr, 0, 0 };
        VARIANT result;
        VariantInit(&result);
        hr = m_pComAddIn->Invoke(dispidMethod, IID_NULL, LOCALE_USER_DEFAULT, DISPATCH_METHOD, &params, &result, nullptr, nullptr);
        VariantClear(&result);
    }
    if (FAILED(hr)) {
        // Log the error, but don't throw an exception
        // TODO: Use a proper logging mechanism
        OutputDebugStringA("Failed to invoke OnCalculate method of COM add-in");
    }
}

void COMAddInWrapper::OnCommand(const char* command) {
    if (!command) {
        throw std::invalid_argument("Invalid command pointer");
    }

    HRESULT hr = S_OK;
    DISPID dispidMethod;
    OLECHAR* methodName = L"OnCommand";
    hr = m_pComAddIn->GetIDsOfNames(IID_NULL, &methodName, 1, LOCALE_USER_DEFAULT, &dispidMethod);
    if (SUCCEEDED(hr)) {
        VARIANT vCommand;
        VariantInit(&vCommand);
        vCommand.vt = VT_BSTR;
        vCommand.bstrVal = _com_util::ConvertStringToBSTR(command);

        DISPPARAMS params = { &vCommand, nullptr, 1, 0 };
        VARIANT result;
        VariantInit(&result);
        hr = m_pComAddIn->Invoke(dispidMethod, IID_NULL, LOCALE_USER_DEFAULT, DISPATCH_METHOD, &params, &result, nullptr, nullptr);
        VariantClear(&result);
        VariantClear(&vCommand);
    }
    if (FAILED(hr)) {
        // Log the error, but don't throw an exception
        // TODO: Use a proper logging mechanism
        OutputDebugStringA("Failed to invoke OnCommand method of COM add-in");
    }
}
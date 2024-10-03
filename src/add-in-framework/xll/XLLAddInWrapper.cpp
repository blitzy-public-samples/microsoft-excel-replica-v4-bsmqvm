#include "XLLAddInWrapper.h"
#include <Windows.h>
#include <stdexcept>
#include <string>

XLLAddInWrapper::XLLAddInWrapper(const char* xllPath)
    : m_hModule(nullptr), m_host(nullptr), m_excelInterop(nullptr), m_name(""), m_version("")
{
    if (!LoadXLL(xllPath)) {
        throw std::runtime_error("Failed to load XLL: " + std::string(xllPath));
    }
}

XLLAddInWrapper::~XLLAddInWrapper()
{
    UnloadXLL();
}

void XLLAddInWrapper::Initialize(IAddInHost* host, IExcelInterop* excelInterop)
{
    m_host = host;
    m_excelInterop = excelInterop;

    // Call the XLL's initialization function if available
    if (m_fnXlAutoOpen) {
        m_fnXlAutoOpen();
    }
}

void XLLAddInWrapper::Shutdown()
{
    // Call the XLL's shutdown function if available
    if (m_fnXlAutoClose) {
        m_fnXlAutoClose();
    }

    // Perform any additional cleanup specific to the wrapper
    m_host = nullptr;
    m_excelInterop = nullptr;
}

const char* XLLAddInWrapper::GetName() const
{
    return m_name.c_str();
}

const char* XLLAddInWrapper::GetVersion() const
{
    return m_version.c_str();
}

void XLLAddInWrapper::OnCalculate()
{
    // Call the XLL's calculation function if available
    if (m_fnXlAutoCalculate) {
        m_fnXlAutoCalculate();
    }
}

void XLLAddInWrapper::OnCommand(const char* command)
{
    // Forward the command to the XLL's command handling function if available
    if (m_fnXlAutoCommand) {
        m_fnXlAutoCommand(const_cast<char*>(command));
    }
}

bool XLLAddInWrapper::LoadXLL(const char* xllPath)
{
    m_hModule = LoadLibraryA(xllPath);
    if (!m_hModule) {
        return false;
    }

    // Retrieve necessary function pointers using GetProcAddress
    m_fnXlAutoOpen = reinterpret_cast<XlAutoOpenPtr>(GetProcAddress(m_hModule, "xlAutoOpen"));
    m_fnXlAutoClose = reinterpret_cast<XlAutoClosePtr>(GetProcAddress(m_hModule, "xlAutoClose"));
    m_fnXlAutoCalculate = reinterpret_cast<XlAutoCalculatePtr>(GetProcAddress(m_hModule, "xlAutoCalculate"));
    m_fnXlAutoCommand = reinterpret_cast<XlAutoCommandPtr>(GetProcAddress(m_hModule, "xlAutoCommand"));

    // Retrieve XLL name and version if available
    auto fnXlGetName = reinterpret_cast<XlGetNamePtr>(GetProcAddress(m_hModule, "xlGetName"));
    auto fnXlGetVersion = reinterpret_cast<XlGetVersionPtr>(GetProcAddress(m_hModule, "xlGetVersion"));

    if (fnXlGetName) {
        m_name = fnXlGetName();
    }
    if (fnXlGetVersion) {
        m_version = fnXlGetVersion();
    }

    // Call the XLL's initialization function if available
    if (m_fnXlAutoOpen) {
        m_fnXlAutoOpen();
    }

    return true;
}

void XLLAddInWrapper::UnloadXLL()
{
    if (m_hModule) {
        // Call the XLL's cleanup function if available
        if (m_fnXlAutoClose) {
            m_fnXlAutoClose();
        }

        FreeLibrary(m_hModule);
        m_hModule = nullptr;
    }

    // Reset function pointers
    m_fnXlAutoOpen = nullptr;
    m_fnXlAutoClose = nullptr;
    m_fnXlAutoCalculate = nullptr;
    m_fnXlAutoCommand = nullptr;
}
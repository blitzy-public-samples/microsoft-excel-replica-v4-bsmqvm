#include "OfficeAddInHost.h"
#include "../utils/AddInLogger.h"
#include <Windows.h>
#include <comdef.h>

OfficeAddInHost::OfficeAddInHost(IExcelInterop* pExcelInterop, OfficeAddInManifest* pManifest)
    : m_pExcelInterop(pExcelInterop), m_pManifest(pManifest), m_pLogger(nullptr)
{
    // Initialize the logger
    m_pLogger = new AddInLogger("OfficeAddInHost");
    m_pLogger->LogMessage("OfficeAddInHost constructor called");
}

OfficeAddInHost::~OfficeAddInHost()
{
    m_pLogger->LogMessage("OfficeAddInHost destructor called");
    delete m_pLogger;
    // Note: We don't delete m_pExcelInterop or m_pManifest as they are owned by the caller
}

IExcelInterop* OfficeAddInHost::GetExcelInterop()
{
    return m_pExcelInterop;
}

bool OfficeAddInHost::RegisterFunction(const char* functionName, void* functionPointer)
{
    m_pLogger->LogMessage("Registering function: " + std::string(functionName));
    
    if (!m_pExcelInterop)
    {
        m_pLogger->LogMessage("Error: Excel interop is null");
        return false;
    }

    try
    {
        bool result = m_pExcelInterop->RegisterFunction(functionName, functionPointer);
        if (result)
        {
            m_pLogger->LogMessage("Function registered successfully: " + std::string(functionName));
        }
        else
        {
            m_pLogger->LogMessage("Failed to register function: " + std::string(functionName));
        }
        return result;
    }
    catch (const _com_error& e)
    {
        m_pLogger->LogMessage("COM error while registering function: " + std::string(e.ErrorMessage()));
        return false;
    }
    catch (const std::exception& e)
    {
        m_pLogger->LogMessage("Exception while registering function: " + std::string(e.what()));
        return false;
    }
}

bool OfficeAddInHost::UnregisterFunction(const char* functionName)
{
    m_pLogger->LogMessage("Unregistering function: " + std::string(functionName));
    
    if (!m_pExcelInterop)
    {
        m_pLogger->LogMessage("Error: Excel interop is null");
        return false;
    }

    try
    {
        bool result = m_pExcelInterop->UnregisterFunction(functionName);
        if (result)
        {
            m_pLogger->LogMessage("Function unregistered successfully: " + std::string(functionName));
        }
        else
        {
            m_pLogger->LogMessage("Failed to unregister function: " + std::string(functionName));
        }
        return result;
    }
    catch (const _com_error& e)
    {
        m_pLogger->LogMessage("COM error while unregistering function: " + std::string(e.ErrorMessage()));
        return false;
    }
    catch (const std::exception& e)
    {
        m_pLogger->LogMessage("Exception while unregistering function: " + std::string(e.what()));
        return false;
    }
}

bool OfficeAddInHost::AddMenuItem(const char* menuName, const char* itemName, const char* macroName)
{
    m_pLogger->LogMessage("Adding menu item: " + std::string(menuName) + " -> " + std::string(itemName));
    
    if (!m_pExcelInterop)
    {
        m_pLogger->LogMessage("Error: Excel interop is null");
        return false;
    }

    try
    {
        bool result = m_pExcelInterop->AddMenuItem(menuName, itemName, macroName);
        if (result)
        {
            m_pLogger->LogMessage("Menu item added successfully: " + std::string(menuName) + " -> " + std::string(itemName));
        }
        else
        {
            m_pLogger->LogMessage("Failed to add menu item: " + std::string(menuName) + " -> " + std::string(itemName));
        }
        return result;
    }
    catch (const _com_error& e)
    {
        m_pLogger->LogMessage("COM error while adding menu item: " + std::string(e.ErrorMessage()));
        return false;
    }
    catch (const std::exception& e)
    {
        m_pLogger->LogMessage("Exception while adding menu item: " + std::string(e.what()));
        return false;
    }
}

bool OfficeAddInHost::RemoveMenuItem(const char* menuName, const char* itemName)
{
    m_pLogger->LogMessage("Removing menu item: " + std::string(menuName) + " -> " + std::string(itemName));
    
    if (!m_pExcelInterop)
    {
        m_pLogger->LogMessage("Error: Excel interop is null");
        return false;
    }

    try
    {
        bool result = m_pExcelInterop->RemoveMenuItem(menuName, itemName);
        if (result)
        {
            m_pLogger->LogMessage("Menu item removed successfully: " + std::string(menuName) + " -> " + std::string(itemName));
        }
        else
        {
            m_pLogger->LogMessage("Failed to remove menu item: " + std::string(menuName) + " -> " + std::string(itemName));
        }
        return result;
    }
    catch (const _com_error& e)
    {
        m_pLogger->LogMessage("COM error while removing menu item: " + std::string(e.ErrorMessage()));
        return false;
    }
    catch (const std::exception& e)
    {
        m_pLogger->LogMessage("Exception while removing menu item: " + std::string(e.what()));
        return false;
    }
}

void OfficeAddInHost::LogMessage(const char* message)
{
    if (m_pLogger)
    {
        m_pLogger->LogMessage(message);
    }
}
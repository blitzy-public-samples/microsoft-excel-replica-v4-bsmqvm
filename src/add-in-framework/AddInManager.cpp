#include "AddInManager.h"
#include "utils/AddInLogger.h"
#include "security/AddInSandbox.h"
#include "discovery/AddInDiscovery.h"
#include <algorithm>
#include <stdexcept>

AddInManager::AddInManager(IAddInHost* host, IExcelInterop* excelInterop)
    : m_host(host), m_excelInterop(excelInterop) {
    if (!m_host || !m_excelInterop) {
        throw std::invalid_argument("Host and Excel interop interfaces must be provided");
    }
}

AddInManager::~AddInManager() {
    ShutdownAddIns();
    m_addIns.clear();
    m_host = nullptr;
    m_excelInterop = nullptr;
}

bool AddInManager::LoadAddIn(const std::string& addInPath) {
    try {
        // Use AddInDiscovery to locate and validate the add-in
        auto addInInfo = AddInDiscovery::DiscoverAddIn(addInPath);
        if (!addInInfo) {
            AddInLogger::Log(LogLevel::Error, "Failed to discover add-in at path: " + addInPath);
            return false;
        }

        // Perform security checks using AddInSandbox
        if (!AddInSandbox::ValidateAddIn(addInInfo)) {
            AddInLogger::Log(LogLevel::Error, "Add-in failed security validation: " + addInPath);
            return false;
        }

        // Create an instance of the add-in
        auto addIn = addInInfo->CreateInstance();
        if (!addIn) {
            AddInLogger::Log(LogLevel::Error, "Failed to create add-in instance: " + addInPath);
            return false;
        }

        // Initialize the add-in with m_host and m_excelInterop
        if (!addIn->Initialize(m_host, m_excelInterop)) {
            AddInLogger::Log(LogLevel::Error, "Failed to initialize add-in: " + addInPath);
            return false;
        }

        // Add the initialized add-in to m_addIns
        m_addIns.push_back(std::move(addIn));

        AddInLogger::Log(LogLevel::Info, "Successfully loaded add-in: " + addInPath);
        return true;
    }
    catch (const std::exception& e) {
        AddInLogger::Log(LogLevel::Error, "Exception while loading add-in: " + std::string(e.what()));
        return false;
    }
}

bool AddInManager::UnloadAddIn(const std::string& addInName) {
    auto it = std::find_if(m_addIns.begin(), m_addIns.end(),
        [&addInName](const std::unique_ptr<IAddIn>& addIn) {
            return addIn->GetName() == addInName;
        });

    if (it != m_addIns.end()) {
        // Call the add-in's Shutdown method
        (*it)->Shutdown();

        // Remove the add-in from m_addIns
        m_addIns.erase(it);

        AddInLogger::Log(LogLevel::Info, "Successfully unloaded add-in: " + addInName);
        return true;
    }

    AddInLogger::Log(LogLevel::Warning, "Add-in not found for unloading: " + addInName);
    return false;
}

void AddInManager::InitializeAddIns() {
    for (const auto& addIn : m_addIns) {
        try {
            if (!addIn->Initialize(m_host, m_excelInterop)) {
                AddInLogger::Log(LogLevel::Error, "Failed to initialize add-in: " + addIn->GetName());
            }
            else {
                AddInLogger::Log(LogLevel::Info, "Initialized add-in: " + addIn->GetName());
            }
        }
        catch (const std::exception& e) {
            AddInLogger::Log(LogLevel::Error, "Exception during add-in initialization: " + std::string(e.what()));
        }
    }
}

void AddInManager::ShutdownAddIns() {
    for (const auto& addIn : m_addIns) {
        try {
            addIn->Shutdown();
            AddInLogger::Log(LogLevel::Info, "Shut down add-in: " + addIn->GetName());
        }
        catch (const std::exception& e) {
            AddInLogger::Log(LogLevel::Error, "Exception during add-in shutdown: " + std::string(e.what()));
        }
    }
    m_addIns.clear();
}

void AddInManager::OnCalculate() {
    for (const auto& addIn : m_addIns) {
        try {
            addIn->OnCalculate();
        }
        catch (const std::exception& e) {
            AddInLogger::Log(LogLevel::Error, "Exception during add-in calculation: " + std::string(e.what()));
        }
    }
}

void AddInManager::ExecuteCommand(const std::string& command) {
    for (const auto& addIn : m_addIns) {
        try {
            addIn->OnCommand(command);
            AddInLogger::Log(LogLevel::Info, "Executed command '" + command + "' for add-in: " + addIn->GetName());
        }
        catch (const std::exception& e) {
            AddInLogger::Log(LogLevel::Error, "Exception during command execution: " + std::string(e.what()));
        }
    }
}
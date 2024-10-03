#ifndef ADD_IN_MANAGER_H
#define ADD_IN_MANAGER_H

#include <vector>
#include <string>
#include "interfaces/IAddIn.h"
#include "interfaces/IAddInHost.h"
#include "interfaces/IExcelInterop.h"

/**
 * @class AddInManager
 * @brief Manages the lifecycle and interactions of Excel add-ins within the add-in framework.
 * 
 * The AddInManager class is responsible for managing the lifecycle of Excel add-ins,
 * including their initialization, registration, and interaction with the Excel application.
 */
class AddInManager {
public:
    /**
     * @brief Constructor for the AddInManager class.
     * @param host Pointer to the IAddInHost interface.
     * @param excelInterop Pointer to the IExcelInterop interface.
     */
    AddInManager(IAddInHost* host, IExcelInterop* excelInterop);

    /**
     * @brief Destructor for the AddInManager class.
     */
    ~AddInManager();

    /**
     * @brief Loads an add-in from the specified path.
     * @param addInPath The path of the add-in to load.
     * @return True if the add-in was successfully loaded, false otherwise.
     */
    bool LoadAddIn(const std::string& addInPath);

    /**
     * @brief Unloads the specified add-in.
     * @param addInName The name of the add-in to unload.
     * @return True if the add-in was successfully unloaded, false otherwise.
     */
    bool UnloadAddIn(const std::string& addInName);

    /**
     * @brief Initializes all loaded add-ins.
     */
    void InitializeAddIns();

    /**
     * @brief Shuts down all loaded add-ins.
     */
    void ShutdownAddIns();

    /**
     * @brief Notifies all add-ins that Excel is performing a calculation.
     */
    void OnCalculate();

    /**
     * @brief Executes a command on all loaded add-ins.
     * @param command The command to execute.
     */
    void ExecuteCommand(const std::string& command);

private:
    std::vector<IAddIn*> m_addIns;  ///< Vector of loaded add-ins
    IAddInHost* m_host;             ///< Pointer to the add-in host
    IExcelInterop* m_excelInterop;  ///< Pointer to the Excel interop interface
};

#endif // ADD_IN_MANAGER_H
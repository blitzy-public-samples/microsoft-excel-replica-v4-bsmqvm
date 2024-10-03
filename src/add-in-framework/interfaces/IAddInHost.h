#pragma once

#include <memory>

// Forward declaration
class IExcelInterop;

/**
 * @interface IAddInHost
 * @brief This interface defines the contract for the add-in host environment, specifying methods
 *        that allow add-ins to interact with Excel and the add-in framework.
 */
class IAddInHost {
public:
    /**
     * @brief Virtual destructor to ensure proper cleanup of derived classes.
     */
    virtual ~IAddInHost() = default;

    /**
     * @brief Returns a pointer to the Excel interoperability interface.
     * @return std::shared_ptr<IExcelInterop> Pointer to the Excel interoperability interface
     */
    virtual std::shared_ptr<IExcelInterop> GetExcelInterop() = 0;

    /**
     * @brief Registers a custom function with Excel.
     * @param functionName The name of the function to register
     * @param functionPointer Pointer to the function to be registered
     * @return bool True if registration was successful, false otherwise
     */
    virtual bool RegisterFunction(const char* functionName, void* functionPointer) = 0;

    /**
     * @brief Unregisters a previously registered custom function.
     * @param functionName The name of the function to unregister
     * @return bool True if unregistration was successful, false otherwise
     */
    virtual bool UnregisterFunction(const char* functionName) = 0;

    /**
     * @brief Adds a custom menu item to Excel's user interface.
     * @param menuName The name of the menu to add the item to
     * @param itemName The name of the menu item to add
     * @param macroName The name of the macro to associate with the menu item
     * @return bool True if the menu item was added successfully, false otherwise
     */
    virtual bool AddMenuItem(const char* menuName, const char* itemName, const char* macroName) = 0;

    /**
     * @brief Removes a custom menu item from Excel's user interface.
     * @param menuName The name of the menu containing the item to remove
     * @param itemName The name of the menu item to remove
     * @return bool True if the menu item was removed successfully, false otherwise
     */
    virtual bool RemoveMenuItem(const char* menuName, const char* itemName) = 0;

    /**
     * @brief Logs a message to the add-in framework's logging system.
     * @param message The message to log
     */
    virtual void LogMessage(const char* message) = 0;
};
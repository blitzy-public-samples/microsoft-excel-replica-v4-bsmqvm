#ifndef IADD_IN_H
#define IADD_IN_H

#include <cstddef>

// Forward declarations
class IAddInHost;
class IExcelInterop;

/**
 * @interface IAddIn
 * @brief This interface defines the contract for Excel add-ins, specifying the methods that must be implemented
 *        by any add-in to integrate with the Excel application.
 */
class IAddIn {
public:
    /**
     * @brief Virtual destructor to ensure proper cleanup of derived classes.
     */
    virtual ~IAddIn() = default;

    /**
     * @brief Initializes the add-in with the host environment and Excel interoperability interface.
     * @param host Pointer to the IAddInHost interface.
     * @param excelInterop Pointer to the IExcelInterop interface.
     */
    virtual void Initialize(IAddInHost* host, IExcelInterop* excelInterop) = 0;

    /**
     * @brief Performs cleanup operations when the add-in is being unloaded or Excel is closing.
     */
    virtual void Shutdown() = 0;

    /**
     * @brief Returns the name of the add-in.
     * @return The name of the add-in as a C-style string.
     */
    virtual const char* GetName() const = 0;

    /**
     * @brief Returns the version of the add-in.
     * @return The version of the add-in as a C-style string.
     */
    virtual const char* GetVersion() const = 0;

    /**
     * @brief Called when Excel performs a calculation, allowing the add-in to participate in the calculation process.
     */
    virtual void OnCalculate() = 0;

    /**
     * @brief Handles custom commands sent to the add-in.
     * @param command The command string to be processed.
     */
    virtual void OnCommand(const char* command) = 0;
};

#endif // IADD_IN_H
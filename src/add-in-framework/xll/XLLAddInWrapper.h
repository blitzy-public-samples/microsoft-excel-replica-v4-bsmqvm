#pragma once

#include <Windows.h>
#include "../interfaces/IAddIn.h"
#include "../interfaces/IAddInHost.h"
#include "../interfaces/IExcelInterop.h"

namespace ExcelAddInFramework {

/**
 * @class XLLAddInWrapper
 * @brief This class implements the IAddIn interface and provides a wrapper for XLL add-ins,
 *        allowing them to integrate with the Excel add-in framework.
 */
class XLLAddInWrapper : public IAddIn {
public:
    /**
     * @brief Constructs an XLLAddInWrapper object and loads the XLL module.
     * @param xllPath The path to the XLL file.
     */
    explicit XLLAddInWrapper(const char* xllPath);

    /**
     * @brief Destructor that unloads the XLL module and performs cleanup.
     */
    ~XLLAddInWrapper() override;

    /**
     * @brief Initializes the XLL add-in with the host environment and Excel interoperability interface.
     * @param host Pointer to the IAddInHost interface.
     * @param excelInterop Pointer to the IExcelInterop interface.
     */
    void Initialize(IAddInHost* host, IExcelInterop* excelInterop) override;

    /**
     * @brief Performs cleanup operations when the XLL add-in is being unloaded or Excel is closing.
     */
    void Shutdown() override;

    /**
     * @brief Returns the name of the XLL add-in.
     * @return The name of the XLL add-in.
     */
    const char* GetName() const override;

    /**
     * @brief Returns the version of the XLL add-in.
     * @return The version of the XLL add-in.
     */
    const char* GetVersion() const override;

    /**
     * @brief Called when Excel performs a calculation, allowing the XLL add-in to participate in the calculation process.
     */
    void OnCalculate() override;

    /**
     * @brief Handles custom commands sent to the XLL add-in.
     * @param command The command string to be processed.
     */
    void OnCommand(const char* command) override;

private:
    /**
     * @brief Loads the XLL module and initializes it.
     * @param xllPath The path to the XLL file.
     * @return True if the XLL was loaded successfully, false otherwise.
     */
    bool LoadXLL(const char* xllPath);

    /**
     * @brief Unloads the XLL module and performs cleanup.
     */
    void UnloadXLL();

    HMODULE m_hModule;        ///< Handle to the loaded XLL module
    IAddInHost* m_pHost;      ///< Pointer to the add-in host interface
    IExcelInterop* m_pExcelInterop; ///< Pointer to the Excel interoperability interface
};

} // namespace ExcelAddInFramework
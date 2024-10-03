package com.microsoft.excel.mobile.shared

import kotlinx.coroutines.flow.Flow

/**
 * An interface defining the API for interacting with Excel workbooks, worksheets, and cells on the Android mobile platform
 */
interface ExcelMobileAPI {

    /**
     * Retrieves a list of available workbooks for the authenticated user
     * @return Flow of List<Workbook> representing the available workbooks
     */
    suspend fun getWorkbooks(): Flow<List<Workbook>>

    /**
     * Creates a new workbook with the given name
     * @param name The name of the new workbook
     * @return The newly created Workbook
     */
    suspend fun createWorkbook(name: String): Workbook

    /**
     * Retrieves a specific workbook by its ID
     * @param id The ID of the workbook to retrieve
     * @return The retrieved Workbook
     */
    suspend fun getWorkbook(id: String): Workbook

    /**
     * Saves changes made to a workbook
     * @param workbook The Workbook to save
     */
    suspend fun saveWorkbook(workbook: Workbook)

    /**
     * Retrieves a list of worksheets for a given workbook
     * @param workbookId The ID of the workbook
     * @return Flow of List<Worksheet> representing the worksheets in the workbook
     */
    suspend fun getWorksheets(workbookId: String): Flow<List<Worksheet>>

    /**
     * Creates a new worksheet in the specified workbook
     * @param workbookId The ID of the workbook
     * @param name The name of the new worksheet
     * @return The newly created Worksheet
     */
    suspend fun createWorksheet(workbookId: String, name: String): Worksheet

    /**
     * Retrieves the value and properties of a specific cell
     * @param workbookId The ID of the workbook
     * @param worksheetId The ID of the worksheet
     * @param cellId The ID of the cell
     * @return The retrieved Cell
     */
    suspend fun getCell(workbookId: String, worksheetId: String, cellId: String): Cell

    /**
     * Updates the value of a specific cell
     * @param workbookId The ID of the workbook
     * @param worksheetId The ID of the worksheet
     * @param cellId The ID of the cell
     * @param value The new value for the cell
     */
    suspend fun updateCell(workbookId: String, worksheetId: String, cellId: String, value: Any)

    /**
     * Calculates the result of a given formula
     * @param workbookId The ID of the workbook
     * @param worksheetId The ID of the worksheet
     * @param formula The formula to calculate
     * @return The result of the formula calculation
     */
    suspend fun calculateFormula(workbookId: String, worksheetId: String, formula: String): Any
}

// Data classes for the API
data class Workbook(val id: String, val name: String)
data class Worksheet(val id: String, val name: String)
data class Cell(val id: String, val value: Any)
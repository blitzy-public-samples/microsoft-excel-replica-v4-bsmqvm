package com.microsoft.excel.mobile.shared

import kotlinx.coroutines.Deferred

/**
 * An interface defining the networking protocol for the Excel mobile application on Android
 */
interface NetworkingProtocol {
    /**
     * The base URL for API requests
     */
    val baseURL: String

    /**
     * Fetches a workbook from the server by its ID
     *
     * @param id The ID of the workbook to fetch
     * @return A Deferred object containing the fetched Workbook
     */
    suspend fun fetchWorkbook(id: String): Deferred<Workbook>

    /**
     * Saves a workbook to the server
     *
     * @param workbook The Workbook object to save
     */
    suspend fun saveWorkbook(workbook: Workbook)

    /**
     * Fetches a specific worksheet from a workbook
     *
     * @param workbookId The ID of the workbook containing the worksheet
     * @param worksheetId The ID of the worksheet to fetch
     * @return A Deferred object containing the fetched Worksheet
     */
    suspend fun fetchWorksheet(workbookId: String, worksheetId: String): Deferred<Worksheet>

    /**
     * Updates the value of a specific cell
     *
     * @param workbookId The ID of the workbook containing the cell
     * @param worksheetId The ID of the worksheet containing the cell
     * @param cellId The ID of the cell to update
     * @param value The new value for the cell
     */
    suspend fun updateCell(workbookId: String, worksheetId: String, cellId: String, value: Any)

    /**
     * Authenticates the user and returns an authentication token
     *
     * @param username The user's username
     * @param password The user's password
     * @return A Deferred object containing the AuthToken
     */
    suspend fun authenticate(username: String, password: String): Deferred<AuthToken>
}

/**
 * Data class representing a workbook
 */
data class Workbook(
    val id: String,
    val name: String,
    val worksheets: List<Worksheet>
)

/**
 * Data class representing a worksheet
 */
data class Worksheet(
    val id: String,
    val name: String,
    val cells: Map<String, Any>
)

/**
 * Data class representing an authentication token
 */
data class AuthToken(
    val token: String,
    val expiresAt: Long
)
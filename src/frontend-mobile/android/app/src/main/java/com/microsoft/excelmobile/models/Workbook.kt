package com.microsoft.excelmobile.models

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

@Parcelize
data class Workbook(
    val id: String,
    val name: String,
    val worksheets: MutableList<Worksheet>,
    var activeWorksheetIndex: Int
) : Parcelable {

    /**
     * Adds a new worksheet to the workbook.
     *
     * @param worksheet The worksheet to be added.
     */
    fun addWorksheet(worksheet: Worksheet) {
        worksheets.add(worksheet)
    }

    /**
     * Removes a worksheet from the workbook by its ID.
     *
     * @param worksheetId The ID of the worksheet to be removed.
     * @return True if the worksheet was removed, false otherwise.
     */
    fun removeWorksheet(worksheetId: String): Boolean {
        return worksheets.removeIf { it.id == worksheetId }
    }

    /**
     * Retrieves a worksheet by its ID.
     *
     * @param worksheetId The ID of the worksheet to retrieve.
     * @return The worksheet with the given ID, or null if not found.
     */
    fun getWorksheetById(worksheetId: String): Worksheet? {
        return worksheets.find { it.id == worksheetId }
    }

    /**
     * Retrieves the currently active worksheet.
     *
     * @return The active worksheet, or null if the index is invalid.
     */
    fun getActiveWorksheet(): Worksheet? {
        return worksheets.getOrNull(activeWorksheetIndex)
    }

    /**
     * Sets the active worksheet by index.
     *
     * @param index The index of the worksheet to set as active.
     * @throws IndexOutOfBoundsException if the index is out of bounds.
     */
    fun setActiveWorksheet(index: Int) {
        if (index in worksheets.indices) {
            activeWorksheetIndex = index
        } else {
            throw IndexOutOfBoundsException("Invalid worksheet index: $index")
        }
    }
}

// Assuming the Worksheet class has at least an 'id' property
data class Worksheet(
    val id: String,
    // Add other properties as needed
)
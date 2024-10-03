package com.microsoft.excelmobile.models

import android.os.Parcelable
import kotlinx.parcelize.Parcelize

/**
 * Represents a worksheet in an Excel workbook for the mobile application.
 *
 * @property id The unique identifier of the worksheet.
 * @property name The name of the worksheet.
 * @property cells A mutable map of cell references to Cell objects.
 * @property isVisible Indicates whether the worksheet is visible.
 * @property tabColor The color of the worksheet tab, represented as an Int (null if not set).
 */
@Parcelize
data class Worksheet(
    val id: String,
    val name: String,
    val cells: MutableMap<String, Cell> = mutableMapOf(),
    val isVisible: Boolean = true,
    val tabColor: Int? = null
) : Parcelable {

    /**
     * Retrieves a cell by its Excel-style reference (e.g., A1, B2).
     *
     * @param cellReference The Excel-style reference of the cell.
     * @return The cell at the specified reference, or null if not found.
     */
    fun getCell(cellReference: String): Cell? {
        return cells[cellReference]
    }

    /**
     * Sets a cell at the specified reference.
     *
     * @param cellReference The Excel-style reference of the cell.
     * @param cell The Cell object to be set at the specified reference.
     */
    fun setCell(cellReference: String, cell: Cell) {
        cells[cellReference] = cell
    }

    /**
     * Retrieves the value of a cell by its reference.
     *
     * @param cellReference The Excel-style reference of the cell.
     * @return The value of the cell, or null if the cell doesn't exist.
     */
    fun getCellValue(cellReference: String): String? {
        return getCell(cellReference)?.value
    }

    /**
     * Sets the value of a cell at the specified reference.
     *
     * @param cellReference The Excel-style reference of the cell.
     * @param value The value to be set in the cell.
     */
    fun setCellValue(cellReference: String, value: String) {
        val cell = getCell(cellReference) ?: Cell(cellReference, value)
        cell.value = value
        setCell(cellReference, cell)
    }
}

/**
 * Represents a cell in a worksheet.
 *
 * @property reference The Excel-style reference of the cell (e.g., A1, B2).
 * @property value The value of the cell.
 */
@Parcelize
data class Cell(
    val reference: String,
    var value: String
) : Parcelable
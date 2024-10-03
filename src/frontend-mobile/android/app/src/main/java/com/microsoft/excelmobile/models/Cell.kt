package com.microsoft.excelmobile.models

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import com.microsoft.excelmobile.utils.Extensions.toCellReference

/**
 * Represents a cell in an Excel worksheet for the mobile application.
 *
 * @property row The row index of the cell.
 * @property column The column index of the cell.
 * @property value The value contained in the cell.
 * @property formula The formula of the cell, if any.
 * @property format The formatting options for the cell.
 * @property isLocked Indicates whether the cell is locked for editing.
 */
@Parcelize
data class Cell(
    val row: Int,
    val column: Int,
    val value: String,
    val formula: String? = null,
    val format: CellFormat,
    val isLocked: Boolean
) : Parcelable {

    /**
     * Returns the Excel-style cell reference (e.g., A1, B2) for this cell.
     *
     * @return Excel-style cell reference as a String.
     */
    fun getCellReference(): String {
        return toCellReference(row, column)
    }
}

/**
 * Represents the formatting options for a cell.
 *
 * @property textColor The color of the text in the cell.
 * @property backgroundColor The background color of the cell.
 * @property isBold Indicates whether the text is bold.
 * @property isItalic Indicates whether the text is italic.
 * @property isUnderlined Indicates whether the text is underlined.
 * @property horizontalAlignment The horizontal alignment of the cell content.
 * @property verticalAlignment The vertical alignment of the cell content.
 * @property numberFormat The number format string for the cell.
 */
@Parcelize
data class CellFormat(
    val textColor: Int,
    val backgroundColor: Int,
    val isBold: Boolean,
    val isItalic: Boolean,
    val isUnderlined: Boolean,
    val horizontalAlignment: HorizontalAlignment,
    val verticalAlignment: VerticalAlignment,
    val numberFormat: String
) : Parcelable

/**
 * Represents the possible horizontal alignment options for cell content.
 */
enum class HorizontalAlignment {
    LEFT, CENTER, RIGHT
}

/**
 * Represents the possible vertical alignment options for cell content.
 */
enum class VerticalAlignment {
    TOP, MIDDLE, BOTTOM
}
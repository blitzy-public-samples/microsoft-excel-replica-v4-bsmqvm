package com.microsoft.excelmobile.utils

import android.graphics.Color
import android.text.SpannableString
import android.text.style.ForegroundColorSpan
import android.view.View
import com.microsoft.excelmobile.models.Cell
import com.microsoft.excelmobile.models.Worksheet
import com.microsoft.excelmobile.models.Workbook
import java.text.SimpleDateFormat
import java.util.Date

/**
 * This file contains Kotlin extension functions to enhance and simplify functionality
 * for the Excel Mobile Android application.
 */

/**
 * Converts an integer color value to its hexadecimal string representation.
 */
fun Int.toHexString(): String {
    return String.format("#%06X", 0xFFFFFF and this)
}

/**
 * Converts a pair of integers representing row and column indices to an Excel-style cell reference (e.g., A1, B2).
 */
fun Pair<Int, Int>.toCellReference(): String {
    val (row, col) = this
    val columnName = StringBuilder()
    var tempCol = col
    while (tempCol > 0) {
        tempCol--
        columnName.insert(0, ('A' + tempCol % 26).toChar())
        tempCol /= 26
    }
    return "${columnName}${row + 1}"
}

/**
 * Converts an Excel-style cell reference to a pair of integers representing row and column indices.
 */
fun String.fromCellReference(): Pair<Int, Int> {
    val columnPart = this.takeWhile { it.isLetter() }
    val rowPart = this.dropWhile { it.isLetter() }
    
    var column = 0
    for (char in columnPart) {
        column = column * 26 + (char.toUpperCase() - 'A' + 1)
    }
    
    val row = rowPart.toIntOrNull() ?: throw IllegalArgumentException("Invalid cell reference")
    return Pair(row - 1, column - 1)
}

/**
 * Formats a Date object as a string using the specified pattern.
 */
fun Date.formatAsDate(pattern: String): String {
    val dateFormat = SimpleDateFormat(pattern)
    return dateFormat.format(this)
}

/**
 * Creates a SpannableString with the specified text color.
 */
fun String.coloredText(color: Int): SpannableString {
    val spannableString = SpannableString(this)
    spannableString.setSpan(ForegroundColorSpan(color), 0, this.length, 0)
    return spannableString
}

/**
 * Sets the visibility of a View based on the provided boolean value.
 */
fun View.setVisible(visible: Boolean) {
    visibility = if (visible) View.VISIBLE else View.GONE
}

/**
 * Extension function for Cell to get its formatted value as a string.
 * This is a placeholder implementation and should be updated based on the actual Cell class structure.
 */
fun Cell.getFormattedValue(): String {
    // Implement based on the actual Cell class structure
    return this.toString()
}

/**
 * Extension function for Worksheet to get a cell by its Excel-style reference.
 * This is a placeholder implementation and should be updated based on the actual Worksheet class structure.
 */
fun Worksheet.getCellByReference(reference: String): Cell? {
    val (row, col) = reference.fromCellReference()
    // Implement based on the actual Worksheet class structure
    return null
}

/**
 * Extension function for Workbook to get a worksheet by its name.
 * This is a placeholder implementation and should be updated based on the actual Workbook class structure.
 */
fun Workbook.getWorksheetByName(name: String): Worksheet? {
    // Implement based on the actual Workbook class structure
    return null
}
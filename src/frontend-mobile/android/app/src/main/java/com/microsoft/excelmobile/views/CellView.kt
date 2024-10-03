package com.microsoft.excelmobile.views

import android.content.Context
import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.Rect
import android.util.AttributeSet
import android.view.MotionEvent
import android.view.View
import com.microsoft.excelmobile.models.Cell
import com.microsoft.excelmobile.utils.Extensions

/**
 * CellView is a custom view component for rendering and handling interactions
 * with individual cells in a worksheet for the Excel Mobile Android application.
 */
class CellView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {

    // Properties
    var cell: Cell? = null
        set(value) {
            field = value
            invalidate()
        }

    var isSelected: Boolean = false
        set(value) {
            field = value
            invalidate()
        }

    private val paint: Paint = Paint()
    private val rect: Rect = Rect()

    init {
        // Initialize paint settings
        paint.isAntiAlias = true
    }

    /**
     * Draws the cell content, including background, borders, and text,
     * based on the cell's formatting and state.
     */
    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)

        cell?.let { cell ->
            // Draw background
            paint.color = if (isSelected) Extensions.getSelectedCellColor() else cell.backgroundColor
            canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), paint)

            // Draw borders
            paint.color = cell.borderColor
            paint.strokeWidth = cell.borderWidth
            canvas.drawRect(0f, 0f, width.toFloat(), height.toFloat(), paint)

            // Draw cell content
            paint.color = cell.textColor
            paint.textSize = cell.fontSize
            val text = cell.value.toString()
            paint.getTextBounds(text, 0, text.length, rect)
            val x = (width - rect.width()) / 2f
            val y = (height + rect.height()) / 2f
            canvas.drawText(text, x, y, paint)

            // Apply conditional formatting if applicable
            applyConditionalFormatting(canvas, cell)
        }
    }

    /**
     * Measures the view and its content to determine the measured width and height.
     */
    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        val desiredWidth = suggestedMinimumWidth + paddingLeft + paddingRight
        val desiredHeight = suggestedMinimumHeight + paddingTop + paddingBottom

        setMeasuredDimension(
            resolveSize(desiredWidth, widthMeasureSpec),
            resolveSize(desiredHeight, heightMeasureSpec)
        )
    }

    /**
     * Handles touch events on the cell, such as selection and editing.
     */
    override fun onTouchEvent(event: MotionEvent): Boolean {
        when (event.action) {
            MotionEvent.ACTION_DOWN -> {
                isSelected = !isSelected
                performClick()
                return true
            }
            MotionEvent.ACTION_UP -> {
                if (event.eventTime - event.downTime < ViewConfiguration.getTapTimeout()) {
                    // Handle single tap (e.g., start editing)
                    startCellEditing()
                }
                return true
            }
        }
        return super.onTouchEvent(event)
    }

    /**
     * Updates the cell data and triggers a redraw of the view.
     */
    fun updateCell(newCell: Cell) {
        cell = newCell
        requestLayout()
        invalidate()
    }

    private fun applyConditionalFormatting(canvas: Canvas, cell: Cell) {
        // Implement conditional formatting logic here
        // This is a placeholder for the actual implementation
    }

    private fun startCellEditing() {
        // Implement cell editing logic here
        // This is a placeholder for the actual implementation
    }

    // Ensure the view is focusable and can receive click events
    override fun isFocusable(): Boolean = true

    override fun performClick(): Boolean {
        if (super.performClick()) return true
        // Handle the click event if not already handled by the parent
        // This is important for accessibility
        return true
    }
}
package com.microsoft.excelmobile.views

import android.content.Context
import android.text.Editable
import android.text.TextWatcher
import android.util.AttributeSet
import android.widget.EditText
import android.widget.TextView
import androidx.constraintlayout.widget.ConstraintLayout
import com.microsoft.excelmobile.R
import com.microsoft.excelmobile.models.Cell

/**
 * FormulaBarView is a custom view component for the Excel Mobile Android application,
 * responsible for displaying and editing cell formulas and values.
 */
class FormulaBarView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : ConstraintLayout(context, attrs, defStyleAttr) {

    private lateinit var cellReferenceTextView: TextView
    private lateinit var formulaEditText: EditText
    private var currentCell: Cell? = null
    private var onFormulaChangedListener: ((String) -> Unit)? = null

    init {
        initializeView()
    }

    private fun initializeView() {
        // Inflate the layout
        inflate(context, R.layout.view_formula_bar, this)

        // Initialize UI components
        cellReferenceTextView = findViewById(R.id.cellReferenceTextView)
        formulaEditText = findViewById(R.id.formulaEditText)

        // Set up TextWatcher for formulaEditText
        formulaEditText.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
            override fun afterTextChanged(s: Editable?) {
                onFormulaChangedListener?.invoke(s.toString())
            }
        })
    }

    /**
     * Updates the FormulaBarView with the data from the given cell.
     *
     * @param cell The cell to display in the formula bar
     */
    fun setCell(cell: Cell) {
        currentCell = cell
        cellReferenceTextView.text = cell.reference
        formulaEditText.setText(cell.formula ?: cell.value)
    }

    /**
     * Retrieves the current formula or value from the formula bar.
     *
     * @return The current formula or value as a String
     */
    fun getFormula(): String {
        return formulaEditText.text.toString()
    }

    /**
     * Sets a listener to be notified when the formula is changed by the user.
     *
     * @param listener The callback function to be invoked when the formula changes
     */
    fun setOnFormulaChangedListener(listener: (String) -> Unit) {
        onFormulaChangedListener = listener
    }
}
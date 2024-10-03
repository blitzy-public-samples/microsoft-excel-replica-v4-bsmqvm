package com.microsoft.excelmobile

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.Observer
import androidx.lifecycle.ViewModelProvider
import com.microsoft.excelmobile.databinding.FragmentCellEditorBinding
import com.microsoft.excelmobile.models.Cell
import com.microsoft.excelmobile.services.APIService
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class CellEditorFragment : Fragment() {

    private lateinit var viewModel: CellEditorViewModel
    private lateinit var binding: FragmentCellEditorBinding
    private lateinit var cell: Cell

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentCellEditorBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        val apiService = APIService() // Assuming APIService is implemented
        viewModel = ViewModelProvider(this, CellEditorViewModelFactory(apiService))
            .get(CellEditorViewModel::class.java)

        setupUI()
        observeData()
    }

    private fun setupUI() {
        binding.apply {
            saveButton.setOnClickListener {
                val newValue = cellValueInput.text.toString()
                updateCell(newValue)
            }
            cancelButton.setOnClickListener {
                // Handle cancel action (e.g., dismiss the fragment)
            }
        }
    }

    private fun observeData() {
        viewModel.cellData.observe(viewLifecycleOwner, Observer { cell ->
            this.cell = cell
            binding.cellValueInput.setText(cell.value)
            binding.cellFormulaInput.setText(cell.formula)
        })

        viewModel.isLoading.observe(viewLifecycleOwner, Observer { isLoading ->
            binding.progressBar.visibility = if (isLoading) View.VISIBLE else View.GONE
        })

        viewModel.error.observe(viewLifecycleOwner, Observer { error ->
            // Handle error (e.g., show a toast or snackbar)
        })
    }

    private fun updateCell(newValue: String) {
        CoroutineScope(Dispatchers.Main).launch {
            viewModel.updateCell(cell.workbookId, cell.worksheetId, cell.id, newValue)
        }
    }
}

class CellEditorViewModel(private val apiService: APIService) : androidx.lifecycle.ViewModel() {

    private val _cellData = androidx.lifecycle.MutableLiveData<Cell>()
    val cellData: androidx.lifecycle.LiveData<Cell> = _cellData

    private val _isLoading = androidx.lifecycle.MutableLiveData<Boolean>()
    val isLoading: androidx.lifecycle.LiveData<Boolean> = _isLoading

    private val _error = androidx.lifecycle.MutableLiveData<String>()
    val error: androidx.lifecycle.LiveData<String> = _error

    fun loadCell(workbookId: String, worksheetId: String, cellId: String) {
        _isLoading.value = true
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val cell = apiService.getCell(workbookId, worksheetId, cellId)
                _cellData.postValue(cell)
            } catch (e: Exception) {
                _error.postValue(e.message)
            } finally {
                _isLoading.postValue(false)
            }
        }
    }

    fun updateCell(workbookId: String, worksheetId: String, cellId: String, newValue: String) {
        _isLoading.value = true
        CoroutineScope(Dispatchers.IO).launch {
            try {
                val updatedCell = apiService.updateCell(workbookId, worksheetId, cellId, newValue)
                _cellData.postValue(updatedCell)
            } catch (e: Exception) {
                _error.postValue(e.message)
            } finally {
                _isLoading.postValue(false)
            }
        }
    }
}

class CellEditorViewModelFactory(private val apiService: APIService) : ViewModelProvider.Factory {
    override fun <T : androidx.lifecycle.ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(CellEditorViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return CellEditorViewModel(apiService) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
package com.microsoft.excelmobile

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.lifecycle.ViewModelProvider
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.microsoft.excelmobile.models.Cell
import com.microsoft.excelmobile.models.Worksheet
import com.microsoft.excelmobile.services.APIService
import com.microsoft.excelmobile.views.CellView

/**
 * WorksheetFragment is responsible for displaying and managing a single worksheet
 * within the Excel Mobile Android application.
 */
class WorksheetFragment : Fragment() {

    private lateinit var viewModel: WorksheetViewModel
    private lateinit var binding: FragmentWorksheetBinding
    private lateinit var cellAdapter: CellAdapter
    private lateinit var worksheet: Worksheet

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        binding = FragmentWorksheetBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupRecyclerView()
        initViewModel()
        observeWorksheetData()
    }

    private fun setupRecyclerView() {
        val gridLayoutManager = GridLayoutManager(context, COLUMN_COUNT)
        cellAdapter = CellAdapter(::onCellClicked)
        binding.worksheetRecyclerView.apply {
            layoutManager = gridLayoutManager
            adapter = cellAdapter
        }
    }

    private fun initViewModel() {
        val apiService = APIService() // Assume this is how we initialize the APIService
        val viewModelFactory = WorksheetViewModelFactory(apiService)
        viewModel = ViewModelProvider(this, viewModelFactory).get(WorksheetViewModel::class.java)
    }

    private fun observeWorksheetData() {
        viewModel.worksheetLiveData.observe(viewLifecycleOwner) { newWorksheet ->
            worksheet = newWorksheet
            cellAdapter.submitList(worksheet.cells)
        }
    }

    private fun onCellClicked(cell: Cell) {
        val cellEditorFragment = CellEditorFragment.newInstance(cell)
        cellEditorFragment.show(parentFragmentManager, "cell_editor")
    }

    fun updateCell(cell: Cell) {
        worksheet.setCell(cell)
        cellAdapter.notifyItemChanged(cell.position)
        viewModel.updateCellInBackend(cell)
    }

    companion object {
        private const val COLUMN_COUNT = 10 // Assuming a default of 10 columns

        fun newInstance(worksheetId: String): WorksheetFragment {
            return WorksheetFragment().apply {
                arguments = Bundle().apply {
                    putString(ARG_WORKSHEET_ID, worksheetId)
                }
            }
        }
    }
}

/**
 * CellAdapter is responsible for binding cell data to views in the RecyclerView.
 */
class CellAdapter(private val onCellClick: (Cell) -> Unit) :
    RecyclerView.Adapter<CellAdapter.CellViewHolder>() {

    private var cells: List<Cell> = emptyList()

    fun submitList(newCells: List<Cell>) {
        cells = newCells
        notifyDataSetChanged()
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): CellViewHolder {
        val cellView = CellView(parent.context)
        return CellViewHolder(cellView)
    }

    override fun onBindViewHolder(holder: CellViewHolder, position: Int) {
        holder.bind(cells[position])
    }

    override fun getItemCount(): Int = cells.size

    inner class CellViewHolder(private val cellView: CellView) : RecyclerView.ViewHolder(cellView) {
        fun bind(cell: Cell) {
            cellView.setCell(cell)
            cellView.setOnClickListener { onCellClick(cell) }
        }
    }
}

/**
 * WorksheetViewModel is responsible for managing the data and business logic
 * for the WorksheetFragment.
 */
class WorksheetViewModel(private val apiService: APIService) : ViewModel() {

    private val _worksheetLiveData = MutableLiveData<Worksheet>()
    val worksheetLiveData: LiveData<Worksheet> = _worksheetLiveData

    fun loadWorksheet(worksheetId: String) {
        viewModelScope.launch {
            try {
                val worksheet = apiService.getWorksheet(worksheetId)
                _worksheetLiveData.value = worksheet
            } catch (e: Exception) {
                // Handle error (e.g., show error message)
            }
        }
    }

    fun updateCellInBackend(cell: Cell) {
        viewModelScope.launch {
            try {
                apiService.updateCell(cell)
            } catch (e: Exception) {
                // Handle error (e.g., show error message, revert changes)
            }
        }
    }
}

/**
 * WorksheetViewModelFactory is responsible for creating WorksheetViewModel instances.
 */
class WorksheetViewModelFactory(private val apiService: APIService) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(WorksheetViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return WorksheetViewModel(apiService) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}

/**
 * FragmentWorksheetBinding is a placeholder for the view binding class.
 * In a real implementation, this would be generated by the view binding library.
 */
class FragmentWorksheetBinding private constructor() {
    lateinit var worksheetRecyclerView: RecyclerView

    companion object {
        fun inflate(inflater: LayoutInflater, container: ViewGroup?, attachToRoot: Boolean): FragmentWorksheetBinding {
            // This is a simplified version. In reality, view binding would inflate the layout and bind the views.
            return FragmentWorksheetBinding()
        }
    }

    val root: View
        get() = worksheetRecyclerView // This is a simplification. In reality, this would be the root view of the layout.
}

private const val ARG_WORKSHEET_ID = "worksheet_id"
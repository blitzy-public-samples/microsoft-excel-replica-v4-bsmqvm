package com.microsoft.excelmobile

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.lifecycleScope
import com.microsoft.excelmobile.models.Workbook
import com.microsoft.excelmobile.services.APIService
import com.microsoft.excelmobile.services.AuthenticationService
import kotlinx.coroutines.launch

class WorkbookActivity : AppCompatActivity() {

    private lateinit var viewModel: WorkbookViewModel
    private lateinit var apiService: APIService
    private lateinit var authService: AuthenticationService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_workbook)

        // Initialize services
        apiService = APIService()
        authService = AuthenticationService()

        // Initialize ViewModel
        viewModel = ViewModelProvider(this).get(WorkbookViewModel::class.java)

        // Set up UI components
        setupUIComponents()

        // Load workbook data
        loadWorkbookData()

        // Set up navigation between worksheets
        setupWorksheetNavigation()
    }

    private fun setupUIComponents() {
        // TODO: Initialize and set up UI components like toolbar, worksheet view, etc.
    }

    private fun loadWorkbookData() {
        lifecycleScope.launch {
            try {
                val workbookId = intent.getStringExtra("WORKBOOK_ID") ?: throw IllegalArgumentException("Workbook ID is required")
                val workbook = apiService.getWorkbook(workbookId)
                viewModel.setWorkbook(workbook)
                updateUI(workbook)
            } catch (e: Exception) {
                // TODO: Handle errors, show error message to user
            }
        }
    }

    private fun updateUI(workbook: Workbook) {
        // TODO: Update UI with workbook data
    }

    private fun setupWorksheetNavigation() {
        // TODO: Implement navigation between worksheets
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.workbook_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_save -> {
                saveWorkbook()
                true
            }
            R.id.action_share -> {
                shareWorkbook()
                true
            }
            R.id.action_close -> {
                closeWorkbook()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    private fun saveWorkbook() {
        lifecycleScope.launch {
            try {
                val workbook = viewModel.getWorkbook()
                apiService.saveWorkbook(workbook)
                // TODO: Show success message
            } catch (e: Exception) {
                // TODO: Handle errors, show error message to user
            }
        }
    }

    private fun shareWorkbook() {
        // TODO: Implement workbook sharing functionality
    }

    private fun closeWorkbook() {
        // TODO: Implement workbook closing functionality
        finish()
    }
}

class WorkbookViewModel : ViewModel() {
    private val _workbook = MutableLiveData<Workbook>()
    val workbook: LiveData<Workbook> = _workbook

    fun setWorkbook(workbook: Workbook) {
        _workbook.value = workbook
    }

    fun getWorkbook(): Workbook? {
        return _workbook.value
    }

    fun loadWorkbook(workbookId: String) {
        viewModelScope.launch {
            try {
                val apiService = APIService()
                val loadedWorkbook = apiService.getWorkbook(workbookId)
                _workbook.value = loadedWorkbook
            } catch (e: Exception) {
                // TODO: Handle errors, update error state
            }
        }
    }
}
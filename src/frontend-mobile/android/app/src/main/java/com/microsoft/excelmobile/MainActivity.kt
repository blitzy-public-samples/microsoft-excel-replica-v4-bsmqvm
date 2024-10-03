package com.microsoft.excelmobile

import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.Observer
import com.microsoft.excelmobile.services.AuthenticationService
import com.microsoft.excelmobile.services.APIService
import com.microsoft.excelmobile.models.Workbook
import android.content.Intent
import android.view.Menu
import android.view.MenuItem
import android.widget.Button
import android.widget.ListView
import android.widget.Toast

class MainActivity : AppCompatActivity() {

    private lateinit var viewModel: MainViewModel
    private lateinit var authService: AuthenticationService
    private lateinit var apiService: APIService
    private lateinit var recentWorkbooksListView: ListView
    private lateinit var createNewWorkbookButton: Button

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Initialize services
        authService = AuthenticationService()
        apiService = APIService()

        // Initialize ViewModel
        viewModel = ViewModelProvider(this).get(MainViewModel::class.java)

        // Set up UI components
        recentWorkbooksListView = findViewById(R.id.recentWorkbooksListView)
        createNewWorkbookButton = findViewById(R.id.createNewWorkbookButton)

        // Set up observers
        setupObservers()

        // Check authentication status
        viewModel.checkAuthenticationStatus()

        // Set up listeners
        setupListeners()
    }

    private fun setupObservers() {
        viewModel.isAuthenticated.observe(this, Observer { isAuthenticated ->
            if (isAuthenticated) {
                viewModel.loadRecentWorkbooks()
            } else {
                // Redirect to login screen or show login dialog
                showLoginPrompt()
            }
        })

        viewModel.recentWorkbooks.observe(this, Observer { workbooks ->
            // Update the ListView with recent workbooks
            updateRecentWorkbooksList(workbooks)
        })
    }

    private fun setupListeners() {
        createNewWorkbookButton.setOnClickListener {
            createNewWorkbook()
        }

        recentWorkbooksListView.setOnItemClickListener { _, _, position, _ ->
            val workbook = viewModel.recentWorkbooks.value?.get(position)
            workbook?.let { openWorkbook(it) }
        }
    }

    private fun showLoginPrompt() {
        // Implement login dialog or redirect to login activity
        Toast.makeText(this, "Please log in to access Excel Mobile", Toast.LENGTH_LONG).show()
        // TODO: Implement actual login flow
    }

    private fun updateRecentWorkbooksList(workbooks: List<Workbook>) {
        // Update the ListView with the list of recent workbooks
        // TODO: Implement a custom adapter for the ListView to display workbook information
    }

    private fun createNewWorkbook() {
        // TODO: Implement new workbook creation
        val intent = Intent(this, WorkbookActivity::class.java)
        intent.putExtra("isNewWorkbook", true)
        startActivity(intent)
    }

    private fun openWorkbook(workbook: Workbook) {
        val intent = Intent(this, WorkbookActivity::class.java)
        intent.putExtra("workbookId", workbook.id)
        startActivity(intent)
    }

    override fun onCreateOptionsMenu(menu: Menu): Boolean {
        menuInflater.inflate(R.menu.main_menu, menu)
        return true
    }

    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_settings -> {
                // Open settings
                true
            }
            R.id.action_sign_out -> {
                signOut()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }

    private fun signOut() {
        authService.signOut()
        viewModel.checkAuthenticationStatus()
    }
}

class MainViewModel : ViewModel() {
    private val authService = AuthenticationService()
    private val apiService = APIService()

    private val _isAuthenticated = MutableLiveData<Boolean>()
    val isAuthenticated: LiveData<Boolean> = _isAuthenticated

    private val _recentWorkbooks = MutableLiveData<List<Workbook>>()
    val recentWorkbooks: LiveData<List<Workbook>> = _recentWorkbooks

    fun checkAuthenticationStatus() {
        viewModelScope.launch {
            _isAuthenticated.value = authService.isLoggedIn()
        }
    }

    fun loadRecentWorkbooks() {
        viewModelScope.launch {
            try {
                val workbooks = apiService.getRecentWorkbooks()
                _recentWorkbooks.value = workbooks
            } catch (e: Exception) {
                // Handle error
                Log.e("MainViewModel", "Error loading recent workbooks", e)
            }
        }
    }
}
package com.microsoft.excelmobile.services

import com.microsoft.excelmobile.models.Workbook
import com.microsoft.excelmobile.models.Worksheet
import com.microsoft.excelmobile.models.Cell
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory

class APIService : ExcelMobileAPI {

    private val retrofit: Retrofit
    private val api: ExcelApi

    companion object {
        private const val BASE_URL = "https://api.excelmobile.com/v1/"
    }

    init {
        val moshi = Moshi.Builder()
            .addLast(KotlinJsonAdapterFactory())
            .build()

        retrofit = Retrofit.Builder()
            .baseUrl(BASE_URL)
            .addConverterFactory(MoshiConverterFactory.create(moshi))
            .build()

        api = retrofit.create(ExcelApi::class.java)
    }

    override suspend fun getWorkbooks(): List<Workbook> = withContext(Dispatchers.IO) {
        try {
            api.getWorkbooks()
        } catch (e: Exception) {
            // Handle potential errors (e.g., network issues, API errors)
            throw ExcelApiException("Failed to retrieve workbooks", e)
        }
    }

    override suspend fun createWorkbook(name: String): Workbook = withContext(Dispatchers.IO) {
        try {
            api.createWorkbook(CreateWorkbookRequest(name))
        } catch (e: Exception) {
            throw ExcelApiException("Failed to create workbook", e)
        }
    }

    override suspend fun getWorkbook(id: String): Workbook = withContext(Dispatchers.IO) {
        try {
            api.getWorkbook(id)
        } catch (e: Exception) {
            throw ExcelApiException("Failed to retrieve workbook", e)
        }
    }

    override suspend fun saveWorkbook(workbook: Workbook) = withContext(Dispatchers.IO) {
        try {
            api.saveWorkbook(workbook.id, workbook)
        } catch (e: Exception) {
            throw ExcelApiException("Failed to save workbook", e)
        }
    }

    override suspend fun getWorksheets(workbookId: String): List<Worksheet> = withContext(Dispatchers.IO) {
        try {
            api.getWorksheets(workbookId)
        } catch (e: Exception) {
            throw ExcelApiException("Failed to retrieve worksheets", e)
        }
    }

    override suspend fun createWorksheet(workbookId: String, name: String): Worksheet = withContext(Dispatchers.IO) {
        try {
            api.createWorksheet(workbookId, CreateWorksheetRequest(name))
        } catch (e: Exception) {
            throw ExcelApiException("Failed to create worksheet", e)
        }
    }

    override suspend fun getCell(workbookId: String, worksheetId: String, cellId: String): Cell = withContext(Dispatchers.IO) {
        try {
            api.getCell(workbookId, worksheetId, cellId)
        } catch (e: Exception) {
            throw ExcelApiException("Failed to retrieve cell", e)
        }
    }

    override suspend fun updateCell(workbookId: String, worksheetId: String, cellId: String, value: Any) = withContext(Dispatchers.IO) {
        try {
            api.updateCell(workbookId, worksheetId, cellId, UpdateCellRequest(value))
        } catch (e: Exception) {
            throw ExcelApiException("Failed to update cell", e)
        }
    }

    override suspend fun calculateFormula(workbookId: String, worksheetId: String, formula: String): Any = withContext(Dispatchers.IO) {
        try {
            api.calculateFormula(workbookId, worksheetId, CalculateFormulaRequest(formula))
        } catch (e: Exception) {
            throw ExcelApiException("Failed to calculate formula", e)
        }
    }
}

// Define the API interface for Retrofit
private interface ExcelApi {
    suspend fun getWorkbooks(): List<Workbook>
    suspend fun createWorkbook(request: CreateWorkbookRequest): Workbook
    suspend fun getWorkbook(id: String): Workbook
    suspend fun saveWorkbook(id: String, workbook: Workbook)
    suspend fun getWorksheets(workbookId: String): List<Worksheet>
    suspend fun createWorksheet(workbookId: String, request: CreateWorksheetRequest): Worksheet
    suspend fun getCell(workbookId: String, worksheetId: String, cellId: String): Cell
    suspend fun updateCell(workbookId: String, worksheetId: String, cellId: String, request: UpdateCellRequest)
    suspend fun calculateFormula(workbookId: String, worksheetId: String, request: CalculateFormulaRequest): Any
}

// Define request classes for API calls
private data class CreateWorkbookRequest(val name: String)
private data class CreateWorksheetRequest(val name: String)
private data class UpdateCellRequest(val value: Any)
private data class CalculateFormulaRequest(val formula: String)

// Custom exception for API errors
class ExcelApiException(message: String, cause: Throwable? = null) : Exception(message, cause)
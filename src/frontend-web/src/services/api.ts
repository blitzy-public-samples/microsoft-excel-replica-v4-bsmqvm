import axios, { AxiosInstance } from 'axios';
import { IWorkbook, IWorksheet, ICell, IRange } from '../types/excel';

const API_BASE_URL: string = process.env.REACT_APP_API_BASE_URL || 'https://api.excel.com/v1';

/**
 * Creates and configures an Axios instance for making API requests.
 * @returns {AxiosInstance} Configured Axios instance
 */
const createApiInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add request interceptor for authentication
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      // Handle specific error cases (e.g., unauthorized, server error)
      if (error.response) {
        switch (error.response.status) {
          case 401:
            // Handle unauthorized access
            break;
          case 500:
            // Handle server error
            break;
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const api = createApiInstance();

/**
 * Retrieves a workbook from the server by its ID.
 * @param {string} workbookId - The ID of the workbook to retrieve
 * @returns {Promise<IWorkbook>} The retrieved workbook
 */
export const getWorkbook = async (workbookId: string): Promise<IWorkbook> => {
  try {
    const response = await api.get(`/workbooks/${workbookId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching workbook:', error);
    throw error;
  }
};

/**
 * Creates a new workbook on the server.
 * @param {string} name - The name of the new workbook
 * @returns {Promise<IWorkbook>} The newly created workbook
 */
export const createWorkbook = async (name: string): Promise<IWorkbook> => {
  try {
    const response = await api.post('/workbooks', { name });
    return response.data;
  } catch (error) {
    console.error('Error creating workbook:', error);
    throw error;
  }
};

/**
 * Updates an existing workbook on the server.
 * @param {string} workbookId - The ID of the workbook to update
 * @param {Partial<IWorkbook>} updates - The updates to apply to the workbook
 * @returns {Promise<IWorkbook>} The updated workbook
 */
export const updateWorkbook = async (workbookId: string, updates: Partial<IWorkbook>): Promise<IWorkbook> => {
  try {
    const response = await api.patch(`/workbooks/${workbookId}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating workbook:', error);
    throw error;
  }
};

/**
 * Deletes a workbook from the server.
 * @param {string} workbookId - The ID of the workbook to delete
 * @returns {Promise<void>} Confirmation of deletion
 */
export const deleteWorkbook = async (workbookId: string): Promise<void> => {
  try {
    await api.delete(`/workbooks/${workbookId}`);
  } catch (error) {
    console.error('Error deleting workbook:', error);
    throw error;
  }
};

/**
 * Retrieves a worksheet from the server by its ID and workbook ID.
 * @param {string} workbookId - The ID of the workbook containing the worksheet
 * @param {string} worksheetId - The ID of the worksheet to retrieve
 * @returns {Promise<IWorksheet>} The retrieved worksheet
 */
export const getWorksheet = async (workbookId: string, worksheetId: string): Promise<IWorksheet> => {
  try {
    const response = await api.get(`/workbooks/${workbookId}/worksheets/${worksheetId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching worksheet:', error);
    throw error;
  }
};

/**
 * Creates a new worksheet in the specified workbook.
 * @param {string} workbookId - The ID of the workbook to create the worksheet in
 * @param {string} name - The name of the new worksheet
 * @returns {Promise<IWorksheet>} The newly created worksheet
 */
export const createWorksheet = async (workbookId: string, name: string): Promise<IWorksheet> => {
  try {
    const response = await api.post(`/workbooks/${workbookId}/worksheets`, { name });
    return response.data;
  } catch (error) {
    console.error('Error creating worksheet:', error);
    throw error;
  }
};

/**
 * Updates an existing worksheet on the server.
 * @param {string} workbookId - The ID of the workbook containing the worksheet
 * @param {string} worksheetId - The ID of the worksheet to update
 * @param {Partial<IWorksheet>} updates - The updates to apply to the worksheet
 * @returns {Promise<IWorksheet>} The updated worksheet
 */
export const updateWorksheet = async (
  workbookId: string,
  worksheetId: string,
  updates: Partial<IWorksheet>
): Promise<IWorksheet> => {
  try {
    const response = await api.patch(`/workbooks/${workbookId}/worksheets/${worksheetId}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating worksheet:', error);
    throw error;
  }
};

/**
 * Deletes a worksheet from the server.
 * @param {string} workbookId - The ID of the workbook containing the worksheet
 * @param {string} worksheetId - The ID of the worksheet to delete
 * @returns {Promise<void>} Confirmation of deletion
 */
export const deleteWorksheet = async (workbookId: string, worksheetId: string): Promise<void> => {
  try {
    await api.delete(`/workbooks/${workbookId}/worksheets/${worksheetId}`);
  } catch (error) {
    console.error('Error deleting worksheet:', error);
    throw error;
  }
};

/**
 * Retrieves the value of a specific cell from the server.
 * @param {string} workbookId - The ID of the workbook containing the cell
 * @param {string} worksheetId - The ID of the worksheet containing the cell
 * @param {string} cellReference - The reference of the cell (e.g., "A1")
 * @returns {Promise<ICell>} The retrieved cell data
 */
export const getCellValue = async (
  workbookId: string,
  worksheetId: string,
  cellReference: string
): Promise<ICell> => {
  try {
    const response = await api.get(`/workbooks/${workbookId}/worksheets/${worksheetId}/cells/${cellReference}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cell value:', error);
    throw error;
  }
};

/**
 * Updates the value of a specific cell on the server.
 * @param {string} workbookId - The ID of the workbook containing the cell
 * @param {string} worksheetId - The ID of the worksheet containing the cell
 * @param {string} cellReference - The reference of the cell (e.g., "A1")
 * @param {any} value - The new value for the cell
 * @returns {Promise<ICell>} The updated cell data
 */
export const updateCellValue = async (
  workbookId: string,
  worksheetId: string,
  cellReference: string,
  value: any
): Promise<ICell> => {
  try {
    const response = await api.patch(`/workbooks/${workbookId}/worksheets/${worksheetId}/cells/${cellReference}`, {
      value,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating cell value:', error);
    throw error;
  }
};

/**
 * Retrieves the values of a range of cells from the server.
 * @param {string} workbookId - The ID of the workbook containing the range
 * @param {string} worksheetId - The ID of the worksheet containing the range
 * @param {string} rangeReference - The reference of the range (e.g., "A1:B10")
 * @returns {Promise<IRange>} The retrieved range data
 */
export const getRangeValues = async (
  workbookId: string,
  worksheetId: string,
  rangeReference: string
): Promise<IRange> => {
  try {
    const response = await api.get(`/workbooks/${workbookId}/worksheets/${worksheetId}/ranges/${rangeReference}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching range values:', error);
    throw error;
  }
};

/**
 * Updates the values of a range of cells on the server.
 * @param {string} workbookId - The ID of the workbook containing the range
 * @param {string} worksheetId - The ID of the worksheet containing the range
 * @param {string} rangeReference - The reference of the range (e.g., "A1:B10")
 * @param {any[][]} values - The new values for the range
 * @returns {Promise<IRange>} The updated range data
 */
export const updateRangeValues = async (
  workbookId: string,
  worksheetId: string,
  rangeReference: string,
  values: any[][]
): Promise<IRange> => {
  try {
    const response = await api.patch(`/workbooks/${workbookId}/worksheets/${worksheetId}/ranges/${rangeReference}`, {
      values,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating range values:', error);
    throw error;
  }
};

export default api;
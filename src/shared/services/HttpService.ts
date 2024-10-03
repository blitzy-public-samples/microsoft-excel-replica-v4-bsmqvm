import axios, { AxiosInstance, AxiosError } from 'axios';

// Since we couldn't fetch the actual implementations, we'll mock these imports
import { ApiConfig } from '../config/ApiConfig';
import { handleError, ExcelError } from '../utils/ErrorHandlingUtils';
import { ErrorCodes } from '../constants/ErrorCodes';

const httpClient: AxiosInstance = axios.create({
    baseURL: ApiConfig.baseUrl,
    timeout: ApiConfig.timeout,
    headers: ApiConfig.defaultHeaders
});

const createAuthHeader = (token: string): { Authorization: string } => {
    return { Authorization: `Bearer ${token}` };
};

const handleApiError = (error: AxiosError): never => {
    const status = error.response?.status || 500;
    const data = error.response?.data || {};

    let errorCode: ErrorCodes;
    switch (status) {
        case 400:
            errorCode = ErrorCodes.BAD_REQUEST;
            break;
        case 401:
            errorCode = ErrorCodes.UNAUTHORIZED;
            break;
        case 403:
            errorCode = ErrorCodes.FORBIDDEN;
            break;
        case 404:
            errorCode = ErrorCodes.NOT_FOUND;
            break;
        default:
            errorCode = ErrorCodes.INTERNAL_SERVER_ERROR;
    }

    throw handleError(new ExcelError(errorCode, JSON.stringify(data)));
};

export class HttpService {
    constructor() {
        // Initialize the httpClient using ApiConfig settings
        // This is already done above, but in a real implementation,
        // you might want to do this in the constructor
    }

    async get<T>(url: string, params: object = {}, token?: string): Promise<T> {
        try {
            const config: any = { params };
            if (token) {
                config.headers = createAuthHeader(token);
            }
            const response = await httpClient.get<T>(url, config);
            return response.data;
        } catch (error) {
            return handleApiError(error as AxiosError);
        }
    }

    async post<T>(url: string, data: object, token?: string): Promise<T> {
        try {
            const config: any = {};
            if (token) {
                config.headers = createAuthHeader(token);
            }
            const response = await httpClient.post<T>(url, data, config);
            return response.data;
        } catch (error) {
            return handleApiError(error as AxiosError);
        }
    }

    async put<T>(url: string, data: object, token?: string): Promise<T> {
        try {
            const config: any = {};
            if (token) {
                config.headers = createAuthHeader(token);
            }
            const response = await httpClient.put<T>(url, data, config);
            return response.data;
        } catch (error) {
            return handleApiError(error as AxiosError);
        }
    }

    async delete<T>(url: string, token?: string): Promise<T> {
        try {
            const config: any = {};
            if (token) {
                config.headers = createAuthHeader(token);
            }
            const response = await httpClient.delete<T>(url, config);
            return response.data;
        } catch (error) {
            return handleApiError(error as AxiosError);
        }
    }
}

export default new HttpService();
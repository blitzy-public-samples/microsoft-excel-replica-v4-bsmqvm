import Foundation
import Alamofire

/// The main class implementing the NetworkingProtocol for Excel mobile application
class ExcelMobileAPI: NetworkingProtocol {
    // MARK: - Properties
    
    private let session: URLSession
    private var authToken: String?
    private let baseURL = URL(string: "https://api.excel.com/v1")!
    
    // MARK: - Initialization
    
    init(session: URLSession = .shared) {
        self.session = session
    }
    
    // MARK: - NetworkingProtocol Methods
    
    /// Fetches a workbook from the server by its ID
    /// - Parameter id: The ID of the workbook to fetch
    /// - Returns: The fetched workbook object
    func fetchWorkbook(id: String) async throws -> Workbook {
        // Construct the URL for the workbook endpoint
        let url = baseURL.appendingPathComponent("workbooks/\(id)")
        
        // Send a GET request to the server
        let (data, response) = try await session.data(from: url)
        
        // Check for a successful HTTP response
        guard let httpResponse = response as? HTTPURLResponse,
              (200...299).contains(httpResponse.statusCode) else {
            throw NetworkError.invalidResponse
        }
        
        // Parse the JSON response
        let decoder = JSONDecoder()
        do {
            let workbook = try decoder.decode(Workbook.self, from: data)
            return workbook
        } catch {
            throw NetworkError.decodingError(error)
        }
    }
    
    /// Saves a workbook to the server
    /// - Parameter workbook: The workbook object to save
    func saveWorkbook(_ workbook: Workbook) async throws {
        // Construct the URL for the workbook endpoint
        let url = baseURL.appendingPathComponent("workbooks")
        
        // Serialize the Workbook object to JSON
        let encoder = JSONEncoder()
        let jsonData = try encoder.encode(workbook)
        
        // Create the request
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = jsonData
        
        // Send a POST request to the server with the serialized data
        let (_, response) = try await session.upload(for: request, from: jsonData)
        
        // Handle the server response
        guard let httpResponse = response as? HTTPURLResponse,
              (200...299).contains(httpResponse.statusCode) else {
            throw NetworkError.invalidResponse
        }
    }
    
    /// Fetches a specific worksheet from a workbook
    /// - Parameters:
    ///   - workbookId: The ID of the workbook
    ///   - worksheetId: The ID of the worksheet
    /// - Returns: The fetched worksheet object
    func fetchWorksheet(workbookId: String, worksheetId: String) async throws -> Worksheet {
        // Construct the URL for the worksheet endpoint
        let url = baseURL.appendingPathComponent("workbooks/\(workbookId)/worksheets/\(worksheetId)")
        
        // Send a GET request to the server
        let (data, response) = try await session.data(from: url)
        
        // Check for a successful HTTP response
        guard let httpResponse = response as? HTTPURLResponse,
              (200...299).contains(httpResponse.statusCode) else {
            throw NetworkError.invalidResponse
        }
        
        // Parse the JSON response
        let decoder = JSONDecoder()
        do {
            let worksheet = try decoder.decode(Worksheet.self, from: data)
            return worksheet
        } catch {
            throw NetworkError.decodingError(error)
        }
    }
    
    /// Updates the value of a specific cell
    /// - Parameters:
    ///   - workbookId: The ID of the workbook
    ///   - worksheetId: The ID of the worksheet
    ///   - cellId: The ID of the cell
    ///   - value: The new value for the cell
    func updateCell(workbookId: String, worksheetId: String, cellId: String, value: Any) async throws {
        // Construct the URL for the cell endpoint
        let url = baseURL.appendingPathComponent("workbooks/\(workbookId)/worksheets/\(worksheetId)/cells/\(cellId)")
        
        // Serialize the cell value
        let encoder = JSONEncoder()
        let jsonData = try encoder.encode(["value": value])
        
        // Create the request
        var request = URLRequest(url: url)
        request.httpMethod = "PUT"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = jsonData
        
        // Send a PUT request to the server with the serialized data
        let (_, response) = try await session.upload(for: request, from: jsonData)
        
        // Handle the server response
        guard let httpResponse = response as? HTTPURLResponse,
              (200...299).contains(httpResponse.statusCode) else {
            throw NetworkError.invalidResponse
        }
    }
    
    /// Authenticates the user and returns an authentication token
    /// - Parameters:
    ///   - username: The user's username
    ///   - password: The user's password
    /// - Returns: The authentication token
    func authenticate(username: String, password: String) async throws -> AuthToken {
        // Construct the URL for the authentication endpoint
        let url = baseURL.appendingPathComponent("auth")
        
        // Create the request body
        let body = ["username": username, "password": password]
        
        // Send a POST request with the username and password
        let (data, response) = try await AF.request(url, method: .post, parameters: body, encoding: JSONEncoding.default).serializingData().response.result.get()
        
        // Check for a successful HTTP response
        guard let httpResponse = response as? HTTPURLResponse,
              (200...299).contains(httpResponse.statusCode) else {
            throw NetworkError.invalidResponse
        }
        
        // Parse the response to extract the auth token
        let decoder = JSONDecoder()
        do {
            let authResponse = try decoder.decode(AuthResponse.self, from: data)
            
            // Store the auth token for future requests
            self.authToken = authResponse.token
            
            return AuthToken(token: authResponse.token)
        } catch {
            throw NetworkError.decodingError(error)
        }
    }
}

// MARK: - Helper Structures

struct AuthResponse: Codable {
    let token: String
}

struct AuthToken {
    let token: String
}

// MARK: - Error Handling

enum NetworkError: Error {
    case invalidResponse
    case decodingError(Error)
}
import Foundation
import KeychainAccess

// MARK: - Constants
private let kAuthTokenKey = "authToken"

// MARK: - AuthenticationService
class AuthenticationService {
    // MARK: - Properties
    private let networkingProtocol: NetworkingProtocol
    private let keychain: Keychain
    
    // MARK: - Initialization
    init(networkingProtocol: NetworkingProtocol) {
        self.networkingProtocol = networkingProtocol
        self.keychain = Keychain(service: "com.microsoft.excelmobile")
    }
    
    // MARK: - Public Methods
    func login(username: String, password: String) async throws -> Bool {
        do {
            let authResponse = try await networkingProtocol.authenticate(username: username, password: password)
            if let token = authResponse.token {
                try keychain.set(token, key: kAuthTokenKey)
                return true
            } else {
                return false
            }
        } catch {
            throw AuthenticationError.loginFailed(error)
        }
    }
    
    func logout() {
        do {
            try keychain.remove(kAuthTokenKey)
        } catch {
            print("Error removing auth token from keychain: \(error)")
        }
    }
    
    func getAuthToken() -> String? {
        do {
            return try keychain.get(kAuthTokenKey)
        } catch {
            print("Error retrieving auth token from keychain: \(error)")
            return nil
        }
    }
    
    func refreshToken() async throws -> Bool {
        guard let currentToken = getAuthToken() else {
            throw AuthenticationError.noTokenFound
        }
        
        do {
            let refreshResponse = try await networkingProtocol.refreshToken(token: currentToken)
            if let newToken = refreshResponse.token {
                try keychain.set(newToken, key: kAuthTokenKey)
                return true
            } else {
                return false
            }
        } catch {
            throw AuthenticationError.refreshFailed(error)
        }
    }
}

// MARK: - AuthenticationError
enum AuthenticationError: Error {
    case loginFailed(Error)
    case refreshFailed(Error)
    case noTokenFound
}

// MARK: - NetworkingProtocol Extension
extension NetworkingProtocol {
    func authenticate(username: String, password: String) async throws -> AuthResponse {
        // This is a placeholder implementation. In a real scenario, this would be implemented in the NetworkingProtocol file.
        fatalError("authenticate(username:password:) must be implemented")
    }
    
    func refreshToken(token: String) async throws -> AuthResponse {
        // This is a placeholder implementation. In a real scenario, this would be implemented in the NetworkingProtocol file.
        fatalError("refreshToken(token:) must be implemented")
    }
}

// MARK: - AuthResponse
struct AuthResponse {
    let token: String?
    let error: String?
}
import XCTest
import Combine
@testable import ExcelMobile

class ExcelMobileTests: XCTestCase {
    
    var apiService: APIService!
    var authService: AuthenticationService!
    var cancellables: Set<AnyCancellable> = []
    
    override func setUp() {
        super.setUp()
        // Initialize apiService with a mock NetworkingProtocol
        apiService = APIService(networkingProtocol: MockNetworkingProtocol())
        // Initialize authService with a mock NetworkingProtocol
        authService = AuthenticationService(networkingProtocol: MockNetworkingProtocol())
    }
    
    override func tearDown() {
        apiService = nil
        authService = nil
        cancellables.removeAll()
        super.tearDown()
    }
    
    func testCellCreation() {
        let cell = Cell(row: 0, column: 0, value: "Test")
        XCTAssertEqual(cell.row, 0)
        XCTAssertEqual(cell.column, 0)
        XCTAssertEqual(cell.value, "Test")
        
        cell.value = "Updated"
        XCTAssertEqual(cell.value, "Updated")
        
        cell.applyFormat(.currency)
        XCTAssertEqual(cell.format, .currency)
    }
    
    func testWorksheetOperations() {
        let worksheet = Worksheet(name: "Sheet1")
        
        worksheet.addCell(Cell(row: 0, column: 0, value: "A1"))
        worksheet.addCell(Cell(row: 0, column: 1, value: "B1"))
        worksheet.addCell(Cell(row: 1, column: 0, value: "A2"))
        
        XCTAssertEqual(worksheet.getCell(row: 0, column: 0)?.value, "A1")
        XCTAssertEqual(worksheet.getCell(row: 0, column: 1)?.value, "B1")
        XCTAssertEqual(worksheet.getCell(row: 1, column: 0)?.value, "A2")
        
        worksheet.addRow(at: 1)
        XCTAssertEqual(worksheet.getCell(row: 2, column: 0)?.value, "A2")
        
        worksheet.removeColumn(at: 0)
        XCTAssertEqual(worksheet.getCell(row: 0, column: 0)?.value, "B1")
        
        XCTAssertEqual(worksheet.rowCount, 3)
        XCTAssertEqual(worksheet.columnCount, 1)
    }
    
    func testWorkbookManagement() {
        let workbook = Workbook(name: "TestWorkbook")
        
        workbook.addWorksheet(Worksheet(name: "Sheet1"))
        workbook.addWorksheet(Worksheet(name: "Sheet2"))
        
        XCTAssertEqual(workbook.worksheets.count, 2)
        XCTAssertEqual(workbook.getWorksheet(name: "Sheet1")?.name, "Sheet1")
        XCTAssertEqual(workbook.getWorksheet(name: "Sheet2")?.name, "Sheet2")
        
        workbook.setActiveWorksheet("Sheet2")
        XCTAssertEqual(workbook.activeWorksheet?.name, "Sheet2")
        
        XCTAssertNotNil(workbook.creationDate)
        XCTAssertNotNil(workbook.lastModifiedDate)
    }
    
    func testAPIServiceFetchWorkbook() {
        let expectation = XCTestExpectation(description: "Fetch workbook")
        let mockWorkbookId = "123"
        
        apiService.fetchWorkbook(id: mockWorkbookId)
            .sink { completion in
                switch completion {
                case .finished:
                    break
                case .failure(let error):
                    XCTFail("Failed to fetch workbook: \(error)")
                }
            } receiveValue: { workbook in
                XCTAssertEqual(workbook.id, mockWorkbookId)
                XCTAssertEqual(workbook.name, "Mock Workbook")
                expectation.fulfill()
            }
            .store(in: &cancellables)
        
        wait(for: [expectation], timeout: 5.0)
    }
    
    func testAPIServiceSaveWorkbook() {
        let expectation = XCTestExpectation(description: "Save workbook")
        let mockWorkbook = Workbook(id: "123", name: "Mock Workbook")
        
        apiService.saveWorkbook(mockWorkbook)
            .sink { completion in
                switch completion {
                case .finished:
                    break
                case .failure(let error):
                    XCTFail("Failed to save workbook: \(error)")
                }
            } receiveValue: { savedWorkbook in
                XCTAssertEqual(savedWorkbook.id, mockWorkbook.id)
                XCTAssertEqual(savedWorkbook.name, mockWorkbook.name)
                expectation.fulfill()
            }
            .store(in: &cancellables)
        
        wait(for: [expectation], timeout: 5.0)
    }
    
    func testAuthenticationFlow() {
        let expectation = XCTestExpectation(description: "Authentication flow")
        let mockUsername = "testuser"
        let mockPassword = "testpassword"
        
        authService.login(username: mockUsername, password: mockPassword)
            .flatMap { _ in self.authService.getAuthToken() }
            .sink { completion in
                switch completion {
                case .finished:
                    break
                case .failure(let error):
                    XCTFail("Authentication failed: \(error)")
                }
            } receiveValue: { token in
                XCTAssertFalse(token.isEmpty)
                
                self.authService.logout()
                    .sink { completion in
                        switch completion {
                        case .finished:
                            break
                        case .failure(let error):
                            XCTFail("Logout failed: \(error)")
                        }
                    } receiveValue: { _ in
                        self.authService.getAuthToken()
                            .sink { completion in
                                switch completion {
                                case .finished:
                                    break
                                case .failure:
                                    expectation.fulfill()
                                }
                            } receiveValue: { _ in
                                XCTFail("Token should be removed after logout")
                            }
                            .store(in: &self.cancellables)
                    }
                    .store(in: &self.cancellables)
            }
            .store(in: &cancellables)
        
        wait(for: [expectation], timeout: 5.0)
    }
}

// MARK: - Mock Networking Protocol

class MockNetworkingProtocol: NetworkingProtocol {
    func request<T>(_ endpoint: APIEndpoint, method: HTTPMethod, parameters: [String : Any]?) -> AnyPublisher<T, Error> where T : Decodable {
        // Implement mock networking behavior here
        fatalError("Mock networking not implemented")
    }
}
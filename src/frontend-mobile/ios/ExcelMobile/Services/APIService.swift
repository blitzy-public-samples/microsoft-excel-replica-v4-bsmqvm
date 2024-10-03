import Foundation
import Combine

class APIService {
    private let api: ExcelMobileAPI
    private(set) var currentWorkbook: CurrentValueSubject<Workbook?, Never>

    init(api: ExcelMobileAPI = ExcelMobileAPI()) {
        self.api = api
        self.currentWorkbook = CurrentValueSubject<Workbook?, Never>(nil)
    }

    func fetchWorkbook(id: String) -> AnyPublisher<Workbook, Error> {
        return api.fetchWorkbook(id: id)
            .handleEvents(receiveOutput: { [weak self] workbook in
                self?.currentWorkbook.send(workbook)
            })
            .eraseToAnyPublisher()
    }

    func saveWorkbook(_ workbook: Workbook) -> AnyPublisher<Void, Error> {
        return api.saveWorkbook(workbook)
            .handleEvents(receiveOutput: { [weak self] _ in
                self?.currentWorkbook.send(workbook)
            })
            .eraseToAnyPublisher()
    }

    func fetchWorksheet(workbookId: String, worksheetId: String) -> AnyPublisher<Worksheet, Error> {
        return api.fetchWorksheet(workbookId: workbookId, worksheetId: worksheetId)
            .eraseToAnyPublisher()
    }

    func updateCell(workbookId: String, worksheetId: String, cellId: String, value: Any) -> AnyPublisher<Void, Error> {
        return api.updateCell(workbookId: workbookId, worksheetId: worksheetId, cellId: cellId, value: value)
            .eraseToAnyPublisher()
    }

    func authenticate(username: String, password: String) -> AnyPublisher<Void, Error> {
        return api.authenticate(username: username, password: password)
            .handleEvents(receiveOutput: { [weak self] token in
                self?.storeAuthToken(token)
            })
            .eraseToAnyPublisher()
    }

    private func storeAuthToken(_ token: String) {
        // Store the authentication token securely using iOS keychain
        // This is a simplified example, in a real app you'd want to use Keychain Services
        UserDefaults.standard.set(token, forKey: "AuthToken")
    }
}
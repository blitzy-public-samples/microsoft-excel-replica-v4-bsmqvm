import Foundation

protocol WorkbookProtocol {
    var id: UUID { get }
    var name: String { get }
    var worksheets: [Worksheet] { get }
    var activeWorksheet: Worksheet? { get set }
    
    func addWorksheet(name: String) -> Worksheet
    func removeWorksheet(at index: Int)
    func getWorksheet(name: String) -> Worksheet?
    func setActiveWorksheet(_ worksheet: Worksheet)
    func save() throws
    func load(from url: URL) throws
}

class Workbook: WorkbookProtocol, Codable {
    let id: UUID
    var name: String
    var worksheets: [Worksheet]
    var activeWorksheet: Worksheet?
    let creationDate: Date
    var lastModifiedDate: Date
    var author: String?
    
    enum CodingKeys: String, CodingKey {
        case id, name, worksheets, activeWorksheet, creationDate, lastModifiedDate, author
    }
    
    init(name: String) {
        self.id = UUID()
        self.name = name
        self.worksheets = []
        self.creationDate = Date()
        self.lastModifiedDate = Date()
    }
    
    func addWorksheet(name: String) -> Worksheet {
        let newWorksheet = Worksheet(name: name)
        worksheets.append(newWorksheet)
        if worksheets.count == 1 {
            activeWorksheet = newWorksheet
        }
        lastModifiedDate = Date()
        return newWorksheet
    }
    
    func removeWorksheet(at index: Int) {
        guard index >= 0 && index < worksheets.count else { return }
        worksheets.remove(at: index)
        if activeWorksheet == nil || activeWorksheet == worksheets[index] {
            activeWorksheet = worksheets.first
        }
        lastModifiedDate = Date()
    }
    
    func getWorksheet(name: String) -> Worksheet? {
        return worksheets.first { $0.name == name }
    }
    
    func setActiveWorksheet(_ worksheet: Worksheet) {
        guard worksheets.contains(where: { $0 === worksheet }) else { return }
        activeWorksheet = worksheet
        lastModifiedDate = Date()
    }
    
    func save() throws {
        // Implement save functionality
        // This could involve serializing the workbook and writing it to storage
        lastModifiedDate = Date()
    }
    
    func load(from url: URL) throws {
        // Implement load functionality
        // This could involve reading serialized data from the specified URL and updating the workbook properties
        lastModifiedDate = Date()
    }
}

extension Workbook {
    convenience init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let name = try container.decode(String.self, forKey: .name)
        self.init(name: name)
        
        id = try container.decode(UUID.self, forKey: .id)
        worksheets = try container.decode([Worksheet].self, forKey: .worksheets)
        activeWorksheet = try container.decodeIfPresent(Worksheet.self, forKey: .activeWorksheet)
        creationDate = try container.decode(Date.self, forKey: .creationDate)
        lastModifiedDate = try container.decode(Date.self, forKey: .lastModifiedDate)
        author = try container.decodeIfPresent(String.self, forKey: .author)
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(id, forKey: .id)
        try container.encode(name, forKey: .name)
        try container.encode(worksheets, forKey: .worksheets)
        try container.encodeIfPresent(activeWorksheet, forKey: .activeWorksheet)
        try container.encode(creationDate, forKey: .creationDate)
        try container.encode(lastModifiedDate, forKey: .lastModifiedDate)
        try container.encodeIfPresent(author, forKey: .author)
    }
}

// Placeholder for Worksheet struct
struct Worksheet: Codable {
    let name: String
    
    init(name: String) {
        self.name = name
    }
}
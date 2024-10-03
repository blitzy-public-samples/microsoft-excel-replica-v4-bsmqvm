import Foundation

class Worksheet: Codable, WorksheetProtocol {
    let id: UUID
    var name: String
    weak var workbook: Workbook?
    var cells: [[Cell]]
    var rowCount: Int
    var columnCount: Int
    
    init(name: String, workbook: Workbook) {
        self.id = UUID()
        self.name = name
        self.workbook = workbook
        self.cells = [[Cell]]()
        self.rowCount = 0
        self.columnCount = 0
    }
    
    func getCellAt(row: Int, column: Int) -> Cell? {
        guard row >= 0 && row < rowCount && column >= 0 && column < columnCount else {
            return nil
        }
        return cells[row][column]
    }
    
    func setCellValue(row: Int, column: Int, value: Any?) {
        guard row >= 0 && row < rowCount && column >= 0 && column < columnCount else {
            return
        }
        cells[row][column].value = value
        // Trigger recalculation of dependent cells
        recalculateAll()
    }
    
    func addRow() {
        let newRow = [Cell](repeating: Cell(), count: columnCount)
        cells.append(newRow)
        rowCount += 1
    }
    
    func addColumn() {
        for row in 0..<rowCount {
            cells[row].append(Cell())
        }
        columnCount += 1
    }
    
    func deleteRow(index: Int) {
        guard index >= 0 && index < rowCount else {
            return
        }
        cells.remove(at: index)
        rowCount -= 1
        // Trigger recalculation of affected cells
        recalculateAll()
    }
    
    func deleteColumn(index: Int) {
        guard index >= 0 && index < columnCount else {
            return
        }
        for row in 0..<rowCount {
            cells[row].remove(at: index)
        }
        columnCount -= 1
        // Trigger recalculation of affected cells
        recalculateAll()
    }
    
    func recalculateAll() {
        // Iterate through all cells in the worksheet
        for row in 0..<rowCount {
            for column in 0..<columnCount {
                // Recalculate each cell's value
                cells[row][column].recalculate()
            }
        }
        // Update dependent cells (this is a simplified approach)
        // In a real implementation, you would need a more sophisticated
        // dependency tracking system to update only affected cells
    }
    
    // MARK: - Codable
    
    enum CodingKeys: String, CodingKey {
        case id, name, cells, rowCount, columnCount
    }
    
    required init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(UUID.self, forKey: .id)
        name = try container.decode(String.self, forKey: .name)
        cells = try container.decode([[Cell]].self, forKey: .cells)
        rowCount = try container.decode(Int.self, forKey: .rowCount)
        columnCount = try container.decode(Int.self, forKey: .columnCount)
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(id, forKey: .id)
        try container.encode(name, forKey: .name)
        try container.encode(cells, forKey: .cells)
        try container.encode(rowCount, forKey: .rowCount)
        try container.encode(columnCount, forKey: .columnCount)
    }
}

// MARK: - WorksheetProtocol

protocol WorksheetProtocol {
    var id: UUID { get }
    var name: String { get set }
    var cells: [[Cell]] { get set }
    
    func getCellAt(row: Int, column: Int) -> Cell?
    func setCellValue(row: Int, column: Int, value: Any?)
    func addRow()
    func addColumn()
    func deleteRow(index: Int)
    func deleteColumn(index: Int)
    func recalculateAll()
}
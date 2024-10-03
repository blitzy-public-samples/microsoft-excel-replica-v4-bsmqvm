import Foundation
import UIKit

// MARK: - UIColor Extensions

extension UIColor {
    /// Returns the standard background color for Excel
    static var excelBackground: UIColor {
        return UIColor(red: 255/255, green: 255/255, blue: 255/255, alpha: 1.0)
    }
    
    /// Returns the standard grid line color for Excel
    static var excelGridLine: UIColor {
        return UIColor(red: 217/255, green: 217/255, blue: 217/255, alpha: 1.0)
    }
    
    /// Converts a hex string to a UIColor
    /// - Parameter hex: The hex string (e.g., "#FFFFFF")
    /// - Returns: The corresponding UIColor
    static func fromHex(_ hex: String) -> UIColor {
        var hexSanitized = hex.trimmingCharacters(in: .whitespacesAndNewlines)
        hexSanitized = hexSanitized.replacingOccurrences(of: "#", with: "")
        
        var rgb: UInt64 = 0
        
        Scanner(string: hexSanitized).scanHexInt64(&rgb)
        
        let red = CGFloat((rgb & 0xFF0000) >> 16) / 255.0
        let green = CGFloat((rgb & 0x00FF00) >> 8) / 255.0
        let blue = CGFloat(rgb & 0x0000FF) / 255.0
        
        return UIColor(red: red, green: green, blue: blue, alpha: 1.0)
    }
}

// MARK: - String Extensions

extension String {
    /// Converts a string like "A1" to a tuple of column and row
    /// - Returns: The column and row as a tuple, or nil if invalid
    func toCellReference() -> (column: String, row: Int)? {
        let columnChars = self.prefix(while: { $0.isLetter })
        let rowString = self.suffix(from: columnChars.endIndex)
        
        guard let row = Int(rowString) else { return nil }
        return (String(columnChars), row)
    }
    
    /// Converts a column string like "A" or "AA" to its corresponding index
    /// - Returns: The column index, or nil if invalid
    func toColumnIndex() -> Int? {
        let characters = Array(self.uppercased())
        var sum = 0
        for char in characters {
            guard let ascii = char.asciiValue, ascii >= 65 && ascii <= 90 else { return nil }
            sum = sum * 26 + Int(ascii - 64)
        }
        return sum
    }
}

// MARK: - Int Extensions

extension Int {
    /// Converts an integer to its corresponding Excel column string (e.g., 1 -> "A", 27 -> "AA")
    /// - Returns: The Excel column string
    func toColumnString() -> String {
        var columnName = ""
        var columnNumber = self
        while columnNumber > 0 {
            let remainder = (columnNumber - 1) % 26
            columnName = String(Character(UnicodeScalar(65 + remainder)!)) + columnName
            columnNumber = (columnNumber - 1) / 26
        }
        return columnName
    }
}

// MARK: - Cell Extensions

extension Cell {
    /// Returns the formatted value of the cell based on its type and format
    /// - Returns: The formatted value of the cell
    var formattedValue: String {
        // Implement formatting logic based on cell type and format
        // This is a placeholder implementation
        return "\(value)"
    }
}

// MARK: - Worksheet Extensions

extension Worksheet {
    /// Returns the cell at the specified row and column, if it exists
    /// - Parameters:
    ///   - row: The row index
    ///   - column: The column index
    /// - Returns: The cell at the specified position, or nil if not found
    func cellAt(row: Int, column: Int) -> Cell? {
        // Implement logic to retrieve cell at given row and column
        // This is a placeholder implementation
        return nil
    }
    
    /// Returns an array of cells in the specified range
    /// - Parameters:
    ///   - start: The start cell reference (e.g., "A1")
    ///   - end: The end cell reference (e.g., "B5")
    /// - Returns: An array of cells in the specified range
    func rangeFrom(start: String, end: String) -> [Cell] {
        // Implement logic to retrieve cells in the given range
        // This is a placeholder implementation
        return []
    }
}

// MARK: - Workbook Extensions

extension Workbook {
    /// Returns the worksheet with the specified name, if it exists
    /// - Parameter name: The name of the worksheet
    /// - Returns: The worksheet with the specified name, or nil if not found
    func worksheetByName(_ name: String) -> Worksheet? {
        // Implement logic to retrieve worksheet by name
        // This is a placeholder implementation
        return nil
    }
}
import Foundation

// MARK: - CellFormat Enum
enum CellFormat {
    case number(precision: Int)
    case currency(locale: Locale)
    case percentage
    case date(dateFormat: String)
    case text
}

// MARK: - Cell Struct
struct Cell: Codable, CellProtocol {
    // MARK: - Properties
    let id: UUID
    let row: Int
    let column: Int
    var value: Any?
    var formula: String?
    var format: CellFormat
    var displayValue: String
    weak var worksheet: Worksheet?
    weak var workbook: Workbook?
    
    // MARK: - Initializer
    init(id: UUID = UUID(), row: Int, column: Int, value: Any? = nil, formula: String? = nil, format: CellFormat = .text) {
        self.id = id
        self.row = row
        self.column = column
        self.value = value
        self.formula = formula
        self.format = format
        self.displayValue = ""
        updateDisplayValue()
    }
    
    // MARK: - Public Methods
    mutating func calculateValue() -> Any? {
        if let formula = formula {
            // TODO: Implement formula evaluation
            // For now, we'll just return the raw formula
            return formula
        }
        return value
    }
    
    mutating func updateValue(_ newValue: Any?) {
        value = newValue
        formula = nil
        updateDisplayValue()
    }
    
    mutating func applyFormat(_ newFormat: CellFormat) {
        format = newFormat
        updateDisplayValue()
    }
    
    // MARK: - Private Methods
    private mutating func updateDisplayValue() {
        if let calculatedValue = calculateValue() {
            displayValue = formatValue(calculatedValue)
        } else {
            displayValue = ""
        }
    }
    
    private func formatValue(_ value: Any) -> String {
        switch format {
        case .number(let precision):
            if let number = value as? Double {
                return String(format: "%.\(precision)f", number)
            }
        case .currency(let locale):
            if let number = value as? Double {
                let formatter = NumberFormatter()
                formatter.numberStyle = .currency
                formatter.locale = locale
                return formatter.string(from: NSNumber(value: number)) ?? ""
            }
        case .percentage:
            if let number = value as? Double {
                return String(format: "%.2f%%", number * 100)
            }
        case .date(let dateFormat):
            if let date = value as? Date {
                let formatter = DateFormatter()
                formatter.dateFormat = dateFormat
                return formatter.string(from: date)
            }
        case .text:
            return String(describing: value)
        }
        return String(describing: value)
    }
}

// MARK: - CellProtocol
protocol CellProtocol {
    var id: UUID { get }
    var row: Int { get }
    var column: Int { get }
    var value: Any? { get set }
    var displayValue: String { get }
    
    mutating func calculateValue() -> Any?
    mutating func updateValue(_ newValue: Any?)
}

// MARK: - Codable Extension
extension Cell {
    enum CodingKeys: String, CodingKey {
        case id, row, column, value, formula, format, displayValue
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        id = try container.decode(UUID.self, forKey: .id)
        row = try container.decode(Int.self, forKey: .row)
        column = try container.decode(Int.self, forKey: .column)
        value = try container.decodeIfPresent(AnyDecodable.self, forKey: .value)?.value
        formula = try container.decodeIfPresent(String.self, forKey: .formula)
        format = try container.decode(CellFormat.self, forKey: .format)
        displayValue = try container.decode(String.self, forKey: .displayValue)
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        try container.encode(id, forKey: .id)
        try container.encode(row, forKey: .row)
        try container.encode(column, forKey: .column)
        try container.encodeIfPresent(value.map(AnyCodable.init), forKey: .value)
        try container.encodeIfPresent(formula, forKey: .formula)
        try container.encode(format, forKey: .format)
        try container.encode(displayValue, forKey: .displayValue)
    }
}

// MARK: - Helper Types for Codable
struct AnyDecodable: Decodable {
    let value: Any

    init<T>(_ value: T?) {
        self.value = value ?? ()
    }

    init(from decoder: Decoder) throws {
        let container = try decoder.singleValueContainer()
        if let string = try? container.decode(String.self) {
            value = string
        } else if let int = try? container.decode(Int.self) {
            value = int
        } else if let double = try? container.decode(Double.self) {
            value = double
        } else if let bool = try? container.decode(Bool.self) {
            value = bool
        } else if let array = try? container.decode([AnyDecodable].self) {
            value = array.map { $0.value }
        } else if let dictionary = try? container.decode([String: AnyDecodable].self) {
            value = dictionary.mapValues { $0.value }
        } else {
            value = ()
        }
    }
}

struct AnyCodable: Encodable {
    let value: Any

    init(_ value: Any) {
        self.value = value
    }

    func encode(to encoder: Encoder) throws {
        var container = encoder.singleValueContainer()
        switch value {
        case let string as String:
            try container.encode(string)
        case let int as Int:
            try container.encode(int)
        case let double as Double:
            try container.encode(double)
        case let bool as Bool:
            try container.encode(bool)
        case let array as [Any]:
            try container.encode(array.map(AnyCodable.init))
        case let dictionary as [String: Any]:
            try container.encode(dictionary.mapValues(AnyCodable.init))
        default:
            try container.encodeNil()
        }
    }
}

// MARK: - CellFormat Codable Extension
extension CellFormat: Codable {
    enum CodingKeys: String, CodingKey {
        case type, precision, locale, dateFormat
    }
    
    init(from decoder: Decoder) throws {
        let container = try decoder.container(keyedBy: CodingKeys.self)
        let type = try container.decode(String.self, forKey: .type)
        switch type {
        case "number":
            let precision = try container.decode(Int.self, forKey: .precision)
            self = .number(precision: precision)
        case "currency":
            let localeIdentifier = try container.decode(String.self, forKey: .locale)
            self = .currency(locale: Locale(identifier: localeIdentifier))
        case "percentage":
            self = .percentage
        case "date":
            let dateFormat = try container.decode(String.self, forKey: .dateFormat)
            self = .date(dateFormat: dateFormat)
        case "text":
            self = .text
        default:
            throw DecodingError.dataCorruptedError(forKey: .type, in: container, debugDescription: "Invalid CellFormat type")
        }
    }
    
    func encode(to encoder: Encoder) throws {
        var container = encoder.container(keyedBy: CodingKeys.self)
        switch self {
        case .number(let precision):
            try container.encode("number", forKey: .type)
            try container.encode(precision, forKey: .precision)
        case .currency(let locale):
            try container.encode("currency", forKey: .type)
            try container.encode(locale.identifier, forKey: .locale)
        case .percentage:
            try container.encode("percentage", forKey: .type)
        case .date(let dateFormat):
            try container.encode("date", forKey: .type)
            try container.encode(dateFormat, forKey: .dateFormat)
        case .text:
            try container.encode("text", forKey: .type)
        }
    }
}
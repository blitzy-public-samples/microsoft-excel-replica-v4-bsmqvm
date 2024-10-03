import SwiftUI
import Combine

struct CellView: View {
    @ObservedObject var viewModel: CellViewModel
    
    var body: some View {
        content
            .modifier(CellBackground())
            .accessibilityElement(children: .ignore)
            .accessibilityLabel(accessibilityLabel)
            .accessibilityValue(accessibilityValue)
    }
    
    private var content: some View {
        Text(formatValue(viewModel.cell.value))
            .font(.system(size: 14))
            .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .leading)
            .padding(4)
            .applyStyle()
            .onTapGesture(count: 2, perform: viewModel.startEditing)
            .gesture(
                DragGesture(minimumDistance: 0)
                    .onChanged { _ in viewModel.handleDragGesture() }
            )
    }
    
    private var accessibilityLabel: String {
        "Cell \(viewModel.cell.columnName)\(viewModel.cell.rowIndex)"
    }
    
    private var accessibilityValue: String {
        formatValue(viewModel.cell.value)
    }
}

extension CellView {
    private func formatValue(_ value: Any?) -> String {
        guard let value = value else { return "" }
        
        switch value {
        case let number as NSNumber:
            return NumberFormatter.localizedString(from: number, number: .decimal)
        case let date as Date:
            return DateFormatter.localizedString(from: date, dateStyle: .short, timeStyle: .short)
        case let string as String:
            return string
        default:
            return String(describing: value)
        }
    }
    
    private func applyStyle() -> some View {
        self.modifier(CellStyle(format: viewModel.cell.format, isSelected: viewModel.isSelected))
    }
}

struct CellBackground: ViewModifier {
    func body(content: Content) -> some View {
        content
            .background(Color(.systemBackground))
            .border(Color(.separator), width: 0.5)
    }
}

struct CellStyle: ViewModifier {
    let format: CellFormat
    let isSelected: Bool
    
    func body(content: Content) -> some View {
        content
            .foregroundColor(textColor)
            .background(backgroundColor)
            .font(font)
    }
    
    private var textColor: Color {
        isSelected ? .white : format.textColor
    }
    
    private var backgroundColor: Color {
        isSelected ? .blue : format.backgroundColor
    }
    
    private var font: Font {
        var font = Font.system(size: 14)
        if format.isBold {
            font = font.bold()
        }
        if format.isItalic {
            font = font.italic()
        }
        return font
    }
}

struct CellView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            CellView(viewModel: CellViewModel(cell: Cell(value: "Sample", columnName: "A", rowIndex: 1, format: CellFormat())))
            CellView(viewModel: CellViewModel(cell: Cell(value: 42, columnName: "B", rowIndex: 2, format: CellFormat(isBold: true))))
            CellView(viewModel: CellViewModel(cell: Cell(value: Date(), columnName: "C", rowIndex: 3, format: CellFormat(isItalic: true))))
        }
        .previewLayout(.fixed(width: 100, height: 40))
    }
}

// MARK: - Supporting Types (Mocked for this implementation)

struct Cell {
    var value: Any?
    var columnName: String
    var rowIndex: Int
    var format: CellFormat
}

struct CellFormat {
    var textColor: Color = .primary
    var backgroundColor: Color = .clear
    var isBold: Bool = false
    var isItalic: Bool = false
}

class CellViewModel: ObservableObject {
    @Published var cell: Cell
    @Published var isSelected: Bool = false
    
    init(cell: Cell) {
        self.cell = cell
    }
    
    func startEditing() {
        // Implement editing logic
    }
    
    func handleDragGesture() {
        // Implement drag gesture handling
    }
}
import UIKit
import Foundation

// MARK: - FormulaBarViewDelegate Protocol
protocol FormulaBarViewDelegate: AnyObject {
    func formulaBarDidUpdateCell(_ cell: Cell)
}

// MARK: - FormulaBarView
class FormulaBarView: UIView {
    
    // MARK: - Properties
    private let textField: UITextField = {
        let tf = UITextField()
        tf.borderStyle = .roundedRect
        tf.font = UIFont.systemFont(ofSize: 16)
        tf.autocorrectionType = .no
        tf.autocapitalizationType = .none
        tf.returnKeyType = .done
        return tf
    }()
    
    private var currentCell: Cell?
    weak var delegate: FormulaBarViewDelegate?
    
    // MARK: - Initialization
    override init(frame: CGRect) {
        super.init(frame: frame)
        setupView()
    }
    
    required init?(coder: NSCoder) {
        super.init(coder: coder)
        setupView()
    }
    
    // MARK: - Setup
    private func setupView() {
        backgroundColor = .systemBackground
        
        addSubview(textField)
        textField.translatesAutoresizingMaskIntoConstraints = false
        
        NSLayoutConstraint.activate([
            textField.topAnchor.constraint(equalTo: topAnchor, constant: 8),
            textField.leadingAnchor.constraint(equalTo: leadingAnchor, constant: 8),
            textField.trailingAnchor.constraint(equalTo: trailingAnchor, constant: -8),
            textField.bottomAnchor.constraint(equalTo: bottomAnchor, constant: -8)
        ])
        
        textField.delegate = self
    }
    
    // MARK: - Public Methods
    func updateForCell(_ cell: Cell?) {
        currentCell = cell
        
        if let cell = cell {
            textField.text = cell.formula ?? cell.value
            textField.isEnabled = true
        } else {
            textField.text = ""
            textField.isEnabled = false
        }
    }
}

// MARK: - UITextFieldDelegate
extension FormulaBarView: UITextFieldDelegate {
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        textField.resignFirstResponder()
        return true
    }
    
    func textFieldDidEndEditing(_ textField: UITextField) {
        guard let currentCell = currentCell else { return }
        
        let newValue = textField.text ?? ""
        
        // Assuming Cell has a method to update its value
        currentCell.updateValue(newValue)
        
        delegate?.formulaBarDidUpdateCell(currentCell)
    }
}

// MARK: - Cell Stub
// This is a temporary stub for the Cell model. Replace it with the actual implementation when available.
class Cell {
    var value: String?
    var formula: String?
    
    func updateValue(_ newValue: String) {
        // Determine if the new value is a formula or a simple value
        if newValue.starts(with: "=") {
            formula = newValue
            // Here you would typically calculate the result of the formula
            value = "Result of \(newValue)"
        } else {
            formula = nil
            value = newValue
        }
    }
}
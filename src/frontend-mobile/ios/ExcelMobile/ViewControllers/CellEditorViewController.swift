import UIKit
import Combine

// MARK: - Cell Model (Placeholder)
struct Cell {
    var value: String
    var formula: String?
    var format: CellFormat
}

enum CellFormat {
    case general
    case number
    case currency
    case date
    case percentage
    // Add more formats as needed
}

// MARK: - CellView Protocol (Placeholder)
protocol CellView: UIView {
    var cell: Cell? { get set }
    func updateDisplay()
}

// MARK: - APIService Protocol (Placeholder)
protocol APIService {
    func saveCell(_ cell: Cell, completion: @escaping (Result<Void, Error>) -> Void)
}

class CellEditorViewController: UIViewController {
    
    // MARK: - Properties
    var cell: Cell
    let apiService: APIService
    var cellView: CellView
    
    private var textField: UITextField!
    private var formulaButton: UIButton!
    private var formatButton: UIButton!
    private var cancelButton: UIBarButtonItem!
    private var saveButton: UIBarButtonItem!
    
    private var cancellables = Set<AnyCancellable>()
    
    // MARK: - Initialization
    init(cell: Cell, apiService: APIService, cellView: CellView) {
        self.cell = cell
        self.apiService = apiService
        self.cellView = cellView
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - Lifecycle Methods
    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        setupBindings()
    }
    
    // MARK: - UI Setup
    private func setupUI() {
        view.backgroundColor = .systemBackground
        
        // TextField setup
        textField = UITextField()
        textField.borderStyle = .roundedRect
        textField.delegate = self
        view.addSubview(textField)
        
        // Formula Button setup
        formulaButton = UIButton(type: .system)
        formulaButton.setTitle("f(x)", for: .normal)
        formulaButton.addTarget(self, action: #selector(toggleFormulaMode), for: .touchUpInside)
        view.addSubview(formulaButton)
        
        // Format Button setup
        formatButton = UIButton(type: .system)
        formatButton.setTitle("Format", for: .normal)
        formatButton.addTarget(self, action: #selector(openFormatOptions), for: .touchUpInside)
        view.addSubview(formatButton)
        
        // Navigation Bar Buttons
        cancelButton = UIBarButtonItem(barButtonSystemItem: .cancel, target: self, action: #selector(cancelEditing))
        saveButton = UIBarButtonItem(barButtonSystemItem: .save, target: self, action: #selector(saveChanges))
        navigationItem.leftBarButtonItem = cancelButton
        navigationItem.rightBarButtonItem = saveButton
        
        // Layout constraints
        textField.translatesAutoresizingMaskIntoConstraints = false
        formulaButton.translatesAutoresizingMaskIntoConstraints = false
        formatButton.translatesAutoresizingMaskIntoConstraints = false
        
        NSLayoutConstraint.activate([
            textField.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 20),
            textField.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            textField.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
            
            formulaButton.topAnchor.constraint(equalTo: textField.bottomAnchor, constant: 20),
            formulaButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
            
            formatButton.topAnchor.constraint(equalTo: textField.bottomAnchor, constant: 20),
            formatButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20)
        ])
    }
    
    // MARK: - Bindings
    private func setupBindings() {
        // Update textField with cell value
        textField.text = cell.formula ?? cell.value
        
        // Observe textField changes
        NotificationCenter.default.publisher(for: UITextField.textDidChangeNotification, object: textField)
            .compactMap { ($0.object as? UITextField)?.text }
            .sink { [weak self] text in
                self?.cell.value = text
                self?.cell.formula = nil // Clear formula when editing directly
            }
            .store(in: &cancellables)
    }
    
    // MARK: - Actions
    @objc private func toggleFormulaMode() {
        // Toggle between value and formula editing
        if textField.text == cell.value {
            textField.text = cell.formula
            formulaButton.setTitle("Value", for: .normal)
        } else {
            textField.text = cell.value
            formulaButton.setTitle("f(x)", for: .normal)
        }
    }
    
    @objc private func openFormatOptions() {
        let alertController = UIAlertController(title: "Cell Format", message: nil, preferredStyle: .actionSheet)
        
        let formats: [CellFormat] = [.general, .number, .currency, .date, .percentage]
        for format in formats {
            alertController.addAction(UIAlertAction(title: "\(format)", style: .default) { [weak self] _ in
                self?.cell.format = format
                self?.cellView.updateDisplay()
            })
        }
        
        alertController.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))
        
        present(alertController, animated: true, completion: nil)
    }
    
    @objc private func saveChanges() {
        apiService.saveCell(cell) { [weak self] result in
            switch result {
            case .success:
                self?.cellView.cell = self?.cell
                self?.cellView.updateDisplay()
                self?.dismiss(animated: true, completion: nil)
            case .failure(let error):
                self?.showErrorAlert(message: error.localizedDescription)
            }
        }
    }
    
    @objc private func cancelEditing() {
        dismiss(animated: true, completion: nil)
    }
    
    // MARK: - Helper Methods
    private func showErrorAlert(message: String) {
        let alertController = UIAlertController(title: "Error", message: message, preferredStyle: .alert)
        alertController.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        present(alertController, animated: true, completion: nil)
    }
}

// MARK: - UITextFieldDelegate
extension CellEditorViewController: UITextFieldDelegate {
    func textFieldDidChangeSelection(_ textField: UITextField) {
        // Update cell value as the user types
        cell.value = textField.text ?? ""
        cell.formula = nil // Clear formula when editing directly
    }
    
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        // Handle return key press
        textField.resignFirstResponder()
        saveChanges()
        return true
    }
}
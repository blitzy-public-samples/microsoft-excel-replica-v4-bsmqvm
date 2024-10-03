import UIKit
import Foundation

class WorksheetViewController: UIViewController {
    // MARK: - Properties
    private let worksheet: Worksheet
    private var tableView: UITableView!
    private var formulaBarView: FormulaBarView!
    private var selectedCell: Cell?
    private let apiService: APIService
    
    // MARK: - Initialization
    init(worksheet: Worksheet, apiService: APIService) {
        self.worksheet = worksheet
        self.apiService = apiService
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    // MARK: - Lifecycle Methods
    override func viewDidLoad() {
        super.viewDidLoad()
        setupTableView()
        setupFormulaBarView()
        loadInitialWorksheetData()
    }
    
    // MARK: - Setup Methods
    private func setupTableView() {
        tableView = UITableView(frame: view.bounds, style: .plain)
        tableView.dataSource = self
        tableView.delegate = self
        tableView.register(CellView.self, forCellReuseIdentifier: "CellView")
        view.addSubview(tableView)
        
        // Setup constraints
        tableView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            tableView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            tableView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            tableView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            tableView.bottomAnchor.constraint(equalTo: view.bottomAnchor)
        ])
    }
    
    private func setupFormulaBarView() {
        formulaBarView = FormulaBarView(frame: .zero)
        view.addSubview(formulaBarView)
        
        // Setup constraints
        formulaBarView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            formulaBarView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            formulaBarView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            formulaBarView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            formulaBarView.heightAnchor.constraint(equalToConstant: 44)
        ])
        
        // Adjust table view top constraint
        if let constraint = tableView.constraints.first(where: { $0.firstAttribute == .top }) {
            constraint.isActive = false
        }
        tableView.topAnchor.constraint(equalTo: formulaBarView.bottomAnchor).isActive = true
    }
    
    // MARK: - Data Loading
    private func loadInitialWorksheetData() {
        // TODO: Implement data loading from the worksheet model
        // This would typically involve populating the cells with data from the worksheet
        tableView.reloadData()
    }
    
    // MARK: - Cell Update
    func updateCell(at indexPath: IndexPath, with value: Any?) {
        // Update the cell value in the worksheet model
        // For now, we'll assume the worksheet has a method to update a cell
        worksheet.updateCell(at: indexPath, with: value)
        
        // Update the cell view
        if let cell = tableView.cellForRow(at: indexPath) as? CellView {
            cell.configure(with: value)
        }
        
        // Trigger recalculation of dependent cells
        recalculateVisibleCells()
    }
    
    // MARK: - Recalculation
    private func recalculateVisibleCells() {
        // Get visible cells from table view
        guard let visibleCells = tableView.visibleCells as? [CellView] else { return }
        
        // Recalculate values for visible cells
        for cell in visibleCells {
            // Assuming each CellView has an indexPath property
            guard let indexPath = cell.indexPath else { continue }
            
            // Recalculate the cell value
            // This would typically involve calling a method on the worksheet to recalculate the cell
            if let newValue = worksheet.recalculateCell(at: indexPath) {
                cell.configure(with: newValue)
            }
        }
    }
}

// MARK: - UITableViewDataSource
extension WorksheetViewController: UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return worksheet.rowCount // Assuming Worksheet has a rowCount property
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: "CellView", for: indexPath) as? CellView else {
            fatalError("Unable to dequeue CellView")
        }
        
        // Configure the cell with data from the worksheet
        if let cellData = worksheet.cell(at: indexPath) {
            cell.configure(with: cellData.value)
        }
        
        return cell
    }
}

// MARK: - UITableViewDelegate
extension WorksheetViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        // Handle cell selection
        if let cell = worksheet.cell(at: indexPath) {
            selectedCell = cell
            formulaBarView.setFormula(cell.formula ?? "")
        }
    }
}
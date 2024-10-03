import UIKit
import Charts

class ChartViewController: UIViewController {
    
    // MARK: - Properties
    
    private var chartView: ChartView!
    private var workbook: Workbook?
    private var worksheet: Worksheet?
    private var chartType: ChartType = .bar
    private let apiService = APIService()
    
    // MARK: - Lifecycle Methods
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setupChartView()
        setupUI()
        loadInitialData()
    }
    
    // MARK: - Setup Methods
    
    private func setupChartView() {
        chartView = ChartView(frame: view.bounds)
        chartView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        view.addSubview(chartView)
    }
    
    private func setupUI() {
        navigationItem.title = "Chart"
        navigationItem.rightBarButtonItem = UIBarButtonItem(title: "Change Type", style: .plain, target: self, action: #selector(changeChartTypeButtonTapped))
        
        let exportButton = UIBarButtonItem(title: "Export", style: .plain, target: self, action: #selector(exportChartButtonTapped))
        let refreshButton = UIBarButtonItem(barButtonSystemItem: .refresh, target: self, action: #selector(refreshDataButtonTapped))
        navigationItem.leftBarButtonItems = [exportButton, refreshButton]
    }
    
    private func loadInitialData() {
        // TODO: Load initial data from the current worksheet
        updateChart()
    }
    
    // MARK: - Chart Update Methods
    
    private func updateChart() {
        guard let worksheet = worksheet else { return }
        
        // Extract data from worksheet
        let data = extractDataFromWorksheet(worksheet)
        
        // Format data for chart library
        let formattedData = formatDataForChart(data)
        
        // Update chartView with new data
        chartView.updateData(formattedData, chartType: chartType)
        
        // Apply any custom styling or settings
        applyChartStyling()
        
        // Trigger chart redraw
        chartView.redraw()
    }
    
    private func extractDataFromWorksheet(_ worksheet: Worksheet) -> [[Any]] {
        // TODO: Implement data extraction logic
        return []
    }
    
    private func formatDataForChart(_ data: [[Any]]) -> ChartData {
        // TODO: Implement data formatting logic for the Charts library
        return ChartData()
    }
    
    private func applyChartStyling() {
        // TODO: Apply custom styling to the chart
    }
    
    // MARK: - Action Methods
    
    @objc private func changeChartTypeButtonTapped() {
        let alertController = UIAlertController(title: "Select Chart Type", message: nil, preferredStyle: .actionSheet)
        
        ChartType.allCases.forEach { type in
            let action = UIAlertAction(title: type.displayName, style: .default) { [weak self] _ in
                self?.changeChartType(to: type)
            }
            alertController.addAction(action)
        }
        
        let cancelAction = UIAlertAction(title: "Cancel", style: .cancel, handler: nil)
        alertController.addAction(cancelAction)
        
        present(alertController, animated: true, completion: nil)
    }
    
    private func changeChartType(to type: ChartType) {
        chartType = type
        updateChart()
    }
    
    @objc private func exportChartButtonTapped() {
        guard let chartImage = chartView.getChartImage() else {
            showAlert(title: "Error", message: "Failed to generate chart image")
            return
        }
        
        let activityViewController = UIActivityViewController(activityItems: [chartImage], applicationActivities: nil)
        present(activityViewController, animated: true, completion: nil)
    }
    
    @objc private func refreshDataButtonTapped() {
        refreshData()
    }
    
    private func refreshData() {
        // Fetch latest data from the API
        apiService.fetchLatestWorksheetData { [weak self] result in
            DispatchQueue.main.async {
                switch result {
                case .success(let updatedWorksheet):
                    self?.worksheet = updatedWorksheet
                    self?.updateChart()
                case .failure(let error):
                    self?.showAlert(title: "Error", message: "Failed to refresh data: \(error.localizedDescription)")
                }
            }
        }
    }
    
    // MARK: - Helper Methods
    
    private func showAlert(title: String, message: String) {
        let alertController = UIAlertController(title: title, message: message, preferredStyle: .alert)
        let okAction = UIAlertAction(title: "OK", style: .default, handler: nil)
        alertController.addAction(okAction)
        present(alertController, animated: true, completion: nil)
    }
}

// MARK: - ChartType Enum

enum ChartType: CaseIterable {
    case bar
    case line
    case pie
    case scatter
    
    var displayName: String {
        switch self {
        case .bar: return "Bar Chart"
        case .line: return "Line Chart"
        case .pie: return "Pie Chart"
        case .scatter: return "Scatter Plot"
        }
    }
}

// MARK: - Mock Types (Replace with actual implementations)

struct Workbook {}
struct Worksheet {}
struct ChartData {}
struct ChartView: UIView {
    func updateData(_ data: ChartData, chartType: ChartType) {}
    func redraw() {}
    func getChartImage() -> UIImage? { return nil }
}
struct APIService {
    func fetchLatestWorksheetData(completion: @escaping (Result<Worksheet, Error>) -> Void) {}
}
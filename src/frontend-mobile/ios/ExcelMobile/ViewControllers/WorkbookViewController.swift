import UIKit
import Foundation

class WorkbookViewController: UIViewController {
    // MARK: - Properties
    private let workbookId: String
    private var workbook: Workbook?
    private let worksheetContainerView: UIView
    private let worksheetTabsCollectionView: UICollectionView
    private let apiService: APIService
    private let authService: AuthenticationService

    // MARK: - Initialization
    init(workbookId: String, apiService: APIService, authService: AuthenticationService) {
        self.workbookId = workbookId
        self.apiService = apiService
        self.authService = authService
        self.worksheetContainerView = UIView()
        
        let layout = UICollectionViewFlowLayout()
        layout.scrollDirection = .horizontal
        self.worksheetTabsCollectionView = UICollectionView(frame: .zero, collectionViewLayout: layout)
        
        super.init(nibName: nil, bundle: nil)
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }

    // MARK: - Lifecycle Methods
    override func viewDidLoad() {
        super.viewDidLoad()
        setupViews()
        loadWorkbook()
    }

    // MARK: - Private Methods
    private func setupViews() {
        view.backgroundColor = .white
        
        // Setup worksheet container view
        view.addSubview(worksheetContainerView)
        worksheetContainerView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            worksheetContainerView.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor),
            worksheetContainerView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            worksheetContainerView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            worksheetContainerView.bottomAnchor.constraint(equalTo: view.bottomAnchor, constant: -50) // Leave space for tabs
        ])
        
        // Setup worksheet tabs collection view
        setupWorksheetTabs()
    }

    private func setupWorksheetTabs() {
        view.addSubview(worksheetTabsCollectionView)
        worksheetTabsCollectionView.translatesAutoresizingMaskIntoConstraints = false
        NSLayoutConstraint.activate([
            worksheetTabsCollectionView.leadingAnchor.constraint(equalTo: view.leadingAnchor),
            worksheetTabsCollectionView.trailingAnchor.constraint(equalTo: view.trailingAnchor),
            worksheetTabsCollectionView.bottomAnchor.constraint(equalTo: view.bottomAnchor),
            worksheetTabsCollectionView.heightAnchor.constraint(equalToConstant: 50)
        ])
        
        worksheetTabsCollectionView.backgroundColor = .lightGray
        worksheetTabsCollectionView.dataSource = self
        worksheetTabsCollectionView.delegate = self
        worksheetTabsCollectionView.register(UICollectionViewCell.self, forCellWithReuseIdentifier: "WorksheetTabCell")
    }

    private func loadWorkbook() {
        apiService.fetchWorkbook(id: workbookId) { [weak self] result in
            switch result {
            case .success(let workbook):
                self?.workbook = workbook
                DispatchQueue.main.async {
                    self?.worksheetTabsCollectionView.reloadData()
                    self?.displayWorksheet(at: 0)
                }
            case .failure(let error):
                print("Error loading workbook: \(error)")
                // TODO: Show error alert to user
            }
        }
    }

    private func displayWorksheet(at index: Int) {
        guard let worksheet = workbook?.worksheets[index] else { return }
        
        // Remove any existing worksheet view controller
        for child in children {
            child.removeFromParent()
            child.view.removeFromSuperview()
        }
        
        let worksheetViewController = WorksheetViewController(worksheet: worksheet)
        addChild(worksheetViewController)
        worksheetContainerView.addSubview(worksheetViewController.view)
        worksheetViewController.view.frame = worksheetContainerView.bounds
        worksheetViewController.didMove(toParent: self)
    }

    private func saveWorkbook() {
        guard let workbook = workbook else { return }
        
        apiService.saveWorkbook(workbook) { [weak self] result in
            switch result {
            case .success:
                print("Workbook saved successfully")
                // TODO: Show success message to user
            case .failure(let error):
                print("Error saving workbook: \(error)")
                // TODO: Show error alert to user
            }
        }
    }

    private func addNewWorksheet() {
        let newWorksheet = Worksheet(name: "New Sheet \(workbook?.worksheets.count ?? 0 + 1)")
        workbook?.worksheets.append(newWorksheet)
        
        DispatchQueue.main.async {
            self.worksheetTabsCollectionView.reloadData()
            self.displayWorksheet(at: (self.workbook?.worksheets.count ?? 1) - 1)
        }
    }
}

// MARK: - UICollectionViewDataSource
extension WorkbookViewController: UICollectionViewDataSource {
    func collectionView(_ collectionView: UICollectionView, numberOfItemsInSection section: Int) -> Int {
        return workbook?.worksheets.count ?? 0
    }
    
    func collectionView(_ collectionView: UICollectionView, cellForItemAt indexPath: IndexPath) -> UICollectionViewCell {
        let cell = collectionView.dequeueReusableCell(withReuseIdentifier: "WorksheetTabCell", for: indexPath)
        cell.backgroundColor = .white
        
        // Configure the cell
        if let worksheet = workbook?.worksheets[indexPath.item] {
            let label = UILabel(frame: cell.contentView.bounds)
            label.text = worksheet.name
            label.textAlignment = .center
            cell.contentView.addSubview(label)
        }
        
        return cell
    }
}

// MARK: - UICollectionViewDelegate
extension WorkbookViewController: UICollectionViewDelegate {
    func collectionView(_ collectionView: UICollectionView, didSelectItemAt indexPath: IndexPath) {
        displayWorksheet(at: indexPath.item)
    }
}
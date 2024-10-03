import XCTest

class ExcelMobileUITests: XCTestCase {
    
    var app: XCUIApplication!
    
    override func setUp() {
        super.setUp()
        
        // Initialize the XCUIApplication instance
        app = XCUIApplication()
        
        // Set launch arguments and environment if needed
        // app.launchArguments = ["--uitesting"]
        
        // Launch the application
        app.launch()
    }
    
    override func tearDown() {
        // Perform any necessary cleanup
        super.tearDown()
    }
    
    func testAppLaunch() {
        // Verify the presence of key UI elements
        XCTAssertTrue(app.navigationBars["Excel Mobile"].exists, "Excel Mobile navigation bar should be visible")
        XCTAssertTrue(app.buttons["New Workbook"].exists, "New Workbook button should be visible")
        XCTAssertTrue(app.buttons["Open Workbook"].exists, "Open Workbook button should be visible")
        
        // Assert that the main screen is displayed correctly
        XCTAssertTrue(app.staticTexts["Welcome to Excel Mobile"].exists, "Welcome message should be visible")
    }
    
    func testWorkbookCreation() {
        // Tap on 'New Workbook' button
        app.buttons["New Workbook"].tap()
        
        // Verify that a new workbook is created
        XCTAssertTrue(app.navigationBars["Untitled Workbook"].exists, "New workbook should be created")
        
        // Assert that the workbook is displayed in the UI
        XCTAssertTrue(app.sheets["Sheet1"].exists, "Sheet1 should be visible")
        XCTAssertTrue(app.cells["A1"].exists, "Cell A1 should be visible")
    }
    
    func testCellEditing() {
        // Create a new workbook
        app.buttons["New Workbook"].tap()
        
        // Select a cell
        let cellA1 = app.cells["A1"]
        cellA1.tap()
        
        // Enter data into the cell
        cellA1.typeText("Test Data")
        
        // Verify that the data is displayed correctly
        XCTAssertEqual(cellA1.value as? String, "Test Data", "Cell A1 should contain 'Test Data'")
        
        // Enter a formula into another cell
        let cellB1 = app.cells["B1"]
        cellB1.tap()
        cellB1.typeText("=SUM(1,2,3)")
        
        // Verify that the formula is calculated and displayed correctly
        XCTAssertEqual(cellB1.value as? String, "6", "Cell B1 should display the result of SUM(1,2,3)")
    }
    
    func testChartCreation() {
        // Create a new workbook and enter some data
        app.buttons["New Workbook"].tap()
        app.cells["A1"].tap()
        app.cells["A1"].typeText("Category")
        app.cells["B1"].tap()
        app.cells["B1"].typeText("Value")
        app.cells["A2"].tap()
        app.cells["A2"].typeText("Item 1")
        app.cells["B2"].tap()
        app.cells["B2"].typeText("10")
        app.cells["A3"].tap()
        app.cells["A3"].typeText("Item 2")
        app.cells["B3"].tap()
        app.cells["B3"].typeText("20")
        
        // Select a range of cells
        app.cells["A1"].press(forDuration: 0.5)
        app.cells["B3"].tap()
        
        // Open the chart creation menu
        app.buttons["Insert"].tap()
        app.buttons["Chart"].tap()
        
        // Choose a chart type
        app.buttons["Bar Chart"].tap()
        
        // Create the chart
        app.buttons["Create Chart"].tap()
        
        // Verify that the chart is displayed correctly
        XCTAssertTrue(app.otherElements["BarChart"].exists, "Bar chart should be visible")
    }
    
    func testWorksheetNavigation() {
        // Open a workbook with multiple worksheets
        app.buttons["New Workbook"].tap()
        app.buttons["Add Sheet"].tap()
        app.buttons["Add Sheet"].tap()
        
        // Navigate to different worksheets
        app.buttons["Sheet2"].tap()
        XCTAssertTrue(app.navigationBars["Sheet2"].exists, "Sheet2 should be active")
        
        app.buttons["Sheet3"].tap()
        XCTAssertTrue(app.navigationBars["Sheet3"].exists, "Sheet3 should be active")
        
        app.buttons["Sheet1"].tap()
        XCTAssertTrue(app.navigationBars["Sheet1"].exists, "Sheet1 should be active")
    }
    
    func testFormulaAutocomplete() {
        // Create a new workbook
        app.buttons["New Workbook"].tap()
        
        // Select a cell
        let cellA1 = app.cells["A1"]
        cellA1.tap()
        
        // Start entering a formula
        cellA1.typeText("=SU")
        
        // Verify that autocomplete suggestions appear
        XCTAssertTrue(app.tables["FormulaAutocomplete"].exists, "Autocomplete suggestions should appear")
        XCTAssertTrue(app.tables["FormulaAutocomplete"].cells.staticTexts["SUM"].exists, "SUM function should be suggested")
        
        // Select an autocomplete suggestion
        app.tables["FormulaAutocomplete"].cells.staticTexts["SUM"].tap()
        
        // Verify that the selected function is inserted correctly
        XCTAssertEqual(cellA1.value as? String, "=SUM(", "SUM function should be inserted in the cell")
    }
}

// MARK: - Human Tasks
// 1. Implement additional UI tests for more complex scenarios, such as data filtering and sorting.
// 2. Add UI tests for accessibility features to ensure the app is usable by people with diverse abilities.
// 3. Create UI tests for different device orientations (portrait and landscape) to verify proper layout adaptation.
// 4. Implement UI tests for offline mode functionality to ensure basic features work without an internet connection.
// 5. Add UI tests for collaboration features, simulating multiple users editing the same workbook.
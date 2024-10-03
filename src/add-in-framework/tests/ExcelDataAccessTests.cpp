#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include "../api/ExcelDataAccess.h"
#include "../interfaces/IExcelInterop.h"
#include "../utils/ErrorHandler.h"
#include "../security/PermissionManager.h"

using ::testing::_;
using ::testing::Return;
using ::testing::NiceMock;

// Mock class for IExcelInterop
class MockExcelInterop : public IExcelInterop {
public:
    MOCK_METHOD(std::string, GetCellValue, (const std::string&, const std::string&), (override));
    MOCK_METHOD(void, SetCellValue, (const std::string&, const std::string&, const std::string&), (override));
    MOCK_METHOD(std::vector<std::vector<std::string>>, GetRangeValues, (const std::string&, const std::string&), (override));
    MOCK_METHOD(void, SetRangeValues, (const std::string&, const std::string&, const std::vector<std::vector<std::string>>&), (override));
    MOCK_METHOD(void, AddWorksheet, (const std::string&), (override));
    MOCK_METHOD(void, DeleteWorksheet, (const std::string&), (override));
    MOCK_METHOD(std::vector<std::string>, GetWorksheetNames, (), (override));
};

class ExcelDataAccessTests : public ::testing::Test {
protected:
    void SetUp() override {
        mockExcelInterop = std::make_shared<NiceMock<MockExcelInterop>>();
        errorHandler = std::make_shared<ErrorHandler>();
        permissionManager = std::make_shared<PermissionManager>();
        excelDataAccess = std::make_unique<ExcelDataAccess>(mockExcelInterop, errorHandler, permissionManager);
    }

    std::shared_ptr<MockExcelInterop> mockExcelInterop;
    std::shared_ptr<ErrorHandler> errorHandler;
    std::shared_ptr<PermissionManager> permissionManager;
    std::unique_ptr<ExcelDataAccess> excelDataAccess;
};

TEST_F(ExcelDataAccessTests, GetCellValue_ValidInput_ReturnsExpectedValue) {
    // Arrange
    const std::string worksheet = "Sheet1";
    const std::string cellReference = "A1";
    const std::string expectedValue = "Test Value";

    EXPECT_CALL(*mockExcelInterop, GetCellValue(worksheet, cellReference))
        .WillOnce(Return(expectedValue));

    // Act
    std::string result = excelDataAccess->GetCellValue(worksheet, cellReference);

    // Assert
    EXPECT_EQ(result, expectedValue);
}

TEST_F(ExcelDataAccessTests, SetCellValue_ValidInput_SuccessfullySetsCellValue) {
    // Arrange
    const std::string worksheet = "Sheet1";
    const std::string cellReference = "A1";
    const std::string value = "New Value";

    EXPECT_CALL(*mockExcelInterop, SetCellValue(worksheet, cellReference, value))
        .Times(1);

    // Act & Assert
    EXPECT_NO_THROW(excelDataAccess->SetCellValue(worksheet, cellReference, value));
}

TEST_F(ExcelDataAccessTests, GetRangeValues_ValidInput_ReturnsExpectedValues) {
    // Arrange
    const std::string worksheet = "Sheet1";
    const std::string rangeReference = "A1:B2";
    const std::vector<std::vector<std::string>> expectedValues = {
        {"Value1", "Value2"},
        {"Value3", "Value4"}
    };

    EXPECT_CALL(*mockExcelInterop, GetRangeValues(worksheet, rangeReference))
        .WillOnce(Return(expectedValues));

    // Act
    std::vector<std::vector<std::string>> result = excelDataAccess->GetRangeValues(worksheet, rangeReference);

    // Assert
    EXPECT_EQ(result, expectedValues);
}

TEST_F(ExcelDataAccessTests, SetRangeValues_ValidInput_Successfully_SetsRangeValues) {
    // Arrange
    const std::string worksheet = "Sheet1";
    const std::string rangeReference = "A1:B2";
    const std::vector<std::vector<std::string>> values = {
        {"New1", "New2"},
        {"New3", "New4"}
    };

    EXPECT_CALL(*mockExcelInterop, SetRangeValues(worksheet, rangeReference, values))
        .Times(1);

    // Act & Assert
    EXPECT_NO_THROW(excelDataAccess->SetRangeValues(worksheet, rangeReference, values));
}

TEST_F(ExcelDataAccessTests, AddWorksheet_ValidInput_SuccessfullyAddsWorksheet) {
    // Arrange
    const std::string worksheetName = "NewSheet";

    EXPECT_CALL(*mockExcelInterop, AddWorksheet(worksheetName))
        .Times(1);

    // Act & Assert
    EXPECT_NO_THROW(excelDataAccess->AddWorksheet(worksheetName));
}

TEST_F(ExcelDataAccessTests, DeleteWorksheet_ValidInput_SuccessfullyDeletesWorksheet) {
    // Arrange
    const std::string worksheetName = "SheetToDelete";

    EXPECT_CALL(*mockExcelInterop, DeleteWorksheet(worksheetName))
        .Times(1);

    // Act & Assert
    EXPECT_NO_THROW(excelDataAccess->DeleteWorksheet(worksheetName));
}

TEST_F(ExcelDataAccessTests, GetWorksheetNames_ReturnsExpectedNames) {
    // Arrange
    const std::vector<std::string> expectedNames = {"Sheet1", "Sheet2", "Sheet3"};

    EXPECT_CALL(*mockExcelInterop, GetWorksheetNames())
        .WillOnce(Return(expectedNames));

    // Act
    std::vector<std::string> result = excelDataAccess->GetWorksheetNames();

    // Assert
    EXPECT_EQ(result, expectedNames);
}

TEST_F(ExcelDataAccessTests, GetCellValue_InvalidInput_ThrowsException) {
    // Arrange
    const std::string worksheet = "InvalidSheet";
    const std::string cellReference = "A1";

    EXPECT_CALL(*mockExcelInterop, GetCellValue(worksheet, cellReference))
        .WillOnce(Throw(std::runtime_error("Invalid worksheet")));

    // Act & Assert
    EXPECT_THROW(excelDataAccess->GetCellValue(worksheet, cellReference), std::runtime_error);
}

TEST_F(ExcelDataAccessTests, SetCellValue_InsufficientPermissions_ThrowsException) {
    // Arrange
    const std::string worksheet = "Sheet1";
    const std::string cellReference = "A1";
    const std::string value = "New Value";

    // Simulate insufficient permissions
    EXPECT_CALL(*permissionManager, HasPermission("SetCellValue"))
        .WillOnce(Return(false));

    // Act & Assert
    EXPECT_THROW(excelDataAccess->SetCellValue(worksheet, cellReference, value), std::runtime_error);
}

// Add more test cases to cover error handling, edge cases, and other scenarios

int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
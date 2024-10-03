#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include "../AddInManager.h"
#include "../interfaces/IAddIn.h"
#include "../interfaces/IAddInHost.h"
#include "../interfaces/IExcelInterop.h"

using ::testing::_;
using ::testing::Return;
using ::testing::NiceMock;

// Mock classes
class MockAddInHost : public IAddInHost {
public:
    MOCK_METHOD(bool, Initialize, (), (override));
    MOCK_METHOD(void, Shutdown, (), (override));
};

class MockExcelInterop : public IExcelInterop {
public:
    MOCK_METHOD(bool, Connect, (), (override));
    MOCK_METHOD(void, Disconnect, (), (override));
};

class MockAddIn : public IAddIn {
public:
    MOCK_METHOD(bool, Initialize, (), (override));
    MOCK_METHOD(void, Shutdown, (), (override));
    MOCK_METHOD(void, OnCalculate, (), (override));
    MOCK_METHOD(void, OnCommand, (const std::string&), (override));
};

class AddInManagerTest : public ::testing::Test {
protected:
    void SetUp() override {
        mockHost = std::make_shared<NiceMock<MockAddInHost>>();
        mockInterop = std::make_shared<NiceMock<MockExcelInterop>>();
        addInManager = std::make_unique<AddInManager>(mockHost, mockInterop);
    }

    std::shared_ptr<MockAddInHost> mockHost;
    std::shared_ptr<MockExcelInterop> mockInterop;
    std::unique_ptr<AddInManager> addInManager;
};

TEST_F(AddInManagerTest, LoadAddIn) {
    // Arrange
    const std::string testAddInPath = "C:\\TestAddIns\\TestAddIn.dll";
    auto mockAddIn = std::make_shared<NiceMock<MockAddIn>>();
    
    EXPECT_CALL(*mockInterop, Connect()).WillOnce(Return(true));
    EXPECT_CALL(*mockAddIn, Initialize()).WillOnce(Return(true));

    // Act
    bool result = addInManager->LoadAddIn(testAddInPath);

    // Assert
    EXPECT_TRUE(result);
}

TEST_F(AddInManagerTest, UnloadAddIn) {
    // Arrange
    const std::string testAddInName = "TestAddIn";
    auto mockAddIn = std::make_shared<NiceMock<MockAddIn>>();
    addInManager->loadedAddIns[testAddInName] = mockAddIn;

    EXPECT_CALL(*mockAddIn, Shutdown());

    // Act
    bool result = addInManager->UnloadAddIn(testAddInName);

    // Assert
    EXPECT_TRUE(result);
    EXPECT_EQ(addInManager->loadedAddIns.count(testAddInName), 0);
}

TEST_F(AddInManagerTest, InitializeAddIns) {
    // Arrange
    auto mockAddIn1 = std::make_shared<NiceMock<MockAddIn>>();
    auto mockAddIn2 = std::make_shared<NiceMock<MockAddIn>>();
    addInManager->loadedAddIns["AddIn1"] = mockAddIn1;
    addInManager->loadedAddIns["AddIn2"] = mockAddIn2;

    EXPECT_CALL(*mockAddIn1, Initialize()).WillOnce(Return(true));
    EXPECT_CALL(*mockAddIn2, Initialize()).WillOnce(Return(true));

    // Act
    addInManager->InitializeAddIns();

    // Assert
    // Verification is done by the EXPECT_CALL statements
}

TEST_F(AddInManagerTest, ShutdownAddIns) {
    // Arrange
    auto mockAddIn1 = std::make_shared<NiceMock<MockAddIn>>();
    auto mockAddIn2 = std::make_shared<NiceMock<MockAddIn>>();
    addInManager->loadedAddIns["AddIn1"] = mockAddIn1;
    addInManager->loadedAddIns["AddIn2"] = mockAddIn2;

    EXPECT_CALL(*mockAddIn1, Shutdown());
    EXPECT_CALL(*mockAddIn2, Shutdown());

    // Act
    addInManager->ShutdownAddIns();

    // Assert
    // Verification is done by the EXPECT_CALL statements
}

TEST_F(AddInManagerTest, OnCalculate) {
    // Arrange
    auto mockAddIn1 = std::make_shared<NiceMock<MockAddIn>>();
    auto mockAddIn2 = std::make_shared<NiceMock<MockAddIn>>();
    addInManager->loadedAddIns["AddIn1"] = mockAddIn1;
    addInManager->loadedAddIns["AddIn2"] = mockAddIn2;

    EXPECT_CALL(*mockAddIn1, OnCalculate());
    EXPECT_CALL(*mockAddIn2, OnCalculate());

    // Act
    addInManager->OnCalculate();

    // Assert
    // Verification is done by the EXPECT_CALL statements
}

TEST_F(AddInManagerTest, ExecuteCommand) {
    // Arrange
    const std::string testCommand = "TestCommand";
    auto mockAddIn1 = std::make_shared<NiceMock<MockAddIn>>();
    auto mockAddIn2 = std::make_shared<NiceMock<MockAddIn>>();
    addInManager->loadedAddIns["AddIn1"] = mockAddIn1;
    addInManager->loadedAddIns["AddIn2"] = mockAddIn2;

    EXPECT_CALL(*mockAddIn1, OnCommand(testCommand));
    EXPECT_CALL(*mockAddIn2, OnCommand(testCommand));

    // Act
    addInManager->ExecuteCommand(testCommand);

    // Assert
    // Verification is done by the EXPECT_CALL statements
}

int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
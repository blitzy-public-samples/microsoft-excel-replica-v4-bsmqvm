#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include "../office/OfficeAddInHost.h"
#include "../interfaces/IExcelInterop.h"
#include "../office/OfficeAddInManifest.h"
#include "../utils/AddInLogger.h"

using ::testing::_;
using ::testing::Return;
using ::testing::NiceMock;

// Mock classes
class MockExcelInterop : public IExcelInterop {
public:
    MOCK_METHOD(bool, RegisterFunction, (const std::string&, const std::string&), (override));
    MOCK_METHOD(bool, UnregisterFunction, (const std::string&), (override));
    MOCK_METHOD(bool, AddMenuItem, (const std::string&, const std::string&), (override));
    MOCK_METHOD(bool, RemoveMenuItem, (const std::string&), (override));
};

class MockOfficeAddInManifest : public OfficeAddInManifest {
public:
    MOCK_METHOD(std::string, GetAddInName, (), (const, override));
    MOCK_METHOD(std::string, GetAddInVersion, (), (const, override));
    MOCK_METHOD(std::string, GetAddInDescription, (), (const, override));
};

class MockAddInLogger : public AddInLogger {
public:
    MOCK_METHOD(void, Log, (LogLevel, const std::string&), (override));
};

class OfficeAddInHostTest : public ::testing::Test {
protected:
    void SetUp() override {
        mockExcelInterop = std::make_unique<NiceMock<MockExcelInterop>>();
        mockManifest = std::make_unique<NiceMock<MockOfficeAddInManifest>>();
        mockLogger = std::make_shared<NiceMock<MockAddInLogger>>();
        officeAddInHost = std::make_unique<OfficeAddInHost>(mockExcelInterop.get(), mockManifest.get(), mockLogger);
    }

    std::unique_ptr<MockExcelInterop> mockExcelInterop;
    std::unique_ptr<MockOfficeAddInManifest> mockManifest;
    std::shared_ptr<MockAddInLogger> mockLogger;
    std::unique_ptr<OfficeAddInHost> officeAddInHost;
};

TEST_F(OfficeAddInHostTest, Constructor) {
    EXPECT_NE(officeAddInHost, nullptr);
    EXPECT_NE(officeAddInHost->GetExcelInterop(), nullptr);
}

TEST_F(OfficeAddInHostTest, GetExcelInterop) {
    EXPECT_EQ(officeAddInHost->GetExcelInterop(), mockExcelInterop.get());
}

TEST_F(OfficeAddInHostTest, RegisterFunction) {
    std::string functionName = "TestFunction";
    std::string functionSignature = "TestFunction(arg1, arg2)";
    
    EXPECT_CALL(*mockExcelInterop, RegisterFunction(functionName, functionSignature))
        .WillOnce(Return(true));
    EXPECT_CALL(*mockLogger, Log(AddInLogger::LogLevel::INFO, _));

    bool result = officeAddInHost->RegisterFunction(functionName, functionSignature);
    EXPECT_TRUE(result);
}

TEST_F(OfficeAddInHostTest, UnregisterFunction) {
    std::string functionName = "TestFunction";
    
    EXPECT_CALL(*mockExcelInterop, UnregisterFunction(functionName))
        .WillOnce(Return(true));
    EXPECT_CALL(*mockLogger, Log(AddInLogger::LogLevel::INFO, _));

    bool result = officeAddInHost->UnregisterFunction(functionName);
    EXPECT_TRUE(result);
}

TEST_F(OfficeAddInHostTest, AddMenuItem) {
    std::string menuName = "TestMenu";
    std::string menuItemName = "TestMenuItem";
    
    EXPECT_CALL(*mockExcelInterop, AddMenuItem(menuName, menuItemName))
        .WillOnce(Return(true));
    EXPECT_CALL(*mockLogger, Log(AddInLogger::LogLevel::INFO, _));

    bool result = officeAddInHost->AddMenuItem(menuName, menuItemName);
    EXPECT_TRUE(result);
}

TEST_F(OfficeAddInHostTest, RemoveMenuItem) {
    std::string menuItemName = "TestMenuItem";
    
    EXPECT_CALL(*mockExcelInterop, RemoveMenuItem(menuItemName))
        .WillOnce(Return(true));
    EXPECT_CALL(*mockLogger, Log(AddInLogger::LogLevel::INFO, _));

    bool result = officeAddInHost->RemoveMenuItem(menuItemName);
    EXPECT_TRUE(result);
}

TEST_F(OfficeAddInHostTest, LogMessage) {
    std::string message = "Test log message";
    EXPECT_CALL(*mockLogger, Log(AddInLogger::LogLevel::INFO, message));

    officeAddInHost->LogMessage(AddInLogger::LogLevel::INFO, message);
}

TEST_F(OfficeAddInHostTest, GetAddInName) {
    std::string expectedName = "Test Add-In";
    EXPECT_CALL(*mockManifest, GetAddInName())
        .WillOnce(Return(expectedName));

    std::string result = officeAddInHost->GetAddInName();
    EXPECT_EQ(result, expectedName);
}

TEST_F(OfficeAddInHostTest, GetAddInVersion) {
    std::string expectedVersion = "1.0.0";
    EXPECT_CALL(*mockManifest, GetAddInVersion())
        .WillOnce(Return(expectedVersion));

    std::string result = officeAddInHost->GetAddInVersion();
    EXPECT_EQ(result, expectedVersion);
}

TEST_F(OfficeAddInHostTest, GetAddInDescription) {
    std::string expectedDescription = "Test Add-In Description";
    EXPECT_CALL(*mockManifest, GetAddInDescription())
        .WillOnce(Return(expectedDescription));

    std::string result = officeAddInHost->GetAddInDescription();
    EXPECT_EQ(result, expectedDescription);
}

int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
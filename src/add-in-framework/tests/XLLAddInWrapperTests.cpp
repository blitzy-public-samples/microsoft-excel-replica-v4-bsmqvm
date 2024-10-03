#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include "../xll/XLLAddInWrapper.h"
#include "../interfaces/IAddIn.h"
#include "../interfaces/IExcelInterop.h"

using ::testing::_;
using ::testing::Return;
using ::testing::NiceMock;

class MockIExcelInterop : public IExcelInterop {
public:
    MOCK_METHOD(bool, LoadXLL, (const std::string&), (override));
    MOCK_METHOD(bool, UnloadXLL, (const std::string&), (override));
    MOCK_METHOD(bool, RegisterXLLFunction, (const std::string&, const std::string&), (override));
    MOCK_METHOD(bool, UnregisterXLLFunction, (const std::string&), (override));
    MOCK_METHOD(std::variant<int, double, std::string>, ExecuteXLLFunction, (const std::string&, const std::vector<std::variant<int, double, std::string>>&), (override));
};

class MockIAddInHost : public IAddInHost {
public:
    MOCK_METHOD(void, OnAddInLoaded, (const std::string&), (override));
    MOCK_METHOD(void, OnAddInUnloaded, (const std::string&), (override));
    MOCK_METHOD(void, OnFunctionRegistered, (const std::string&), (override));
    MOCK_METHOD(void, OnFunctionUnregistered, (const std::string&), (override));
};

class XLLAddInWrapperTest : public ::testing::Test {
protected:
    void SetUp() override {
        mockExcelInterop = std::make_shared<NiceMock<MockIExcelInterop>>();
        mockAddInHost = std::make_shared<NiceMock<MockIAddInHost>>();
        xllWrapper = std::make_unique<XLLAddInWrapper>(mockExcelInterop);
    }

    std::shared_ptr<MockIExcelInterop> mockExcelInterop;
    std::shared_ptr<MockIAddInHost> mockAddInHost;
    std::unique_ptr<XLLAddInWrapper> xllWrapper;
};

TEST_F(XLLAddInWrapperTest, LoadXLL_Success) {
    const std::string validXllPath = "C:\\ValidPath\\TestAddin.xll";
    EXPECT_CALL(*mockExcelInterop, LoadXLL(validXllPath)).WillOnce(Return(true));

    bool result = xllWrapper->LoadXLL(validXllPath);

    EXPECT_TRUE(result);
}

TEST_F(XLLAddInWrapperTest, LoadXLL_Failure) {
    const std::string invalidXllPath = "C:\\InvalidPath\\NonExistentAddin.xll";
    EXPECT_CALL(*mockExcelInterop, LoadXLL(invalidXllPath)).WillOnce(Return(false));

    bool result = xllWrapper->LoadXLL(invalidXllPath);

    EXPECT_FALSE(result);
}

TEST_F(XLLAddInWrapperTest, UnloadXLL_Success) {
    const std::string loadedXllPath = "C:\\LoadedPath\\LoadedAddin.xll";
    EXPECT_CALL(*mockExcelInterop, UnloadXLL(loadedXllPath)).WillOnce(Return(true));

    bool result = xllWrapper->UnloadXLL(loadedXllPath);

    EXPECT_TRUE(result);
}

TEST_F(XLLAddInWrapperTest, UnloadXLL_Failure) {
    const std::string notLoadedXllPath = "C:\\NotLoadedPath\\NotLoadedAddin.xll";
    EXPECT_CALL(*mockExcelInterop, UnloadXLL(notLoadedXllPath)).WillOnce(Return(false));

    bool result = xllWrapper->UnloadXLL(notLoadedXllPath);

    EXPECT_FALSE(result);
}

TEST_F(XLLAddInWrapperTest, Initialize_Success) {
    EXPECT_CALL(*mockAddInHost, OnAddInLoaded(_)).Times(1);

    xllWrapper->Initialize(mockAddInHost);

    // Verify that the XLLAddInWrapper is properly initialized
    EXPECT_NE(xllWrapper->GetAddInHost(), nullptr);
}

TEST_F(XLLAddInWrapperTest, Shutdown_Success) {
    xllWrapper->Initialize(mockAddInHost);
    EXPECT_CALL(*mockAddInHost, OnAddInUnloaded(_)).Times(1);

    xllWrapper->Shutdown();

    // Verify that the XLLAddInWrapper is properly shut down
    EXPECT_EQ(xllWrapper->GetAddInHost(), nullptr);
}

TEST_F(XLLAddInWrapperTest, ExecuteXLLFunction_Success) {
    const std::string functionName = "TEST_FUNCTION";
    std::vector<std::variant<int, double, std::string>> args = {42, 3.14, "test"};
    std::variant<int, double, std::string> expectedResult = "result";

    EXPECT_CALL(*mockExcelInterop, ExecuteXLLFunction(functionName, args))
        .WillOnce(Return(expectedResult));

    auto result = xllWrapper->ExecuteXLLFunction(functionName, args);

    EXPECT_EQ(result, expectedResult);
}

TEST_F(XLLAddInWrapperTest, ExecuteXLLFunction_Failure) {
    const std::string invalidFunctionName = "INVALID_FUNCTION";
    std::vector<std::variant<int, double, std::string>> args = {42, 3.14, "test"};

    EXPECT_CALL(*mockExcelInterop, ExecuteXLLFunction(invalidFunctionName, args))
        .WillOnce(Return(std::variant<int, double, std::string>()));

    auto result = xllWrapper->ExecuteXLLFunction(invalidFunctionName, args);

    EXPECT_TRUE(std::holds_alternative<std::monostate>(result));
}

// Add more tests here to cover edge cases and additional functionality

int main(int argc, char** argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
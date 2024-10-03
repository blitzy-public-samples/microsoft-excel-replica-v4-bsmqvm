#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include "../security/AddInSandbox.h"
#include "../interfaces/IAddIn.h"
#include "../security/PermissionManager.h"

using ::testing::_;
using ::testing::Return;
using ::testing::NiceMock;

// Mock classes
class MockAddIn : public IAddIn {
public:
    MOCK_METHOD(void, Execute, (), (override));
    MOCK_METHOD(bool, RequiresPermission, (const std::string&), (const, override));
};

class MockPermissionManager : public PermissionManager {
public:
    MOCK_METHOD(bool, HasPermission, (const std::string&, const std::string&), (const, override));
};

class AddInSandboxTest : public ::testing::Test {
protected:
    void SetUp() override {
        sandbox = std::make_unique<AddInSandbox>();
    }

    std::unique_ptr<AddInSandbox> sandbox;
};

TEST_F(AddInSandboxTest, CreateSandbox) {
    EXPECT_NE(sandbox, nullptr);
    // Add more specific checks for sandbox initialization if needed
}

TEST_F(AddInSandboxTest, ExecuteAddIn) {
    auto mockAddIn = std::make_shared<NiceMock<MockAddIn>>();
    EXPECT_CALL(*mockAddIn, Execute()).Times(1);

    EXPECT_NO_THROW(sandbox->ExecuteAddIn(mockAddIn));
}

TEST_F(AddInSandboxTest, SetPermissions) {
    auto mockPermissionManager = std::make_shared<NiceMock<MockPermissionManager>>();
    sandbox->SetPermissionManager(mockPermissionManager);

    const std::string addInId = "test-add-in";
    const std::string permission = "read-data";

    EXPECT_CALL(*mockPermissionManager, HasPermission(addInId, permission))
        .WillOnce(Return(true));

    EXPECT_TRUE(sandbox->HasPermission(addInId, permission));
}

TEST_F(AddInSandboxTest, ExecuteAddInWithInsufficientPermissions) {
    auto mockAddIn = std::make_shared<NiceMock<MockAddIn>>();
    auto mockPermissionManager = std::make_shared<NiceMock<MockPermissionManager>>();
    sandbox->SetPermissionManager(mockPermissionManager);

    const std::string addInId = "test-add-in";
    const std::string permission = "write-data";

    EXPECT_CALL(*mockAddIn, RequiresPermission(permission))
        .WillOnce(Return(true));
    EXPECT_CALL(*mockPermissionManager, HasPermission(addInId, permission))
        .WillOnce(Return(false));
    EXPECT_CALL(*mockAddIn, Execute()).Times(0);

    EXPECT_THROW(sandbox->ExecuteAddIn(mockAddIn, addInId), std::runtime_error);
}

TEST_F(AddInSandboxTest, ExecuteMultipleAddIns) {
    auto mockAddIn1 = std::make_shared<NiceMock<MockAddIn>>();
    auto mockAddIn2 = std::make_shared<NiceMock<MockAddIn>>();

    EXPECT_CALL(*mockAddIn1, Execute()).Times(1);
    EXPECT_CALL(*mockAddIn2, Execute()).Times(1);

    EXPECT_NO_THROW(sandbox->ExecuteAddIn(mockAddIn1));
    EXPECT_NO_THROW(sandbox->ExecuteAddIn(mockAddIn2));

    // Add checks for isolation between add-ins if applicable
}

// Additional tests can be added here to cover more scenarios and edge cases
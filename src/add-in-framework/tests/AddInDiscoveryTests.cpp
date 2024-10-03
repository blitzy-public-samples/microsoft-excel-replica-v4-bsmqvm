#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include "../discovery/AddInDiscovery.h"
#include "../interfaces/IAddIn.h"
#include "../interfaces/IAddInHost.h"
#include "../security/PermissionManager.h"
#include "../versioning/VersionManager.h"
#include <filesystem>
#include <fstream>

using namespace testing;
using namespace std::filesystem;

class MockAddIn : public IAddIn {
public:
    MOCK_METHOD(std::string, GetName, (), (const, override));
    MOCK_METHOD(std::string, GetVersion, (), (const, override));
    MOCK_METHOD(void, Initialize, (IAddInHost*), (override));
    MOCK_METHOD(void, Shutdown, (), (override));
};

class MockAddInHost : public IAddInHost {
public:
    MOCK_METHOD(void, RegisterAddIn, (IAddIn*), (override));
    MOCK_METHOD(void, UnregisterAddIn, (IAddIn*), (override));
};

class MockPermissionManager : public PermissionManager {
public:
    MOCK_METHOD(bool, ValidateAddInPermissions, (const IAddIn*), (const, override));
};

class MockVersionManager : public VersionManager {
public:
    MOCK_METHOD(bool, IsVersionCompatible, (const std::string&), (const, override));
};

class AddInDiscoveryTest : public ::testing::Test {
protected:
    void SetUp() override {
        permissionManager = std::make_shared<MockPermissionManager>();
        versionManager = std::make_shared<MockVersionManager>();
        addInHost = std::make_shared<MockAddInHost>();
        discovery = std::make_unique<AddInDiscovery>(permissionManager, versionManager, addInHost);
    }

    void TearDown() override {
        // Clean up any created directories or files
        if (exists("test_addins"))
            remove_all("test_addins");
    }

    std::shared_ptr<MockPermissionManager> permissionManager;
    std::shared_ptr<MockVersionManager> versionManager;
    std::shared_ptr<MockAddInHost> addInHost;
    std::unique_ptr<AddInDiscovery> discovery;

    void CreateMockAddInFile(const std::string& filename, const std::string& content) {
        create_directory("test_addins");
        std::ofstream file("test_addins/" + filename);
        file << content;
        file.close();
    }
};

TEST_F(AddInDiscoveryTest, DiscoverAddIns_EmptyDirectory) {
    create_directory("test_addins");
    auto result = discovery->DiscoverAddIns("test_addins");
    EXPECT_TRUE(result.empty());
}

TEST_F(AddInDiscoveryTest, DiscoverAddIns_ValidAddIns) {
    CreateMockAddInFile("valid_addin1.dll", "Mock content 1");
    CreateMockAddInFile("valid_addin2.dll", "Mock content 2");

    EXPECT_CALL(*permissionManager, ValidateAddInPermissions(_))
        .Times(2)
        .WillRepeatedly(Return(true));

    EXPECT_CALL(*versionManager, IsVersionCompatible(_))
        .Times(2)
        .WillRepeatedly(Return(true));

    auto result = discovery->DiscoverAddIns("test_addins");
    EXPECT_EQ(result.size(), 2);
}

TEST_F(AddInDiscoveryTest, DiscoverAddIns_InvalidAddIns) {
    CreateMockAddInFile("invalid_addin.txt", "Invalid content");

    auto result = discovery->DiscoverAddIns("test_addins");
    EXPECT_TRUE(result.empty());
}

TEST_F(AddInDiscoveryTest, LoadAddIn_ValidAddIn) {
    auto mockAddIn = std::make_shared<MockAddIn>();
    EXPECT_CALL(*mockAddIn, GetName()).WillOnce(Return("ValidAddIn"));
    EXPECT_CALL(*mockAddIn, GetVersion()).WillOnce(Return("1.0.0"));
    EXPECT_CALL(*mockAddIn, Initialize(_)).Times(1);

    EXPECT_CALL(*permissionManager, ValidateAddInPermissions(_)).WillOnce(Return(true));
    EXPECT_CALL(*versionManager, IsVersionCompatible(_)).WillOnce(Return(true));
    EXPECT_CALL(*addInHost, RegisterAddIn(_)).Times(1);

    bool result = discovery->LoadAddIn(mockAddIn.get());
    EXPECT_TRUE(result);
}

TEST_F(AddInDiscoveryTest, LoadAddIn_InvalidPermissions) {
    auto mockAddIn = std::make_shared<MockAddIn>();
    EXPECT_CALL(*mockAddIn, GetName()).WillOnce(Return("InvalidAddIn"));
    EXPECT_CALL(*mockAddIn, GetVersion()).WillOnce(Return("1.0.0"));

    EXPECT_CALL(*permissionManager, ValidateAddInPermissions(_)).WillOnce(Return(false));

    bool result = discovery->LoadAddIn(mockAddIn.get());
    EXPECT_FALSE(result);
}

TEST_F(AddInDiscoveryTest, LoadAddIn_IncompatibleVersion) {
    auto mockAddIn = std::make_shared<MockAddIn>();
    EXPECT_CALL(*mockAddIn, GetName()).WillOnce(Return("IncompatibleAddIn"));
    EXPECT_CALL(*mockAddIn, GetVersion()).WillOnce(Return("2.0.0"));

    EXPECT_CALL(*permissionManager, ValidateAddInPermissions(_)).WillOnce(Return(true));
    EXPECT_CALL(*versionManager, IsVersionCompatible(_)).WillOnce(Return(false));

    bool result = discovery->LoadAddIn(mockAddIn.get());
    EXPECT_FALSE(result);
}

TEST_F(AddInDiscoveryTest, UnloadAddIn_ExistingAddIn) {
    auto mockAddIn = std::make_shared<MockAddIn>();
    EXPECT_CALL(*mockAddIn, GetName()).WillRepeatedly(Return("ExistingAddIn"));
    EXPECT_CALL(*mockAddIn, Shutdown()).Times(1);
    EXPECT_CALL(*addInHost, UnregisterAddIn(_)).Times(1);

    // First, load the add-in
    discovery->LoadAddIn(mockAddIn.get());

    bool result = discovery->UnloadAddIn(mockAddIn.get());
    EXPECT_TRUE(result);
}

TEST_F(AddInDiscoveryTest, UnloadAddIn_NonExistentAddIn) {
    auto mockAddIn = std::make_shared<MockAddIn>();
    EXPECT_CALL(*mockAddIn, GetName()).WillOnce(Return("NonExistentAddIn"));

    bool result = discovery->UnloadAddIn(mockAddIn.get());
    EXPECT_FALSE(result);
}

TEST_F(AddInDiscoveryTest, GetDiscoveredAddIns_AfterDiscovery) {
    CreateMockAddInFile("valid_addin1.dll", "Mock content 1");
    CreateMockAddInFile("valid_addin2.dll", "Mock content 2");

    EXPECT_CALL(*permissionManager, ValidateAddInPermissions(_))
        .Times(2)
        .WillRepeatedly(Return(true));

    EXPECT_CALL(*versionManager, IsVersionCompatible(_))
        .Times(2)
        .WillRepeatedly(Return(true));

    discovery->DiscoverAddIns("test_addins");
    auto result = discovery->GetDiscoveredAddIns();
    EXPECT_EQ(result.size(), 2);
}

TEST_F(AddInDiscoveryTest, ValidateAddIn_ValidAddIn) {
    auto mockAddIn = std::make_shared<MockAddIn>();
    EXPECT_CALL(*mockAddIn, GetName()).WillOnce(Return("ValidAddIn"));
    EXPECT_CALL(*mockAddIn, GetVersion()).WillOnce(Return("1.0.0"));

    EXPECT_CALL(*permissionManager, ValidateAddInPermissions(_)).WillOnce(Return(true));
    EXPECT_CALL(*versionManager, IsVersionCompatible(_)).WillOnce(Return(true));

    bool result = discovery->ValidateAddIn(mockAddIn.get());
    EXPECT_TRUE(result);
}

TEST_F(AddInDiscoveryTest, ValidateAddIn_InvalidPermissions) {
    auto mockAddIn = std::make_shared<MockAddIn>();
    EXPECT_CALL(*mockAddIn, GetName()).WillOnce(Return("InvalidAddIn"));
    EXPECT_CALL(*mockAddIn, GetVersion()).WillOnce(Return("1.0.0"));

    EXPECT_CALL(*permissionManager, ValidateAddInPermissions(_)).WillOnce(Return(false));

    bool result = discovery->ValidateAddIn(mockAddIn.get());
    EXPECT_FALSE(result);
}

TEST_F(AddInDiscoveryTest, ValidateAddIn_IncompatibleVersion) {
    auto mockAddIn = std::make_shared<MockAddIn>();
    EXPECT_CALL(*mockAddIn, GetName()).WillOnce(Return("IncompatibleAddIn"));
    EXPECT_CALL(*mockAddIn, GetVersion()).WillOnce(Return("2.0.0"));

    EXPECT_CALL(*permissionManager, ValidateAddInPermissions(_)).WillOnce(Return(true));
    EXPECT_CALL(*versionManager, IsVersionCompatible(_)).WillOnce(Return(false));

    bool result = discovery->ValidateAddIn(mockAddIn.get());
    EXPECT_FALSE(result);
}
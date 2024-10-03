#include <gtest/gtest.h>
#include <gmock/gmock.h>
#include "../versioning/VersionManager.h"
#include "../interfaces/IAddIn.h"

using ::testing::Return;
using ::testing::_;

// Mock class for IAddIn
class MockAddIn : public IAddIn {
public:
    MOCK_METHOD(std::string, GetName, (), (const, override));
    MOCK_METHOD(std::string, GetVersion, (), (const, override));
    // Add other methods from IAddIn interface as needed
};

class VersionManagerTest : public ::testing::Test {
protected:
    VersionManager versionManager;
};

TEST_F(VersionManagerTest, SetSupportedExcelVersions) {
    // Arrange
    std::vector<std::string> testVersions = {"16.0", "15.0", "14.0"};

    // Act
    versionManager.SetSupportedExcelVersions(testVersions);

    // Assert
    // Note: We need to add a public method to VersionManager to get supported versions for this test
    // For now, we'll assume it exists
    EXPECT_EQ(versionManager.GetSupportedExcelVersions(), testVersions);
}

TEST_F(VersionManagerTest, RegisterAddIn) {
    // Arrange
    auto mockAddIn1 = std::make_shared<MockAddIn>();
    auto mockAddIn2 = std::make_shared<MockAddIn>();

    EXPECT_CALL(*mockAddIn1, GetName()).WillRepeatedly(Return("TestAddIn1"));
    EXPECT_CALL(*mockAddIn1, GetVersion()).WillRepeatedly(Return("1.0.0"));
    EXPECT_CALL(*mockAddIn2, GetName()).WillRepeatedly(Return("TestAddIn2"));
    EXPECT_CALL(*mockAddIn2, GetVersion()).WillRepeatedly(Return("2.0.0"));

    // Act
    bool result1 = versionManager.RegisterAddIn(mockAddIn1);
    bool result2 = versionManager.RegisterAddIn(mockAddIn2);

    // Assert
    EXPECT_TRUE(result1);
    EXPECT_TRUE(result2);

    // Note: We need to add a public method to VersionManager to get registered add-ins for this test
    // For now, we'll assume it exists
    auto registeredAddIns = versionManager.GetRegisteredAddIns();
    EXPECT_EQ(registeredAddIns.size(), 2);
    EXPECT_TRUE(std::find(registeredAddIns.begin(), registeredAddIns.end(), mockAddIn1) != registeredAddIns.end());
    EXPECT_TRUE(std::find(registeredAddIns.begin(), registeredAddIns.end(), mockAddIn2) != registeredAddIns.end());
}

TEST_F(VersionManagerTest, CheckCompatibility) {
    // Arrange
    std::vector<std::string> supportedVersions = {"16.0", "15.0", "14.0"};
    versionManager.SetSupportedExcelVersions(supportedVersions);

    auto mockAddIn1 = std::make_shared<MockAddIn>();
    auto mockAddIn2 = std::make_shared<MockAddIn>();

    EXPECT_CALL(*mockAddIn1, GetName()).WillRepeatedly(Return("TestAddIn1"));
    EXPECT_CALL(*mockAddIn1, GetVersion()).WillRepeatedly(Return("1.0.0"));
    EXPECT_CALL(*mockAddIn2, GetName()).WillRepeatedly(Return("TestAddIn2"));
    EXPECT_CALL(*mockAddIn2, GetVersion()).WillRepeatedly(Return("2.0.0"));

    versionManager.RegisterAddIn(mockAddIn1);
    versionManager.RegisterAddIn(mockAddIn2);

    // Act & Assert
    EXPECT_TRUE(versionManager.CheckCompatibility("16.0"));
    EXPECT_TRUE(versionManager.CheckCompatibility("15.0"));
    EXPECT_TRUE(versionManager.CheckCompatibility("14.0"));
    EXPECT_FALSE(versionManager.CheckCompatibility("13.0"));
    EXPECT_FALSE(versionManager.CheckCompatibility("17.0"));
}

TEST_F(VersionManagerTest, GetAddInVersion) {
    // Arrange
    auto mockAddIn = std::make_shared<MockAddIn>();
    EXPECT_CALL(*mockAddIn, GetName()).WillRepeatedly(Return("TestAddIn"));
    EXPECT_CALL(*mockAddIn, GetVersion()).WillRepeatedly(Return("1.0.0"));

    versionManager.RegisterAddIn(mockAddIn);

    // Act & Assert
    EXPECT_EQ(versionManager.GetAddInVersion("TestAddIn"), "1.0.0");
    EXPECT_EQ(versionManager.GetAddInVersion("NonExistentAddIn"), "");
}

// Additional tests can be added here to cover edge cases and error handling

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}
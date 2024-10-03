using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;

namespace Microsoft.Excel.DataAccess.Tests
{
    [TestClass]
    public class DataModelManagerTests
    {
        private Mock<IDataSource> _mockDataSource;
        private Mock<ILogger<DataModelManager>> _mockLogger;
        private Mock<IConfiguration> _mockConfiguration;
        private DataModelManager _dataModelManager;

        [TestInitialize]
        public void TestInitialize()
        {
            // Create mock objects for IDataSource, ILogger, and IConfiguration
            _mockDataSource = new Mock<IDataSource>();
            _mockLogger = new Mock<ILogger<DataModelManager>>();
            _mockConfiguration = new Mock<IConfiguration>();

            // Initialize DataModelManager instance with mock objects
            _dataModelManager = new DataModelManager(_mockDataSource.Object, _mockLogger.Object, _mockConfiguration.Object);
        }

        [TestCleanup]
        public void TestCleanup()
        {
            // Dispose of any resources created during the test
            _dataModelManager = null;

            // Reset mock objects
            _mockDataSource.Reset();
            _mockLogger.Reset();
            _mockConfiguration.Reset();
        }

        [TestMethod]
        public void TestCreateDataModel()
        {
            // Arrange: Set up test data for creating a new data model
            var dataModelName = "TestModel";
            var dataModelSchema = new { Id = "int", Name = "string" };

            _mockDataSource.Setup(ds => ds.CreateDataModel(It.IsAny<string>(), It.IsAny<object>()))
                .Returns(true);

            // Act: Call CreateDataModel method on DataModelManager
            var result = _dataModelManager.CreateDataModel(dataModelName, dataModelSchema);

            // Assert: Verify that the data model was created correctly
            Assert.IsTrue(result);

            // Verify that appropriate logging calls were made
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((o, t) => o.ToString().Contains("Creating data model")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception, string>>()),
                Times.Once);
        }

        [TestMethod]
        public void TestRetrieveDataModel()
        {
            // Arrange: Set up test data for an existing data model
            var dataModelName = "ExistingModel";
            var expectedDataModel = new { Id = 1, Name = "Test" };

            _mockDataSource.Setup(ds => ds.GetDataModel(dataModelName))
                .Returns(expectedDataModel);

            // Act: Call GetDataModel method on DataModelManager
            var result = _dataModelManager.GetDataModel(dataModelName);

            // Assert: Verify that the correct data model was retrieved
            Assert.IsNotNull(result);
            Assert.AreEqual(expectedDataModel, result);

            // Verify that appropriate logging calls were made
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((o, t) => o.ToString().Contains("Retrieving data model")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception, string>>()),
                Times.Once);
        }

        [TestMethod]
        public void TestUpdateDataModel()
        {
            // Arrange: Set up test data for an existing data model and updates
            var dataModelName = "ExistingModel";
            var updatedSchema = new { Id = "int", Name = "string", Description = "string" };

            _mockDataSource.Setup(ds => ds.UpdateDataModel(It.IsAny<string>(), It.IsAny<object>()))
                .Returns(true);

            // Act: Call UpdateDataModel method on DataModelManager
            var result = _dataModelManager.UpdateDataModel(dataModelName, updatedSchema);

            // Assert: Verify that the data model was updated correctly
            Assert.IsTrue(result);

            // Verify that appropriate logging calls were made
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((o, t) => o.ToString().Contains("Updating data model")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception, string>>()),
                Times.Once);
        }

        [TestMethod]
        public void TestDeleteDataModel()
        {
            // Arrange: Set up test data for an existing data model
            var dataModelName = "ExistingModel";

            _mockDataSource.Setup(ds => ds.DeleteDataModel(dataModelName))
                .Returns(true);

            // Act: Call DeleteDataModel method on DataModelManager
            var result = _dataModelManager.DeleteDataModel(dataModelName);

            // Assert: Verify that the data model was deleted successfully
            Assert.IsTrue(result);

            // Verify that appropriate logging calls were made
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Information,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((o, t) => o.ToString().Contains("Deleting data model")),
                    null,
                    It.IsAny<Func<It.IsAnyType, Exception, string>>()),
                Times.Once);
        }

        [TestMethod]
        public void TestInvalidDataModelOperations()
        {
            // Arrange: Set up test data for invalid operations
            var invalidModelName = "InvalidModel";

            _mockDataSource.Setup(ds => ds.GetDataModel(invalidModelName))
                .Throws(new DataAccessException("Data model not found"));

            // Act and Assert: Attempt invalid operations and verify that appropriate exceptions are thrown
            Assert.ThrowsException<DataAccessException>(() => _dataModelManager.GetDataModel(invalidModelName));

            // Verify that error logging calls were made for each invalid operation
            _mockLogger.Verify(
                x => x.Log(
                    LogLevel.Error,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((o, t) => o.ToString().Contains("Error retrieving data model")),
                    It.IsAny<Exception>(),
                    It.IsAny<Func<It.IsAnyType, Exception, string>>()),
                Times.Once);
        }
    }
}
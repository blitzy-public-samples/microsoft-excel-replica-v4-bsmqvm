using System;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace Microsoft.Excel.DataAccess.Tests
{
    [TestClass]
    public class DataAccessManagerTests
    {
        private Mock<IDataAccessFactory> _mockDataAccessFactory;
        private Mock<IDataSource> _mockDataSource;
        private Mock<ILogger<DataAccessManager>> _mockLogger;
        private Mock<ConnectionStringManager> _mockConnectionStringManager;
        private Mock<CacheManager> _mockCacheManager;
        private Mock<DataValidator> _mockDataValidator;
        private DataAccessManager _dataAccessManager;

        [TestInitialize]
        public void TestInitialize()
        {
            _mockDataAccessFactory = new Mock<IDataAccessFactory>();
            _mockDataSource = new Mock<IDataSource>();
            _mockLogger = new Mock<ILogger<DataAccessManager>>();
            _mockConnectionStringManager = new Mock<ConnectionStringManager>();
            _mockCacheManager = new Mock<CacheManager>();
            _mockDataValidator = new Mock<DataValidator>();

            _mockDataAccessFactory.Setup(f => f.CreateDataSource(It.IsAny<string>())).Returns(_mockDataSource.Object);

            _dataAccessManager = new DataAccessManager(
                _mockDataAccessFactory.Object,
                _mockLogger.Object,
                _mockConnectionStringManager.Object,
                _mockCacheManager.Object,
                _mockDataValidator.Object
            );
        }

        [TestMethod]
        public async Task TestGetData_Success()
        {
            // Arrange
            string query = "SELECT * FROM TestTable";
            var expectedData = new List<Dictionary<string, object>>
            {
                new Dictionary<string, object> { { "Id", 1 }, { "Name", "Test" } }
            };

            _mockDataSource.Setup(ds => ds.ExecuteQuery(query)).ReturnsAsync(expectedData);

            // Act
            var result = await _dataAccessManager.GetData(query);

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(expectedData.Count, result.Count);
            Assert.AreEqual(expectedData[0]["Id"], result[0]["Id"]);
            Assert.AreEqual(expectedData[0]["Name"], result[0]["Name"]);

            _mockDataSource.Verify(ds => ds.ExecuteQuery(query), Times.Once);
            _mockLogger.Verify(l => l.LogInformation(It.IsAny<string>()), Times.Once);
        }

        [TestMethod]
        public async Task TestSaveData_Success()
        {
            // Arrange
            string tableName = "TestTable";
            var data = new Dictionary<string, object> { { "Id", 1 }, { "Name", "Test" } };

            _mockDataSource.Setup(ds => ds.ExecuteNonQuery(It.IsAny<string>())).ReturnsAsync(1);
            _mockDataValidator.Setup(dv => dv.ValidateData(data)).Returns(true);

            // Act
            await _dataAccessManager.SaveData(tableName, data);

            // Assert
            _mockDataSource.Verify(ds => ds.ExecuteNonQuery(It.IsAny<string>()), Times.Once);
            _mockDataValidator.Verify(dv => dv.ValidateData(data), Times.Once);
            _mockLogger.Verify(l => l.LogInformation(It.IsAny<string>()), Times.Once);
        }

        [TestMethod]
        public async Task TestUpdateData_Success()
        {
            // Arrange
            string tableName = "TestTable";
            var data = new Dictionary<string, object> { { "Name", "UpdatedTest" } };
            string condition = "Id = 1";

            _mockDataSource.Setup(ds => ds.ExecuteNonQuery(It.IsAny<string>())).ReturnsAsync(1);
            _mockDataValidator.Setup(dv => dv.ValidateData(data)).Returns(true);

            // Act
            await _dataAccessManager.UpdateData(tableName, data, condition);

            // Assert
            _mockDataSource.Verify(ds => ds.ExecuteNonQuery(It.IsAny<string>()), Times.Once);
            _mockDataValidator.Verify(dv => dv.ValidateData(data), Times.Once);
            _mockLogger.Verify(l => l.LogInformation(It.IsAny<string>()), Times.Once);
        }

        [TestMethod]
        public async Task TestDeleteData_Success()
        {
            // Arrange
            string tableName = "TestTable";
            string condition = "Id = 1";

            _mockDataSource.Setup(ds => ds.ExecuteNonQuery(It.IsAny<string>())).ReturnsAsync(1);

            // Act
            await _dataAccessManager.DeleteData(tableName, condition);

            // Assert
            _mockDataSource.Verify(ds => ds.ExecuteNonQuery(It.IsAny<string>()), Times.Once);
            _mockLogger.Verify(l => l.LogInformation(It.IsAny<string>()), Times.Once);
        }

        [TestMethod]
        public async Task TestExecuteCustomQuery_Success()
        {
            // Arrange
            string query = "UPDATE TestTable SET Name = @Name WHERE Id = @Id";
            var parameters = new Dictionary<string, object> { { "@Name", "UpdatedTest" }, { "@Id", 1 } };

            _mockDataSource.Setup(ds => ds.ExecuteQuery(query, parameters)).ReturnsAsync(new List<Dictionary<string, object>>());

            // Act
            var result = await _dataAccessManager.ExecuteCustomQuery(query, parameters);

            // Assert
            Assert.IsNotNull(result);
            _mockDataSource.Verify(ds => ds.ExecuteQuery(query, parameters), Times.Once);
            _mockLogger.Verify(l => l.LogInformation(It.IsAny<string>()), Times.Once);
        }

        [TestMethod]
        public async Task TestExceptionHandling()
        {
            // Arrange
            string query = "SELECT * FROM NonExistentTable";
            _mockDataSource.Setup(ds => ds.ExecuteQuery(query)).ThrowsAsync(new DataAccessException("Table not found"));

            // Act & Assert
            await Assert.ThrowsExceptionAsync<DataAccessException>(async () => await _dataAccessManager.GetData(query));
            _mockLogger.Verify(l => l.LogError(It.IsAny<Exception>(), It.IsAny<string>()), Times.Once);
        }

        [TestMethod]
        public async Task TestCaching()
        {
            // Arrange
            string query = "SELECT * FROM TestTable";
            var expectedData = new List<Dictionary<string, object>>
            {
                new Dictionary<string, object> { { "Id", 1 }, { "Name", "Test" } }
            };

            _mockCacheManager.Setup(cm => cm.GetFromCache(query)).Returns((List<Dictionary<string, object>>)null);
            _mockDataSource.Setup(ds => ds.ExecuteQuery(query)).ReturnsAsync(expectedData);

            // Act
            var result1 = await _dataAccessManager.GetData(query);
            _mockCacheManager.Setup(cm => cm.GetFromCache(query)).Returns(expectedData);
            var result2 = await _dataAccessManager.GetData(query);

            // Assert
            Assert.IsNotNull(result1);
            Assert.IsNotNull(result2);
            Assert.AreEqual(result1.Count, result2.Count);
            _mockDataSource.Verify(ds => ds.ExecuteQuery(query), Times.Once);
            _mockCacheManager.Verify(cm => cm.AddToCache(query, It.IsAny<List<Dictionary<string, object>>>()), Times.Once);
            _mockCacheManager.Verify(cm => cm.GetFromCache(query), Times.Exactly(2));
        }

        [TestMethod]
        public async Task TestDataValidation()
        {
            // Arrange
            string tableName = "TestTable";
            var invalidData = new Dictionary<string, object> { { "Id", "InvalidId" }, { "Name", "Test" } };

            _mockDataValidator.Setup(dv => dv.ValidateData(invalidData)).Returns(false);

            // Act & Assert
            await Assert.ThrowsExceptionAsync<DataAccessException>(async () => await _dataAccessManager.SaveData(tableName, invalidData));
            _mockDataValidator.Verify(dv => dv.ValidateData(invalidData), Times.Once);
            _mockLogger.Verify(l => l.LogError(It.IsAny<string>()), Times.Once);
        }

        [TestMethod]
        public async Task TestAsyncBehavior()
        {
            // Arrange
            string query1 = "SELECT * FROM Table1";
            string query2 = "SELECT * FROM Table2";
            var data1 = new List<Dictionary<string, object>> { new Dictionary<string, object> { { "Id", 1 } } };
            var data2 = new List<Dictionary<string, object>> { new Dictionary<string, object> { { "Id", 2 } } };

            _mockDataSource.Setup(ds => ds.ExecuteQuery(query1)).ReturnsAsync(data1, TimeSpan.FromMilliseconds(100));
            _mockDataSource.Setup(ds => ds.ExecuteQuery(query2)).ReturnsAsync(data2, TimeSpan.FromMilliseconds(50));

            // Act
            var task1 = _dataAccessManager.GetData(query1);
            var task2 = _dataAccessManager.GetData(query2);
            var results = await Task.WhenAll(task1, task2);

            // Assert
            Assert.AreEqual(2, results.Length);
            Assert.AreEqual(1, results[0][0]["Id"]);
            Assert.AreEqual(2, results[1][0]["Id"]);
            _mockDataSource.Verify(ds => ds.ExecuteQuery(It.IsAny<string>()), Times.Exactly(2));
        }

        [TestMethod]
        public async Task TestLargeDatasetHandling()
        {
            // Arrange
            string query = "SELECT * FROM LargeTable";
            var largeDataset = new List<Dictionary<string, object>>();
            for (int i = 0; i < 100000; i++)
            {
                largeDataset.Add(new Dictionary<string, object> { { "Id", i }, { "Name", $"Name{i}" } });
            }

            _mockDataSource.Setup(ds => ds.ExecuteQuery(query)).ReturnsAsync(largeDataset);

            // Act
            var startTime = DateTime.Now;
            var result = await _dataAccessManager.GetData(query);
            var endTime = DateTime.Now;

            // Assert
            Assert.IsNotNull(result);
            Assert.AreEqual(100000, result.Count);
            Assert.IsTrue((endTime - startTime).TotalSeconds < 5, "Large dataset processing took too long");
            _mockDataSource.Verify(ds => ds.ExecuteQuery(query), Times.Once);
            _mockLogger.Verify(l => l.LogInformation(It.IsAny<string>()), Times.Once);
        }
    }
}
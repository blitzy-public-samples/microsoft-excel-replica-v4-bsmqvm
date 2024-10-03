using System;
using System.Data;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;

namespace Microsoft.Excel.DataAccess.Tests
{
    [TestClass]
    public class DatabaseConnectorTests
    {
        private DatabaseConnector _databaseConnector;
        private Mock<ConnectionStringManager> _mockConnectionStringManager;
        private Mock<IDataSource> _mockDataSource;

        [TestInitialize]
        public void TestInitialize()
        {
            _mockConnectionStringManager = new Mock<ConnectionStringManager>();
            _mockDataSource = new Mock<IDataSource>();
            _databaseConnector = new DatabaseConnector(_mockConnectionStringManager.Object, _mockDataSource.Object);
        }

        [TestMethod]
        public void TestConnect_SuccessfulConnection()
        {
            // Arrange
            string testConnectionString = "Server=testserver;Database=testdb;User Id=testuser;Password=testpass;";
            _mockConnectionStringManager.Setup(m => m.GetConnectionString()).Returns(testConnectionString);
            _mockDataSource.Setup(m => m.OpenConnection(testConnectionString)).Returns(true);

            // Act
            bool result = _databaseConnector.Connect();

            // Assert
            Assert.IsTrue(result);
            _mockDataSource.Verify(m => m.OpenConnection(testConnectionString), Times.Once);
        }

        [TestMethod]
        [ExpectedException(typeof(DataAccessException))]
        public void TestConnect_FailedConnection_ThrowsException()
        {
            // Arrange
            string testConnectionString = "Server=testserver;Database=testdb;User Id=testuser;Password=testpass;";
            _mockConnectionStringManager.Setup(m => m.GetConnectionString()).Returns(testConnectionString);
            _mockDataSource.Setup(m => m.OpenConnection(testConnectionString)).Returns(false);

            // Act
            _databaseConnector.Connect();

            // Assert is handled by ExpectedException
        }

        [TestMethod]
        public void TestDisconnect_SuccessfulDisconnection()
        {
            // Arrange
            _mockDataSource.Setup(m => m.CloseConnection()).Returns(true);

            // Act
            bool result = _databaseConnector.Disconnect();

            // Assert
            Assert.IsTrue(result);
            _mockDataSource.Verify(m => m.CloseConnection(), Times.Once);
        }

        [TestMethod]
        public void TestExecuteQuery_ReturnsDataTable()
        {
            // Arrange
            string testQuery = "SELECT * FROM TestTable";
            DataTable expectedResult = new DataTable();
            expectedResult.Columns.Add("ID", typeof(int));
            expectedResult.Columns.Add("Name", typeof(string));
            expectedResult.Rows.Add(1, "Test1");
            expectedResult.Rows.Add(2, "Test2");

            _mockDataSource.Setup(m => m.ExecuteQuery(testQuery)).Returns(expectedResult);

            // Act
            DataTable result = _databaseConnector.ExecuteQuery(testQuery);

            // Assert
            Assert.AreEqual(expectedResult.Rows.Count, result.Rows.Count);
            Assert.AreEqual(expectedResult.Columns.Count, result.Columns.Count);
            _mockDataSource.Verify(m => m.ExecuteQuery(testQuery), Times.Once);
        }

        [TestMethod]
        public void TestExecuteNonQuery_ReturnsAffectedRows()
        {
            // Arrange
            string testCommand = "UPDATE TestTable SET Name = 'UpdatedTest' WHERE ID = 1";
            int expectedAffectedRows = 1;

            _mockDataSource.Setup(m => m.ExecuteNonQuery(testCommand)).Returns(expectedAffectedRows);

            // Act
            int result = _databaseConnector.ExecuteNonQuery(testCommand);

            // Assert
            Assert.AreEqual(expectedAffectedRows, result);
            _mockDataSource.Verify(m => m.ExecuteNonQuery(testCommand), Times.Once);
        }

        [TestMethod]
        public void TestBeginTransaction_ReturnsTrue()
        {
            // Arrange
            _mockDataSource.Setup(m => m.BeginTransaction()).Returns(true);

            // Act
            bool result = _databaseConnector.BeginTransaction();

            // Assert
            Assert.IsTrue(result);
            _mockDataSource.Verify(m => m.BeginTransaction(), Times.Once);
        }

        [TestMethod]
        [ExpectedException(typeof(DataAccessException))]
        public void TestErrorHandling_ThrowsDataAccessException()
        {
            // Arrange
            string testQuery = "SELECT * FROM NonExistentTable";
            _mockDataSource.Setup(m => m.ExecuteQuery(testQuery)).Throws(new Exception("Test exception"));

            // Act
            _databaseConnector.ExecuteQuery(testQuery);

            // Assert is handled by ExpectedException
        }
    }
}
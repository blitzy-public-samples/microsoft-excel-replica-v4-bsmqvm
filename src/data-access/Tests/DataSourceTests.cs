using System;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace Microsoft.Excel.DataAccess.Tests
{
    [TestClass]
    public class DataSourceTests
    {
        private const string TestConnectionString = "TestConnectionString";
        private const string TestQuery = "SELECT * FROM TestTable";
        private const string TestNonQuery = "INSERT INTO TestTable (Column1) VALUES ('TestValue')";

        [TestMethod]
        public async Task TestLocalDataSourceConnection()
        {
            // Arrange
            var localDataSource = new LocalDataSource(TestConnectionString);

            // Act
            await localDataSource.ConnectAsync();

            // Assert
            Assert.IsTrue(localDataSource.IsConnected);

            // Cleanup
            await localDataSource.DisconnectAsync();
        }

        [TestMethod]
        public async Task TestCloudDataSourceConnection()
        {
            // Arrange
            var cloudDataSource = new CloudDataSource(TestConnectionString);

            // Act
            await cloudDataSource.ConnectAsync();

            // Assert
            Assert.IsTrue(cloudDataSource.IsConnected);

            // Cleanup
            await cloudDataSource.DisconnectAsync();
        }

        [TestMethod]
        public async Task TestExternalApiDataSourceConnection()
        {
            // Arrange
            var externalApiDataSource = new ExternalApiDataSource(TestConnectionString);

            // Act
            await externalApiDataSource.ConnectAsync();

            // Assert
            Assert.IsTrue(externalApiDataSource.IsConnected);

            // Cleanup
            await externalApiDataSource.DisconnectAsync();
        }

        [TestMethod]
        public async Task TestQueryExecution()
        {
            // Arrange
            var dataSource = new LocalDataSource(TestConnectionString);
            await dataSource.ConnectAsync();

            // Act
            var result = await dataSource.ExecuteQueryAsync(TestQuery);

            // Assert
            Assert.IsNotNull(result);
            Assert.IsTrue(result.Rows.Count > 0);

            // Cleanup
            await dataSource.DisconnectAsync();
        }

        [TestMethod]
        public async Task TestNonQueryExecution()
        {
            // Arrange
            var dataSource = new LocalDataSource(TestConnectionString);
            await dataSource.ConnectAsync();

            // Act
            int affectedRows = await dataSource.ExecuteNonQueryAsync(TestNonQuery);

            // Assert
            Assert.IsTrue(affectedRows > 0);

            // Cleanup
            await dataSource.DisconnectAsync();
        }

        [TestMethod]
        public async Task TestTransactionManagement()
        {
            // Arrange
            var dataSource = new LocalDataSource(TestConnectionString);
            await dataSource.ConnectAsync();

            // Act & Assert
            using (var transaction = await dataSource.BeginTransactionAsync())
            {
                try
                {
                    await dataSource.ExecuteNonQueryAsync(TestNonQuery, transaction);
                    await dataSource.ExecuteNonQueryAsync(TestNonQuery, transaction);
                    await transaction.CommitAsync();

                    var result = await dataSource.ExecuteQueryAsync(TestQuery);
                    Assert.IsTrue(result.Rows.Count >= 2);
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }

            // Rollback test
            using (var transaction = await dataSource.BeginTransactionAsync())
            {
                await dataSource.ExecuteNonQueryAsync(TestNonQuery, transaction);
                await transaction.RollbackAsync();

                var result = await dataSource.ExecuteQueryAsync(TestQuery);
                Assert.IsTrue(result.Rows.Count == 2);
            }

            // Cleanup
            await dataSource.DisconnectAsync();
        }

        [TestMethod]
        public async Task TestExceptionHandling()
        {
            // Arrange
            var dataSource = new LocalDataSource("InvalidConnectionString");

            // Act & Assert
            await Assert.ThrowsExceptionAsync<DataAccessException>(async () => await dataSource.ConnectAsync());

            // Test invalid query
            dataSource = new LocalDataSource(TestConnectionString);
            await dataSource.ConnectAsync();

            await Assert.ThrowsExceptionAsync<DataAccessException>(async () => await dataSource.ExecuteQueryAsync("INVALID SQL QUERY"));

            // Test invalid non-query
            await Assert.ThrowsExceptionAsync<DataAccessException>(async () => await dataSource.ExecuteNonQueryAsync("INVALID SQL COMMAND"));

            // Cleanup
            await dataSource.DisconnectAsync();
        }
    }
}
using System;

namespace Microsoft.Excel.DataAccess
{
    /// <summary>
    /// This interface defines the contract for the factory responsible for creating data access components in Microsoft Excel.
    /// </summary>
    public interface IDataAccessFactory
    {
        /// <summary>
        /// Creates and returns an instance of IDataSource based on the specified data source type.
        /// </summary>
        /// <param name="dataSourceType">The type of data source to create.</param>
        /// <returns>An instance of IDataSource.</returns>
        IDataSource CreateDataSource(string dataSourceType);

        /// <summary>
        /// Creates and returns an instance of IConnectionStringManager for managing connection strings.
        /// </summary>
        /// <returns>An instance of IConnectionStringManager.</returns>
        IConnectionStringManager CreateConnectionStringManager();

        /// <summary>
        /// Creates and returns an instance of IDataAccessConfiguration for managing data access configurations.
        /// </summary>
        /// <returns>An instance of IDataAccessConfiguration.</returns>
        IDataAccessConfiguration CreateDataAccessConfiguration();
    }

    /// <summary>
    /// This interface represents a data source in the Microsoft Excel data access layer.
    /// </summary>
    public interface IDataSource
    {
        // This interface will be implemented in the IDataSource.cs file
    }

    /// <summary>
    /// This interface represents a connection string manager in the Microsoft Excel data access layer.
    /// </summary>
    public interface IConnectionStringManager
    {
        // This interface will be implemented in a separate file
    }

    /// <summary>
    /// This interface represents a data access configuration in the Microsoft Excel data access layer.
    /// </summary>
    public interface IDataAccessConfiguration
    {
        // This interface will be implemented in a separate file
    }
}
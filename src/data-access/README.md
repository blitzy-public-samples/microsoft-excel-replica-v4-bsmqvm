# Data Access Layer

This directory contains the implementation of the Data Access layer for Microsoft Excel. The Data Access layer is responsible for managing data sources, handling database connections, and providing a unified interface for data operations across various storage systems.

## Key Components

1. **IDataSource**: An interface that defines the contract for all data sources.
2. **DataAccessFactory**: A factory class responsible for creating and managing data source instances.
3. **DataAccessManager**: The main entry point for the Data Access layer, orchestrating data operations and managing connections.
4. **DatabaseConnectors**: Implementations for various database systems (e.g., SqliteConnector, AzureSqlConnector, CosmosDbConnector).
5. **DataModelManager**: Handles data modeling and schema management.
6. **DataImporter/DataExporter**: Utilities for importing and exporting data between Excel and external sources.
7. **CacheManager**: Manages caching mechanisms to improve performance.
8. **QueryBuilder**: Assists in constructing database queries.
9. **DataValidator**: Ensures data integrity and validates input/output.
10. **ErrorHandler**: Manages error handling and logging for the Data Access layer.

## Usage

To use the Data Access layer in your Excel components:

1. Include the necessary dependencies:
   ```csharp
   using Microsoft.Excel.DataAccess;
   ```

2. Obtain an instance of the DataAccessManager:
   ```csharp
   IDataAccessFactory factory = new DataAccessFactory();
   DataAccessManager dataAccessManager = new DataAccessManager(factory);
   ```

3. Use the DataAccessManager to perform data operations:
   ```csharp
   IDataSource dataSource = dataAccessManager.GetDataSource("SourceName");
   var data = await dataSource.QueryAsync("SELECT * FROM Table");
   ```

## Configuration

The Data Access layer can be configured using the `DataAccessConfiguration` class. This includes settings for connection strings, caching policies, and performance optimizations.

## Error Handling

Errors in the Data Access layer are managed through the `DataAccessException` class. Always wrap data access operations in try-catch blocks to handle potential exceptions.

## Testing

Unit tests for the Data Access layer can be found in the `Tests` directory. Run these tests regularly to ensure the integrity of the data access components.

## Performance Considerations

- Use the CacheManager to optimize frequently accessed data.
- Implement proper indexing in your data sources to improve query performance.
- Use asynchronous methods (e.g., QueryAsync) for I/O-bound operations to improve responsiveness.

## Security

- Always use parameterized queries to prevent SQL injection attacks.
- Encrypt sensitive data before storing it in the data source.
- Use the PermissionManager to enforce access controls on data operations.

## Cross-platform Considerations

The Data Access layer is designed to work consistently across desktop, web, and mobile platforms. Ensure that you're using platform-agnostic data access methods when developing cross-platform features.

## Contributing

When contributing to the Data Access layer:

1. Follow the existing coding style and naming conventions.
2. Write unit tests for new functionality.
3. Update this README.md file if you introduce new components or significant changes.
4. Document any new public APIs using XML comments.

## Version History

- v1.0.0: Initial implementation of the Data Access layer
- v1.1.0: Added support for Azure Cosmos DB
- v1.2.0: Implemented caching mechanism for improved performance
- v1.3.0: Added data import/export functionality

For a complete list of changes, please refer to the version control history.
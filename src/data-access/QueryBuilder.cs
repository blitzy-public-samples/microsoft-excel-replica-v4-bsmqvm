using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Microsoft.Excel.DataAccess
{
    /// <summary>
    /// Enum representing the type of SQL query being built.
    /// </summary>
    public enum QueryType
    {
        Select,
        Insert,
        Update,
        Delete
    }

    /// <summary>
    /// This class provides methods for building SQL queries in a fluent and type-safe manner.
    /// </summary>
    public class QueryBuilder
    {
        private QueryType _queryType;
        private string _tableName;
        private List<string> _columns;
        private List<string> _whereConditions;
        private List<string> _orderByColumns;
        private List<string> _groupByColumns;
        private List<string> _joinClauses;
        private Dictionary<string, object> _parameters;

        public QueryBuilder()
        {
            _columns = new List<string>();
            _whereConditions = new List<string>();
            _orderByColumns = new List<string>();
            _groupByColumns = new List<string>();
            _joinClauses = new List<string>();
            _parameters = new Dictionary<string, object>();
        }

        /// <summary>
        /// Initializes a SELECT query with the specified columns.
        /// </summary>
        /// <param name="columns">The columns to select.</param>
        /// <returns>The current QueryBuilder instance for method chaining.</returns>
        public QueryBuilder Select(params string[] columns)
        {
            _queryType = QueryType.Select;
            _columns.AddRange(columns);
            return this;
        }

        /// <summary>
        /// Specifies the table name for the query.
        /// </summary>
        /// <param name="tableName">The name of the table.</param>
        /// <returns>The current QueryBuilder instance for method chaining.</returns>
        public QueryBuilder From(string tableName)
        {
            _tableName = tableName;
            return this;
        }

        /// <summary>
        /// Adds a WHERE condition to the query.
        /// </summary>
        /// <param name="condition">The condition to add.</param>
        /// <returns>The current QueryBuilder instance for method chaining.</returns>
        public QueryBuilder Where(string condition)
        {
            _whereConditions.Add(condition);
            return this;
        }

        /// <summary>
        /// Adds an ORDER BY clause to the query.
        /// </summary>
        /// <param name="column">The column to order by.</param>
        /// <param name="ascending">True for ascending order, false for descending.</param>
        /// <returns>The current QueryBuilder instance for method chaining.</returns>
        public QueryBuilder OrderBy(string column, bool ascending = true)
        {
            _orderByColumns.Add($"{column} {(ascending ? "ASC" : "DESC")}");
            return this;
        }

        /// <summary>
        /// Adds a GROUP BY clause to the query.
        /// </summary>
        /// <param name="columns">The columns to group by.</param>
        /// <returns>The current QueryBuilder instance for method chaining.</returns>
        public QueryBuilder GroupBy(params string[] columns)
        {
            _groupByColumns.AddRange(columns);
            return this;
        }

        /// <summary>
        /// Adds a JOIN clause to the query.
        /// </summary>
        /// <param name="joinType">The type of join (e.g., "INNER", "LEFT", "RIGHT").</param>
        /// <param name="tableName">The name of the table to join.</param>
        /// <param name="onCondition">The ON condition for the join.</param>
        /// <returns>The current QueryBuilder instance for method chaining.</returns>
        public QueryBuilder Join(string joinType, string tableName, string onCondition)
        {
            _joinClauses.Add($"{joinType} JOIN {tableName} ON {onCondition}");
            return this;
        }

        /// <summary>
        /// Initializes an INSERT query for the specified table.
        /// </summary>
        /// <param name="tableName">The name of the table to insert into.</param>
        /// <returns>The current QueryBuilder instance for method chaining.</returns>
        public QueryBuilder Insert(string tableName)
        {
            _queryType = QueryType.Insert;
            _tableName = tableName;
            return this;
        }

        /// <summary>
        /// Initializes an UPDATE query for the specified table.
        /// </summary>
        /// <param name="tableName">The name of the table to update.</param>
        /// <returns>The current QueryBuilder instance for method chaining.</returns>
        public QueryBuilder Update(string tableName)
        {
            _queryType = QueryType.Update;
            _tableName = tableName;
            return this;
        }

        /// <summary>
        /// Initializes a DELETE query for the specified table.
        /// </summary>
        /// <param name="tableName">The name of the table to delete from.</param>
        /// <returns>The current QueryBuilder instance for method chaining.</returns>
        public QueryBuilder Delete(string tableName)
        {
            _queryType = QueryType.Delete;
            _tableName = tableName;
            return this;
        }

        /// <summary>
        /// Adds a parameter to the query for parameterized execution.
        /// </summary>
        /// <param name="name">The name of the parameter.</param>
        /// <param name="value">The value of the parameter.</param>
        /// <returns>The current QueryBuilder instance for method chaining.</returns>
        public QueryBuilder AddParameter(string name, object value)
        {
            _parameters[name] = value;
            return this;
        }

        /// <summary>
        /// Builds and returns the final SQL query string.
        /// </summary>
        /// <returns>The constructed SQL query.</returns>
        public string Build()
        {
            StringBuilder query = new StringBuilder();

            switch (_queryType)
            {
                case QueryType.Select:
                    BuildSelectQuery(query);
                    break;
                case QueryType.Insert:
                    BuildInsertQuery(query);
                    break;
                case QueryType.Update:
                    BuildUpdateQuery(query);
                    break;
                case QueryType.Delete:
                    BuildDeleteQuery(query);
                    break;
            }

            return query.ToString();
        }

        private void BuildSelectQuery(StringBuilder query)
        {
            query.Append("SELECT ");
            query.Append(_columns.Count > 0 ? string.Join(", ", _columns) : "*");
            query.Append(" FROM ");
            query.Append(_tableName);

            AppendJoinClauses(query);
            AppendWhereClause(query);
            AppendGroupByClause(query);
            AppendOrderByClause(query);
        }

        private void BuildInsertQuery(StringBuilder query)
        {
            query.Append($"INSERT INTO {_tableName} ");
            query.Append("(");
            query.Append(string.Join(", ", _columns));
            query.Append(") VALUES (");
            query.Append(string.Join(", ", _columns.ConvertAll(c => $"@{c}")));
            query.Append(")");
        }

        private void BuildUpdateQuery(StringBuilder query)
        {
            query.Append($"UPDATE {_tableName} SET ");
            query.Append(string.Join(", ", _columns.ConvertAll(c => $"{c} = @{c}")));
            AppendWhereClause(query);
        }

        private void BuildDeleteQuery(StringBuilder query)
        {
            query.Append($"DELETE FROM {_tableName}");
            AppendWhereClause(query);
        }

        private void AppendJoinClauses(StringBuilder query)
        {
            if (_joinClauses.Count > 0)
            {
                query.Append(" ");
                query.Append(string.Join(" ", _joinClauses));
            }
        }

        private void AppendWhereClause(StringBuilder query)
        {
            if (_whereConditions.Count > 0)
            {
                query.Append(" WHERE ");
                query.Append(string.Join(" AND ", _whereConditions));
            }
        }

        private void AppendGroupByClause(StringBuilder query)
        {
            if (_groupByColumns.Count > 0)
            {
                query.Append(" GROUP BY ");
                query.Append(string.Join(", ", _groupByColumns));
            }
        }

        private void AppendOrderByClause(StringBuilder query)
        {
            if (_orderByColumns.Count > 0)
            {
                query.Append(" ORDER BY ");
                query.Append(string.Join(", ", _orderByColumns));
            }
        }

        /// <summary>
        /// Executes the built query using the provided IDataSource and returns the results.
        /// </summary>
        /// <typeparam name="T">The type of the result objects.</typeparam>
        /// <param name="dataSource">The IDataSource to execute the query against.</param>
        /// <returns>A task representing the asynchronous operation, containing the query results.</returns>
        public async Task<IEnumerable<T>> ExecuteQuery<T>(IDataSource dataSource)
        {
            try
            {
                string query = Build();
                return await dataSource.ExecuteQueryAsync<T>(query, _parameters);
            }
            catch (Exception ex)
            {
                throw new DataAccessException("Error executing query", ex);
            }
        }

        /// <summary>
        /// Executes the built non-query command using the provided IDataSource and returns the number of affected rows.
        /// </summary>
        /// <param name="dataSource">The IDataSource to execute the command against.</param>
        /// <returns>A task representing the asynchronous operation, containing the number of affected rows.</returns>
        public async Task<int> ExecuteNonQuery(IDataSource dataSource)
        {
            try
            {
                string query = Build();
                return await dataSource.ExecuteNonQueryAsync(query, _parameters);
            }
            catch (Exception ex)
            {
                throw new DataAccessException("Error executing non-query command", ex);
            }
        }
    }
}
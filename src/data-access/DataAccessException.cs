using System;
using System.Runtime.Serialization;

namespace Microsoft.Excel.DataAccess
{
    /// <summary>
    /// This custom exception class is designed to handle specific errors related to data access operations in the Microsoft Excel application.
    /// </summary>
    [Serializable]
    public class DataAccessException : Exception
    {
        /// <summary>
        /// Gets or sets the error code associated with this exception.
        /// </summary>
        public int ErrorCode { get; set; }

        /// <summary>
        /// Initializes a new instance of the DataAccessException class with a specified error message.
        /// </summary>
        /// <param name="message">The error message that explains the reason for the exception.</param>
        public DataAccessException(string message) : base(message)
        {
        }

        /// <summary>
        /// Initializes a new instance of the DataAccessException class with a specified error message and a reference to the inner exception that is the cause of this exception.
        /// </summary>
        /// <param name="message">The error message that explains the reason for the exception.</param>
        /// <param name="innerException">The exception that is the cause of the current exception.</param>
        public DataAccessException(string message, Exception innerException) : base(message, innerException)
        {
        }

        /// <summary>
        /// Initializes a new instance of the DataAccessException class with serialized data.
        /// </summary>
        /// <param name="info">The SerializationInfo that holds the serialized object data about the exception being thrown.</param>
        /// <param name="context">The StreamingContext that contains contextual information about the source or destination.</param>
        protected DataAccessException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
            if (info != null)
            {
                this.ErrorCode = info.GetInt32("ErrorCode");
            }
        }

        /// <summary>
        /// Sets the SerializationInfo with information about the exception.
        /// </summary>
        /// <param name="info">The SerializationInfo that holds the serialized object data about the exception being thrown.</param>
        /// <param name="context">The StreamingContext that contains contextual information about the source or destination.</param>
        public override void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            if (info == null)
            {
                throw new ArgumentNullException(nameof(info));
            }

            info.AddValue("ErrorCode", this.ErrorCode);
            base.GetObjectData(info, context);
        }
    }
}
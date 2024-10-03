using System;
using System.Collections.Generic;
using System.Linq;

namespace Microsoft.Excel.Security.Authorization
{
    /// <summary>
    /// This class manages the permissions within the Excel application, providing methods to add, remove, and validate permissions.
    /// </summary>
    public class PermissionManager
    {
        private readonly HashSet<string> _permissions;

        public PermissionManager()
        {
            _permissions = new HashSet<string>();
        }

        /// <summary>
        /// Gets a read-only set of all valid permissions.
        /// </summary>
        public IReadOnlySet<string> Permissions => _permissions;

        /// <summary>
        /// Adds a new permission to the set of valid permissions.
        /// </summary>
        /// <param name="permission">The permission to add.</param>
        public void AddPermission(string permission)
        {
            if (string.IsNullOrWhiteSpace(permission))
            {
                throw new ArgumentException("Permission cannot be null or empty.", nameof(permission));
            }

            _permissions.Add(permission);
        }

        /// <summary>
        /// Removes a permission from the set of valid permissions.
        /// </summary>
        /// <param name="permission">The permission to remove.</param>
        public void RemovePermission(string permission)
        {
            if (string.IsNullOrWhiteSpace(permission))
            {
                throw new ArgumentException("Permission cannot be null or empty.", nameof(permission));
            }

            _permissions.Remove(permission);
        }

        /// <summary>
        /// Checks if a given permission is valid within the system.
        /// </summary>
        /// <param name="permission">The permission to check.</param>
        /// <returns>True if the permission is valid, false otherwise.</returns>
        public bool IsValidPermission(string permission)
        {
            if (string.IsNullOrWhiteSpace(permission))
            {
                return false;
            }

            return _permissions.Contains(permission);
        }

        /// <summary>
        /// Validates a collection of permissions, returning only the valid ones.
        /// </summary>
        /// <param name="permissions">The collection of permissions to validate.</param>
        /// <returns>A collection of valid permissions.</returns>
        public IEnumerable<string> ValidatePermissions(IEnumerable<string> permissions)
        {
            if (permissions == null)
            {
                throw new ArgumentNullException(nameof(permissions));
            }

            return permissions.Where(IsValidPermission);
        }
    }
}
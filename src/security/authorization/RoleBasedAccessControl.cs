using System;
using System.Collections.Generic;
using System.Linq;

namespace Microsoft.Excel.Security.Authorization
{
    /// <summary>
    /// Implements the Role-Based Access Control (RBAC) system for Microsoft Excel,
    /// providing a robust authorization mechanism to manage user permissions and access rights within the application.
    /// </summary>
    public class RoleBasedAccessControl
    {
        private readonly Dictionary<string, Role> _roles;
        private readonly Dictionary<string, List<string>> _userRoles;

        public RoleBasedAccessControl()
        {
            _roles = new Dictionary<string, Role>();
            _userRoles = new Dictionary<string, List<string>>();
        }

        /// <summary>
        /// Gets a read-only dictionary of all roles in the RBAC system.
        /// </summary>
        public IReadOnlyDictionary<string, Role> Roles => _roles;

        /// <summary>
        /// Gets a read-only dictionary of user-role assignments in the RBAC system.
        /// </summary>
        public IReadOnlyDictionary<string, IReadOnlyList<string>> UserRoles => 
            _userRoles.ToDictionary(
                kvp => kvp.Key, 
                kvp => (IReadOnlyList<string>)kvp.Value
            );

        /// <summary>
        /// Adds a new role with the specified permissions to the RBAC system.
        /// </summary>
        /// <param name="roleName">The name of the role to add.</param>
        /// <param name="permissions">The set of permissions associated with the role.</param>
        public void AddRole(string roleName, IEnumerable<string> permissions)
        {
            if (string.IsNullOrWhiteSpace(roleName))
                throw new ArgumentException("Role name cannot be null or empty.", nameof(roleName));

            if (permissions == null)
                throw new ArgumentNullException(nameof(permissions));

            if (_roles.ContainsKey(roleName))
                throw new InvalidOperationException($"Role '{roleName}' already exists.");

            _roles[roleName] = new Role(permissions);
        }

        /// <summary>
        /// Removes a role from the RBAC system.
        /// </summary>
        /// <param name="roleName">The name of the role to remove.</param>
        public void RemoveRole(string roleName)
        {
            if (string.IsNullOrWhiteSpace(roleName))
                throw new ArgumentException("Role name cannot be null or empty.", nameof(roleName));

            if (!_roles.Remove(roleName))
                throw new InvalidOperationException($"Role '{roleName}' does not exist.");

            // Remove the role from all users
            foreach (var userRoles in _userRoles.Values)
            {
                userRoles.Remove(roleName);
            }
        }

        /// <summary>
        /// Assigns a role to a user in the RBAC system.
        /// </summary>
        /// <param name="userId">The ID of the user.</param>
        /// <param name="roleName">The name of the role to assign.</param>
        public void AssignRoleToUser(string userId, string roleName)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new ArgumentException("User ID cannot be null or empty.", nameof(userId));

            if (string.IsNullOrWhiteSpace(roleName))
                throw new ArgumentException("Role name cannot be null or empty.", nameof(roleName));

            if (!_roles.ContainsKey(roleName))
                throw new InvalidOperationException($"Role '{roleName}' does not exist.");

            if (!_userRoles.TryGetValue(userId, out var userRoles))
            {
                userRoles = new List<string>();
                _userRoles[userId] = userRoles;
            }

            if (!userRoles.Contains(roleName))
            {
                userRoles.Add(roleName);
            }
        }

        /// <summary>
        /// Removes a role assignment from a user in the RBAC system.
        /// </summary>
        /// <param name="userId">The ID of the user.</param>
        /// <param name="roleName">The name of the role to remove.</param>
        public void RemoveRoleFromUser(string userId, string roleName)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new ArgumentException("User ID cannot be null or empty.", nameof(userId));

            if (string.IsNullOrWhiteSpace(roleName))
                throw new ArgumentException("Role name cannot be null or empty.", nameof(roleName));

            if (_userRoles.TryGetValue(userId, out var userRoles))
            {
                userRoles.Remove(roleName);
            }
        }

        /// <summary>
        /// Checks if a user has a specific permission based on their assigned roles.
        /// </summary>
        /// <param name="userId">The ID of the user.</param>
        /// <param name="permission">The permission to check.</param>
        /// <returns>True if the user has the permission, false otherwise.</returns>
        public bool HasPermission(string userId, string permission)
        {
            if (string.IsNullOrWhiteSpace(userId))
                throw new ArgumentException("User ID cannot be null or empty.", nameof(userId));

            if (string.IsNullOrWhiteSpace(permission))
                throw new ArgumentException("Permission cannot be null or empty.", nameof(permission));

            if (!_userRoles.TryGetValue(userId, out var userRoles))
                return false;

            return userRoles.Any(roleName => 
                _roles.TryGetValue(roleName, out var role) && role.Permissions.Contains(permission));
        }

        /// <summary>
        /// Represents a role in the RBAC system, encapsulating the role's permissions.
        /// </summary>
        private class Role
        {
            public IReadOnlySet<string> Permissions { get; }

            public Role(IEnumerable<string> permissions)
            {
                Permissions = new HashSet<string>(permissions);
            }
        }
    }
}
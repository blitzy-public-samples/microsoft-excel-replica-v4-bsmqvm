using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using Microsoft.Excel.Security.Authorization;

namespace Microsoft.Excel.Security.Tests
{
    [TestClass]
    public class AuthorizationTests
    {
        private RoleBasedAccessControl rbac;

        [TestInitialize]
        public void Setup()
        {
            rbac = new RoleBasedAccessControl();
        }

        [TestMethod]
        public void TestRoleCreationAndAssignment()
        {
            // Create a new role with specific permissions
            string roleName = "Editor";
            List<string> permissions = new List<string> { "READ", "WRITE", "EDIT" };
            bool roleCreated = rbac.AddRole(roleName, permissions);

            // Verify that the role was created successfully
            Assert.IsTrue(roleCreated, "Role should be created successfully");

            // Assign the role to a user
            string userId = "user123";
            bool roleAssigned = rbac.AssignRoleToUser(userId, roleName);

            // Verify that the user has been assigned the role
            Assert.IsTrue(roleAssigned, "Role should be assigned to the user");

            // Check that the user has the expected permissions
            foreach (string permission in permissions)
            {
                bool hasPermission = rbac.CheckPermission(userId, permission);
                Assert.IsTrue(hasPermission, $"User should have the {permission} permission");
            }
        }

        [TestMethod]
        public void TestPermissionChecking()
        {
            // Create multiple roles with different permissions
            rbac.AddRole("Viewer", new List<string> { "READ" });
            rbac.AddRole("Editor", new List<string> { "READ", "WRITE", "EDIT" });
            rbac.AddRole("Admin", new List<string> { "READ", "WRITE", "EDIT", "DELETE", "MANAGE" });

            // Assign roles to different users
            rbac.AssignRoleToUser("user1", "Viewer");
            rbac.AssignRoleToUser("user2", "Editor");
            rbac.AssignRoleToUser("user3", "Admin");

            // Check permissions for users with single roles
            Assert.IsTrue(rbac.CheckPermission("user1", "READ"), "Viewer should have READ permission");
            Assert.IsFalse(rbac.CheckPermission("user1", "WRITE"), "Viewer should not have WRITE permission");

            Assert.IsTrue(rbac.CheckPermission("user2", "READ"), "Editor should have READ permission");
            Assert.IsTrue(rbac.CheckPermission("user2", "WRITE"), "Editor should have WRITE permission");
            Assert.IsFalse(rbac.CheckPermission("user2", "DELETE"), "Editor should not have DELETE permission");

            Assert.IsTrue(rbac.CheckPermission("user3", "MANAGE"), "Admin should have MANAGE permission");

            // Assign multiple roles to a user
            rbac.AssignRoleToUser("user4", "Viewer");
            rbac.AssignRoleToUser("user4", "Editor");

            // Check permissions for users with multiple roles
            Assert.IsTrue(rbac.CheckPermission("user4", "READ"), "User4 should have READ permission");
            Assert.IsTrue(rbac.CheckPermission("user4", "WRITE"), "User4 should have WRITE permission");
            Assert.IsFalse(rbac.CheckPermission("user4", "DELETE"), "User4 should not have DELETE permission");

            // Verify that users don't have permissions from unassigned roles
            Assert.IsFalse(rbac.CheckPermission("user1", "MANAGE"), "Viewer should not have MANAGE permission");
            Assert.IsFalse(rbac.CheckPermission("user2", "MANAGE"), "Editor should not have MANAGE permission");
        }

        [TestMethod]
        public void TestRoleRemoval()
        {
            // Add roles and assign them to users
            rbac.AddRole("Temp", new List<string> { "READ", "WRITE" });
            rbac.AssignRoleToUser("user1", "Temp");

            // Verify initial permissions
            Assert.IsTrue(rbac.CheckPermission("user1", "READ"), "User1 should initially have READ permission");
            Assert.IsTrue(rbac.CheckPermission("user1", "WRITE"), "User1 should initially have WRITE permission");

            // Remove a role from the system
            bool roleRemoved = rbac.RemoveRole("Temp");

            // Check that the role no longer exists
            Assert.IsTrue(roleRemoved, "Role should be removed successfully");

            // Verify that users previously assigned the role no longer have its permissions
            Assert.IsFalse(rbac.CheckPermission("user1", "READ"), "User1 should no longer have READ permission");
            Assert.IsFalse(rbac.CheckPermission("user1", "WRITE"), "User1 should no longer have WRITE permission");
        }

        [TestMethod]
        public void TestUserRoleAssignmentAndRemoval()
        {
            // Add roles with specific permissions
            rbac.AddRole("Role1", new List<string> { "PERMISSION1", "PERMISSION2" });
            rbac.AddRole("Role2", new List<string> { "PERMISSION3", "PERMISSION4" });

            string userId = "testUser";

            // Assign multiple roles to a user
            rbac.AssignRoleToUser(userId, "Role1");
            rbac.AssignRoleToUser(userId, "Role2");

            // Verify the user has permissions from all assigned roles
            Assert.IsTrue(rbac.CheckPermission(userId, "PERMISSION1"), "User should have PERMISSION1");
            Assert.IsTrue(rbac.CheckPermission(userId, "PERMISSION2"), "User should have PERMISSION2");
            Assert.IsTrue(rbac.CheckPermission(userId, "PERMISSION3"), "User should have PERMISSION3");
            Assert.IsTrue(rbac.CheckPermission(userId, "PERMISSION4"), "User should have PERMISSION4");

            // Remove a role from the user
            bool roleRemoved = rbac.RemoveRoleFromUser(userId, "Role1");

            // Verify the role was removed
            Assert.IsTrue(roleRemoved, "Role1 should be removed from the user");

            // Verify the user no longer has permissions from the removed role
            Assert.IsFalse(rbac.CheckPermission(userId, "PERMISSION1"), "User should no longer have PERMISSION1");
            Assert.IsFalse(rbac.CheckPermission(userId, "PERMISSION2"), "User should no longer have PERMISSION2");

            // Verify the user still has permissions from remaining roles
            Assert.IsTrue(rbac.CheckPermission(userId, "PERMISSION3"), "User should still have PERMISSION3");
            Assert.IsTrue(rbac.CheckPermission(userId, "PERMISSION4"), "User should still have PERMISSION4");
        }
    }
}
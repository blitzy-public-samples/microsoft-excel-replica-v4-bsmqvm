/**
 * UserRoleEnum - An enumeration defining the various user roles in the Excel application.
 * This enum is used for implementing role-based access control in Excel.
 */
export enum UserRoleEnum {
    /**
     * User with view-only access to the Excel document.
     */
    VIEWER = 'viewer',

    /**
     * User with edit permissions for the Excel document.
     */
    EDITOR = 'editor',

    /**
     * User with full control and ownership of the Excel document.
     */
    OWNER = 'owner',

    /**
     * User with administrative privileges for the Excel application.
     */
    ADMIN = 'admin',

    /**
     * User with permission to add comments to the Excel document.
     */
    COMMENTER = 'commenter'
}

/**
 * Type guard to check if a given string is a valid UserRoleEnum value.
 * @param role - The role string to check.
 * @returns True if the role is a valid UserRoleEnum value, false otherwise.
 */
export function isValidUserRole(role: string): role is UserRoleEnum {
    return Object.values(UserRoleEnum).includes(role as UserRoleEnum);
}

/**
 * Get the display name for a given UserRoleEnum value.
 * @param role - The UserRoleEnum value.
 * @returns The display name of the role.
 */
export function getUserRoleDisplayName(role: UserRoleEnum): string {
    switch (role) {
        case UserRoleEnum.VIEWER:
            return 'Viewer';
        case UserRoleEnum.EDITOR:
            return 'Editor';
        case UserRoleEnum.OWNER:
            return 'Owner';
        case UserRoleEnum.ADMIN:
            return 'Administrator';
        case UserRoleEnum.COMMENTER:
            return 'Commenter';
        default:
            return 'Unknown Role';
    }
}

/**
 * Get the description for a given UserRoleEnum value.
 * @param role - The UserRoleEnum value.
 * @returns The description of the role.
 */
export function getUserRoleDescription(role: UserRoleEnum): string {
    switch (role) {
        case UserRoleEnum.VIEWER:
            return 'Can view the Excel document but cannot make changes.';
        case UserRoleEnum.EDITOR:
            return 'Can view and edit the Excel document.';
        case UserRoleEnum.OWNER:
            return 'Has full control over the Excel document, including sharing and deleting.';
        case UserRoleEnum.ADMIN:
            return 'Has administrative privileges for the Excel application.';
        case UserRoleEnum.COMMENTER:
            return 'Can view the Excel document and add comments.';
        default:
            return 'Unknown role description.';
    }
}
// Simplified central constants for roles and permissions

const PERMISSIONS = [
    { code: 'user:create', label: 'Create User' },
    { code: 'user:read', label: 'Read User' },
    { code: 'user:update', label: 'Update User' },
    { code: 'user:delete', label: 'Delete User' },
    { code: 'task:create', label: 'Create Task' },
    { code: 'task:read', label: 'Read Task' },
    { code: 'task:update', label: 'Update Task' },
    { code: 'task:delete', label: 'Delete Task' },
    { code: 'task:assign', label: 'Assign Task' },
];

const ROLES = [
    {
        name: 'user',
        displayName: 'User',
        description: 'Regular user with basic task access',
        permissionCodes: ['task:create', 'task:read', 'task:update'],
    },
    {
        name: 'admin',
        displayName: 'Administrator',
        description: 'Manages tasks and users across the application',
        permissionCodes: [
            'user:create',
            'user:read',
            'user:update',
            'user:delete',
            'task:create',
            'task:read',
            'task:update',
            'task:delete',
            'task:assign',
        ],
    },
    {
        name: 'super_admin',
        displayName: 'Super Administrator',
        description: 'Full access to all administrative and system operations',
        permissionCodes: [
            'user:create',
            'user:read',
            'user:update',
            'user:delete',
            'task:create',
            'task:read',
            'task:update',
            'task:delete',
            'task:assign',
        ],
    },
];

const SAMPLE_USERS = [
    {
        firstName: 'Alice',
        lastName: 'Johnson',
        email: 'alice@example.com',
        password: 'Password123!',
        role: 'user',
    },
    {
        firstName: 'Bob',
        lastName: 'Smith',
        email: 'bob@example.com',
        password: 'Password123!',
        role: 'admin',
    },
    {
        firstName: 'Eve',
        lastName: 'Super',
        email: 'eve@example.com',
        password: 'Password123!',
        role: 'super_admin',
    },
];

module.exports = { PERMISSIONS, ROLES, SAMPLE_USERS };

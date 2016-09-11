/**
 * Created by amitava on 29/04/16.
 * object role types
 * object: {
 *['USER', 'ADMIN', 'PROVIDER', 'TUTOR', 'MENTOR', 'MODERATOR']
 */

var permissions = {
    'READ': 'READ',
    'CREATE': 'CREATE',
    'UPDATE': 'UPDATE',
    'DELETE': 'DELETE'
};

var resources = {
    'PROVIDER': 'provider',
    'TUTOR': 'tutor'
};

exports.roles = {
    'ADMIN': 'admin',
    'USER': 'user',
    'PROVIDER': 'provider',
    'TUTOR': 'tutor',
    'MENTOR': 'mentor',
    'MODERATOR': 'mentor',
    'ALL': 'all'
};

exports.permissions = {

};

exports.access = {
    provider: {
        roles: {
            admin: {
                permissions: [permissions.CREATE, permissions.DELETE, permissions.UPDATE, permissions.READ]
            },
            owner: {
                permissions: [permissions.CREATE, permissions.DELETE, permissions.UPDATE, permissions.READ]
            },
            user: {
                permissions: [permissions.READ]
            },
            all: {
                permissions: [permissions.READ]
            }
        }
    },

    tutor: {
        roles: {
            admin: {
                permissions: [permissions.CREATE, permissions.DELETE, permissions.UPDATE, permissions.READ]
            },
            owner: {
                permissions: [permissions.CREATE, permissions.DELETE, permissions.UPDATE, permissions.READ]
            },
            user: {
                permissions: [permissions.READ]
            },
            all: {
                permissions: [permissions.READ]
            }
        }
    },
    
    
};


/**
 * Created by amitava on 14/04/16.
 */

/*
    Requirements
 */

module.exports = {
    status: {
        active: 'active',
        inactive: 'inactive',
        deleted: 'deleted',
        pending: 'pending',
        cancelled: 'cancelled'
    },
    groups: {
        root: 1,
        provider: 2,
        user: 4,
        mentor: 8,
        public: 16
    },
    permissions: {
        owner_read: 500,
        owner_write: 450,
        owner_delete: 400
    },
    object_privileges: {
        org: {
            CREATE: 'CREATE',
            READ: 'READ',
            UPDATE: 'UPDATE',
            DELETE: 'DELETE',
            FOO: 'FOO'
        },
        user: {

        }
    },
    user_roles: {
        admin: 1,
        provider: 2,
        user: 3,
        mentor: 4,
        public: 5
    },

    role_privilages: {
        admin: {
            org: '*'
        },
        provider: {
            org: ['CREATE', 'READ']
        },
        user: {
          org: ['READ']
        },
        public: {
            org: ['READ']
        }
    }
};

//user
/*
    groups_memberships: [],
    permissions: []
 */

//org table
/*
    owner,
    owner_group,
    permissions: []
 */

//action table
/*
 apply_object: true
 description,

 */

//actions_rule table
/*
 object_type,
 action,
 status: []
 */

//privileges table
/*
 role,
 user,
 action,
 type,
 object,
 object_id



    user:10    create   org     1



 */

/*
    access table

 */

/*
   scenario 1: user "sam" -> role = user
    a. can sam create institute
        user role has object `org` read permission - no

    b. can sam edit institute 1
        find from access table where object_type = org and object_id = 1 and user = sam;

    c. find all orgs sam can read
        find from access table where object_type = org and user = sam

   scenario 2: provider "p1" -> role = provider

   scenario 3: admin "root" -> role = admin


 */
/**
 * Created by amitava on 16/03/16.
 */

if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

function asyncRequire(module){
    return function (loc, cb) {
        require.ensure([], require => {
            cb(null, require(module).default);
        });
    }
}


const modules = {
    AdminContainer: function (loc, cb) {
        require.ensure([], require => {
            cb(null, require('./AdminContainer').default);
        });
    },
    CreateCategory: function (loc, cb) {
        require.ensure([], require => {
            cb(null, require('./CreateCategory').default);
        });
    },
    CreateCourse: function (loc, cb) {
        require.ensure([], require => {
            cb(null, require('./CreateCourse').default);
        });
    },
    CreateSubject: function (loc, cb) {
        require.ensure([], require => {
            cb(null, require('./CreateSubject').default);
        });
    },
    CreateInstitute: function (loc, cb) {
        require.ensure([], require => {
            cb(null, require('./institute/CreateInstitute').default);
        });
    },
    ManageInstitute: function (loc, cb) {
        require.ensure([], require => {
            cb(null, require('./institute/ManageInstitute').default);
        });
    },
    InstituteDetails: function (loc, cb) {
        require.ensure([], require => {
            cb(null, require('./institute/InstituteDetails').default);
        });
    },
    EditInstitute: function (loc, cb) {
        require.ensure([], require => {
            cb(null, require('./institute/EditInstitute').default);
        });
    },
    EditBasicDetails: function (loc, cb) {
        require.ensure([], require => {
            cb(null, require('./institute/EditBasicDetails').default);
        });
    },
    AssignSubject:  function (loc, cb) {
        require.ensure([], require => {
            cb(null, require('./institute/AssignSubject').default);
        });
    },
    ManageBranches: function (loc, cb) {
        require.ensure([], require => {
            cb(null, require('./institute/ManageBranches').default);
        });
    },
    ManageGallery: function (loc, cb) {
        require.ensure([], require => {
            cb(null, require('./institute/ManageGallery').default);
        });
    },
    CreateBranch: function (loc, cb) {
        require.ensure([], require => {
            cb(null, require('./institute/CreateBranch').default);
        });
    }
};

export default modules;

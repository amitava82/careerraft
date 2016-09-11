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
    Provider: function (loc, cb) {
        require.ensure([], require => {
            cb(null, require('./institute/Provider').default);
        });
    },
    ManageProvider: function (loc, cb) {
        require.ensure([], require => {
            cb(null, require('./institute/ManageProvider').default);
        });
    },
    BranchDetails: function (loc, cb) {
        require.ensure([], require => {
            cb(null, require('./institute/BranchDetails').default);
        });
    },
    EditProvider: function (loc, cb) {
        require.ensure([], require => {
            cb(null, require('./institute/EditProvider').default);
        });
    },
    ProviderProfile: function (loc, cb) {
        require.ensure([], require => {
            cb(null, require('./institute/ProviderProfile').default);
        });
    },
    AssignSubject:  function (loc, cb) {
        require.ensure([], require => {
            cb(null, require('./institute/AssignCourses').default);
        });
    },
    BranchesList: function (loc, cb) {
        require.ensure([], require => {
            cb(null, require('./institute/BranchesList').default);
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
    },
    AdManager: function(loc, cb){
        require.ensure([], require => {
            cb(null, require('./admanager/index').default);
        });
    }
};

export default modules;

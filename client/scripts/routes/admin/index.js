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
    AdminContainer: asyncRequire('./AdminContainer'),
    CreateCategory: asyncRequire('./CreateCategory'),
    CreateCourse: asyncRequire('./CreateCourse'),
    CreateSubject: asyncRequire('./CreateSubject'),
    CreateInstitute: asyncRequire('./institute/CreateInstitute'),
    ManageInstitute: asyncRequire('./institute/ManageInstitute'),
    InstituteDetails: asyncRequire('./institute/InstituteDetails'),
    EditInstitute: asyncRequire('./institute/EditInstitute'),
    EditBasicDetails: asyncRequire('./institute/EditBasicDetails'),
    AssignSubject: asyncRequire('./institute/AssignSubject'),
    ManageBranches: asyncRequire('./institute/ManageBranches'),
    ManageGallery: asyncRequire('./institute/ManageGallery')
};

export default modules;

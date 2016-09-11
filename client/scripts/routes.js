/**
 * Created by amitava on 30/01/16.
 */
import React from 'react';
import {Route, IndexRoute, IndexRedirect} from 'react-router';
import get from 'lodash/get';

import {ROUTE_MESSAGES} from './constants';
import {setLoginMessage} from './redux/modules/session';

import {
    HomeContainer
} from './routes/home'

import Dashboard from './routes/dashboard';
import InstDashboard from './routes/dashboard/institute/dashboard/Dashboard';
import InstProfile from './routes/dashboard/institute/profile/Profile';
import InstProfileCreate from './routes/dashboard/institute/profile/Create';
import UpdateCourses from './routes/dashboard/institute/profile/UpdateCourses';
import CreateBranch from './routes/dashboard/institute/profile/Branch';

import {
    InstituteContainer,
    ContactModal
} from './routes/institute';

import {
    CategoryContainer,
    CategoryDetails,
    CategoriesList
} from './routes/categories';

import {
    SearchContainer
} from './routes/search';

import Provider from './routes/provider';

import AdminModules from './routes/admin';

import StaticRoutes from './routes/misc/static';
import NotFound from './routes/misc/404';
import ServerError from './routes/misc/501';
import Error from './routes/misc/Error';

import Login from './components/LoginModal';

import App from './app';


export default (store) => {

    function ensureLoggedIn(nextState, replace, cb){
        const {session_store: {isLoggedIn, previousLocation}} = store.getState();
        if(!isLoggedIn){
            const lastRoute =nextState.routes[nextState.routes.length - 1];
            lastRoute && lastRoute.message &&  store.dispatch(setLoginMessage(lastRoute.message));

            replace({pathname: '/login', state: {modal: true, returnTo: get(previousLocation, 'pathname', '')}});
        }
        cb();
    }

    function ensureAdmin(nextState, replace, cb){
        const {session_store: {isLoggedIn, user, previousLocation}} = store.getState();
        if(!isLoggedIn)  replace({pathname: '/login', state: {modal: true, returnTo: get(previousLocation, 'pathname', '')}});

        else if(user.role !== 'ADMIN') replace('/error');

        cb();
    }

    function providerRedirect(nextState, replace, cb){
        const {session_store: {isLoggedIn, user, previousLocation}} = store.getState();

        if(!isLoggedIn){
            replace({pathname: '/login', state: {modal: true, returnTo: get(previousLocation, 'pathname', '')}});
        }else if(user.role =='USER'){
                replace('/dashboard');
        }else if(user.role == 'PROVIDER'){
            replace('/provider/dashboard');
        }else if(user.role == 'ADMIN'){
            replace('/admin');
        }
        cb();
    }
    function profileRedirect(nextState, replace, cb) {
        cb();
    }

    return (
        <Route path="/" component={App}>
            <IndexRoute component={HomeContainer} isHome={true} />
            <Route path="categories" component={CategoryContainer}>
                <IndexRoute component={CategoriesList} />
                <Route path=":id" component={CategoryDetails} />
            </Route>
            <Route path="search" component={SearchContainer}>
            </Route>
            <Route path="institute/:id" component={InstituteContainer}>
                <Route path="contact" component={ContactModal} onEnter={ensureLoggedIn} message={ROUTE_MESSAGES['contact']} />
            </Route>
            <Route path="admin" getComponent={AdminModules.AdminContainer} onEnter={ensureAdmin}>
                <Route path="provider/add" getComponent={AdminModules.CreateInstitute} />
                <Route path="provider/manage" >
                    <IndexRoute getComponent={AdminModules.ManageProvider} />
                    <Route path=":id" getComponent={AdminModules.EditProvider} >
                        <IndexRoute getComponent={AdminModules.ProviderProfile} />
                        <Route path="branches" getComponent={AdminModules.BranchesList} />
                        <Route path="create-branch" getComponent={AdminModules.CreateBranch} />
                        <Route path="gallery" getComponent={AdminModules.ManageGallery} />
                        <Route path=":branch">
                            <IndexRoute getComponent={AdminModules.BranchDetails} />
                            <Route path="subjects" getComponent={AdminModules.AssignSubject} />
                        </Route>
                    </Route>
                </Route>
                <Route path="category/add" getComponent={AdminModules.CreateCategory} />
                <Route path="category/:id/edit" getComponent={AdminModules.CreateCategory} />
                <Route path="course/add"  getComponent={AdminModules.CreateCourse} />
                <Route path="subject/add" getComponent={AdminModules.CreateSubject} />
                
                <Route path="admanager" getComponent={AdminModules.AdManager} />
            </Route>

            <Route path="dashboard" component={Dashboard} onEnter={providerRedirect}>
                <IndexRoute component={InstDashboard} />
                <Route path="profile/:id" component={InstProfile} />
                <Route path="profile/create" component={InstProfileCreate} />
                <Route path="profile/:id/create-branch" component={CreateBranch} />
                <Route path="profile/:id/edit-courses(/:course)" component={UpdateCourses} />
            </Route>
            
            <Route path="provider" component={Provider.Container}>
                <IndexRedirect to="/dashboard" />
                <Route path="dashboard" component={Provider.Dashboard} />
                <Route path="profile">
                    <IndexRoute component={Provider.ProfileContainer} />
                    <Route path="create" component={Provider.Branch} />
                    <Route path=":id" component={Provider.Profile} />
                    <Route path=":id/edit" component={Provider.Branch} />
                    <Route path=":id/courses(/:course)" component={Provider.Courses} />
                </Route>
            </Route>

            <Route path="login(/:mode)" component={Login} />
            <Route path="/about" getComponent={StaticRoutes.About}  />
            <Route path="/team" getComponent={StaticRoutes.Team}  />
            <Route path="/core-values" getComponent={StaticRoutes.Values}  />
            <Route path="/contact-us" getComponent={StaticRoutes.Contact} />
            <Route path="/educator" getComponent={StaticRoutes.Educator}  />

            <Route path="/error" component={Error} status="400" />
            <Route path="*" component={NotFound} status="404" />
        </Route>
    );
};
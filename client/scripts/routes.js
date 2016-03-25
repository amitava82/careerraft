/**
 * Created by amitava on 30/01/16.
 */
import React from 'react';
import {Route, IndexRoute} from 'react-router';
import get from 'lodash/get';

import {ROUTE_MESSAGES} from './constants';
import {setLoginMessage} from './redux/modules/session';

import {
    HomeContainer
} from './routes/home'

import {
    DashboardContainer
} from './routes/dashboard';

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

import {
    IndexContainer
} from './routes/city';

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
    

    return (
        <Route path="/" component={App}>
            <IndexRoute component={HomeContainer} isHome={true} />
            <Route path="admin" getComponent={AdminModules.AdminContainer} onEnter={ensureAdmin}>
                <Route path="institute/add" getComponent={AdminModules.CreateInstitute} />
                <Route path="institute/manage" >
                    <IndexRoute getComponent={AdminModules.ManageInstitute} />
                    <Route path=":id" getComponent={AdminModules.EditInstitute} >
                        <IndexRoute getComponent={AdminModules.EditBasicDetails} />
                        <Route path="subjects" getComponent={AdminModules.AssignSubject} />
                        <Route path="branches" getComponent={AdminModules.ManageBranches} />
                        <Route path="create-branch" getComponent={AdminModules.CreateBranch} />
                        <Route path="gallery" getComponent={AdminModules.ManageGallery} />
                    </Route>
                </Route>
                <Route path="category/add" getComponent={AdminModules.CreateCategory} />
                <Route path="category/:id/edit" getComponent={AdminModules.CreateCategory} />
                <Route path="course/add"  getComponent={AdminModules.CreateCourse} />
                <Route path="subject/add" getComponent={AdminModules.CreateSubject} />
            </Route>

            <Route path="dashboard" component={DashboardContainer} onEnter={ensureLoggedIn} />

            <Route path="login(/:mode)" component={Login} />
            <Route path="/about" getComponent={StaticRoutes.About}  />
            <Route path="/team" getComponent={StaticRoutes.Team}  />
            <Route path="/core-values" getComponent={StaticRoutes.Values}  />
            <Route path="/contact-us" getComponent={StaticRoutes.Contact} />
            <Route path="/educator" getComponent={StaticRoutes.Educator}  />

            <Route path=":city" conponent={IndexContainer}>
                <Route path="categories" component={CategoryContainer}>
                    <IndexRoute component={CategoriesList} />
                    <Route path=":id" component={CategoryDetails} />
                </Route>
                <Route path="search" component={SearchContainer}>
                </Route>
                <Route path="institute/:id" component={InstituteContainer}>
                    <Route path="contact" component={ContactModal} onEnter={ensureLoggedIn} message={ROUTE_MESSAGES['contact']} />
                </Route>
                
                <Route path=":slug" />
            </Route>

            <Route path="/error" component={Error} status="400" />
            <Route path="*" component={NotFound} status="404" />
        </Route>
    );
};
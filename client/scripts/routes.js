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
    AdminContainer,
    CreateCategory,
    CreateCourse,
    CreateInstitute,
    CreateSubject,
    ManageInstitute,
    InstituteDetails,
    EditCategory,
    EditInstitute,
    EditInstituteCategories,
    EditInstituteCourses,
    EditInstituteSubject,
    EditBasicDetails,
    AssignSubject,
    ManageBranches
} from './routes/admin'

import NotFound from './routes/misc/404';
import ServerError from './routes/misc/501';
import Error from './routes/misc/Error';
import AboutUs from './routes/misc/about';
import Team from './routes/misc/team';
import CoreValues from './routes/misc/values';
import Contact from './routes/misc/contact';
import Educator from './routes/misc/educator';

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
            <Route path="categories" component={CategoryContainer}>
                <IndexRoute component={CategoriesList} />
                <Route path=":id" component={CategoryDetails} />
            </Route>
            <Route path="search" component={SearchContainer}>
            </Route>
            <Route path="institute/:id" component={InstituteContainer}>
                <Route path="contact" component={ContactModal} onEnter={ensureLoggedIn} message={ROUTE_MESSAGES['contact']} />
            </Route>
            <Route path="admin" component={AdminContainer} onEnter={ensureAdmin}>
                <Route path="institute/add" component={CreateInstitute} />
                <Route path="institute/add" component={CreateInstitute} />
                <Route path="institute/manage" >
                    <IndexRoute component={ManageInstitute} />
                    <Route path=":id" component={EditInstitute}>
                        <IndexRoute component={EditBasicDetails} />
                        <Route path="subjects" component={AssignSubject} />
                        <Route path="branches" component={ManageBranches} />
                    </Route>
                </Route>
                <Route path="category/add" component={CreateCategory} />
                <Route path="category/:id/edit" component={EditCategory} />
                <Route path="course/add"  component={CreateCourse} />
                <Route path="subject/add" component={CreateSubject} />
            </Route>

            <Route path="dashboard" component={DashboardContainer} onEnter={ensureLoggedIn} />

            <Route path="login(/:mode)" component={Login} />
            <Route path="/about" component={AboutUs}  />
            <Route path="/team" component={Team} />
            <Route path="/core-values" component={CoreValues} />
            <Route path="/contact-us" component={Contact} />
            <Route path="/educator" component={Educator} />

            <Route path="/error" component={Error} status="400" />
            <Route path="*" component={NotFound} status="404" />
        </Route>
    );
};
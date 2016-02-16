/**
 * Created by amitava on 30/01/16.
 */
import React from 'react';
import {Route, IndexRoute, D} from 'react-router';

import {
    HomeContainer
} from './routes/home'

import {
    InstituteContainer
} from './routes/institute';

import {
    CategoryContainer
} from './routes/categories';

import {
        CourseContainer
} from './routes/course';

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
    InstituteDetails
} from './routes/admin'

import NotFound from './routes/misc/404';
import ServerError from './routes/misc/501';

import App from './app';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={HomeContainer} isHome={true} />
        <Route path="categories" component={CategoryContainer} />
        <Route path="courses" component={CourseContainer} />
        <Route path="search" component={SearchContainer}>
        </Route>
        <Route path="institute/:id" component={InstituteContainer}>
                <Route path="contact" />
        </Route>
        <Route path="admin" component={AdminContainer}>
                <Route path="institute/add" component={CreateInstitute} />
                <Route path="institute/add" component={CreateInstitute} />
                <Route path="institute/manage" component={ManageInstitute}>
                        <Route path=":id" component={InstituteDetails}>

                        </Route>
                </Route>
                <Route path="category/add" component={CreateCategory} />
                <Route path="course/add"  component={CreateCourse} />
                <Route path="subject/add" component={CreateSubject} />
        </Route>

        <Route path="*" component={NotFound} status="404" />
    </Route>
);
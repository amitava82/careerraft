/**
 * Created by amitava on 30/01/16.
 */
import React from 'react';
import {Route, IndexRoute} from 'react-router';

import {
    HomeContainer
} from './routes/home'

import {
    InstituteContainer
} from './routes/institute';

import {
    CategoryContainer,
    CategoryDetails,
    CategoriesList
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
    InstituteDetails,
    EditCategory,
    EditInstitute,
    EditInstituteCategories,
    EditInstituteCourses,
    EditInstituteSubject
} from './routes/admin'

import NotFound from './routes/misc/404';
import ServerError from './routes/misc/501';
import AboutUs from './routes/misc/about';
import Team from './routes/misc/team';
import CoreValues from './routes/misc/values';
import Contact from './routes/misc/contact';
import Educator from './routes/misc/educator';

import App from './app';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={HomeContainer} isHome={true} />
        <Route path="categories" component={CategoryContainer}>
            <IndexRoute component={CategoriesList} />
            <Route path=":id" component={CategoryDetails} />
        </Route>
        <Route path="courses" component={CourseContainer} />
        <Route path="search" component={SearchContainer}>
        </Route>
        <Route path="institute/:id" component={InstituteContainer}>
                <Route path="contact" />
        </Route>
        <Route path="admin" component={AdminContainer}>
                <Route path="institute/add" component={CreateInstitute} />
                <Route path="institute/add" component={CreateInstitute} />
                <Route path="institute/manage" >
                    <IndexRoute component={ManageInstitute} />
                    <Route path=":id" component={EditInstitute}>
                        <Route path="categories" component={EditInstituteCategories} />
                        <Route path="courses" component={EditInstituteCourses} />
                        <Route path="subjects" component={EditInstituteSubject} />
                    </Route>
                </Route>
                <Route path="category/add" component={CreateCategory} />
                <Route path="category/:id/edit" component={EditCategory} />
                <Route path="course/add"  component={CreateCourse} />
                <Route path="subject/add" component={CreateSubject} />
        </Route>

        <Route path="/about" component={AboutUs} />
        <Route path="/team" component={Team} />
        <Route path="/core-values" component={CoreValues} />
        <Route path="/contact-us" component={Contact} />
        <Route path="/educator" component={Educator} />
        <Route path="*" component={NotFound} status="404" />
    </Route>
);
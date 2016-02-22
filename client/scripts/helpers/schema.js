/**
 * Created by amitava on 20/02/16.
 */
import { normalize, Schema, arrayOf } from 'normalizr';

const instituteSchema = new Schema('institutes', {
    idAttribute: '_id'
});

const categorySchema = new Schema('categories', {
    idAttribute: '_id'
});

const courseSchema= new Schema('courses', {
    idAttribute: '_id'
});

const subjectSchema = new Schema('subjects', {
    idAttribute: '_id'
});

categorySchema.define({

});

courseSchema.define({
    category: categorySchema
});

subjectSchema.define({
    course: courseSchema,
    category: categorySchema
});

export default {
    Institute: instituteSchema,
    InstituteArray: arrayOf(instituteSchema),
    Category: categorySchema,
    CategoryArray: arrayOf(categorySchema),
    Course: courseSchema,
    CourseArray: arrayOf(courseSchema),
    Subject: subjectSchema,
    SubjectArray: arrayOf(subjectSchema)
};
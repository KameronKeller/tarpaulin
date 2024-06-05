const {ObjectId, GridFSBucket} = require('mongodb');
const {getDbReference} = require('../lib/mongo');
const auth = require('../lib/auth');

// subject, number, title, term, instructorId
const CourseSchema = {
    subject: {required: true},
    number: {required: true},
    title: {required: true},
    term: {required: true},
    instructorId: {required: true}
}


async function getCourse(courseId) {
    const db = getDbReference();

    const course = await db.collection('Courses').findOne({ _id: new ObjectId.createFromHexString(courseId) });
    if (!course) {
        return null;
    };
    
    return {
        ...course
    };
}

exports.getCourse = getCourse;

async function insertCourse(courseInfo) {
    const course = extractValidFields(courseInfo, CourseSchema);
    const db = getDbReference();
    const collection = db.collection('Courses');
    const result = await collection.insertOne(course);
    return result.insertedIds;
}

exports.insertCourse = insertCourse;

async function bulkInsertNewCourses(courses) {
    const coursesToInsert = users.map( function (course) {
        return extractValidFields(course, CourseSchema);
    });
    const db = getDbReference();
    const collection = db.collection('Courses'); 
    const result = await collection.insertMany(coursesToInsert);
    return result.insertedIds;
}
const { ObjectId, GridFSBucket } = require('mongodb')
const { getDbReference } = require('../lib/mongo')
const auth = require('../lib/auth');

const CoursesSchema = {
    subjectCode: {required: true},
    number: {required: true},
    title: {required: true},
    term: {required: true},
    instructorId: {required: true},
    students: {required: true}
}


/*
 * Delete a course from the database
 * Deletes any assignment's for that course.
*/
async function delete_course(courseId) {

    const db = getDbReference();
    const courseCollection = db.collection("Courses");
    const courseResult = await courseCollection.deleteOne({ _id: courseId });
    if(courseResult.acknowledged && courseResult.deletedCount === 1){
        const assignmentCollection = db.collection("Assignments");
        const assignmentResult= await assignmentCollection.deleteMany({ courseId: courseId });
        if(assignmentResult.acknowledged && assignmentResult.deletedCount === 1){
            return 0;
        }
    }
    return -1;
}
exports.delete_course = delete_course


/*
*   Return a Course from the database based off of it's id
*/
async function get_courses_by_id(courseId){
    const db = getDbReference();
    const collection = db.collection("Courses");
    const result = await collection.findOne({ _id: courseId });
    return result;
}
exports.get_courses_by_id = get_courses_by_id

/*
*   Adds and removes students from a course
*/
async function update_students(req, courseId){
    const db = getDbReference();
    const collection = db.collection("Courses");

    const toAdd = req.body.add;
    if(toAdd.length > 0){
        db.collection.updateOne(
            { _id: courseId },
            { $addToSet: { students: { $each: toAdd } } }
        );
    }
    const toRemove = req.body.remove;
    if(toRemove.length > 0){
        db.collection.updateOne(
            { _id: courseId },
            { $pullAll: { students: { $each: toRemove } } }
        );
    }

}

exports.update_students = update_students
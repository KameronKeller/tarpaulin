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
    const courseResult = await courseCollection.deleteOne({ id: courseId });
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
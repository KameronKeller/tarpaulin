const {ObjectId, GridFSBucket} = require('mongodb');
const {getDbReference} = require('../lib/mongo');
const auth = require('../lib/auth');
const { extractValidFields } = require('../lib/validation');

// courseId, title, points, due
const AssignmnetSchema = {
    courseId : {required: true},
    title : {required: true},
    points: {required: true},
    due: {required: true}
}

async function getAssignment(assignmentId) {
    const db = getDbReference();

    const assignment = await db.collection('Assignments').findOne({ _id: ObjectId.createFromHexString(assignmentId) });
    if (!assignment) {
        return null;
    };
    
    return {
        ...assignment
    };
}

exports.getAssignment = getAssignment;

async function insertAssignment(assignmentInfo) {
    const assignment = extractValidFields(assignmentInfo, AssignmnetSchema);
    const db = getDbReference();
    const collection = db.collection('Assignments');
    const result = await collection.insertOne(assignment);
    return {'id': result.insertedIds};
}
exports.insertAssignment = insertAssignment;

async function bulkInsertNewAssignments(assignments) {
    const assignmentsToInsert = assignments.map(function (assignment) {
        return extractValidFields(assignment, AssignmnetSchema);
    });

    const db = getDbReference();
    const collection = db.collection('Assignments');
    const results = await collection.insertMany(assignmentsToInsert);
    return results.insertedIds;
}

exports.bulkInsertNewAssignments = bulkInsertNewAssignments;

async function getAssignmentsForClass(courseId) {
    const db = getDbReference();

    const assignments = await db.collection('Assignments').find({ courseId: courseId }, {projection: {courseId: 1, title: 1, points: 1, due: 1, _id: 0}}).toArray();
    if (!assignments) {
        console.log("NULL");
        return null;
    };
    console.log("NOT NULL");
    return assignments
}

exports.getAssignmentsForClass = getAssignmentsForClass;
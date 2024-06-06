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

    const assignment = await db.collection('Assignments').findOne({ _id: new ObjectId.createFromHexString(assignmentId) });
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
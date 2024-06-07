const { getDbReference } = require("../lib/mongo");
const { ObjectId } = require("mongodb");
const { extractValidFields } = require("../lib/validation");

const AssignmentSchema = {
  courseId: { required: true },
  title: { required: true },
  points: { required: true },
  due: { required: true },
};

function getAssignments() {
  const db = getDbReference();
  const collection = db.collection("Assignments");
  return collection;
}

exports.getAssignments = getAssignments;

async function getAssignment(id) {
  const assignments = getAssignments();
  const assignment = await assignments.findOne({
    _id: id,
  });
  return assignment;
}

exports.getAssignment = getAssignment;

async function insertAssignment(assignmentInfo) {
  const assignment = extractValidFields(assignmentInfo, assignmentSchema);
  const collection = getAssignments();
  const result = await collection.insertOne(assignment);
  return result.insertedId;
}

exports.insertAssignment = insertAssignment;

async function deleteAssignment(id) {
  const collection = getAssignments();
  const result = await collection.deleteOne({ _id: id });

  return result.deletedCount;
}

exports.deleteAssignment = deleteAssignment;

async function updateAssignment(id, contents) {
  const collection = getAssignments();
  const result = await collection.updateOne(
    { _id: id },
    {
      $set: contents,
    }
  );
  return result;
}

exports.updateAssignment = updateAssignment;

async function bulkInsertNewAssignments(assignments) {
  const assignmentsToInsert = assignments.map(function (assignment) {
    return extractValidFields(assignment, AssignmentSchema);
  });
  const collection = getAssignments();
  const result = await collection.insertMany(assignmentsToInsert);
  return result.insertedIds;
}

exports.bulkInsertNewAssignments = bulkInsertNewAssignments;

async function getAssignmentsForCourse(courseId) {
  const db = getDbReference();

  const assignments = await db.collection('Assignments')
                            .find({ courseId: courseId },
                              {projection: {courseId: 1,
                                title: 1,
                                points: 1,
                                due: 1, _id: 0}}
                              ).toArray();
  if (!assignments) {
      console.log("NULL");
      return null;
  };
  console.log("NOT NULL");
  return assignments
}

exports.getAssignmentsForCourse = getAssignmentsForCourse;
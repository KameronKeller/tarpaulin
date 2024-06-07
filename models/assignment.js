const { getDbReference } = require("../lib/mongo");
const { ObjectId } = require("mongodb");

async function getAssignment(assignmentId) {
  const assignments = getAssignments();
  const assignment = assignments.findOne({
    _id: ObjectId.createFromHexString(assignmentId),
  });
  return assignment;
}

exports.getAssignment = getAssignment;

async function insertAssignment(assignment) {
  const assignment = extractValidFields(assignment, assignmentSchema);
  const collection = getAssignments();
  const result = await collection.insertOne(assignment);
  return result.insertedId;
}

exports.insertAssignment = insertAssignment;

async function deleteAssignment(id) {
  const collection = getAssignments();
  const result = collection.deleteOne({ _id: id });

  return result.deletedCount;
}

exports.deleteAssignment = deleteAssignment;

async function updateAssignment(id, contents) {
  const collection = getAssignments();
  result = await collection.updateOne(
    { _id: id },
    {
      $set: contents,
    }
  );
}

exports.updateAssignment = updateAssignment;

async function getAssignments() {
  const db = getDbReference();
  const collection = db.collection("Assignments");
  return collection;
}

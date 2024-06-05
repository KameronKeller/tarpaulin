const { getDbReference } = require("../lib/mongo");
const { ObjectId } = require("mongodb");

async function getAssignment(assignmentId) {
  const db = getDbReference();
  const assignment = await db
    .collection("Assignments")
    .findOne({ _id: ObjectId.createFromHexString(assignmentId) });
  return assignment;
}

exports.getAssignment = getAssignment;

async function insertAssignment(assignment) {
  const db = getDbReference();
  const assignment = extractValidFields(assignment, assignmentSchema);
  const collection = db.collection("Assignments");
  const result = await collection.insertOne(assignment);
  return result.insertedId;
}

exports.insertAssignment = insertAssignment;

async function deleteAssignment(id) {
  const db = getDbReference();
  const collection = db.collection("Assignments");
  const result = collection.deleteOne({ _id: id });

  return result.deletedCount;
}

exports.deleteAssignment = deleteAssignment;

async function updateAssignment(id, contents) {
  const db = getDbReference();
  const collection = db.collection("Assignments");
  result = await collection.updateOne(
    { _id: id },
    {
      $set: contents,
    }
  );
}

exports.updateAssignment = updateAssignment;

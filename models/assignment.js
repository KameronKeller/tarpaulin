const { getDbReference } = require("../lib/mongo");
const { ObjectId } = require("mongodb");
const { extractValidFields } = require("../lib/validation");
const { ROLES } = require("../lib/auth");
const { getCourseById } = require("./course");

const AssignmentSchema = {
  courseId: { required: true },
  title: { required: true },
  points: { required: true },
  due: { required: true },
};

exports.AssignmentSchema = AssignmentSchema;

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

async function insertAssignment(req) {
  const assignmentInfo = req.body;
  const assignment = extractValidFields(assignmentInfo, AssignmentSchema);
  if (req.role === ROLES.instructor) {
    const isAuthorized = await authorizeCourseInstructor(
      req.userId,
      assignment.courseId
    );
    if (!isAuthorized) {
      throw new Error("Unauthorized User");
    }
  }
  const collection = getAssignments();
  const result = await collection.insertOne(assignment);
  return result.insertedId;
}

exports.insertAssignment = insertAssignment;

async function authorizeCourseInstructor(instructorId, courseId) {
  const course = await getCourseById(courseId);
  if (!course) throw new Error("Request body is not a valid assignment object");
  return course.instructorId.toString() === instructorId;
}

exports.authorizeCourseInstructor = authorizeCourseInstructor;

async function deleteAssignment(req) {
  let assignment;
  let id;
  const collection = getAssignments();
  try {
    id = ObjectId.createFromHexString(req.params.assignmentId);
  } catch (err) {
    throw new Error("Invalid Assignment ID");
  }
  assignment = await collection.findOne({ _id: id });
  if (!assignment) throw new Error("Invalid Assignment ID");
  if (req.role === ROLES.instructor) {
    const isAuthorized = await authorizeCourseInstructor(
      req.userId,
      assignment.courseId.toString()
    );
    if (!isAuthorized) {
      throw new Error("Unauthorized User");
    }
  }
  const result = await collection.deleteOne({ _id: id });
  return result.deletedCount;
}

exports.deleteAssignment = deleteAssignment;

async function updateAssignment(req) {
  let id;
  let assignment;
  const collection = getAssignments();
  try {
    id = ObjectId.createFromHexString(req.params.assignmentId);
  } catch (err) {
    throw new Error("Invalid Assignment ID");
  }
  assignment = await collection.findOne({ _id: id });
  if (!assignment) throw new Error("Invalid Assignment ID");
  const contents = extractValidFields(req.body, AssignmentSchema);
  if (JSON.stringify(contents) === "{}") {
    throw new Error(
      "The request body was either not present or did not contain any fields related to Assignment objects"
    );
  }
  if (req.role === ROLES.instructor) {
    const isAuthorized = await authorizeCourseInstructor(
      req.userId,
      assignment.courseId
    );
    if (!isAuthorized) {
      throw new Error("Unauthorized User");
    }
  }

  const result = await collection.updateOne(
    { _id: id },
    {
      $set: contents,
    }
  );
  return result;
}

exports.updateAssignment = updateAssignment;

async function getAssignmentsForCourse(courseId) {
  const db = getDbReference();

  const assignments = await db
    .collection("Assignments")
    .find(
      { courseId: courseId },
      {
        projection: {
          courseId: 1,
          title: 1,
          points: 1,
          due: 1,
          _id: 0,
        },
      }
    )
    .toArray();
  if (!assignments) {
    return null;
  }
  return assignments;
}

exports.getAssignmentsForCourse = getAssignmentsForCourse;


async function bulkInsertNewAssignments(assignments) {
  const assignmentsToInsert = assignments.map(function (assignment) {
    return extractValidFields(assignment, AssignmentSchema);
  });
  const collection = getAssignments();
  const result = await collection.insertMany(assignmentsToInsert);
  return result.insertedIds;
}

exports.bulkInsertNewAssignments = bulkInsertNewAssignments;
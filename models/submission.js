const { ObjectId, GridFSBucket } = require("mongodb");
const { getDbReference } = require("../lib/mongo");
const auth = require("../lib/auth");
const { extractValidFields } = require("../lib/validation");

// assignmentId, studentId, timestamp, grade, file
const SubmissionSchema = {
  assignmentId: { required: true },
  studentId: { required: true },
  timestamp: { required: true },
  grade: { required: true },
  file: { required: true },
};

exports.SubmissionSchema = SubmissionSchema;

async function getSubmission(submissionId) {
  const submissions = getSubmissions();
  const submission = submissions.findOne({
    _id: ObjectId.createFromHexString(submissionId),
  });
  if (!submission) {
    return null;
  }
  return {
    ...submission,
  };
}

exports.getSubmission = getSubmission;

async function insertSubmission(submissionInfo) {
  const submission = extractValidFields(submissionInfo, SubmissionSchema);
  const collection = getSubmissions();
  const result = await collection.insertOne(submission);
  return { id: result.insertedId };
}

exports.insertSubmission = insertSubmission;

async function bulkInsertNewSubmissions(submissions) {
  const submissionsToinsert = submissions.map(function (submission) {
    return extractValidFields(submission, SubmissionSchema);
  });

  const collection = getSubmissions();
  const results = await collection.insertMany(submissionsToinsert);
  return results.insertedIds;
}

exports.bulkInsertNewSubmissions = bulkInsertNewSubmissions;

function getSubmissions() {
  const db = getDbReference();
  const collection = db.collection("Submissions");
  return collection;
}

exports.getSubmissions = getSubmissions;
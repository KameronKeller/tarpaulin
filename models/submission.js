const { ObjectId, GridFSBucket } = require("mongodb");
const { getDbReference } = require("../lib/mongo");
const auth = require("../lib/auth");
const { extractValidFields } = require("../lib/validation");
const fs = require("fs");

// assignmentId, studentId, timestamp, grade, file
const SubmissionSchema = {
  _id: { required: false },
  assignmentId: { required: true },
  studentId: { required: true },
  timestamp: { required: true },
  grade: { required: true },
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

async function insertSubmission(req) {
  const id = await _saveSubmissionfile(req);
  return id;
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

async function _saveSubmissionfile(req) {
  return new Promise((resolve, reject) => {
    const submissionInfo = req.body;
    const submission = extractValidFields(submissionInfo, SubmissionSchema);
    const db = getDbReference();
    const bucket = new GridFSBucket(db, { bucketName: "submissions" });
    const metadata = {
      contentType: req.file.mimetype,
      assignmentId: submission.assignmentId,
      studentId: submission.studentId,
      timestamp: submission.timestamp,
      grade: submission.grade,
    };
    const uploadStream = bucket.openUploadStream(req.file.filename, {
      metadata: metadata,
    });
    fs.createReadStream(req.file.path)
      .pipe(uploadStream)
      .on("error", (err) => {
        reject(err);
      })
      .on("finish", () => {
        resolve(uploadStream.id);
      });
  });
}

async function getSubmissionDownloadStream(id) {
  try {
    const submission = await getSubmissionById(id);
    if (submission) {
      const db = getDbReference();
      const bucket = new GridFSBucket(db, { bucketName: "submissions" });
      return bucket.openDownloadStreamByName(submission.filename);
    }
  } catch (err) {
    console.log(err.message);
  }
}

exports.getSubmissionDownloadStream = getSubmissionDownloadStream;

async function getSubmissionById(id) {
  const db = getDbReference();
  const bucket = new GridFSBucket(db, { bucketName: "submissions" });
  if (!ObjectId.isValid(id)) {
    return null;
  } else {
    const results = await bucket
      .find({ _id: ObjectId.createFromHexString(id) })
      .toArray();
    return results[0];
  }
}

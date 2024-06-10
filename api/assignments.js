const { Router } = require("express");
const router = Router();
const {
  getSubmissions,
  SubmissionSchema,
  insertSubmission,
} = require("../models/submission");
const {
  getAssignment,
  insertAssignment,
  deleteAssignment,
  updateAssignment,
  AssignmentSchema,
  getAssignments,
  authorizeCourseInstructor,
} = require("../models/assignment");

const { validateAgainstSchema } = require("../lib/validation");
const { authorize, authenticate, ROLES } = require("../lib/auth");
const { ObjectId } = require("mongodb");
const multer = require("multer");
const crypto = require("crypto");
const fs = require("fs");

const fileTypes = {
  "text/plain": "txt",
  "application/pdf": "pdf",
};

const upload = multer({
  storage: multer.diskStorage({
    destination: `${__dirname}/uploads`,
    filename: (req, file, callback) => {
      const filename = crypto.pseudoRandomBytes(16).toString("hex");
      const extension = fileTypes[file.mimetype];
      callback(null, `${filename}.${extension}`);
    },
  }),
  fileFilter: (req, file, callback) => {
    callback(null, !!fileTypes[file.mimetype]);
  },
});

function _removeUploadedFile(file) {
  return new Promise((resolve, reject) => {
    fs.unlink(file.path, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

router.get("/:assignmentId", async (req, res, next) => {
  try {
    const assignmentId = ObjectId.createFromHexString(req.params.assignmentId);
    const assignment = await getAssignment(assignmentId);
    delete assignment.submissions;
    res.status(200).send(assignment);
  } catch (err) {
    res.status(404).send({
      error: err,
    });
  }
});

router.post(
  "/",
  authenticate,
  authorize([ROLES.admin, ROLES.instructor]),
  async (req, res, next) => {
    if (validateAgainstSchema(req.body, AssignmentSchema)) {
      try {
        const id = await insertAssignment(req);
        res.status(201).send({
          id: id,
        });
      } catch (err) {
        if (err.message === "Unauthorized User") {
          res.status(403).send({ error: err.message });
        } else {
          res.status(400).send({
            error: err.message,
          });
        }
      }
    } else {
      res.status(400).send({
        error: "Request body is not a valid assignment object",
      });
    }
  }
);

router.delete(
  "/:assignmentId",
  authenticate,
  authorize([ROLES.admin, ROLES.instructor]),
  async (req, res, next) => {
    try {
      const deletedCount = await deleteAssignment(req);
      if (deletedCount === 1) {
        res.status(204).send({
          message: "Success",
        });
      }
    } catch (err) {
      res.status(404).send({
        error: err.message,
      });
    }
  }
);

module.exports = router;

router.patch(
  "/:assignmentId",
  authenticate,
  authorize([ROLES.admin, ROLES.instructor]),
  async (req, res, next) => {
    try {
      const result = await updateAssignment(req);
      res.status(200).send({
        id: req.params.assignmentId,
        message: "Success",
      });
    } catch (err) {
      if (err.message === "Invalid Assignment ID") {
        res.status(404).send({
          error: err.message,
        });
      } else if (err.message === "Unauthorized User") {
        res.status(403).send({
          error: err.message,
        });
      } else {
        res.status(400).send({
          error: err.message,
        });
      }
    }
  }
);

module.exports = router;

router.get(
  "/:id/submissions",
  authenticate,
  authorize([ROLES.admin, ROLES.instructor]),
  async (req, res) => {
    const Submissions = getSubmissions();
    const Assignments = await getAssignments();
    const pageSize = 10;

    let id;
    let assignment;
    try {
      id = ObjectId.createFromHexString(req.params.id);
      assignment = await Assignments.findOne({ _id: id });
      if (!assignment) throw new Error();
    } catch (err) {
      return res.status(404).send({
        error: "Invalid Assignment ID",
      });
    }

    if (req.role === ROLES.instructor) {
      const isAuthorized = await authorizeCourseInstructor(
        req.userId,
        assignment.courseId.toString()
      );
      if (!isAuthorized) {
        return res.status(403).send({
          error: "Unauthorized User",
        });
      }
    }
    let totalSubmissions;

    const results = await Submissions.find({
      "metadata.assignmentId": id,
    }).toArray();
    totalSubmissions = results.length;

    if (totalSubmissions <= 0) {
      res.status(404).send({
        error: "No submissions found for the given assignment.",
      });
    } else {
      const lastPage = Math.ceil(totalSubmissions / pageSize);
      var submissionPage = parseInt(req.query.page) || 1;

      submissionPage = submissionPage > lastPage ? 1 : submissionPage;
      submissionPage = submissionPage < 1 ? 1 : submissionPage;

      const submissions = await Submissions.find(
        { "metadata.assignmentId": id },
        {
          $skip: (submissionPage - 1) * pageSize,
          $limit: pageSize,
          $project: {
            _id: 1,
            "metadata.studentId": 1,
            "metadata.timestamp": 1,
            "metadata.grade": 1,
          },
        }
      ).toArray();

      // TODO: Might have to adjust this
      links = {};
      if (submissionPage < lastPage) {
        links.nextPage = `assignments/${id}/submissions?page=${submissionPage + 1}`;
        links.lastPage = `assignments/${id}/submissions?page=${lastPage}`;
      }
      if (submissionPage > 1) {
        links.prevPage = `assignments/${id}/submissions?page=${submissionPage - 1}`;
        links.firstPage = `assignments/${id}/submissions?page=1`;
      } else {
        links.lastPage = `assignments/${id}/submissions?page=1`;
      }
      res.status(200).send({ submissions, links: links });
    }
  }
);

router.post(
  "/:id/submissions",
  authenticate,
  upload.single("submission"),
  async (req, res) => {
    /*
     * assignmentID, studentId, timestamp, grade, file
     * Creates a new submission for the given assignment
     */
    const assignmentId = ObjectId.createFromHexString(req.params.id);
    const Assignments = await getAssignments();
    count = await Assignments.countDocuments({ _id: assignmentId });

    if (count <= 0) {
      res.status(404).send({
        error: "Assignment not found",
      });
    } else if (req.file && validateAgainstSchema(req.body, SubmissionSchema)) {
      try {
        const submissionId = await insertSubmission(req);
        await _removeUploadedFile(req.file);
        if (submissionId) {
          res
            .status(201)
            .send({ id: submissionId, link: `/submissions/${submissionId}` });
        }
      } catch (err) {
        res.status(500).send({ error: err.message });
      }
    } else {
      res
        .status(400)
        .send({ error: "Request body is missing required fields" });
    }
  }
);

module.exports = router;

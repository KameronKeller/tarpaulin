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
    const Submissions = await getSubmissions();
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
    const totalSubmissions = await Submissions.countDocuments({
      assignmentId: id,
    });

    if (totalSubmissions <= 0) {
      res.status(404).send({
        error: "No submissions found for the given assignment.",
      });
    } else {
      const lastPage = Math.ceil(totalSubmissions / pageSize);
      var submissionPage = parseInt(req.query.page) || 1;

      submissionPage = submissionPage > lastPage ? 1 : submissionPage;
      submissionPage = submissionPage < 1 ? 1 : submissionPage;

      const submissions = await Submissions.aggregate([
        { $match: { assignmentId: id } },
        { $skip: (submissionPage - 1) * pageSize },
        { $limit: pageSize },
        { $project: { _id: 1, studentId: 1, timestamp: 1, grade: 1, file: 1 } },
      ]).toArray();

      // TODO: Might have to adjust this
      links = {};
      if (submissionPage < lastPage) {
        links.nextPage = `/businesses?page=${submissionPage + 1}`;
        links.lastPage = `/businesses?page=${lastPage}`;
      }
      if (submissionPage > 1) {
        links.prevPage = `/businesses?page=${submissionPage - 1}`;
        links.firstPage = "/businesses?page=1";
      } else {
        links.lastPage = "/businesses?page=1";
      }
      res.status(200).send({ submissions, links: links });
    }
  }
);

router.post("/:id/submissions", async (req, res) => {
  /*
   * assignmentID, studentId, timestamp, grade, file
   * Creates a new submission for the given assignment
   */
  const assignmentId = ObjectId.createFromHexString(req.params.id);
  const Assignments = await getAssignments();
  assignment = await Assignments.findOne({ _id: assignmentId });
  count = await Assignments.countDocuments({ _id: assignmentId });

  if (count <= 0) {
    res.status(404).send({
      error: "Assignment not found",
    });
  } else if (validateAgainstSchema(req.body, SubmissionSchema)) {
    try {
      const submission = await insertSubmission(req.body);
      if (submission) {
        res.status(201).send({ id: submission.id });
      }
    } catch (err) {
      res.status(500).send({ error: err });
    }
  } else {
    res.status(400).send({ error: "Request body is missing required fields" });
  }
});

module.exports = router;

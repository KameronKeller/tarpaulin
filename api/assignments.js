const { Router } = require("express");
const {
  getAssignment,
  insertAssignment,
  deleteAssignment,
  updateAssignment,
} = require("../model/assignment");

const { authorize, authenticate, ROLES } = require("../lib/auth");
const { ObjectId } = require("mongodb");
const router = Router();

router.get("/:assignmentId", async (req, res, next) => {
  try {
    const assignment = await getAssignment(req.params.assignmentId);
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
    try {
      const id = await insertAssignment(req.body);
      res.status(201).send({
        id: id,
      });
    } catch (err) {
      res.status(400).send({
        error: "Request body is not a valid assignment object",
      });
    }
  }
);

router.delete("/:assignmentId", async (req, res, next) => {
  try {
    const assignmentId = ObjectId.createFromHexString(req.params.photoId);
    const deletedCount = deleteAssignment(assignmentId);
  } catch (err) {
    res.status(404).send({
      error: err,
    });
  }
});

module.exports = router;

router.patch("/:assignmentId", async (req, res, next) => {
  try {
    const assignmentId = ObjectId.createFromHexString(req.params.photoId);
    const result = updateAssignment(assignmentId, req.body);
    res.status(200).send({
      id: assignmentId,
      message: "Assignment updated successfully",
    });
  } catch (err) {
    res.status(404).send({
      error: err,
    });
  }
});

module.exports = router;

const { Router } = require("express");
const { getSubmissionDownloadStream } = require("../models/submission");
const router = Router();

router.get("/:id", async (req, res, next) => {
  const downloadStream = await getSubmissionDownloadStream(req.params.id);
  downloadStream
    .on("file", (file) => {
      res.status(200).type(file.metadata.contentType);
    })
    .on("error", (err) => {
      if (err.code === "ENOENT") {
        next();
      } else {
        next(err);
      }
    })
    .pipe(res);
});

module.exports = router;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NjY0Y2E4ZDdiYTcxNzkzN2M5OGFiNjIiLCJpYXQiOjE3MTc5NjAwMzUsImV4cCI6MTcxODA0NjQzNX0.R8SJEpTeFZaPmmvGJ5-_VAagsCOB_7lJrZiq7PjhYMI
// Assignment 6665fe388f8335ca5b92d03f
//

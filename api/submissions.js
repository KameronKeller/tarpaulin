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

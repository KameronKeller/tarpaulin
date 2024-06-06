const { Router } = require("express");
const { authenticate, authorize, ROLES, isAuthorized } = require("../lib/auth");
const router = Router();

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const subject = req.query.subject;
  const courseNumber = req.query.number;
  const term = req.query.term;

  const numPerPage = 10;

  // Query the DB for courses
  // https://www.mongodb.com/docs/atlas/atlas-search/paginate-results/#std-label-fts-paginate-results
  // Should only return:
  /*
      "subject": "CS",
      "number": "493",
      "title": "Cloud Application Development",
      "term": "sp22",
      "instructorId": 123
    */

// Src for pagination: https://codebeyondlimits.com/articles/pagination-in-mongodb-the-only-right-way-to-implement-it-and-avoid-common-mistakes
  const courses = await Courses.aggregate([
    {
      $facet: {
        metadata: [{ $count: "totalCount" }],
        data: [{ $skip: (page - 1) * pageSize }, { $limit: pageSize }],
      },
    },
  ]);

  //   const { count, rows } = await Course.findAndCountAll({
  //     limit: numPerPage,
  //     offset: page,
  //     include: [
  //       { model: Review, required: false },
  //       { model: Photo, required: false },
  //     ],
  //   });

  const lastPage = Math.ceil(count / numPerPage);
  page = page > lastPage ? lastPage : page;
  page = page < 1 ? 1 : page;

  /*
   * Generate HATEOAS links for surrounding pages.
   */
  const links = {};
  if (page < lastPage) {
    links.nextPage = `/businesses?page=${page + 1}`;
    links.lastPage = `/businesses?page=${lastPage}`;
  }
  if (page > 1) {
    links.prevPage = `/businesses?page=${page - 1}`;
    links.firstPage = "/businesses?page=1";
  }
  res.status(200).json({
    courses: rows,
    pageNumber: page,
    totalPages: lastPage,
    pageSize: numPerPage,
    totalCount: count,
    links: links,
  });
});

router.post(
  "/",
  authenticate,
  authorize([ROLES.admin]),
  async (req, res) => {
    // TODO: update validation
    // if (validateAgainstSchema(req.body, BusinessSchema)) {
    try {
      // const id = await insertNewCourse(req.body)
      res.status(201).send({
        id: id,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Error inserting course into DB.  Please try again later.",
      });
    }
    // } else {
    //   res.status(400).send({
    //     error: "Request body is not a valid course object.",
    //   });
  }
  //   }
);

/*

{
  "subject": "CS",
  "number": "493",
  "title": "Cloud Application Development",
  "term": "sp22",
  "instructorId": 123
}

 */
router.get("/:id", async (req, res, next) => {
  try {
    // const business = await getBusinessById(req.params.id);
    const course = await getCourseById(req.params.id);
    if (course) {
      res.status(200).send(course);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch business.  Please try again later.",
    });
  }
});

router.patch(
  "/:id",
  authenticate,
  authorize([ROLES.admin, ROLES.instructor]),
  async function (req, res, next) {
    if (await isAuthorized(req)) {
      const courseId = req.params.courseId;
      const result = await Course.update(req.body, {
        where: { id: courseId },
        fields: CourseFields,
      });
      if (result[0] > 0) {
        res.status(204).send();
      } else {
        next();
      }
    } else {
      res.status(403).json({
        error: "Unauthorized to access the specified resource",
      });
    }
  }
);

module.exports = router;

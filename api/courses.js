const { Router } = require("express");
const router = Router();

router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const subject = req.query.subject
  const courseNumber = req.query.number
  const term = req.query.term

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
//   const { count, rows } = await Business.findAndCountAll({
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

module.exports = router;

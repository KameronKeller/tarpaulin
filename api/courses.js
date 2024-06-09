const { Router } = require("express");
const { authenticate, authorize, ROLES, isAuthorized } = require("../lib/auth");
const router = Router();
const {getDbReference} = require('../lib/mongo');
const { getCourse, insertCourse } = require('../models/course');
const { getAssignmentsForCourse } = require('../models/assignment');

const auth = require('../lib/auth')
const {CourseSchema} = require('../models/course');
const { getPaginationLinks } = require("../lib/pagination");
const { validateAgainstSchema } = require("../lib/validation");

const CoursesSchema = {
    subjectCode: {required: true},
    number: {required: true},
    title: {required: true},
    term: {required: true},
    instructorId: {required: true},
    students: {required: true}
}

function pageNotExists(count, retrievedCourses) {
    count > 0 && retrievedCourses[0].data.length == 0
}

router.get("/", async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  const subject = req.query.subject;
  const courseNumber = req.query.number;
  const term = req.query.term;
  const queryParams = {
    subject: req.query.subject,
    number: req.query.number,
    term: req.query.term
  };

  const pageSize = 1;
  const Courses = await coursesModel.getCourses();

  // query builder
  
  let dbMatch = {}
  if (subject) {
    dbMatch.subject = subject
  }
  if (courseNumber) {
    dbMatch.number = courseNumber
  }
  if (term) {
    dbMatch.term = term
  }


// Src for pagination:
// https://codebeyondlimits.com/articles/pagination-in-mongodb-the-only-right-way-to-implement-it-and-avoid-common-mistakes
  const retrievedCourses = await Courses.aggregate([
          { $match: dbMatch },
          {
            $facet: {
                data: [
                    { $skip: (page - 1) * pageSize },
                    { $limit: pageSize },
                ],
                totalCount: [
                    { $count: "totalCount"}
                ]
            }
          }
  ]).toArray();

  let count = 0;
  // If nothing is returned, this will return undefined
  // and the count will remain at zero
  if (retrievedCourses[0].totalCount[0]) {
    count = retrievedCourses[0].totalCount[0].totalCount
  }

  if (pageNotExists(count, retrievedCourses)) {
    res.status(404).json({
        error: "Page not found"
      });
  } else {

      const {lastPage, links} = getPaginationLinks("courses", page, pageSize, count, queryParams)
    
      res.status(200).json({
        courses: retrievedCourses[0].data,
        pageNumber: page,
        totalPages: lastPage,
        pageSize: pageSize,
        totalCount: count,
        links: links,
      });
  }
});

router.post(
  "/",
  authenticate,
  authorize([ROLES.admin]),
  async (req, res) => {
    // TODO: update validation
    if (validateAgainstSchema(req.body, CourseSchema)) {
    try {
      const id = await insertCourse(req.body)
      res.status(201).send({
        id: id,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        error: "Error inserting course into DB.  Please try again later.",
      });
    }
    } else {
      res.status(400).send({
        error: "Request body is not a valid course object.",
      });
  }
    }
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
    const course = await getCourse(req.params.id);
    if (course) {
      res.status(200).send(course);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      error: "Unable to fetch course. Please try again later.",
    });
  }
});

router.patch(
  "/:id",
  authenticate,
  authorize([ROLES.admin, ROLES.instructor]),
  async function (req, res, next) {

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



/* GET /courses/{id}/students
*   Returns a list containing the User IDs of all students currently enrolled in the Course. 
*   Only an authenticated User with 'admin' role or an authenticated 'instructor' User 
*   whose ID matches the instructorId of the Course can fetch the list of enrolled students.
*/
router.get('/:courseId/students', auth.authenticate, auth.authorize(["admin", "instructor"]), async (req, res, next) => {
    try {
        const course = await coursesModel.get_courses_by_id(req.params.courseId);
        if(course){
            if((req.role == "instructor" && course.instructorId == req.userId) || req.role == "admin"){
                // An admin and an instructor with the same id as in the course can view the students
                const students = course.students;
                res.status(200).json({students});

            } else {
                // Unauthorized
                res.status(403).json({
                    error: "Unauthorized"
                });
            }
        } else {
            res.status(404).json({ error: "Invalid course id"});
        }

    } catch (error) {
        res.status(500).json({
            error: "Cannot process request"
        })
    }
})


/*
 *  Completely removes the data for the specified Course, including all enrolled students, 
 *  all Assignments, etc. Only an authenticated User with 'admin' role can remove a Course.
*/
router.delete('/:courseId', auth.authenticate, auth.authorize(["admin"]), async (req, res, next) => {
    try {
        result = await coursesModel.delete_course(req.params.courseId);
        if(result == -1){
            res.status(404).json({
                error: "Invalid course id"
            })
        } else {
            res.status(204).end();
        }
    } catch (error) {
        res.status(500).json({
            error: "Cannot process request"
        });
    }
})

/* POST /courses/{id}/students
*   Enrolls and/or unenrolls students from a Course. Only an authenticated 
*   User with 'admin' role or an authenticated 'instructor' User whose ID 
*   matches the instructorId of the Course can update the students enrolled in the Course.
*   
*   Example Request:
*   {
*   "add": [
*        "123",
*        "456"
*   ],
*   "remove": [
*       "123",
*        "456"
*     ]
*   }
*/
router.post('/:courseId/students', auth.authenticate, auth.authorize(["admin", "instructor"]), async (req, res, next) => {
    try {
        if(req.body.add || req.body.remove){
            const course = await coursesModel.get_courses_by_id(req.params.courseId);
            if(course){

                if((req.role == "instructor" && course.instructorId == req.userId) || req.role == "admin"){
                    // An admin and an instructor with the same id as in the course can view the students
                    // Update the course's students with the id's found in the add or remove array.
                    await coursesModel.update_students(req, course._id);
                    res.status(200).json({
                        success: "Successfully updated courses students"
                    });
                } else {
                    // Unauthorized
                    res.status(403).json({
                        error: "Unauthorized"
                    });
                }
            } else {
                res.status(404).json({ error: "Invalid course id"});
            }

        } else {
            // incorrect fields passed
            res.status(400).json({
                error: "Invalid fields in request"
            });
        }
    } catch (error) {
        res.status(500).json({
            error: "Cannot process request"
        });
    }
})


router.get('/:id/assignment', async (req, res) => {
    try {
        console.log("Getting assignments for course: " + req.params.id);
        results = await getAssignmentsForCourse(req.params.id);
        res.status(200).send({"assignments": results});
    } catch (err) {
        res.status(404).send({
            error: "Error fetching assignments for course. Try again later."
        });
    }
})


module.exports = router
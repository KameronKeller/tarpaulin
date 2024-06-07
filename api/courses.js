const { Router } = require('express')
const router = Router()

const auth = require('../lib/auth')
const coursesModel = require('../model/courses')


const CoursesSchema = {
    subjectCode: {required: true},
    number: {required: true},
    title: {required: true},
    term: {required: true},
    instructorId: {required: true},
    students: {required: true}
}

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

module.exports = router
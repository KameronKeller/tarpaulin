const { Router } = require('express')
const router = Router()

const auth = require('../lib/auth')
const { delete_course } = require('../model/courses')


/*
 *  Completely removes the data for the specified Course, including all enrolled students, 
 *  all Assignments, etc. Only an authenticated User with 'admin' role can remove a Course.
*/
router.delete('/:courseId', auth.authenticate, auth.authorize(["admin"]), async (req, res, next) => {
    try {
        result = await delete_course(req.params.courseId);
        if(result == -1){
            res.status(404).json({
                error: "ID Not Found"
            })
        } else {
            res.status(204).end();
        }
    } catch (error) {
        res.status(500).json({
            error: error
        });
    }
})

module.exports = router
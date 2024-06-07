const { Router } = require('express')
const router = Router()
const {getDbReference} = require('../lib/mongo');
const { getCourse } = require('../models/course');
const { getAssignmentsForClass } = require('../models/assignment');

router.get('/', (req, res) => {
    res.status(200).send("Hello Courses")
})


router.get('/:id/assignment', async (req, res) => {
    try {
        console.log("Getting assignments for course: " + req.params.id);
        results = await getAssignmentsForClass(req.params.id);
        res.status(200).send({"assignments": results});
    } catch (err) {
        res.status(404).send({
            error: "Error fetching assignments for course. Try again later."
        });
    }
})


module.exports = router
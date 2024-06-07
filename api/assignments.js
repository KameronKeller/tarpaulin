const { Router } = require('express')
const router = Router()
const {getSubmissions, SubmissionSchema, insertSubmission} = require('../models/submission');
const { validateAgainstSchema } = require('../lib/validation');
const { getAssignments } = require('../models/assignment');
const ObjectId = require('mongodb').ObjectId;

router.get('/', (req, res) => {
    res.status(200).send("Hello Assignments")
})


router.get('/:id/submissions', async (req, res) => {
    const id = ObjectId.createFromHexString(req.params.id);
    const Submissions = await getSubmissions();
    const pageSize = 10;

    const totalSubmissions = await Submissions.countDocuments({assignmentId: id});
    
    if (totalSubmissions <= 0) { 
        res.status(404).send({
            error: "No submissions found for the given assignment."
        });
    } else {
        const lastPage = Math.ceil(totalSubmissions / pageSize);
        submissionPage = parseInt(req.query.page) || 1;

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
        }
        else {
            links.lastPage = "/businesses?page=1";
        }
        res.status(200).send({submissions, "links": links});
    }
})


router.post('/:id/submissions', async (req, res) => {
    /*
    * assignmentID, studentId, timestamp, grade, file
    * Creates a new submission for the given assignment
    */
    const assignmentId = ObjectId.createFromHexString(req.params.id);
    const Assignments = await getAssignments();
    assignment = await Assignments.findOne({ _id: assignmentId});
    count = await Assignments.countDocuments({ _id: assignmentId });
    if (count <= 0) {
        res.status(404).send({
            error: "Assignment not found"
        });
    }
    else if (validateAgainstSchema(req.body, SubmissionSchema)) {
        try {
            const submission = await insertSubmission(req.body);
            if(submission) {
                res.status(201).send({id: submission.id});
            }
        } catch (err) {
            res.status(500).send({error: err});
        }
    } else {
        res.status(400).send({error: "Request body is missing required fields"});
    }
})

module.exports = router
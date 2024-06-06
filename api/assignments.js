const { Router } = require('express')
const router = Router()
const {getSubmissions} = require('../models/submission');

router.get('/', (req, res) => {
    res.status(200).send("Hello Assignments")
})


router.get('/:id/submissions', async (req, res) => {
    const id = String(req.params.id);
    console.log(`AssignmentID: ${id}`);
    const Submissions = await getSubmissions();
    const pageSize = 10;

    const totalSubmissions = await Submissions.countDocuments({assignmentId: id});
    
    if (totalSubmissions <= 0) { 
        res.status(404).send({
            error: "No submissions found for the given assignment."
        });
    } else {
        console.log(`TotalSubs: ${totalSubmissions}`);
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
        console.log(submissions);
        console
        res.status(200).send({submissions, "links": links});
    }
})

module.exports = router
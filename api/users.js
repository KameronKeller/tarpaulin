const { Router } = require('express')
const router = Router()

const auth = require('../lib/auth');
const user = require('../models/user');
const e = require('express');

const { validateAgainstSchema } = require('../lib/validation');

router.get('/', (req, res) => {
    res.status(200).send("Hello Users")
})


/*  POST /users
 *  Create and store a new application User with specified data and adds 
 *  it to the application's database. Only an authenticated User with 
 *  'admin' role can create users with the 'admin' or 'instructor' roles.
 *  
 *  Request Example:
 *  {
 *     "name": "Jane Doe",
 *      "email": "doej@oregonstate.edu",
 *      "password": "hunter2",
 *      "role": "student"
 *  }
 * 
 *  Response Example:
 *  {
 *      "id": 123
 *  }
*/
router.post('/', user.authorizeInsertUser, async (req, res) => {
    if(validateAgainstSchema(req.body), Userschema){
        try {
            const result = await insert_user(req.body);
            if(result){
                res.status(201).send(result);
            } else {
                res.status(409).json({
                    error: "Unable to create user"
                });
            }
        } catch (error) {
            res.status(500).json({
                error: "System unable to handle request"
            });
        }
    } else { res.status(400).json({error: "Request body field(s) missing"}); }
})



/*  -- POST /users/login --
 *  Authenticates a specific User with their email address and password.
 *  Responds with a authentication token.
 *  Request requires an email and password
 * 
 *  Example Request:
 *  {
 *      "email": "jdoe@oregonstate.edu",
 *      "password": "hunter2"
 *  }
 * 
 *  Example Response:
 *  {
 *      "token": "aaaaaaaa.bbbbbbbb.cccccccc"
 *  }
*/
router.post('/login', async (req, res) => {
    if (req.body && req.body.email && req.body.password) {
        try {
            // Get user by email.
            const user = get_user_by_email(req.email);
            // Validate user.
            const validate = validateUser(user, req.password);
            //const results = await login_user(req.body);
            auth.validateUser(user, req.password).then(authenticated => {
                if(authenticated){
                    const token = auth.generateAuthToken(user._id, user.role);
                    res.status(200).send({ token: token});
                } else {
                    res.status(401).json({error: "Invalid Login"});
                }
            })
        } catch (error) {
            res.status(500).send({error: error});
        }
  
    } else {
      res.status(400).json({
        error: "Request body field(s) missing."
      });
    }
});

/*
* -- GET /users/{id} --
* Returns information about the sepecific User.
* If the User has the 'instructor' role, the response should include a list of the ID's of the courses they User Teaches.
*      (i.e. Courses whose instructorId field matches the ID of this User)
* If the User has the 'student' role, the response should include a list of the IDs of the Courses the User is enrolled in
* Only an authenticated User whose ID matches the ID of the requested User can fetch this information.
* 
* Example Response:  
*   {
*      "name": "Jane Doe",
*      "email": "doej@oregonstate.edu",
*      "password": "hunter2",
*      "role": "student"
*   }
*/
router.get('/:userid', auth.authenticate, async (req, res) => {
    if (parseInt(req.userId) !== parseInt(req.params.userid) && req.role !== 'admin') {
        // User is not an admin, or does not have same ID as the one requested.
        res.status(403).json({
            error: "Unauthorized"
        });
    } else {
        const result = user.get_user(userId);
        if(result){
            res.status(200).send(result);
        } else {
            res.status(404).json({
                error: "ID Not Found"
            });
        }
    }
    
});


module.exports = router
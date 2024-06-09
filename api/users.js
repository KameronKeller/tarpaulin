const { Router } = require('express')
const router = Router()

const auth = require('../lib/auth');
const userModel = require('../models/user');
const e = require('express');

const { validateAgainstSchema, extractValidFields } = require('../lib/validation');

const UserScheme = require('../models/user').UserSchema;


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
router.post('/', auth.authenticate, userModel.authorizeInsertUser, async (req, res) => {
    if(validateAgainstSchema(req.body, UserSchema)){
        try {
            const newUserInfo = extractValidFields(req.body, UserSchema);
            const result = await userModel.insert_user(newUserInfo);
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
            const user = await userModel.get_user_by_email(req.body.email);
            // Validate user.
            auth.validateUser(user, req.body.password).then(authenticated => {
                if(authenticated){
                    const token = auth.generateAuthToken(user._id, user.role);
                    res.status(200).send({ token: token});
                } else {
                    res.status(401).json({error: "Unauthorized"});
                }
            })
        } catch (error) {
            res.status(500).json({error: "System unable to handle request"});
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
    try {
        if (parseInt(req.userId) !== parseInt(req.params.userid) && req.role !== 'admin') {
            // User is not an admin, or does not have same ID as the one requested.
            res.status(403).json({
                error: "Unauthorized"
            });
        } else {
            const result = await userModel.get_user(req.params.userid);
            if(result){
                res.status(200).send(result);
            } else {
                res.status(404).json({
                    error: "ID Not Found"
                });
            }
        }
    } catch (error) {
        res.status(500).json({error: "System unable to handle request"})
    }
    
});


module.exports = router
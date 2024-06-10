/*
 * This file contains a simple script to populate the database with initial
 * data from the files in the data/ directory.  The following environment
 * variables must be set to run this script:
 *
 *   MONGO_DB_NAME - The name of the database into which to insert data.
 *   MONGO_USER - The user to use to connect to the MongoDB server.
 *   MONGO_PASSWORD - The password for the specified user.
 *   MONGO_AUTH_DB_NAME - The database where the credentials are stored for
 *     the specified user.
 *
 * In addition, you may set the following environment variables to create a
 * new user with permissions on the database specified in MONGO_DB_NAME:
 *
 *   MONGO_CREATE_USER - The name of the user to create.
 *   MONGO_CREATE_PASSWORD - The password for the user.
 */

const { connectToDb, getDbReference, closeDbConnection } = require('./lib/mongo')
const { bulkInsertNewUsers } = require('./models/user')
const { bulkInsertNewCourses } = require('./models/course')
const { bulkInsertNewAssignments } = require('./models/assignment')
const { bulkInsertNewSubmissions } = require('./models/submission')

const assignmnetData = require('./data/assignments').assignmentData;
const coursesData = require('./data/courses').courseData;
const submissionsData = require('./data/submissions').submissionData;
const userData = require('./data/users').userData;


const mongoCreateUser = process.env.MONGO_CREATE_USER
const mongoCreatePassword = process.env.MONGO_CREATE_PASSWORD
const mongoDbName = process.env.MONGO_DB_NAME

connectToDb(async function () {
  /*
   * Insert initial business data into the database
   */
  console.log("== Inserting data into database");
  const userIds = await bulkInsertNewUsers(userData);
  console.log("== Inserted users with IDs:", userIds);

  const courseIds = await bulkInsertNewCourses(coursesData);
  console.log("== Inserted courses with IDs:", courseIds);

  const assignmentIds = await bulkInsertNewAssignments(assignmnetData);
  console.log("== Inserted assignments with IDs:", assignmentIds);

  const submissionIds = await bulkInsertNewSubmissions(submissionsData);
  console.log("== Inserted submissions with IDs:", submissionIds);

  console.log("== Selecting classes for students");
  const db = getDbReference();

  for (id in userIds) {
    const user = await db.collection('Users').findOne({_id: userIds[id]});
    if (user.role === "student") {
      let courses = []
      for (let i = 0; i < 4; i++) { 
        courses.push({"id": courseIds[i]})
      }
      user.courseIds = courses;
      await db.collection('Users').updateOne({_id: userIds[id]}, {$set: user});
    } 

    
  }


  /*
   * Create a new, lower-privileged database user if the correct environment
   * variables were specified.
   */
  if (mongoCreateUser && mongoCreatePassword) {
    const db = getDbReference()
    const users = await db.command({usersInfo: 1});
    const userExists = users.users.some(user => user.user === mongoCreateUser)

    if (!userExists) {
      const result = await db.command({
        createUser: mongoCreateUser,
        pwd: mongoCreatePassword, 
        roles: [{role: "readWrite", db: mongoDbName}],

      })
      console.log("== New user created:", result)
    }
  }

  closeDbConnection(function () {
    console.log("== DB connection closed")
  })
})
const { ObjectId } = require('mongodb')
const { getDbReference } = require('../lib/mongo')
const auth = require('../lib/auth');
const { extractValidFields } = require('../lib/validation');
var bcrypt = require("bcryptjs");

const UserSchemaInit = {
    _id : {required: false},
    name: { required: true},
    email: {required: true},
    password: {required: true},
    role: {required: true},
    courseIds: {required: false}
}

const UserSchema = {
    name: { required: true},
    email: {required: true},
    password: {required: true},
    role: {required: true},
    courseIds: {required: false}
}
exports.UserSchema = UserSchema

async function get_user(userId){
    const db = getDbReference();
    // Query for a user
    const user = await db.collection('Users').findOne({_id: ObjectId.createFromHexString(userId)});
    if(!user){
        return null;
    }
    const role = user.role;

    if (role === "instructor"){

        let coursesTeached = [];
        const courses = await db.collection('Courses').find({ instructorId: userId }).toArray();
        courses.forEach(course => {
            coursesTeached.push(`/courses/${course.id}`);
        });

        return {
            ...user,
            courses: coursesTeached
        }
    }
    if (role === "student"){

        let coursesEnrolled = [];
        const courses = await db.collection('Courses').find({ students: userId }).toArray();
        courses.forEach(course => {
            coursesEnrolled.push(`/courses/${course.id}`);
        });
        return {
            ...user,
            courses: coursesEnrolled
        }
    }
    return user
}

exports.get_user = get_user

// Only an admin is authorized to create an instructor or admin User.
function authorizeInsertUser(req, res, next) {
    let allowedRoles = [];
    if (req.body.role === 'instructor' || req.body.role === 'admin') {
        allowedRoles = ['admin'];
    } else {
        allowedRoles = ['admin', 'instructor', 'student'];
    }
    // Call the authorize middleware with the determined roles
    return auth.authorize(allowedRoles)(req, res, next);
}
exports.authorizeInsertUser = authorizeInsertUser


async function insert_user(userInfo){
    const db = getDbReference();
    const collection = db.collection("Users");
    const result = await collection.insertOne(userInfo);
    return { "id": result.insertedId}
}
exports.insert_user = insert_user

async function get_user_by_email(userEmail){
    const db = getDbReference();
    const collection = db.collection("Users");
    const result = await collection.findOne({email: userEmail})
    return result;
}

async function getUserById(id) {
    const db = getDbReference();
    const collection = db.collection("Users");
    const result = await collection.findOne({_id: ObjectId.createFromHexString(id)})
    return result;
}

function getUsers() {
    const db = getDbReference();
    const collection = db.collection('Users');
    return collection;
}



async function bulkInsertNewUsers(users) {
    const usersToInsert = users.map( function (user) {
        let extractedUser = extractValidFields(user, UserSchemaInit)
        extractedUser.password = bcrypt.hashSync(user.password, 8)
        return extractedUser
    });
    const db = getDbReference();
    const collection = db.collection('Users');
    const results = await collection.insertMany(usersToInsert);
    return results.insertedIds;
}
exports.getUserById = getUserById
exports.getUsers = getUsers
exports.get_user_by_email = get_user_by_email
exports.bulkInsertNewUsers = bulkInsertNewUsers
exports.UserSchemaInit = UserSchemaInit

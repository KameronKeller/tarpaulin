const { ObjectId, GridFSBucket } = require('mongodb')
const  {getDbReference}  = require('../lib/mongo')
const auth = require('../lib/auth');
const { extractValidFields } = require('../lib/validation');

const UserSchema = {
    name: { required: true},
    email: {required: true},
    password: {required: true},
    role: {required: true}
}


async function get_user(userId){
    const db = getDbReference();

    // Query for a user
    const user = await db.collection('Users').findOne({_id: new ObjectId.createFromHexString(userId)});
    if(!user){
        return null;
    }
    const role = user.role;
    if (role === "instructor"){

        coursesTeached = [];
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

        coursesEnrolled = [];
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
        allowedRoles = ['instructor', 'student'];
    }
  
    // Call the authorize middleware with the determined roles
    auth.authorize(allowedRoles)(req, res, next);
}
exports.authorizeInsertUser = authorizeInsertUser


async function insert_user(userInfo){
    user = extractValidFields(userInfo, UserSchema);
    const db = getDbReference();
    const collection = db.collection("Users");
    const result = await collection.insertOne(business);
    return { "id": result.insertedId}
}
exports.insert_user = insert_user


async function bulkInsertNewUsers(users) {
    const usersToInsert = users.map( function (user) {
        return extractValidFields(user, UserSchema)
    });
    const db = getDbReference();
    const collection = db.collection('users');
    const results = await collection.insertMany(usersToInsert);
    return results.insertedIds;
}

exports.bulkInsertNewUsers = bulkInsertNewUsers
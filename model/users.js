const { ObjectId } = require('mongodb')
const { getDbReference } = require('../lib/mongo')
const auth = require('../lib/auth');


async function get_user(userId){
    const db = getDbReference();
    // Query for a user
    const user = await db.collection('Users').findOne({_id: new ObjectId(String(userId))});
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
exports.get_user_by_email = get_user_by_email
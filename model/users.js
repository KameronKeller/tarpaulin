const { ObjectId, GridFSBucket } = require('mongodb')
const { getDbReference } = require('../lib/mongo')


const UserSchema = {
    name: { required: true},
    email: {required: true},
    password: {required: true},
    role: {required: true}
}


async function get_user(userId){
    const db = getDbReference();

    // Query for a user
    const user = await db.collection('Users').findOne({_id: new ObjectId(userId)});
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


/*  INSERT
async function insertNewBusiness(business) {
  business = extractValidFields(business, BusinessSchema)
  const db = getDbReference()
  const collection = db.collection('businesses')
  const result = await collection.insertOne(business)
  return result.insertedId
}
*/
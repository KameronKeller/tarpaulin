const { ObjectId, GridFSBucket } = require("mongodb");
const { getDbReference } = require("../lib/mongo");
const { extractValidFields } = require("../lib/validation");
const auth = require("../lib/auth");

// subject, number, title, term, instructorId
const CourseSchema = {
  _id: { required: false },
  subject: { required: true },
  number: { required: true },
  title: { required: true },
  term: { required: true },
  instructorId: { required: true },
};

exports.CourseSchema = CourseSchema

async function getCourse(courseId) {
  const courses = getCourses();
  const course = await courses.findOne({
    _id: ObjectId.createFromHexString(courseId),
  });
  if (!course) {
    return null;
  }

  return {
    ...course,
  };
}

exports.getCourse = getCourse;

async function insertCourse(courseInfo) {
  const course = extractValidFields(courseInfo, CourseSchema);
  const collection = getCourses();
  const result = await collection.insertOne(course);
  return result.insertedId;
}

exports.insertCourse = insertCourse;

async function updateCourse(id, courseInfo) {
  const courses = getCourses()
  const result = await courses.updateOne(
    { _id: ObjectId.createFromHexString(id) },
    {
      $set: courseInfo,
    }
  );
  return result
}

exports.updateCourse = updateCourse
 
async function bulkInsertNewCourses(courses) {
  const coursesToInsert = courses.map(function (course) {
    return extractValidFields(course, CourseSchema);
  });
  const collection = getCourses();
  const result = await collection.insertMany(coursesToInsert);
  return result.insertedIds;
}

exports.bulkInsertNewCourses = bulkInsertNewCourses;

function getCourses() {
  const db = getDbReference();
  const collection = db.collection("Courses");
  return collection;
}

exports.getCourses = getCourses;

/*
 * Delete a course from the database
 * Deletes any assignment's for that course.
 */
async function delete_course(courseId) {
  const db = getDbReference();
  const courseCollection = db.collection("Courses");
  const courseResult = await courseCollection.deleteOne({
    _id: new ObjectId(String(courseId)),
  });
  if (courseResult.acknowledged && courseResult.deletedCount === 1) {
    const assignmentCollection = db.collection("Assignments");
    assignmentCollection.deleteMany({
      courseId: new ObjectId(String(courseId)),
    });

    return 0;
  }
  return -1;
}
exports.delete_course = delete_course;

/*
 *   Return a Course from the database based off of it's id
 */
async function getCourseById(courseId) {
  const db = getDbReference();
  const collection = db.collection("Courses");
  const result = await collection.findOne({
    _id: ObjectId.createFromHexString(courseId),
  });
  return result;
}
exports.getCourseById = getCourseById;

/*
 *   Adds and removes courses from a student
 */
async function update_students(req, courseId) {
  const db = getDbReference();
  const collection = db.collection("Users");

  const toAdd = req.body.add;
  if (toAdd && (toAdd.length > 0)) {
    for (addS of toAdd){
      const resultAdd = await collection.updateOne(
        { _id: ObjectId.createFromHexString(addS), "courseIds": { $not: { $elemMatch: { id: courseId } } } },
        { $addToSet: {courseIds: {id: courseId}} } ) 
    }
  }

  const toRemove = req.body.remove;
  if (toRemove && toRemove.length > 0) {
    for (removeS of toRemove){
      const resultRemove = await collection.updateOne(
        { _id: ObjectId.createFromHexString(removeS) },
        { $pull: {courseIds: {id: courseId}} } )
    }
  }
}

exports.update_students = update_students;

const { ObjectId } = require('mongodb');

let courseData = [
  {
    "_id": new ObjectId("000000000000000000000001"),
    "subject": "CS",
    "number": "494",
    "title": "Mobile Software Development",
    "term": "sp22",
    "instructorId": ObjectId.createFromHexString("000000000000000000000006")
  },
  {
    "_id": new ObjectId("000000000000000000000002"),
    "subject": "CS",
    "number": "492",
    "title": "Web Development",
    "term": "sp22",
    "instructorId": ObjectId.createFromHexString("000000000000000000000006")
  },
  {
    "_id": new ObjectId("000000000000000000000003"),
    "subject": "CS",
    "number": "491",
    "title": "Capstone Software Engineering",
    "term": "sp22",
    "instructorId": ObjectId.createFromHexString("000000000000000000000006")
  },
  {
    "_id": new ObjectId("000000000000000000000004"),
    "subject": "CS",
    "number": "490",
    "title": "Capstone Computer Science",
    "term": "sp22",
    "instructorId": ObjectId.createFromHexString("000000000000000000000007")
  },
  {
    "_id": new ObjectId("000000000000000000000005"),
    "subject": "CS",
    "number": "495",
    "title": "Internship",
    "term": "sp22",
    "instructorId": ObjectId.createFromHexString("000000000000000000000007")
  }
]

exports.courseData = courseData;
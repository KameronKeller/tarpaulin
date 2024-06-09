const {ObjectId} = require('mongodb');

let submissionData = [
  {
    "_id": ObjectId.createFromHexString("000000000000000000000001"), 
    "assignmentId": ObjectId.createFromHexString("000000000000000000000001"),
    "studentId": ObjectId.createFromHexString("000000000000000000000001"),
    "timestamp": "2022-06-15T18:00:00-07:00",
    "grade": 89.5,
    "file": "file_url_1"
  },
  {
    "_id": ObjectId.createFromHexString("000000000000000000000002"),
    "assignmentId": ObjectId.createFromHexString("000000000000000000000002"),
    "studentId": ObjectId.createFromHexString("000000000000000000000002"),
    "timestamp": "2022-06-16T19:00:00-07:00",
    "grade": 92.0,
    "file": "file_url_2"
  },
  {
    "_id": ObjectId.createFromHexString("000000000000000000000003"),
    "assignmentId": ObjectId.createFromHexString("000000000000000000000003"),
    "studentId": ObjectId.createFromHexString("000000000000000000000003"),
    "timestamp": "2022-06-17T20:00:00-07:00",
    "grade": 88.0,
    "file": "file_url_3"
  },
  {
    "_id": ObjectId.createFromHexString("000000000000000000000004"),
    "assignmentId": ObjectId.createFromHexString("000000000000000000000004"),
    "studentId": ObjectId.createFromHexString("000000000000000000000004"),
    "timestamp": "2022-06-18T21:00:00-07:00",
    "grade": 95.0,
    "file": "file_url_4"
  },
  {
    "_id": ObjectId.createFromHexString("000000000000000000000005"),
    "assignmentId": ObjectId.createFromHexString("000000000000000000000005"),
    "studentId": ObjectId.createFromHexString("000000000000000000000005"),
    "timestamp": "2022-06-19T22:00:00-07:00",
    "grade": 90.5,
    "file": "file_url_5"
  }
]

exports.submissionData = submissionData;
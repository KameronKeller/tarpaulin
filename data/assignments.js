const {ObjectId} = require('mongodb');
let assignmentData = [
  {
    "_id": new ObjectId("000000000000000000000001"),
    "courseId": ObjectId.createFromHexString("000000000000000000000001"),
    "title": "Assignment 1",
    "points": 100,
    "due": "2022-06-15T18:00:00-07:00"
  },
  {
    "_id": new ObjectId("000000000000000000000002"),
    "courseId": ObjectId.createFromHexString("000000000000000000000001"),
    "title": "Assignment 2",
    "points": 100,
    "due": "2022-06-16T19:00:00-07:00"
  },
  {
    "_id": new ObjectId("000000000000000000000003"),
    "courseId": ObjectId.createFromHexString("000000000000000000000002"),
    "title": "Assignment 3",
    "points": 100,
    "due": "2022-06-17T20:00:00-07:00"
  },
  {
    "_id": new ObjectId("000000000000000000000004"),
    "courseId": ObjectId.createFromHexString("000000000000000000000002"),
    "title": "Assignment 4",
    "points": 100,
    "due": "2022-06-18T21:00:00-07:00"
  },
  {
    "_id": new ObjectId("000000000000000000000005"),
    "courseId": ObjectId.createFromHexString("000000000000000000000003"),
    "title": "Assignment 5",
    "points": 100,
    "due": "2022-06-19T22:00:00-07:00"
  },
  {
    "_id": new ObjectId("000000000000000000000006"),
    "courseId": ObjectId.createFromHexString("000000000000000000000003"),
    "title": "Assignment 6",
    "points": 100,
    "due": "2022-06-20T23:00:00-07:00"
  },
  {
    "_id": new ObjectId("000000000000000000000007"),
    "courseId": ObjectId.createFromHexString("000000000000000000000004"),
    "title": "Assignment 7",
    "points": 100,
    "due": "2022-06-21T00:00:00-07:00"
  },
  {
    "_id": new ObjectId("000000000000000000000008"),
    "courseId": ObjectId.createFromHexString("000000000000000000000005"),
    "title": "Assignment 8",
    "points": 100,
    "due": "2022-06-22T01:00:00-07:00"
  },
  {
    "_id": new ObjectId("000000000000000000000009"),
    "courseId": ObjectId.createFromHexString("000000000000000000000006"),
    "title": "Assignment 9",
    "points": 100,
    "due": "2022-06-23T02:00:00-07:00"
  },
  {
    "_id": new ObjectId("000000000000000000000010"),
    "courseId": ObjectId.createFromHexString("000000000000000000000007"),
    "title": "Assignment 10",
    "points": 100,
    "due": "2022-06-24T03:00:00-07:00"
  }
]

exports.assignmentData = assignmentData;
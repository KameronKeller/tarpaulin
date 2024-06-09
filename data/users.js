const ObjectId = require('mongodb').ObjectId;

let userData = [
  {
    "_id": new ObjectId("000000000000000000000001"),
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "password": "hunter2",
    "role": "student"
  },
  {
    "_id": new ObjectId("000000000000000000000002"),
    "name": "Alice Johnson",
    "email": "alicejohnson@example.com",
    "password": "hunter2",
    "role": "student"
  },
  {
    "_id": new ObjectId("000000000000000000000003"),
    "name": "Bob Williams",
    "email": "bobwilliams@example.com",
    "password": "hunter2",
    "role": "student"
  },
  {
    "_id": new ObjectId("000000000000000000000004"),
    "name": "Charlie Brown",
    "email": "charliebrown@example.com",
    "password": "hunter2",
    "role": "student"
  },
  {
    "_id": new ObjectId("000000000000000000000005"),
    "name": "David Davis",
    "email": "daviddavis@example.com",
    "password": "hunter2",
    "role": "student"
  },
  {
    "_id": new ObjectId("000000000000000000000006"),
    "name": "Eve Miller",
    "email": "evemiller@example.com",
    "password": "hunter2",
    "role": "instructor"
  },
  {
    "_id": new ObjectId("000000000000000000000007"),
    "name": "Frank Wilson",
    "email": "frankwilson@example.com",
    "password": "hunter2",
    "role": "instructor"
  },
  {
    "_id": new ObjectId("000000000000000000000008"),
    "name": "Grace Moore",
    "email": "gracemoore@example.com",
    "password": "hunter2",
    "role": "admin"
  },
  {
    "_id": new ObjectId("000000000000000000000009"),
    "name": "Harry Taylor",
    "email": "harrytaylor@example.com",
    "password": "hunter2",
    "role": "admin"
  },
  {
    "_id": new ObjectId("000000000000000000000010"),
    "name": "Ivy Anderson",
    "email": "ivyanderson@example.com",
    "password": "hunter2",
    "role": "student"
  }
]

exports.userData = userData;
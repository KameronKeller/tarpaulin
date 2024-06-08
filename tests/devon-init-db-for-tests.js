db = db.getSiblingDB('tarpaulin');  // Use your database name

db.Users.insertMany([
  {
    _id: ObjectId("60d5ecf4f0f6c0b1d8f45601"),
    name: "John Smith",
    email: "johnsmith@example.com",
    password: "$2a$08$Y00/JO/uN9n0dHKuudRX2eKksWMIHXDLzHWKuz/K67alAYsZRRike",
    role: "student",
  },
  {
    _id: ObjectId("60d5ecf4f0f6c0b1d8f45602"),
    name: "Alice Johnson",
    email: "alicejohnson@example.com",
    password: "$2a$08$Y00/JO/uN9n0dHKuudRX2eKksWMIHXDLzHWKuz/K67alAYsZRRike",
    role: "student",
  },
  {
    _id: ObjectId("60d5ecf4f0f6c0b1d8f45603"),
    name: "Bob Williams",
    email: "bobwilliams@example.com",
    password: "$2a$08$Y00/JO/uN9n0dHKuudRX2eKksWMIHXDLzHWKuz/K67alAYsZRRike",
    role: "student",
  },
  {
    _id: ObjectId("60d5ecf4f0f6c0b1d8f45604"),
    name: "Charlie Brown",
    email: "charliebrown@example.com",
    password: "$2a$08$Y00/JO/uN9n0dHKuudRX2eKksWMIHXDLzHWKuz/K67alAYsZRRike",
    role: "student",
  },
  {
    _id: ObjectId("60d5ecf4f0f6c0b1d8f45605"),
    name: "David Davis",
    email: "daviddavis@example.com",
    password: "$2a$08$Y00/JO/uN9n0dHKuudRX2eKksWMIHXDLzHWKuz/K67alAYsZRRike",
    role: "student",
  },
  {
    _id: ObjectId("60d5ecf4f0f6c0b1d8f45606"),
    name: "Eve Miller",
    email: "evemiller@example.com",
    password: "$2a$08$Y00/JO/uN9n0dHKuudRX2eKksWMIHXDLzHWKuz/K67alAYsZRRike",
    role: "instructor",
  },
  {
    _id: ObjectId("60d5ecf4f0f6c0b1d8f45607"),
    name: "Frank Wilson",
    email: "frankwilson@example.com",
    password: "$2a$08$Y00/JO/uN9n0dHKuudRX2eKksWMIHXDLzHWKuz/K67alAYsZRRike",
    role: "instructor",
  },
  {
    _id: ObjectId("60d5ecf4f0f6c0b1d8f45608"),
    name: "Grace Moore",
    email: "gracemoore@example.com",
    password: "$2a$08$Y00/JO/uN9n0dHKuudRX2eKksWMIHXDLzHWKuz/K67alAYsZRRike",
    role: "admin",
  },
  {
    _id: ObjectId("60d5ecf4f0f6c0b1d8f45609"),
    name: "Harry Taylor",
    email: "harrytaylor@example.com",
    password: "$2a$08$Y00/JO/uN9n0dHKuudRX2eKksWMIHXDLzHWKuz/K67alAYsZRRike",
    role: "admin",
  },
  {
    _id: ObjectId("60d5ecf4f0f6c0b1d8f4560a"),
    name: "Ivy Anderson",
    email: "ivyanderson@example.com",
    password: "$2a$08$Y00/JO/uN9n0dHKuudRX2eKksWMIHXDLzHWKuz/K67alAYsZRRike",
    role: "student",
  },
]);

db.Courses.insertMany([
  {
    _id: ObjectId("60d5ecf4f0f6c0b1d8f45701"),
    subject: "CS",
    number: "494",
    title: "Mobile Software Development",
    term: "sp22",
    instructorId: ObjectId("60d5ecf4f0f6c0b1d8f45607"),
    students: ["60d5ecf4f0f6c0b1d8f45603", "60d5ecf4f0f6c0b1d8f45604"],
  },
  {
    _id: ObjectId("60d5ecf4f0f6c0b1d8f45702"),
    subject: "CS",
    number: "492",
    title: "Web Development",
    term: "sp22",
    instructorId: ObjectId("60d5ecf4f0f6c0b1d8f45606"),
  },
  {
    _id: ObjectId("60d5ecf4f0f6c0b1d8f45703"),
    subject: "CS",
    number: "491",
    title: "Capstone: Software Engineering",
    term: "sp22",
    instructorId: ObjectId("60d5ecf4f0f6c0b1d8f45606"),
  },
  {
    _id: ObjectId("60d5ecf4f0f6c0b1d8f45704"),
    subject: "CS",
    number: "490",
    title: "Capstone: Computer Science",
    term: "sp22",
    instructorId: ObjectId("60d5ecf4f0f6c0b1d8f45607"),
  },
  {
    _id: ObjectId("60d5ecf4f0f6c0b1d8f45705"),
    subject: "CS",
    number: "495",
    title: "Internship",
    term: "sp22",
    instructorId: ObjectId("60d5ecf4f0f6c0b1d8f45606"),
  },
]);


db.Assignments.insertMany([
  {
    _id: ObjectId("60d5ecf4f0f6c0b1d8f45801"),
    courseId: ObjectId("5ded4d1b0000000000000006"),
    title: "Assignment 1",
    points: 100,
    due: "2022-06-15T18:00:00-07:00",
  },
  {
    _id: ObjectId("60d5ecf4f0f6c0b1d8f45802"),
    courseId: ObjectId("5ded4d1b0000000000000006"),
    title: "Assignment 2",
    points: 100,
    due: "2022-06-16T19:00:00-07:00",
  },
  {
    _id: ObjectId("60d5ecf4f0f6c0b1d8f45803"),
    courseId: ObjectId("5ded4d1b0000000000000006"),
    title: "Assignment 3",
    points: 100,
    due: "2022-06-17T20:00:00-07:00",
  },
  {
    _id: ObjectId("60d5ecf4f0f6c0b1d8f45804"),
    courseId: ObjectId("5ded4d1b0000000000000006"),
    title: "Assignment 4",
    points: 100,
    due: "2022-06-18T21:00:00-07:00",
  },
  {
    _id: ObjectId("60d5ecf4f0f6c0b1d8f45805"),
    courseId: ObjectId("5ded4d1b0000000000000007"),
    title: "Assignment 5",
    points: 100,
    due: "2022-06-19T22:00:00-07:00",
  },

  {
    _id: ObjectId("5ded4d1b0000000000000001"),
    courseId: ObjectId("5ded4d1b0000000000000007"),
    title: "Assignment 6",
    points: 100,
    due: "2022-06-20T23:00:00-07:00",
  },
  {
    _id: ObjectId("5ded4d1b0000000000000002"),
    courseId: ObjectId("5ded4d1b0000000000000008"),
    title: "Assignment 7",
    points: 100,
    due: "2022-06-21T00:00:00-07:00",
  },
  {
    _id: ObjectId("5ded4d1b0000000000000003"),
    courseId: ObjectId("5ded4d1b0000000000000008"),
    title: "Assignment 8",
    points: 100,
    due: "2022-06-22T01:00:00-07:00",
  },
  {
    _id: ObjectId("5ded4d1b0000000000000004"),
    courseId: ObjectId("5ded4d1b0000000000000009"),
    title: "Assignment 9",
    points: 100,
    due: "2022-06-23T02:00:00-07:00",
  },
  {
    _id: ObjectId("5ded4d1b0000000000000005"),
    courseId: ObjectId("5ded4d1b000000000000000a"),
    title: "Assignment 10",
    points: 100,
    due: "2022-06-24T03:00:00-07:00",
  }
]);


db.Courses.insertMany(
[
  {
    _id: ObjectId("5ded4d1b0000000000000006"),
    subject: "CS",
    number: "494",
    title: "Mobile Software Development",
    term: "sp22",
    instructorId: ObjectId("60d5ecf4f0f6c0b1d8f45606")
  },
  {
    _id: ObjectId("5ded4d1b0000000000000007"),
    subject: "CS",
    number: "492",
    title: "Web Development",
    term: "sp22",
    instructorId: ObjectId("60d5ecf4f0f6c0b1d8f45606")
  },
  {
    _id: ObjectId("5ded4d1b0000000000000008"),
    subject: "CS",
    number: "491",
    title: "Capstone: Software Engineering",
    term: "sp22",
    instructorId: ObjectId("60d5ecf4f0f6c0b1d8f45606")
  },
  {
    _id: ObjectId("5ded4d1b0000000000000009"),
    subject: "CS",
    number: "490",
    title: "Capstone: Computer Science",
    term: "sp22",
    instructorId: ObjectId("60d5ecf4f0f6c0b1d8f45607")
  },
  {
    _id: ObjectId("5ded4d1b000000000000000a"),
    subject: "CS",
    number: "495",
    title: "Internship",
    term: "sp22",
    instructorId: ObjectId("60d5ecf4f0f6c0b1d8f45607")
  },
  { _id: ObjectId('5ded4d1b000000000100000b'), 
    subject: 'Math', 
    number: '201', 
    title: 'Calculus I', 
    term: 'fa23', 
    instructorId: ObjectId('60d5ecf4f0f6c0b1d8f45608') 
  },
  { _id: ObjectId('5ded4d1b000000000100000c'), 
    subject: 'History', 
    number: '342', 
    title: 'American Revolution', 
    term: 'wi24', 
    instructorId: ObjectId('60d5ecf4f0f6c0b1d8f45609') 
  },
  { _id: ObjectId('5ded4d1b000000000100000d'), 
    subject: 'English', 
    number: '101', 
    title: 'Introduction to Literature', 
    term: 'su23', 
    instructorId: ObjectId('60d5ecf4f0f6c0b1d8f45607') 
  },
]);

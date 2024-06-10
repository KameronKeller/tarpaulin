#!/bin/bash

# This file includes tests for the following endpoints:
#   GET /courses
#   POST /courses
#   GET /courses/{id}
#   PATCH /courses/{id}
#   GET /courses/{id}/roster



status() {
    printf "\n=====================================================\n"
    printf "%s\n" "$1"
    printf -- "-----------------------------------------------------\n"
}

status "POST login to get token"
token=$(curl -X POST -H "Content-Type: application/json" -d \
    '{"email": "gracemoore@example.com", "password": "hunter2"}' \
    http://localhost:3000/users/login | jq -r ".token")

echo $token

status "GET all courses"
curl "http://localhost:3000/courses" | jq

status "GET courses with query params"
curl "http://localhost:3000/courses?page=1&subject=CS&number=494&term=sp22" | jq

status "GET courses with only some query params"
curl "http://localhost:3000/courses?subject=CS" | jq

status "POST create a course fails if the instructor id does not exist"
curl "http://localhost:3000/courses" \
    -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $token" \
    --data '{"subject": "SP", "number": "999", "title": "Social Psychology", "term": "sp22", "instructorId": "zzz5ba31bcd3c231b91d6c69"}' | jq

# Create an instructor for creating a course
instructorId=$(curl "http://localhost:3000/users" \
    -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $token" \
    --data '{"name": "Instructor 1", "email": "999@aaa.com", "password": "hunter2", "role": "instructor"}' | jq -r ".id")

echo $instructorId

status "POST create a course"
curl "http://localhost:3000/courses" \
    -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $token" \
    --data "{\"subject\": \"SP\", \"number\": \"999\", \"title\": \"Social Psychology\", \"term\": \"sp22\", \"instructorId\": \"$instructorId\"}" | jq

# Create a course for getting a course by id
courseID=$(curl "http://localhost:3000/courses" \
    -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $token" \
    --data "{\"subject\": \"SP\", \"number\": \"888\", \"title\": \"Social Psychology\", \"term\": \"sp22\", \"instructorId\": \"$instructorId\"}" | jq -r ".id")

status "GET course by id"
curl "http://localhost:3000/courses/$courseID" \
    -H "Authorization: Bearer $token" | jq

status "PATCH update a course"
curl -v "http://localhost:3000/courses/$courseID" \
    -X PATCH \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $token" \
    --data '{"subject": "WHAT? I CHANGED THIS", "number": "999", "title": "Social Psychology", "term": "sp22", "instructorId": "6665ba31bcd3c231b91d6c69"}'

# Add some students to a course
curl "http://localhost:3000/courses/$courseID/students" \
    -X POST \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $token" \
    -d '{"add": ["000000000000000000000005", "000000000000000000000003"], "remove": []}' | jq

status "GET a course roster"
curl "http://localhost:3000/courses/$courseID/roster" \
    -H "Authorization: Bearer $token"
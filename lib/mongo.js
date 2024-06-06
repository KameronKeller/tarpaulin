/*
 * Module for working with a MongoDB connection.
 */

const { MongoClient } = require('mongodb')

const mongoHost = process.env.MONGO_HOST || 'localhost'
const mongoPort = process.env.MONGO_PORT || 27017
const mongoUser = process.env.MONGO_USER
const mongoPassword = process.env.MONGO_PASSWORD
const mongoDbName = process.env.MONGO_DB_NAME
const mongoAuthDbName = process.env.MONGO_AUTH_DB_NAME || mongoDbName

const mongoUrl = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoAuthDbName}`

console.log(mongoUrl);


let db = null
let _closeDbConnection = null
// console.log('mongo.js 22');

exports.connectToDb = async function (callback) {
  console.log("inside connectToDb");
  try {
    console.log("inside try")
    const client = await MongoClient.connect(mongoUrl);
    db = client.db(mongoDbName)
    _closeDbConnection = function () {
          client.close()
        }
          callback()
    console.log("OUTSIDE OF MongoClient.connect");
  } catch (err) {
    console.log(err)
  }
}

exports.getDbReference = function () {
  return db
}

exports.closeDbConnection = function (callback) {
  _closeDbConnection(callback)
}
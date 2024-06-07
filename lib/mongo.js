/*
 * Module for working with a MongoDB connection.
 */

const { MongoClient } = require("mongodb");

const mongoHost = process.env.MONGO_HOST || "localhost";
const mongoPort = process.env.MONGO_PORT || 27017;
const mongoUser = process.env.MONGO_USER;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoDbName = process.env.MONGO_DB_NAME;
const mongoAuthDbName = process.env.MONGO_AUTH_DB_NAME || mongoDbName;

const mongoUrl = `mongodb://${mongoUser}:${mongoPassword}@${mongoHost}:${mongoPort}/${mongoAuthDbName}`;

console.log(mongoUrl);

let db = null;
let _closeDbConnection = null;

exports.connectToDb = async function (callback) {
  let client;
  var count = 1;
  while (true) {
    try {
      client = await MongoClient.connect(mongoUrl);
      break;
    } catch (err) {
      console.log(`Connection error ${err} attempt number ${count}`);
      count += 1;
      await new Promise((resolve) => {
        setTimeout(resolve, 3000);
      });
    }
  }
  try {
    db = client.db(mongoDbName);
    _closeDbConnection = function () {
      client.close();
    };
    callback();
  } catch (err) {
    console.log(err);
  }
};

exports.getDbReference = function () {
  return db;
};

exports.closeDbConnection = function (callback) {
  _closeDbConnection(callback);
};

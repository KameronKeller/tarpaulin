const redis = require('redis');
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;
const redisPassword = process.env.REDIS_PASSWORD || 'password';

const redisUrl = `redis://:${redisPassword}@${redisHost}:${redisPort}`; 

const client = redis.createClient({
  url: redisUrl
});

client.on('error', (err) => {
  console.error('Error connecting to Redis:', err);
});

client.connect();

module.exports = client;

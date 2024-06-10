const redisClient = require('./redis')

const refreshRate = 1;
const maxtokens = 15;
const requestCost = 10;


/*
* prevReqTime 
* user_bucket_data
* {
*     tokens: 3,
*     prevReqTime: 123456789
* }
*/
async function rateLimiting(req, res, next) {
    try {
        let userIp = String(req.ip);
        let reply = await redisClient.exists(req.ip);
        if (reply === 1) {
            let userData = await redisClient.get(userIp);

            let data = JSON.parse(userData);
            let currentTime = Date.now();
            let timeElapsed = currentTime - Number(data.prevReqTime);
            data.tokens += timeElapsed * refreshRate;
            data.prevReqTime = currentTime;

            console.log(`Tokens: ${data.tokens}`);

            if (data.tokens > maxtokens) {
                data.tokens = maxtokens;
            }
            if (data.tokens > requestCost) {
                data.tokens -= requestCost;
                await redisClient.set(userIp, JSON.stringify(data));
                next();
            } else {
                return res.status(429).json({
                    error: "Too many requests"
                });
            }
        } else {
            let data = {
                tokens: maxtokens,
                prevReqTime: Date.now()
            };

            data.tokens -= requestCost;
            await redisClient.set(userIp, JSON.stringify(data));
            next();
        }
    } catch (err) {
        console.log('Error: ' + err);
    }
}

exports.rateLimiting = rateLimiting;
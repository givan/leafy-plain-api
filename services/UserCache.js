const User = require('../models/User');
const Redis = require('ioredis');

const USERS_SET = "users"; // TODO: put this in a config
const USER_EXPIRY_TIME_SEC = 30; // TODO: put this in a config

class UserCache {
  static createInstance() {
    // read the connections tring from the ENV variables (future have a config file and store it there)
    const redisConnString = process.env.REDIS_CONN_STR;
    if (!redisConnString)
      throw new Error("need to store the redis conn string into REDIS_CONN_STR env variable");

    //"redis://:u2M78NRUEyWkQYTa63ASnQXHFzRMsdKP5MLda2VsEZ4=@leafly.redis.cache.windows.net"
    console.log(`Redis conn string: ${redisConnString}`);
    return new UserCache(new Redis(redisConnString), USER_EXPIRY_TIME_SEC);
  }

  constructor(redisClient, userDataExpiryTimeSecs) {
    this._redisClient = redisClient;
    this._userDataExpirationTimeSecs = userDataExpiryTimeSecs; // in seconds
  }

  getAll(cb) {
    // go fetch thie list of users from Redis
    this._redisClient.smembers(USERS_SET, (err, result) => {
      if (err) {
        return (cb(err));
      }

      if (result.length > 0) {
        this._redisClient.mget(result, (err, userKeys) => {
          if (err) {
            return cb(err);
          }

          let missingUsers = [];
          let foundUsers = [];
          for (let index = 0; index < userKeys.length; index++) {
            const userData = userKeys[index];
            if (userData !== null) { // guard against expired keys
              let parsedUser = JSON.parse(userData);
              let user = new User(parsedUser.name, parsedUser.phone, parsedUser.id);
              foundUsers.push(user);
            } else {
              // get the missing user key from the result returned from SMEMBERS
              missingUsers.push(result[index]);
            }
          }
          
          // if we found any missing users, remove them from the SET (we don't need to wait for this to complete)
          if (missingUsers.length > 0) {
            this._redisClient.srem(USERS_SET, missingUsers, (err) => {
              console.error(`Failed removing missing users: ${err}`);
            });
          }

          cb(null, foundUsers);
        });
      }
      else {
        return cb(null, []); // return an empty result
      }
    });
  }

  store(user, cb) {

    const userKey = `users:${user.id}`;

    // first store the user data as regular string value
    this._redisClient.setex(userKey, this._userDataExpirationTimeSecs, JSON.stringify(user),
      (err, res) => {
        if (err) {
          // add logging
          return cb(err);
        }

        if (res === "OK") {
          // now store the user id into the USERS set for later retrieval
          this._redisClient.sadd(USERS_SET, userKey, (err, result) => {
            if (err) {
              return cb(err); // we should think about deleting the STRING for this user as well (stale)
            }

            // succesfully added the new user to the Redis index and the user data
            cb(null, user);
          });
        } else {
          return cb(`Failed storing user: ${user.id}`, null);
        }
      });
  }
}

module.exports = UserCache;
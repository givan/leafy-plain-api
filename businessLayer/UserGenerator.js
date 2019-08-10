const UserCache = require('../services/UserCache');
const UserApiClient = require('../services/UserApiClient');
const User = require('../models/User');
const async = require('async');

class UserGenerator {

  static createInstance() {
    const userCache = UserCache.createInstance();
    const userApiClient = UserApiClient.createInstance();

    return new UserGenerator(userCache, userApiClient);
  }

  constructor(userCache, userApiClient) {
    this._userCache = userCache;
    this._userApi = userApiClient;
  }

  generateNewUsers(count, cb) {

    this.retrieveAllUsers((err, existingUsers) => {
      if (err) {
        return cb(err);
      }

      let asyncCreateUsersFuncs = [];
      for (let index = 0; index < count; index++) {
        
        const createSingleUserFunc = (callback) => {
          this._userApi.get((err, response) => {
            if (err) {
              return callback(err);
            }

            const newUser = new User(response.name, response.phone);

            this.store(newUser, (err, result) => {
              if (err) {
                return callback(err);
              }

              callback(null, newUser);
            });
          });
        }

        asyncCreateUsersFuncs.push(createSingleUserFunc);
      }

      async.parallel(asyncCreateUsersFuncs, (err, results) => {
        if (err) {
          console.error(`failed creating new users: ${err}`);
        }

        // even if creating new users failed, we'll still return the existing array of users
        const newUsers = results ? results : [];
        cb(null, { newUsers, existingUsers });
      });
    });
  }

  store(user, cb) {
    this._userCache.store(user, (err, result) => {
      return cb(err, result);
    });
  }

  retrieveAllUsers(cb) {
    // first get all previously generated users
    this._userCache.getAll((err, cachedUsers) => {

      if (err) {
        return cb(err);
      }

      cb(null, cachedUsers);
    });
  }
}

module.exports = UserGenerator;
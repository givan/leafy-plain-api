const UserCache = require('../services/UserCache');
const UserApiClient = require('../services/UserApiClient');
const User = require('../models/User');

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

  generateNewUser(count, cb) {

    this.retrieveAllUsers((err, existingUsers) => {
      if (err) {
        return cb(err);
      }

      this._userApi.get((err, response) => {
          if (err) {
            return cb(err);
          }

          const newUser = new User(response.name, response.phone);

          this.store(newUser, (err, result) => {
            if (err) {
              return cb(err);
            }
  
            cb(null, { newUser, existingUsers} );
        });
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
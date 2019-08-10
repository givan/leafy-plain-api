const chai = require('chai');
chai.use(require('chai-like'));
chai.use(require('chai-things'));

const expect = chai.expect;

const uuidv4 = require('uuid/v4');

const User = require('../../models/User');
const UserCache = require('../../services/UserCache');

const Redis = require("ioredis");

describe('UserCache class', () => {

  const userCache = UserCache.createInstance();
  const redis = new Redis("redis://:u2M78NRUEyWkQYTa63ASnQXHFzRMsdKP5MLda2VsEZ4=@leafly.redis.cache.windows.net")

  it('add a new user', (done) => {

    const newUserName = `name-${uuidv4()}`;
    const newUser = new User(newUserName, '123-333-4444');

    userCache.store(newUser, (err, res) => {
      expect(err).to.be.null;
      expect(res).to.be.an.instanceOf(User);
      expect(res.name).to.be.equal(newUserName);
      done();
    });
  });

  it('will retrieve all existing users', (done => {

    const newUserName = `name-${uuidv4()}`;
    const newUser = new User(newUserName, '123-333-4444');

    userCache.store(newUser, (err, res) => {
      expect(err).to.be.null;
      expect(res).to.be.an.instanceOf(User);
      expect(res.name).to.be.equal(newUserName);

      userCache.getAll((err, users) => {
        expect(err).to.be.null;
        expect(users).to.be.an('array').that.contains.something.like(newUser);
        done();
      });
    });

  }));

});
const chai = require('chai');
chai.use(require('chai-like'));
chai.use(require('chai-things'));

const expect = chai.expect;

const uuidv4 = require('uuid/v4');

const UserApiResponse = require('../../services/UserApiResponse');
const UserApiClient = require('../../services/UserApiClient');

const Redis = require("request");

describe('UserApiClient class', () => {
  it('call the User API and return a new UserApiResponse object', (done) => {

    const userApi = UserApiClient.createInstance();
    userApi.get((err, result) => {
      expect(err).to.be.null;
      expect(result).to.be.instanceOf(UserApiResponse);
      expect(result).to.have.property('name');
      expect(result).to.have.property('phone');
      done();
    });
  });
});
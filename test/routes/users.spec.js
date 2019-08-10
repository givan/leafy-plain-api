const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const expect = chai.expect;

const app = require('../../app');

describe('GET /users/generate', () => {
  it('responds with json', (done) => {
    chai.request(app)
      .get('/api/v1/users/generate')
      .end((err, res) => {
        try {
          expect(res).to.have.status(200);
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('current').and.to.be.an('array');
          expect(res.body).to.have.property('previous').and.to.be.an('array');
          done();
        }
        catch (err) {
          done(err);
        }
      });
  });
  it('generates two new users', (done) => {
    chai.request(app)
      .get('/api/v1/users/generate?count=2')
      .end((err, res) => {
        try {
          expect(res).to.have.status(200);
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('current').and.to.be.an('array').with.length(2);
          expect(res.body).to.have.property('previous').and.to.be.an('array');
          done();
        }
        catch (err) {
          done(err);
        }
      });
  });
});

describe('GET /users', () => {
  it('responds with json', (done) => {
    chai.request(app)
      .get('/api/v1/users')
      .end((err, res) => {
        try {
          expect(res).to.have.status(200);
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
          expect(res.body).to.be.an('array');
          done();
        }
        catch (err) {
          done(err);
        }
      });
  });
});

describe('POST /users', () => {
  it('responds with json', (done) => {
    const newUserName = `name-${Date.now()}`;
    const newUserPhone = '123-444-2222';
    chai.request(app)
      .post('/api/v1/users')
      .send(
        {
          name: newUserName,
          phone: newUserPhone
        }
      )
      .end((err, res) => {
        try {
          expect(res).to.have.status(200);
          expect(res).to.have.header('content-type', 'application/json; charset=utf-8');
          expect(res.body)
            .to.be.an('object')
            .with.property('name').equal(newUserName);
          done();
        }
        catch (err) {
          done(err);
        }
      });
  });
});
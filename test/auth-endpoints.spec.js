const knex = require('knex');
require('dotenv').config();
const app = require('../src/app');
const jwt = require('jsonwebtoken');
const helpers = require('./test-helpers');

describe('Auth Endpoints', () => {
  let db;

  const testUsers = helpers.makeUsersArray();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe('POST /api/auth/login', () => {
    beforeEach('insert users', () =>
      helpers.seedUsers(
        db,
        testUsers
      )
    );

    const requiredFields = ['username', 'password'];

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        username: testUser.username,
        password: testUser.password,
      };


      it('responds with 400 required error when field is missing', () => {
        delete loginAttemptBody[field];

        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttemptBody)
          .expect(400, { error: `Missing '${field}' in request body` });
      });
    });
    it('responds 400 invalid username or password when invalid username', () => {
      const userInvalidUser = { username: 'invalid', password: 'exists' };

      return supertest(app)
        .post('/api/auth/login')
        .send(userInvalidUser)
        .expect(400, { error: 'Incorrect username or password' });
    });
    it('responds 400 invalid username or password when invalid password', () => {
      const userInvalidPassword = { username: testUser.username, password: 'invalid' };
      return supertest(app)
        .post('/api/auth/login')
        .send(userInvalidPassword)
        .expect(400, { error: 'Incorrect username or password' });
    });
    it('responds 200 and JWT auth when valid credentials', () => {

      const validCreds = {
        username: testUser.username,
        password: testUser.password
      };

      const expectedToken = jwt.sign(
        {
          user_id: testUser.id,
          admin: testUser.admin
        },
        process.env.JWT_SECRET,
        {
          subject: testUser.username,
          algorithm: 'HS256'
        },
      );

      return supertest(app).post('/api/auth/login').send(validCreds).expect(200, {
        authToken: expectedToken,
      });
    });
  });
});
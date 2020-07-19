const knex = require('knex');
require('dotenv').config();
const app = require('../src/app');
const helpers = require('./test-helpers');
const testHelpers = require('./test-helpers');
const supertest = require('supertest');

describe('Protected Endpoints', () => {
  let db;

  //we need test fixtures here
  const {
    testUsers,
    testMessages
  } = helpers.makeMessagesFixtures();
  const testUser = testUsers[0];


  //make the DB instance
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
  //^^^^^ Clean up the DB instance

  const protectedEndpoints = [
    {
      name: 'POST /api/messages',
      path: '/api/messages',
      method: supertest(app).post,
    },
    {
      name: 'GET /api/messages/flagged',
      path: '/api/messages/flagged',
      method: supertest(app).get,
    },
    {
      name: 'PATCH /api/messages/flagged',
      path: '/api/messages/flagged',
      method: supertest(app).patch,
    },
    {
      name: 'PATCH /api/messages/archive',
      path: '/api/messages/archive',
      method: supertest(app).patch,
    },
    {
      name: 'GET /api/messages/userData/1',
      path: '/api/messages/UserData/1',
      method: supertest(app).get,
    },
    {
      name: 'PATCH /api/messages/userData',
      path: '/api/messages/UserData',
      method: supertest(app).patch,
    },
    {
      name: 'DELETE /api/messages/userData',
      path: '/api/messages/UserData',
      method: supertest(app).delete,
    },
    {
      name: 'GET /api/users',
      path: '/api/users',
      method: supertest(app).get,
    },
    {
      name: 'DELETE /api/users',
      path: '/api/users',
      method: supertest(app).delete,
    },
    {
      name: 'PATCH /api/users',
      path: '/api/users',
      method: supertest(app).patch,
    },
  ];


  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it('responds 401 \'Missing bearer token\' when no bearer token', () => {
        return endpoint.method(endpoint.path)
          .expect(401, {
            error: 'Missing bearer token'
          });
      });

      it('responds 401 \'Unauthorized request\' when invalid JWT secret', () => {
        const validUser = testUsers[0];
        const invalidSecret = 'bad-secret';
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, {
            error: 'Unauthorized request'
          });
      });

      it('responds 401 \'Unauthorized request\' when invalid sub in payload', () => {
        const invalidUser = {
          username: 'user-not-existy'
        };
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, {
            error: 'Unauthorized request'
          });
      });
    });
  });
});

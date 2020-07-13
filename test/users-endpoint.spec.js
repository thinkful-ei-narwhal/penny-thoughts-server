const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');
const supertest = require('supertest');
const bcrypt = require('bcryptjs');
const { response } = require('express');
const { expect } = require('chai');

describe('Messages Endpoints', function () {
  let db;
  
  const {
    testUsers,
    testMessages
  } = helpers.makeMessagesFixtures();

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

  describe('GET /api/users', () => {
    context('Given users in the table', () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));
      it('responds with 200 and expect an object with \'full_name\' and \'email\'', () => {
        return supertest(app)
          .get('/api/users')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, {
            full_name: helpers.decrypt(testUsers[0].full_name),
            email: helpers.decrypt(testUsers[0].email)
          });
      });
    });
    context('Given there are no users in the table', () => {
      it('responds with 401 and expect an error message', () => {
        return supertest(app)
          .get('/api/users')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(401, { error: 'Unauthorized request' });
      });
    });
  });

  describe('POST /api/users', () => {
    context('If the submitted data is complete', () => {
      const testData = {
        full_name: 'test name',
        username: 'testuser',
        email: 'test@email.com',
        password: '@passWord1'
      }
      it('responds with 201 and the user\'s object', () => {
        return supertest(app)
          .post('/api/users')
          .send(testData)
          .expect(201)
          .expect((res) => {
            expect(res.body).to.have.property('id');
            expect(res.body).to.have.property('full_name');
            expect(res.body).to.have.property('username');
            expect(res.body).to.have.property('email');
            expect(res.body).to.have.property('password');
            expect(res.body).to.have.property('reported_count');
            expect(res.body).to.have.property('daily_count');
            expect(res.body).to.have.property('banned');
            expect(res.body).to.have.property('admin');
            expect(res.body).to.have.property('date_created');
          })
      })
    })
    context('If the submitted data is incomplete', () => {
      const incompleteTestData = {
        username: 'testuser',
        email: 'test@email.com',
        password: '@passWord1'
      }
      it('responds with 400 and error message of missing field', () => {
        return supertest(app)
          .post('/api/users')
          .send(incompleteTestData)
          .expect(400, { error: 'Missing \'full_name\' in request body' })
      })
    })
    context('If there is no submitted data', () => {
      it('responds with 400', () => {
        return supertest(app)
          .post('/api/users')
          .send({})
          .expect(400) // will add error message to server if NOTHING in body on server
      })
    })
  })

  describe('DELETE /api/users', () => {
    context('If there are users in the database', () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));
      it('should successfully delete user', () => {
        return supertest(app)
          .delete('/api/users')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(201, { success: true })
      })
    })
    context('If there are no users in the database', () => {
      it('should return 401 unauthorized', () => {
        return supertest(app)
          .delete('/api/users')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(401, { error: 'Unauthorized request' })
      })
    })
  })
});
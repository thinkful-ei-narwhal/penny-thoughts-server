const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

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
      it.only('responds with 401 and expect an error message', () => {
        return supertest(app)
          .get('/api/users')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(401, { error: 'Unauthorized request' });
      });
    });
  });

  describe('POST /api/users')

});
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

  describe('GET /api/messages', () => {
    context('Given no habits', () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/api/messages')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, []);
      });
    });
    context('Given there are messages in the database', () => {
      beforeEach('insert messages', () =>
        helpers.seedMessagesTables(
          db,
          testUsers,
          testMessages
        )
      );
      it('responds with 200 and 10 messages', () => {

        return supertest(app)
          .get('/api/messages')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .expect(res => {
            expect(res.body).to.be.a('array');
            expect(res.body).to.have.length(10);
            res.body.forEach((item) => {
              expect(item).to.be.a('object');
              expect(item).to.include.keys('id', 'message', 'user_id', 'archived', 'date_created', 'date_modified', 'flagged');
            });
          });
      });
    });
  });

});
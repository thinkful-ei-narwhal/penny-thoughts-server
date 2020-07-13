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
    context('Given no messages', () => {
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
  //GET /api/messages

  describe('/api/messages/single/:id', () => {
    context('Given no habits', () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/api/messages/single/1')
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
      it('responds with 200 and 1 message', () => {
        return supertest(app)
          .get('/api/messages/single/1')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200)
          .expect(res => {
            expect(res.body).to.be.a('array');
            expect(res.body).to.have.length(1);
            res.body.forEach((item) => {
              expect(item).to.be.a('object');
              expect(item).to.include.keys('id', 'message', 'user_id', 'archived', 'date_created', 'date_modified', 'flagged');
            });
          });
      });
    });
  });
  //GET /api/messages/single/:id

  describe('/api/messages/flagged', () => {
    context('Given no messages', () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/api/messages/flagged')
          .set('Authorization', helpers.makeAuthHeader(testUsers[2]))
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
      it('responds with 200 and 2 flagged message', () => {
        const expectedMessages = testMessages.map(messages =>
          helpers.makeExpectedMessages(messages)
        );
        const filterMessages = expectedMessages.filter(message => (message.flagged === true) && (message.archived=== false));

        return supertest(app)
          .get('/api/messages/flagged')
          .set('Authorization', helpers.makeAuthHeader(testUsers[2]))
          .expect(200, filterMessages);
      });
    });
  });
  //GET /api/messages/flagged

  describe('/api/messages/userData', () => {
    context('Given no messages', () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/api/messages/userData')
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
      it('responds with 200 and all user message', () => {
        const expectedMessages = testMessages.map(messages =>
          helpers.makeExpectedMessages(messages)
        );
        const filterMessages = expectedMessages.filter(message => message.user_id === 1);

        return supertest(app)
          .get('/api/messages/userData')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, filterMessages);
      });
    });
  });
  //GET /api/messages/userData
  describe('POST /api/messages', () => {
    this.timeout(15000);
    beforeEach(() => helpers.seedUsers(db, testUsers));

    it('responds with 200 and post message', () => {
      const message = {
        message:'test'
      };

      const expectedMessages = helpers.makeExpectedMessages(message);
      expectedMessages.id = 1;
      expectedMessages.user_id = 1;
      expectedMessages.archived = false;
      expectedMessages.flagged = false;
      expectedMessages.date_modified = null;

      return supertest(app)
        .post('/api/messages')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(message)
        .expect(201)
        .expect(res => {
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id', 'message', 'user_id', 'archived', 'date_created', 'date_modified', 'flagged');
          expect(res.body.id).to.equal(expectedMessages.id);
          expect(res.body.user_id).to.equal(expectedMessages.user_id);
          expect(res.body.message).to.equal(expectedMessages.message);
          expect(res.body.archived).to.be.false;
          expect(res.body.flagged).to.be.false;
          expect(res.body.date_modified).to.be.null;
        });
    }).timeout(15000);
    it('responds with 400 and error message', () => {
      return supertest(app)
        .post('/api/messages')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .expect(400, '{"error":"message must exist"}');
    });
  });
  //POST /api/messages

  describe('DELETE /api/messages/userData', () => {
    context('Given there are messages in the database', () => {
      beforeEach('insert messages', () =>
        helpers.seedMessagesTables(
          db,
          testUsers,
          testMessages
        )
      );
      it('responds with 204', () => {
        const message = {
          id:1
        };

        return supertest(app)
          .delete('/api/messages/userData')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(message)
          .expect(204);
      });
    });
  });
  // end of DELETE /api/habits/id


  describe('PATCH /api/messages/flagged', () => {
    context('Given there are messages in the database', () => {
      beforeEach('insert messages', () =>
        helpers.seedMessagesTables(
          db,
          testUsers,
          testMessages
        )
      );
      it('responds with 201 and patch message', () => {
        const message = {
          id:8
        };

        return supertest(app)
          .patch('/api/messages/flagged')
          .set('Authorization', helpers.makeAuthHeader(testUsers[2]))
          .send(message)
          .expect(204);
      });

      it.skip('responds with 400 and error message', () => {
        const message = {
          ids:1
        };

        return supertest(app)
          .patch('/api/messages/flagged')
          .set('Authorization', helpers.makeAuthHeader(testUsers[2]))
          .send(message)
          .expect(400, '{"error":"Missing id in request body"}');
      });

      it('responds with 401 and needs admin', () => {
        const message = {
          id:1
        };

        return supertest(app)
          .patch('/api/messages/flagged')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(message)
          .expect(401, 'You must have admin priviledges to access that data.');
      });

    });
  });
  // end of PATCH /api/messages/flagged

  describe('PATCH /api/messages/archive', () => {
    context('Given there are messages in the database', () => {
      beforeEach('insert messages', () =>
        helpers.seedMessagesTables(
          db,
          testUsers,
          testMessages
        )
      );
      it('responds with 201 and patch message', () => {
        const message = {
          id:9
        };

        return supertest(app)
          .patch('/api/messages/archive')
          .set('Authorization', helpers.makeAuthHeader(testUsers[2]))
          .send(message)
          .expect(204);
      });

      it('responds with 401 and needs admin', () => {
        const message = {
          id:1
        };

        return supertest(app)
          .patch('/api/messages/archive')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(message)
          .expect(401,'You must have admin priviledges to access that data');
      });

      it.skip('responds with 400 and error message', () => {
        const message = {
          ids:1
        };

        return supertest(app)
          .patch('/api/messages/flagged')
          .set('Authorization', helpers.makeAuthHeader(testUsers[2]))
          .send(message)
          .expect(400, '{"error":"Missing id in request body"}');
      });

    });
  });
  // end of PATCH /api/messages/flagged


  describe('PATCH /api/messages/userData', () => {
    context('Given there are messages in the database', () => {
      beforeEach('insert messages', () =>
        helpers.seedMessagesTables(
          db,
          testUsers,
          testMessages
        )
      );
      it('responds with 204', () => {
        const message = {
          id:1,
          message:'hello world'
        };

        return supertest(app)
          .patch('/api/messages/userData')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(message)
          .expect(204);
      });
      it('responds with 204 and a error message', () => {
        const message = {
          id:1,
        };

        return supertest(app)
          .patch('/api/messages/userData')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(message)
          .expect(400,'message must exist');
      });
    });
  });
  //PATCH /api/messages/userData


  describe('PATCH /api/messages/report', () => {
    context('Given there are messages in the database', () => {
      beforeEach('insert messages', () =>
        helpers.seedMessagesTables(
          db,
          testUsers,
          testMessages
        )
      );
      it('responds with 204', () => {
        const message = {
          id:1,
        };

        return supertest(app)
          .patch('/api/messages/report')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(message)
          .expect(204);
      });
      it('responds with 204 and a error message', () => {
        const message = {
        };

        return supertest(app)
          .patch('/api/messages/report')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(message)
          .expect(400,'{"error":{"message":"Missing \'id\' in request body"}}');
      });
    });
  });
  //PATCH /api/messages/userData

});



// GET /api/messages *********
//GET /api//messages/single/:id   *********
//GET /api/messages/flagged   ******
//GET /api/messages/userData   ******

//POST /api/messages     ******

//DELETE /api/habits/id  ******

//PATCH /api/messages/flagged ***** someone needs to fix error message
//PATCH /api/messages/archive ***** someone needs to fix error message
//PATCH /api/messages/userData ****
//PATCH /api/messages/report ****
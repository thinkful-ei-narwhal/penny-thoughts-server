/* as with all other files, you'll have to change some of the
default names */

// require('dotenv').config();
// const app = require('../src/app');
// const knex = require('knex');
// const testFixture = require('./testfixture');

// describe('All Endpoints for ____', () => {
//   let testDB;
//   let testObjectSeed = testFixture.getFixture();
//   const authTokenTest = 'Bearer my-secret';

//   before(() => {
//     testDB = knex({
//       client: 'pg',
//       connection: process.env.DB_TEST_URL
//     });
//   });
//   before(() => app.set('db', testDB));
//   before(() => testDB('table_name').truncate());
//   after(() => testDB('table_name').truncate());
//   after(() => testDB.destroy());


//   context('Database has data', () => {
//     beforeEach(() => testDB('table_name').insert(testObjectSeed));
//     afterEach(() => testDB('table_name').truncate());
//     describe('GET all ____', () => {
//       it('Gets the _____', () => {
//         return supertest(app)
//           .get('/api')
//           .set('Authorization', authTokenTest)
//           .expect(200)
//           .then(res => {
//             expect(res.body).to.eql(testObjectSeed);
//           });
//       });
//     });

//     context('Database is empty', () => {
//       beforeEach(() => testDB('table_name').truncate());

//       it('Gets the ______', () => {
//         return supertest(app)
//           .get('/api')
//           .set('Authorization', authTokenTest)
//           .expect(200)
//           .then(res => {
//             expect(res.body).to.eql([]);
//           });
//       });
//     });
//   });
// });
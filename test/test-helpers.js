const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const date = new Date()

// Nodejs encryption with CTR
const CryptoJS = require('crypto-js');
const AES = require('crypto-js/aes');
const config = require('../src/config')

function makeUsersArray() {
  return [{
      id: 1,
      username: 'test-user-1',
      full_name: 'U2FsdGVkX1/pV2JzgLP4FWtA4U95wGFLIsKoAV6zPRw=',
      email:'U2FsdGVkX19l+PV0/GohQDBywwAmHUp/E312Uthm7yO7bAZGVxULzS/RawiYhCi0',
      password: '@password1',
      reported_count:0,
      daily_count:0,
      banned:false,
      admin:false,
      date_created: date.toISOString(),
      date_modified:null
    },
    {
      id: 2,
      username: 'test-user-2',
      full_name: 'U2FsdGVkX1+X/rQhp2UtKck8A2YqXRJ13GyCAYnbOc0=',
      email:'U2FsdGVkX1+3/igKdY2Ep9wjy2FuLmJ3eCWteLxLipA=',
      password: '@password1',
      reported_count:0,
      daily_count:0,
      banned:false,
      admin:false,
      date_created: date.toISOString(),
      date_modified:null
    },
    {
      id: 3,
      username: 'test-user-3',
      full_name: 'U2FsdGVkX1/J4Ma7suqs+bXne/qsE9sZ6cbr6LNQgAw=',
      email:'U2FsdGVkX18EJmWtTWTw6cSA5CWCEI4cep2q5Evu9CHCQK5A62RSWDDUz1iM2Xw2',
      password: '@password1',
      reported_count:0,
      daily_count:0,
      banned:false,
      admin:true,
      date_created: date.toISOString(),
      date_modified:null
    },
    {
      id: 4,
      username: 'test-user-4',
      full_name: 'U2FsdGVkX18/UMPf0wy2VjP3ZRPrvvH0xz1zPc/hNBM=',
      email:'U2FsdGVkX1+RTnd8ulu0duVCG/sb78ipMxeSCI6X/nY=',
      password: '@password1',
      reported_count:0,
      daily_count:0,
      banned:false,
      admin:false,
      date_created: date.toISOString(),
      date_modified:null
    },
  ]
}

function makeMessagesArray(users) {
  return [{
    id: 1,
    message: 'Smile!',
    archived: false,
    flagged: false,
    user_id: users[0].id,
    date_created: date.toISOString(),
    date_modified: null
  },
  {
    id: 2,
    message: 'You can do it!',
    archived: false,
    flagged: false,
    user_id: users[1].id,
    date_created: date.toISOString(),
    date_modified: null
  },
  {
    id: 3,
    message: 'You are loved!',
    archived: false,
    flagged: false,
    user_id: users[2].id,
    date_created: date.toISOString(),
    date_modified: null
  },
  {
    id: 4,
    message: 'Dream It, Wish it, Do it!',
    archived: false,
    flagged: false,
    user_id: users[3].id,
    date_created: date.toISOString(),
    date_modified: null
  },
  {
    id: 5,
    message: 'Smile!',
    archived: false,
    flagged: false,
    user_id: users[0].id,
    date_created: date.toISOString(),
    date_modified: null
  },
  {
    id: 6,
    message: 'Dream Bigger, Do Bigger!',
    archived: false,
    flagged: false,
    user_id: users[1].id,
    date_created: date.toISOString(),
    date_modified: null
  },
  {
    id: 7,
    message: 'You are worth it!',
    archived: false,
    flagged: false,
    user_id: users[2].id,
    date_created: date.toISOString(),
    date_modified: null
  },
  {
    id: 8,
    message: 'Good morning from Malta!',
    archived: false,
    flagged: false,
    user_id: users[3].id,
    date_created: date.toISOString(),
    date_modified: null
  },
  {
    id: 9,
    message: 'Hitler did 9/11',
    archived: false,
    flagged: true,
    user_id: users[0].id,
    date_created: date.toISOString(),
    date_modified: null
  },
  {
    id: 10,
    message: 'Hitler did 711',
    archived: true,
    flagged: true,
    user_id: users[1].id,
    date_created: date.toISOString(),
    date_modified: null
  },
  {
    id: 11,
    message: 'We are all in this together!',
    archived: false,
    flagged: false,
    user_id: users[2].id,
    date_created: date.toISOString(),
    date_modified: null
  },
  {
    id: 12,
    message: 'Stay positive!',
    archived: false,
    flagged: false,
    user_id: users[3].id,
    date_created: date.toISOString(),
    date_modified: null
  },
  ];
}

function makeExpectedMessages(message) {
  return {
    id: message.id,
    message: message.message,
    archived: message.archived,
    flagged: message.flagged,
    user_id: message.user_id,
    date_created: message.date_created,
    date_modified: message.date_modified
  }
}

function makeMessagesFixtures() {
  const testUsers = makeUsersArray()
  const testMessages = makeMessagesArray(testUsers)
  return {
    testUsers,
    testMessages
  }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
      users,
      messages
    `
    )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE messages_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('users_id_seq', 0)`),
          trx.raw(`SELECT setval('messages_id_seq', 0)`),
        ])
      )
  )
}

function seedUsers(db, users) {
  const hashedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db.into('users').insert(hashedUsers)
    .then(() =>
      db.raw(
        `SELECT setval('users_id_seq', ?)`,
        users[users.length - 1].id
      )
    );
};


function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({
    user_id: user.id
  }, secret, {
    subject: user.username,
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
};

function seedMessagesTables(db, users, messages = []) {
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('messages').insert(messages)
    await trx.raw(
      `SELECT setval('messages_id_seq', ?)`,
      [messages[messages.length - 1].id],
    )
  })
}

function encrypt(text) {
  return CryptoJS.AES.encrypt(text, config.ENCRYPTION_KEY).toString();
}

function decrypt(encrypted) {
  const bytes = CryptoJS.AES.decrypt(encrypted, config.ENCRYPTION_KEY)
  return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = {
  makeAuthHeader,
  makeUsersArray,
  makeMessagesArray,
  makeExpectedMessages,
  makeMessagesFixtures,
  cleanTables,
  seedUsers,
  seedMessagesTables,
  encrypt,
  decrypt
}
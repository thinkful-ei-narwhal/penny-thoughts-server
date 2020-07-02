const xss = require('xss');

const MessagesService = {
  getTenRandom(db) {
    return db
      .from('messages')
      .select('*')
      .orderByRaw('random()')
      .where('flagged', 'false')
      .limit(10);
  },

  getOneRandom(db) {
    return db
      .from('messages')
      .select('*')
      .orderByRaw('random()')
      .where('flagged', 'false')
      .limit(1);
  },

  postMessage(db, message) {
    console.log(message);
    return db.insert(message).into('messages').returning('*').then(rows => rows[0]);
  },

  serialize(message) {
    return {
      id: message.id,
      message: xss(message.message),
      archived: message.archived,
      flagged: message.flagged,
      user_id: message.user_id,
      date_created: xss(message.date_created),
      date_modified: xss(message.date_modified),
    };
  }
};

module.exports = MessagesService;
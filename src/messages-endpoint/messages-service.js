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

  getOneRandom(db, id) {
    return db
      .from('messages')
      .select('*')
      .orderByRaw('random()')
      .whereNot({ id })
      .where('flagged', 'false')
      .limit(1);
  },


  postMessage(db, message) {
    console.log(message);
    return db.insert(message).into('messages').returning('*').then(rows => rows[0]);
  },

  getUsersMessages(db, user) {
    return db
      .from('messages')
      .where('user_id', user);
  },

  deleteSingleMessage(db, user, id) {
    return db('messages')
      .where('user_id', user)
      .andWhere('id', id)
      .del();
  },

  editSingleMessage(db, user, body) {
    // console.log(body)
    return db('messages')
      .where('user_id', user)
      .andWhere('id', body.id)
      .update({
        message: body.message,
        date_modified: body.modified
      })
      .returning('*')
      .then(rows => rows[0]);
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
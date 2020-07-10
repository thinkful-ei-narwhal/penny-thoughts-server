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
    return db.insert(message).into('messages').returning('*').then(rows => rows[0]);
  },

  getUsersMessages(db, user, page) {
    const productsPerPage = 10;
    const offset = productsPerPage * (page - 1);
    return db('messages')
      .select('*')
      .where('user_id', user)
      .limit(productsPerPage)
      .offset(offset);
  },

  getUsersMessagePageCount(db, user) {
    return db('messages')
      .count('*')
      .where('user_id', user);
  },

  getFlaggedMessages(db) {
    return db('messages')
      .select('*')
      .where({
        flagged: true,
        archived: false
      });
  },

  deleteSingleMessage(db, user, id) {
    return db('messages')
      .where('user_id', user)
      .andWhere('id', id)
      .del();
  },

  editSingleMessage(db, user, body) {
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

  flagMessage(db, id) {
    return db('messages')
      .where('id', id)
      .update({ flagged: true });
  },

  unflagMessage(db, id) {
    return db('messages')
      .where('id', id)
      .update({ flagged: false });
  },

  archiveMessage(db, id) {
    return db('messages')
      .where('id', id)
      .update({ archived: true });
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
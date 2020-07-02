const bcrypt = require('bcryptjs');
const xss = require('xss');
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/;

const UsersService = {
  hasUsername(db, username) {
    return db('users')
      .where({ username })
      .first()
      .then(user => !!user);
  },

  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(([user]) => user);
  },

  validatePassword(password) {
    if (password.length < 7) {
      return 'Password is too short';
    }
    if (password.length > 26) {
      return 'Password is too long';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password cannot start or end with empty spaces';
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain an uppercase, lowercase, number and a special char';
    }
    return null;
  },

  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },

  serializeUser(user) {
    return {
      id: xss(user.id),
      full_name: xss(user.full_name),
      username: xss(user.username),
      email: xss(user.email),
      password: xss(user.password),
      reported_count: xss(user.reported_count),
      daily_count: xss(user.daily_count),
      banned: xss(user.banned),
      admin: xss(user.admin),
      date_created: xss(user.date_created)
    };
  },


  // move to messages endpoint
  getUsersMessages(db, user) {
    return db
      .from('messages')
      .where('id', user.id)
      .returning('*')
      .then(([data]) => data);
  },

  deleteUser(db, req) {
    console.log('user ID:', req.user);
    return db.transaction(trx =>
      Promise.all([
        db('users')
          .transacting(trx)
          .where('id', req.user.id)
          .del(),
        db('messages')
          .transacting(trx)
          .where('user_id', req.user.id)
          .del()
      ]));
  },

  banHammer(db, user, banned_id) {
    if (user.admin !== true) {
      return db('users')
        .where('id', user.id)
        .update({ banned: true });
    }
    return db('users')
      .where('id', banned_id)
      .update({ banned: true });
  }
};

module.exports = UsersService;
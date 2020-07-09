const bcrypt = require('bcryptjs');
const xss = require('xss');
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[*.!@$%^&(){}[\]:;<>,\.\?\~_+-=|])[\S]+/;

// Nodejs encryption with CTR
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);


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

  // STILL WORKING ON
  getUserData(db, id) {
    return db('users')
      .select('full_name', 'email')
      .where({ id })
      .first()
  },

  validatePassword(password) {
    if (password.length < 7) {
      return `Password is too short.  Must be longer than 6 characters.
      Password cannot start or end with empty spaces.
      Password must contain an uppercase, lowercase, number and a special char.` ;
    }
    if (password.length > 26) {
      return `Password is too long.  Password must be less than 26 characters.
      Password cannot start or end with empty spaces.
      Password must contain an uppercase, lowercase, number and a special char.`;
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return `Password cannot start or end with empty spaces.
      Password must contain an uppercase, lowercase, number and a special char`;
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain an uppercase, lowercase, number and a special char';
    }
    return null;
  },

  hashPassword(data) {
    return bcrypt.hash(data, 12);
  },


  encrypt(text) {
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
  },

  decrypt(text) {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
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
  
  deleteUser(db, req) {
    // console.log('user ID:', req.user);
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
  },

  editUserInfo(db, user, newData) {
    
    return db('users')
      .where('id', user)
      .update({
        email: newData.userEmail,
        full_name: newData.userFull_Name
      })
      .returning('*')
      .then(rows => rows[0]);
  },
};

module.exports = UsersService;
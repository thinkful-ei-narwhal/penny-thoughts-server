const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* Make functions for EVERY kind of table you have
in your database.  They will go here and return an 
array of objects.*/


/* Next, make functions that return objects of 
expected items you might make.  This will likely match
the services you have.  One or more should be malicious*/


/* Next, make a Fixtures function that creates a fixture of the
collection of the arrays as single entities.*/


/* Next, Make a clean table that truncates all the tables in your 
test db and RESTART IDENTIY CASCADE at the end*/ 


/* Finally, make tables that seed your database.  You will have
a seedUsers function already made for you below, as well as the 
AuthHeader function*/


function seedUsers(db, users) {
  const hashedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }));
  return db.into('thingful_users').insert(hashedUsers)
    .then(() => {

    });
};


function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({}, secret, {
    subject: user.user_name,
    algorithm: 'HS256',
  });
  return `Bearer ${token}`;
};

module.exports = {
  seedUsers,
  makeAuthHeader
}
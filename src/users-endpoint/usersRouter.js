const express = require('express');
const path = require('path');
const UsersService = require('./usersService');
const { requireAuth } = require('../middleware/jwt-auth');
const { response } = require('../app');
const { userInfo } = require('os');

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
  .route('/')
  .get(requireAuth, (req, res, next) => {
    if (!req.user) res.status(401).json({ error: 'You must be signed in to get that data!' })
    UsersService.getUserData(req.app.get('db'), req.user.id)
      .then(response => {
        let userFullName = JSON.parse(response.full_name)
        let userEmail = JSON.parse(response.email)

        res.json({
          full_name: UsersService.decrypt(userFullName),
          email: UsersService.decrypt(userEmail)
        })
      })
      .catch(next)
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { full_name, username, email, password } = req.body;

    for (const field of ['full_name', 'username', 'email', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });

    // leave here until we tackle admin user stories
    let admin = false;

    const passwordError = UsersService.validatePassword(password);
    if (passwordError)
      return res.status(400).json({ error: passwordError });

    UsersService.hasUsername(
      req.app.get('db'),
      username
    )
      .then(hasUsername => {
        if (hasUsername) {
          return res.status(400).json({ error: 'Username already taken' });
        }

        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            let userFull_Name = UsersService.encrypt(full_name)
            let userEmail = UsersService.encrypt(email)

            console.log('name', userFull_Name)
            console.log('email', userEmail)

            const newUser = {
              username,
              password: hashedPassword,
              full_name: userFull_Name,
              email: userEmail,
              admin
            };

            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(UsersService.serializeUser(user));
              });
          });
      })
      .catch(next);
  })
  .delete(requireAuth, (req, res, next) => {
    // console.log('requireAuth:', requireAuth());
    // console.log('req.user.id:', req.user.id);
    UsersService.deleteUser(
      req.app.get('db'),
      req
    )
      .then(() => {
        res.status(201).json({ success: true });
      })
      .catch(next);
  })
  .patch(requireAuth, jsonBodyParser, (req, res, next) => {
    const { 
      full_name,
      email
    } = req.body;

    let userFull_Name = UsersService.encrypt(full_name)
    let userEmail = UsersService.encrypt(email)

    const newData = {
      userFull_Name,
      userEmail
    }

    const numberOfValues = Object.values(newData).filter(Boolean).length;
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'email' or 'name'`
        }
      });

    UsersService.editUserInfo(
      req.app.get('db'),
      req.user.id,
      req.body, 
      newData
    )
      .then((data) => {
        console.log('data returned from DB',data)
        res.status(201).json(UsersService.serializeUser(data))
      })
      // If we update username, this happens:
      //user info is updated so TOKEN is outdated
      //we need to destroy the token and update the new token
      //once the token is updated, 
      .catch(next);
  });

module.exports = usersRouter;




// full_name
// {"iv":"631e5745bf86969ae92250ec45005d19","encryptedData":"60b85c5fe4654fe7f3792cef3d3c1e61"}

// email
// {"iv":"631e5745bf86969ae92250ec45005d19","encryptedData":"12de6b96c616234c44b1597de10ccea2"}
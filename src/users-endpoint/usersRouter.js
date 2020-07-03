const express = require('express');
const path = require('path');
const UsersService = require('./usersService');
const { requireAuth } = require('../middleware/jwt-auth');

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
  .route('/')
  .post(jsonBodyParser, (req, res, next) => {
    const { full_name, username, email, password } = req.body;

    for (const field of ['full_name', 'username', 'email', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });

    //leave here until we tackle admin user stories
    const admin = false;

    const passwordError = UsersService.validatePassword(password);
    if (passwordError)
      return res.status(400).json({ error: passwordError });

    UsersService.hasUsername(
      req.app.get('db'),
      username
    )
      .then(hasUsername => {
        if (hasUsername)
          return res.status(400).json({ error: 'Username already taken' });

        return UsersService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              username,
              password: hashedPassword,
              full_name,
              email,
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
  });

module.exports = usersRouter;






const express = require('express');
const path = require('path');
const UsersService = require('./usersService');
const { requireAuth } = require('../middleware/jwt-auth');

const usersRouter = express.Router();
const jsonBodyParser = express.json();

usersRouter
  .route('/')
  // This should be in messages endpoint ******
  // .get(requireAuth, jsonBodyParser, (req, res, next) => {

  //   UsersService.getUsersMessages(
  //     req.app.get('db'),
  //     req.user.id
  //   )
  //     .then(userMessages => {
  //       res.json(userMessages);
  //     })
  //     .catch(next);
  // })
  .post(jsonBodyParser, (req, res, next) => {
    const { full_name, username, email, password } = req.body;

    for (const field of ['full_name', 'username', 'email', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        });

    // for (const field of ['reported_count', 'daily_count', 'banned', 'admin'])
    //   if (req.body[field])
    //   return // compare the filed values against the database values

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
          return res.status(400).json({ error: 'Username already taken'});

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
  .delete((req, res, next) => {
    if (req.user.id !== user.id) { // FIXME
      return res.status(401).json({
        error: 'You are not the user...BANHAMMER!'
      });
    }

    UsersService.deleteUser(
      req.app.get('db'),
      req.params.user
    )
      .then(() => {
        res.status(201).json({success: true});
      })
      .catch(next);
  });

module.exports = usersRouter;





const express = require('express');
const logger = require('../logger');
const MessagesRouter = express.Router();
const dataParser = express.json();
const {requireAuth} = require('../middleware/jwt-auth');
const MessagesService = require('./messages-service');

MessagesRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    MessagesService.getTenRandom(req.app.get('db'))
      .then(messages => res.json(messages.map(message => MessagesService.serialize(message))));
  });

MessagesRouter
  .route('/single')
  .all(requireAuth)
  .get((req, res, next) => {
    MessagesService.getOneRandom(req.app.get('db'))
      .then(messages => res.json(messages.map(message => MessagesService.serialize(message))));
  });

module.exports = MessagesRouter;
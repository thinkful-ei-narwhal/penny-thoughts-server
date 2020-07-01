const express = require('express');
const logger = require('../logger');
const MessagesRouter = express.Router();
const dataParser = express.json();
const MessagesService = require('./messages-service');

MessagesRouter
  .route('/')
  .get((req, res, next) => {
    MessagesService.getTenRandom(req.app.get('db'))
      .then(messages => res.json(messages.map(message => MessagesService.serialize(message))));
  });

MessagesRouter
  .route('/single')
  .get((req, res, next) => {
    MessagesService.getOneRandom(req.app.get('db'))
      .then(messages => res.json(messages.map(message => MessagesService.serialize(message))));
  });

module.exports = MessagesRouter;
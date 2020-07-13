const express = require('express');
const logger = require('../logger');
const MessagesRouter = express.Router();
const toxicity = require('@tensorflow-models/toxicity');
const dataParser = express.json();
const { requireAuth } = require('../middleware/jwt-auth');
const MessagesService = require('./messages-service');
//import usersService to handle message API calls for a specific USER: 
const UsersService = require('../users-endpoint/usersService');
const { ConsoleTransportOptions } = require('winston/lib/winston/transports');

MessagesRouter
  .route('/')
  //get and post for ALL messages in database
  .get((req, res, next) => {
    MessagesService.getTenRandom(req.app.get('db'))
      .then(messages => res.json(messages.map(message => MessagesService.serialize(message))))
      .catch(next);
  })
  .post([express.json(), requireAuth], (req, res, next) => {
    const { message } = req.body;
    const threshold = 0.99;

    if (!message) {
      return res.status(400).json({ error: 'message must exist' });
    }

    if (message && message.length > 1) {

      toxicity.load(threshold).then(model => {
        model.classify(message).then(predictions => {
          let tox = false;
          let i = 0;

          while (!tox && i < predictions.length - 1) {
            if ([null, true].includes(predictions[i].results[0].match)) {
              tox = true;
              return res.status(400).json('Your message was rejected by the system! Please find something nicer to say!');
            }
            i++;
          }
          MessagesService.postMessage(req.app.get('db'), { message: message, archived: false, flagged: false, user_id: req.user.id })
            .then(message => res.status(201).json(MessagesService.serialize(message)));
        });
      })
        .catch(next);
    }
  });

MessagesRouter
  .route('/single/:id')
  .get((req, res, next) => {
    MessagesService.getOneRandom(req.app.get('db'), req.params.id)
      .then(messages => res.json(messages.map(message => MessagesService.serialize(message))))
      .catch(next);
  });

MessagesRouter
  .route('/flagged')
  .get(requireAuth, (req, res, next) => {
    if (!req.user.admin) return res.status(401).json('You must have admin priviledges to access that data.')
    MessagesService.getFlaggedMessages(req.app.get('db'))
      .then(messages => res.json(messages.map(message => MessagesService.serialize(message))))
      .catch(next)
  })
  .patch(requireAuth, dataParser, (req, res, next) => {
    if (!req.user.admin) return res.status(401).json('You must have admin priviledges to access that data.')
    for (const [key, value] of Object.entries(req.body))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });

    MessagesService.unflagMessage(req.app.get('db'), req.body.id)
      .then(message => res.status(204).send())
      .catch(next);
  })

MessagesRouter
  .route('/archive')
  .patch(requireAuth, dataParser, (req, res, next) => {
    if (!req.user.admin) return res.status(401).json('You must have admin priviledges to access that data.')
    for (const [key, value] of Object.entries(req.body))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });

    MessagesService.archiveMessage(req.app.get('db'), req.body.id)
      .then(message => res.status(204).send())
      .catch(next);
  })

// ++++++++++++++++++++++++MESSAGES BELONGING TO USER AND OPTIONS FOR SUCH++++++++++++++++++++++++++++++++++++

MessagesRouter
  //get route in ALL messages returning ONLY the messages belonging to that user
  .route('/userData')
  .get(requireAuth, dataParser, (req, res, next) => {
    MessagesService.getUsersMessages(
      req.app.get('db'),
      req.user.id
    )
      .then(messages => res.json(messages.map(message => MessagesService.serialize(message))))
      .catch(next);
  })
  .patch(requireAuth, dataParser, (req, res, next) => {

    const { id, message } = req.body;
    const threshold = 0.85;

    if (!message) {
      return res.status(400).json('message must exist');
    }

    if (message && message.length > 1) {
      toxicity.load(threshold).then(model => {
        model.classify(message).then(predictions => {
          let tox = false;
          let i = 0;

          while (!tox && i < predictions.length - 1) {
            if ([null, true].includes(predictions[i].results[0].match)) {
              tox = true;
              return res.status(400).json('Your message was rejected by the system! Please find something nicer to say!');
            }
            i++;
          }
          MessagesService.editSingleMessage(
            req.app.get('db'),
            req.user.id,
            { id: id, message: message, modified: new Date() }
          )
            .then(
              res.status(204).send()
            );
        });
      })
        .catch(next);
    }
  })
  .delete(requireAuth, dataParser, (req, res, next) => {
    MessagesService.deleteSingleMessage(
      req.app.get('db'),
      req.user.id,
      req.body.id
    )
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

MessagesRouter
  .route('/report')
  .patch(requireAuth, dataParser, (req, res, next) => {
    const {
      id
    } = req.body;

    const newMessage = {
      id
    };
    for (const [key, value] of Object.entries(newMessage))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });

    MessagesService.flagMessage(
      req.app.get('db'),
      newMessage.id
    )
      .then(newMessage => {
        res
          .status(204).send();
      })
      .catch(next);
  });

module.exports = MessagesRouter;

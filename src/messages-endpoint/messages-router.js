const express = require('express');
const logger = require('../logger');
const MessagesRouter = express.Router();
const toxicity = require('@tensorflow-models/toxicity');
const dataParser = express.json();
const {requireAuth} = require('../middleware/jwt-auth');
const MessagesService = require('./messages-service');

MessagesRouter
  .route('/')
  .get((req, res, next) => {
    MessagesService.getTenRandom(req.app.get('db'))
      .then(messages => res.json(messages.map(message => MessagesService.serialize(message))));
  })
  .post(dataParser, requireAuth, (req, res, next) => {
    const { message } = req.body;
    const threshold = 0.85;
    console.log('testing');

    if(!message){
      return res.status(400).json({error: 'message must exist'});
    }
  
    if(message && message.length > 1){

      toxicity.load(threshold).then(model => {
        model.classify(message).then(predictions => {
          console.log('made it here');
          let tox = false;
          let i = 0;
          while (!tox && i < predictions.length -1){
            if ([null, true].includes(predictions[i].results[0].match)){
              tox = true;
              return res.status(400).json('Your message was rejected by the system!  Please find something nicer to say!');
            } 
            i++;
          }
          console.log('also made it here');
          MessagesService.postMessage(req.app.get('db'), message)
            .then(message => res.status(201).json(MessagesService.serialize([message])));
        });
      });
    }});

MessagesRouter
  .route('/single')
  .get((req, res, next) => {
    MessagesService.getOneRandom(req.app.get('db'))
      .then(messages => res.json(messages.map(message => MessagesService.serialize(message))));
  });
  

module.exports = MessagesRouter;
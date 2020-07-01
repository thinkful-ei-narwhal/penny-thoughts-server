const express = require('express');
const logger = require('../logger');
const xss = require('xss');
const Router = express.Router();
const dataParser = express.json();
const Service = require('./users-service');

const serialize = item => ({
  
});

Router
  .route('/')
  .get((req, res, next) => {
    Service.getAll(req.app.get('db'))
      .then(item => res.json(item));
  });

module.exports = Router;
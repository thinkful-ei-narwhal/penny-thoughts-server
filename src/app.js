/* eslint-disable no-console */
require('dotenv').config();
/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const logger = require('./logger');
const usersRouter = require('./users-endpoint/usersRouter');
const MessagesRouter = require('./messages-endpoint/messages-router');
const authRouter = require('./auth/authRouter');
const { NODE_ENV, API_TOKEN } = require('./config');


const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

// middleware

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

//comment this function out for testing purposes

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/messages', MessagesRouter);

// errorHandler middleware

app.use(function errorHandler(error, req, res, next){
  let response;
  if (NODE_ENV === 'production') {
    response = {error: {message: 'server error'}};
  } else {
    console.error(error);
    response = {message: error.message, error};
  }
  res.status(500).json(response);
});

// exports

module.exports = app;
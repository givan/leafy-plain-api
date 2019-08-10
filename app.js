const express = require('express');
const usersRouter = require('./routes/users');
const bodyParser = require('body-parser');

const app = express();
// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use('/api/v1/users', usersRouter);

module.exports = app;

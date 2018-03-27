const express = require('express');
const env = require('dotenv').config();

if (env.error) {
  throw env.error;
}

const path = require('path');
const bodyParser = require('body-parser');
const { logger } = require('./util/logger');
const error = require('./error/error');
const sms = require('./routes/sms');

const app = express();

// set views folder for tempale engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// set public folder for Bootstrap
app.use(express.static(path.join(__dirname, 'public')));

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// api routes
app.use('/api/v1/sms', sms);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(new error.ResourceNotFoundError(req));
});

// error handler
app.use((err, req, res, next) => {
  let e = null;
  if (err && err instanceof error.BaseError) {
    logger.warn(`known error - ${err}`);
    e = err;
  } else {
    logger.warn(`unknown server error - ${err}`);
    e = new error.UnknownServerError(err.toString());
  }
  res.status(e.statusCode).json(e.toJson());
});

app.listen(3000);

module.exports = app;


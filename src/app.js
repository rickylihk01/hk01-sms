const express = require('express');
const env = require('dotenv').config();

if (env.error) {
  throw env.error;
}

const bodyParser = require('body-parser');
const error = require('./error/error');
const sms = require('./routes/sms');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/v1/sms', sms);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(new error.ResourceNotFoundError(req));
});

// error handler
app.use((err, req, res, next) => {
  let e = null;
  if (err && err instanceof error.BaseError) {
    console.log('known error - %s', err);
    e = err;
  } else {
    console.log('unknown server error - %s', err);
    e = new error.UnknownServerError(err.toString());
  }
  res.status(e.statusCode).json(e.toJson());
});

app.listen(3000);

module.exports = app;


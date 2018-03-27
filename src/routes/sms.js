const express = require('express');

const router = express.Router();
const { logger } = require('../util/logger');
const smsService = require('../services/smsService');
const error = require('../error/error');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

// remove and triming whitespace and split each row value into array
function normalize(recipients) {
  return recipients.replace(/([ \t])/g, '').trim().split('\r\n');
}

// send sms request
router.post('/', jsonParser, async (req, res, next) => {
  logger.debug('req.body');
  const { to, body } = req.body;
  const recipients = normalize(to);
  try {
    const msgs = await smsService.sendAsync({ recipients, body });
    logger.debug('Success - message is delivered');
    res.send(msgs);
  } catch (err) {
    next(new error.SmsDeliveryFailedError(err));
  }
});

// render sms page
router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;

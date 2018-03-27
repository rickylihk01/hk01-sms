const express = require('express');

const router = express.Router();
const smsService = require('../services/smsService');
const error = require('../error/error');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

// remove and triming whitespace and split each row value into array
function normalize(recipients) {
  return recipients.replace(/([ \t])/g, '').trim().split('\r\n');
}

// send sms request
router.post('/', jsonParser, async (req, res) => {
  console.log(req.body);
  const { to, body } = req.body;
  const recipients = normalize(to);
  try {
    const msgs = await smsService.sendAsync({ recipients, body });
    res.send(msgs);
  } catch (err) {
    console.error(err);
    throw new error.RequestValidationError(err);
  }
});

// render sms page
router.get('/', (req, res) => {
  res.render('index');
});

module.exports = router;

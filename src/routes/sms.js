const express = require('express');

const router = express.Router();
const smsService = require('../services/smsService');
const error = require('../error/error');
const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

router.post('/', jsonParser, async (req, res) => {
  console.log(req.body);
  const { recipients, body } = req.body;
  try {
    const msgs = await smsService.sendAsync({ recipients, body });
    res.send(msgs);
  } catch (err) {
    console.error(err);
    throw new error.RequestValidationError(err);
  }
});

module.exports = router;

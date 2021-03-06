// require the Twilio module and create a REST client
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_ACCOUNT_TOKEN);
const { logger } = require('../util/logger');

const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

function send({ to, body }) {
  return client.messages.create({ to, body, messagingServiceSid });
}

module.exports = {
  sendAsync: async ({ recipients, body }) => {
    logger.info(`send to: ${recipients}`);
    const result = await Promise.all(recipients.map(to => send({ to, body })));
    return result;
  },
};

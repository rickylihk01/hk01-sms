// require the Twilio module and create a REST client
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_ACCOUNT_TOKEN);

const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;

async function send({ to, body }) {
  return client.messages.create({ to, body, messagingServiceSid });
}

module.exports = {
  sendAsync: async ({ recipients, body }) => {
    console.log(`send to: ${recipients}`);
    const result = await Promise.all(recipients.map(to => send({ to, body })));
    return result;
  },
};

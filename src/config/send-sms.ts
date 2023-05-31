const accountSid = 'AC4a354a38c3fbe68314206dd8d4d6d66d';
const authToken = '6f84c1f90024376871112b0215d010a7';
import twilio from 'twilio';
const client = twilio(accountSid, authToken);

client.messages
  .create({
    body: 'Hello from TradVu',
    from: '+15164693948',
    to: '+2349077968091',
  })
  .then((message) => console.log(message.sid))
  .catch((err) => console.log(err));

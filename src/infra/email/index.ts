/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
import nodemailer from 'nodemailer';
import config from '../../config/config';

async function sendEmail() {
  const email = config.email as unknown as {
    SMTP_HOST: string;
    SMTP_PORT: number;
    SMTP_USERNAME: string;
    SMTP_PASSWORD: string;
  };
  const SMTP_HOST = email.SMTP_HOST;
  const SMTP_PORT = email.SMTP_PORT;
  const SMTP_USERNAME = email.SMTP_USERNAME;
  const SMTP_PASSWORD = email.SMTP_PASSWORD;

  // Create a transport object with your Google account credentials
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: true,
    auth: {
      user: SMTP_USERNAME,
      pass: SMTP_PASSWORD,
    },
  });

  // Set up the email options
  const mailOptions = {
    from: SMTP_USERNAME,
    to: 'euniceakinmarin16@gmail.com',
    subject: 'Love Email',
    text: `Hi Eunice, I love you so much.`,
  };

  // Send the email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    transporter.verify().then(console.log).catch(console.error);
  } catch (error) {
    console.error('Error sending email:', error);
  }
}

export default sendEmail;

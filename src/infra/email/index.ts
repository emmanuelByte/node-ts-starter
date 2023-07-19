/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
import nodemailer from 'nodemailer';
import config from '../../config/config';
import fs from 'fs';
import Handlebars from 'handlebars';

const email = config.email as unknown as {
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USERNAME: string;
  SMTP_PASSWORD: string;
};

// Create a transport object with your Google account credentials
const transporter = nodemailer.createTransport({
  host: email.SMTP_HOST,
  port: email.SMTP_PORT,
  secure: true,
  auth: {
    user: email.SMTP_USERNAME,
    pass: email.SMTP_PASSWORD,
  },
});
type emailTypes = {
  to: string;
  data: {
    type: 'verify' | 'reset';
    code: string;
  };
};
function getTemplateHtml(templateName: string, data: { code: string }) {
  const templatePath = `./templates/${templateName}.hbs`;
  const rawTemplate = fs.readFileSync(templatePath, 'utf8');
  const template = Handlebars.compile(rawTemplate);
  const html = template({ ...data, year: new Date().getFullYear() });
  return html;
}
async function sendEmail(emailOptions: emailTypes) {
  // Determine the template and subject based on the email type
  let templateName: string;
  let subject: string;
  if (emailOptions.data.type === 'verify') {
    templateName = 'verifyEmail';
    subject = 'Verify your email';
  } else {
    templateName = 'resetPassword';
    subject = 'Reset your password';
  }
  // Generate the email HTML
  const html = getTemplateHtml(templateName, { code: emailOptions.data.code });

  // Set up the email options
  const mailOptions = {
    from: email.SMTP_USERNAME,
    to: emailOptions.to,
    subject,
    html,
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

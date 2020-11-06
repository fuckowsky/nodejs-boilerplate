// Mail sender Helpers
const helpers = {};

// Dependencies
const nodemailer = require('nodemailer');

// Methods
helpers.sendEmail = async (clientAddress, mailSubject, mailContent) => {
  trySendMail(clientAddress, mailSubject, mailContent).catch(console.error);
};

helpers.sendEmailHtml = async (clientAddress, mailSubject, mailContent) => {
  trySendMailHtml(clientAddress, mailSubject, mailContent).catch(console.error);
};

async function trySendMail(clientAddress, mailSubject, mailContent) {
  // Reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'No Reply <' + process.env.SMTP_USER + '>', // sender address
    to: clientAddress, // list of receivers
    subject: mailSubject, // Subject line
    text: mailContent, // plain text body
  });
}

async function trySendMailHtml(clientAddress, mailSubject, mailContent) {
  // Reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVER,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  // Send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'No Reply <' + process.env.SMTP_USER + '>', // sender address
    to: clientAddress, // list of receivers
    subject: mailSubject, // Subject line
    html: mailContent, // HTML body
  });
}

module.exports = helpers;

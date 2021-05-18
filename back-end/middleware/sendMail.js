const nodemailer = require('nodemailer');
const config = require('../config');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: config.GMAIL_USERNAME,
    pass: config.GMAIL_PASSWORD,
  },
});

module.exports = (to, subject, text) => {
  const mailOptions = {
    from: 'D.E.scord <d.e.scord5499@gmail.com>',
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      return false;
    }
    return true;
  });
};

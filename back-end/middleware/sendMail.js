const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USERNAME,
        pass: process.env.GMAIL_PASSWORD
    }
});

module.exports = (to, subject, message) => {
    const mailOptions = {
        from: 'd.e.scord5499@gmail.com',
        to: to,
        subject: subject,
        text: message,
    };
    const test = transporter.sendMail(mailOptions, function (err) {
        if (err)
            return false;
        return true;
    });
    console.log(test)
};

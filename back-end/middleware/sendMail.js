const nodemailer = require('nodemailer');
const config = require("../config")

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.GMAIL_USERNAME,
        pass: config.GMAIL_PASSWORD
    }
});

module.exports = (to, subject, message) => {
    const mailOptions = {
        from: 'D.E Scord',
        to: to,
        subject: subject,
        text: message,
    };
    transporter.sendMail(mailOptions, function (err) {
        if (err)
            return false;
        return true;
    });
};

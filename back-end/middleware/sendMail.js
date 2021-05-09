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
        from: 'd.e.scord5499@gmail.com',
        to: to,
        subject: subject,
        text: message,
    };
    console.log(to, subject, message);
    const test = transporter.sendMail(mailOptions, function (err) {
        console.log(err)
        if (err)
            return false;
        return true;
    });
    console.log("envoi mail", test)
};

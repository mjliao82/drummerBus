const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.IQ_EMAIL,
        pass: process.env.IQ_PW
    }
});

const sendEmail = async(to, subject, message) => {
    try {
        const mailOptions = {
            from: process.env.IQ_EMAIL,
            to,
            subject,
            text: message
        };
        await transporter.sendMail(mailOptions);
        return {success: true, message: `Email sent to ${to}`};
    } catch (error) {
        return {success: false, error: error.message};
    }
};

module.exports = sendEmail;
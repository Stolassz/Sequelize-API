const { default: nodemailer } = require("nodemailer");
require('dotenv').config();

const EMAIL_USERNAME = (process.env.EMAIL_USERNAME || '').trim();
const EMAIL_PASSWORD = (process.env.EMAIL_PASSWORD || '').replace(/\s+/g, '');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD
    }
});

const sendVerificationEmail = async (email, verificationCode) => {
    const mailOptions = {
        from: `GT BEZERRA <${EMAIL_USERNAME}>`,
        to: email,
        subject: 'Verificação do Email - GT BEZERRA',
        html: `
            <h1>Verificação de e-mail</h1>
            <p>Seu código de verificação é: <strong>${verificationCode}</strong></p>
            <p>Este código expira em 20 minutos</p>
            <p>Se você não solicitou essa verificação, favor ignorar.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return true;
    } catch (e) {
        console.log('Erro ao enviar e-mail', e);
        return false;
    }
}

module.exports = {
    sendVerificationEmail
}
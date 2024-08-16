/* Author: Bhishman Desai */
import nodemailer from 'nodemailer';
import Mailgen from 'mailgen';
import dotenv from "dotenv";

dotenv.config();

let nodeConfig = {
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
    }
}

let transporter = nodemailer.createTransport(nodeConfig);

let MailGenerator = new Mailgen({
    theme: "default",
    product: {
        name: "Mailgen",
        link: 'https://mailgen.js/'
    }
})

/* POST: /api/registerMail */
export const registerMail = async (req, res) => {
    const { username, userEmail, text, subject } = req.body;

    /* Body of the email */
    var email = {
        body: {
            name: username.toUpperCase(),
            intro: text || 'Welcome to JobVerse! We\'re very excited to have you on board.',
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
        }
    }

    var emailBody = MailGenerator.generate(email);

    let message = {
        from: process.env.EMAIL,
        to: userEmail,
        subject: subject || "Signup Successful",
        html: emailBody
    }

    /* Send mail */
    transporter.sendMail(message)
        .then(() => {
            return res.status(200).send({ message: "You should receive an email from us." })
        })
        .catch(error => res.status(500).send({ error }))

}
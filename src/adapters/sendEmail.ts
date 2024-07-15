import { SETTINGS } from "../settings";
const nodemailer = require("nodemailer");

export const sendMailService = {
    async sendMail (email: string, confirmationCode: string) {
        try {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                //port: 465, // 587 for false
                //secure: true, // Use `true` for port 465, `false` for all other ports
                // logger: true,
                // debug: true,
                // secureConnection: false,
                auth: {
                user: "hometaskincubator@gmail.com",
                pass: SETTINGS.PASSWORD_BY_EMAIL,
                },
                // tls: {
                //     rejectUnauthorized: false,
                // },
            });
                const info = await transporter.sendMail({
                from: 'Dmitry <hometaskincubator@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello bro!", // plain text body
                html: ` <h1>Thank for your registration</h1>
                <p>To finish registration please follow the link below:
                <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
                </p>`, // html body
                });
        } catch (error) {
            console.error('Send email error', error); //залогировать ошибку при отправке сообщения
        }
    }
}

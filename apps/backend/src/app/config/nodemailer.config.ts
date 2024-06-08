import SMTPTransport from 'nodemailer/lib/smtp-transport';

const { TRANSPORTER_HOST, TRANSPORTER_PORT, TRANSPORTER_AUTH_USER, TRANSPORTER_AUTH_PASS } = process.env;

export const nodemailerConfig: SMTPTransport.Options = {
    host: TRANSPORTER_HOST,
    port: Number(TRANSPORTER_PORT),
    auth: {
        user: TRANSPORTER_AUTH_USER,
        pass: TRANSPORTER_AUTH_PASS,
    },
};

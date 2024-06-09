export class MailOptions {
    public from: string;

    constructor(public to: string, public subject: string, public html: string) {
        const { SENDER_EMAIL, SENDER_NAME } = process.env;

        this.from = `"${SENDER_NAME}" <${SENDER_EMAIL}>`;
    }
}

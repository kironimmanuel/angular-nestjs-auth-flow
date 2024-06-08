declare namespace NodeJS {
    export interface ProcessEnv {
        NODE_ENV: 'development' | 'production';
        ORIGIN: string;
        JWT_SECRET: string;
        TRANSPORTER_HOST: string;
        TRANSPORTER_PORT: string;
        TRANSPORTER_AUTH_USER: string;
        TRANSPORTER_AUTH_PASS: string;
        SENDER_EMAIL: string;
        SENDER_NAME: string;
    }
}

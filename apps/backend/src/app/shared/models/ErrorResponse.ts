export class ErrorResponse {
    constructor(
        public statusCode: number,
        public statusText: string,
        public message: string,
        public timestamp: string,
        public path: string
    ) {}
}

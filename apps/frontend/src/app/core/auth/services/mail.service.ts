import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { ApiEndpoint } from '../../../shared/enums';

@Injectable({
    providedIn: 'root',
})
export class MailService {
    constructor(private http: HttpClient) {}

    public verifyEmail(token: string, email: string): Observable<any> {
        return this.http
            .post(ApiEndpoint.VERIFY_EMAIL, { verificationToken: token, email })
            .pipe(catchError((error) => throwError(() => error)));
    }

    public resendVerificationEmail(email: string): Observable<any> {
        return this.http
            .post(ApiEndpoint.RESEND_VERIFICATION_EMAIL, { email })
            .pipe(catchError((error) => throwError(() => error)));
    }

    public sendResetPasswordEmail(email: string): Observable<any> {
        return this.http
            .post(ApiEndpoint.FORGOT_PASSWORD, { email })
            .pipe(catchError((error) => throwError(() => error)));
    }
}

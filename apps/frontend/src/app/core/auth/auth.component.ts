import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '@nx-angular-nestjs-authentication/environments';
import {
    CreateUserDTO,
    CreateUserResponseDTO,
    ErrorDTO,
    LoginUserDTO,
    LoginUserResponseDTO,
} from '@nx-angular-nestjs-authentication/models';
import { Observable } from 'rxjs';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { AppRoute, AuthType } from '../../shared/enums';
import { FormErrorStateMatcher } from '../../shared/lib';
import { errorMessage, successMessage } from '../../shared/notification/messages';
import { ToastService } from '../../shared/notification/toast/services/toast.service';
import { generateRandomEmail, getRandomUsername } from '../../shared/utils';
import { AuthService } from './services/auth.service';
import { MailService } from './services/mail.service';

interface AuthFormControls {
    username?: FormControl<string | null>;
    email: FormControl<string | null>;
    password: FormControl<string | null>;
}

@Component({
    selector: 'app-auth',
    standalone: true,
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatButtonModule,
        RouterLink,
        MatCardModule,
        LoadingSpinnerComponent,
    ],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit {
    public environment = environment;
    authType = '';
    title = '';
    hide = true;
    isSubmitting = false;
    isVerfiying = false;
    isLoading = false;
    isResendDisabled = false;
    remainingSeconds = 0;
    userRegisterEmail: null | string | undefined;

    matcher = new FormErrorStateMatcher();

    loginRoute = AppRoute.LOGIN;
    registerRoute = AppRoute.REGISTER;
    privacyRoute = AppRoute.PRIVACY;
    termsOfServiceRoute = AppRoute.TERMS_OF_SERVICE;
    forgotPasswordRoute = AppRoute.FORGOT_PASSWORD;

    constructor(
        private readonly route: ActivatedRoute,
        private readonly authService: AuthService,
        private readonly mailService: MailService,
        private readonly router: Router,
        private readonly toast: ToastService
    ) {}

    authForm = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.maxLength(30)]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });

    ngOnInit(): void {
        const urlSegments = this.route.snapshot.url;
        this.authType = urlSegments.length > 0 ? urlSegments[urlSegments.length - 1].path : '';
        this.title = this.authType === AuthType.LOGIN ? 'Login' : 'Register';

        if (!environment.production && this.authType === AuthType.REGISTER) {
            this.generateMockData();
        }

        if (this.authType === AuthType.LOGIN) {
            (this.authForm as FormGroup).removeControl('username');
        }
    }

    hasError(controlName: keyof AuthFormControls, errorName: string) {
        const control = this.authForm.get(controlName);
        return control && control.hasError(errorName);
    }

    onSubmit() {
        const observable = this.getAuthObservable();
        if (!observable || !this.authForm.valid) {
            return;
        }

        this.isSubmitting = true;
        this.isLoading = true;

        observable.subscribe({
            next: () => {
                if (this.authType === AuthType.REGISTER) {
                    this.userRegisterEmail = this.authForm.value.email;
                    this.isVerfiying = true;
                } else {
                    void this.router.navigate(['/']);
                }
                this.authForm.reset();
                this.isSubmitting = false;
                this.isLoading = false;
            },
            error: (error: ErrorDTO) => {
                this.isLoading = false;
                throw error;
            },
        });
    }

    onResendEmail() {
        if (!this.userRegisterEmail) return;

        this.remainingSeconds = 30;
        this.isResendDisabled = true;

        const interval = setInterval(() => {
            this.remainingSeconds--;
            if (this.remainingSeconds === 0) {
                clearInterval(interval);
                this.isResendDisabled = false;
            }
        }, 1000);

        this.mailService.resendVerificationEmail(this.userRegisterEmail).subscribe({
            next: () => {
                this.toast.success(successMessage.EMAIL_RESEND);
            },
            error: (error: ErrorDTO) => {
                this.toast.error(errorMessage[error.errorCode]);
                clearInterval(interval);
                this.isResendDisabled = false;
                throw error;
            },
        });
    }

    private getAuthObservable(): Observable<CreateUserResponseDTO | LoginUserResponseDTO> {
        if (this.authType === AuthType.REGISTER) {
            return this.authService.register(this.authForm.value as CreateUserDTO);
        } else {
            return this.authService.login(this.authForm.value as LoginUserDTO);
        }
    }

    private generateMockData() {
        this.authForm.patchValue({ email: generateRandomEmail() });
        this.authForm.patchValue({ username: getRandomUsername() });
        this.authForm.patchValue({ password: 'password' });
    }

    adminLogin() {
        this.authForm.patchValue({ email: 'admin@gmail.com' });
        this.authForm.patchValue({ password: 'password' });
    }
}

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { ErrorDTO } from '@nx-angular-nestjs-authentication/models';
import { LoadingSpinnerComponent } from './../../../../shared/components/loading-spinner/loading-spinner.component';
import { AppRoute } from './../../../../shared/enums';
import { FormErrorStateMatcher } from './../../../../shared/lib/FormErrorStateMatcher';
import { errorMessage, successMessage } from './../../../../shared/notification/messages';
import { ToastService } from './../../../../shared/notification/toast/services/toast.service';
import { MailService } from './../../services/mail.service';

interface ForgotPasswordFormControls {
    email: FormControl<string | null>;
}

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        LoadingSpinnerComponent,
    ],
    templateUrl: './forgot-password.component.html',
    styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
    matcher = new FormErrorStateMatcher();

    isLoading = false;
    isSubmitting = false;
    isSuccess = false;

    loginRoute = AppRoute.LOGIN;

    forgotPasswordForm = new FormGroup({
        email: new FormControl('', [Validators.required, Validators.email]),
    });

    constructor(private readonly mailService: MailService, private readonly toast: ToastService) {}

    onSubmit(): void {
        if (this.forgotPasswordForm.invalid) {
            return;
        }

        this.isSubmitting = true;
        this.isLoading = true;
        this.forgotPasswordForm.controls['email'].disable();

        this.mailService.sendResetPasswordEmail(this.forgotPasswordForm.value.email!).subscribe({
            next: () => {
                this.toast.success(successMessage.PASSWORD_RESET_LINK);
                this.isSubmitting = false;
                this.isLoading = false;
                this.isSuccess = true;
                this.forgotPasswordForm.reset();
            },
            error: (error: ErrorDTO) => {
                this.toast.error(errorMessage[error.errorCode]);
                this.isSubmitting = false;
                this.isLoading = false;
                this.forgotPasswordForm.controls['email'].enable();
            },
        });
    }

    hasError(controlName: keyof ForgotPasswordFormControls, errorName: string) {
        const control = this.forgotPasswordForm.get(controlName);
        return control && control.hasError(errorName);
    }
}

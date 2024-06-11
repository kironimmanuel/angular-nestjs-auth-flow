import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ErrorDTO } from '@nx-angular-nestjs-authentication/models';
import { AuthService } from '../../services/auth.service';
import { LoadingSpinnerComponent } from './../../../../shared/components/loading-spinner/loading-spinner.component';
import { AppRoute } from './../../../../shared/enums';
import { FormErrorStateMatcher } from './../../../../shared/lib/FormErrorStateMatcher';
import { errorMessage, successMessage } from './../../../../shared/notification/messages';
import { ToastService } from './../../../../shared/notification/toast/services/toast.service';

interface ResetPasswordFormControls {
    newPassword: FormControl<string | null>;
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
        MatIconModule,
    ],
    templateUrl: './reset-password.component.html',
    styleUrl: './reset-password.component.css',
})
export class ResetPasswordComponent {
    matcher = new FormErrorStateMatcher();

    hide = true;
    isLoading = false;
    isSubmitting = false;

    loginRoute = AppRoute.LOGIN;

    resetPasswordForm = new FormGroup({
        newPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private readonly authService: AuthService,
        private readonly toast: ToastService
    ) {}

    onSubmit(): void {
        const token = this.route.snapshot.queryParamMap.get('token');
        const email = this.route.snapshot.queryParamMap.get('email');

        if (this.resetPasswordForm.invalid && !token && !email) {
            return;
        }

        this.isSubmitting = true;
        this.isLoading = true;

        this.authService.resetPassword(this.resetPasswordForm.value.newPassword!, email!, token!).subscribe({
            next: () => {
                this.toast.success(successMessage.PASSWORD_RESET);
                this.isSubmitting = false;
                this.isLoading = false;
                this.router.navigate([AppRoute.LOGIN]);
                this.resetPasswordForm.reset();
            },
            error: (error: ErrorDTO) => {
                this.toast.error(errorMessage[error.errorCode]);
                this.isSubmitting = false;
                this.isLoading = false;
            },
        });
    }

    hasError(controlName: keyof ResetPasswordFormControls, errorName: string) {
        const control = this.resetPasswordForm.get(controlName);
        return control && control.hasError(errorName);
    }
}

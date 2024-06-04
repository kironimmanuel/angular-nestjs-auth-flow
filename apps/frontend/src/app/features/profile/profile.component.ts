import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { environment } from '@nx-angular-nestjs-authentication/environments';
import { UpdateUserDTO } from '@nx-angular-nestjs-authentication/models';
import { catchError, finalize, of } from 'rxjs';
import { AuthService } from '../../core/auth/services/auth.service';
import { FormErrorStateMatcher } from '../../shared/lib';

interface ProfileFormControls {
    username?: FormControl<string | null>;
    email: FormControl<string | null>;
}

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatDividerModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
    ],
    templateUrl: './profile.component.html',
})
export class ProfileComponent {
    public environment = environment;
    hide = true;
    isSubmitting = false;
    matcher = new FormErrorStateMatcher();

    profileForm = new FormGroup({
        username: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
    });

    constructor(private authService: AuthService) {
        const userInfo = this.authService.currentUserValue;
        if (userInfo) {
            this.profileForm.patchValue({
                username: userInfo.username,
                email: userInfo.email,
            });
        }
    }

    onSubmit() {
        this.isSubmitting = true;
        if (this.profileForm.valid) {
            const updateUserDto: UpdateUserDTO = {
                username: this.profileForm.value.username!,
                email: this.profileForm.value.email!,
            };

            this.authService
                .update(updateUserDto)
                .pipe(
                    catchError(() => of(null)),
                    finalize(() => (this.isSubmitting = false))
                )
                .subscribe();
        }
    }

    hasUserInfoChanged(): boolean {
        const currentUser = this.authService.currentUserValue;
        if (!currentUser) {
            return false;
        }

        const formValues = this.profileForm.value;
        return formValues.username !== currentUser.username || formValues.email !== currentUser.email;
    }

    hasError(controlName: keyof ProfileFormControls, errorName: string) {
        const control = this.profileForm.get(controlName);
        return control && control.hasError(errorName) && (control.touched || this.isSubmitting);
    }
}

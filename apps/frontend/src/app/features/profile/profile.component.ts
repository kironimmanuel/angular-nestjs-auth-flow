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
import { AuthService } from '../../core/auth/services/auth.service';
import { UserService } from '../../shared/services/user.service';
import { FormErrorStateMatcher } from '../../shared/utils';

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
    email: new FormControl('', [Validators.required]),
  });

  constructor(readonly authService: AuthService, readonly userService: UserService) {
    const userInfo = this.authService.currentUser();
    if (userInfo) {
      this.profileForm.patchValue({
        username: userInfo.username,
        email: userInfo.email,
      });
    }
  }

  hasUserInfoChanged() {
    const { username, email } = this.authService.currentUser() || {};
    const formValues = this.profileForm.value;

    return !!username && (formValues.username !== username || formValues.email !== email);
  }

  onSubmit() {
    this.isSubmitting = true;
    if (this.profileForm.valid) {
      this.userService.updateUser(this.profileForm.value as UpdateUserDTO);
    }
  }

  hasError(controlName: keyof ProfileFormControls, errorName: string) {
    const control = this.profileForm.get(controlName);
    return control && control.hasError(errorName) && (control.touched || this.isSubmitting);
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '@nx-angular-nestjs-authentication/environments';
import { LoginUserDto, RegisterUserDTO } from '@nx-angular-nestjs-authentication/models';
import { AppRoute, AuthType } from '../../shared/enums';
import { FormErrorStateMatcher, generateRandomEmail, getRandomUsername } from '../../shared/utils';
import { AuthService } from './services/auth.service';

interface RegisterFormControls {
  username: FormControl<string | null>;
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
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
})
export class AuthComponent implements OnInit {
  authType = '';
  title = '';
  hide = true;
  isSubmitting = false;
  matcher = new FormErrorStateMatcher();
  loginRoute = AppRoute.LOGIN;
  registerRoute = AppRoute.REGISTER;
  privacyRoute = AppRoute.PRIVACY;
  termsOfServiceRoute = AppRoute.TERMS_OF_SERVICE;

  constructor(private readonly route: ActivatedRoute, private readonly authService: AuthService) {}

  ngOnInit(): void {
    const urlSegments = this.route.snapshot.url;

    this.authType = urlSegments.length > 0 ? urlSegments[urlSegments.length - 1].path : '';
    this.title = this.authType === 'login' ? 'Login' : 'Register';

    if (!environment.production && this.authType === AuthType.REGISTER) {
      this.generateMockData();
    }
  }

  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.maxLength(30)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  onSubmit() {
    this.isSubmitting = true;
    if (this.registerForm.valid) {
      if (this.authType === AuthType.REGISTER) {
        this.authService.register(this.registerForm.value as RegisterUserDTO);
      } else {
        this.authService.login(this.registerForm.value as LoginUserDto);
      }
    }
  }

  hasError(controlName: keyof RegisterFormControls, errorName: string) {
    const control = this.registerForm.controls[controlName];
    return control.hasError(errorName) && (control.touched || this.isSubmitting);
  }

  resetForm(form: FormGroup) {
    form.reset();
    Object.keys(form.controls).forEach((key) => {
      const control = form.get(key);
      if (control) {
        control.setErrors(null);
      }
    });
  }

  // Generate mock form data for development
  generateMockData() {
    this.registerForm.patchValue({ email: generateRandomEmail() });
    this.registerForm.patchValue({ username: getRandomUsername() });
    this.registerForm.patchValue({ password: 'password' });
  }
}

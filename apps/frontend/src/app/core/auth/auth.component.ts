import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { environment } from '@nx-angular-nestjs-authentication/environments';
import {
  CreateUserDTO,
  CreateUserResponseDTO,
  LoginUserDTO,
  LoginUserResponseDTO,
} from '@nx-angular-nestjs-authentication/models';
import { Observable } from 'rxjs';
import { AppRoute, AuthType } from '../../shared/enums';
import { FormErrorStateMatcher } from '../../shared/lib';
import { generateRandomEmail, getRandomUsername } from '../../shared/utils';
import { AuthService } from './services/auth.service';

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
  matcher = new FormErrorStateMatcher();
  loginRoute = AppRoute.LOGIN;
  registerRoute = AppRoute.REGISTER;
  privacyRoute = AppRoute.PRIVACY;
  termsOfServiceRoute = AppRoute.TERMS_OF_SERVICE;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly router: Router
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

  onSubmit() {
    this.isSubmitting = true;
    let observable = {} as Observable<CreateUserResponseDTO | LoginUserResponseDTO>;

    if (this.authForm.valid) {
      if (this.authType === AuthType.REGISTER) {
        observable = this.authService.register(this.authForm.value as CreateUserDTO);
      } else {
        observable = this.authService.login(this.authForm.value as LoginUserDTO);
      }
      observable?.subscribe({
        next: () => {
          void this.router.navigate(['/']);
          this.resetForm(this.authForm);
        },
        error: (err) => {
          throw err;
        },
        complete: () => {
          this.isSubmitting = false;
        },
      });
    }
  }

  hasError(controlName: keyof AuthFormControls, errorName: string) {
    const control = this.authForm.get(controlName);
    return control && control.hasError(errorName) && (control.touched || this.isSubmitting);
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

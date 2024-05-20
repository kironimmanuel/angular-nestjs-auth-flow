import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { environment } from '@nx-angular-nestjs-authentication/environments';
import { User } from '@nx-angular-nestjs-authentication/models';
import { AuthService } from './core/auth/services/auth.service';
import { FooterComponent } from './core/layout/footer/footer.component';
import { HeaderComponent } from './core/layout/header/header.component';
import { ToastComponent } from './shared/components/toast/toast.component';
import { AppRoute } from './shared/enums';

@Component({
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, ToastComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(
    private readonly authService: AuthService,
    private readonly http: HttpClient,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (event.url !== AppRoute.LOGIN && event.url !== AppRoute.REGISTER && event.url !== AppRoute.LANDING) {
          this.http.get(`${environment.apiUrl}/user`).subscribe({
            next: (user) => {
              this.authService.currentUser.set(user as User);
            },
            error: () => {
              this.authService.currentUser.set(null);
            },
          });
        }
      }
    });
  }
}

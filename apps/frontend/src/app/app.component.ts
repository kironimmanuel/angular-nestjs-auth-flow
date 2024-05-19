import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { environment } from '@nx-angular-nestjs-authentication/environments';
import { User } from '@nx-angular-nestjs-authentication/models';
import { AuthService } from './core/auth/services/auth.service';
import { FooterComponent } from './core/layout/footer/footer.component';
import { HeaderComponent } from './core/layout/header/header.component';

@Component({
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent],
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
        if (event.url !== '/login' && event.url !== '/register') {
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

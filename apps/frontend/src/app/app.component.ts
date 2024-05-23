import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './core/layout/footer/footer.component';
import { HeaderComponent } from './core/layout/header/header.component';
import { ToastComponent } from './shared/components/toast/toast.component';

@Component({
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent, ToastComponent],
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'frontend';
}

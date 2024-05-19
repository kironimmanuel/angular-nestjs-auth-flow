import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-regsiter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  title = 'Register';
}

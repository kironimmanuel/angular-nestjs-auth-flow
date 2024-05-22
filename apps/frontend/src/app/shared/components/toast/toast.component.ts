import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { ToastType } from '../../enums';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  imports: [CommonModule, MatIcon],
  styleUrl: './toast.component.css',
  standalone: true,
  animations: [
    trigger('openClose', [
      state(
        'closed',
        style({
          visibility: 'hidden',
          right: '-400px',
        })
      ),
      state(
        'open',
        style({
          right: '40px',
        })
      ),
      transition('open <=> closed', [animate('0.5s ease-in-out')]),
    ]),
  ],
})
export class ToastComponent {
  private hideTimeout: ReturnType<typeof setTimeout>;
  private remainingTime = 3000;
  private endTime: number;

  successType = ToastType.SUCCESS;
  infoType = ToastType.INFO;
  warningType = ToastType.WARNING;
  errorType = ToastType.ERROR;

  constructor(public toastService: ToastService) {
    this.toastService.open.subscribe((data) => {
      if (data.show) {
        this.countDown();
      }
    });
  }

  countDown() {
    this.endTime = Date.now() + this.remainingTime;
    this.hideTimeout = setTimeout(() => {
      this.toastService.hide();
    }, this.remainingTime);
  }

  stopCountDown() {
    clearTimeout(this.hideTimeout);
    this.remainingTime = this.endTime - Date.now();
  }
}

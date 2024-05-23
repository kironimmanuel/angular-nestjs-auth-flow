import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { ToastType } from '../../enums';
import { ToastService } from '../../services/toast.service';

interface DisplayedToast {
  title?: string;
  content: string;
  type?: ToastType;
  id: number;
  show: boolean;
  timer?: ReturnType<typeof setTimeout>;
}

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  imports: [CommonModule, MatIconModule],
  styleUrls: ['./toast.component.css'],
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
export class ToastComponent implements OnInit {
  private toastDuration = 3000;
  private toastCounter = 0;

  toasts: DisplayedToast[] = [];

  successType = ToastType.SUCCESS;
  infoType = ToastType.INFO;
  warningType = ToastType.WARNING;
  errorType = ToastType.ERROR;

  constructor(public toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toasts$.subscribe((data) => {
      const toastId = this.toastCounter++;
      const newToast: DisplayedToast = { ...data, id: toastId, show: true };
      this.toasts.push(newToast);

      newToast.timer = setTimeout(() => this.hideToast(toastId), this.toastDuration);
    });
  }

  hideToast(id: number) {
    const toastIndex = this.toasts.findIndex((toast) => toast.id === id);
    if (toastIndex > -1) {
      this.toasts[toastIndex].show = false;
      clearTimeout(this.toasts[toastIndex].timer);
      setTimeout(() => {
        this.toasts = this.toasts.filter((toast) => toast.id !== id);
      }, 500);
    }
  }

  stopCountDown(id: number) {
    const toast = this.toasts.find((toast) => toast.id === id);
    if (toast) {
      clearTimeout(toast.timer);
    }
  }

  countDown(id: number) {
    const toast = this.toasts.find((toast) => toast.id === id);
    if (toast) {
      toast.timer = setTimeout(() => this.hideToast(id), this.toastDuration);
    }
  }
}

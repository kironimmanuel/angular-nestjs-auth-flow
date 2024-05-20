import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastType } from '../enums';

interface Toast {
  title: string;
  content: string;
  show?: boolean;
  type?: ToastType;
}

interface ToastContent {
  title: string;
  content: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  data: Toast;
  open = new Subject<Toast>();

  private initiate(data: Toast) {
    this.data = { ...data, show: true };
    this.open.next(this.data);
  }

  hide() {
    this.data = { ...this.data, show: false };
    this.open.next(this.data);
  }

  success(data: ToastContent) {
    this.initiate({ ...data, type: ToastType.SUCCESS });
  }

  info(data: ToastContent) {
    this.initiate({ ...data, type: ToastType.INFO });
  }

  warning(data: ToastContent) {
    this.initiate({ ...data, type: ToastType.WARNING });
  }

  error(data: ToastContent) {
    this.initiate({ ...data, type: ToastType.ERROR });
  }
}

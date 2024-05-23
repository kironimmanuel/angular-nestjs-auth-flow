import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastType } from '../enums';

interface Toast {
  title?: string;
  content: string;
  type?: ToastType;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSubject = new Subject<Toast>();
  toasts$ = this.toastSubject.asObservable();

  private createToast(data: Toast) {
    if (!data.title) {
      switch (data.type) {
        case ToastType.SUCCESS:
          data.title = 'Success';
          break;
        case ToastType.INFO:
          data.title = 'Info';
          break;
        case ToastType.WARNING:
          data.title = 'Warning';
          break;
        case ToastType.ERROR:
          data.title = 'Error';
          break;
      }
    }
    this.toastSubject.next({ ...data });
  }

  success(data: Toast) {
    this.createToast({ ...data, type: ToastType.SUCCESS });
  }

  info(data: Toast) {
    this.createToast({ ...data, type: ToastType.INFO });
  }

  warning(data: Toast) {
    this.createToast({ ...data, type: ToastType.WARNING });
  }

  error(data: Toast) {
    this.createToast({ ...data, type: ToastType.ERROR });
  }
}

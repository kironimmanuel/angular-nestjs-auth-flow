import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface Toast {
    title?: string;
    content: string;
    type?: ToastType;
}

export enum ToastType {
    SUCCESS = 'success',
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error',
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

    public success(data: Toast | string) {
        this.createToast(
            typeof data === 'string' ? { content: data, type: ToastType.SUCCESS } : { ...data, type: ToastType.SUCCESS }
        );
    }

    public info(data: Toast | string) {
        this.createToast(
            typeof data === 'string' ? { content: data, type: ToastType.INFO } : { ...data, type: ToastType.INFO }
        );
    }

    public warning(data: Toast | string) {
        this.createToast(
            typeof data === 'string' ? { content: data, type: ToastType.WARNING } : { ...data, type: ToastType.WARNING }
        );
    }

    public error(data: Toast | string) {
        this.createToast(
            typeof data === 'string' ? { content: data, type: ToastType.ERROR } : { ...data, type: ToastType.ERROR }
        );
    }
}

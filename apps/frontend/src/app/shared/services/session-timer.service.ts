import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fromEvent, Observable, Subject, Subscription, timer } from 'rxjs';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/auth/services/auth.service';
import { DialogComponent } from '../components/dialog/dialog.component';

@Injectable({
  providedIn: 'root',
})
export class SessionTimerService {
  private activity$: Observable<Event>;
  private destroy$ = new Subject<void>();
  private dialogTriggered = false;
  private warningTime = 5 * 1000;
  private inactivityTime = 10 * 1000;
  private timerSubscription: Subscription;

  constructor(private readonly authService: AuthService, private readonly dialog: MatDialog) {
    this.activity$ = fromEvent(document, 'mousemove').pipe(debounceTime(1000));
  }

  startSessionTimerIfLoggedIn() {
    if (this.authService.isAuthenticated()) {
      this.startSessionTimer();
    }
  }

  private startSessionTimer() {
    const remainingTime = (this.inactivityTime - this.warningTime) / 1000;
    this.timerSubscription = this.activity$
      .pipe(
        switchMap(() => timer(0, 1000).pipe(takeUntil(timer(this.inactivityTime)))),
        takeUntil(this.destroy$)
      )
      .subscribe((elapsedTime) => {
        const currentRemainingTime = remainingTime - elapsedTime;
        console.log('SessionTimerService ~ .subscribe ~ currentRemainingTime:', currentRemainingTime);
        if (!this.dialogTriggered && currentRemainingTime <= this.warningTime / 1000) {
          this.triggerSessionExpiryDialog();
        }
        if (currentRemainingTime <= 0) {
          this.authService.logout();
        }
      });
  }

  private triggerSessionExpiryDialog() {
    const logoutCallback = () => {
      this.authService.logout();
      this.dialogTriggered = false;
    };

    const extendCallback = () => {
      this.dialogTriggered = false;
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }
    };

    this.dialogTriggered = true;
    this.dialog.open(DialogComponent, {
      data: {
        title: 'Session Expiring',
        message: 'Your session will expire in less than a minute. Do you want to extend it?',
        actions: [
          { text: 'Logout', callback: logoutCallback },
          { text: 'Extend', callback: extendCallback },
        ],
      },
    });
  }

  stopSessionTimer(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

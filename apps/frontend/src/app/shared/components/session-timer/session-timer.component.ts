import { Component, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../core/auth/services/auth.service';
import { JwtService } from '../../../core/auth/services/jwt.service';
import { warningMessage } from '../../notification/messages';
import { ToastService } from '../../notification/toast/services/toast.service';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-session-timer',
  templateUrl: './session-timer.component.html',
  standalone: true,
})
export class SessionTimerComponent implements OnDestroy {
  private intervalId: ReturnType<typeof setInterval>;
  private sessionExpirationWarningThreshold = 60 * 1000;
  private dialogTriggered = false;
  remainingTime: string;

  constructor(
    public jwtService: JwtService,
    public authService: AuthService,
    public dialog: MatDialog,
    private toast: ToastService
  ) {
    const sessionExpiration = this.jwtService.getRemainingSessionTime();
    if (sessionExpiration !== null) {
      this.updateTimerDisplay();
      this.intervalId = setInterval(() => this.updateTimerDisplay(), 1000);
    } else {
      this.remainingTime = warningMessage.NO_ACTIVE_SESSION.title;
      this.toast.warning(warningMessage.NO_ACTIVE_SESSION);
      // this.authService.logout();
    }
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  private updateTimerDisplay() {
    const remainingTimeInMs = this.jwtService.getRemainingSessionTime();

    if (remainingTimeInMs === null) {
      this.remainingTime = warningMessage.NO_ACTIVE_SESSION.title;
      // this.toast.warning(warningMessage.NO_ACTIVE_SESSION);
      // this.authService.logout();
      return;
    }

    if (remainingTimeInMs <= 0) {
      this.remainingTime = warningMessage.SESSION_EXPIRED.title;
      // this.toast.warning(warningMessage.SESSION_EXPIRED);
      // this.authService.logout();
      return;
    }

    // if (remainingTimeInMs < this.sessionExpirationWarningThreshold && !this.dialogTriggered) {
    //   this.triggerSessionExpiryDialog();
    // }

    this.remainingTime = this.formatTime(remainingTimeInMs);
  }

  private triggerSessionExpiryDialog() {
    const logoutCallback = () => {
      this.authService.logout();
      this.dialogTriggered = false;
    };

    const extendCallback = () => {
      this.jwtService.refreshAccessToken().subscribe({
        error: () => {
          this.authService.logout();
        },
        complete: () => {
          this.dialogTriggered = false;
        },
      });
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

  private formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  private padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}

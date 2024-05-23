import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../../../core/auth/services/auth.service';

@Component({
  selector: 'app-session-timer',
  templateUrl: './session-timer.component.html',
  standalone: true,
})
export class SessionTimerComponent implements OnDestroy {
  private intervalId: ReturnType<typeof setInterval>;
  remainingTime: string;

  constructor(public authService: AuthService) {
    const sessionExpiration = this.authService.getSessionExpirationTime();
    if (sessionExpiration !== null) {
      this.updateTimerDisplay();
      this.intervalId = setInterval(() => this.updateTimerDisplay(), 1000);
    } else {
      this.remainingTime = 'No active session.';
    }
  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  updateTimerDisplay() {
    const sessionExpiration = this.authService.getSessionExpirationTime();
    if (sessionExpiration !== null) {
      const remainingTimeInMs = sessionExpiration - Date.now();
      if (remainingTimeInMs > 0) {
        this.remainingTime = this.formatTime(remainingTimeInMs);
      } else {
        this.remainingTime = 'Session expired';
      }
    } else {
      this.remainingTime = 'No active session.';
    }
  }

  formatTime(milliseconds: number): string {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}

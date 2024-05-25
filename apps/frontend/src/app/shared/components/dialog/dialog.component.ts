import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';

interface Action {
  text: string;
  callback?: () => void;
}

interface DialogData {
  title: string;
  message: string;
  actions: [Action, Action];
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  standalone: true,
  imports: [CommonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatButtonModule],
})
export class DialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  handleAction(callback: () => void): void {
    callback();
  }

  isLastAction(action: Action): boolean {
    return action === this.data.actions[this.data.actions.length - 1];
  }
}

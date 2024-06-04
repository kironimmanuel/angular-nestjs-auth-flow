import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';

@Component({
    selector: 'app-privacy',
    standalone: true,
    imports: [CommonModule, MatDividerModule],
    templateUrl: './privacy.component.html',
})
export class PrivacyComponent {}

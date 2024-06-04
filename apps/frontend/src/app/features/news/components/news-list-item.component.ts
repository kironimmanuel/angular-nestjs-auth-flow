import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
    selector: 'app-news-list-item',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './news-list-item.component.html',
})
export class NewsComponent {}

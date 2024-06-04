import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { User } from '@nx-angular-nestjs-authentication/models';
import { AuthService } from '../../core/auth/services/auth.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { DateTimeFormatPipe } from '../../shared/pipes/date-time-format.pipe';
import { NewsArticle } from './models/NewsArticle';
import { NewsService } from './services/news.service';

@Component({
    selector: 'app-news',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatDividerModule,
        MatListModule,
        MatTableModule,
        LoadingSpinnerComponent,
        MatPaginatorModule,
        DateTimeFormatPipe,
    ],
    templateUrl: './news.component.html',
})
export class NewsComponent implements OnInit {
    displayedColumns: string[] = ['title', 'createdAt', 'author', 'url'];
    currentUser: User | null;
    newsArticles: NewsArticle[] = [];
    isLoading = true;

    pageEvent: PageEvent;
    length = 0;
    pageSize = 10;
    pageIndex = 0;
    pageSizeOptions = [5, 10, 25];

    hidePageSize = false;
    showPageSizeOptions = true;
    showFirstLastButtons = true;
    disabled = false;

    constructor(readonly authService: AuthService, private newsService: NewsService) {
        this.authService.currentUser.subscribe((user) => {
            this.currentUser = user;
        });
    }

    ngOnInit(): void {
        this.newsService.getNewsArticles().subscribe({
            next: (response) => {
                this.length = response.nbPages * response.hitsPerPage;
                this.newsArticles = response.hits;
                this.isLoading = false;
            },
            error: (error) => {
                this.isLoading = false;
                console.error(error);
            },
        });
    }

    handlePageEvent(e: PageEvent) {
        this.isLoading = true;
        this.pageSize = e.pageSize;
        this.pageIndex = e.pageIndex;
        this.length = e.length;

        this.newsService.getNewsArticles(this.pageIndex, this.pageSize).subscribe({
            next: (response) => {
                this.newsArticles = response.hits;
                this.isLoading = false;
            },
            error: (error) => {
                this.isLoading = false;
                console.error(error);
            },
        });
    }
}

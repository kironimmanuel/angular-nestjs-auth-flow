import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { User } from '@nx-angular-nestjs-authentication/models';
import { AuthService } from '../../core/auth/services/auth.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { UserService } from '../../shared/services/user.service';
import { NewsArticle } from './models/NewsArticle';
import { NewsService } from './services/news.service';

@Component({
  selector: 'app-news',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatDividerModule, MatListModule, MatTableModule, LoadingSpinnerComponent],
  templateUrl: './news.component.html',
})
export class NewsComponent implements OnInit {
  currentUser: User | null;
  newsArticles: NewsArticle[] = [];
  isLoading = true;

  displayedColumns: string[] = ['title', 'author', 'points', 'url'];

  constructor(readonly authService: AuthService, readonly userService: UserService, private newsService: NewsService) {
    this.authService.currentUser.subscribe((user) => {
      this.currentUser = user;
    });
  }

  ngOnInit(): void {
    this.newsService.getAllNews().subscribe({
      next: (response) => {
        console.log('NewsComponent ~ this.newsService.getAllNews ~ response:', response);
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

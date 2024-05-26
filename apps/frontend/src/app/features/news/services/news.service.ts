import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../../../shared/notification/toast/services/toast.service';
import { ApiResponse } from '../models/NewsArticle';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private readonly http: HttpClient, private readonly toast: ToastService) {}

  getAllNews(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>('https://hn.algolia.com/api/v1/search?query=react&page=0&hitsPerPage=8').pipe(
      catchError((error) => {
        console.error('Error fetching news articles:', error);
        return throwError(() => error);
      })
    );
  }
}

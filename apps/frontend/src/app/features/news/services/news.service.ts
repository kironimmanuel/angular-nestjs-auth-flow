import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { errorMessage } from '../../../shared/notification/messages';
import { ToastService } from '../../../shared/notification/toast/services/toast.service';
import { ApiResponse } from '../models/NewsArticle';

@Injectable({
    providedIn: 'root',
})
export class NewsService {
    constructor(private readonly http: HttpClient, private readonly toast: ToastService) {}

    getNewsArticles(page = 0, hitsPerPage = 10): Observable<ApiResponse> {
        return this.http
            .get<ApiResponse>(
                `https://hn.algolia.com/api/v1/search?query=react&page=${page}&hitsPerPage=${hitsPerPage}`
            )
            .pipe(
                catchError((error) => {
                    this.toast.error(errorMessage.GENERIC);
                    return throwError(() => error);
                })
            );
    }
}

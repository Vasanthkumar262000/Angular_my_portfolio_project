import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { environment } from '../environments/environment';

export interface ChatResponse {
  response: string;
  provider?: string;
  model?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ChatApiService {

  private apiBaseUrl = (environment as any).apiUrl || 'https://chatbot.vasanthkumarr.com';

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.apiBaseUrl}/chat`, {
      message: message
    }).pipe(
      timeout(30000),
      catchError((error: HttpErrorResponse) => {
        console.error('Chat API Error:', error);
        const errorMessage = error.error?.detail || 
          'Failed to get response. Please check if the backend server is running.';
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
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

  private apiBaseUrl = (environment as any).apiUrl || 'xxxxxxx;

  constructor(private http: HttpClient) {} 

  sendMessage(message: string): Observable<ChatResponse> {
    return this.http.post<ChatResponse>(`${this.apiBaseUrl}/chat`, {
      message: message
    }).pipe(
      timeout(30000),
      catchError((error: HttpErrorResponse) => {
        console.error('Chat API Error:', error);
        console.error('Error Status:', error.status);
        console.error('Error Message:', error.message);
        console.error('API URL:', `${this.apiBaseUrl}/chat`);
        
        let errorMessage = 'Failed to get response. Please check if the backend server is running.';
        
        if (error.status === 0) {
          errorMessage = 'Unable to connect to backend server. Please ensure the backend is running on ' + this.apiBaseUrl;
        } else if (error.error?.detail) {
          errorMessage = error.error.detail;
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
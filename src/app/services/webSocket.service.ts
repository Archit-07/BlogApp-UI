import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private socket$: WebSocketSubject<any> | null = null;

  constructor() {}

  connect(url: string): Observable<any> {
    if (!this.socket$ || this.socket$.closed) {
      this.socket$ = new WebSocketSubject(url);
    }
    return this.socket$.asObservable();
  }

  sendMessage(message: any): void {
    this.socket$?.next(message);
  }

  close(): void {
    this.socket$?.complete();
  }
}

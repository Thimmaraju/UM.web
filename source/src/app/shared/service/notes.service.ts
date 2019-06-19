import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment as env } from '@env/environment';
import { Note } from '../models/note.interface';

@Injectable()
export class NotesService {
  private url: string = env.apiHost + 'v1/notes';

  constructor(private http: HttpClient) { }

  post(note: Note): Observable<any> {
    return this.http.post(this.url, note).pipe(
      retry(5),
      catchError((error: any) => throwError(error))
    );
  }

  // TODO clean up
  postPharmAdmin(note: Note): Observable<any> {
    return this.http.post(`${this.url}`, note).pipe(
      retry(5),
      catchError((error: any) => throwError(error))
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Book } from './Book';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DummyApiService {

  private REST_API_SERVER = "https://fakerestapi.azurewebsites.net/api/Books";

  constructor(private httpClient: HttpClient) {
   }

   public getBooks(): Observable<Book>{

    const httpOptions = {

      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    return this.httpClient.get<Book>(this.REST_API_SERVER,httpOptions);
  }
}

import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  uri: string = 'http://localhost:9000';

  constructor(private http: HttpClient) { }

  getHeaders() {
    const token = localStorage.getItem('token');
    return token ? new HttpHeaders().set('Authorization', token) : null;
  }
  /**
   * Method to send get request with given endpoint and send response as promise
   * @param link endpoint
   */
  get(link: string) {
    return this.http.get(`${this.uri}${link}`, { headers: this.getHeaders() }).toPromise();
  }

  /**
   * Method to send post request with given endpoint and body and send response as poromise.
   * @param link endpoint
   * @param body body to send to backend
   */
  post(link: string, body: any) {
    return this.http.post(`${this.uri}${link}`, body, { headers: this.getHeaders() }).toPromise();
  }
}

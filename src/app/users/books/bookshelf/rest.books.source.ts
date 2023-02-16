import { Injectable } from "@angular/core";
import { HttpClient, HttpEvent, HttpParams, HttpResponse, HttpHeaders, HttpRequest  } from '@angular/common/http';
import { Observable } from "rxjs";
import { catchError, retry, timeout } from "rxjs/operators";

@Injectable()
  export class RestBooksSource {
    public headers: HttpHeaders = new HttpHeaders;
    public params: HttpParams = new HttpParams;
    public urlReq!: string;
    public request!: HttpRequest<any>;

    constructor(private http: HttpClient) { }
    
    getData(): Observable<HttpEvent<any>> {
      return this.sendRequest("GET", this.urlReq, this.params);
    }

    private sendRequest(method: string, url: string, params: HttpParams): Observable<HttpEvent<any>>{
      return this.http.request(method, url, {observe: "events", params: params, responseType: "json"})
        .pipe(retry(3), timeout(30000), catchError((error: HttpResponse<any>) =>
         {throw new Error(`Network Error: ${url.slice(0, 23)} ${error.statusText} (${error.status})`);}));
    }
}
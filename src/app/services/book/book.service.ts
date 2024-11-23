import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { API_URLS } from '../../shared/apiURL';

interface Book{
  id: number | null;
  title: string;
  author: string;
  registeredBy: string;
  totalQuantity: number;
  availableQuantity: number | null;
}

interface BookRegister{
  title: string;
  author: string;
  registeredBy: string;
  totalQuantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookService {

  router = inject(Router);
  http = inject(HttpClient);

  httpOptions = {
    headers: new HttpHeaders({
          'Content-Type': 'application/json'
    })
  };

  public getToken(){
    return sessionStorage.getItem("token");
  }

  registerBook(data: BookRegister){
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization',`Bearer ${this.getToken()}`);
    return this.http.post("http://localhost:8080/" + API_URLS.BOOK, data, this.httpOptions);
  }

  getBookList(){
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization',`Bearer ${this.getToken()}`);
    return this.http.get<Book[]>("http://localhost:8080/" + API_URLS.BOOK, this.httpOptions);
  }

  getBookById(id: number){
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization',`Bearer ${this.getToken()}`);
    return this.http.get<Book>("http://localhost:8080/" + API_URLS.BOOK + "/" + id , this.httpOptions);
  }

  updateBook(data: Book){
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization',`Bearer ${this.getToken()}`);
    return this.http.put("http://localhost:8080/" + API_URLS.BOOK, data, this.httpOptions);
  }

  deleteBook(id: number){
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization',`Bearer ${this.getToken()}`);
    return this.http.delete("http://localhost:8080/" + API_URLS.BOOK + "/" + id, this.httpOptions);
  }

  getAvailableStudents(){
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization',`Bearer ${this.getToken()}`);
    return this.http.get("http://localhost:8080/" + API_URLS.LOAN + "/students", this.httpOptions);
  }

  loanBook(data: any){
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization',`Bearer ${this.getToken()}`);
    return this.http.post("http://localhost:8080/" + API_URLS.LOAN, data, this.httpOptions);
  }

  getLoanList(){
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization',`Bearer ${this.getToken()}`);
    return this.http.get("http://localhost:8080/" + API_URLS.LOAN, this.httpOptions);
  }

  returnLoan(id: number){
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization',`Bearer ${this.getToken()}`);
    return this.http.put("http://localhost:8080/" + API_URLS.LOAN + "/" + id + "/return", null, this.httpOptions);
  }

  getLoansByStudent(id: number){
    this.httpOptions.headers = this.httpOptions.headers.set('Authorization',`Bearer ${this.getToken()}`);
    return this.http.get("http://localhost:8080/" + API_URLS.LOAN + "/student/" + id, this.httpOptions);
  }

}

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';
import { API_URLS } from '../../shared/apiURL';
import { JwtResponseModel, Login, Register } from '../../interfaces/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  router = inject(Router);
  http = inject(HttpClient);

  httpOptions = {
    headers: new HttpHeaders({
          'Content-Type': 'application/json'
    })
  };



  
  currentUserLoginOn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  currentUserData: BehaviorSubject<String> =new BehaviorSubject<String>("");

  userLoggedIn$ = this.currentUserLoginOn.asObservable();

  constructor() { 
    this.currentUserLoginOn=new BehaviorSubject<boolean>(sessionStorage.getItem("token")!=null);
    this.currentUserData=new BehaviorSubject<String>(sessionStorage.getItem("token") || "");
  }

  login(credentials:Login):Observable<any>{
    return this.http.post<JwtResponseModel>("http://localhost:8080/" + API_URLS.LOGIN, 
      credentials, this.httpOptions).pipe(
        tap((userData)=>{
          sessionStorage.setItem("token", userData.token);
          sessionStorage.setItem("nombre", userData.nombre);
          sessionStorage.setItem("rol", userData.rol);
          sessionStorage.setItem("id", userData.id);
          
          this.currentUserData.next(userData.token);
          this.currentUserLoginOn.next(true);
        }),
        map((userData)=> userData.token),
        catchError(this.handleError)
      );
  }

  createAccount(data: Register){
    return this.http.post("http://localhost:8080/" + API_URLS.REGISTER, data, this.httpOptions);
  }

  logout():void{
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("nombre");
    sessionStorage.removeItem("rol");
    sessionStorage.removeItem("id");
    this.router.navigate([''])
    this.currentUserLoginOn.next(false);
}

  private handleError(error:HttpErrorResponse){

    let errorMessage;

    if(error.status===0){
          console.error('Se ha producio un error ', error.error);
          errorMessage='Error de conexión. Por favor, verifica tu red.';
    }
    else if(error.status===400){
          console.error('Backend retornó el código de estado ', error);
          errorMessage = 'Usuario o contraseña incorrectos.';
    }else{
      errorMessage = error.error.message || 'Ocurrió un error inesperado.';
    }

    return throwError(() => new Error(errorMessage));
  }

}

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from './../../services/auth/auth.service';
import { Component, OnInit, inject } from '@angular/core';
import { Login } from '../../interfaces/auth.interface';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);

  isToastVisible: Boolean = false;
  toastMessage:String = '';


  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  ngOnInit() {}

  login(){

    if(this.loginForm.valid){

      this.authService.login(this.loginForm.value as Login).subscribe({
        next: async (userData) => {

          let rol = sessionStorage.getItem('rol');

          switch(rol){
            case 'ADMIN':
              this.router.navigateByUrl('admin')
              break;  

              case 'STUDENT':
              this.router.navigateByUrl('student')
              break; 
            
            default:
              break;
          }
          
        },
        error: async (error) => {
          this.showToast('Usuario o contraseña incorrectos');
        }
      })
      
    }else{
      this.showToast('Por favor, complete los campos');
    }

  }

  showToast(message: string): void {
    this.toastMessage = message;
    this.isToastVisible = true;

    setTimeout(() => {
      this.isToastVisible = false;
    }, 3000);
  }

  hideToast(): void {
    this.isToastVisible = false;
  }
  
}

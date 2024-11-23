import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { Register } from '../../interfaces/auth.interface';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  authService = inject(AuthService);
  fb = inject(FormBuilder);
  router = inject(Router);

  isToastVisible: Boolean = false;
  toastMessage:String = '';

  registerForm = this.fb.group({
    name: ['', Validators.required],
    email: ['' ,[Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: ['STUDENT', Validators.required] 
  });

  onSubmit(): void {
    if (this.registerForm.valid) {
      console.log('Datos del formulario:', this.registerForm.value);

      let saveValue = this.registerForm.value;

      this.authService.createAccount(saveValue as Register).subscribe({
        next: async (data) => {

          this.showToast('Registro exitoso');
          await this.router.navigateByUrl('/login');

        }, error: async (error) => {
          this.showToast(error.error);
        }
      })

    } else {
      


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

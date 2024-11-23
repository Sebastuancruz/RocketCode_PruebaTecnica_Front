import { AuthService } from './../../services/auth/auth.service';
import { Component, OnInit, inject } from '@angular/core';
import { BookService } from '../../services/book/book.service';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface BookRegister{
  title: string;
  author: string;
  registeredBy: string;
  totalQuantity: number;
}

interface Book{
  id: number | null;
  title: string;
  author: string;
  registeredBy: string;
  totalQuantity: number;
  availableQuantity: number | null;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
  bookService = inject(BookService);
  fb = inject(FormBuilder);
  authService = inject(AuthService);


  isToastVisible: Boolean = false;
  toastMessage:String = '';

  books: Book[] = [];
  students: any[] = [];
  loans: any[] = [];

  bookForm = this.fb.group({
    title: ['', Validators.required],
    author: ['', Validators.required],
    totalQuantity: [0, [Validators.required, Validators.min(1)]],
    registeredBy: [sessionStorage.getItem("nombre"), Validators.required]
  });

  loanForm = this.fb.group({
    bookId: ['', Validators.required],
    studentId: ['', Validators.required],
    returnDate: ['', Validators.required]
  });

  ngOnInit() {
    this.getBookList();
    this.getAvailableStudents();
    this.getLoanList();
  }

  returnLoan(id: number){
    this.bookService.returnLoan(id).subscribe({
      next: async (data) => {
        this.showToast('Libro devuelto correctamente');
        this.getBookList();
        this.getLoanList();
      },
      error: async (error) => {
        this.showToast('Error al devolver el libro');
      }
    })
  }


  addBook(): void {
    if (this.bookForm.valid) {
      let bookData : BookRegister = this.bookForm.value as BookRegister;

      this.bookService.registerBook(bookData).subscribe({
        next: async (data) => {

          this.showToast('Libro registrado correctamente');
          this.bookForm.reset();

          this.getBookList();
        },
        error: async (error) => {
          this.showToast('Error al registrar el libro');
        }
      })
    }else{
      this.showToast('Por favor, rellena todos los campos');
    }
  }

  getBookList(){
    this.bookService.getBookList().subscribe({
      next: async (data) => {
        this.books = data;
      },
      error: async (error) => {
        this.showToast('Error al obtener la lista de libros');
      }
    })
  }

  getAvailableStudents(){
    this.bookService.getAvailableStudents().subscribe({
      next: async (data:any) => {
        this.students = data;
      },
      error: async (error) => {
        this.showToast('Error al obtener la lista de estudiantes');
      }
    })
  }

  confirmLoan(): void {
    if (this.loanForm.valid) {
      const loanData = this.loanForm.value;
      
      this.bookService.loanBook(loanData).subscribe({
        next: async (data) => {
          this.showToast('Libro prestado correctamente');
          this.loanForm.reset();
          this.getBookList();
        },
        error : async (error) => {
          this.showToast('Error al prestar el libro');
        }
      })
    }
  }

  getLoanList(){
    this.bookService.getLoanList().subscribe({
      next: async (data:any) => {
        this.loans = data;
      },
      error: async (error) => {
        this.showToast('Error al obtener la lista de prestamos');
      }
    })
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

  logout(): void {
    this.authService.logout();
  }

}

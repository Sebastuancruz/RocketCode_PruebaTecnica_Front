import { Component, OnInit, inject } from '@angular/core';
import { BookService } from '../../services/book/book.service';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent implements OnInit{

  bookService = inject(BookService);
  authService = inject(AuthService);

  loans:any[] = [];

  ngOnInit() {
    this.getStudentLoans();
  }

  getStudentLoans(){
    this.bookService.getLoansByStudent(+sessionStorage.getItem("id")!).subscribe((data:any)=>{
      this.loans = data;
    });
  }
  logout(): void {
    this.authService.logout();
  }
}

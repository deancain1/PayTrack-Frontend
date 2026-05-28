import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Users } from '../../features/models/users/users';
import { UsersService } from '../../features/services/users-service';
import { SharedModule } from '../../../shared.module';
@Component({
  selector: 'app-manage-employees',
  imports: [SharedModule],
  templateUrl: './manage-employees.html',
  styleUrl: './manage-employees.scss',
})
export class ManageEmployees implements OnInit{

  users$ = new BehaviorSubject<Users[]>([]);
  selectedUsers: Users[] = [];

  pageNumber = 1;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  searchTerm = '';

  constructor (private usersService: UsersService){}

  ngOnInit(): void {
      this.loadPage({ first: 0, rows: this.pageSize });
  }

  loadPage(event: any): void {
    this.pageNumber = (event.first / event.rows) +1;
    this.pageSize = event.rows;

    this.usersService.getUsersByRole('Employee', this.pageNumber, this.pageSize, this.searchTerm)
    .subscribe(result => { 
      this.users$.next(result.items);
     this.pageSize = result.pageSize;
     this.pageNumber = result.pageNumber;
      
    });
  }
  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    this.pageNumber = 1;

    this.loadPage({ first: 0, rows: this.pageSize });
  }
   onPageSizeChange(event: any): void {
    this.pageNumber = 1;
    this.loadPage({ first: 0, rows: this.pageSize });
  }

}

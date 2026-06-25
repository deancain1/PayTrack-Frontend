import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared.module';

import { WorkScheduleService } from '../../features/services/work-schedule-service';
import { WorkScheduleModel } from '../../features/models/workschedule/work-schedule-model';
import { CreateWorkScheduleModel } from '../../features/models/workschedule/create-work-schedule';

@Component({
  selector: 'app-work-schedule',
  imports: [FormsModule, SharedModule],
  templateUrl: './work-schedule.html',
  styleUrl: './work-schedule.scss'
})
export class WorkSchedule implements OnInit {

  schedules$ = new BehaviorSubject<WorkScheduleModel[]>([]);

  pageNumber = 1;
  pageSize = 5;
  pageSizeOptions = [5, 10, 20];
  searchTerm = '';

  scheduleName = '';
  scheduleType = 0;
  startTime = '';
  endTime = '';
  requiredHours = 8;
  gracePeriodMinutes = 15;

  constructor(
    private workScheduleService: WorkScheduleService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    
     this.loadPage({
      first: 0,
      rows: this.pageSize
    });
  }


  loadPage(event: any): void {

    this.pageNumber = event.first / event.rows + 1;
    this.pageSize = event.rows;

    this.workScheduleService
      .getSchedules(
        this.pageNumber,
        this.pageSize,
        this.searchTerm
      )
      .subscribe({
        next: (result) => {

          this.schedules$.next(result.items);

          this.pageNumber = result.pageNumber;
          this.pageSize = result.pageSize;
        }
      });
  }
  addSchedule(): void {

    if (!this.scheduleName.trim()) {
      alert('Schedule Name is required.');
      return;
    }

    const payload: CreateWorkScheduleModel = {
      scheduleName: this.scheduleName,
      scheduleType: this.scheduleType,
      startTime: this.startTime + ':00',
      endTime: this.endTime + ':00',
      requiredHours: this.requiredHours,
      gracePeriodMinutes: this.gracePeriodMinutes
    };

    this.workScheduleService.createWorkSchedule(payload)
      .subscribe({
        next: (schedule) => {

          const current = this.schedules$.value;

          this.schedules$.next([
            ...current,
            schedule
          ]);

          this.resetForm();

          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  resetForm(): void {
    this.scheduleName = '';
    this.scheduleType = 0;
    this.startTime = '';
    this.endTime = '';
    this.requiredHours = 8;
    this.gracePeriodMinutes = 15;
  }

  getSchedules(): void {

    // replace with your API call when available
    // this.workScheduleService.getSchedules().subscribe(...)

  }
}
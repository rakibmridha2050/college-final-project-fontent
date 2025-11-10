import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendanceAllListComponent } from './attendance-all-list.component';

describe('AttendanceAllListComponent', () => {
  let component: AttendanceAllListComponent;
  let fixture: ComponentFixture<AttendanceAllListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttendanceAllListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttendanceAllListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

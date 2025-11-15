import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { AdminDashbordComponent } from './components/admin-dashbord/admin-dashbord.component';
import { TopNavBarComponent } from './components/top-nav-bar/top-nav-bar.component';
import { SideNavBarComponent } from './components/side-nav-bar/side-nav-bar.component';
import { DashbordComponent } from './components/admin/dashbord/dashbord.component';
import { StudentaddformComponent } from './components/admin/studentaddform/studentaddform.component';
import { StudentlistComponent } from './components/admin/studentlist/studentlist.component';
import { StudentdetailsComponent } from './components/admin/studentdetails/studentdetails.component';
import { AllstudentsComponent } from './components/admin/allstudents/allstudents.component';
import { DepartmentListComponent } from './components/admin/department-list/department-list.component';
import { DepartmentFormComponent } from './components/admin/department-form/department-form.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClassesListComponent } from './components/admin/classes-list/classes-list.component';
import { ClassFormComponent } from './components/admin/class-form/class-form.component';
import { SectionListComponent } from './components/admin/section-list/section-list.component';
import { SectionFormComponent } from './components/admin/section-form/section-form.component';
import { FacultyListComponent } from './components/admin/faculty-list/faculty-list.component';
import { FacultyFormComponent } from './components/admin/faculty-form/faculty-form.component';
import { CourseListComponent } from './components/admin/course-list/course-list.component';
import { CourseFormComponent } from './components/admin/course-form/course-form.component';
import { CourseFacultyComponent } from './components/admin/course-faculty/course-faculty.component';
import { NoticeListComponent } from './components/admin/notice-list/notice-list.component';
import { NoticeFormComponent } from './components/admin/notice-form/notice-form.component';
import { FacultyDetailsListComponent } from './components/admin/faculty-details-list/faculty-details-list.component';
import { FacultyDetailsFormComponent } from './components/admin/faculty-details-form/faculty-details-form.component';
import { StudentListComponent } from './components/admin/student-list/student-list.component';
import { StudentFormComponent } from './components/admin/student-form/student-form.component';
import { ScheduleClassListComponent } from './components/admin/schedule-class-list/schedule-class-list.component';
import { ScheduleClassFormComponent } from './components/admin/schedule-class-form/schedule-class-form.component';
import { AttendanceListComponent } from './components/admin/attendance-list/attendance-list.component';

import { AttendanceComponent } from './components/admin/attendance/attendance.component';
import { FeeStructureComponent } from './components/admin/fee-structure/fee-structure.component';

import { StudentFeeListComponent } from './components/admin/student-fee-list/student-fee-list.component';
import { PaymentListComponent } from './components/admin/payment-list/payment-list.component';
import { ClassRoutineComponent } from './components/admin/class-routine/class-routine.component';
import { AttendanceAllListComponent } from './components/admin/attendance-all-list/attendance-all-list.component';
import { TeacherDashboardComponent } from './components/teacher-dashboard/teacher-dashboard.component';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard.component';
import { PaymentDashboardComponent } from './components/payment-dashboard/payment-dashboard.component';
import { ExamListComponent } from './components/admin/exam-list/exam-list.component';
import { ExamCreateComponent } from './components/admin/exam-create/exam-create.component';
import { ExamResultsComponent } from './components/admin/exam-results/exam-results.component';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    ForgotPasswordComponent,
    AdminDashbordComponent,
    TopNavBarComponent,
    SideNavBarComponent,
    DashbordComponent,
    StudentaddformComponent,
    StudentlistComponent,
    StudentdetailsComponent,
    AllstudentsComponent,
    
    DepartmentListComponent,
    DepartmentFormComponent,
    ClassesListComponent,
    ClassFormComponent,
    SectionListComponent,
    SectionFormComponent,
    FacultyListComponent,
    FacultyFormComponent,
    CourseListComponent,
    CourseFormComponent,
    CourseFacultyComponent,
    NoticeListComponent,
    NoticeFormComponent,
    FacultyDetailsListComponent,
    FacultyDetailsFormComponent,
    StudentListComponent,
    StudentFormComponent,
    ScheduleClassListComponent,
    ScheduleClassFormComponent,
    AttendanceListComponent,
    
    AttendanceComponent,
          FeeStructureComponent,
       
          StudentFeeListComponent,
          PaymentListComponent,
          ClassRoutineComponent,
          AttendanceAllListComponent,
          TeacherDashboardComponent,
          StudentDashboardComponent,
          PaymentDashboardComponent,
          ExamListComponent,
          ExamCreateComponent,
          ExamResultsComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

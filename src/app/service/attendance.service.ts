import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {  Observable } from 'rxjs';
import { AttendanceFilter, BulkAttendanceRequest, Class, Course, Department, Section, StudentAttendance } from '../model/attendance.models';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
//  private apiUrl = 'http://localhost:8080/api/attendances';



//   constructor(private http: HttpClient) { }

//   // Single attendance
//   createAttendance(attendance: AttendanceRequestDTO): Observable<Attendance> {
//     return this.http.post<Attendance>(this.apiUrl, attendance);
//   }

//   // Bulk attendance - this matches your API
//   createBulkAttendance(attendanceRequests: AttendanceRequestDTO[]): Observable<Attendance[]> {
//     return this.http.post<Attendance[]>(`${this.apiUrl}/bulk`, attendanceRequests);
//   }

//   // Get attendance by section and date
//   getAttendanceBySectionAndDate(sectionId: number, date?: string): Observable<Attendance[]> {
//     let params = new HttpParams();
//     if (date) {
//       params = params.set('date', date);
//     }
//     return this.http.get<Attendance[]>(`${this.apiUrl}/section/${sectionId}`, { params });
  //   }
  
   private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/departments`);
  }

  getClassesByDepartment(departmentId: number): Observable<Class[]> {
    console.log(`${this.apiUrl}/classes/department/${departmentId}`);
    console.log(`${departmentId}`);
    return this.http.get<Class[]>(`${this.apiUrl}/classes/department/${departmentId}`);
return this.http.get<Class[]>(`${this.apiUrl}/classes/departments/${departmentId}`);
  }

  getSectionsByClass(classId: number): Observable<Section[]> {
    return this.http.get<Section[]>(`${this.apiUrl}/sections/by-class/${classId}`);
  }

  getCoursesByDepartment(departmentId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses/department/${departmentId}`);
  }

  getStudentsForAttendance(filter: AttendanceFilter): Observable<StudentAttendance[]> {
    return this.http.post<StudentAttendance[]>(`${this.apiUrl}/attendances/students`, filter);
  }

  // recordAttendance(request: BulkAttendanceRequest): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/attendances/record`, request);
  // }
  recordAttendance(request: BulkAttendanceRequest) {
  return this.http.post('http://localhost:8080/api/attendances/record', request, { responseType: 'text' });
}


  updateAttendance(request: BulkAttendanceRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/attendances/update`, request);
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Course } from '../model/course.model';


@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.apiUrl);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  getCourseByCode(courseCode: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/code/${courseCode}`);
  }

  createCourse(course: Course): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, course);
  }

  updateCourse(id: number, course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, course);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getCoursesByDepartment(departmentId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/department/${departmentId}`);
  }

  getCoursesByFaculty(facultyId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/faculty/${facultyId}`);
  }

  getCoursesByStudent(studentId: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/student/${studentId}`);
  }

  checkCourseCodeExists(courseCode: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/${courseCode}`);
  }

  addFacultyToCourse(courseId: number, facultyId: number): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/${courseId}/faculties/${facultyId}`, {});
  }

  removeFacultyFromCourse(courseId: number, facultyId: number): Observable<Course> {
    return this.http.delete<Course>(`${this.apiUrl}/${courseId}/faculties/${facultyId}`);
  }

  updateCourseFaculties(courseId: number, facultyIds: number[]): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${courseId}/faculties`, facultyIds);
  }

  countCourses(): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/count`);
}

}
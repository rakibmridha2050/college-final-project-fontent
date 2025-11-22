import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { Faculty } from '../model/faculty.model';


@Injectable({
  providedIn: 'root'
})
export class FacultyService {
  private apiUrl = `${environment.apiUrl}/faculty`;

  constructor(private http: HttpClient) { }

  getAllFaculty(): Observable<Faculty[]> {
    return this.http.get<Faculty[]>(this.apiUrl);
  }

  getFacultyById(id: number): Observable<Faculty> {
    return this.http.get<Faculty>(`${this.apiUrl}/${id}`);
  }

  createFaculty(faculty: Faculty): Observable<Faculty> {
    return this.http.post<Faculty>(this.apiUrl, faculty);
  }

  updateFaculty(id: number, faculty: Faculty): Observable<Faculty> {
    return this.http.post<Faculty>(this.apiUrl, faculty);
  }

  deleteFaculty(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getFacultyByDepartment(departmentId: number): Observable<Faculty[]> {
    return this.http.get<Faculty[]>(`${this.apiUrl}/department/${departmentId}`);
  }

  countFaculty(): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/count`);
}

}
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { StudentDTO, StudentResponseDTO } from '../model/student.model';



@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private apiUrl = `${environment.apiUrl}/students`;

  constructor(private http: HttpClient) { }

  // Student CRUD operations
  createStudent(studentDTO: StudentDTO): Observable<StudentResponseDTO> {
    return this.http.post<StudentResponseDTO>(this.apiUrl, studentDTO);
  }

    getStudentsBySectionId(sectionId: number): Observable<StudentResponseDTO[]> {
    return this.http.get<StudentResponseDTO[]>(`${this.apiUrl}/section/${sectionId}`);
  }

  getAllStudents(): Observable<StudentResponseDTO[]> {
    return this.http.get<StudentResponseDTO[]>(this.apiUrl);
  }

  getStudentById(id: number): Observable<StudentResponseDTO> {
    return this.http.get<StudentResponseDTO>(`${this.apiUrl}/${id}`);
  }

  getStudentByStudentId(studentId: string): Observable<StudentResponseDTO> {
    return this.http.get<StudentResponseDTO>(`${this.apiUrl}/student-id/${studentId}`);
  }

  updateStudent(id: number, studentDTO: StudentDTO): Observable<StudentResponseDTO> {
    return this.http.put<StudentResponseDTO>(`${this.apiUrl}/${id}`, studentDTO);
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  softDeleteStudent(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/soft-delete`, {});
  }

  // Filter and search operations
  getStudentsByDepartment(departmentId: number): Observable<StudentResponseDTO[]> {
    return this.http.get<StudentResponseDTO[]>(`${this.apiUrl}/department/${departmentId}`);
  }

  getStudentsByProgram(program: string): Observable<StudentResponseDTO[]> {
    return this.http.get<StudentResponseDTO[]>(`${this.apiUrl}/program/${program}`);
  }

  getStudentsBySemester(semester: number): Observable<StudentResponseDTO[]> {
    return this.http.get<StudentResponseDTO[]>(`${this.apiUrl}/semester/${semester}`);
  }

  searchStudentsByName(name: string): Observable<StudentResponseDTO[]> {
    return this.http.get<StudentResponseDTO[]>(`${this.apiUrl}/search`, {
      params: new HttpParams().set('name', name)
    });
  }

  getActiveStudents(): Observable<StudentResponseDTO[]> {
    return this.http.get<StudentResponseDTO[]>(`${this.apiUrl}/active`);
  }

  // Course management
  addCoursesToStudent(studentId: number, courseIds: number[]): Observable<StudentResponseDTO> {
    return this.http.post<StudentResponseDTO>(`${this.apiUrl}/${studentId}/courses`, courseIds);
  }

  removeCoursesFromStudent(studentId: number, courseIds: number[]): Observable<StudentResponseDTO> {
    return this.http.delete<StudentResponseDTO>(`${this.apiUrl}/${studentId}/courses`, {
      body: courseIds
    });
  }

  countStudents(): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}/count`);
}

}
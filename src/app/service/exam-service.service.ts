import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Course } from '../model/course.model';
import { ExamCreateDTO, Exam, ExamUpdateDTO, BulkExamResultDTO, ExamResultCreateDTO, ExamResult, ExamResultSummary } from '../model/exam.model';
import { Student } from '../model/student.model';

@Injectable({
  providedIn: 'root'
})
export class ExamServiceService {

   private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const facultyId = localStorage.getItem('facultyId') || '1'; // Fallback for demo
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Faculty-Id': facultyId
    });
  }

  // Exam endpoints
  createExam(examData: ExamCreateDTO): Observable<Exam> {
    return this.http.post<Exam>(`${this.apiUrl}/exams`, examData, { headers: this.getHeaders() });
  }

  updateExam(examId: number, examData: ExamUpdateDTO): Observable<Exam> {
    return this.http.put<Exam>(`${this.apiUrl}/exams/${examId}`, examData, { headers: this.getHeaders() });
  }

  getFacultyExams(): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.apiUrl}/exams/faculty`, { headers: this.getHeaders() });
  }

  getExamById(examId: number): Observable<Exam> {
    return this.http.get<Exam>(`${this.apiUrl}/exams/${examId}`, { headers: this.getHeaders() });
  }

  getCourseExams(courseId: number): Observable<Exam[]> {
    return this.http.get<Exam[]>(`${this.apiUrl}/exams/course/${courseId}`);
  }

  deleteExam(examId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/exams/${examId}`, { headers: this.getHeaders() });
  }

  publishExam(examId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/exams/${examId}/publish`, {}, { headers: this.getHeaders() });
  }

  // Exam Result endpoints
  createBulkResults(bulkData: BulkExamResultDTO): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/exam-results/bulk`, bulkData, { headers: this.getHeaders() });
  }

  updateResult(resultId: number, resultData: ExamResultCreateDTO): Observable<ExamResult> {
    return this.http.put<ExamResult>(`${this.apiUrl}/exam-results/${resultId}`, resultData, { headers: this.getHeaders() });
  }

  getResultsByExam(examId: number): Observable<ExamResult[]> {
    return this.http.get<ExamResult[]>(`${this.apiUrl}/exam-results/exam/${examId}`, { headers: this.getHeaders() });
  }

  getResultsByStudent(studentId: number): Observable<ExamResult[]> {
    return this.http.get<ExamResult[]>(`${this.apiUrl}/exam-results/student/${studentId}`);
  }

  getExamSummary(examId: number): Observable<ExamResultSummary> {
    return this.http.get<ExamResultSummary>(`${this.apiUrl}/exam-results/${examId}/summary`, { headers: this.getHeaders() });
  }

  // Utility endpoints (you might have separate services for these)
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/courses`);
  }

  getStudentsByCourse(courseId: number): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/courses/${courseId}/students`);
  }
}

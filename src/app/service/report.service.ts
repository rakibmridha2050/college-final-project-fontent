import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private baseUrl = 'http://localhost:8080/api/reports'; // adjust if backend runs elsewhere

  constructor(private http: HttpClient) {}

  /**
   * Download all payments report in a specific format (pdf, xlsx, docx, etc.)
   */
  downloadPaymentsReport(format: string): Observable<Blob> {
    const url = `${this.baseUrl}/payments/${format}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  /**
   * Download single payslip report by paymentId and format
   */
  downloadPayslip(paymentId: number, format: string): Observable<Blob> {
    const url = `${this.baseUrl}/payslip/${paymentId}/${format}`;
    return this.http.get(url, { responseType: 'blob' });
  }

    downloadStudentExamResultsPdf(studentId: number): Observable<Blob> {
    const url = `${this.baseUrl}/results/${studentId}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}

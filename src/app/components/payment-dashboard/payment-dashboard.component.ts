import { Component } from '@angular/core';
import { Payment } from 'src/app/model/payment.models';
import { FeeStructureService } from 'src/app/service/fee-structure.service';
import { ReportService } from 'src/app/service/report.service';


@Component({
  selector: 'app-payment-dashboard',
  templateUrl: './payment-dashboard.component.html',
  styleUrls: ['./payment-dashboard.component.scss']
})
export class PaymentDashboardComponent {
printReceipt(arg0: any) {
throw new Error('Method not implemented.');
}

   showForm = false;
 payments: Payment[] = [];
  newPayment: Payment = {
    studentId: 0,
    amount: 0,
    paymentMode: '',
    remarks: ''
  };

  loading = false;
  errorMessage = '';

  constructor(private paymentService: FeeStructureService , private reportService:ReportService) {}

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading = true;
    this.paymentService.getAllPayments().subscribe({
      next: (data) => {
        this.payments = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Failed to load payments';
        this.loading = false;
      }
    });
  }

  createPayment(): void {
    if (!this.newPayment.studentId || !this.newPayment.amount || !this.newPayment.paymentMode) {
      alert('Please fill all required fields.');
      return;
    }

    this.paymentService.createPayment(this.newPayment).subscribe({
      next: (data) => {
        this.payments.push(data);
        this.newPayment = { studentId: 0, amount: 0, paymentMode: '', remarks: '' };
      },
      error: (err) => {
        console.error(err);
        alert('Error creating payment.');
      }
    });
  }

  deletePayment(id?: number): void {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this payment?')) return;

    this.paymentService.deletePayment(id).subscribe({
      next: () => {
        this.payments = this.payments.filter(p => p.id !== id);
      },
      error: (err) => console.error(err)
    });
  }

    getPaymentsByStudent(studentId: number): void {
    if (!studentId) {
      alert('Please enter a valid Student ID.');
      return;
    }
    this.loading = true;
    this.paymentService.getPaymentsByStudent(studentId).subscribe({
      next: (data) => {
        this.payments = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching student payments', err);
        this.loading = false;
      }
    });
    }
  
    toggleForm(): void {
    this.showForm = !this.showForm;
  }

    downloadAll(format: string): void {
    this.reportService.downloadPaymentsReport(format).subscribe({
      next: (data: Blob) => this.downloadFile(data, `payments_report.${format}`),
      error: (err) => console.error('Error downloading report:', err)
    });
  }

  // ✅ Download single payslip by paymentId
  downloadPayslip(paymentId: number, format: string): void {
    this.reportService.downloadPayslip(paymentId, format).subscribe({
      next: (data: Blob) => this.downloadFile(data, `payslip_${paymentId}.${format}`),
      error: (err) => console.error('Error downloading payslip:', err)
    });
  }

  // Helper to trigger file download
  private downloadFile(data: Blob, filename: string): void {
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }





}

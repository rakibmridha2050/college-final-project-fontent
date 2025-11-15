import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ExamResult, ExamResultSummary, BulkExamResultDTO } from 'src/app/model/exam.model';
import { Student } from 'src/app/model/student.model';
import { ExamServiceService } from 'src/app/service/exam-service.service';

@Component({
  selector: 'app-exam-results',
  templateUrl: './exam-results.component.html',
  styleUrls: ['./exam-results.component.scss']
})
export class ExamResultsComponent implements OnInit {
  examId: number;
  results: ExamResult[] = [];
  students: Student[] = [];
  summary: ExamResultSummary | null = null;
  loading = false;
  submitting = false;
  error = '';
  showBulkForm = false;

  bulkForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private examService: ExamServiceService,
    private fb: FormBuilder
  ) {
    this.examId = +this.route.snapshot.paramMap.get('id')!;
    this.bulkForm = this.fb.group({
      results: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadResults();
    this.loadSummary();
  }

  loadResults(): void {
    this.loading = true;
    this.examService.getResultsByExam(this.examId).subscribe({
      next: (results) => {
        this.results = results;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load results';
        this.loading = false;
        console.error('Error loading results:', error);
      }
    });
  }

  loadSummary(): void {
    this.examService.getExamSummary(this.examId).subscribe({
      next: (summary) => {
        this.summary = summary;
      },
      error: (error) => {
        console.error('Error loading summary:', error);
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    const classes: { [key: string]: string } = {
      PASSED: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      ABSENT: 'bg-yellow-100 text-yellow-800',
      PENDING: 'bg-gray-100 text-gray-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getGradeBadgeClass(grade: string): string {
    const classes: { [key: string]: string } = {
      'A+': 'bg-green-100 text-green-800',
      'A': 'bg-green-100 text-green-800',
      'A-': 'bg-green-100 text-green-800',
      'B+': 'bg-blue-100 text-blue-800',
      'B': 'bg-blue-100 text-blue-800',
      'B-': 'bg-blue-100 text-blue-800',
      'C+': 'bg-yellow-100 text-yellow-800',
      'C': 'bg-yellow-100 text-yellow-800',
      'D': 'bg-orange-100 text-orange-800',
      'F': 'bg-red-100 text-red-800'
    };
    return classes[grade] || 'bg-gray-100 text-gray-800';
  }

  toggleBulkForm(): void {
    this.showBulkForm = !this.showBulkForm;
    if (this.showBulkForm) {
      this.loadStudents();
    }
  }

  // loadStudents(): void {
  //   // You might need to get courseId from the exam first
  //   // For now, we'll assume you have a way to get students
  //   this.examService.getStudentsByCourse(1).subscribe({
  //     next: (students) => {
  //       this.students = students;
  //       this.initializeBulkForm();
  //     },
  //     error: (error) => {
  //       console.error('Error loading students:', error);
  //     }
  //   });
  // }


  loadStudents(): void {
    // For now, use mock data or get students from another source
    // You might need to get the course ID from the exam first
    this.examService.getExamById(this.examId).subscribe({
      next: (exam) => {
        // Now we have the course ID from the exam
        this.examService.getStudentsByCourse(exam.courseId).subscribe({
          next: (students) => {
            this.students = students;
            this.initializeBulkForm();
          },
          error: (error) => {
            console.error('Error loading students:', error);
            // Fallback to empty array
            this.students = [];
            this.initializeBulkForm();
          }
        });
      },
      error: (error) => {
        console.error('Error loading exam:', error);
        this.students = [];
        this.initializeBulkForm();
      }
    });
  }
  initializeBulkForm(): void {
    const resultForms = this.students.map(student =>
      this.fb.group({
        studentId: [student.id],
        marksObtained: [0, [Validators.required, Validators.min(0)]],
        remarks: ['']
      })
    );
    this.bulkForm = this.fb.group({
      results: this.fb.array(resultForms)
    });
  }

  get resultForms() {
    return (this.bulkForm.get('results') as any).controls;
  }

  onSubmitBulk(): void {
    if (this.bulkForm.valid) {
      this.submitting = true;
      const bulkData: BulkExamResultDTO = {
        examId: this.examId,
        results: this.bulkForm.value.results
      };

      this.examService.createBulkResults(bulkData).subscribe({
        next: () => {
          this.submitting = false;
          this.showBulkForm = false;
          this.loadResults();
          this.loadSummary();
        },
        error: (error) => {
          this.error = error.error?.message || 'Failed to save results';
          this.submitting = false;
          console.error('Error saving results:', error);
        }
      });
    }
  }
}
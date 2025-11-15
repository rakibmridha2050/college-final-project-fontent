import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Course } from 'src/app/model/course.model';
import { ExamServiceService } from 'src/app/service/exam-service.service';

@Component({
  selector: 'app-exam-create',
  templateUrl: './exam-create.component.html',
  styleUrls: ['./exam-create.component.scss']
})
export class ExamCreateComponent implements OnInit {
  examForm: FormGroup;
  courses: Course[] = [];
  loading = false;
  submitting = false;
  error = '';

  examTypes = [
    { value: 'MIDTERM', label: 'Midterm Exam' },
    { value: 'FINAL', label: 'Final Exam' },
    { value: 'QUIZ', label: 'Quiz' },
    { value: 'ASSIGNMENT', label: 'Assignment' }
  ];

  constructor(
    private fb: FormBuilder,
    private examService: ExamServiceService,
    private router: Router
  ) {
    this.examForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadCourses();
  }

  createForm(): FormGroup {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return this.fb.group({
      examTitle: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      examDate: [tomorrow.toISOString().slice(0, 16), Validators.required],
      duration: [60, [Validators.required, Validators.min(1)]],
      totalMarks: [100, [Validators.required, Validators.min(1)]],
      examType: ['MIDTERM', Validators.required],
      courseId: ['', Validators.required]
    });
  }

  loadCourses(): void {
    this.loading = true;
    this.examService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load courses';
        this.loading = false;
        console.error('Error loading courses:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.examForm.valid) {
      this.submitting = true;
      const examData = this.examForm.value;
      
      // Convert date to proper format
      examData.examDate = new Date(examData.examDate).toISOString();

      this.examService.createExam(examData).subscribe({
        next: (exam) => {
          this.submitting = false;
          this.router.navigate(['/admin/exams']);
        },
        error: (error) => {
          this.error = error.error?.message || 'Failed to create exam';
          this.submitting = false;
          console.error('Error creating exam:', error);
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  markFormGroupTouched(): void {
    Object.keys(this.examForm.controls).forEach(key => {
      this.examForm.get(key)?.markAsTouched();
    });
  }

  get f() { return this.examForm.controls; }
}

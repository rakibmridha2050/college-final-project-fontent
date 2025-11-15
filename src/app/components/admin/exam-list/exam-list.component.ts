import { Component, OnInit } from '@angular/core';
import { Exam } from 'src/app/model/exam.model';
import { ExamServiceService } from 'src/app/service/exam-service.service';

@Component({
  selector: 'app-exam-list',
  templateUrl: './exam-list.component.html',
  styleUrls: ['./exam-list.component.scss']
})
export class ExamListComponent implements OnInit {
  exams: Exam[] = [];
  loading = false;
  error = '';

  constructor(private examService: ExamServiceService) {}

  ngOnInit(): void {
    this.loadExams();
  }

  loadExams(): void {
    this.loading = true;
    this.examService.getFacultyExams().subscribe({
      next: (exams) => {
        this.exams = exams;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load exams';
        this.loading = false;
        console.error('Error loading exams:', error);
      }
    });
  }

  deleteExam(examId: number): void {
    if (confirm('Are you sure you want to delete this exam?')) {
      this.examService.deleteExam(examId).subscribe({
        next: () => {
          this.exams = this.exams.filter(exam => exam.id !== examId);
        },
        error: (error) => {
          alert('Failed to delete exam');
          console.error('Error deleting exam:', error);
        }
      });
    }
  }

  publishExam(examId: number): void {
    this.examService.publishExam(examId).subscribe({
      next: () => {
        const exam = this.exams.find(e => e.id === examId);
        if (exam) {
          exam.isPublished = true;
        }
      },
      error: (error) => {
        alert('Failed to publish exam');
        console.error('Error publishing exam:', error);
      }
    });
  }

  getStatusBadgeClass(isPublished: boolean): string {
    return isPublished 
      ? 'bg-green-100 text-green-800'
      : 'bg-yellow-100 text-yellow-800';
  }

  getTypeBadgeClass(type: string): string {
    const classes: { [key: string]: string } = {
      MIDTERM: 'bg-blue-100 text-blue-800',
      FINAL: 'bg-purple-100 text-purple-800',
      QUIZ: 'bg-green-100 text-green-800',
      ASSIGNMENT: 'bg-orange-100 text-orange-800'
    };
    return classes[type] || 'bg-gray-100 text-gray-800';
  }
}

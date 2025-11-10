import { Component } from '@angular/core';

interface Course {
  id: number;
  name: string;
  instructor: string;
  progress: number;
  nextAssignment: string;
  dueDate: string;
  color: string;
  grade?: string;
}

interface Assignment {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  status: 'completed' | 'pending' | 'overdue';
  priority: 'high' | 'medium' | 'low';
  submitted: boolean;
}

interface Grade {
  course: string;
  assignment: string;
  score: number;
  maxScore: number;
  percentage: number;
  feedback: string;
}

interface Schedule {
  time: string;
  course: string;
  type: 'lecture' | 'lab' | 'assignment' | 'exam';
  location: string;
}


@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.scss']
})
export class StudentDashboardComponent {
  sidebarOpen = true;
  currentView = 'dashboard';

  studentInfo = {
    name: 'Alex Johnson',
    studentId: 'S123456',
    email: 'alex.johnson@university.edu',
    semester: 'Fall 2024',
    major: 'Computer Science',
    gpa: 3.75
  };

  courses: Course[] = [
    { id: 1, name: 'Advanced Mathematics', instructor: 'Dr. Smith', progress: 75, nextAssignment: 'Calculus Quiz', dueDate: '2024-12-20', color: 'bg-blue-500', grade: 'A-' },
    { id: 2, name: 'Computer Programming', instructor: 'Prof. Wilson', progress: 60, nextAssignment: 'Final Project', dueDate: '2024-12-25', color: 'bg-green-500', grade: 'B+' },
    { id: 3, name: 'Physics Fundamentals', instructor: 'Dr. Brown', progress: 85, nextAssignment: 'Lab Report', dueDate: '2024-12-18', color: 'bg-purple-500', grade: 'A' },
    { id: 4, name: 'English Literature', instructor: 'Prof. Davis', progress: 45, nextAssignment: 'Essay Submission', dueDate: '2024-12-22', color: 'bg-yellow-500', grade: 'B' }
  ];

  assignments: Assignment[] = [
    { id: 1, title: 'Linear Algebra Homework', course: 'Advanced Mathematics', dueDate: '2024-12-15', status: 'completed', priority: 'high', submitted: true },
    { id: 2, title: 'Programming Project', course: 'Computer Programming', dueDate: '2024-12-25', status: 'pending', priority: 'high', submitted: false },
    { id: 3, title: 'Physics Lab Report', course: 'Physics Fundamentals', dueDate: '2024-12-18', status: 'pending', priority: 'medium', submitted: false },
    { id: 4, title: 'Literature Essay', course: 'English Literature', dueDate: '2024-12-22', status: 'pending', priority: 'medium', submitted: false },
    { id: 5, title: 'Math Quiz', course: 'Advanced Mathematics', dueDate: '2024-12-10', status: 'overdue', priority: 'low', submitted: false }
  ];

  grades: Grade[] = [
    { course: 'Advanced Mathematics', assignment: 'Midterm Exam', score: 85, maxScore: 100, percentage: 85, feedback: 'Good understanding of concepts' },
    { course: 'Computer Programming', assignment: 'Project 1', score: 92, maxScore: 100, percentage: 92, feedback: 'Excellent implementation' },
    { course: 'Physics Fundamentals', assignment: 'Lab 3', score: 78, maxScore: 100, percentage: 78, feedback: 'Need more detailed analysis' },
    { course: 'English Literature', assignment: 'Essay 1', score: 88, maxScore: 100, percentage: 88, feedback: 'Well written and structured' }
  ];

  schedule: Schedule[] = [
    { time: '09:00 - 10:30', course: 'Advanced Mathematics', type: 'lecture', location: 'Room 101' },
    { time: '11:00 - 12:30', course: 'Computer Programming', type: 'lab', location: 'Lab A' },
    { time: '14:00 - 15:30', course: 'Physics Fundamentals', type: 'lecture', location: 'Room 203' },
    { time: '16:00 - 17:00', course: 'Study Group', type: 'assignment', location: 'Library' }
  ];

  upcomingEvents = [
    { title: 'Final Exams Week', date: '2024-12-30', type: 'exam' },
    { title: 'Project Submission', date: '2024-12-25', type: 'assignment' },
    { title: 'Semester Break', date: '2025-01-15', type: 'holiday' }
  ];

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  setView(view: string) {
    this.currentView = view;
  }

  getStatusColor(status: string): string {
    const colors = {
      'completed': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'overdue': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors];
  }

  getPriorityColor(priority: string): string {
    const colors = {
      'high': 'bg-red-100 text-red-800',
      'medium': 'bg-orange-100 text-orange-800',
      'low': 'bg-blue-100 text-blue-800'
    };
    return colors[priority as keyof typeof colors];
  }

  getGradeColor(grade: string): string {
    if (!grade) return 'bg-gray-100 text-gray-800';
    
    const numericGrade = parseFloat(grade);
    if (numericGrade >= 3.7) return 'bg-green-100 text-green-800';
    if (numericGrade >= 3.0) return 'bg-blue-100 text-blue-800';
    if (numericGrade >= 2.0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  }

  getDaysUntil(dueDate: string): number {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

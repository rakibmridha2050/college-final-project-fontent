import { Component } from '@angular/core';

interface Student {
  id: number;
  name: string;
  email: string;
  grade: string;
  attendance: number;
  performance: 'Excellent' | 'Good' | 'Average' | 'Poor';
}

interface Course {
  id: number;
  name: string;
  students: number;
  progress: number;
  color: string;
}

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss']
})
export class TeacherDashboardComponent {
  sidebarOpen = true;
  currentView = 'dashboard';

  courses: Course[] = [
    { id: 1, name: 'Mathematics', students: 32, progress: 75, color: 'bg-blue-500' },
    { id: 2, name: 'Science', students: 28, progress: 60, color: 'bg-green-500' },
    { id: 3, name: 'English', students: 35, progress: 85, color: 'bg-purple-500' },
    { id: 4, name: 'History', students: 25, progress: 45, color: 'bg-yellow-500' }
  ];

  students: Student[] = [
    { id: 1, name: 'John Smith', email: 'john@school.com', grade: 'A', attendance: 95, performance: 'Excellent' },
    { id: 2, name: 'Sarah Johnson', email: 'sarah@school.com', grade: 'B+', attendance: 88, performance: 'Good' },
    { id: 3, name: 'Mike Wilson', email: 'mike@school.com', grade: 'C', attendance: 75, performance: 'Average' },
    { id: 4, name: 'Emily Davis', email: 'emily@school.com', grade: 'A-', attendance: 92, performance: 'Excellent' },
    { id: 5, name: 'David Brown', email: 'david@school.com', grade: 'B', attendance: 80, performance: 'Good' }
  ];

  stats = {
    totalStudents: 120,
    totalCourses: 8,
    averageGrade: 'B+',
    attendanceRate: 87
  };

  recentActivities = [
    { type: 'assignment', message: 'New assignment posted - Algebra Homework', time: '2 hours ago' },
    { type: 'grade', message: 'Graded Science quizzes', time: '4 hours ago' },
    { type: 'announcement', message: 'Class canceled tomorrow', time: '1 day ago' },
    { type: 'message', message: 'Parent meeting scheduled', time: '2 days ago' }
  ];

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  setView(view: string) {
    this.currentView = view;
  }

  getPerformanceColor(performance: string): string {
    const colors = {
      'Excellent': 'bg-green-100 text-green-800',
      'Good': 'bg-blue-100 text-blue-800',
      'Average': 'bg-yellow-100 text-yellow-800',
      'Poor': 'bg-red-100 text-red-800'
    };
    return colors[performance as keyof typeof colors];
  }
}

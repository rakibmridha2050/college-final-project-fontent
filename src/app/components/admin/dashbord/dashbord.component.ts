import { Component } from '@angular/core';
import { CourseService } from 'src/app/service/course.service';
import { FacultyService } from 'src/app/service/faculty.service';
import { StudentService } from 'src/app/service/student.service';

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.scss']
})
export class DashbordComponent {

  studentCount: number = 0;
  facultyCount: number = 0;
  courseCount: number = 0;

  constructor(private studentService: StudentService,
              private facultyService: FacultyService,
               private courseService: CourseService

  ) {}

  ngOnInit(): void {
    this.loadStudentCount();
    this.loadFacultyCount();
    this.loadCourseCount();
  }

  loadStudentCount(): void {
    this.studentService.countStudents().subscribe({
      next: (count) => {
        this.studentCount = count;
      },
      error: (err) => {
        console.error('Error fetching student count:', err);
      }
    });
  }

  loadFacultyCount(): void {
  this.facultyService.countFaculty().subscribe({
    next: (count) => {
      this.facultyCount = count;
    },
    error: (err) => {
      console.error("Error loading teacher count", err);
    }
  });
}


loadCourseCount(): void {
  this.courseService.countCourses().subscribe({
    next: (count) => {
      this.courseCount = count;
    },
    error: (err) => {
      console.error("Error loading course count", err);
    }
  });
}

}

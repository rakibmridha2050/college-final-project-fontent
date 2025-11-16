import { Component } from '@angular/core';
import { AttendanceStatus } from 'src/app/model/attendance-status.enum';
import { AttendanceRequestDTO } from 'src/app/model/attendance.model';

import { Classes } from 'src/app/model/classes.model';
import { Course } from 'src/app/model/course.model';
import { Department } from 'src/app/model/department.model';
import { Section } from 'src/app/model/section.model';
import { Student } from 'src/app/model/student.model';
import { AttendanceService } from 'src/app/service/attendance.service';
import { ClassesServiceService } from 'src/app/service/classes-service.service';
import { CourseService } from 'src/app/service/course.service';
import { DepartmentService } from 'src/app/service/department.service';
import { SectionService } from 'src/app/service/section.service';
import { StudentService } from 'src/app/service/student.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent {
  
  departments: Department[] = [];
  classes: Classes[] = [];
  sections: Section[] = [];
  students: Student[] = [];
  courses: Course[] = [];

  selectedDepartmentId: number | null = null;
  selectedClassId: number | null = null;
  selectedSectionId: number | null = null;
  selectedCourseId: number | null = null;

  selectedDate: string = new Date().toISOString().split('T')[0];
  periodNumber: number = 1;

  loading = false;
  successMessage = '';
  errorMessage = '';

  AttendanceStatus = AttendanceStatus;

  constructor(
    private departmentService: DepartmentService,
    private classService: ClassesServiceService,
    private sectionService: SectionService,
    private studentService: StudentService,
    private attendanceService: AttendanceService,
    private courseService: CourseService
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
    this.loadCourses();
  }

  loadCourses() {
    this.courseService.getAllCourses().subscribe({
      next: (courses) => this.courses = courses,
      error: () => this.errorMessage = "Failed to load courses"
    });
  }

  loadDepartments() {
    this.loading = true;
    this.departmentService.getAllDepartments().subscribe({
      next: (depts) => { this.departments = depts; this.loading = false; },
      error: () => { this.errorMessage = 'Failed to load departments'; this.loading = false; }
    });
  }

  onDepartmentChange() {
    this.classes = [];
    this.sections = [];
    this.students = [];
    this.selectedClassId = null;
    this.selectedSectionId = null;

    if (!this.selectedDepartmentId) return;

    this.loading = true;
    this.classService.getClassesByDepartment(this.selectedDepartmentId).subscribe({
      next: (classes) => { this.classes = classes; this.loading = false; },
      error: () => { this.errorMessage = 'Failed to load classes'; this.loading = false; }
    });
  }

  onClassChange() {
    this.sections = [];
    this.students = [];
    this.selectedSectionId = null;

    if (!this.selectedClassId) return;

    this.loading = true;
    this.sectionService.getSectionsByClassId(this.selectedClassId).subscribe({
      next: (sections) => { this.sections = sections; this.loading = false; },
      error: () => { this.errorMessage = 'Failed to load sections'; this.loading = false; }
    });
  }

  onSectionChange() {
    this.students = [];

    if (!this.selectedSectionId) return;

    this.loading = true;
    this.studentService.getStudentsBySectionId(this.selectedSectionId).subscribe({
      next: (students) => {
        this.students = students.map(s => ({ ...s, status: undefined }));
        this.loading = false;
      },
      error: () => { this.errorMessage = 'Failed to load students'; this.loading = false; }
    });
  }

  // FIXED: studentId is now number, not string
  markAttendance(studentId: number, status: AttendanceStatus) {
    this.students = this.students.map(student =>
      student.id === studentId ? { ...student, status } : student
    );
  }

  getMarkedStudentsCount(): number {
    return this.students.filter(s => s.status !== undefined).length;
  }

  // FIXED: studentId is number
  getAttendanceStatus(studentId: number): AttendanceStatus | undefined {
    return this.students.find(s => s.id === studentId)?.status;
  }

  submitAttendance() {
    if (!this.selectedCourseId || !this.selectedSectionId) {
      this.errorMessage = 'Please select course and section';
      return;
    }

    const studentsWithAttendance = this.students.filter(s => s.status !== undefined);

    if (studentsWithAttendance.length === 0) {
      this.errorMessage = 'Please mark attendance for at least one student';
      return;
    }

    const attendanceRequests: AttendanceRequestDTO[] = studentsWithAttendance.map(student => ({
      // FINAL FIX: studentId always number
      studentId: student.id!,
      courseId: this.selectedCourseId!,
      sectionId: this.selectedSectionId!,
      attendanceDate: this.selectedDate,
      status: student.status as string,
      remarks: '',
      recordedBy: 'faculty_1',
      periodNumber: this.periodNumber
    }));

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.attendanceService.createBulkAttendance(attendanceRequests).subscribe({
      next: () => {
        this.successMessage = `✔ Attendance saved for ${studentsWithAttendance.length} students!`;
        this.loading = false;
        setTimeout(() => this.resetForm(), 3000);
      },
      error: () => {
        this.errorMessage = 'Error submitting attendance.';
        this.loading = false;
      }
    });
  }

  resetForm() {
    this.students = this.students.map(s => ({ ...s, status: undefined }));
    this.successMessage = '';
    this.errorMessage = '';
  }

  canSubmitAttendance(): boolean {
    return this.selectedCourseId !== null &&
           this.selectedSectionId !== null &&
           this.students.some(s => s.status !== undefined);
  }

  getAttendanceStats() {
    return {
      total: this.students.length,
      present: this.students.filter(s => s.status === AttendanceStatus.PRESENT).length,
      absent: this.students.filter(s => s.status === AttendanceStatus.ABSENT).length,
      late: this.students.filter(s => s.status === AttendanceStatus.LATE).length
    };
  }
}

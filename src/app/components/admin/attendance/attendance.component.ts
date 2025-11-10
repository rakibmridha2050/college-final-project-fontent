import { Component } from '@angular/core';
import { AttendanceStatus } from 'src/app/model/attendance-status.enum';
import { AttendanceRequestDTO } from 'src/app/model/attendance.model';

import { Classes } from 'src/app/model/classes.model';
import { Department } from 'src/app/model/department.model';
import { Section } from 'src/app/model/section.model';
import { Student } from 'src/app/model/student.model';
import { AttendanceService } from 'src/app/service/attendance.service';
import { ClassesServiceService } from 'src/app/service/classes-service.service';
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

  // Add course selection
  courses = [
    { id: 1, name: 'Mathematics', code: 'MATH101' },
    { id: 2, name: 'Physics', code: 'PHYS101' },
    { id: 3, name: 'Computer Science', code: 'CS101' }
  ];

  selectedDepartmentId: number | null = null;
  selectedClassId: number | null = null;
  selectedSectionId: number | null = null;
  selectedCourseId: number | null = null;
  selectedDate: string = new Date().toISOString().split('T')[0];
  periodNumber: number = 1;

  loading = false;
  successMessage = '';
  errorMessage = '';

  // For better type safety
  AttendanceStatus = AttendanceStatus;

  constructor(
    private departmentService: DepartmentService,
    private classService: ClassesServiceService,
    private sectionService: SectionService,
    private studentService: StudentService,
    private attendanceService: AttendanceService
  ) { }

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments() {
    this.loading = true;
    this.departmentService.getAllDepartments().subscribe({
      next: (depts) => {
        this.departments = depts;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading departments:', err);
        this.errorMessage = 'Failed to load departments';
        this.loading = false;
      }
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
      next: (classes) => {
        this.classes = classes;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading classes:', err);
        this.errorMessage = 'Failed to load classes';
        this.loading = false;
      }
    });
  }

  onClassChange() {
    this.sections = [];
    this.students = [];
    this.selectedSectionId = null;

    if (!this.selectedClassId) return;

    this.loading = true;
    this.sectionService.getSectionsByClassId(this.selectedClassId).subscribe({
      next: (sections) => {
        this.sections = sections;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading sections:', err);
        this.errorMessage = 'Failed to load sections';
        this.loading = false;
      }
    });
  }

  onSectionChange() {
    this.students = [];

    if (!this.selectedSectionId) return;

    this.loading = true;
    this.studentService.getStudentsBySectionId(this.selectedSectionId).subscribe({
      next: (students) => {
        // Initialize students with no attendance status
        this.students = students.map(student => ({
          ...student,
          status: undefined
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading students:', err);
        this.errorMessage = 'Failed to load students';
        this.loading = false;
      }
    });
  }

  markAttendance(studentId: string, status: AttendanceStatus) {
    this.students = this.students.map(student => 
      student.id === Number(studentId) ? { ...student, status } : student
    );
  }
  getMarkedStudentsCount(): number {
  return this.students.filter(s => s.status !== undefined && s.status !== null).length;
}

  getAttendanceStatus(studentId: string): AttendanceStatus | undefined {
    const student = this.students.find(s => s.id === Number(studentId));
    return student?.status;
  }
submitAttendance() {
  // Validate required fields
  if (!this.selectedCourseId || !this.selectedSectionId) {
    this.errorMessage = 'Please select course and section';
    return;
  }

  // Filter students with attendance marked
  const studentsWithAttendance = this.students.filter(s => s.status !== undefined && s.status !== null);
  
  if (studentsWithAttendance.length === 0) {
    this.errorMessage = 'Please mark attendance for at least one student';
    return;
  }

  console.log('Students with attendance:', studentsWithAttendance);
  console.log('Selected course ID:', this.selectedCourseId);
  console.log('Selected section ID:', this.selectedSectionId);
  console.log('Selected date:', this.selectedDate);

  // Prepare attendance requests with detailed logging
  const attendanceRequests: AttendanceRequestDTO[] = studentsWithAttendance.map(student => {
    const request: AttendanceRequestDTO = {
      studentId : Number(student.studentId),
      courseId: this.selectedCourseId!,
      sectionId: this.selectedSectionId!,
      attendanceDate: this.selectedDate,
      status: student.status as string, // Convert to string if needed
      remarks: '',
      recordedBy: 'faculty_1',
      periodNumber: this.periodNumber
    };
    
    console.log('Created request for student:', student.id, request);
    return request;
  });

  console.log('All attendance requests:', attendanceRequests);

  this.loading = true;
  this.errorMessage = '';
  this.successMessage = '';

  this.attendanceService.createBulkAttendance(attendanceRequests).subscribe({
    next: (response) => {
      console.log('Success response:', response);
      this.successMessage = `✅ Attendance saved successfully for ${studentsWithAttendance.length} students!`;
      this.loading = false;
      
      // Reset form after successful submission
      setTimeout(() => {
        this.resetForm();
      }, 3000);
    },
    error: (err) => {
      console.error('Full error object:', err);
      console.error('Error status:', err.status);
      console.error('Error message:', err.message);
      console.error('Error response:', err.error);
      
      this.errorMessage = '❌ Error submitting attendance. Please check console for details.';
      this.loading = false;
    }
  });
  }

  resetForm() {
    this.students = this.students.map(student => ({ ...student, status: undefined }));
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Helper method to check if form is ready for submission
  canSubmitAttendance(): boolean {
    return this.selectedCourseId !== null && 
           this.selectedSectionId !== null && 
           this.students.some(s => s.status !== undefined && s.status !== null);
  }

  // Get attendance statistics
  getAttendanceStats() {
    const total = this.students.length;
    const present = this.students.filter(s => s.status === AttendanceStatus.PRESENT).length;
    const absent = this.students.filter(s => s.status === AttendanceStatus.ABSENT).length;
    const late = this.students.filter(s => s.status === AttendanceStatus.LATE).length;

    return { total, present, absent, late };
  }
}
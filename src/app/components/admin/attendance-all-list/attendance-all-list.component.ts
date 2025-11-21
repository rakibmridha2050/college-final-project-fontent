import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AttendanceFilter, AttendanceStatus, BulkAttendanceRequest, Class, Course, Department, Section, StudentAttendance } from 'src/app/model/attendance.models';
import { AttendanceService } from 'src/app/service/attendance.service';

@Component({
  selector: 'app-attendance-all-list',
  templateUrl: './attendance-all-list.component.html',
  styleUrls: ['./attendance-all-list.component.scss']
})
export class AttendanceAllListComponent implements OnInit {
   filterForm!: FormGroup;
  departments: Department[] = [];
  classes: Class[] = [];
  sections: Section[] = [];
  courses: Course[] = [];
  students: StudentAttendance[] = [];
  loading = false;
  
  // Attendance marking
  isMarkingAttendance = false;
  attendanceStatuses = Object.values(AttendanceStatus);
  editedStudents: { [key: number]: StudentAttendance } = {};
  
  // Summary statistics
  totalStudents = 0;
  presentCount = 0;
  absentCount = 0;
  lateCount = 0;
  halfDayCount = 0;
  excusedCount = 0;

  // Track if attendance exists for selected date
  attendanceExists = false;

  constructor(
    private fb: FormBuilder,
    private attendanceService: AttendanceService
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.loadDepartments();
  }

  private getCurrentDate(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private initializeForm() {
    this.filterForm = this.fb.group({
      departmentId: [null, Validators.required],
      classId: [null, Validators.required],
      sectionId: [null, Validators.required],
      courseId: [null, Validators.required],
      attendanceDate: [this.getCurrentDate(), Validators.required],
      periodNumber: [1, [Validators.required, Validators.min(1), Validators.max(8)]]
    });
  }

  loadDepartments() {
    this.attendanceService.getDepartments().subscribe({
      next: (depts) => this.departments = depts,
      error: (error) => console.error('Error loading departments:', error)
    });
  }

  onDepartmentChange() {
    const deptId = this.filterForm.get('departmentId')?.value;
    if (deptId) {
      this.loadClassesByDepartment(deptId);
      this.loadCoursesByDepartment(deptId);
      this.filterForm.patchValue({ 
        classId: null,
        sectionId: null 
      });
      this.classes = [];
      this.sections = [];
    }
  }

  onClassChange() {
    const classId = this.filterForm.get('classId')?.value;
    if (classId) {
      this.loadSectionsByClass(classId);
      this.filterForm.patchValue({ sectionId: null });
      this.sections = [];
    }
  }

  loadClassesByDepartment(departmentId: number) {
    this.attendanceService.getClassesByDepartment(departmentId).subscribe({
      next: (classes) => this.classes = classes,
      error: (error) => console.error('Error loading classes:', error)
    });
  }

  loadSectionsByClass(classId: number) {
    this.attendanceService.getSectionsByClass(classId).subscribe({
      next: (sections) => this.sections = sections,
      error: (error) => console.error('Error loading sections:', error)
    });
  }

  loadCoursesByDepartment(departmentId: number) {
    this.attendanceService.getCoursesByDepartment(departmentId).subscribe({
      next: (courses) => this.courses = courses,
      error: (error) => console.error('Error loading courses:', error)
    });
  }

  loadAttendance() {
    if (this.filterForm.invalid) {
      alert('Please fill all required fields');
      return;
    }

    this.loading = true;
    const filter: AttendanceFilter = this.filterForm.value;

    console.log('Loading attendance with filter:', filter);

    this.attendanceService.getStudentsForAttendance(filter).subscribe({
      next: (students) => {
        console.log('Received students:', students);
        this.students = students;
        this.checkAttendanceStatus();
        this.calculateSummary();
        this.loading = false;
        this.isMarkingAttendance = false;
        this.editedStudents = {};
      },
      error: (error) => {
        console.error('Error loading attendance:', error);
        this.loading = false;
        this.students = [];
        this.attendanceExists = false;
        this.calculateSummary();
      }
    });
  }

  checkAttendanceStatus() {
    // Check if any student already has attendance marked
    this.attendanceExists = this.students.some(student => 
      student.status && student.status !== null && student.status !== undefined
    );
    
    if (!this.attendanceExists) {
      // Initialize with default status (ABSENT) for new attendance
      this.students.forEach(student => {
        student.status = AttendanceStatus.ABSENT;
        student.remarks = '';
      });
    }
  }

  startMarkingAttendance() {
    this.isMarkingAttendance = true;
    // Create editable copies of students
    this.editedStudents = {};
    this.students.forEach(student => {
      this.editedStudents[student.studentId] = { ...student };
    });
  }

  cancelMarking() {
    this.isMarkingAttendance = false;
    this.editedStudents = {};
  }

  onStatusChange(studentId: number, status: AttendanceStatus) {
    if (this.editedStudents[studentId]) {
      this.editedStudents[studentId].status = status;
    }
  }

  onRemarksChange(studentId: number, remarks: string) {
    if (this.editedStudents[studentId]) {
      this.editedStudents[studentId].remarks = remarks;
    }
  }

  saveAttendance() {
    if (!this.filterForm.valid) {
      alert('Please fill all required fields');
      return;
    }

    const formValue = this.filterForm.value;
    const request: BulkAttendanceRequest = {
      courseId: formValue.courseId,
      sectionId: formValue.sectionId,
      attendanceDate: formValue.attendanceDate,
      periodNumber: formValue.periodNumber,
      recordedBy: 'teacher', // You can replace this with actual user
      attendanceRecords: Object.values(this.editedStudents)
    };

    this.loading = true;

    if (this.attendanceExists) {
      // Update existing attendance
      this.attendanceService.updateAttendance(request).subscribe({
        next: (response) => {
          console.log('Attendance updated successfully:', response);
          this.loadAttendance(); // Reload to reflect changes
          this.isMarkingAttendance = false;
        },
        error: (error) => {
          console.error('Error updating attendance:', error);
          this.loading = false;
          alert('Error updating attendance. Please try again.');
        }
      });
    } else {
      // Create new attendance
      this.attendanceService.recordAttendance(request).subscribe({
        next: (response) => {
          console.log('Attendance recorded successfully:', response);
          this.loadAttendance(); // Reload to reflect changes
          this.isMarkingAttendance = false;
        },
        error: (error) => {
          console.error('Error recording attendance:', error);
          this.loading = false;
          alert('Error recording attendance. Please try again.');
        }
      });
    }
  }

  calculateSummary() {
    const studentsToCount = this.isMarkingAttendance ? 
      Object.values(this.editedStudents) : this.students;

    this.totalStudents = studentsToCount.length;
    this.presentCount = studentsToCount.filter(s => s.status === AttendanceStatus.PRESENT).length;
    this.absentCount = studentsToCount.filter(s => s.status === AttendanceStatus.ABSENT).length;
    this.lateCount = studentsToCount.filter(s => s.status === AttendanceStatus.LATE).length;
    this.halfDayCount = studentsToCount.filter(s => s.status === AttendanceStatus.HALF_DAY).length;
    this.excusedCount = studentsToCount.filter(s => s.status === AttendanceStatus.EXCUSED).length;
  }

  getStatusClass(status: AttendanceStatus): string {
    switch (status) {
      case AttendanceStatus.PRESENT: return 'status-present';
      case AttendanceStatus.ABSENT: return 'status-absent';
      case AttendanceStatus.LATE: return 'status-late';
      case AttendanceStatus.HALF_DAY: return 'status-half-day';
      case AttendanceStatus.EXCUSED: return 'status-excused';
      default: return 'status-absent';
    }
  }

  canMarkAttendance(): boolean {
    return this.students.length > 0 && this.filterForm.valid;
  }

  exportToCSV() {
    if (this.students.length === 0) return;

    const currentDate = this.filterForm.get('attendanceDate')?.value || 'unknown';
    
    const headers = ['Roll No', 'Student Name', 'Email', 'Status', 'Remarks'];
    const csvData = this.students.map(student => [
      student.studentRoll,
      student.studentName,
      student.email,
      student.status,
      student.remarks || ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `attendance_${currentDate}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
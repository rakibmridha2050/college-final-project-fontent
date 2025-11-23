import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription } from 'rxjs';
import { AttendanceStatus } from 'src/app/model/attendance-status.enum';
import { AttendanceFilter, BulkAttendanceRequest, Class, Course, Department, Section, StudentAttendance } from 'src/app/model/attendance.models';

import { AttendanceService } from 'src/app/service/attendance.service';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss']
})
export class AttendanceComponent implements OnInit, OnDestroy {
  attendanceForm: FormGroup;
  currentStep = 1;
  totalSteps = 6;

  // Data arrays
  departments: Department[] = [];
  classes: Class[] = [];
  sections: Section[] = [];
  courses: Course[] = [];
  students: StudentAttendance[] = [];

  // Loading states
  loading = false;
  loadingClasses = false;
  loadingSections = false;
  loadingCourses = false;
  loadingStudents = false;

  // Status options
 statusOptions: { label: string, value: AttendanceStatus }[] = [
  { label: 'Present', value: AttendanceStatus.PRESENT },
  { label: 'Absent', value: AttendanceStatus.ABSENT },
  { label: 'Late', value: AttendanceStatus.LATE },
  { label: 'Half Day', value: AttendanceStatus.HALF_DAY },
  { label: 'Excused', value: AttendanceStatus.EXCUSED },
  { label: 'Not Taken', value: AttendanceStatus.NOT_TAKEN },
];

  // Subscription management
  private formSubscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private attendanceService: AttendanceService
  ) {
    this.attendanceForm = this.createForm();
  }

  ngOnInit() {
    this.loadDepartments();
    console.log(this.statusOptions);
    console.log(this.attendanceForm.value);
    
    
    // Delay form listeners setup until after initial data load
    setTimeout(() => {
      this.setupFormListeners();
    }, 100);
  }

  ngOnDestroy() {
    // Clean up subscriptions to prevent memory leaks
    this.formSubscriptions.forEach(sub => sub.unsubscribe());
  }

  createForm(): FormGroup {
    return this.fb.group({
      departmentId: [null, Validators.required],
      classId: [{ value: null, disabled: false }, Validators.required],
      sectionId: [{ value: null, disabled: false }, Validators.required],
      courseId: [{ value: null, disabled: false }, Validators.required],
      attendanceDate: [new Date().toISOString().split('T')[0], Validators.required],
      periodNumber: [1, [Validators.required, Validators.min(1), Validators.max(8)]],
      recordedBy: ['admin', Validators.required]
    });
  }

  // Form control getters
  get departmentId(): FormControl {
    return this.attendanceForm.get('departmentId') as FormControl;
  }

  get classId(): FormControl {
    return this.attendanceForm.get('classId') as FormControl;
  }

  get sectionId(): FormControl {
    return this.attendanceForm.get('sectionId') as FormControl;
  }

  get courseId(): FormControl {
    return this.attendanceForm.get('courseId') as FormControl;
  }

  get attendanceDate(): FormControl {
    return this.attendanceForm.get('attendanceDate') as FormControl;
  }

  get periodNumber(): FormControl {
    return this.attendanceForm.get('periodNumber') as FormControl;
  }

  get recordedBy(): FormControl {
    return this.attendanceForm.get('recordedBy') as FormControl;
  }

  setupFormListeners() {
    console.log('Setting up form listeners...');

    // Clear any existing subscriptions
    this.formSubscriptions.forEach(sub => sub.unsubscribe());
    this.formSubscriptions = [];

    // Department listener with better filtering
    const deptSubscription = this.departmentId.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(100) // Add small delay to prevent rapid firing
    ).subscribe(deptId => {
      console.log('Department value changed:', deptId);
      
      // Only proceed if we have a valid number
      if (deptId !== null && deptId !== undefined && deptId !== '' && !isNaN(Number(deptId))) {
        const numericDeptId = Number(deptId);
        console.log('Processing valid department ID:', numericDeptId);
        
        this.handleDepartmentChange(numericDeptId);
      } else {
        console.log('Invalid department ID, clearing dependent fields');
        this.clearDependentFields();
      }
    });

    // Class listener
    const classSubscription = this.classId.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(100)
    ).subscribe(classId => {
      console.log('Class value changed:', classId);
      
      if (classId !== null && classId !== undefined && classId !== '' && !isNaN(Number(classId))) {
        const numericClassId = Number(classId);
        console.log('Processing valid class ID:', numericClassId);
        
        this.handleClassChange(numericClassId);
      } else {
        console.log('Invalid class ID, clearing sections');
        this.sections = [];
        this.attendanceForm.patchValue({ sectionId: null }, { emitEvent: false });
      }
    });

    this.formSubscriptions.push(deptSubscription, classSubscription);
  }

  private handleDepartmentChange(departmentId: number) {
    // Reset dependent fields without triggering events
    this.attendanceForm.patchValue({ 
      classId: null, 
      sectionId: null, 
      courseId: null 
    }, { emitEvent: false });
    
    this.classes = [];
    this.sections = [];
    
    // Load dependent data
    this.loadClasses(departmentId);
    this.loadCourses(departmentId);
  }

  private handleClassChange(classId: number) {
    this.attendanceForm.patchValue({ sectionId: null }, { emitEvent: false });
    this.sections = [];
    this.loadSections(classId);
  }

  private clearDependentFields() {
    this.attendanceForm.patchValue({ 
      classId: null, 
      sectionId: null, 
      courseId: null 
    }, { emitEvent: false });
    
    this.classes = [];
    this.sections = [];
    this.courses = [];
  }

  loadDepartments() {
    this.loading = true;
    this.attendanceService.getDepartments().subscribe({
      next: (data) => {
        console.log(data);
        
        this.departments = data;
        this.loading = false;
        console.log('Departments loaded:', data.length);
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.loading = false;
      }
    });
  }

  loadClasses(departmentId: number) {
    if (!departmentId) {
      console.error('Department ID is undefined');
      return;
    }
    
    this.loadingClasses = true;
    this.attendanceService.getClassesByDepartment(departmentId).subscribe({
      next: (data) => {
        this.classes = data;
        this.loadingClasses = false;
        console.log('Classes loaded:', data.length);
      },
      error: (error) => {
        console.error('Error loading classes:', error);
        this.loadingClasses = false;
      }
    });
  }

  loadSections(classId: number) {
    if (!classId) {
      console.error('Class ID is undefined');
      return;
    }
    
    this.loadingSections = true;
    this.attendanceService.getSectionsByClass(classId).subscribe({
      next: (data) => {
        this.sections = data;
        this.loadingSections = false;
        console.log('Sections loaded:', data.length);
      },
      error: (error) => {
        console.error('Error loading sections:', error);
        this.loadingSections = false;
      }
    });
  }

  loadCourses(departmentId: number) {
    if (!departmentId) {
      console.error('Department ID is undefined');
      return;
    }
    
    this.loadingCourses = true;
    this.attendanceService.getCoursesByDepartment(departmentId).subscribe({
      next: (data) => {
        this.courses = data;
        this.loadingCourses = false;
        console.log('Courses loaded:', data.length);
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.loadingCourses = false;
      }
    });
  }
  loadStudents() {
    if (this.attendanceForm.valid) {
      this.loadingStudents = true;
      const filter: AttendanceFilter = this.attendanceForm.value;

      this.attendanceService.getStudentsForAttendance(filter).subscribe({
        next: (data) => {
          this.students = data;
          this.loadingStudents = false;
          this.nextStep();
        },
        error: (error) => {
          console.error('Error loading students:', error);
          this.loadingStudents = false;
          alert('Error loading students. Please try again.');
        }
      });
    }
  }

 updateStudentStatus(student: StudentAttendance, status: string) {
  student.status = status as AttendanceStatus;
}

  updateStudentRemarks(student: StudentAttendance, remarks: string) {
    student.remarks = remarks;
  }

  submitAttendance() {
    if (this.attendanceForm.valid && this.students.length > 0) {
      this.loading = true;
      
      const request: BulkAttendanceRequest = {
        ...this.attendanceForm.value,
        attendanceRecords: this.students
      };
        console.log("request"+request.attendanceRecords);
        
      this.attendanceService.recordAttendance(request).subscribe({
        next: (response) => {
          this.loading = false;
          alert('Attendance recorded successfully!');
          this.nextStep();
        },
        error: (error) => {
          console.error('Error recording attendance:', error);
          this.loading = false;
          alert('Error recording attendance. Please try again.');
        }
      });
    }
  }

  nextStep() {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number) {
    if (step >= 1 && step <= this.totalSteps) {
      this.currentStep = step;
    }
  }

  resetForm() {
    this.attendanceForm.reset({
      attendanceDate: new Date().toISOString().split('T')[0],
      periodNumber: 1,
      recordedBy: 'admin'
    });
    this.students = [];
    this.currentStep = 1;
  }

  getStatusColor(status: AttendanceStatus): string {
    const colors = {
      [AttendanceStatus.PRESENT]: 'bg-green-100 text-green-800',
      [AttendanceStatus.ABSENT]: 'bg-red-100 text-red-800',
      [AttendanceStatus.LATE]: 'bg-yellow-100 text-yellow-800',
      [AttendanceStatus.HALF_DAY]: 'bg-blue-100 text-blue-800',
      [AttendanceStatus.EXCUSED]: 'bg-purple-100 text-purple-800',
      [AttendanceStatus.NOT_TAKEN]: 'bg-red-500 text-purple-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  get isFormValid(): boolean {
    return this.attendanceForm.valid;
  }

  get canProceedToStudents(): boolean {
    const { departmentId, classId, sectionId, courseId, attendanceDate, periodNumber } = this.attendanceForm.value;
    return !!(departmentId && classId && sectionId && courseId && attendanceDate && periodNumber);
  }

  // Helper methods for template
  getSelectedDepartmentName(): string {
    const deptId = this.departmentId.value;
    const department = this.departments.find(d => d.deptId === deptId);
    return department ? department.deptName : '';
  }

  getSelectedClassName(): string {
    const classId = this.classId.value;
    const classObj = this.classes.find(c => c.id === classId);
    return classObj ? classObj.className : '';
  }

  getSelectedSectionName(): string {
    const sectionId = this.sectionId.value;
    const section = this.sections.find(s => s.id === sectionId);
    return section ? section.sectionName : '';
  }

  getSelectedCourseName(): string {
    const courseId = this.courseId.value;
    const course = this.courses.find(c => c.id === courseId);
    return course ? course.courseName : '';
  }

  // Count methods for summary
  getPresentCount(): number {
    if (!this.students || this.students.length === 0) return 0;
    return this.students.filter(s => s.status === AttendanceStatus.PRESENT).length;
  }

  getAbsentCount(): number {
    if (!this.students || this.students.length === 0) return 0;
    return this.students.filter(s => s.status === AttendanceStatus.ABSENT).length;
  }

  getTotalCount(): number {
    return this.students ? this.students.length : 0;
  }
}
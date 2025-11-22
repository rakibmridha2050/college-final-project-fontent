export interface Department {
  deptId: number;
  deptName: string;
  deptCode: string;
}

export interface Class {
  id: number;
  className: string;
  department: Department;
}

export interface Section {
  id: number;
  sectionName: string;
  classes: Class;
}

export interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  department: Department;
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  HALF_DAY = 'HALF_DAY',
  EXCUSED = 'EXCUSED',
  NOT_TAKEN = 'NOT_TAKEN_YET'
}

export interface StudentAttendance {
  studentId: number;
  studentRoll: string;
  studentName: string;
  email: string;
  status: AttendanceStatus;
  remarks: string;
}

export interface AttendanceFilter {
  departmentId: number | null;
  classId: number | null;
  sectionId: number | null;
  courseId: number | null;
  attendanceDate: string;
  periodNumber: number | null;
}

export interface BulkAttendanceRequest {
  courseId: number;
  sectionId: number;
  attendanceDate: string;
  periodNumber: number;
  recordedBy: string;
  attendanceRecords: StudentAttendance[];
}
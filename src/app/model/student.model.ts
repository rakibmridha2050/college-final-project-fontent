import { AttendanceStatus } from "./attendance-status.enum";
import { Classes } from "./classes.model";
import { Course } from "./course.model";
import { Department } from "./department.model";
import { Section } from "./section.model";

export interface Student {
  id: number;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  dob: Date;
  status?: AttendanceStatus;
  gender: string;
  program: string;
  currentSemester: number;
  permanentAddress: string;
  presentAddress: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  department?: Department;
  classEntity?: Classes;
  section?: Section;
  courses?: Course[];
}

export interface StudentDTO {
  id?: number;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  dob: Date;
  gender: string;
  program: string;
  currentSemester: number;
  permanentAddress: string;
  presentAddress: string;
  isActive: boolean;
  departmentId?: number;
  classId?: number;
  sectionId?: number;
  courseIds?: number[];
}

export interface StudentResponseDTO {
  id: number;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  dob: Date;
  gender: string;
  program: string;
  currentSemester: number;
  permanentAddress: string;
  presentAddress: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  departmentName: string;
  className: string;
  sectionName: string;
  courseNames: string[];
}
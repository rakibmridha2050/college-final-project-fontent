export interface Exam {
  id: number;
  examTitle: string;
  description: string;
  examDate: string;
  duration: number;
  totalMarks: number;
  examType: string;
  courseId: number;
  courseName: string;
  facultyName: string;
  isPublished: boolean;
}

export interface ExamCreateDTO {
  examTitle: string;
  description: string;
  examDate: string;
  duration: number;
  totalMarks: number;
  examType: string;
  courseId: number;
}

export interface ExamUpdateDTO {
  examTitle: string;
  description: string;
  examDate: string;
  duration: number;
  totalMarks: number;
  isPublished: boolean;
}

export interface ExamResult {
  id: number;
  examId: number;
  studentId: number;
  marksObtained: number;
  grade: string;
  gpa: number;
  status: string;
  remarks: string;
  studentName: string;
  studentIdNumber: string;
  examTitle: string;
  totalMarks: number;
}

export interface ExamResultCreateDTO {
  studentId: number;
  marksObtained: number;
  remarks: string;
}

export interface BulkExamResultDTO {
  examId: number;
  results: ExamResultCreateDTO[];
}

export interface ExamResultSummary {
  examId: number;
  examTitle: string;
  totalStudents: number;
  studentsAppeared: number;
  studentsPassed: number;
  studentsFailed: number;
  studentsAbsent: number;
  averageMarks: number;
  highestMarks: number;
  lowestMarks: number;
}

export interface Course {
  id: number;
  courseCode: string;
  courseName: string;
  creditHours: number;
}

export interface Student {
  id: number;
  studentId: string;
  name: string;
  email: string;
  program: string;
  currentSemester: number;
}
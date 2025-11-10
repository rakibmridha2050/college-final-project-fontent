export interface FeeStructure {
  id: number;
  structureName: string;
  academicYear: string;
  semester: string;
  isActive: boolean;
  feeComponents: FeeComponent[];
}

export interface FeeComponent {
  id: number;
  componentName: string;
  amount: number;
  description: string;
  isActive: boolean;
}

export interface StudentFee {
  id: number;
  studentId: number;
  studentName: string;
  feeStructureId: number;
  feeStructureName: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate: Date;
  status: string;
  feePayments: FeePayment[];
}

export interface FeePayment {
  id: number;
  studentFeeId: number;
  amountPaid: number;
  paymentDate: Date;
  paymentMethod: string;
  transactionId: string;
  remarks: string;
}

export interface FeeWaiver {
  id: number;
  studentId: number;
  studentName: string;
  reason: string;
  waiverPercentage: number;
  waiverAmount: number;
  appliedDate: Date;
  approvedBy: string;
}

export interface LateFeeRule {
  id: number;
  ruleName: string;
  fineAmount: number;
  fineType: string;
  effectiveFrom: Date;
  effectiveTo: Date;
  isActive: boolean;
}

export interface PaymentMethod {
  value: string;
  viewValue: string;
}

export interface FeeStatus {
  value: string;
  viewValue: string;
}

export interface Payment {
  id?: number;
  studentId: number;
  amount: number;
  paymentMode: string;
  status?: string;
  paymentDate?: string;
  receiptNo?: string;
  remarks?: string;
}

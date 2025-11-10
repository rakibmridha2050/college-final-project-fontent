// import { Component, Inject, OnInit } from '@angular/core';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { ActivatedRoute, Router } from '@angular/router';

// import { FeeStructureService } from 'src/app/service/fee-structure.service';

// @Component({
//   selector: 'app-fee-structure-form',
//   templateUrl: './fee-structure-form.component.html',
//   styleUrls: ['./fee-structure-form.component.scss']
// })
// export class FeeStructureFormComponent implements OnInit {
//   feeStructureForm: FormGroup;
//   loading = false;
//   isEditMode = false;
//   error = '';
//   feeStructureId?: number;

//   constructor(
//     private fb: FormBuilder,
//     private feeStructureService: FeeStructureService,
//     private route: ActivatedRoute,
//     private router: Router
//   ) {
//     this.feeStructureForm = this.createForm();
//   }

//   ngOnInit(): void {
//     this.route.params.subscribe(params => {
//       if (params['id']) {
//         this.isEditMode = true;
//         this.feeStructureId = +params['id'];
//         this.loadFeeStructure();
//       }
//     });
//   }

//   createForm(): FormGroup {
//     return this.fb.group({
//       structureName: ['', [Validators.required, Validators.minLength(3)]],
//       academicYear: ['', [Validators.required]],
//       semester: ['', [Validators.required]],
//       isActive: [true]
//     });
//   }

//   loadFeeStructure(): void {
//     if (!this.feeStructureId) return;

//     this.loading = true;
//     this.feeStructureService.getFeeStructureById(this.feeStructureId).subscribe({
//       next: (feeStructure) => {
//         this.feeStructureForm.patchValue(feeStructure);
//         this.loading = false;
//       },
//       error: (error) => {
//         this.error = 'Failed to load fee structure';
//         this.loading = false;
//         console.error('Error loading fee structure:', error);
//       }
//     });
//   }

//   onSubmit(): void {
//     if (this.feeStructureForm.valid) {
//       this.loading = true;
//       this.error = '';

//       const formData = this.feeStructureForm.value;

//       const operation = this.isEditMode && this.feeStructureId
//         ? this.feeStructureService.updateFeeStructure(this.feeStructureId, formData)
//         : this.feeStructureService.createFeeStructure(formData);

//       operation.subscribe({
//         next: () => {
//           this.loading = false;
//           this.router.navigate(['/admin/payment/fee-structures']);
//         },
//         error: (error) => {
//           this.error = this.isEditMode ? 'Failed to update fee structure' : 'Failed to create fee structure';
//           this.loading = false;
//           console.error('Error saving fee structure:', error);
//         }
//       });
//     } else {
//       this.markFormGroupTouched();
//     }
//   }

//   onCancel(): void {
//     this.router.navigate(['/admin/payment/fee-structures']);
//   }

//   private markFormGroupTouched(): void {
//     Object.keys(this.feeStructureForm.controls).forEach(key => {
//       const control = this.feeStructureForm.get(key);
//       control?.markAsTouched();
//     });
//   }

//   isFieldInvalid(fieldName: string): boolean {
//     const field = this.feeStructureForm.get(fieldName);
//     return !!(field && field.invalid && (field.dirty || field.touched));
//   }

//   getFieldError(fieldName: string): string {
//     const field = this.feeStructureForm.get(fieldName);
//     if (field?.errors?.['required']) {
//       return 'This field is required';
//     }
//     if (field?.errors?.['minlength']) {
//       return `Minimum length is ${field.errors?.['minlength'].requiredLength} characters`;
//     }
//     return '';
//   }
// }
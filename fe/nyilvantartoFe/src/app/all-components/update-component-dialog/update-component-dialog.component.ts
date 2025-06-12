import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-component-dialog',
  templateUrl: './update-component-dialog.component.html',
  styleUrls: ['./update-component-dialog.component.css'],
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, CommonModule, ReactiveFormsModule],
})
export class UpdateComponentDialogComponent {
  updateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateComponentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.updateForm = this.fb.group({
      name: [data.compName, Validators.required],
      type: [data.compType, Validators.required],
      brand: [data.brand, Validators.required],
      description: [data.description, Validators.required],
      status: [data.status, Validators.required]
    });
  }

  onSubmit() {
    if (this.updateForm.valid) {
      this.dialogRef.close(this.updateForm.value); // Visszaadjuk az űrlap adatait
    }
  }

  onCancel() {
    this.dialogRef.close(); // Bezárjuk a dialógust
  }
}
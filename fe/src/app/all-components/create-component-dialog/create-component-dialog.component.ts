import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-component-dialog',
  templateUrl: './create-component-dialog.component.html',
  styleUrls: ['./create-component-dialog.component.css'],
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, CommonModule, ReactiveFormsModule],
})
export class CreateComponentDialogComponent {
  createForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CreateComponentDialogComponent>
  ) {
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      brand: ['', Validators.required],
      description: ['', Validators.required],
      status: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.createForm.valid) {
      this.dialogRef.close(this.createForm.value); // Visszaadjuk az űrlap adatait
    }
  }

  onCancel() {
    this.dialogRef.close(); // Bezárjuk a dialógust
  }
}
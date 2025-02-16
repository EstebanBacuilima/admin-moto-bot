import { Component } from '@angular/core';
import { NgZorroAntdModule } from '../../../../ng-zorro.module';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RegisterRequest } from '../../../../domain/models/register-request';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-schedule-appointment',
  standalone: true,
  imports: [CommonModule, NgZorroAntdModule, FormsModule, ReactiveFormsModule],
  templateUrl: './schedule-appointment.component.html',
  styleUrl: './schedule-appointment.component.scss',
})
export class ScheduleAppointmentComponent {
  public steps: any[] = [
    {
      id: 1,
      title: `Datos Personales`,
    },
    {
      id: 2,
      title: `Establecimiento y Servicios`,
    },
    {
      id: 3,
      title: `Detalles`,
    },
  ];
  public current = 0;
  public processing = false;
  public customerForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.customerForm = this.formBuilder.group({
      idCard: [null, [Validators.required, Validators.minLength(10)]],
      firstName: [null, [Validators.required, Validators.minLength(3)]],
      lastName: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      photoUrl: [null],
      phoneNumber: [null, [Validators.minLength(10)]],
    });
  }

  getRegisterRequest(): any {
    return {
      idCard: this.customerForm.value.idCard,
      firstName: this.customerForm.value.firstName,
      lastName: this.customerForm.value.lastName,
      email: this.customerForm.value.email,
      photoUrl: this.customerForm.value.photoUrl,
      phoneNumber: this.customerForm.value.phoneNumber,
    };
  }

  /**
   * It loops through all the form controls and marks them as dirty and updates their validity
   * @returns A boolean value.
   */
  private validateForm(): boolean {
    for (const i in this.customerForm.controls) {
      this.customerForm.controls[i].markAsDirty();
      this.customerForm.controls[i].updateValueAndValidity({
        onlySelf: true,
      });
    }
    return this.customerForm.valid;
  }

  pre(): void {
    this.current -= 1;
  }

  next(): void {
    this.loadingAndStep();
  }

  done(): void {
    this.loadingAndStep();
  }

  loadingAndStep(): void {
    if (this.current < this.steps.length) {
      const step = this.steps[this.current];
      this.current += 1;
    }
  }
}

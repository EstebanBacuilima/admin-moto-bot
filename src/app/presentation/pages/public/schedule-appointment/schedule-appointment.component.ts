import { Service } from './../../../../domain/entities/service';
import { ServiceService } from './../../../../data/src/service.service';
import { EstablishmentService } from './../../../../data/src/establishment.service';
import { BehaviorSubject, finalize } from 'rxjs';
import { DefaultResponse } from './../../../../domain/common/default-response';
import { Establishment } from './../../../../domain/entities/establishment';
import { Component, inject } from '@angular/core';
import { NgZorroAntdModule } from '../../../../ng-zorro.module';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-schedule-appointment',
  standalone: true,
  imports: [CommonModule, NgZorroAntdModule, FormsModule, ReactiveFormsModule],
  templateUrl: './schedule-appointment.component.html',
  styleUrl: './schedule-appointment.component.scss',
})
export class ScheduleAppointmentComponent {
  private readonly establishmentService = inject(EstablishmentService);
  private readonly serviceService = inject(ServiceService);

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
  public loading$ = new BehaviorSubject<boolean>(false);
  public defaultResponse: DefaultResponse = new DefaultResponse(200, '');
  public establishments: Establishment[] = [];
  public services: Service[] = [];
  public searchText: string = '';

  constructor(private formBuilder: FormBuilder) {
    this.customerForm = this.formBuilder.group({
      idCard: [null, [Validators.required, Validators.minLength(10)]],
      firstName: [null, [Validators.required, Validators.minLength(3)]],
      lastName: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      photoUrl: [null],
    });
  }

  public listEstablishments() {
    this.loading$.next(true);
    this.establishmentService
      .list()
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          this.establishments = this.defaultResponse.data;
        },
        error: () => (this.establishments = []),
      });
  }

  public listServices() {
    this.loading$.next(true);
    this.serviceService
      .list(this.searchText)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          return (this.services = this.defaultResponse.data);
        },
        error: () => (this.services = []),
      });
  }

  getRegisterRequest(): any {
    return {
      idCard: this.customerForm.value.idCard,
      firstName: this.customerForm.value.firstName,
      lastName: this.customerForm.value.lastName,
      email: this.customerForm.value.email,
      photoUrl: this.customerForm.value.photoUrl,
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

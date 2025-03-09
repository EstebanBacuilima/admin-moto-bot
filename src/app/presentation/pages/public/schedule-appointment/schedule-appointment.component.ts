import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject, finalize } from 'rxjs';
import { Customer } from '../../../../domain/entities/customer';
import { Person } from '../../../../domain/entities/people';
import { Coordinate as CoordinateModel } from '../../../../domain/models/coordinate';
import { NgZorroAntdModule } from '../../../../ng-zorro.module';
import { EncourageComponent } from '../../../common/encourage/encourage.component';
import { AppointmentService } from './../../../../data/src/appointment.service';
import { EmployeeService } from './../../../../data/src/emplyee.service';
import { EstablishmentService } from './../../../../data/src/establishment.service';
import { ServiceService } from './../../../../data/src/service.service';
import { DefaultResponse } from './../../../../domain/common/default-response';
import { Appointment } from './../../../../domain/entities/appoitnment';
import { Employee } from './../../../../domain/entities/employee';
import { Establishment } from './../../../../domain/entities/establishment';
import { Service } from './../../../../domain/entities/service';
import { SimpleMapComponent } from './../../../common/simple-map/simple-map.component';

@Component({
  selector: 'app-schedule-appointment',
  standalone: true,
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    SimpleMapComponent,
    EncourageComponent
  ],
  templateUrl: './schedule-appointment.component.html',
  styleUrl: './schedule-appointment.component.scss',
})
export class ScheduleAppointmentComponent implements OnInit {
  private readonly establishmentService = inject(EstablishmentService);
  private readonly serviceService = inject(ServiceService);
  private readonly employeeService = inject(EmployeeService);
  private readonly appointmentService = inject(AppointmentService);
  private readonly nzMessageService = inject(NzMessageService);

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
  public employees: Employee[] = [];
  public searchText: string = '';
  public selectedEstablishment: Establishment | null = null;
  public selectedService: Service | null = null;
  public selectedEmployee: Employee | null = null;
  public date: Date | null = null;
  public customer: Customer | null = null;
  public saving = signal(false);

  ngOnInit(): void {
    this.listEstablishments();
    this.listServices();
    this.listEmployees();
  }

  constructor(private formBuilder: FormBuilder) {
    this.customerForm = this.formBuilder.group({
      idCard: [null, [Validators.required, Validators.minLength(10)]],
      firstName: [null, [Validators.required, Validators.minLength(3)]],
      lastName: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      phoneNumber: [
        null,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(10),
        ],
      ],
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

  onSelectedEstablishment(establishment: Establishment) {
    this.selectedEstablishment = establishment;
  }

  onSelectedService(service: Service) {
    this.selectedService = service;
  }

  onSelectedEmployee(employee: Employee) {
    this.selectedEmployee = employee;
  }

  getByEstablishment(establishment: Establishment): CoordinateModel {
    return {
      title: establishment.name,
      label: establishment.name,
      latitude: establishment.latitude,
      longitude: establishment.longitude,
    };
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

  public listEmployees() {
    this.loading$.next(true);
    this.employeeService
      .list()
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          return (this.employees = this.defaultResponse.data);
        },
        error: () => (this.employees = []),
      });
  }

  getCustomer(): Customer {
    return new Customer(
      0,
      0,
      '',
      true,
      new Person(
        0,
        '',
        this.customerForm.get('idCard')?.value,
        this.customerForm.get('firstName')?.value,
        this.customerForm.get('lastName')?.value,
        true,
        this.customerForm.get('email')?.value,
        this.customerForm.get('photoUrl')?.value,
        this.customerForm.get('photoUrl')?.value
      )
    );
  }

  private getAppoinment(): Appointment {
    return new Appointment(
      0,
      this.selectedService?.id ?? 0,
      this.selectedEmployee?.id ?? 0,
      this.selectedEstablishment?.id ?? 0,
      '',
      this.date ?? new Date(),
      true,
      '',
      undefined,
      undefined,
      undefined,
      undefined,
      this.customer ?? undefined
    );
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
    if (this.current === 0) {
      if (!this.validateForm()) {
        return;
      }
      if (this.date === null) {
        this.nzMessageService.error('Seleccione una fecha');
        return;
      }
      this.customer = this.getCustomer();
    }
    if (this.current === 1) {
      if (this.selectedEstablishment === null) {
        this.nzMessageService.error('Seleccione un establecimiento');
        return;
      }
      if (this.selectedService === null) {
        this.nzMessageService.error('Seleccione un servicio');
        return;
      }
      if (this.selectedEmployee === null) {
        this.nzMessageService.error('Seleccione un empleado');
        return;
      }
    }
    this.loadingAndStep();
  }

  done(): void {
    this.create();
  }

  private create(): void {
    this.appointmentService
      .create(this.getAppoinment())
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          if (response.statusCode !== 200) return;
          this.current = 0;
          this.customerForm.reset();
          this.selectedEmployee = null;
          this.selectedEstablishment = null;
          this.selectedService = null;
          this.date = null;
          this.customer = null;
        },
      });
  }

  loadingAndStep(): void {
    if (this.current < this.steps.length) {
      const step = this.steps[this.current];
      this.current += 1;
    }
  }

  onChange(result: Date): void {
    this.date = result;
  }

  disabledDate = (current: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return current < today;
  };
}

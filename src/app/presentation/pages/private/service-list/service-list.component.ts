import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, finalize } from 'rxjs';
import { ServiceService } from '../../../../data/src/service.service';
import { DefaultResponse } from '../../../../domain/common/default-response';
import { Service } from '../../../../domain/entities/service';
import { NgZorroAntdModule } from '../../../../ng-zorro.module';
import { ResponsiveService } from '../../../../services/responsive-service';
import { SimplePageHeaderComponent } from '../../../common/simple-page-header/simple-page-header.component';

@Component({
  selector: 'app-service-list',
  standalone: true,
  imports: [
    NgZorroAntdModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SimplePageHeaderComponent],
  templateUrl: './service-list.component.html',
  styleUrl: './service-list.component.scss'
})
export class ServiceListComponent {
  private readonly serviceService = inject(ServiceService);
  public readonly responsiveService = inject(ResponsiveService);
  private readonly formBuilder = inject(FormBuilder);

  public loading$ = new BehaviorSubject<boolean>(false);
  public saving = signal(false);

  public defaultResponse: DefaultResponse = new DefaultResponse(200, '');
  public services: Service[] = [];
  private searchDebounceTimer: any;
  public searchText: string = '';
  public openModal = false;
  public selectedService: Service | null = null;

  public serviceForm: UntypedFormGroup = this.formBuilder.group({
    name: [null, [Validators.required, Validators.minLength(3)]],
    description: [null, [Validators.minLength(2)]],
    price: [null, [Validators.required,]],
    active: [true, [Validators.required,]],
  });

  public listOfColumn = [
    {
      title: 'Nombre',
      compare: (a: Service, b: Service) => a.name ? a.name.localeCompare(b.name) : 0,
      priority: false,
    },
    {
      title: 'Descripción',
      compare: (a: Service, b: Service) =>
        a.description ? a.description.localeCompare(b.description ?? '') : 0,
      priority: 1,
    },
    {
      title: 'Precio',
      compare: (a: Service, b: Service) => a.price - b.price,
      priority: 1,
    },
    {
      title: 'Image',
      compare: (a: Service, b: Service) => (a.image ?? '').localeCompare(b.image ?? ''),
      priority: false,
    },
  ];

  ngOnInit(): void {
    this.list();
  }

  public list() {
    this.loading$.next(true);
    this.serviceService
      .list(this.searchText)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          return (this.services = this.defaultResponse.data)
        },
        error: () => (this.services = [])
      })
  }

  public onActiveChange(service: Service, state: boolean) {
    service.changedActive = true;
    this.serviceService
      .changeState(state, service.code)
      .pipe(finalize(() => (service.changedActive = false)))
      .subscribe({
        next: (response) => {
          if (response.statusCode !== 200) return;
          service.active = state;
        },
      });
  }

  public saveOrUpdate(): void {
    if (!this.validateForm()) return;

    if (this.saving()) return;

    this.saving.set(true);
    if (this.selectedService) {
      this.update();
    } else {
      this.create();
    }
  }

  private update(): void {
    this.serviceService
      .update(this.getService())
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          if (response.statusCode !== 200) return;
          this.openModal = false;
          this.list();
        },
      });
  }

  private create(): void {
    this.serviceService
      .create(this.getService())
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          if (response.statusCode !== 200) return;
          this.openModal = false;
          this.list();
        },
      });
  }

  public onSearchChanged(value: string) {
    this.searchText = value;
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
    this.searchDebounceTimer = setTimeout(() => {
      this.list();
    }, 800);
  }

  private validateForm(): boolean {
    for (const i in this.serviceForm.controls) {
      this.serviceForm.controls[i].markAsDirty();
      this.serviceForm.controls[i].updateValueAndValidity({
        onlySelf: true,
      });
    }
    return this.serviceForm.valid;
  }

  private fillForm(): void {
    this.serviceForm.get('name')?.setValue(this.selectedService?.name);
    this.serviceForm
      .get('description')
      ?.setValue(this.selectedService?.description);
    this.serviceForm.get('active')?.setValue(this.selectedService?.active);
    this.serviceForm.get('price')?.setValue(this.selectedService?.price);
  }

  private getService(): Service {
    return new Service(
      this.selectedService?.id ?? 0,
      this.selectedService?.code ?? '',
      this.serviceForm.get('name')?.value,
      this.selectedService?.image ?? '',
      this.serviceForm.get('active')?.value,
      false,
      this.serviceForm.get('price')?.value,
      this.serviceForm.get('description')?.value
    );
  }

  public onEdit(service: Service) {
    this.selectedService = service;
    this.openModal = true;
    this.fillForm();
  }

  public add() {
    this.openModal = true;
    this.resetForm();
    this.serviceForm.get('active')?.setValue(true);

  }

  public resetForm() {
    if (this.serviceForm) {
      this.serviceForm.reset();
    }
  }

  public cancel() {
    this.openModal = false;
    this.resetForm();
    this.list();
  }
}

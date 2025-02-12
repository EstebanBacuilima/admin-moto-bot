import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, finalize } from 'rxjs';
import { EstablishmentService } from '../../../../data/src/establishment.service';
import { DefaultResponse } from '../../../../domain/common/default-response';
import { Establishment } from '../../../../domain/entities/establishment';
import { Coordinate } from '../../../../domain/models/coordinate';
import { NgZorroAntdModule } from '../../../../ng-zorro.module';
import { ResponsiveService } from '../../../../services/responsive-service';
import { SimpleMapComponent } from '../../../common/simple-map/simple-map.component';
import { SimplePageHeaderComponent } from '../../../common/simple-page-header/simple-page-header.component';

@Component({
  selector: 'app-establishment-list',
  standalone: true,
  imports: [
    NgZorroAntdModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SimplePageHeaderComponent,
    SimpleMapComponent],
  templateUrl: './establishment-list.component.html',
  styleUrl: './establishment-list.component.scss'
})
export class EstablishmentListComponent {
  private readonly establishmentService = inject(EstablishmentService);
  public readonly responsiveService = inject(ResponsiveService);
  private readonly formBuilder = inject(FormBuilder);

  private readonly router = inject(Router);

  public loading$ = new BehaviorSubject<boolean>(false);
  public saving = signal(false);

  public defaultResponse: DefaultResponse = new DefaultResponse(200, '');
  public establishments: Establishment[] = [];
  private searchDebounceTimer: any;
  public searchText: string = '';
  public openModal = false;
  public selectedEstablishment: Establishment | null = null;

  public establishmentForm: UntypedFormGroup = this.formBuilder.group({
    name: [null, [Validators.required, Validators.minLength(3)]],
    description: [null, [Validators.minLength(2)]],
    active: [true, [Validators.required]],

    latitude: [
      { value: '', disabled: true },
      [Validators.required, Validators.pattern(/[+-]?([0-9]*[.])?[0-9]+/)],
    ],
    longitude: [
      { value: '', disabled: true },
      [Validators.required, Validators.pattern(/[+-]?([0-9]*[.])?[0-9]+/)],
    ],
  });

  public listOfColumn = [{
    title: 'Nombre',
    compare: (a: Establishment, b: Establishment) => a.name ? a.name.localeCompare(b.name) : 0,
    priority: false,
  },
  {
    title: 'Descripción',
    compare: (a: Establishment, b: Establishment) =>
      a.description ? a.description.localeCompare(b.description ?? '') : 0,
    priority: 1,
  },
  {
    title: 'Punto X',
    compare: (a: Establishment, b: Establishment) =>
      a.latitude && b.latitude ? a.latitude - b.latitude : 0,
    priority: false,
  },
  {
    title: 'Punto Y',
    compare: (a: Establishment, b: Establishment) =>
      a.longitude && b.longitude ? a.longitude - b.longitude : 0,
    priority: false,
  }];

  ngOnInit(): void {
    this.list();
  }

  public list() {
    this.loading$.next(true);
    this.establishmentService
      .list()
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          return (this.establishments = this.defaultResponse.data)
        },
        error: () => (this.establishments = [])
      })
  }

  public onActiveChange(establishment: Establishment, state: boolean) {
    establishment.changedActive = true;
    this.establishmentService
      .changeState(state, establishment.code)
      .pipe(finalize(() => (establishment.changedActive = false)))
      .subscribe({
        next: (response) => {
          if (response.statusCode !== 200) return;
          establishment.active = state;
        },
      });
  }

  public saveOrUpdate(): void {
    if (!this.validateForm()) {
      return;
    }
    if (this.saving()) return;
    this.saving.set(true);
    if (this.selectedEstablishment) {
      this.update();
    } else {
      this.create();
    }
  }
  private update(): void {
    this.establishmentService
      .update(this.getEstablishment())
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
    this.establishmentService
      .create(this.getEstablishment())
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
    for (const i in this.establishmentForm.controls) {
      this.establishmentForm.controls[i].markAsDirty();
      this.establishmentForm.controls[i].updateValueAndValidity({
        onlySelf: true,
      });
    }
    return this.establishmentForm.valid;
  }

  private fillForm(): void {
    this.establishmentForm.get('name')?.setValue(this.selectedEstablishment?.name);
    this.establishmentForm
      .get('description')
      ?.setValue(this.selectedEstablishment?.description);
    this.establishmentForm.get('active')?.setValue(this.selectedEstablishment?.active);
    this.establishmentForm.get('latitude')?.setValue(this.selectedEstablishment?.latitude);
    this.establishmentForm.get('longitude')?.setValue(this.selectedEstablishment?.longitude);
  }

  private getEstablishment(): Establishment {
    return new Establishment(
      this.selectedEstablishment?.id ?? 0,
      this.selectedEstablishment?.code ?? '',
      this.establishmentForm.get('name')?.value,
      this.establishmentForm.get('active')?.value,
      this.establishmentForm.get('latitude')?.value,
      this.establishmentForm.get('longitude')?.value,
      false,
      this.establishmentForm.get('description')?.value
    );
  }

  public onEdit(establishment: Establishment) {
    this.selectedEstablishment = establishment;
    this.openModal = true;
    this.fillForm();
  }

  public add() {
    this.openModal = true;
  }

  public cancel() {
    this.openModal = false;
    this.selectedEstablishment = null;
    this.list();
  }

  public coordinate: Coordinate = {
    title: '',
    label: '',
    latitude: 0,
    longitude: 0,
  };

  public onSelectedCoordinate(coordinate: Coordinate) {
    this.establishmentForm.get('latitude')?.setValue(coordinate.latitude);
    this.establishmentForm.get('longitude')?.setValue(coordinate.longitude);
  }

}

import { Brand } from '../../../../domain/entities/brand';
import { Component, inject, OnInit, signal } from '@angular/core';
import { BrandService } from '../../../../data/src/brand.service';
import { ResponsiveService } from '../../../../services/responsive-service';
import { BehaviorSubject, finalize } from 'rxjs';
import { DefaultResponse } from '../../../../domain/common/default-response';
import { NgZorroAntdModule } from '../../../../ng-zorro.module';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { SimplePageHeaderComponent } from '../../../common/simple-page-header/simple-page-header.component';

@Component({
  selector: 'app-bran-list',
  standalone: true,
  imports: [
    NgZorroAntdModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SimplePageHeaderComponent,
  ],
  templateUrl: './brand-list.component.html',
  styleUrl: './brand-list.component.scss',
})
export class BrandListComponent implements OnInit {
  private readonly branService = inject(BrandService);
  public readonly responsiveService = inject(ResponsiveService);
  private readonly formBuilder = inject(FormBuilder);
  public loading$ = new BehaviorSubject<boolean>(false);
  public saving = signal(false);

  public defaultResponse: DefaultResponse = new DefaultResponse(200, '');
  public brands: Brand[] = [];
  private searchDebounceTimer: any;
  public searchText: string = '';
  public opendModal = false;
  public selectedBrand: Brand | null = null;

  public brandForm: UntypedFormGroup = this.formBuilder.group({
    name: [null, [Validators.required, Validators.minLength(3)]],
    description: [null, [Validators.minLength(5)]],
    active: [true, [Validators.required]],
  });

  public listOfColumn = [
    {
      title: 'Nombre',
      compare: (a: Brand, b: Brand) =>
        a.name ? a.name.localeCompare(b.name) : 0,
      priority: false,
    },
    {
      title: 'Descripción',
      compare: (a: Brand, b: Brand) =>
        a.description ? a.description.localeCompare(b.description ?? '') : 0,
      priority: 1,
    },
  ];

  ngOnInit(): void {
    this.list();
  }

  public list() {
    this.loading$.next(true);
    this.branService
      .list()
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (response) => {
          if (response.statusCode !== 200) return;
          this.defaultResponse = response;
          return (this.brands = this.defaultResponse.data);
        },
        error: () => (this.brands = []),
      });
  }

  public onActiveChange(chain: Brand, state: boolean) {
    chain.changedActive = true;
    this.branService
      .changeState(state, chain.code)
      .pipe(finalize(() => (chain.changedActive = false)))
      .subscribe({
        next: (response) => {
          if (response.statusCode !== 200) return;
          chain.active = state;
        },
      });
  }

  public saveOrUpdate() {
    if (!this.validateForm()) {
      return;
    }
    if (this.saving()) return;
    this.saving.set(true);
    if (this.selectedBrand) {
      this.branService
        .update(this.getBrand())
        .pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: (response) => {
            if (response.statusCode !== 200) return;
            this.opendModal = false;
            this.list();
          },
        });
    } else {
      this.branService
        .create(this.getBrand())
        .pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: (response) => {
            if (response.statusCode !== 200) return;
            this.opendModal = false;
            this.list();
          },
        });
    }
  }

  public onSearchChanged(value: string) {
    this.searchText = value;
    // Clean debounce timer if the user is searching
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
    // Init the debounce timer for 800ms
    this.searchDebounceTimer = setTimeout(() => {
      this.list();
    }, 800);
  }

  /**
   * It loops through all the form controls and marks them as dirty and updates their validity
   * @returns A boolean value.
   */
  private validateForm(): boolean {
    for (const i in this.brandForm.controls) {
      this.brandForm.controls[i].markAsDirty();
      this.brandForm.controls[i].updateValueAndValidity({
        onlySelf: true,
      });
    }
    return this.brandForm.valid;
  }

  private fillForm(): void {
    this.brandForm.get('name')?.setValue(this.selectedBrand?.name);
    this.brandForm
      .get('description')
      ?.setValue(this.selectedBrand?.description);
    this.brandForm.get('active')?.setValue(this.selectedBrand?.active);
  }

  private getBrand(): Brand {
    return new Brand(
      this.selectedBrand?.id ?? 0,
      this.selectedBrand?.code ?? '',
      this.brandForm.get('name')?.value,
      false,
      this.brandForm.get('active')?.value,
      this.brandForm.get('description')?.value
    );
  }

  public onEdit(brand: Brand) {
    this.selectedBrand = brand;
    this.opendModal = true;
    this.fillForm();
  }

  public add(): void {
    this.opendModal = true;
  }

  public cancel() {
    this.opendModal = false;
    this.selectedBrand = null;
    this.list();
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, finalize } from 'rxjs';
import { CategoryService } from '../../../../data/src/category.service';
import { DefaultResponse } from '../../../../domain/common/default-response';
import { Category } from '../../../../domain/entities/category';
import { NgZorroAntdModule } from '../../../../ng-zorro.module';
import { ResponsiveService } from '../../../../services/responsive-service';
import { SimpleFileComponent } from '../../../common/simple-file/simple-file.component';
import { SimplePageHeaderComponent } from '../../../common/simple-page-header/simple-page-header.component';

@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    NgZorroAntdModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SimplePageHeaderComponent,
    SimpleFileComponent,
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent {
  private readonly categoryService = inject(CategoryService);
  public readonly responsiveService = inject(ResponsiveService);
  private readonly formBuilder = inject(FormBuilder);
  public loading$ = new BehaviorSubject<boolean>(false);
  public saving = signal(false);

  public defaultResponse: DefaultResponse = new DefaultResponse(200, '');
  public categories: Category[] = [];
  public auxCategories: Category[] = [];

  private searchDebounceTimer: any;
  public searchText: string = '';
  public opendModal = false;
  public selectedCategory: Category | null = null;
  public defaultImage = '';

  public categoryForm: UntypedFormGroup = this.formBuilder.group({
    name: [null, [Validators.required, Validators.minLength(3)]],
    description: [null, [Validators.minLength(5)]],
    active: [true, [Validators.required]],
    logo: [null],
  });

  public listOfColumn = [
    {
      title: 'Logo',
      compare: (a: Category, b: Category) =>
        a.name ? a.name.localeCompare(b.name) : 0,
      priority: false,
    },
    {
      title: 'Nombre',
      compare: (a: Category, b: Category) =>
        a.name ? a.name.localeCompare(b.name) : 0,
      priority: false,
    },
    {
      title: 'Descripción',
      compare: (a: Category, b: Category) =>
        a.description ? a.description.localeCompare(b.description ?? '') : 0,
      priority: 1,
    },
  ];

  ngOnInit(): void {
    this.list();
  }

  public list() {
    this.loading$.next(true);
    this.categoryService
      .list()
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (response) => {
          if (response.statusCode !== 200) return;
          this.defaultResponse = response;
          this.categories = this.defaultResponse.data;
          this.auxCategories = this.categories;
        },
        error: () => (this.categories = []),
      });
  }

  public onActiveChange(chain: Category, state: boolean) {
    chain.changedActive = true;
    this.categoryService
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
    if (this.selectedCategory) {
      this.categoryService
        .update(this.getCategory())
        .pipe(finalize(() => this.saving.set(false)))
        .subscribe({
          next: (response) => {
            if (response.statusCode !== 200) return;
            this.opendModal = false;
            this.list();
          },
        });
    } else {
      this.categoryService
        .create(this.getCategory())
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
      this.filterData(this.searchText);
    }, 800);
  }

  /**
   * It loops through all the form controls and marks them as dirty and updates their validity
   * @returns A boolean value.
   */
  private validateForm(): boolean {
    for (const i in this.categoryForm.controls) {
      this.categoryForm.controls[i].markAsDirty();
      this.categoryForm.controls[i].updateValueAndValidity({
        onlySelf: true,
      });
    }
    return this.categoryForm.valid;
  }

  private fillForm(): void {
    this.categoryForm.get('name')?.setValue(this.selectedCategory?.name);
    this.categoryForm
      .get('description')
      ?.setValue(this.selectedCategory?.description);
    this.categoryForm.get('logo')?.setValue(this.selectedCategory?.logo);
    this.categoryForm.get('active')?.setValue(this.selectedCategory?.active);
  }

  private getCategory(): Category {
    return new Category(
      this.selectedCategory?.id ?? 0,
      this.selectedCategory?.code ?? '',
      this.categoryForm.get('name')?.value,
      false,
      this.categoryForm.get('active')?.value,
      this.categoryForm.get('description')?.value,
      this.categoryForm.get('logo')?.value
    );
  }

  public onEdit(category: Category) {
    this.selectedCategory = category;
    this.opendModal = true;
    this.fillForm();
  }

  public add(): void {
    this.opendModal = true;
  }

  public cancel() {
    this.opendModal = false;
    this.selectedCategory = null;
    this.list();
  }

  updateLogoUrl(url: string): void {
    this.categoryForm.get('logo')?.setValue(url);
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.defaultImage;
  }

  public filterData(value: string) {
    if (!value) this.categories = this.auxCategories;

    this.categories = this.auxCategories.filter(b =>
      b.name.toLowerCase().includes(value.toLowerCase()) ||
      b.description?.toLowerCase().includes(value.toLowerCase()));
  }
}

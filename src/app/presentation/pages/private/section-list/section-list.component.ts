import { CommonModule } from '@angular/common';
import { Component, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { BehaviorSubject, finalize } from 'rxjs';
import { SectionService } from '../../../../data/src/section.service';
import { DefaultResponse } from '../../../../domain/common/default-response';
import { Section } from '../../../../domain/entities/section';
import { NgZorroAntdModule } from '../../../../ng-zorro.module';
import { ResponsiveService } from '../../../../services/responsive-service';
import { SimplePageHeaderComponent } from '../../../common/simple-page-header/simple-page-header.component';
import { ProductSectionDialogComponent } from './product-section-dialog/product-section-dialog.component';

@Component({
  selector: 'app-section-list',
  standalone: true,
  imports: [NgZorroAntdModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SimplePageHeaderComponent,
    NzIconModule,
    NzTagModule,
    ProductSectionDialogComponent,

  ],
  templateUrl: './section-list.component.html',
  styleUrl: './section-list.component.scss',
})
export class SectionListComponent {
  private readonly sectionService = inject(SectionService);
  public readonly responsiveService = inject(ResponsiveService);
  private readonly formBuilder = inject(FormBuilder);

  public loading$ = new BehaviorSubject<boolean>(false);

  public saving = signal(false);

  public defaultResponse: DefaultResponse = new DefaultResponse(200, '');
  public sections: Section[] = [];
  private searchDebounceTimer: any;
  public searchText: string = '';
  public openModal = false;
  public selectedSection: Section | null = null;

  @ViewChild('productDialog') productDialog!: ProductSectionDialogComponent;

  public sectionForm: UntypedFormGroup = this.formBuilder.group({
    name: [null, [Validators.required, Validators.minLength(3)]],
    description: [null,],
    end_date: [null,],
  });

  public listOfColumn = [
    {
      title: 'ID',
      compare: (a: Section, b: Section) => a.id ? a.id : 0,
      priority: false,
    },
    {
      title: 'Nombre',
      compare: (a: Section, b: Section) => a.name ? a.name.localeCompare(b.name) : 0,
      priority: false,
    },
    {
      title: 'Descripción',
      compare: (a: Section, b: Section) =>
        a.description ? a.description.localeCompare(b.description ?? '') : 0,
      priority: 1,
    },
    {
      title: 'Fecha finalización',
      compare: (a: Section, b: Section) => {
        if (a.endDate && b.endDate) {
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        } else if (a.endDate) {
          return 1;
        } else if (b.endDate) {
          return -1;
        } else {
          return 0;
        }
      },

      priority: 1,
    },

  ];

  ngOnInit(): void {
    this.list();
  }

  public list() {
    this.loading$.next(true);
    this.sectionService
      .list(this.searchText)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          return (this.sections = this.defaultResponse.data)
        },
        error: () => (this.sections = [])
      })
  }

  public onActiveChange(section: Section, state: boolean) {
    section.changedActive = true;
    this.sectionService
      .changeState(state, section.code)
      .pipe(finalize(() => (section.changedActive = false)))
      .subscribe({
        next: (response) => {
          if (response.statusCode !== 200) return;
          section.active = state;
        },
      });
  }

  public saveOrUpdate(): void {
    if (!this.validateForm()) return;

    if (this.saving()) return;

    this.saving.set(true);
    if (this.selectedSection) {
      this.update();
    } else {
      this.create();
    }
  }

  private update(): void {
    this.sectionService
      .update(this.getSection())
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
    this.sectionService
      .create(this.getSection())
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
    for (const i in this.sectionForm.controls) {
      this.sectionForm.controls[i].markAsDirty();
      this.sectionForm.controls[i].updateValueAndValidity({
        onlySelf: true,
      });
    }
    return this.sectionForm.valid;
  }

  private fillForm(): void {
    this.sectionForm.get('name')?.setValue(this.selectedSection?.name);
    this.sectionForm
      .get('description')
      ?.setValue(this.selectedSection?.description);
    this.sectionForm.get('end_date')?.setValue(this.selectedSection?.endDate);
  }

  private getSection(): Section {
    return new Section(
      this.selectedSection?.id ?? 0,
      this.selectedSection?.code ?? '',
      this.sectionForm.get('name')?.value,
      [],
      false,
      this.selectedSection?.active ?? true,
      this.sectionForm.get('description')?.value,
      this.sectionForm.get('end_date')?.value
    );
  }

  public onEdit(section: Section) {
    this.selectedSection = section;
    this.openModal = true;
    this.fillForm();
  }

  public add() {
    this.openModal = true;
    this.resetForm();
    this.sectionForm.get('active')?.setValue(true);
  }

  public resetForm() {
    if (this.sectionForm) {
      this.sectionForm.reset();
    }
    this.selectedSection = null;

  }
  public cancel() {
    this.openModal = false;
    this.resetForm();
    this.list();
  }

  public selectedSectionId: number = 0;
  openDialog(id: number): void {
    this.selectedSectionId = id;
    this.productDialog.showModal();
  }

  onDialogClosed(quantity: number): void {
    if (this.selectedSectionId === 0 || quantity === 0) return;

    const index = this.sections.findIndex(i => i.id = this.selectedSectionId);

    if (index != -1) {
      this.sections[index].totalProduct = quantity;
    }

    this.selectedSectionId = 0;

    // this.productDialog = undefined as any;
  }
}

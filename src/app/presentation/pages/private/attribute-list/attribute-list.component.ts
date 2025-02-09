import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, finalize } from 'rxjs';
import { AttributeService } from '../../../../data/src/attribute.service';
import { DefaultResponse } from '../../../../domain/common/default-response';
import { Attribute } from '../../../../domain/entities/attribute';
import { NgZorroAntdModule } from '../../../../ng-zorro.module';
import { ResponsiveService } from '../../../../services/responsive-service';
import { SimplePageHeaderComponent } from '../../../common/simple-page-header/simple-page-header.component';

@Component({
  selector: 'app-attribute-list',
  standalone: true,
  imports: [
    NgZorroAntdModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SimplePageHeaderComponent],
  templateUrl: './attribute-list.component.html',
  styleUrl: './attribute-list.component.scss'
})
export class AttributeListComponent {
  // private readonly serviceService = inject(ServiceService);
  private readonly attributeService = inject(AttributeService);
  public readonly responsiveService = inject(ResponsiveService);
  private readonly formBuilder = inject(FormBuilder);

  public loading$ = new BehaviorSubject<boolean>(false);
  public saving = signal(false);

  public defaultResponse: DefaultResponse = new DefaultResponse(200, '');
  public attributes: Attribute[] = [];
  private searchDebounceTimer: any;
  public searchText: string = '';
  public openModal = false;
  public selectedAttribute: Attribute | null = null;

  public attributeForm: UntypedFormGroup = this.formBuilder.group({
    name: [null, [Validators.required, Validators.minLength(3)]],
    description: [null]
  });

  public listOfColumn = [
    {
      title: 'ID',
      compare: (a: Attribute, b: Attribute) => a.id ? a.id : 0,
      priority: false,
    },
    {
      title: 'Nombre',
      compare: (a: Attribute, b: Attribute) => a.name ? a.name.localeCompare(b.name) : 0,
      priority: false,
    },
    {
      title: 'Descripción',
      compare: (a: Attribute, b: Attribute) =>
        a.description ? a.description.localeCompare(b.description ?? '') : 0,
      priority: 1,
    },
  ];

  ngOnInit(): void {
    this.list();
  }

  public list() {
    this.loading$.next(true);
    this.attributeService
      .list(this.searchText)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          return (this.attributes = this.defaultResponse.data)
        },
        error: () => (this.attributes = [])
      })
  }

  public onActiveChange(attribute: Attribute, state: boolean) {
    attribute.changedActive = true;
    this.attributeService
      .changeState(state, attribute.code)
      .pipe(finalize(() => (attribute.changedActive = false)))
      .subscribe({
        next: (response) => {
          if (response.statusCode !== 200) return;
          attribute.active = state;
        },
      });
  }

  public saveOrUpdate(): void {
    if (!this.validateForm()) return;

    if (this.saving()) return;

    this.saving.set(true);
    if (this.selectedAttribute) {
      this.update();
    } else {
      this.create();
    }
  }

  private update(): void {
    this.attributeService
      .update(this.getAttribute())
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
    this.attributeService
      .create(this.getAttribute())
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
    for (const i in this.attributeForm.controls) {
      this.attributeForm.controls[i].markAsDirty();
      this.attributeForm.controls[i].updateValueAndValidity({
        onlySelf: true,
      });
    }
    return this.attributeForm.valid;
  }

  private fillForm(): void {
    this.attributeForm.get('name')?.setValue(this.selectedAttribute?.name);
    this.attributeForm.get('description')?.setValue(this.selectedAttribute?.description);
  }

  private getAttribute(): Attribute {
    return new Attribute(
      this.selectedAttribute?.id ?? 0,
      this.selectedAttribute?.code ?? '',
      this.attributeForm.get('name')?.value,
      this.selectedAttribute?.active ?? true,
      this.attributeForm.get('description')?.value,
      false
    );
  }

  public onEdit(attribute: Attribute) {
    this.selectedAttribute = attribute;
    this.openModal = true;
    this.fillForm();
  }

  public add() {
    this.openModal = true;
    this.resetForm();
    this.attributeForm.get('active')?.setValue(true);

  }

  public resetForm() {
    if (this.attributeForm) {
      this.attributeForm.reset();
    }
    this.selectedAttribute = null;
  }

  public cancel() {
    this.openModal = false;
    this.resetForm();
    this.list();
  }
}

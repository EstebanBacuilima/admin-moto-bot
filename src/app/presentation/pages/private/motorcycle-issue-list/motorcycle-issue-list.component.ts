import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, finalize } from 'rxjs';
import { MotorcycleIssueService } from '../../../../data/src/motorcycle-issue.service';
import { DefaultResponse } from '../../../../domain/common/default-response';
import { MotorcycleIssue } from '../../../../domain/entities/motorcycle_issue';
import { NgZorroAntdModule } from '../../../../ng-zorro.module';
import { ResponsiveService } from '../../../../services/responsive-service';
import { SimplePageHeaderComponent } from '../../../common/simple-page-header/simple-page-header.component';

@Component({
  selector: 'app-motorcycle-issue-list',
  standalone: true,
  imports: [
    NgZorroAntdModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SimplePageHeaderComponent],
  templateUrl: './motorcycle-issue-list.component.html',
  styleUrl: './motorcycle-issue-list.component.scss'
})
export class MotorcycleIssueListComponent {
  // private readonly serviceService = inject(ServiceService);
  private readonly motorcycleIssueService = inject(MotorcycleIssueService);
  public readonly responsiveService = inject(ResponsiveService);
  private readonly formBuilder = inject(FormBuilder);

  public loading$ = new BehaviorSubject<boolean>(false);
  public saving = signal(false);

  public defaultResponse: DefaultResponse = new DefaultResponse(200, '');
  public motorcycleIssues: MotorcycleIssue[] = [];
  private searchDebounceTimer: any;
  public searchText: string = '';
  public openModal = false;
  public selectedMotorcycleIssue: MotorcycleIssue | null = null;

  public motorcycleIssueForm: UntypedFormGroup = this.formBuilder.group({
    issueDescription: [null, [Validators.required, Validators.minLength(3)]],
    possibleCauses: [null, [Validators.minLength(2)]],
    solutionSuggestion: [null, [Validators.required,]],
    severityLevel: [true, [Validators.required,]],
    keyword: [null,],
  });

  public listOfColumn = [
    {
      title: 'ID',
      compare: (a: MotorcycleIssue, b: MotorcycleIssue) => a.id ? a.id : 0,
      priority: false,
    },
    {
      title: 'Problem',
      compare: (a: MotorcycleIssue, b: MotorcycleIssue) => a.issueDescription ? a.issueDescription.localeCompare(b.issueDescription) : 0,
      priority: false,
    },
    {
      title: 'Causa',
      compare: (a: MotorcycleIssue, b: MotorcycleIssue) =>
        a.possibleCauses ? a.possibleCauses.localeCompare(b.possibleCauses ?? '') : 0,
      priority: 1,
    },
    {
      title: 'Solución sugerida',
      compare: (a: MotorcycleIssue, b: MotorcycleIssue) =>
        a.solutionSuggestion ? a.solutionSuggestion.localeCompare(b.solutionSuggestion ?? '') : 0,
      priority: 1,
    },

  ];

  ngOnInit(): void {
    this.list();
  }

  public list() {
    this.loading$.next(true);
    this.motorcycleIssueService
      .list(this.searchText)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          return (this.motorcycleIssues = this.defaultResponse.data)
        },
        error: () => (this.motorcycleIssues = [])
      })
  }

  public onActiveChange(motorcycleIssue: MotorcycleIssue, state: boolean) {
    motorcycleIssue.changedActive = true;
    this.motorcycleIssueService
      .changeState(state, motorcycleIssue.code)
      .pipe(finalize(() => (motorcycleIssue.changedActive = false)))
      .subscribe({
        next: (response) => {
          if (response.statusCode !== 200) return;
          motorcycleIssue.active = state;
        },
      });
  }

  public saveOrUpdate(): void {
    if (!this.validateForm()) return;

    if (this.saving()) return;

    this.saving.set(true);
    if (this.selectedMotorcycleIssue) {
      this.update();
    } else {
      this.create();
    }
  }

  private update(): void {
    this.motorcycleIssueService
      .update(this.getMotorcycleIssue())
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
    this.motorcycleIssueService
      .create(this.getMotorcycleIssue())
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
    for (const i in this.motorcycleIssueForm.controls) {
      this.motorcycleIssueForm.controls[i].markAsDirty();
      this.motorcycleIssueForm.controls[i].updateValueAndValidity({
        onlySelf: true,
      });
    }
    return this.motorcycleIssueForm.valid;
  }

  private fillForm(): void {
    this.motorcycleIssueForm.get('issueDescription')?.setValue(this.selectedMotorcycleIssue?.issueDescription);
    this.motorcycleIssueForm
      .get('possibleCauses')
      ?.setValue(this.selectedMotorcycleIssue?.possibleCauses);
    this.motorcycleIssueForm.get('solutionSuggestion')?.setValue(this.selectedMotorcycleIssue?.solutionSuggestion);
    this.motorcycleIssueForm.get('severityLevel')?.setValue(this.selectedMotorcycleIssue?.severityLevel);
    this.motorcycleIssueForm.get('keyword')?.setValue(this.selectedMotorcycleIssue?.keyword);
  }

  private getMotorcycleIssue(): MotorcycleIssue {
    return new MotorcycleIssue(
      this.selectedMotorcycleIssue?.id ?? 0,
      this.selectedMotorcycleIssue?.code ?? '',
      this.motorcycleIssueForm.get('issueDescription')?.value,
      this.motorcycleIssueForm.get('possibleCauses')?.value,
      this.motorcycleIssueForm.get('solutionSuggestion')?.value,
      this.motorcycleIssueForm.get('severityLevel')?.value,
      this.selectedMotorcycleIssue?.active ?? true,
      false,
      this.motorcycleIssueForm.get('keyword')?.value,
    );
  }

  public onEdit(motorcycleIssue: MotorcycleIssue) {
    this.selectedMotorcycleIssue = motorcycleIssue;
    this.openModal = true;
    this.fillForm();
  }

  public add() {
    this.openModal = true;
    this.resetForm();
    this.motorcycleIssueForm.get('active')?.setValue(true);

  }

  public resetForm() {
    if (this.motorcycleIssueForm) {
      this.motorcycleIssueForm.reset();
    }
    this.selectedMotorcycleIssue = null;

  }

  public cancel() {
    this.openModal = false;
    this.resetForm();
    this.list();
  }

  // Several level
  public listSeverityLeve: any[] = [
    { id: 1, value: 'MUY BAJO' },
    { id: 2, value: 'BAJO' },
    { id: 3, value: 'INTERMEDIO' },
    { id: 4, value: 'MEDIO ALTO' },
    { id: 5, value: 'ALTO' }
  ];
}

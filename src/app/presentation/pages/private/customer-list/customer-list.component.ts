import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, finalize } from 'rxjs';
import { CustomerService } from '../../../../data/src/customer.service';
import { DefaultResponse } from '../../../../domain/common/default-response';
import { Customer } from '../../../../domain/entities/customer';
import { NgZorroAntdModule } from '../../../../ng-zorro.module';
import { ResponsiveService } from '../../../../services/responsive-service';
import { SimplePageHeaderComponent } from '../../../common/simple-page-header/simple-page-header.component';

@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [NgZorroAntdModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SimplePageHeaderComponent],
  templateUrl: './customer-list.component.html',
  styleUrl: './customer-list.component.scss'
})
export class CustomerListComponent {
  // private readonly serviceService = inject(ServiceService);
  private readonly customerService = inject(CustomerService);
  public readonly responsiveService = inject(ResponsiveService);
  private readonly formBuilder = inject(FormBuilder);

  public loading$ = new BehaviorSubject<boolean>(false);
  public saving = signal(false);

  public defaultResponse: DefaultResponse = new DefaultResponse(200, '');
  public customers: Customer[] = [];
  public auxCustomers: Customer[] = [];
  private searchDebounceTimer: any;
  public searchText: string = '';

  public customerForm: UntypedFormGroup = this.formBuilder.group({
    issueDescription: [null, [Validators.required, Validators.minLength(3)]],
    possibleCauses: [null, [Validators.minLength(2)]],
    solutionSuggestion: [null, [Validators.required,]],
    severityLevel: [true, [Validators.required,]],
    keyword: [null,],
  });

  public listOfColumn = [
    {
      title: 'ID',
      compare: (a: Customer, b: Customer) => a.id ? a.id : 0,
      priority: false,
    },
    {
      title: 'CÓDIGO',
      compare: (a: Customer, b: Customer) => a.person?.idCard ? a.person?.idCard.localeCompare(b.person?.idCard ?? '') : 0,
      priority: false,
    },
    {
      title: 'NOMBRES',
      compare: (a: Customer, b: Customer) => a.person?.firstName ? a.person?.firstName.localeCompare(b.person?.firstName ?? '') : 0,
      priority: false,
    },
    {
      title: 'EMAIL',
      compare: (a: Customer, b: Customer) => a.person?.email ? a.person?.email.localeCompare(b.person?.email ?? '') : 0,
      priority: false,
    },

  ];

  ngOnInit(): void {
    this.list();
  }

  public list() {
    this.loading$.next(true);
    this.customerService
      .list()
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          this.customers = this.defaultResponse.data
          this.auxCustomers = this.customers
        },
        error: () => (this.customers = [])
      })
  }

  public onSearchChanged(value: string) {
    this.searchText = value;
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
    this.searchDebounceTimer = setTimeout(() => {
      // this.list();
      this.filterData(this.searchText);
    }, 800);
  }

  public filterData(value: string) {
    if (!value) this.customers = this.auxCustomers;

    this.customers = this.auxCustomers.filter(b =>
      b.person?.firstName.toLowerCase().includes(value.toLowerCase()) ||
      b.person?.lastName.toLowerCase().includes(value.toLowerCase()) ||
      b.person?.lastName.toLowerCase().includes(value.toLowerCase()) ||
      b.person?.email?.toLowerCase().includes(value.toLowerCase()));
  }
}

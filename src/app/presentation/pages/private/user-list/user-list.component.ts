import { SimplePageHeaderComponent } from './../../../common/simple-page-header/simple-page-header.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from './../../../../ng-zorro.module';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ResponsiveService } from '../../../../services/responsive-service';
import { BehaviorSubject, finalize } from 'rxjs';
import { DefaultResponse } from '../../../../domain/common/default-response';
import { User } from '../../../../domain/entities/user';
import { UserService } from '../../../../data/src/user.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    NgZorroAntdModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SimplePageHeaderComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  public readonly userService = inject(UserService);
  public readonly responsiveService = inject(ResponsiveService);
  private readonly formBuilder = inject(FormBuilder);
  public loading$ = new BehaviorSubject<boolean>(false);
  public saving = signal(false);

  public defaultResponse: DefaultResponse = new DefaultResponse(200, '');
  public users: User[] = [];

  private searchDebounceTimer: any;
  public searchText: string = '';
  public opendModal = false;
  public defaultImage = '';
  public selectedUser: User | null = null;

  public listOfColumn = [
    {
      title: 'Identificación',
      compare: (a: User, b: User) =>
        a.person?.idCard ? a.person?.idCard.localeCompare(a.person?.idCard) : 0,
      priority: false,
    },
    {
      title: 'Nombre de Usuario',
      compare: (a: User, b: User) =>
        a.displayName ? a.displayName.localeCompare(b.displayName) : 0,
      priority: false,
    },
    {
      title: 'Correo',
      compare: (a: User, b: User) =>
        a.displayName ? a.displayName.localeCompare(b.displayName) : 0,
      priority: false,
    },
  ];

  ngOnInit(): void {
    this.list();
  }

  public list() {
    this.loading$.next(true);
    this.userService
      .list(this.searchText)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (response) => {
          if (response.statusCode !== 200) return;
          this.defaultResponse = response;
          this.users = this.defaultResponse.data;
        },
        error: () => (this.users = []),
      });
  }

  public onActiveChange(user: User, state: boolean) {}

  public onEdit(user: User) {
    this.selectedUser = user;
    this.opendModal = true;
  }

  public add(): void {
    this.opendModal = true;
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src = this.defaultImage;
  }

  public onSearchChanged(value: string) {
    this.searchText = value;
    // Clean debounce timer if the user is searching
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
    // Init the debounce timer for 800ms
    this.searchDebounceTimer = setTimeout(() => {}, 800);
  }

  public filterData(value: string) {
    if (!value) this.users = this.users;
    this.users = this.users.filter(
      (b) =>
        b.email.toLowerCase().includes(value.toLowerCase()) ||
        b.displayName?.toLowerCase().includes(value.toLowerCase())
    );
  }
}

import { SimplePageHeaderComponent } from './../../../common/simple-page-header/simple-page-header.component';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgZorroAntdModule } from './../../../../ng-zorro.module';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ResponsiveService } from '../../../../services/responsive-service';
import { BehaviorSubject, finalize } from 'rxjs';
import { DefaultResponse } from '../../../../domain/common/default-response';
import { User } from '../../../../domain/entities/user';
import { UserService } from '../../../../data/src/user.service';
import { RegisterRequest } from '../../../../domain/models/register-request';
import { AuthService } from '../../../../data/src/auth.service';
import { SimpleFileComponent } from '../../../common/simple-file/simple-file.component';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgZorroAntdModule,
    SimpleFileComponent,
    ReactiveFormsModule,
    SimplePageHeaderComponent,
  ],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnInit {
  public readonly userService = inject(UserService);
  public readonly responsiveService = inject(ResponsiveService);
  private readonly authService = inject(AuthService);
  private readonly formBuilder = inject(FormBuilder);
  public loading$ = new BehaviorSubject<boolean>(false);
  public saving = signal(false);
  public defaultImage = '';
  public defaultResponse: DefaultResponse = new DefaultResponse(200, '');
  public users: User[] = [];

  private searchDebounceTimer: any;
  public searchText: string = '';
  public opendModal = false;
  public selectedUser: User | null = null;
  public registerLoading = false;
  public openModal = false;

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
  // Register the user
  public registerForm: FormGroup;

  ngOnInit(): void {
    this.list();
  }

  constructor() {
    this.registerForm = this.formBuilder.group({
      idCard: [null, [Validators.required, Validators.minLength(10)]],
      firstName: [null, [Validators.required, Validators.minLength(3)]],
      lastName: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      photoUrl: [null],
      phoneNumber: [null, [Validators.minLength(10)]],
    });
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
    this.openModal = true;
  }

  updateLogoUrl(url: string): void {
    this.registerForm.get('photoUrl')?.setValue(url);
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

  getRegisterRequest(): RegisterRequest {
    return {
      idCard: this.registerForm.value.idCard,
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      photoUrl: this.registerForm.value.photoUrl,
      phoneNumber: this.registerForm.value.phoneNumber,
    };
  }

  cancel() {
    this.openModal = false;
  }

  public filterData(value: string) {
    if (!value) this.users = this.users;
    this.users = this.users.filter(
      (b) =>
        b.email.toLowerCase().includes(value.toLowerCase()) ||
        b.displayName?.toLowerCase().includes(value.toLowerCase())
    );
  }

  register() {
    if (!this.validateForm()) return;
    this.registerLoading = true;
    this.authService
      .register(this.getRegisterRequest())
      .pipe(finalize(() => (this.registerLoading = false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.list();
        },
        error: () => {
          this.registerLoading = false;
        },
      });
  }

  /**
   * It loops through all the form controls and marks them as dirty and updates their validity
   * @returns A boolean value.
   */
  private validateForm(): boolean {
    for (const i in this.registerForm.controls) {
      this.registerForm.controls[i].markAsDirty();
      this.registerForm.controls[i].updateValueAndValidity({
        onlySelf: true,
      });
    }
    return this.registerForm.valid;
  }
}

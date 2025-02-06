import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { BehaviorSubject } from 'rxjs';
import { LocalData } from '../../../../data/local/local-data';
import { AuthService } from '../../../../data/src/auth.service';
import { PrimeNgModule } from '../../../../designs/primeng.module';
import { SignInRequest } from '../../../../domain/models/sign-in-request';
import { NgZorroAntdModule } from '../../../../ng-zorro.module';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    CommonModule,
    PrimeNgModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
    NgZorroAntdModule,
  ],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
})
export class SignInComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly message = inject(NzMessageService);
  private readonly localData = inject(LocalData);

  public loading = new BehaviorSubject<boolean>(false);
  public passwordVisible = false;
  public currentYear = new Date().getFullYear();
  public signInForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.signInForm = this.formBuilder.group({
      username: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  public submitForm(): void {
    if (!this.signInForm.valid) return;
    this.loading.next(true);
    this.authService
      .authenticate(
        new SignInRequest(
          this.signInForm.value.username,
          this.signInForm.value.password
        )
      )
      .subscribe({
        next: async (response) => {
          if (response && response.statusCode === 200) {
            const token = response.data.token;
            if (token === null) return;
            this.message.success('Bienvenido');
            this.localData.setToken(token);
            this.loading.next(false);

            this.router.navigate(['/admin']);
          }
        },
        error: (_) => {
          this.loading.next(false);
        },
        complete: () => this.loading.next(false),
      });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}

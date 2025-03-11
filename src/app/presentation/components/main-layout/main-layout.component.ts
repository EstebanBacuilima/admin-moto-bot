import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { LocalData } from '../../../data/local/local-data';
import { NgZorroAntdModule } from '../../../designs/ng-zorro.module';
import { EncourageComponent } from '../../common/encourage/encourage.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, NgZorroAntdModule, EncourageComponent,

    NgZorroAntdModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    NzIconModule,
    NzTagModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  private readonly router = inject(Router);
  private readonly localData = inject(LocalData);

  public isCollapsed = false;

  // (click) = "onProductAttributes(product)"


  public signOut(): void {
    this.localData.clearAll()
    this.router.navigate(['/public/sign-in']);
  }

}

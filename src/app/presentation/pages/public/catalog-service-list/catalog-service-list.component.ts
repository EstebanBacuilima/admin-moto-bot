import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { BehaviorSubject, finalize } from 'rxjs';
import { CategoryService } from '../../../../data/src/category.service';
import { DefaultResponse } from '../../../../domain/common/default-response';
import { Service } from '../../../../domain/entities/service';
import { NgZorroAntdModule } from '../../../../ng-zorro.module';
import { ResponsiveService } from '../../../../services/responsive-service';
import { SimplePageHeaderComponent } from '../../../common/simple-page-header/simple-page-header.component';

@Component({
  selector: 'app-catalog-service-list',
  standalone: true,
  imports: [
    NgZorroAntdModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SimplePageHeaderComponent,
    NzCarouselModule,
    NzTabsModule,
    NzTabsModule],
  templateUrl: './catalog-service-list.component.html',
  styleUrl: './catalog-service-list.component.scss'
})
export class CatalogServiceListComponent {
  private readonly categoryService = inject(CategoryService);
  private readonly route = inject(ActivatedRoute);
  public readonly responsiveService = inject(ResponsiveService);
  private readonly router = inject(Router);

  public loading$ = new BehaviorSubject<boolean>(false);
  public saving = signal(false);
  public defaultResponse: DefaultResponse = new DefaultResponse(200, '');
  public services: Service[] = [];

  ngOnInit(): void {
    this.list();
  }

  public list() {
    this.loading$.next(true);
    this.categoryService
      .listByContainingProducts()
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          this.services = this.defaultResponse.data;
        },
        error: () => (this.services = [])
      });
  }

  onTabClick(index: number): void {
    if (index === 0) {
      this.router.navigate(['/public/home/catalog'],);
    } else {
      const category = this.services[index - 1];

      this.router.navigate(['/public/home/catalog/' + category.code]);
    }
  }
}

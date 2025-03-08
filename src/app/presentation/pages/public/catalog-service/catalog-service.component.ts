import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { BehaviorSubject, finalize } from 'rxjs';
import { ServiceService } from '../../../../data/src/service.service';
import { DefaultResponse } from '../../../../domain/common/default-response';
import { Service } from '../../../../domain/entities/service';
import { ResponsiveService } from '../../../../services/responsive-service';
import { EmptyDataComponent } from '../../../common/empty-data/empty-data.component';
@Component({
  selector: 'app-catalog-service',
  standalone: true,
  imports: [
    CommonModule,
    NzAvatarModule,
    NzCardModule,
    NzButtonModule,
    NzGridModule,
    NzCarouselModule,
    NzIconModule,
    NzTabsModule,
    NzDividerModule, EmptyDataComponent,

    FormsModule,
    ReactiveFormsModule,
    NzInputModule,],
  templateUrl: './catalog-service.component.html',
  styleUrl: './catalog-service.component.scss'
})
export class CatalogServiceComponent {
  private readonly serviceService = inject(ServiceService);
  public readonly responsiveService = inject(ResponsiveService);

  public loading$ = new BehaviorSubject<boolean>(false);
  public saving = signal(false);
  public selectedCategoryId = signal(0);

  public defaultResponse: DefaultResponse = new DefaultResponse(200, '');
  public services: Service[] = [];
  public auxServices: Service[] = [];

  private searchDebounceTimer: any;
  inputValue: string = '';

  ngOnInit(): void {
    this.list();
  }

  public list() {
    this.loading$.next(true);
    this.serviceService
      .listActive()
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          this.services = this.defaultResponse.data;
          this.auxServices = this.services;
        },
        error: () => (this.services = [])
      })
  }


  public onSearchChanged(value: any) {
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
    this.searchDebounceTimer = setTimeout(() => {
      this.filterData(value);
    }, 800);
  }

  public filterData(value: string) {
    if (!value) this.services = this.auxServices;

    this.services = this.auxServices.filter(b =>
      b.name.toLowerCase().includes(value.toLowerCase()) ||
      b.description?.toLowerCase().includes(value.toLowerCase()));
  }
}

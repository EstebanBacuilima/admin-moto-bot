import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { CategoryService } from '../../../../data/src/category.service';
import { ProductService } from '../../../../data/src/product.service';
import { DefaultResponse } from '../../../../domain/common/default-response';
import { Category } from '../../../../domain/entities/category';
import { Product } from '../../../../domain/entities/product';
import { NgZorroAntdModule } from '../../../../ng-zorro.module';
import { ResponsiveService } from '../../../../services/responsive-service';
import { EmptyDataComponent } from '../../../common/empty-data/empty-data.component';
import { SpinComponent } from '../../../common/spin/spin.component';
import { CatalogServiceListComponent } from '../catalog-service-list/catalog-service-list.component';

@Component({
  selector: 'app-catalog-product-list',
  standalone: true,
  imports: [CommonModule,
    NzAvatarModule,
    NzCardModule,
    NzButtonModule,
    NzGridModule,
    NzCarouselModule,
    NzIconModule,
    NzTabsModule,
    NzDividerModule,
    CatalogServiceListComponent,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    NzInputModule,
    EmptyDataComponent,
    SpinComponent],
  templateUrl: './catalog-product-list.component.html',
  styleUrl: './catalog-product-list.component.scss'
})
export class CatalogProductListComponent {
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  public readonly responsiveService = inject(ResponsiveService);

  public loading$ = new BehaviorSubject<boolean>(false);
  public saving = signal(false);
  public selectedCategoryId = signal(0);

  public defaultResponse: DefaultResponse = new DefaultResponse(200, '');
  public products: Product[] = [];
  public auxProducts: Product[] = [];
  public categories: Category[] = [];
  public category: Category | null = null;
  private searchDebounceTimer: any;


  selectedValue: any = null;
  inputValue: string = '';

  // @Input() category!: Category;
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const code = params.get('code');
      if (code) {
        this.getCategoryByCode(code);
        this.listProductsByCategoryCode(code);
      }
    });
  }

  // ngOnChanges(): void {

  //   this.filterData(this.inputValue);
  // }

  public listProductsByCategoryCode(code: string) {
    this.loading$.next(true);
    this.categoryService
      .listProductsByCategoryCode(code)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          this.products = this.defaultResponse.data
          this.auxProducts = this.products;
        },
        error: () => (this.products = [])
      })
  }

  public getCategoryByCode(code: string) {
    this.loading$.next(true);
    this.categoryService
      .findByCode(code)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          return (this.category = this.defaultResponse.data)
        },
        error: () => (this.category = null)
      })
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }


  public calculateDiscount(price: number, discount?: number): number {
    if (!discount) return price;
    return price - (price * discount) / 100;
  }

  public listSeverityLeve: any[] = [
    { id: 1, value: 'NOMBRE, ascendente' },
    { id: 2, value: 'NOMBRE, descendente' },
    { id: 3, value: 'PRECIO: menor a mayor' },
    { id: 4, value: 'PRECIO: mayor a menor' },
  ];

  onFilterChange(value: any) {
    if (value === 1 || value === 2) {
      this.sortAscProducts(value === 1);
    }

    if (value == 3 || value === 4) {
      this.sortAscPriceProducts(value == 3);
    }
  }

  public sortAscProducts(asc: boolean) {
    if (asc) {
      this.products.sort((a, b) => b.name.localeCompare(a.name));
      return;
    }
    this.products.sort((a, b) => a.name.localeCompare(b.name));
  }

  public sortAscPriceProducts(asc: boolean) {
    this.products.sort((a, b) => {
      return asc ? this.calculateDiscount(a.price, a.percentage) - this.calculateDiscount(b.price, b.percentage) : this.calculateDiscount(b.price, b.percentage) - this.calculateDiscount(a.price, a.percentage);
    });
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
    if (!value) this.products = this.auxProducts;

    this.products = this.auxProducts.filter(b =>
      b?.category?.name.toLowerCase().includes(value.toLowerCase()) ||
      b?.brand?.name.toLowerCase().includes(value.toLowerCase()) ||
      b.name.toLowerCase().includes(value.toLowerCase()) ||
      b.description?.toLowerCase().includes(value.toLowerCase()));
  }
}

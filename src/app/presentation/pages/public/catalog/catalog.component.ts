import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { BehaviorSubject, finalize } from 'rxjs';
import { CategoryService } from '../../../../data/src/category.service';
import { ProductService } from '../../../../data/src/product.service';
import { DefaultResponse } from '../../../../domain/common/default-response';
import { Category } from '../../../../domain/entities/category';
import { Product } from '../../../../domain/entities/product';
import { ResponsiveService } from '../../../../services/responsive-service';
import { CarouselComponent } from '../../../common/carousel/carousel.component';


@Component({
  selector: 'app-catalog',
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
    NzDividerModule,
    CarouselComponent
  ],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent {
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
  public categories: Category[] = [];

  // @Input() category!: Category;
  // public selectedCategory = signal<Category | null>(null);

  ngOnInit(): void {

    // this.route.paramMap.subscribe(params => {
    //   const code = params.get('code');
    //   if (code) {
    //     // this.(this.productCode);
    //     this.listProductsByCategoryCode(code);
    //   }
    // });
  }

  public listCategories() {
    this.loading$.next(true);
    this.categoryService
      .list()
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          return (this.categories = this.defaultResponse.data)
        },
        error: () => (this.categories = [])
      })
  }

  public listProductsByCategoryCode(code: string) {
    this.loading$.next(true);
    this.categoryService
      .listProductsByCategoryCode(code)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          return (this.products = this.defaultResponse.data)
        },
        error: () => (this.products = [])
      })
  }

  selectCategory(id: number) {
    this.selectedCategoryId.set(id)
    // this.listProductsByCategory(id);
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}

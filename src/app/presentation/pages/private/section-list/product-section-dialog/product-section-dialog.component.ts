import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { BehaviorSubject, finalize } from 'rxjs';
import { ProductSectionService } from '../../../../../data/src/product-section.service';
import { ProductService } from '../../../../../data/src/product.service';
import { DefaultResponse } from '../../../../../domain/common/default-response';
import { Product } from '../../../../../domain/entities/product';
import { ResponsiveService } from '../../../../../services/responsive-service';

@Component({
  selector: 'app-product-section-dialog',
  standalone: true,
  imports: [NzButtonModule, NzModalModule, NzButtonModule, NzListModule, NzSwitchModule, FormsModule, NzTagModule],
  templateUrl: './product-section-dialog.component.html',
  styleUrl: './product-section-dialog.component.scss'
})
export class ProductSectionDialogComponent {

  private readonly productService = inject(ProductService);
  private readonly productSectionService = inject(ProductSectionService);
  public readonly responsiveService = inject(ResponsiveService);
  public loading$ = new BehaviorSubject<boolean>(false);
  public defaultResponse: DefaultResponse = new DefaultResponse(200, '');

  public products: Product[] = [];

  public productIds: number[] = [];

  private searchDebounceTimer: any;
  public searchText: string = '';

  isVisible = false;
  isOkLoading = false;

  ngOnInit(): void {
    this.productIdsBySection(1);
    this.productList();
    setTimeout(() => {
      this.buildProductSections();
    }, 3000);
  }

  public productIdsBySection(sectionId: number) {
    this.loading$.next(true);
    this.productSectionService
      .listProductIdsBySection(sectionId)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          return (this.productIds = this.defaultResponse.data);
        },
        error: () => (this.productIds = []),
      });
  }

  public productList() {
    this.loading$.next(true);
    this.productService
      .listAll()
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          return (this.products = this.defaultResponse.data);
        },
        error: () => (this.products = []),
      });
  }

  public buildProductSections() {
    const updatedProductList = this.products.map(product => ({
      ...product,
      changeActive: this.productIds.includes(product.id) ? true : product.changedActive
    }));
    console.log(updatedProductList);
    this.products = updatedProductList;
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;

    console.log(this.products);
    // setTimeout(() => {
    //   this.isVisible = false;
    //   this.isOkLoading = false;
    // }, 3000);
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}

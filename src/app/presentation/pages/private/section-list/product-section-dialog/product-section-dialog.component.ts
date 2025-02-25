import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
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
  imports: [NzButtonModule,
    NzModalModule,
    NzButtonModule,
    NzListModule,
    NzSwitchModule,
    FormsModule,
    NzTagModule],
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

  @Input('sectionId') sectionId: number = 0;

  @Output() onClose: EventEmitter<number> = new EventEmitter<number>();

  ngOnChanges(): void {
    if (this.sectionId !== 0) {
      this.productIdsBySection(this.sectionId);
      this.productList();
    }

    if (this.productIds.length > 0 && this.productIds.length > 0) {
      this.buildProductSections();
    }
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
          this.products = this.defaultResponse.data;
          this.buildProductSections();

        },
        error: () => (this.products = []),
      });
  }

  public buildProductSections() {
    // setTimeout(() => {
    const updatedProductList = this.products.map(product => ({
      ...product,
      changedActive: this.productIds.includes(product.id) ? true : false
    }));
    this.products = updatedProductList;
    // }, 150);

  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;

    this.onBulkCreate();
  }

  public onBulkCreate() {
    const productIds = this.products.filter(p => p.changedActive).map(p => p.id);

    if (productIds.length === 0) this.handleCancel();

    this.loading$.next(true);
    this.productSectionService
      .bulkCreate(productIds, this.sectionId)
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          this.isVisible = false;
          this.isOkLoading = false;
          this.onClose.emit(productIds.length);
        },
        error: () => (this.isOkLoading = true)
      })
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  onToggleStatus(product: any) {
    product.changedActive = !product.changedActive;
  }
}

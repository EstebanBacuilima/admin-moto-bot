import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { BehaviorSubject, finalize } from 'rxjs';
import { BrandService } from '../../../../data/src/brand.service';
import { CategoryService } from '../../../../data/src/category.service';
import { ProductService } from '../../../../data/src/product.service';
import { DefaultResponse } from '../../../../domain/common/default-response';
import { Brand } from '../../../../domain/entities/brand';
import { Category } from '../../../../domain/entities/category';
import { Product } from '../../../../domain/entities/product';
import { Service } from '../../../../domain/entities/service';
import { NgZorroAntdModule } from '../../../../ng-zorro.module';
import { ResponsiveService } from '../../../../services/responsive-service';
import { SimplePageHeaderComponent } from '../../../common/simple-page-header/simple-page-header.component';
import { ProductFile } from '../../../../domain/entities/product_file';
import { MultipleUploadFileComponent } from '../../../common/multiple-upload-file/multiple-upload-file.component';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    NgZorroAntdModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    SimplePageHeaderComponent,
    MultipleUploadFileComponent,
    NzIconModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  private readonly productService = inject(ProductService);
  private readonly brandService = inject(BrandService);
  private readonly categoryService = inject(CategoryService);

  public readonly responsiveService = inject(ResponsiveService);
  private readonly formBuilder = inject(FormBuilder);

  public loading$ = new BehaviorSubject<boolean>(false);
  public saving = signal(false);

  public defaultResponse: DefaultResponse = new DefaultResponse(200, '');
  public products: Product[] = [];
  public productImages: ProductFile[] = [];
  public productImageUrls: string[] = [];
  public categories: Category[] = [];
  public brands: Brand[] = [];

  private searchDebounceTimer: any;
  public searchText: string = '';
  public openModal = false;
  public selectedProduct: Product | null = null;

  public productForm: UntypedFormGroup = this.formBuilder.group({
    name: [null, [Validators.required, Validators.minLength(3)]],
    description: [null, [Validators.minLength(2)]],
    brand_id: [null, [Validators.required]],
    category_id: [null, [Validators.required]],
    price: [null, [Validators.required]],
    active: [true, [Validators.required]],
    sku: [true, [Validators.required]],
  });

  public listOfColumn = [
    {
      title: 'Imágenes',
      compare: (a: Service, b: Service) =>
        a.name ? a.name.localeCompare(b.name) : 0,
      priority: false,
    },
    {
      title: 'Nombre',
      compare: (a: Service, b: Service) =>
        a.name ? a.name.localeCompare(b.name) : 0,
      priority: false,
    },
    {
      title: 'Descripción',
      compare: (a: Service, b: Service) =>
        a.description ? a.description.localeCompare(b.description ?? '') : 0,
      priority: 1,
    },
  ];

  public onProductFilesChange(urls: string[]): void {
    // Set the product images
    this.productImages = [];
    urls.forEach((url) => {
      this.productImages.push(
        new ProductFile(
          0,
          this.selectedProduct?.id ?? 0,
          '',
          url,
          '',
          true,
          new Date(),
          new Date()
        )
      );
    });
  }

  ngOnInit(): void {
    this.listBrands();
    this.listCategories();
    this.list();
  }

  public list() {
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

  // List Brands
  public listBrands() {
    this.loading$.next(true);
    this.brandService
      .list()
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          return (this.brands = this.defaultResponse.data);
        },
        error: () => (this.brands = []),
      });
  }

  // List Categories
  public listCategories() {
    this.loading$.next(true);
    this.categoryService
      .list()
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          return (this.categories = this.defaultResponse.data);
        },
        error: () => (this.categories = []),
      });
  }

  public onActiveChange(product: Product, state: boolean) {
    product.changedActive = true;
    this.productService
      .changeState(state, product.code)
      .pipe(finalize(() => (product.changedActive = false)))
      .subscribe({
        next: (response) => {
          if (response.statusCode !== 200) return;
          product.active = state;
        },
      });
  }

  public saveOrUpdate(): void {
    if (!this.validateForm()) {
      return;
    }
    if (this.saving()) return;
    this.saving.set(true);
    if (this.selectedProduct) {
      this.update();
    } else {
      this.create();
    }
  }

  private update(): void {
    this.productService
      .update(this.getProduct())
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          if (response.statusCode !== 200) return;
          this.openModal = false;
          this.list();
        },
      });
  }

  private create(): void {
    this.productService
      .create(this.getProduct())
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          if (response.statusCode !== 200) return;
          this.openModal = false;
          this.list();
        },
      });
  }

  public onSearchChanged(value: string) {
    this.searchText = value;
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
    this.searchDebounceTimer = setTimeout(() => {
      this.list();
    }, 800);
  }

  private validateForm(): boolean {
    for (const i in this.productForm.controls) {
      this.productForm.controls[i].markAsDirty();
      this.productForm.controls[i].updateValueAndValidity({
        onlySelf: true,
      });
    }
    return this.productForm.valid;
  }

  private fillForm(): void {
    this.productForm.get('name')?.setValue(this.selectedProduct?.name);
    this.productForm
      .get('description')
      ?.setValue(this.selectedProduct?.description);
    this.productForm.get('active')?.setValue(this.selectedProduct?.active);
    this.productForm
      .get('category_id')
      ?.setValue(this.selectedProduct?.categoryId);
    this.productForm.get('brand_id')?.setValue(this.selectedProduct?.brandId);
    this.productForm.get('price')?.setValue(this.selectedProduct?.price);
    this.productForm.get('sku')?.setValue(this.selectedProduct?.sku);
    this.productImages = this.selectedProduct?.productFiles ?? [];
    this.productImageUrls = this.productImages.map((image) => image.url);
  }

  private getProduct(): Product {
    return new Product(
      this.selectedProduct?.id ?? 0,
      this.productForm.get('category_id')?.value,
      this.productForm.get('brand_id')?.value,
      this.selectedProduct?.code ?? '',
      this.productForm.get('name')?.value,
      this.productForm.get('sku')?.value,
      false,
      this.productForm.get('active')?.value,
      this.productImages,
      this.productForm.get('price')?.value,
      this.productForm.get('description')?.value
    );
  }

  public onEdit(product: Product) {
    this.selectedProduct = product;
    this.openModal = true;
    this.fillForm();
  }

  public add() {
    this.openModal = true;
  }

  public cancel() {
    this.openModal = false;
    this.selectedProduct = null;
    this.list();
  }

  public generateSku(length: number = 15) {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      code += chars[randomIndex];
    }
    this.productForm.get('sku')?.setValue(code);
  }
}

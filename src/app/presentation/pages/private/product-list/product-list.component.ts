import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { BehaviorSubject, finalize } from 'rxjs';
import { AttributeService } from '../../../../data/src/attribute.service';
import { BrandService } from '../../../../data/src/brand.service';
import { CategoryService } from '../../../../data/src/category.service';
import { ProductService } from '../../../../data/src/product.service';
import { ProductAttributeService } from '../../../../data/src/product_attribute.service';
import { DefaultResponse } from '../../../../domain/common/default-response';
import { Attribute } from '../../../../domain/entities/attribute';
import { Brand } from '../../../../domain/entities/brand';
import { Category } from '../../../../domain/entities/category';
import { Product } from '../../../../domain/entities/product';
import { ProductAttribute } from '../../../../domain/entities/product_attribute';
import { ProductImage } from '../../../../domain/entities/product_image';
import { NgZorroAntdModule } from '../../../../ng-zorro.module';
import { ResponsiveService } from '../../../../services/responsive-service';
import { MultipleUploadFileComponent } from '../../../common/multiple-upload-file/multiple-upload-file.component';
import { SimplePageHeaderComponent } from '../../../common/simple-page-header/simple-page-header.component';

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
    NzTagModule
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent {
  private readonly productService = inject(ProductService);
  private readonly brandService = inject(BrandService);
  private readonly categoryService = inject(CategoryService);

  private readonly productAttributeService = inject(ProductAttributeService);
  private readonly attributeService = inject(AttributeService);

  public readonly responsiveService = inject(ResponsiveService);
  private readonly formBuilder = inject(FormBuilder);

  public loading$ = new BehaviorSubject<boolean>(false);
  public loadingPa$ = new BehaviorSubject<boolean>(false);
  public saving = signal(false);

  public defaultResponse: DefaultResponse = new DefaultResponse(200, '');
  public products: Product[] = [];
  public auxProducts: Product[] = [];
  public productImages: ProductImage[] = [];
  public productImageUrls: string[] = [];
  public categories: Category[] = [];
  public brands: Brand[] = [];
  public attributes: Attribute[] = [];
  public productAttributes: ProductAttribute[] = [];

  private searchDebounceTimer: any;
  public searchText: string = '';
  public openModal = false;
  public selectedProduct: Product | null = null;

  // Product Attribute
  public currentProductId = 0;

  public openProductAttributes = false;
  public openProductAttributeForm = false;

  public selectedProductAttribute: ProductAttribute | null = null;

  public isEditProductAttribute = false;

  public productForm: UntypedFormGroup = this.formBuilder.group({
    name: [null, [Validators.required, Validators.minLength(3)]],
    description: [null, [Validators.minLength(2)]],
    brand_id: [null, [Validators.required]],
    category_id: [null, [Validators.required]],
    price: [null, [Validators.required]],
    percentage: [null,],
    sku: [null, [Validators.required]],
  });

  public productAttributeForm: UntypedFormGroup = this.formBuilder.group({
    attribute_id: [null, [Validators.required]],
    value: [null, [Validators.required]],
  });

  public listOfColumn = [
    {
      title: 'Imágenes',
      compare: (a: Product, b: Product) =>
        a.name ? a.name.localeCompare(b.name) : 0,
      priority: false,
    },
    {
      title: 'Nombre',
      compare: (a: Product, b: Product) =>
        a.name ? a.name.localeCompare(b.name) : 0,
      priority: false,
    },
    {
      title: 'Descripción',
      compare: (a: Product, b: Product) =>
        a.description ? a.description.localeCompare(b.description ?? '') : 0,
      priority: 1,
    },
    {
      title: 'Precio',
      compare: (a: Product, b: Product) =>
        a.price,
      priority: 1,
    },

  ];

  public listOfColumnAttributes = [
    {
      title: 'Atributo',

      compare: (a: ProductAttribute, b: ProductAttribute) =>
        a.attribute.name ? a.attribute.name.localeCompare(a.attribute.name) : 0,
      priority: false,
    },
    {
      title: 'Valor del atributo',
      compare: (a: ProductAttribute, b: ProductAttribute) =>
        a.value ? a.value.localeCompare(b.value ?? '') : 0,
      priority: 1,
    },
  ];

  public onProductFilesChange(urls: string[]): void {
    // Set the product images
    this.productImages = [];
    urls.forEach((url) => {
      this.productImages.push(
        new ProductImage(
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
          this.products = this.defaultResponse.data;
          this.auxProducts = this.products;
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

  public onSearchChanged(value: string, isProduct: boolean) {
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
    this.searchDebounceTimer = setTimeout(() => {
      if (isProduct) this.filterData(value)
      if (!isProduct) {
        this.searchText = value;

        this.listProductAttributes();
      }
    }, 800);
  }

  public filterData(value: string) {
    if (!value) this.products = this.auxProducts;

    this.products = this.auxProducts.filter(b =>
      b.name.toLowerCase().includes(value.toLowerCase()) ||
      b.description?.toLowerCase().includes(value.toLowerCase()));
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
    this.productForm
      .get('category_id')
      ?.setValue(this.selectedProduct?.categoryId);
    this.productForm.get('brand_id')?.setValue(this.selectedProduct?.brandId);
    this.productForm.get('price')?.setValue(this.selectedProduct?.price);
    this.productForm.get('sku')?.setValue(this.selectedProduct?.sku);
    this.productForm.get('percentage')?.setValue(this.selectedProduct?.percentage);
    this.productImages = this.selectedProduct?.productImages ?? [];
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
      this.selectedProduct?.active ?? false,
      this.productImages,
      [],
      this.productForm.get('price')?.value,
      this.productForm.get('description')?.value,
      this.productForm.get('percentage')?.value,
    );
  }

  public onEdit(product: Product) {
    this.selectedProduct = product;
    this.openModal = true;
    this.fillForm();
  }

  public add() {
    this.openModal = true;
    this.resetForm();
  }

  public cancel() {
    this.openModal = false;
    this.resetForm();
    this.list();
  }


  public resetForm() {
    if (this.productForm) {
      this.productForm.reset();
    }
    this.selectedProduct = null;
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

  // Open product Attribute
  // public openProductAttributes = false;
  // public openProductAttributeForm = false;

  // public selectedProductAttribute = ProductAttribute || null;


  // Product attributes ----------------------------------------------------------------------------------------------
  public onProductAttributes(product: Product) {
    this.currentProductId = product.id;
    this.listProductAttributes();
    this.listAttributes();
    this.openProductAttributes = true;
  }

  public cancelProductAttributes() {
    this.openProductAttributes = false;
  }

  public listProductAttributes() {
    this.loadingPa$.next(true);
    this.productAttributeService
      .listByProduct(this.currentProductId, this.searchText)
      .pipe(finalize(() => this.loadingPa$.next(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          return (this.productAttributes = this.defaultResponse.data);
        },
        error: () => (this.productAttributes = []),
      });
  }

  public listAttributes() {
    this.loadingPa$.next(true);
    this.attributeService
      .list()
      .pipe(finalize(() => this.loadingPa$.next(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          return (this.attributes = this.defaultResponse.data);
        },
        error: () => (this.attributes = []),
      });
  }

  public onActiveChangeProductAttribute(productAttribute: ProductAttribute, state: boolean) {
    productAttribute.changedActive = true;
    this.productAttributeService
      .changeState(state, productAttribute.productId, productAttribute.attributeId)
      .pipe(finalize(() => (productAttribute.changedActive = false)))
      .subscribe({
        next: (response) => {
          if (response.statusCode !== 200) return;
          productAttribute.active = state;
        },
      });
  }

  public saveOrUpdateProductAttribute(): void {
    if (!this.validateProductAttributeForm()) {
      return;
    }
    if (this.saving()) return;
    this.saving.set(true);
    if (this.selectedProductAttribute) {
      this.updateProductAttribute();
    } else {
      this.createProductAttribute();
    }
  }

  private updateProductAttribute(): void {
    this.productAttributeService
      .update(this.getProductAttribute())
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          if (response.statusCode !== 200) return;
          this.openProductAttributeForm = false;
          this.listProductAttributes();
        },
      });
  }

  private createProductAttribute(): void {
    this.productAttributeService
      .create(this.getProductAttribute())
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: (response) => {
          if (response.statusCode !== 200) return;
          this.openProductAttributeForm = false;
          this.listProductAttributes();
        },
      });
  }

  private validateProductAttributeForm(): boolean {
    for (const i in this.productAttributeForm.controls) {
      this.productAttributeForm.controls[i].markAsDirty();
      this.productAttributeForm.controls[i].updateValueAndValidity({
        onlySelf: true,
      });
    }
    return this.productAttributeForm.valid;
  }

  private getProductAttribute(): ProductAttribute {
    return new ProductAttribute(
      this.currentProductId,
      this.productAttributeForm.get('attribute_id')?.value,
      this.productAttributeForm.get('value')?.value,
      this.selectedProductAttribute?.active ?? true,
      {} as Attribute,
      false
    );
  }

  private fillProductAttributeForm(): void {
    this.productAttributeForm.get('value')?.setValue(this.selectedProductAttribute?.value);
    this.productAttributeForm
      .get('attribute_id')
      ?.setValue(this.selectedProductAttribute?.attributeId);

  }

  public onEditProductAttribute(productAttribute: ProductAttribute) {
    this.selectedProductAttribute = productAttribute;
    this.openProductAttributeForm = true;
    // this.isEditProductAttribute = true;
    this.productAttributeForm.get('attribute_id')?.disable();

    this.fillProductAttributeForm();
  }

  public addProductAttribute() {
    this.openProductAttributeForm = true;
    this.resetProductAttributeForm();
    // this.isEditProductAttribute = false;

    this.productAttributeForm.get('attribute_id')?.enable();
    // this.serviceForm.get('active')?.setValue(true);

  }

  public cancelProductAttribute() {
    this.openProductAttributeForm = false;
    this.resetProductAttributeForm();
    // this.list();
  }

  public resetProductAttributeForm() {
    if (this.productAttributeForm) {
      this.productAttributeForm.reset();
    }
    this.selectedProductAttribute = null;

  }
}

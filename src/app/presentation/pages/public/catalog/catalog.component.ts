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
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { BehaviorSubject, finalize } from 'rxjs';
import { ProductService } from '../../../../data/src/product.service';
import { SectionService } from '../../../../data/src/section.service';
import { DefaultResponse } from '../../../../domain/common/default-response';
import { Product } from '../../../../domain/entities/product';
import { Section } from '../../../../domain/entities/section';
import { ResponsiveService } from '../../../../services/responsive-service';
import { CarouselComponent } from '../../../common/carousel/carousel.component';
import { CatalogServiceListComponent } from '../catalog-service-list/catalog-service-list.component';
import { TestComponent } from '../test/test.component';

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
    CarouselComponent,
    CatalogServiceListComponent,
    ButtonModule,
    CarouselModule,
    TestComponent
  ],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent {
  private readonly sectionService = inject(SectionService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  private readonly productService = inject(ProductService);
  public readonly responsiveService = inject(ResponsiveService);

  public loading$ = new BehaviorSubject<boolean>(false);
  public saving = signal(false);
  public selectedCategoryId = signal(0);

  public defaultResponse: DefaultResponse = new DefaultResponse(200, '');
  public products: Product[] = [];
  public sections: Section[] = [];


  offers = [
    {
      title: 'BICICLETA EBIKE CUBE HYBRID STEREO ONES55 SLX',
      price: '$10,005.00',
      image: 'https://via.placeholder.com/150' // URL de imagen placeholder
    },
    {
      title: 'JP CHENET FASHION STRAWB - RASPB 750 ML',
      price: '$13.23',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'VENTISQUERO CABERNET SAUVIGNON 750ML',
      price: '$7.39',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'VENTISQUERO CLASICO MERLOT 750ML',
      price: '$7.39',
      image: 'https://via.placeholder.com/150'
    },
    {
      title: 'ANTHONY VINO FRIZZANTE MORA 750 ML',
      price: '$6.70',
      image: 'https://via.placeholder.com/150'
    }
  ];

  ngOnInit(): void {
    this.list();
  }

  public list() {
    this.loading$.next(true);
    this.sectionService
      .listIncludingProduct()
      .pipe(finalize(() => this.loading$.next(false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          return (this.sections = this.defaultResponse.data)
        },
        error: () => (this.sections = [])
      })
  }


  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}

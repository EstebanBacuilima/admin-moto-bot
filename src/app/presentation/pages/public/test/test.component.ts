import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, // Necesario para *ngFor
    NzCarouselModule, // Para el carrusel
    NzCardModule, // Para las tarjetas
    NzButtonModule, // Para el botón
    NzIconModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.scss'
})
export class TestComponent {
  products = [
    { name: 'Bicicleta Ebike Cube Hybrid Stereo Ones55 SLX', price: '$10,005.00', image: 'https://via.placeholder.com/150' },
    { name: 'JP Chenet Fashion Strawb - Rasbp 750 ml', price: '$13.23', image: 'https://via.placeholder.com/150' },
    { name: 'Ventisquero Cabernet Sauvignon 750ml', price: '$7.39', image: 'https://via.placeholder.com/150' },
    { name: 'Ventisquero Clasico Merlot 750ml', price: '$7.39', image: 'https://via.placeholder.com/150' },
    { name: 'Anthony Vino Frizzante Mora 750 ml', price: '$6.70', image: 'https://via.placeholder.com/150' },
    { name: 'Producto Extra 1', price: '$8.99', image: 'https://via.placeholder.com/150' },
    { name: 'Producto Extra 2', price: '$5.50', image: 'https://via.placeholder.com/150' }
  ];

  // Agrupar productos en grupos de 4 para cada slide del carrusel
  getGroupedProducts() {
    const groupSize = 4; // Similar a itemsPerPage en VTEX
    const grouped = [];
    for (let i = 0; i < this.products.length; i += groupSize) {
      grouped.push(this.products.slice(i, i + groupSize));
    }
    return grouped;
  }
}

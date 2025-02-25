import { Component } from '@angular/core';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [NzCarouselModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent {
  carouselImages = [
    "https://cdn.globalbajaj.com/-/media/Mexico/Images/Pulsar/NUEVAS_PULSAR_UG.PNG?h=1080&iar=0&w=1920&rev=b4dfd7b73873471aa9084342034e4884&hash=BEFC628373B8965F3AD927640B5001B6",
    "https://cdn.globalbajaj.com/-/media/Mexico/Images/News/La_Juventud/compra-pulsar-n250-haz-de-tus-viajes-la-mejor-experiencia/Conquista-la-ciudad-con-la-potencia-y-calidad-de-la-Pulsar-N250.jpg?h=1080&iar=0&w=1920&rev=471071738a8d48369d6942e7ad5c11db&hash=074C365574824B789219FCB3B4DA8BC6"
  ];
  effect = 'scrollx';
}

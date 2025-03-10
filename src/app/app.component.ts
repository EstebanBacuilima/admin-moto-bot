import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import * as AOS from 'aos';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  ngOnInit() {
    AOS.init({
      // Configuración global para AOS
      duration: 1000, // valores en ms
      easing: 'ease-in-out',
      once: true, // si la animación debe ocurrir solo una vez
      // más opciones en: https://github.com/michalsnik/aos#options
    });
  }
}

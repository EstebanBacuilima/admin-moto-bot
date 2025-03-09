import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgZorroAntdModule } from '../../../designs/ng-zorro.module';
import { EncourageComponent } from '../../common/encourage/encourage.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, NgZorroAntdModule, EncourageComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent {
  public isCollapsed = false;
}

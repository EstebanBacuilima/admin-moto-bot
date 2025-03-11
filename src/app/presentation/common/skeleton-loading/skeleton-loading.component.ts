import { NgZorroAntdModule } from './../../../ng-zorro.module';
import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton-loading',
  standalone: true,
  imports: [NgZorroAntdModule],
  templateUrl: './skeleton-loading.component.html',
  styleUrl: './skeleton-loading.component.css',
})
export class SkeletonLoadingComponent {}

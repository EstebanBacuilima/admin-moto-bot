import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [NzButtonModule, NzIconModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  private readonly router = inject(Router);

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}

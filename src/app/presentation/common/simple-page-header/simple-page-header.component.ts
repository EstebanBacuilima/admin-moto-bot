import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from '../../../ng-zorro.module';

@Component({
  selector: 'app-simple-page-header',
  standalone: true,
  imports: [NgZorroAntdModule, CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './simple-page-header.component.html',
  styleUrl: './simple-page-header.component.scss',
})
export class SimplePageHeaderComponent {
  public title = input.required<String>();
  public disable = input<Boolean>(true);
  public searchPlaceholder = input.required<string>();
  public add = output<void>();
  public searchChange = output<string>();
  public currentSearchValue: string = '';

  /**
   * Emits the current search value to the `searchChange` output every time
   * the user types something in the search input.
   * @param value the new search value
   */
  onSearchChange(value: string): void {
    this.currentSearchValue = value;
    this.searchChange.emit(this.currentSearchValue);
  }

  /**
   * Clears the current search value and emits an empty string to the
   * `searchChange` output.
   */
  clearSearch(): void {
    this.currentSearchValue = '';
    this.searchChange.emit(this.currentSearchValue);
  }
}

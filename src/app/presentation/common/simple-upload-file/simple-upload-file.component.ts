import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from '../../../ng-zorro.module';
import { SimpleFileComponent } from '../simple-file/simple-file.component';

@Component({
  selector: 'app-simple-upload-file',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgZorroAntdModule,
    ReactiveFormsModule,
    SimpleFileComponent,
  ],
  templateUrl: './simple-upload-file.component.html',
  styleUrl: './simple-upload-file.component.scss',
})
export class SimpleUploadFileComponent {
  public isVisible: boolean = false;
  public loading: boolean = false;
  public isConfirmationVisible: boolean = false;
  public outputImageUrl = output<string>();

  public urlFile: string = '';
  public url: string = '';

  public tabs = [
    {
      name: 'Archivos',
      icon: 'cloud-upload',
    },
    {
      name: 'Adjuntar Link',
      icon: 'link',
    },
  ];

  public handleUpload(url: string) {
    this.isVisible = false;
    this.outputImageUrl.emit(url);
  }

  public onMainModalCancel(): void {
    if (this.urlFile || this.url) {
      this.isConfirmationVisible = true;
    } else {
      this.isVisible = false;
    }
  }

  public urlEmit(url: string) {
    this.urlFile = url;
  }

  public cancelUpload(): void {
    this.urlFile = '';
    this.url = '';
    this.isConfirmationVisible = false;
    this.isVisible = false;
  }

  public confirmAndSave(): void {
    if (this.urlFile) {
      this.handleUpload(this.urlFile);
    } else if (this.url) {
      this.handleUpload(this.url);
    }
    this.isConfirmationVisible = false;
    this.isVisible = false;
  }
}

import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { finalize } from 'rxjs';
import { NgZorroAntdModule } from '../../../ng-zorro.module';
import { FileService } from '../../../data/src/file.service';

@Component({
  selector: 'app-simple-file',
  standalone: true,
  imports: [CommonModule, NgZorroAntdModule],
  templateUrl: './simple-file.component.html',
  styleUrl: './simple-file.component.css',
})
export class SimpleFileComponent {
  private readonly fileService = inject(FileService);
  private readonly message = inject(NzMessageService);

  public inputUrl = input<string>();
  public outputUrl = output<string>();

  public loading = false;
  public previewImage?: string;
  public savedFiles: string[] = [];
  public fileList: NzUploadFile[] = [];
  public totalDeleted = 0;

  ngOnChanges(): void {
    this.previewImage = this.inputUrl() ?? '';
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [];
    this.fileList = this.fileList.concat(file);
    if (this.previewImage) {
      if (this.previewImage.trim().length > 0) {
        this.deleteFiles([this.previewImage]);
      }
    }
    this.uploadFile(this.fileList);
    return false;
  };

  /** Upload file */
  private uploadFile(fileList: any): void {
    this.loading = true;
    this.fileService
      .uploadFiles(fileList)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (response) => {
          if (response.statusCode !== 200) return;
          this.savedFiles = response.data;
          this.previewImage = this.savedFiles[0];
          this.outputUrl.emit(this.previewImage ?? '');
          this.message.success('Imagen subida exitosamente');
        },
        error: () => {
          this.message.error('Error al subir la imagen');
          this.loading = false;
        },
      });
  }

  public deleteFiles(urls: string[]): void {}
}

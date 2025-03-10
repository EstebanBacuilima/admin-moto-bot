import { Component, inject, input, output } from '@angular/core';
import { NgZorroAntdModule } from '../../../ng-zorro.module';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FileService } from '../../../data/src/file.service';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-multiple-upload-file',
  standalone: true,
  imports: [CommonModule, NgZorroAntdModule],
  templateUrl: './multiple-upload-file.component.html',
  styleUrl: './multiple-upload-file.component.scss',
})
export class MultipleUploadFileComponent {
  private readonly fileService = inject(FileService);
  private readonly message = inject(NzMessageService);

  public inputUrls = input<string[]>();
  public outputUrls = output<string[]>();

  public loading = false;
  public previewImages: string[] = [];
  public fileList: NzUploadFile[] = [];
  public totalDeleted = 0;

  ngOnChanges(): void {
    this.previewImages = this.inputUrls() ?? [];
  }

  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = [file];
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
          this.updatePreviewImages(response.data);
          this.message.success('Imagenes subida exitosamente');
        },
        error: () => {
          this.message.error('Error al subir la imagenes');
          this.loading = false;
        },
      });
  }

  updatePreviewImages(urls: string[]): void {
    if (!urls) return;
    if (this.previewImages.find((url) => url === urls[0])) return;
    this.previewImages = [...this.previewImages, ...urls];
    this.outputUrls.emit(this.previewImages);
  }

  deleteFile(index: number): void {
    this.previewImages.splice(index, 1);
    this.fileList.splice(index, 1);
    this.outputUrls.emit(this.previewImages);
  }
}

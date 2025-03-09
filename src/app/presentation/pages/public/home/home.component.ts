import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AvatarModule } from 'primeng/avatar';
import { ToolbarModule } from 'primeng/toolbar';
import { finalize } from 'rxjs';
import { UserChatService } from '../../../../data/src/user-chat.service';
import { DefaultResponse } from '../../../../domain/common/default-response';
import { ChatTypeEnum } from '../../../../domain/enums/chat-type-enum';
import { ChatResponse } from '../../../../domain/models/chat-response';
import { UserQueryRequestDto } from '../../../../domain/models/user-query-request-dto';
import { NgZorroAntdModule } from '../../../../ng-zorro.module';
import { FooterComponent } from '../../../common/footer/footer.component';
import { CatalogServiceListComponent } from '../catalog-service-list/catalog-service-list.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

import { DomSanitizer } from '@angular/platform-browser';
import { Buffer } from "buffer";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    NzIconModule,
    RouterOutlet,
    CatalogServiceListComponent,

    // Prime components
    ToolbarModule, AvatarModule,

    //Components
    ToolbarComponent,
    FooterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly userChatService = inject(UserChatService);
  private readonly message = inject(NzMessageService);
  private readonly router = inject(Router);
  private readonly domSanitizer = inject(DomSanitizer);

  public isService: boolean = false;

  ngOnInit(): void {
    const currentPath = this.router.url;
    this.isService = currentPath === "/public/home/catalog-service";
  }

  public openChatbotModal = false;
  public newMessage = '';
  public sending = false;
  public defaultResponse: DefaultResponse = new DefaultResponse(200, '');
  public messages: ChatResponse[] = [];
  public chatTypeEnum = ChatTypeEnum;

  openChatbot() {
    this.openChatbotModal = true;
  }

  closeChatbot() {
    this.openChatbotModal = false;
  }

  scrollToBottom(): void {
    const container = document.querySelector('.messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  sendMessage() {
    this.scrollToBottom();
    if (this.newMessage.trim() !== '') {
      this.sending = true;
      // Add the user message to the chat
      this.messages.push({
        text: this.newMessage,
        date: new Date().toISOString(),
        type: ChatTypeEnum.user,
      });
      // Send the user message to the server
      this.userChatService
        .createUserQuey(this.getMessage())
        .pipe(finalize(() => (this.sending = false)))
        .subscribe({
          next: (resp) => {
            if (resp.statusCode !== 200) return;
            this.defaultResponse = resp;
            let chatResponse: ChatResponse = this.defaultResponse.data;
            // Add the bot response to the chat
            this.messages.push({
              // text: this.domSanitizer.bypassSecurityTrustHtml(this.decode(chatResponse.text)),//chatResponse.text.replace('\n', ''),
              text: this.domSanitizer.bypassSecurityTrustHtml(chatResponse.text.replace('\n', '')),//,
              date: chatResponse.date,
              type: chatResponse.type,
            });
            this.newMessage = '';
          },
          error: () => {
            this.sending = false;
          },
        });
    }
  }

  getMessage(): UserQueryRequestDto {
    return {
      chatCode: '',
      userQuery: this.newMessage,
    };
  }
  // public decode = (str: string): string => Buffer.from(str, 'base64').toString('binary');

  public decode = (str: string): string => {
    try {
      // Decodifica usando TextDecoder para mejor soporte de caracteres
      const bytes = Buffer.from(str, 'base64');
      console.log(new TextDecoder('utf-8').decode(bytes));
      return new TextDecoder('utf-8').decode(bytes);
    } catch (error) {
      console.error('Error al decodificar:', error);
      return str; // Devuelve la cadena original en caso de error
    }
  }


}

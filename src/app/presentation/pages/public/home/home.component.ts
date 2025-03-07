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
import { CatalogServiceListComponent } from '../catalog-service-list/catalog-service-list.component';
import { ToolbarComponent } from './toolbar/toolbar.component';

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
    ToolbarComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly userChatService = inject(UserChatService);
  private readonly message = inject(NzMessageService);
  private readonly router = inject(Router);

  public isService: boolean = false;

  ngOnInit(): void {
    const currentPath = this.router.url;
    this.isService = currentPath === "/public/home/catalog-service";
    // if (currentPath === "/public/home/catalog-service") this.isService = true;
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
              text: chatResponse.text.replace('\n', ''),
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
}

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgZorroAntdModule } from '../../../../ng-zorro.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { DefaultResponse } from '../../../../domain/common/default-response';
import { ChatResponse } from '../../../../domain/models/chat-response';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UserChatService } from '../../../../data/src/user-chat.service';
import { ChatTypeEnum } from '../../../../domain/enums/chat-type-enum';
import { finalize } from 'rxjs';
import { UserQueryRequestDto } from '../../../../domain/models/user-query-request-dto';
import { UserChat } from '../../../../domain/entities/user-chat';
import { Chat } from '../../../../domain/models/chat';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    NzIconModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly userChatService = inject(UserChatService);
  private readonly message = inject(NzMessageService);

  public openChatbotModal = false;
  public newMessage = '';
  public sending = false;
  public defaultResponse: DefaultResponse = new DefaultResponse(200, '');
  public messages: ChatResponse[] = [];
  public chatTypeEnum = ChatTypeEnum;
  public selectedChat?: Chat | null;

  openChatbot() {
    this.openChatbotModal = true;
    this.createChat();
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
    if (this.selectedChat === null) {
      this.message.error('Lo sentimos, servicio no disponible');
      return;
    }
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
              text: chatResponse.text,
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

  createChat() {
    this.userChatService
      .create(new UserChat('', 'Nuevo chat'))
      .subscribe((resp) => {
        if (resp.statusCode !== 200) return;
        this.defaultResponse = resp;
        this.selectedChat = this.defaultResponse.data;
      });
  }

  getMessage(): UserQueryRequestDto {
    return {
      chatCode: this.selectedChat?.code || '',
      userQuery: this.newMessage,
    };
  }
}

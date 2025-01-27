import { ChatTypeEnum } from './../../../../domain/enums/chat-type-enum';
import { UserQueryRequestDto } from './../../../../domain/models/user-query-request-dto';
import { User } from './../../../../domain/entities/user';
import { UserChatService } from './../../../../data/src/user-chat.service';
import { Component, inject, OnInit } from '@angular/core';
import { NgZorroAntdModule } from '../../../../ng-zorro.module';
import { FormsModule } from '@angular/forms';
import { LocalData } from '../../../../data/local/local-data';
import { finalize, iif } from 'rxjs';
import { DefaultResponse } from '../../../../domain/common/default-response';
import { CommonModule } from '@angular/common';
import { ChatResponse } from '../../../../domain/models/chat-response';
import { Chat } from '../../../../domain/models/chat';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [CommonModule, NgZorroAntdModule, FormsModule],
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.scss',
})
export class ChatBotComponent implements OnInit {
  private readonly userChatService = inject(UserChatService);
  private readonly localDate = inject(LocalData);

  public defaultResponse: DefaultResponse = new DefaultResponse(200, '');
  public user?: User | null;
  public isLogin = false;
  public sending = false;
  public loadingChats = false;
  public loadingMessages = false;
  public chatTypeEnum = ChatTypeEnum;
  public chats: Chat[] = [];
  public selectedChat?: Chat | null;
  public newMessage = '';
  public messages: ChatResponse[] = [
    {
      text: 'Olá, tudo bem?',
      date: new Date().toLocaleString(),
      type: 1,
    },
    {
      text: 'Olá, tudo bem?',
      date: new Date().toLocaleString(),
      type: 2,
    },
    {
      text: 'Olá, tudo bem?',
      date: new Date().toLocaleString(),
      type: 1,
    },
    {
      text: 'Olá, tudo bem dsamdasmdl sdsa dasd a sdasd ?',
      date: new Date().toLocaleString(),
      type: 2,
    },
    {
      text: 'Olá, tudo bem?',
      date: new Date().toLocaleString(),
      type: 1,
    },
    {
      text: 'Olá, tudo bem? dslkad aldjslk da dlka jdslk s',
      date: new Date().toLocaleString(),
      type: 2,
    },
    {
      text: 'Olá, tudo bem?',
      date: new Date().toLocaleString(),
      type: 1,
    },
    {
      text: 'Olá, tudo bem? dmsakldm salkds dasd kldas asldasjd asd djlska dlasj ldjasld ',
      date: new Date().toLocaleString(),
      type: 2,
    },
    {
      text: 'Olá, tudo bem?',
      date: new Date().toLocaleString(),
      type: 1,
    },
    {
      text: 'Olá, tudo bem? dmsakldm salkds dasd kldas asldasjd asd djlska dlasj ldjasld ',
      date: new Date().toLocaleString(),
      type: 2,
    },
    {
      text: 'Olá, tudo bem?',
      date: new Date().toLocaleString(),
      type: 1,
    },
    {
      text: 'Olá, tudo bem? dmsakldm salkds dasd kldas asldasjd asd djlska dlasj ldjasld ',
      date: new Date().toLocaleString(),
      type: 2,
    },
    {
      text: 'Olá, tudo bem?',
      date: new Date().toLocaleString(),
      type: 1,
    },
    {
      text: 'Olá, tudo bem? dmsakldm salkds dasd kldas asldasjd asd djlska dlasj ldjasld ',
      date: new Date().toLocaleString(),
      type: 2,
    },
    {
      text: 'Olá, tudo bem?',
      date: new Date().toLocaleString(),
      type: 1,
    },
    {
      text: 'Olá, tudo bem? dmsakldm salkds dasd kldas asldasjd asd djlska dlasj ldjasld ',
      date: new Date().toLocaleString(),
      type: 2,
    },
    {
      text: 'Olá, tudo bem?',
      date: new Date().toLocaleString(),
      type: 1,
    },
    {
      text: 'Olá, tudo bem? dmsakldm salkds dasd kldas asldasjd asd djlska dlasj ldjasld ',
      date: new Date().toLocaleString(),
      type: 2,
    },
    {
      text: 'Olá, tudo bem?',
      date: new Date().toLocaleString(),
      type: 1,
    },
    {
      text: 'Olá, tudo bem? dmsakldm salkds dasd kldas asldasjd asd djlska dlasj ldjasld ',
      date: new Date().toLocaleString(),
      type: 2,
    },
    {
      text: 'Olá, tudo bem?',
      date: new Date().toLocaleString(),
      type: 1,
    },
    {
      text: 'Olá, tudo bem? dmsakldm salkds dasd kldas asldasjd asd djlska dlasj ldjasld ',
      date: new Date().toLocaleString(),
      type: 2,
    },
    {
      text: 'Olá, tudo bem?',
      date: new Date().toLocaleString(),
      type: 1,
    },
    {
      text: 'Olá, tudo bem? dmsakldm salkds dasd kldas asldasjd asd djlska dlasj ldjasld ',
      date: new Date().toLocaleString(),
      type: 2,
    },
    {
      text: 'Olá, tudo bem?',
      date: new Date().toLocaleString(),
      type: 1,
    },
    {
      text: 'Olá, tudo bem? dmsakldm salkds dasd kldas asldasjd asd djlska dlasj ldjasld ',
      date: new Date().toLocaleString(),
      type: 2,
    },
  ];

  ngOnInit(): void {
    this.user = this.localDate.getUser();
    if (this.user) {
      this.isLogin = true;
      this.listChatsByCurrentUser();
    }
  }

  listChatsByCurrentUser() {
    this.loadingChats = true;
    this.userChatService
      .listByUser()
      .pipe(finalize(() => (this.loadingChats = false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          this.chats = this.defaultResponse.data;
        },
        error: () => {
          this.loadingChats = false;
        },
      });
  }

  selectChat(chat: Chat) {
    this.selectedChat = chat;
    this.findMessagesByChat();
  }

  findMessagesByChat() {
    if (!this.selectedChat) return;
    this.loadingMessages = true;
    this.userChatService
      .findByCode(this.selectedChat?.code)
      .pipe(finalize(() => (this.loadingMessages = false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          this.messages = this.defaultResponse.data;
        },
        error: () => {
          this.loadingMessages = false;
        },
      });
  }

  validateIdAlreadyExistsChat() {
    if (this.selectedChat != null) {
      return true;
    } else {
      // Create new chat
      this.chats.push({
        id: 0,
        code: '0001',
        uddi: 'FIRST-001',
        chatName: 'Nuevo Chat',
        active: true,
        messages: [],
      });
      this.selectedChat = this.chats[this.chats.length - 1];
      return true;
    }
  }

  sendMessage() {
    this.scrollToBottom();
    this.validateIdAlreadyExistsChat();
    if (this.newMessage.trim() !== '' && this.selectedChat != null) {
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
            this.scrollToBottom();
          },
          error: () => {
            this.sending = false;
            this.scrollToBottom();
          },
        });
    }
  }

  scrollToBottom(): void {
    const container = document.querySelector('.messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }

  getMessage(): UserQueryRequestDto {
    return {
      chatCode: this.selectedChat?.code || '',
      userQuery: this.newMessage,
    };
  }
}

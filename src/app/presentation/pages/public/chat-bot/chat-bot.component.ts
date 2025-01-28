import { ChatTypeEnum } from './../../../../domain/enums/chat-type-enum';
import { UserQueryRequestDto } from './../../../../domain/models/user-query-request-dto';
import { User } from './../../../../domain/entities/user';
import { UserChatService } from './../../../../data/src/user-chat.service';
import { Component, inject, OnInit } from '@angular/core';
import { NgZorroAntdModule } from '../../../../ng-zorro.module';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { LocalData } from '../../../../data/local/local-data';
import { finalize, first, iif } from 'rxjs';
import { DefaultResponse } from '../../../../domain/common/default-response';
import { CommonModule } from '@angular/common';
import { ChatResponse } from '../../../../domain/models/chat-response';
import { Chat } from '../../../../domain/models/chat';
import { AuthService } from '../../../../data/src/auth.service';
import { RegisterRequest } from '../../../../domain/models/register-request';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TokenResponse } from '../../../../domain/models/toke-response';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { SignInRequest } from '../../../../domain/models/sign-in-request';
import { UserChat } from '../../../../domain/entities/user-chat';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [
    CommonModule,
    NgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    NzIconModule,
  ],
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.scss',
})
export class ChatBotComponent implements OnInit {
  private readonly userChatService = inject(UserChatService);
  private readonly localDate = inject(LocalData);
  private readonly authService = inject(AuthService);
  private readonly message = inject(NzMessageService);
  private readonly localData = inject(LocalData);

  public defaultResponse: DefaultResponse = new DefaultResponse(200, '');
  public tokenResponse?: TokenResponse | null;
  public isLogin = false;
  public registerLoading = false;
  public sending = false;
  public loadingChats = false;
  public loadingMessages = false;
  public chatTypeEnum = ChatTypeEnum;
  public chats: Chat[] = [];
  public selectedChat?: Chat | null;
  public newMessage = '';
  public messages: ChatResponse[] = [];

  // Register the user
  public registerForm: FormGroup;
  public singInForm: FormGroup;

  public openModal = false;
  public openModalLogin = false;

  constructor(private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      idCard: [null, [Validators.required, Validators.minLength(10)]],
      firstName: [null, [Validators.required, Validators.minLength(3)]],
      lastName: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      photoUrl: [null],
      phoneNumber: [null, [Validators.minLength(10)]],
    });

    this.singInForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.tokenResponse = this.localDate.getTokenResponde();
    if (this.tokenResponse !== null) {
      this.isLogin = true;
      this.listChatsByCurrentUser();
    }
  }

  register() {
    if (!this.validateForm()) return;
    this.registerLoading = true;
    this.authService
      .register(this.getRegisterRequest())
      .pipe(finalize(() => (this.registerLoading = false)))
      .subscribe({
        next: (resp) => {
          if (resp.statusCode !== 200) return;
          this.tokenResponse = resp.data;
          this.message.success('Bienvenido');
          this.localData.setToken(this.tokenResponse?.token || '');
          this.localData.setTokenResponde(resp.data);
          this.isLogin = true;
          this.listChatsByCurrentUser();
          this.openModal = false;
        },
        error: () => {
          this.openModal = false;
          this.registerLoading = false;
        },
      });
  }

  public singIn(): void {
    if (!this.singValidateForm()) return;
    this.registerLoading = true;
    this.authService
      .authenticate(
        new SignInRequest(
          this.singInForm.value.email,
          this.singInForm.value.password
        )
      )
      .pipe(finalize(() => (this.registerLoading = false)))
      .subscribe({
        next: (response) => {
          if (response && response.statusCode === 200) {
            this.tokenResponse = response.data;
            this.message.success('Bienvenido');
            this.localData.setToken(this.tokenResponse?.token || '');
            this.localData.setTokenResponde(response.data);
            this.isLogin = true;
            this.listChatsByCurrentUser();
            this.openModalLogin = false;
          }
        },
        error: (_) => {
          this.registerLoading = false;
          this.openModalLogin = false;
        },
      });
  }

  openModalRegister() {
    this.openModal = true;
  }

  openModalLoginView() {
    this.openModalLogin = true;
  }

  closeLogin() {
    this.openModalLogin = false;
  }

  cancel() {
    this.openModal = false;
  }

  createChat() {
    if (!this.isLogin) {
      this.openModal = true;
      return;
    } else {
      this.loadingChats = true;
      this.userChatService
        .create(new UserChat('', 'Nuevo chat'))
        .subscribe((resp) => {
          if (resp.statusCode !== 200) return;
          this.defaultResponse = resp;
          this.chats.push(this.defaultResponse.data);
          this.selectChat(this.defaultResponse.data);
          this.loadingChats = false;
        });
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
          this.validateIdAlreadyExistsChat();
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
      .listByChatCode(this.selectedChat?.code)
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
    if (this.chats.length > 0) {
      // Validate if the chat already exists
      this.selectedChat = this.chats[0];
      this.findMessagesByChat();
      return true;
    } else {
      // Create new chat
      this.createChat();
      return true;
    }
  }

  sendMessage() {
    if (!this.isLogin) {
      this.openModal = true;
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
            console.log(this.defaultResponse);
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

  getRegisterRequest(): RegisterRequest {
    return {
      idCard: this.registerForm.value.idCard,
      firstName: this.registerForm.value.firstName,
      lastName: this.registerForm.value.lastName,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      photoUrl: this.registerForm.value.photoUrl,
      phoneNumber: this.registerForm.value.phoneNumber,
    };
  }

  logout() {
    this.authService.signOut();
    this.isLogin = false;
    this.tokenResponse = null;
    this.messages = [];
    this.chats = [];
    this.selectedChat = null;
  }

  /**
   * It loops through all the form controls and marks them as dirty and updates their validity
   * @returns A boolean value.
   */
  private validateForm(): boolean {
    for (const i in this.registerForm.controls) {
      this.registerForm.controls[i].markAsDirty();
      this.registerForm.controls[i].updateValueAndValidity({
        onlySelf: true,
      });
    }
    return this.registerForm.valid;
  }

  private singValidateForm(): boolean {
    for (const i in this.singInForm.controls) {
      this.singInForm.controls[i].markAsDirty();
      this.singInForm.controls[i].updateValueAndValidity({
        onlySelf: true,
      });
    }
    return this.singInForm.valid;
  }
}

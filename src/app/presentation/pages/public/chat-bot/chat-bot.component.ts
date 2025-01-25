import { Component } from '@angular/core';
import { NgZorroAntdModule } from '../../../../ng-zorro.module';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-bot',
  standalone: true,
  imports: [NgZorroAntdModule, FormsModule],
  templateUrl: './chat-bot.component.html',
  styleUrl: './chat-bot.component.scss',
})
export class ChatBotComponent {
  chats = [
    { id: 1, name: 'Chat 1', messages: [] },
    { id: 2, name: 'Chat 2', messages: [] },
  ];
  selectedChat: any = null;
  newMessage = '';
  messages = [
    { text: 'Hello!', sent: false },
    { text: 'Hi!', sent: true },
  ];

  selectChat(chat: any) {
    this.selectedChat = chat;
  }

  sendMessage() {
    if (this.newMessage.trim() && this.selectedChat) {
      this.selectedChat.messages.push({ text: this.newMessage, sent: true });
      this.newMessage = '';
    }
  }
}

import { ChatResponse } from './chat-response';

export class Chat {
  constructor(
    public id: number,
    public code: string,
    public uddi: string,
    public chatName: string,
    public active: boolean,
    public messages: ChatResponse[] = [],
    public icon?: string,
    public imageUrl?: string
  ) {}
}

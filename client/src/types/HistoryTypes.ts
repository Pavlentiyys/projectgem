export type MessageType = 'user' | 'ai';

export interface Message {
  type: MessageType;
  content: string;
}

export interface MessageReq {
  message: string;
  history?: Message[];
}

export interface MessageRes{
  userMessage: Message;
  aiMessage: Message;
}

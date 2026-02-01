export type MessageType = 'user' | 'ai';

export class Message {
  private type: MessageType;
  private content: string;

  constructor(type: MessageType, content: string) {
    this.type = type;
    this.content = content;
  }

  public getType(): MessageType {
    return this.type;
  }

  public getContent(): string {
    return this.content;
  }

  public toJSON(): { type: MessageType; content: string } {
    return {
      type: this.type,
      content: this.content,
    };
  }

  public static fromJSON(data: { type: MessageType; content: string }): Message {
    return new Message(data.type, data.content);
  }
}

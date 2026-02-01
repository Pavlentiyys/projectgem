import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message, MessageType } from '../models/Message';

export class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Gemini API key is required');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  public async sendMessage(userMessage: string, history: Message[] = []): Promise<string> {
    try {

      const chatHistory = history.map(msg => ({
        role: msg.getType() === 'user' ? 'user' : 'model',
        parts: [{ text: msg.getContent() }],
      }));

      const currentMessage = {
        role: 'user' as const,
        parts: [{ text: userMessage }],
      };

      const result = await this.model.generateContent({
        contents: [...chatHistory, currentMessage],
      });

      const response = await result.response;
      const text = response.text();

      return text;
    } catch (error) {
      console.log('Error sending message to Gemini:', error);
      throw new Error(`Failed to get response from Gemini: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async processMessage(userMessage: string, history: Message[] = []): Promise<Message> {
    const aiResponse = await this.sendMessage(userMessage, history);
    return new Message('ai', aiResponse);
  }
}

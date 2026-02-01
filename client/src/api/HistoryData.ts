import axios from 'axios';
import type { AxiosInstance } from 'axios';
import type {
  Message,
  MessageReq,
  MessageRes,
} from '../types/HistoryTypes';

const STORAGE_KEY = 'chat_history';

export class HistoryService {
  private apiClient: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = 'https://projectgemapi.vercel.app') {
    this.baseURL = baseURL;
    this.apiClient = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  public async sendMessage(
    message: string,
    history?: Message[]
  ): Promise<MessageRes> {
    try {
      const messageHistory = history || this.getHistory();

      const requestData: MessageReq = {
        message: message.trim(),
        ...(messageHistory && messageHistory.length > 0 && { history: messageHistory }),
      };

      const response = await this.apiClient.post<MessageRes>(
        '/api/messages/send',
        requestData
      );

      this.addMessage(response.data.userMessage);
      this.addMessage(response.data.aiMessage);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.error ||
          error.response?.data?.message ||
          `Failed to send message: ${error.message}`
        );
      }
      throw new Error('Unknown error occurred while sending message');
    }
  }

  public getHistory(): Message[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return [];
      }
      const messages = JSON.parse(stored) as Message[];
      return Array.isArray(messages) ? messages : [];
    } catch (error) {
      console.error('Error loading history from localStorage:', error);
      return [];
    }
  }

  public addMessage(message: Message): void {
    try {
      const history = this.getHistory();
      history.push(message);
      this.saveHistory(history);
    } catch (error) {
      console.error('Error adding message to localStorage:', error);
    }
  }

  public saveHistory(messages: Message[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
      // Отправляем событие для обновления хука useStorage
      window.dispatchEvent(new CustomEvent('local-storage', { 
        detail: { key: STORAGE_KEY, value: messages } 
      }));
    } catch (error) {
      console.error('Error saving history to localStorage:', error);
    }
  }

  public clearHistory(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
      // Отправляем событие для обновления хука useStorage
      window.dispatchEvent(new CustomEvent('local-storage', { 
        detail: { key: STORAGE_KEY, value: [] } 
      }));
    } catch (error) {
      console.error('Error clearing history from localStorage:', error);
    }
  }

  public getHistoryLength(): number {
    return this.getHistory().length;
  }

  public getBaseURL(): string {
    return this.baseURL;
  }

  public setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
    this.apiClient.defaults.baseURL = baseURL;
  }
}

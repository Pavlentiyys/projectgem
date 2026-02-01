import { Request, Response } from 'express';
import { Message, MessageType } from '../models/Message';
import { GeminiService } from '../services/GeminiService';

export class MessageController {
  private geminiService: GeminiService;

  constructor(geminiService: GeminiService) {
    this.geminiService = geminiService;
  }

  public async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { message, history } = req.body;

      // Валидация входных данных
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        res.status(400).json({
          error: 'Message is required and must be a non-empty string',
        });
        return;
      }

      // Валидация истории сообщений (если предоставлена)
      let messageHistory: Message[] = [];
      if (history && Array.isArray(history)) {
        messageHistory = history
          .filter((msg: any) => msg.type && msg.content)
          .map((msg: any) => Message.fromJSON({
            type: msg.type as MessageType,
            content: msg.content,
          }));
      }

      // Создаем сообщение пользователя
      const userMessage = new Message('user', message.trim());

      // Получаем ответ от Gemini
      const aiMessage = await this.geminiService.processMessage(
        userMessage.getContent(),
        messageHistory
      );

      // Возвращаем оба сообщения (пользователя и AI)
      res.status(200).json({
        userMessage: userMessage.toJSON(),
        aiMessage: aiMessage.toJSON(),
      });
    } catch (error) {
      console.error('Error in MessageController.sendMessage:', error);
      res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

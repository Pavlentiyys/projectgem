import { Router } from 'express';
import { MessageController } from '../controllers/MessageController';
import { GeminiService } from '../services/GeminiService';

export class MessageRoutes {
  private router: Router;
  private messageController: MessageController;

  constructor() {
    this.router = Router();
    const apiKey = process.env.GEMINI_API_KEY || '';
    const geminiService = new GeminiService(apiKey);
    this.messageController = new MessageController(geminiService);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.post('/send', (req, res) => {
      this.messageController.sendMessage(req, res);
    });
  }

  public getRouter(): Router {
    return this.router;
  }
}

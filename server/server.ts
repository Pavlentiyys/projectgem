import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MessageRoutes } from './src/routes/messageRoutes';

// Загружаем переменные окружения
dotenv.config();

class Server {
  private app: Express;
  private port: number;

  constructor() {
    this.app = express();
    this.port = parseInt(process.env.PORT || '3000', 10);
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(cors({
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    }));

    // Парсинг JSON
    this.app.use(express.json());

    // Логирование запросов
    this.app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
      next();
    });
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });

    // API routes
    const messageRoutes = new MessageRoutes();
    this.app.use('/api/messages', messageRoutes.getRouter());
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 Server is running on port ${this.port}`);
      console.log(`📡 Health check: http://localhost:${this.port}/health`);
      console.log(`💬 Messages API: http://localhost:${this.port}/api/messages/send`);
    });
  }
}

// Запускаем сервер
const server = new Server();
server.start();

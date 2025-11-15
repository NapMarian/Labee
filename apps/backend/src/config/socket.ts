import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt';
import { env } from './env';

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  userType?: string;
}

export function initializeSocket(httpServer: HTTPServer): Server {
  const io = new Server(httpServer, {
    cors: {
      origin: (origin, callback) => {
        // Permitir requests sin origin
        if (!origin) {
          return callback(null, true);
        }

        // En desarrollo: permitir cualquier localhost
        if (env.NODE_ENV === 'development' && origin.startsWith('http://localhost')) {
          return callback(null, true);
        }

        // Verificar lista de orígenes permitidos
        const allowedOrigins = env.ALLOWED_ORIGINS.split(',').map(o => o.trim());
        if (allowedOrigins.includes(origin)) {
          return callback(null, true);
        }

        callback(new Error('Not allowed by CORS'));
      },
      credentials: true,
    },
  });

  // Middleware de autenticación para Socket.IO
  io.use((socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const decoded = verifyAccessToken(token);
      socket.userId = decoded.userId;
      socket.userType = decoded.userType;

      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Event handlers
  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`✅ User connected: ${socket.userId}`);

    // Join user to their personal room
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    // Join match room
    socket.on('join_match', (matchId: string) => {
      socket.join(`match:${matchId}`);
      console.log(`📝 User ${socket.userId} joined match: ${matchId}`);
    });

    // Leave match room
    socket.on('leave_match', (matchId: string) => {
      socket.leave(`match:${matchId}`);
      console.log(`👋 User ${socket.userId} left match: ${matchId}`);
    });

    // Send message (for client-initiated messages if needed)
    socket.on('send_message', (data: { matchId: string; content: string }) => {
      // This event is primarily emitted from the controller after DB save
      // But we can also support direct socket messages if needed
      console.log(`💬 Message from ${socket.userId} in match ${data.matchId}`);
    });

    // Typing indicator
    socket.on('typing', (data: { matchId: string; userName: string }) => {
      socket.to(`match:${data.matchId}`).emit('user_typing', {
        userId: socket.userId,
        userName: data.userName,
      });
    });

    // Stop typing indicator
    socket.on('stop_typing', (data: { matchId: string }) => {
      socket.to(`match:${data.matchId}`).emit('user_stop_typing', {
        userId: socket.userId,
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`❌ User disconnected: ${socket.userId}`);
    });
  });

  return io;
}

// Singleton instance
let ioInstance: Server | null = null;

export function getIO(): Server {
  if (!ioInstance) {
    throw new Error('Socket.IO not initialized!');
  }
  return ioInstance;
}

export function setIO(io: Server): void {
  ioInstance = io;
}

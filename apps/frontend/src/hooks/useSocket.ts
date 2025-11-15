import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { API_URL } from '@/lib/api';
import api from '@/lib/api';
import { Message } from '@/types';

interface UseSocketOptions {
  onNewMessage?: (data: { message: Message; matchId: string }) => void;
  onMessagesRead?: (data: { matchId: string; userId: string; count: number }) => void;
  onUserTyping?: (data: { userId: string; userName: string }) => void;
  onUserStopTyping?: (data: { userId: string }) => void;
}

export function useSocket(options: UseSocketOptions = {}) {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = api.getAccessToken();

    if (!token) {
      console.log('❌ No access token, skipping Socket.IO connection');
      return;
    }

    // Create Socket.IO connection
    console.log('🔌 Connecting to Socket.IO server...');
    const socket = io(API_URL, {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    // Connection handlers
    socket.on('connect', () => {
      console.log('✅ Socket.IO connected:', socket.id);
      setIsConnected(true);
      setError(null);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Socket.IO disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      console.error('🔴 Socket.IO connection error:', err.message);
      setError(err.message);
      setIsConnected(false);
    });

    // Message event handlers
    if (options.onNewMessage) {
      socket.on('new_message', options.onNewMessage);
    }

    if (options.onMessagesRead) {
      socket.on('messages_read', options.onMessagesRead);
    }

    if (options.onUserTyping) {
      socket.on('user_typing', options.onUserTyping);
    }

    if (options.onUserStopTyping) {
      socket.on('user_stop_typing', options.onUserStopTyping);
    }

    // Cleanup on unmount
    return () => {
      console.log('🔌 Disconnecting Socket.IO...');
      socket.disconnect();
    };
  }, [options.onNewMessage, options.onMessagesRead, options.onUserTyping, options.onUserStopTyping]);

  // Join a match room
  const joinMatch = (matchId: string) => {
    if (socketRef.current?.connected) {
      console.log(`📝 Joining match: ${matchId}`);
      socketRef.current.emit('join_match', matchId);
    }
  };

  // Leave a match room
  const leaveMatch = (matchId: string) => {
    if (socketRef.current?.connected) {
      console.log(`👋 Leaving match: ${matchId}`);
      socketRef.current.emit('leave_match', matchId);
    }
  };

  // Send typing indicator
  const sendTyping = (matchId: string, userName: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('typing', { matchId, userName });
    }
  };

  // Send stop typing indicator
  const sendStopTyping = (matchId: string) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit('stop_typing', { matchId });
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    error,
    joinMatch,
    leaveMatch,
    sendTyping,
    sendStopTyping,
  };
}

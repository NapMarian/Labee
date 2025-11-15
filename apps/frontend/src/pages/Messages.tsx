import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { MessageService, Conversation, Message } from '@/services/message.service';
import { useSocket } from '@/hooks/useSocket';
import Card from '@/components/ui/Card';
import { Send, ArrowLeft, MessageCircle, Loader2, Clock } from 'lucide-react';

export default function Messages() {
  const { user } = useAuthStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedMatchId = searchParams.get('match');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Socket.IO connection with event handlers
  const { isConnected, joinMatch, leaveMatch, sendTyping, sendStopTyping } = useSocket({
    onNewMessage: ({ message, matchId }) => {
      console.log('📨 New message received:', message);

      // If message is for current conversation, add it to messages
      if (matchId === selectedMatchId) {
        setMessages((prev) => {
          // Avoid duplicates
          if (prev.some(m => m.id === message.id)) return prev;
          return [...prev, message];
        });

        // Mark as read if we're viewing this conversation
        MessageService.markAsRead(matchId).catch(console.error);
      }

      // Refresh conversations to update unread counts
      loadConversations();
    },
    onMessagesRead: ({ matchId, userId }) => {
      console.log('✅ Messages marked as read in match:', matchId);
      // Refresh conversations to update unread counts
      loadConversations();
    },
    onUserTyping: ({ userId, userName }) => {
      console.log('✍️ User typing:', userName);
      setIsTyping(true);
      setTypingUser(userName);
    },
    onUserStopTyping: ({ userId }) => {
      console.log('🛑 User stopped typing');
      setIsTyping(false);
      setTypingUser(null);
    },
  });

  // Cargar conversaciones
  useEffect(() => {
    console.log('👤 Usuario actual:', user?.email, 'ID:', user?.id);
    loadConversations();
  }, []);

  // Cargar mensajes cuando se selecciona una conversación
  useEffect(() => {
    if (selectedMatchId) {
      loadMessages(selectedMatchId);

      // Join match room for real-time updates
      joinMatch(selectedMatchId);

      // Marcar como leídos
      MessageService.markAsRead(selectedMatchId).catch(console.error);

      // Cleanup: leave match room when conversation changes
      return () => {
        leaveMatch(selectedMatchId);
      };
    }
  }, [selectedMatchId, joinMatch, leaveMatch]);

  // Auto-scroll al último mensaje
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const data = await MessageService.getConversations();
      console.log('📥 Conversaciones cargadas:', data);
      console.log('📊 Número de conversaciones:', data?.length || 0);
      setConversations(data);
    } catch (error) {
      console.error('❌ Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (matchId: string) => {
    try {
      const data = await MessageService.getMatchMessages(matchId);
      setMessages(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMatchId || !messageInput.trim() || sending) return;

    try {
      setSending(true);

      // Stop typing indicator
      const selectedConversation = conversations?.find(c => c.id === selectedMatchId);
      if (selectedConversation) {
        const otherUser = getOtherUser(selectedConversation);
        sendStopTyping(selectedMatchId);
      }

      const newMessage = await MessageService.sendMessage(
        selectedMatchId,
        messageInput
      );

      // Optimistically add message to UI (Socket.IO will also send it, but we handle duplicates)
      setMessages(prev => {
        if (prev.some(m => m.id === newMessage.id)) return prev;
        return [...prev, newMessage];
      });

      setMessageInput('');

      // Actualizar conversaciones para reflejar el nuevo mensaje
      loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (value: string) => {
    setMessageInput(value);

    if (!selectedMatchId) return;

    // Send typing indicator
    if (value.trim() && user?.profile?.name) {
      sendTyping(selectedMatchId, user.profile.name);

      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set timeout to stop typing after 2 seconds of inactivity
      typingTimeoutRef.current = setTimeout(() => {
        sendStopTyping(selectedMatchId);
      }, 2000);
    } else {
      sendStopTyping(selectedMatchId);
    }
  };

  const handleSelectConversation = (matchId: string) => {
    setSearchParams({ match: matchId });
  };

  const handleBackToList = () => {
    setSearchParams({});
  };

  const getOtherUser = (conversation: Conversation) => {
    return conversation.user1Id === user?.id
      ? conversation.user2
      : conversation.user1;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit' });
  };

  const selectedConversation = conversations?.find(c => c.id === selectedMatchId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-gray-700 dark:text-gray-300" />
      </div>
    );
  }

  // Si hay un match seleccionado pero no se encontró la conversación, mostrar error
  if (selectedMatchId && !selectedConversation && conversations && conversations.length > 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-gray-600 dark:text-gray-400">Conversación no encontrada</p>
      </div>
    );
  }

  // Vista móvil: mostrar chat si hay match seleccionado
  if (selectedMatchId && selectedConversation) {
    const otherUser = getOtherUser(selectedConversation);

    return (
      <div className="h-[calc(100vh-120px)] flex flex-col">
        {/* Header del chat */}
        <Card className="backdrop-blur-xl bg-white/70 dark:bg-gray-900/50 border border-white/20 dark:border-white/10 mb-4">
          <div className="flex items-center gap-4 p-4">
            <button
              onClick={handleBackToList}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                {otherUser.profile.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {otherUser.profile.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                  {selectedConversation.jobOffer.title}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Mensajes */}
        <Card className="flex-1 backdrop-blur-xl bg-white/50 dark:bg-gray-900/30 border border-white/20 dark:border-white/10 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <MessageCircle className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No hay mensajes aún
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  Envía el primer mensaje para empezar la conversación
                </p>
              </div>
            ) : (
              messages.map((message) => {
                const isOwn = message.senderId === user?.id;
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                        isOwn
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                          : 'bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-white/10'
                      }`}
                    >
                      <p className="text-sm break-words">{message.content}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 opacity-70" />
                        <span className="text-xs opacity-70">
                          {formatTime(message.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            {isTyping && typingUser && (
              <div className="flex justify-start">
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-2xl px-4 py-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                    {typingUser} está escribiendo...
                  </p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input de mensaje */}
          <form onSubmit={handleSendMessage} className="p-4 border-t border-white/20 dark:border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {isConnected ? 'Conectado' : 'Desconectado'}
              </span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => handleTyping(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 px-4 py-3 rounded-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl border border-white/20 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={sending}
              />
              <button
                type="submit"
                disabled={!messageInput.trim() || sending}
                className="px-6 py-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  // Vista de lista de conversaciones
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Mensajes
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Chatea con tus matches
        </p>
      </div>

      {!conversations || conversations.length === 0 ? (
        <Card className="text-center py-12 backdrop-blur-xl bg-white/50 dark:bg-gray-900/30 border border-white/20 dark:border-white/10">
          <MessageCircle className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No tienes conversaciones
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Cuando hagas match con alguien, podrás empezar a chatear aquí
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {conversations?.map((conversation) => {
            const otherUser = getOtherUser(conversation);
            const lastMessage = conversation.messages[0];

            return (
              <Card
                key={conversation.id}
                onClick={() => handleSelectConversation(conversation.id)}
                className="cursor-pointer hover:scale-[1.02] transition-all backdrop-blur-xl bg-white/70 dark:bg-gray-900/50 border border-white/20 dark:border-white/10"
              >
                <div className="flex items-center gap-4 p-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-xl">
                      {otherUser.profile.name.charAt(0).toUpperCase()}
                    </div>
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                        {conversation.unreadCount}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {otherUser.profile.name}
                      </h3>
                      {lastMessage && (
                        <span className="text-xs text-gray-500 dark:text-gray-500 ml-2">
                          {formatTime(lastMessage.createdAt)}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate mb-1">
                      {conversation.jobOffer.title}
                    </p>
                    {lastMessage && (
                      <p className={`text-sm truncate ${
                        conversation.unreadCount > 0
                          ? 'font-semibold text-gray-900 dark:text-gray-100'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {lastMessage.senderId === user?.id && 'Tú: '}
                        {lastMessage.content}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

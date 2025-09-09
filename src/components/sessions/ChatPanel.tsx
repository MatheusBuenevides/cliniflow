import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../../types';

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  onClose: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  onSendMessage,
  onClose
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus no input quando o chat abre
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header do Chat */}
      <div className="bg-slate-700 px-4 py-3 border-b border-slate-600">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">Chat da Sessão</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Lista de Mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-slate-400 mt-8">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p>Nenhuma mensagem ainda</p>
            <p className="text-sm mt-1">Comece a conversa enviando uma mensagem</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === 1 ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.senderId === 1
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-600 text-white'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium opacity-75">
                    {message.senderName}
                  </span>
                  <span className="text-xs opacity-50">
                    {formatTime(message.timestamp)}
                  </span>
                </div>
                <p className="text-sm">{message.message}</p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de Mensagem */}
      <div className="border-t border-slate-600 p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </form>
        
        <div className="flex items-center justify-between mt-2 text-xs text-slate-400">
          <span>Pressione Enter para enviar</span>
          <span>{newMessage.length}/500</span>
        </div>
      </div>
    </div>
  );
};

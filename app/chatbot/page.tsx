'use client';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { NeuralBackground } from '@/components/backgrounds/NeuralBackground';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatbotPage() {
  const [isClient, setIsClient] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Add welcome message
    setMessages([{
      id: '1',
      text: '¡Hola! Soy tu asistente de desarrollo de Polkadot. ¿En qué puedo ayudarte hoy?',
      isUser: false,
      timestamp: new Date()
    }]);
  }, []);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Chatbot</h1>
          <p className="text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Usar la API de Gemini
      const { chat } = await import('@/lib/api-client');
      
      // Construir historial de conversación
      const history = messages.map(msg => ({
        role: msg.isUser ? 'user' as const : 'model' as const,
        parts: msg.text
      }));

      let aiResponse = '';
      for await (const chunk of chat({
        message: inputValue,
        history
      })) {
        aiResponse += chunk;
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error en chat:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Error: ${error instanceof Error ? error.message : 'Error desconocido'}. Por favor, intenta nuevamente.`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <NeuralBackground />
      
      <div className="relative z-10 pt-16 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link href="/" className="inline-flex items-center text-purple-400 hover:text-purple-300 mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al inicio
            </Link>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 flex items-center flex-wrap gap-2">
              <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-400" />
              Asistente IA
            </h1>
            <p className="text-gray-400">Tu compañero de desarrollo en Polkadot</p>
          </motion.div>

          {/* Chat Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="h-[calc(100vh-10rem)] xs:h-[calc(100vh-12rem)] sm:h-[500px] md:h-[600px] lg:h-[700px] min-h-[350px] max-h-[90vh] flex flex-col"
          >
            <Card className="flex-1 flex flex-col bg-slate-800/50 border-slate-700">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start max-w-[85%] sm:max-w-[80%] md:max-w-[75%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.isUser ? 'bg-purple-500 ml-2' : 'bg-blue-500 mr-2'
                      }`}>
                        {message.isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
                      </div>
                      <div className={`rounded-lg p-3 ${
                        message.isUser 
                          ? 'bg-purple-500 text-white' 
                          : 'bg-slate-700 text-gray-100'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-blue-500 mr-2 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-slate-700 rounded-lg p-3">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-slate-700 p-4">
                <div className="flex space-x-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu pregunta sobre desarrollo en Polkadot..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    variant="primary"
                    className="px-4"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6"
          >
            <h3 className="text-lg font-semibold text-white mb-4">Preguntas frecuentes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "¿Cómo crear un contrato inteligente?",
                "¿Qué es Substrate?",
                "¿Cómo conectar con Polkadot?",
                "¿Qué es Paseo testnet?"
              ].map((question, index) => (
                <Button
                  key={index}
                  variant="secondary"
                  className="justify-start text-left h-auto p-3"
                  onClick={() => setInputValue(question)}
                >
                  <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                  {question}
                </Button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

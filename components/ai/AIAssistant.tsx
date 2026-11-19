import { useState, useRef, useEffect } from 'react';
import { generateAIResponse } from '../../services/aiAssistant';
import { isGeminiConfigured } from '../../services/googleWorkspaceService';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  subject?: string;
  confidence?: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      type: 'assistant',
      content: 'Hello! I\'m your AI Science Assistant. I can help you with Biology, Chemistry, Physics, Agriculture, and General Education. What would you like to learn about?',
      confidence: 'Ready to help'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const speakText = (text: string, force = false) => {
    if (!force && !audioEnabled) {
      return;
    }

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const handleReadAloud = (text: string) => {
    setAudioEnabled(true);
    speakText(text, true);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await generateAIResponse(inputValue);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.response,
        subject: response.subject,
        confidence: response.confidence
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  const quickQuestions = [
    'Explain photosynthesis',
    'How does DNA work?',
    'What is cellular respiration?',
    'Explain ionic bonds',
    'What is Newton\'s first law?',
    'How do crops grow?'
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-40 p-4 rounded-full shadow-lg transition-all duration-300 ${
          isOpen
            ? 'bg-red-600 hover:bg-red-700'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
        } text-white flex items-center justify-center`}
        style={{
          width: '60px',
          height: '60px'
        }}
      >
        {isOpen ? (
          <span className="text-2xl">✕</span>
        ) : (
          <span className="text-2xl">🤖</span>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-h-[600px] bg-white rounded-lg shadow-2xl flex flex-col border border-gray-200 animate-in slide-in-from-bottom-0 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-2xl">🤖</span>
                <div>
                  <h3 className="font-bold">NovaLab AI Assistant</h3>
                  <p className="text-sm opacity-90">
                    {isGeminiConfigured() ? 'Gemini-powered science expert' : 'Your Science Expert'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setAudioEnabled((prev) => !prev);
                    if (audioEnabled) {
                      stopSpeaking();
                    }
                  }}
                  className="flex items-center gap-1 rounded-full bg-white/15 px-2 py-1 text-[10px] font-medium hover:bg-white/25"
                  aria-label={audioEnabled ? 'Disable voice responses' : 'Enable voice responses'}
                >
                  <span aria-hidden="true">🎤</span>
                  <span>{audioEnabled ? 'Voice On' : 'Voice Off'}</span>
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => handleReadAloud(messages[messages.length - 1]?.content || 'Hello!')}
                className="rounded-full bg-white/15 px-2 py-1 text-xs font-medium hover:bg-white/25"
                aria-label="Read the latest answer aloud"
              >
                🔊
              </button>
              <button
                type="button"
                onClick={stopSpeaking}
                className="rounded-full bg-white/15 px-2 py-1 text-xs font-medium hover:bg-white/25"
                aria-label="Stop audio"
              >
                ⏹
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p className="mb-4">No messages yet. Start by asking a question!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.type === 'assistant' && (
                      <div className="mt-2 text-xs opacity-70 space-y-1">
                        {message.subject && <p>📚 Subject: {message.subject}</p>}
                        {message.confidence && <p>✓ Confidence: {message.confidence}</p>}
                        <button
                          type="button"
                          onClick={() => handleReadAloud(message.content)}
                          className="mt-1 rounded bg-blue-100 px-2 py-1 text-[10px] font-medium text-blue-700 hover:bg-blue-200"
                        >
                          🔊 Read aloud
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 px-4 py-2 rounded-lg border border-gray-200 rounded-bl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="border-t border-gray-200 p-3 bg-white">
              <p className="text-xs font-semibold text-gray-600 mb-2">Try asking about:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestion(q)}
                    className="text-xs bg-gray-100 hover:bg-blue-100 text-gray-700 px-2 py-1 rounded transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 bg-white rounded-b-lg">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600 text-sm"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition text-sm"
              >
                Send
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              🔬 Trained in: Biology • Chemistry • Physics • Agriculture • General Education
            </p>
          </form>
        </div>
      )}
    </>
  );
}

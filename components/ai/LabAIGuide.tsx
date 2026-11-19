import { useState } from 'react';
import { generateAIResponse } from '../../services/aiAssistant';

interface LabAIGuideProps {
  labName: string;
  topic: string;
  relatedTopics?: string[];
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
}

export default function LabAIGuide({ labName, topic, relatedTopics = [] }: LabAIGuideProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      type: 'assistant',
      content: `Welcome to the ${labName} AI Guide! I'm here to help you understand ${topic}. Ask me anything about this experiment or related concepts.`
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await generateAIResponse(`${topic}: ${inputValue}`);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.response
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

  const suggestedQuestions = [
    `How does ${topic} work?`,
    `What is the purpose of this experiment?`,
    'What safety precautions should I take?',
    'How do I interpret the results?'
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-4 rounded-lg border-2 border-blue-200">
      <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center space-x-3">
          <span className="text-3xl">🤖</span>
          <div>
            <h3 className="font-bold text-blue-900">{labName} AI Guide</h3>
            <p className="text-sm text-blue-700">Get help with {topic}</p>
          </div>
        </div>
        <span className={`text-2xl transition-transform ${isExpanded ? 'rotate-180' : ''}`}>⬇️</span>
      </div>

      {isExpanded && (
        <div className="mt-4 border-t-2 border-blue-200 pt-4 space-y-3">
          {/* Messages Display */}
          <div className="bg-white rounded p-3 max-h-96 overflow-y-auto space-y-2">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none text-sm'
                      : 'bg-gray-100 text-gray-900 rounded-bl-none text-sm'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-3 py-2 rounded rounded-bl-none flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Suggested Questions */}
          {messages.length === 1 && (
            <div className="bg-white p-3 rounded border border-blue-200">
              <p className="text-xs font-semibold text-gray-600 mb-2">Suggested questions:</p>
              <div className="space-y-1">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setInputValue(q);
                    }}
                    className="w-full text-left text-xs bg-blue-50 hover:bg-blue-100 text-blue-900 px-2 py-1 rounded transition"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask a question..."
              className="flex-1 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-1 rounded font-medium transition text-sm"
            >
              Ask
            </button>
          </form>

          {/* Related Topics */}
          {relatedTopics.length > 0 && (
            <div className="bg-white p-3 rounded border border-green-200">
              <p className="text-xs font-semibold text-gray-600 mb-2">📚 Related topics:</p>
              <div className="flex flex-wrap gap-2">
                {relatedTopics.map((t, idx) => (
                  <span key={idx} className="text-xs bg-green-100 text-green-900 px-2 py-1 rounded">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

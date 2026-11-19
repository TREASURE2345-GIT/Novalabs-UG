import { useEffect, useRef, useState } from 'react';
import { generateAIResponse } from '../../services/aiAssistant';
import DemoPlayer from '../demo/DemoPlayer';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
}

interface Chapter {
  label: string;
  prompt: string;
}

const chapters: Chapter[] = [
  {
    label: 'Welcome to NovaLab',
    prompt: 'Welcome the viewer to the NovaLab virtual science lab and explain in two sentences what it is.',
  },
  {
    label: 'Choosing an experiment',
    prompt: 'How does a student choose a subject and an experiment inside the lab?',
  },
  {
    label: 'Running the practical',
    prompt: 'Describe how a student runs a guided experiment step by step in the lab.',
  },
  {
    label: 'Recording results',
    prompt: 'How do students record observations and enter their results and data in the lab?',
  },
  {
    label: 'Understanding feedback',
    prompt: 'How does the lab give real-time feedback and scoring to a student after an experiment?',
  },
];

export default function DemoSection() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      type: 'assistant',
      content:
        "I'm your NovaLab AI guide. Press a step below to have me narrate that part of the walkthrough, or ask me anything about how the lab works.",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [demoStarted, setDemoStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages]);

  const askGuide = async (prompt: string, speaker: string) => {
    const userMessage: Message = { id: Date.now().toString(), type: 'user', content: speaker };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await generateAIResponse(prompt);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), type: 'assistant', content: response.response },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: 'Sorry, I could not load that explanation. Please try again.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChapter = (chapter: Chapter) => {
    void askGuide(chapter.prompt, chapter.label);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const question = input.trim();
    if (!question) return;
    setInput('');
    void askGuide(question, question);
  };

  return (
    <section id="demo" className="mt-20 scroll-mt-24">
          <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Demo Video</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">
          Watch an AI agent complete a real DNA extraction practical step by step with synchronized
          audio narration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video player */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2.5">
            <span className="flex items-center gap-2 text-xs font-semibold text-gray-600">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
              AI agent demo · video with voice narration
            </span>
            <a
              href="/demo"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              Open full screen ↗
            </a>
          </div>
          <div className="aspect-video bg-slate-950">
            <div className="relative h-full w-full">
              <DemoPlayer hideStartGate />
              {!demoStarted && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/85 px-6 text-center backdrop-blur-sm">
                  <div>
                    <button
                      type="button"
                      aria-label="Play AI demo with audio narration"
                      onClick={() => {
                        window.dispatchEvent(new Event('novalab:demo-start'));
                        setDemoStarted(true);
                      }}
                      className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/25 bg-white/10 pl-1 text-3xl text-white shadow-2xl transition hover:scale-105 hover:bg-cyan-300 hover:text-slate-950"
                    >
                      ▶
                    </button>
                    <h3 className="mt-5 text-xl font-bold text-white sm:text-2xl">
                      Watch Nova complete a DNA extraction
                    </h3>
                    <p className="mt-2 text-sm text-slate-300">
                      Video animation and voice narration play together.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chapters */}
          <div className="border-t border-gray-200 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">
              Guided steps
            </p>
            <div className="flex flex-wrap gap-2">
              {chapters.map((chapter) => (
                <button
                  key={chapter.label}
                  type="button"
                  onClick={() => handleChapter(chapter)}
                  className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 transition hover:bg-blue-100"
                >
                  {chapter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI guide chat */}
        <div className="flex h-[420px] lg:h-auto bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="flex w-full flex-col">
            <div className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 text-white">
              <span className="text-2xl">🤖</span>
              <div>
                <h3 className="text-sm font-bold">NovaLab AI Guide</h3>
                <p className="text-xs opacity-90">Narrates and answers as you watch</p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${
                      message.type === 'user'
                        ? 'rounded-br-none bg-blue-600 text-white'
                        : 'rounded-bl-none border border-gray-200 bg-white text-gray-800'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-lg rounded-bl-none border border-gray-200 bg-white px-3 py-2">
                    <div className="flex space-x-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: '0.1s' }}
                      />
                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                        style={{ animationDelay: '0.2s' }}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about the lab..."
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:bg-gray-400"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

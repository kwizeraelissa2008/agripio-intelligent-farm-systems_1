/**
 * AgriGuide — Real AI Farming Mentor with Streaming Responses
 * Powered by Lovable AI • © 2026 AgriPio Team
 */
import { useState, useRef, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/hooks/useAuth';
import {
  Send, Sparkles, RotateCcw,
  Target, Bot, User, Shield, FolderOpen, Plus, CheckCircle, AlertCircle
} from 'lucide-react';
import { streamChat, type ChatMsg } from '@/lib/ai';
import confetti from 'canvas-confetti';

interface UIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  type?: 'text' | 'plan' | 'ip-alert' | 'project';
}

interface Project {
  id: string;
  title: string;
  description: string;
  ipType: string;
  progress: number;
  createdAt: Date;
}

const quickPrompts = [
  { emoji: '🌽', label: 'Best crop for my soil', prompt: 'What is the best crop to plant for soil with pH 6.2 and moderate nitrogen in Kigali region?' },
  { emoji: '💧', label: 'Irrigation help', prompt: 'How should I set up an irrigation schedule for 2 hectares of maize during dry season?' },
  { emoji: '🛡️', label: 'Protect my idea', prompt: 'I invented a new composting method. How can I protect it as intellectual property?' },
  { emoji: '🌱', label: 'Full farm plan', prompt: 'Help me create a complete farming plan for 3 hectares in Musanze with budget of RWF 800,000' },
  { emoji: '🐛', label: 'Pest prevention', prompt: 'What organic pest prevention methods work best for tomatoes in Rwanda?' },
  { emoji: '💡', label: 'Create a project', prompt: 'I want to create a new agricultural project. Help me define it and protect it with IP rights!' },
];

export default function AIGuidance() {
  const { t, user } = useApp();
  const [activeTab, setActiveTab] = useState<'chat' | 'projects'>('chat');
  const [messages, setMessages] = useState<UIMessage[]>([
    {
      id: '0', role: 'assistant',
      content: `👋 Hello${user?.name ? `, ${user.name.split(' ')[0]}` : ''}! I'm **AgriGuide**, your AI farming mentor! 🌱\n\nI provide practical farming advice + natural IP rights guidance in every response. I can help you:\n\n• Crop selection and soil management\n• Irrigation and pest control\n• **Create and track farming projects with IP protection**\n• **Copyright guidance for your farming guides, videos, photos**\n• Market timing and business planning\n\n**Tell me about your project or farm 🌱** and I'll help you succeed while protecting your innovations! �️`,
      timestamp: new Date(), type: 'text',
    }
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isStreaming) return;
    setError(null);
    
    const userMsg: UIMessage = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsStreaming(true);

    // Build history for context
    const history: ChatMsg[] = messages
      .filter(m => m.id !== '0')
      .map(m => ({ role: m.role, content: m.content }));
    history.push({ role: 'user', content: text });

    let assistantSoFar = '';
    const assistantId = (Date.now() + 1).toString();

    await streamChat({
      messages: history,
      onDelta: (chunk) => {
        assistantSoFar += chunk;
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.role === 'assistant' && last.id === assistantId) {
            return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: assistantSoFar } : m);
          }
          return [...prev, { id: assistantId, role: 'assistant', content: assistantSoFar, timestamp: new Date() }];
        });
      },
      onDone: () => {
        setIsStreaming(false);
        // Check if response contains plan/project keywords for auto-tracking
        const lower = assistantSoFar.toLowerCase();
        if (lower.includes('farm plan') || lower.includes('day-by-day') || lower.includes('planting schedule')) {
          confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 }, colors: ['#00c853', '#69f0ae', '#ffd700'] });
        }
      },
      onError: (err) => {
        setError(err);
        setIsStreaming(false);
      },
    });
  };

  const resetChat = () => {
    setMessages([{ id: '0', role: 'assistant', content: `👋 Fresh start! Tell me about your project — I'm ready to help! 🌱`, timestamp: new Date() }]);
    setError(null);
  };

  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Headers
      if (line.startsWith('### ')) return <h4 key={i} className="font-bold mt-2 mb-1 text-sm">{line.slice(4)}</h4>;
      if (line.startsWith('## ')) return <h3 key={i} className="font-bold mt-3 mb-1">{line.slice(3)}</h3>;
      if (line.startsWith('# ')) return <h2 key={i} className="font-bold text-lg mt-3 mb-1">{line.slice(2)}</h2>;
      
      // Bold processing
      const processed = line.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
      // Bullet points  
      if (line.trim().startsWith('- ') || line.trim().startsWith('• ')) {
        return <div key={i} className="pl-3 my-0.5" dangerouslySetInnerHTML={{ __html: '• ' + processed.replace(/^[\s]*[-•]\s*/, '') }} />;
      }
      if (/^\d+\.\s/.test(line.trim())) {
        return <div key={i} className="pl-3 my-0.5" dangerouslySetInnerHTML={{ __html: processed }} />;
      }
      if (line.trim() === '') return <div key={i} className="h-2" />;
      return <div key={i} dangerouslySetInnerHTML={{ __html: processed }} />;
    });
  };

  const renderMessage = (msg: UIMessage) => {
    const isUser = msg.role === 'user';
    return (
      <div key={msg.id} className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-fade-in`}>
        <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
          style={isUser
            ? { background: 'hsl(var(--emerald) / 0.2)', color: 'hsl(var(--emerald))' }
            : { background: 'var(--gradient-emerald)', color: 'hsl(var(--primary-foreground))' }}>
          {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
        </div>
        <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${isUser ? 'rounded-tr-md' : 'rounded-tl-md'}`}
          style={isUser
            ? { background: 'hsl(var(--emerald) / 0.15)', border: '1px solid hsl(var(--emerald) / 0.25)' }
            : { background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}>
          <div className="whitespace-pre-wrap">{renderMarkdown(msg.content)}</div>
          <div className="text-xs text-muted-foreground mt-2">
            {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #1b3a2a, #1b3a2a)' }}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">{t('chatWithGuide')}</h1>
              <div className="flex items-center gap-2">
                <span className="status-dot online" />
                <span className="text-xs text-muted-foreground">Powered by Lovable AI</span>
              </div>
            </div>
          </div>
          <button onClick={resetChat} className="p-2 rounded-lg transition-all hover:bg-secondary" title="New chat">
            <RotateCcw className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-3">
          <button onClick={() => setActiveTab('chat')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={activeTab === 'chat'
              ? { background: 'hsl(var(--emerald) / 0.15)', color: 'hsl(var(--emerald))', border: '1px solid hsl(var(--emerald) / 0.3)' }
              : { background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))' }}>
            <Bot className="w-4 h-4" /> Chat
          </button>
          <button onClick={() => setActiveTab('projects')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={activeTab === 'projects'
              ? { background: 'hsl(var(--sky) / 0.15)', color: 'hsl(var(--sky))', border: '1px solid hsl(var(--sky) / 0.3)' }
              : { background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))' }}>
            <FolderOpen className="w-4 h-4" /> {t('myProjects')} ({projects.length})
          </button>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="flex-1 overflow-y-auto space-y-3 pb-4">
            <button onClick={() => { setActiveTab('chat'); sendMessage('I want to create a new agricultural project. Help me define it and protect it with IP rights!'); }}
              className="w-full p-4 rounded-xl text-sm font-medium flex items-center gap-3 transition-all hover:scale-[1.01]"
              style={{ background: 'hsl(var(--emerald) / 0.1)', border: '1px dashed hsl(var(--emerald) / 0.4)', color: 'hsl(var(--emerald))' }}>
              <Plus className="w-5 h-5" />
              Create New Project via AI Chat 🌱
            </button>
            {projects.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">No projects yet</p>
                <p className="text-xs mt-1">Chat with AgriGuide to create your first farm project! 🌱</p>
              </div>
            )}
            {projects.map(p => (
              <div key={p.id} className="glass-card p-4">
                <h3 className="font-semibold text-sm">{p.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{p.description}</p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex-1 h-2 rounded-full overflow-hidden bg-secondary">
                    <div className="h-full rounded-full" style={{ width: `${p.progress}%`, background: 'linear-gradient(90deg, hsl(var(--emerald)), hsl(var(--sky)))' }} />
                  </div>
                  <span className="text-xs font-bold" style={{ color: 'hsl(var(--emerald))' }}>{p.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <>
            <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-1">
              {messages.map(renderMessage)}
              {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="flex gap-3 animate-fade-in">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
                    style={{ background: 'var(--gradient-emerald)', color: 'hsl(var(--primary-foreground))' }}>
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="rounded-2xl rounded-tl-md px-4 py-3" style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}>
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.15s' }} />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.3s' }} />
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl text-sm" style={{ background: 'hsl(var(--alert) / 0.1)', color: 'hsl(var(--alert))' }}>
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length <= 1 && (
              <div className="mb-3">
                <p className="text-xs text-muted-foreground mb-2">✨ Quick start:</p>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map(qp => (
                    <button key={qp.label} onClick={() => sendMessage(qp.prompt)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105"
                      style={{ background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))' }}>
                      <span>{qp.emoji}</span> {qp.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <input ref={inputRef} value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                  placeholder={t('chatPlaceholder')}
                  className="w-full px-4 py-3.5 pr-12 rounded-2xl text-sm outline-none"
                  style={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }}
                  disabled={isStreaming}
                />
                <button onClick={() => sendMessage(input)} disabled={!input.trim() || isStreaming}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
                  style={{ background: 'var(--gradient-emerald)', color: 'hsl(var(--primary-foreground))' }}>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p className="text-center text-[10px] text-muted-foreground mt-2">
              🛡️ AgriGuide integrates IP rights in all advice • Powered by Lovable AI • © 2026 AgriPio
            </p>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

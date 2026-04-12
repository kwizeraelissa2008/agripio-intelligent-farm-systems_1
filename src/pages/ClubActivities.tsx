import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/DashboardLayout';
import { HelpCircle, Users, MessageSquare, CheckCircle, XCircle, Loader2, RotateCcw, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Question { id: string; question: string; options: string[]; correct_index: number; explanation: string; category: string; }
interface Scenario { id: string; story_text: string; options: string[]; correct_index: number; explanation: string; }
interface Session { id: string; title: string; debate_proposition: string; session_date: string; }
interface DebatePost { id: string; user_id: string; argument_text: string; position: string; is_featured: boolean; created_at: string; }

type Tab = 'quiz' | 'roleplay' | 'debate';

export default function ClubActivities() {
  const { user, profile } = useAuth();
  const [tab, setTab] = useState<Tab>('quiz');

  // Quiz state
  const [questions, setQuestions] = useState<Question[]>([]);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizDone, setQuizDone] = useState(false);
  const [loadingQ, setLoadingQ] = useState(true);

  // Role-play state
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [sIdx, setSIdx] = useState(0);
  const [sSelected, setSSelected] = useState<number | null>(null);
  const [sAnswered, setSAnswered] = useState(false);
  const [sDone, setSDone] = useState(false);
  const [loadingS, setLoadingS] = useState(true);

  // Debate state
  const [session, setSession] = useState<Session | null>(null);
  const [posts, setPosts] = useState<DebatePost[]>([]);
  const [argText, setArgText] = useState('');
  const [position, setPosition] = useState<'for' | 'against'>('for');
  const [posting, setPosting] = useState(false);
  const [loadingD, setLoadingD] = useState(true);

  useEffect(() => { loadQuiz(); loadScenarios(); loadDebate(); }, []);

  const loadQuiz = async () => {
    setLoadingQ(true);
    const { data } = await supabase.from('quiz_questions').select('*');
    if (data) {
      const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, 10);
      setQuestions(shuffled.map(q => ({ ...q, options: q.options as string[] })));
    }
    setLoadingQ(false);
  };

  const loadScenarios = async () => {
    setLoadingS(true);
    const { data } = await supabase.from('scenarios').select('*');
    if (data) setScenarios(data.map(s => ({ ...s, options: s.options as string[] })));
    setLoadingS(false);
  };

  const loadDebate = async () => {
    setLoadingD(true);
    const { data: sessions } = await supabase.from('club_sessions').select('*').order('session_date', { ascending: false }).limit(1);
    if (sessions?.[0]) {
      setSession(sessions[0] as Session);
      const { data: dp } = await supabase.from('debate_posts').select('*').eq('session_id', sessions[0].id).order('created_at', { ascending: false });
      if (dp) setPosts(dp as DebatePost[]);
    }
    setLoadingD(false);
  };

  const handleAnswer = async (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const q = questions[qIdx];
    const correct = idx === q.correct_index;
    if (correct) setScore(s => s + 1);
    if (user) {
      await supabase.from('quiz_attempts').insert({ user_id: user.id, question_id: q.id, selected_index: idx, is_correct: correct });
    }
  };

  const nextQuestion = () => {
    if (qIdx + 1 >= questions.length) { setQuizDone(true); return; }
    setQIdx(i => i + 1); setSelected(null); setAnswered(false);
  };

  const resetQuiz = () => { setQIdx(0); setSelected(null); setAnswered(false); setScore(0); setQuizDone(false); loadQuiz(); };

  const handleScenario = async (idx: number) => {
    if (sAnswered) return;
    setSSelected(idx); setSAnswered(true);
    const s = scenarios[sIdx];
    if (user) await supabase.from('scenario_attempts').insert({ user_id: user.id, scenario_id: s.id, selected_index: idx });
  };

  const nextScenario = () => {
    if (sIdx + 1 >= scenarios.length) { setSDone(true); return; }
    setSIdx(i => i + 1); setSSelected(null); setSAnswered(false);
  };

  const postArgument = async () => {
    if (!argText.trim() || !user || !session) return;
    if (argText.length > 300) { toast.error('Max 300 characters'); return; }
    setPosting(true);
    const { error } = await supabase.from('debate_posts').insert({
      user_id: user.id, session_id: session.id,
      proposition: session.debate_proposition, position, argument_text: argText.trim(),
    });
    if (error) toast.error('Could not post argument');
    else { setArgText(''); await loadDebate(); }
    setPosting(false);
  };

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'roleplay', label: 'Role-Play', icon: Users },
    { id: 'debate', label: 'Debate', icon: MessageSquare },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-5 animate-fade-in pb-24">
        <h1 className="text-xl font-bold">Club Activities</h1>

        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={tab === t.id
                ? { background: 'hsl(var(--emerald) / 0.15)', color: 'hsl(var(--emerald))', border: '1px solid hsl(var(--emerald) / 0.3)' }
                : { background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))' }}>
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        {/* QUIZ */}
        {tab === 'quiz' && (
          loadingQ ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          : quizDone ? (
            <div className="glass-card p-8 text-center">
              <div className="text-5xl mb-3">{score >= 7 ? '🎉' : score >= 5 ? '👍' : '📚'}</div>
              <h2 className="text-xl font-bold mb-1">{score}/10 correct</h2>
              <p className="text-sm text-muted-foreground mb-6">{score >= 7 ? 'Excellent work!' : score >= 5 ? 'Good effort!' : 'Keep studying!'}</p>
              <button onClick={resetQuiz} className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white mx-auto"
                style={{ background: '#1b3a2a' }}>
                <RotateCcw className="w-4 h-4" /> Try Again
              </button>
            </div>
          ) : questions.length > 0 ? (
            <div className="glass-card p-5">
              <div className="flex justify-between text-xs text-muted-foreground mb-4">
                <span>Question {qIdx + 1} of {questions.length}</span>
                <span>Score: {score}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-secondary mb-5">
                <div className="h-full rounded-full transition-all" style={{ width: `${((qIdx) / questions.length) * 100}%`, background: '#1b3a2a' }} />
              </div>
              <p className="font-semibold mb-4 leading-relaxed">{questions[qIdx].question}</p>
              <div className="space-y-2 mb-4">
                {questions[qIdx].options.map((opt, i) => {
                  const isCorrect = answered && i === questions[qIdx].correct_index;
                  const isWrong = answered && selected === i && i !== questions[qIdx].correct_index;
                  return (
                    <button key={i} onClick={() => handleAnswer(i)} disabled={answered}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-3"
                      style={{
                        background: isCorrect ? 'hsl(var(--emerald) / 0.15)' : isWrong ? 'hsl(var(--alert) / 0.15)' : selected === i ? 'hsl(var(--secondary))' : 'hsl(var(--secondary))',
                        border: `1px solid ${isCorrect ? 'hsl(var(--emerald) / 0.4)' : isWrong ? 'hsl(var(--alert) / 0.4)' : 'hsl(var(--border))'}`,
                      }}>
                      {answered && isCorrect && <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'hsl(var(--emerald))' }} />}
                      {answered && isWrong && <XCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'hsl(var(--alert))' }} />}
                      {opt}
                    </button>
                  );
                })}
              </div>
              {answered && (
                <div className="rounded-xl p-3 mb-4 text-sm text-muted-foreground bg-secondary">
                  💡 {questions[qIdx].explanation}
                </div>
              )}
              {answered && (
                <button onClick={nextQuestion} className="w-full py-3 rounded-xl text-sm font-semibold text-white"
                  style={{ background: '#1b3a2a' }}>
                  {qIdx + 1 >= questions.length ? 'See Results' : 'Next Question →'}
                </button>
              )}
            </div>
          ) : <p className="text-center text-muted-foreground py-8">No questions available.</p>
        )}

        {/* ROLE-PLAY */}
        {tab === 'roleplay' && (
          loadingS ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          : sDone ? (
            <div className="glass-card p-8 text-center">
              <div className="text-5xl mb-3">🎭</div>
              <h2 className="text-xl font-bold mb-1">All scenarios complete!</h2>
              <p className="text-sm text-muted-foreground mb-6">You've worked through all {scenarios.length} IP scenarios.</p>
              <button onClick={() => { setSIdx(0); setSSelected(null); setSAnswered(false); setSDone(false); }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white mx-auto"
                style={{ background: '#1b3a2a' }}>
                <RotateCcw className="w-4 h-4" /> Start Over
              </button>
            </div>
          ) : scenarios.length > 0 ? (
            <div className="glass-card p-5">
              <div className="flex justify-between text-xs text-muted-foreground mb-4">
                <span>Scenario {sIdx + 1} of {scenarios.length}</span>
              </div>
              <p className="text-sm leading-relaxed mb-5 p-4 rounded-xl bg-secondary">{scenarios[sIdx].story_text}</p>
              <div className="space-y-2 mb-4">
                {scenarios[sIdx].options.map((opt, i) => {
                  const isCorrect = sAnswered && i === scenarios[sIdx].correct_index;
                  const isWrong = sAnswered && sSelected === i && i !== scenarios[sIdx].correct_index;
                  return (
                    <button key={i} onClick={() => handleScenario(i)} disabled={sAnswered}
                      className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all"
                      style={{
                        background: isCorrect ? 'hsl(var(--emerald) / 0.15)' : isWrong ? 'hsl(var(--alert) / 0.15)' : 'hsl(var(--secondary))',
                        border: `1px solid ${isCorrect ? 'hsl(var(--emerald) / 0.4)' : isWrong ? 'hsl(var(--alert) / 0.4)' : 'hsl(var(--border))'}`,
                      }}>
                      {opt}
                    </button>
                  );
                })}
              </div>
              {sAnswered && (
                <>
                  <div className="rounded-xl p-3 mb-4 text-sm text-muted-foreground bg-secondary">
                    ⚖️ {scenarios[sIdx].explanation}
                  </div>
                  <button onClick={nextScenario} className="w-full py-3 rounded-xl text-sm font-semibold text-white"
                    style={{ background: '#1b3a2a' }}>
                    {sIdx + 1 >= scenarios.length ? 'See Summary' : 'Next Scenario →'}
                  </button>
                </>
              )}
            </div>
          ) : <p className="text-center text-muted-foreground py-8">No scenarios available.</p>
        )}

        {/* DEBATE */}
        {tab === 'debate' && (
          loadingD ? <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
          : !session ? <p className="text-center text-muted-foreground py-8">No active session.</p>
          : (
            <div className="space-y-4">
              <div className="rounded-2xl p-5 text-white" style={{ background: '#1b3a2a' }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: '#a5d6a7' }}>Debate Proposition</p>
                <p className="font-bold leading-relaxed">"{session.debate_proposition}"</p>
              </div>

              {/* Post argument */}
              <div className="glass-card p-4">
                <div className="flex gap-2 mb-3">
                  {(['for', 'against'] as const).map(p => (
                    <button key={p} onClick={() => setPosition(p)}
                      className="flex-1 py-2 rounded-xl text-sm font-semibold transition-all capitalize"
                      style={position === p
                        ? { background: p === 'for' ? 'hsl(var(--emerald) / 0.2)' : 'hsl(var(--alert) / 0.2)', color: p === 'for' ? 'hsl(var(--emerald))' : 'hsl(var(--alert))', border: `1px solid ${p === 'for' ? 'hsl(var(--emerald) / 0.4)' : 'hsl(var(--alert) / 0.4)'}` }
                        : { background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))' }}>
                      {p === 'for' ? '👍 For' : '👎 Against'}
                    </button>
                  ))}
                </div>
                <textarea value={argText} onChange={e => setArgText(e.target.value.slice(0, 300))}
                  placeholder="Share your argument (max 300 chars)..." rows={3}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none bg-secondary border border-border mb-2" />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{argText.length}/300</span>
                  <button onClick={postArgument} disabled={!argText.trim() || posting}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-40"
                    style={{ background: '#1b3a2a' }}>
                    {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Post
                  </button>
                </div>
              </div>

              {/* Arguments */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(['for', 'against'] as const).map(side => (
                  <div key={side}>
                    <p className="text-xs font-semibold uppercase tracking-widest mb-2"
                      style={{ color: side === 'for' ? 'hsl(var(--emerald))' : 'hsl(var(--alert))' }}>
                      {side === 'for' ? '👍 For' : '👎 Against'}
                    </p>
                    <div className="space-y-2">
                      {posts.filter(p => p.position === side).map(p => (
                        <div key={p.id} className="glass-card p-3">
                          {p.is_featured && <span className="text-xs">⭐ </span>}
                          <p className="text-xs leading-relaxed">{p.argument_text}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{new Date(p.created_at).toLocaleDateString()}</p>
                        </div>
                      ))}
                      {posts.filter(p => p.position === side).length === 0 && (
                        <p className="text-xs text-muted-foreground italic">No arguments yet.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </DashboardLayout>
  );
}

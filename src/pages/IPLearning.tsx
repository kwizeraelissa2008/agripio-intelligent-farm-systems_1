/**
 * IP Learning Center — Lessons, Real Video Upload, Community Feed, Quizzes, Certificate
 * © 2026 AgriPio Team
 */
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  BookOpen, ChevronRight, CheckCircle, Play, Upload,
  Award, ArrowLeft, HelpCircle, Trophy, Star, Video, Users, Lightbulb, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { getProgress, saveProgress as saveLocalProgress } from '@/lib/localStorage';
import confetti from 'canvas-confetti';

interface QuizQuestion { question: string; options: string[]; correct: number; }
interface Lesson {
  id: string; title: string; category: string; content: string; example: string;
  reason: string; keyPoints: string[]; quiz: QuizQuestion[];
}
interface CommunityVideo {
  id: string; user_id: string; author_name: string; title: string; description: string | null; video_url: string; created_at: string;
}

const lessons: Lesson[] = [
  {
    id: 'intro', title: 'What is Intellectual Property?', category: 'Basics',
    content: `Intellectual Property (IP) refers to creations of the mind — inventions, designs, brand names, artistic works, and trade secrets.\n\nIn agriculture, IP protects innovations that improve farming and food production.\n\nThere are four main types:\n• Patents — Protect inventions (20 years)\n• Copyrights — Protect creative works (automatic)\n• Trademarks — Protect brand names (renewable)\n• Trade Secrets — Protect confidential info (forever if kept secret)`,
    example: `🌱 A farmer develops organic pest control → PATENT\nBrand name "GreenGuard" → TRADEMARK\nThe exact formula → TRADE SECRET`,
    reason: `🤔 Why learn about IP? Because YOUR farming ideas have value! When you invent a better way to grow crops, IP law helps you OWN that idea.`,
    keyPoints: ['IP protects creations of the mind', 'Four types: Patents, Copyrights, Trademarks, Trade Secrets', 'IP encourages innovation in agriculture'],
    quiz: [
      { question: 'What does IP stand for?', options: ['Internet Protocol', 'Intellectual Property', 'International Patent', 'Innovation Protection'], correct: 1 },
      { question: 'How many main types of IP are there?', options: ['2', '3', '4', '6'], correct: 2 },
    ],
  },
  {
    id: 'patents', title: 'Patents in Agriculture', category: 'Patents',
    content: `A patent gives an inventor exclusive rights for 20 years.\n\nIn agriculture, patents protect:\n• New plant varieties and hybrid seeds\n• Farm equipment and IoT sensors\n• New pest control processes\n• AI farming algorithms`,
    example: `🔬 AgriPio Patent:\n"Smart Soil Testing System"\n✅ Novel — No existing device like it\n✅ Non-obvious — Requires innovative engineering\n✅ Useful — Directly improves farming`,
    reason: `🛡️ Why patent your farm invention? Because it gives you EXCLUSIVE rights for 20 years!`,
    keyPoints: ['Patents last 20 years', 'Must be novel, non-obvious, useful', 'Covers inventions and processes'],
    quiz: [
      { question: 'How long does a patent last?', options: ['10 years', '15 years', '20 years', 'Forever'], correct: 2 },
      { question: 'Which is NOT required for a patent?', options: ['Novel', 'Non-obvious', 'Expensive', 'Useful'], correct: 2 },
    ],
  },
  {
    id: 'trademarks', title: 'Agricultural Trademarks', category: 'Trademarks',
    content: `A trademark identifies products or services.\n\nBenefits:\n• Build trust with consumers\n• Stand out from competitors\n• Branded products sell 30% higher!`,
    example: `™️ Imagine trademarking "Kayonza Gold Pineapples"\n→ Prevent others from using your name\n→ Build customer loyalty`,
    reason: `💰 Why trademark your farm brand? Because branded products sell for 30% MORE!`,
    keyPoints: ['Renewable every 10 years', 'Branded products cost 30% more', 'Includes names, logos, slogans'],
    quiz: [{ question: 'By how much can branding increase value?', options: ['10%', '20%', '30%', '50%'], correct: 2 }],
  },
  {
    id: 'protecting', title: 'Protecting Your Farm IP', category: 'Protection',
    content: `Every farmer has IP worth protecting!\n\nStep 1: Identify your innovations\nStep 2: Categorize (patent, copyright, trademark, trade secret)\nStep 3: Document everything with dates\nStep 4: Seek help from Rwanda's RDB IP division\nStep 5: Monitor and enforce\n\nARIPO can protect across 22 African countries! 🌍`,
    example: `📋 Farmer Jane's IP Portfolio:\n🔒 Patent: Humidity control system\n©️ Copyright: Mushroom growing guide\n™️ Trademark: "Ruhango Royal Mushrooms"\n🤫 Trade Secret: Substrate formula`,
    reason: `🌍 Why protect your farm IP? Because IP can multiply your farm's value by 2-3x!`,
    keyPoints: ['Identify → Categorize → Protect', 'Start with free protections', 'IP increases farm value 2-3x'],
    quiz: [
      { question: 'Which IP protection is free and automatic?', options: ['Patent', 'Copyright', 'Trademark', 'All of them'], correct: 1 },
    ],
  },
];

export default function IPLearning() {
  const { t, language } = useApp();
  const { user, profile } = useAuth();
  const [currentLesson, setCurrentLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);
  const [activeSection, setActiveSection] = useState<'lessons' | 'videos'>('lessons');
  const [communityVideos, setCommunityVideos] = useState<CommunityVideo[]>([]);
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lesson = lessons[currentLesson];
  const progress = (completedLessons.length / lessons.length) * 100;
  const allCompleted = completedLessons.length === lessons.length;
  const quizScore = lesson.quiz.reduce((acc, q, i) => acc + (quizAnswers[i] === q.correct ? 1 : 0), 0);
  const quizPassed = quizSubmitted && quizScore >= Math.ceil(lesson.quiz.length * 0.6);

  // Fetch real videos + load saved progress from localStorage
  useEffect(() => {
    const fetchVideos = async () => {
      setLoadingVideos(true);
      const { data } = await supabase.from('community_videos').select('*').order('created_at', { ascending: false });
      setCommunityVideos((data as CommunityVideo[]) || []);
      setLoadingVideos(false);
    };
    fetchVideos();
    if (user) setCompletedLessons(getProgress(user.id));
  }, [user]);

  const saveProgress = async (moduleId: string) => {
    if (!user || completedLessons.includes(moduleId)) return;
    saveLocalProgress(user.id, moduleId);
    setCompletedLessons(prev => [...prev, moduleId]);
  };

  const markComplete = async () => {
    await saveProgress(lesson.id);
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(prev => prev + 1);
      setShowQuiz(false); setShowReason(false); setQuizAnswers({}); setQuizSubmitted(false);
    }
  };

  const handleQuizSubmit = async () => {
    setQuizSubmitted(true);
    if (quizScore >= Math.ceil(lesson.quiz.length * 0.6)) {
      await saveProgress(lesson.id);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 }, colors: ['#00c853', '#ffd700', '#2196f3'] });
    }
  };

  const handleDeleteVideo = async (videoId: string, videoUrl: string) => {
    if (!user) return;
    // Extract storage path from URL
    const urlParts = videoUrl.split('/videos/');
    const storagePath = urlParts[1];
    if (storagePath) {
      await supabase.storage.from('videos').remove([storagePath]);
    }
    const { error } = await supabase.from('community_videos').delete().eq('id', videoId).eq('user_id', user.id);
    if (error) toast.error(error.message);
    else {
      toast.success('Video deleted');
      setCommunityVideos(prev => prev.filter(v => v.id !== videoId));
    }
  };
  const handleVideoUpload = async () => {
    if (!uploadTitle.trim() || !selectedFile || !user) return;
    setUploading(true);

    const ext = selectedFile.name.split('.').pop();
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from('videos').upload(path, selectedFile);
    if (uploadError) {
      toast.error(uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from('videos').getPublicUrl(path);

    const { error: insertError } = await supabase.from('community_videos').insert({
      user_id: user.id,
      title: uploadTitle,
      description: uploadDesc || null,
      video_url: urlData.publicUrl,
      author_name: profile?.display_name || 'Farmer',
    } as any);

    if (insertError) {
      toast.error(insertError.message);
    } else {
      toast.success(t('videoCopyright') + ' 🎉');
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 }, colors: ['#00c853', '#69f0ae'] });
      setUploadTitle(''); setUploadDesc(''); setSelectedFile(null);
      // Refresh videos
      const { data } = await supabase.from('community_videos').select('*').order('created_at', { ascending: false });
      setCommunityVideos((data as CommunityVideo[]) || []);
    }
    setUploading(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-5 animate-fade-in pb-24">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="w-8 h-8 rounded-lg flex items-center justify-center bg-secondary border border-border">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">📚 {t('ipLearning')}</h1>
            <p className="text-xs text-muted-foreground">{t('ipLearningDesc')}</p>
          </div>
        </div>

        {/* Section Toggle */}
        <div className="flex gap-2">
          <button onClick={() => setActiveSection('lessons')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={activeSection === 'lessons'
              ? { background: 'hsl(var(--emerald) / 0.15)', color: 'hsl(var(--emerald))', border: '1px solid hsl(var(--emerald) / 0.3)' }
              : { background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))' }}>
            <BookOpen className="w-4 h-4" /> {t('lessons')}
          </button>
          <button onClick={() => setActiveSection('videos')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={activeSection === 'videos'
              ? { background: 'hsl(var(--sky) / 0.15)', color: 'hsl(var(--sky))', border: '1px solid hsl(var(--sky) / 0.3)' }
              : { background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))' }}>
            <Video className="w-4 h-4" /> {t('communityVideos')}
          </button>
        </div>

        {/* ===== COMMUNITY VIDEOS SECTION ===== */}
        {activeSection === 'videos' && (
          <div className="space-y-5">
            <div className="glass-card p-5" style={{ border: '1px solid hsl(var(--sky) / 0.3)' }}>
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <Upload className="w-4 h-4" style={{ color: 'hsl(var(--sky))' }} />
                {t('shareStory')} 📹
              </h2>
              <div className="space-y-3">
                <input value={uploadTitle} onChange={e => setUploadTitle(e.target.value)}
                  placeholder={t('uploadVideo') + ' title'}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none bg-secondary border border-border" />
                <textarea value={uploadDesc} onChange={e => setUploadDesc(e.target.value)}
                  placeholder={t('describeVideo')} rows={2}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none bg-secondary border border-border" />
                <div className="flex gap-3">
                  <input ref={fileInputRef} type="file" accept="video/*" className="hidden"
                    onChange={e => setSelectedFile(e.target.files?.[0] || null)} />
                  <button onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium bg-secondary border border-border">
                    <Video className="w-4 h-4" />
                    {selectedFile ? `📎 ${selectedFile.name.slice(0, 20)}...` : t('uploadVideo')}
                  </button>
                  <button onClick={handleVideoUpload} disabled={!uploadTitle.trim() || !selectedFile || uploading}
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-primary-foreground disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, hsl(var(--sky)), hsl(200 80% 35%))' }}>
                    {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                    🚀 {t('share')}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">⚠️ {t('videoCopyright')} 🛡️</p>
              </div>
            </div>

            {/* Community Feed */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" style={{ color: 'hsl(var(--emerald))' }} />
                {t('communityVideos')} ({communityVideos.length})
              </h3>
              {loadingVideos ? (
                <div className="text-center py-8"><Loader2 className="w-6 h-6 mx-auto animate-spin text-muted-foreground" /></div>
              ) : communityVideos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  {t('noVideosYet')}
                </div>
              ) : (
                <div className="space-y-3">
                  {communityVideos.map(v => (
                    <div key={v.id} className="glass-card p-4 space-y-3">
                      <div className="flex gap-4 items-start">
                        <div className="w-20 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                          <video src={v.video_url} className="w-full h-full object-cover" preload="metadata" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-sm truncate">{v.title}</h4>
                          {v.description && <p className="text-xs text-muted-foreground mt-0.5">{v.description}</p>}
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-xs font-medium" style={{ color: 'hsl(var(--emerald))' }}>👤 {v.author_name}</span>
                            <span className="text-xs text-muted-foreground">{new Date(v.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 flex-shrink-0">
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold"
                            style={{ background: 'hsl(var(--emerald) / 0.1)', color: 'hsl(var(--emerald))' }}>
                            © Protected
                          </span>
                          {v.user_id === user?.id && (
                            <button
                              onClick={() => handleDeleteVideo(v.id, v.video_url)}
                              className="text-[10px] px-2 py-0.5 rounded-full font-medium transition-all hover:opacity-80"
                              style={{ background: 'hsl(var(--alert) / 0.1)', color: 'hsl(var(--alert))' }}>
                              🗑 Delete
                            </button>
                          )}
                        </div>
                      </div>
                      {/* Playable video */}
                      <video src={v.video_url} controls className="w-full rounded-lg max-h-[300px]" preload="metadata" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== LESSONS SECTION ===== */}
        {activeSection === 'lessons' && (
          <>
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{t('progress')}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold" style={{ color: 'hsl(var(--emerald))' }}>{completedLessons.length}/{lessons.length}</span>
                  {allCompleted && (
                    <button onClick={() => { setShowCertificate(true); confetti({ particleCount: 100, spread: 80, colors: ['#ffd700', '#00c853'] }); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                      style={{ background: 'hsl(var(--gold) / 0.15)', color: 'hsl(var(--gold))', border: '1px solid hsl(var(--gold) / 0.3)' }}>
                      <Trophy className="w-3.5 h-3.5" /> {t('certificate')}
                    </button>
                  )}
                </div>
              </div>
              <div className="w-full h-3 rounded-full overflow-hidden bg-secondary">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: 'var(--gradient-emerald)' }} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
              <div className="glass-card p-4 lg:col-span-1">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" style={{ color: 'hsl(var(--emerald))' }} /> {t('lessons')}
                </h3>
                <div className="space-y-1">
                  {lessons.map((l, i) => (
                    <button key={l.id} onClick={() => { setCurrentLesson(i); setShowQuiz(false); setShowReason(false); setQuizAnswers({}); setQuizSubmitted(false); }}
                      className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2"
                      style={currentLesson === i ? { background: 'hsl(var(--emerald) / 0.15)', color: 'hsl(var(--emerald))' } : {}}>
                      {completedLessons.includes(l.id)
                        ? <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'hsl(var(--emerald))' }} />
                        : <span className="w-4 h-4 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold bg-secondary">{i + 1}</span>
                      }
                      <span className="truncate text-xs">{l.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="lg:col-span-3 space-y-4">
                <div className="rounded-xl overflow-hidden">
                  <div className="px-5 py-2.5" style={{ background: 'hsl(var(--emerald))' }}>
                    <span className="text-xs font-bold uppercase text-primary-foreground">{lesson.category}</span>
                  </div>
                  <div className="px-5 py-4 bg-secondary">
                    <h2 className="text-lg font-bold">{lesson.title}</h2>
                  </div>
                </div>

                <div className="glass-card p-5">
                  {lesson.content.split('\n\n').map((para, i) => (
                    <div key={i} className="mb-3">
                      {para.split('\n').map((line, j) => (
                        <p key={j} className="text-sm text-muted-foreground leading-relaxed mb-1">{line}</p>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Why */}
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid hsl(var(--gold) / 0.3)' }}>
                  <button onClick={() => setShowReason(!showReason)} className="w-full px-4 py-3 flex items-center justify-between" style={{ background: 'hsl(var(--gold) / 0.1)' }}>
                    <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'hsl(var(--gold))' }}>
                      <Lightbulb className="w-4 h-4" /> 💡 {t('whyMatters')}
                    </span>
                    <ChevronRight className="w-4 h-4" style={{ color: 'hsl(var(--gold))', transform: showReason ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                  {showReason && (
                    <div className="p-4 bg-secondary">
                      <p className="text-sm text-muted-foreground leading-relaxed">{lesson.reason}</p>
                    </div>
                  )}
                </div>

                {/* Example */}
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid hsl(var(--emerald) / 0.3)' }}>
                  <div className="px-4 py-2 flex items-center gap-2" style={{ background: 'hsl(var(--emerald) / 0.1)' }}>
                    <Star className="w-4 h-4" style={{ color: 'hsl(var(--emerald))' }} />
                    <span className="text-sm font-semibold" style={{ color: 'hsl(var(--emerald))' }}>{t('example')}</span>
                  </div>
                  <div className="p-4 bg-secondary">
                    {lesson.example.split('\n').map((line, i) => (
                      <p key={i} className="text-sm text-muted-foreground mb-0.5">{line || '\u00A0'}</p>
                    ))}
                  </div>
                </div>

                {/* Key Points */}
                <div className="glass-card p-4">
                  <h3 className="text-sm font-semibold mb-2">📝 {t('keyPoints')}</h3>
                  {lesson.keyPoints.map((kp, i) => (
                    <div key={i} className="flex items-start gap-2 mb-1">
                      <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'hsl(var(--emerald))' }} />
                      <span className="text-xs text-muted-foreground">{kp}</span>
                    </div>
                  ))}
                </div>

                {/* Quiz */}
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid hsl(270 60% 60% / 0.3)' }}>
                  <button onClick={() => setShowQuiz(!showQuiz)} className="w-full px-4 py-3 flex items-center justify-between" style={{ background: 'hsl(270 60% 60% / 0.1)' }}>
                    <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'hsl(270 60% 60%)' }}>
                      <HelpCircle className="w-4 h-4" /> 📝 Quiz
                    </span>
                    <ChevronRight className="w-4 h-4" style={{ color: 'hsl(270 60% 60%)', transform: showQuiz ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                  {showQuiz && (
                    <div className="p-4 space-y-4 bg-secondary">
                      {lesson.quiz.map((q, qi) => (
                        <div key={qi} className="p-3 rounded-xl bg-background border border-border">
                          <p className="text-sm font-medium mb-2">{qi + 1}. {q.question}</p>
                          <div className="space-y-1.5">
                            {q.options.map((opt, oi) => {
                              const selected = quizAnswers[qi] === oi;
                              const isCorrect = quizSubmitted && oi === q.correct;
                              const isWrong = quizSubmitted && selected && oi !== q.correct;
                              return (
                                <button key={oi} onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                                  className="w-full text-left px-3 py-2 rounded-lg text-xs transition-all"
                                  style={{
                                    background: isCorrect ? 'hsl(var(--emerald) / 0.15)' : isWrong ? 'hsl(var(--alert) / 0.15)' : selected ? 'hsl(270 60% 60% / 0.15)' : 'hsl(var(--secondary))',
                                    border: `1px solid ${isCorrect ? 'hsl(var(--emerald) / 0.4)' : isWrong ? 'hsl(var(--alert) / 0.4)' : selected ? 'hsl(270 60% 60% / 0.4)' : 'hsl(var(--border))'}`,
                                  }}>
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                      {!quizSubmitted ? (
                        <button onClick={handleQuizSubmit} disabled={Object.keys(quizAnswers).length < lesson.quiz.length}
                          className="w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-40"
                          style={{ background: 'hsl(270 60% 60% / 0.15)', color: 'hsl(270 60% 60%)', border: '1px solid hsl(270 60% 60% / 0.3)' }}>
                          {t('submitQuiz')}
                        </button>
                      ) : (
                        <div className="text-center p-3 rounded-xl" style={{ background: quizPassed ? 'hsl(var(--emerald) / 0.1)' : 'hsl(var(--alert) / 0.1)' }}>
                          <p className="text-sm font-bold" style={{ color: quizPassed ? 'hsl(var(--emerald))' : 'hsl(var(--alert))' }}>
                            {quizPassed ? `✅ ${t('quizPassed')}! ${quizScore}/${lesson.quiz.length}` : `❌ ${t('tryAgain')}. ${quizScore}/${lesson.quiz.length}`}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-3">
                  {currentLesson > 0 && (
                    <button onClick={() => { setCurrentLesson(prev => prev - 1); setShowQuiz(false); setShowReason(false); setQuizAnswers({}); setQuizSubmitted(false); }}
                      className="px-4 py-3 rounded-xl text-sm font-medium bg-secondary border border-border">
                      ← {t('previous')}
                    </button>
                  )}
                  <button onClick={markComplete}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-primary-foreground"
                    style={{ background: 'var(--gradient-emerald)' }}>
                    {currentLesson < lessons.length - 1 ? t('nextLesson') : t('completeCourse')}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Certificate Modal */}
        {showCertificate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowCertificate(false)}>
            <div className="w-full max-w-lg rounded-2xl p-8 text-center animate-slide-up" onClick={e => e.stopPropagation()}
              style={{ background: 'linear-gradient(135deg, hsl(var(--card)), hsl(var(--secondary)))', border: '2px solid hsl(var(--gold) / 0.4)' }}>
              <Award className="w-16 h-16 mx-auto mb-4" style={{ color: 'hsl(var(--gold))' }} />
              <h2 className="text-2xl font-bold mb-1">🎉 {t('certificate')} of Completion</h2>
              <p className="text-muted-foreground text-sm mb-4">{t('ipLearning')} — AgriPio Learning Center</p>
              <div className="text-xl font-bold mb-4" style={{ color: 'hsl(var(--emerald))' }}>
                {profile?.display_name || 'Outstanding'} — Achievement Unlocked!
              </div>
              <p className="text-xs text-muted-foreground mb-6">
                Completed all {lessons.length} lessons on Intellectual Property in Agriculture.
                <br />Issued by IP Club — Ecole Des Sciences Byimana
              </p>
              <p className="text-xs text-muted-foreground">© 2026 AgriPio Team</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

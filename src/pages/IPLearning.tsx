/**
 * IP Learning Center — 5 Agriculture-Focused Lessons
 * © 2026 AgriPio Team | Rwanda Law No. 31/2009
 */
import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import {
  BookOpen, ChevronRight, CheckCircle, Upload, Award, ArrowLeft,
  HelpCircle, Trophy, Star, Video, Users, Lightbulb, Loader2, Trash2, Lock
} from 'lucide-react';
import { toast } from 'sonner';
import { getProgress, saveProgress as saveLocalProgress } from '@/lib/localStorage';
import confetti from 'canvas-confetti';

interface Q { question: string; options: string[]; correct: number; explanation: string; }
interface Section { heading: string; body: string; }
interface Lesson {
  id: string; number: number; title: string; subtitle: string; emoji: string;
  sections: Section[];
  example: { title: string; lines: string[] };
  whyMatters: string;
  keyPoints: string[];
  quiz: Q[];
}
interface CommunityVideo {
  id: string; user_id: string; author_name: string;
  title: string; description: string | null; video_url: string; created_at: string;
}

const lessons: Lesson[] = [
  {
    id: 'what_is_ip', number: 1, emoji: '🌱',
    title: 'What is Intellectual Property?',
    subtitle: 'Understanding IP in the context of farming',
    sections: [
      { heading: 'Definition',
        body: 'Intellectual Property (IP) refers to creations of the human mind that have value. In agriculture, IP covers the innovations, knowledge, and creative works that farmers and cooperatives produce every day — from a new composting technique to a branded product name.' },
      { heading: 'The Four Types of IP in Agriculture',
        body: '• Patents — Protect new farming inventions (e.g. a new irrigation device) for 20 years\n• Copyright — Protects creative works like farming guides, photos, and training videos — automatically from creation\n• Trademarks — Protect brand names and logos (e.g. "Kayonza Gold Pineapples™")\n• Trade Secrets — Protect confidential formulas or methods (e.g. a special compost recipe) — forever, as long as kept secret' },
      { heading: 'Why IP Matters for Rwandan Farmers',
        body: "Rwanda's Law No. 31/2009 on Intellectual Property protects all these rights. Rwanda is also a member of ARIPO (since 2010), meaning your IP can be protected across 22 African countries.\n\nWhen you write a farming guide, take a photo of your crop, or develop a new planting method — you are creating intellectual property. Knowing your rights means you can protect and benefit from your own innovations." },
    ],
    example: {
      title: "Farmer Amina's IP Portfolio",
      lines: [
        '🌿 She developed a new organic pest spray → PATENT (protects the invention for 20 years)',
        '📄 She wrote a 10-page composting guide → COPYRIGHT (automatic from the moment of writing)',
        '🏷️ She branded her honey "Musanze Pure Honey" → TRADEMARK (protects the brand name)',
        '🤫 Her exact bee-feeding formula → TRADE SECRET (kept confidential, protected forever)',
      ],
    },
    whyMatters: 'Without IP knowledge, other people can copy your farming innovations, use your brand name, or republish your guides without paying you. IP law gives you the legal tools to say "this is mine" and enforce that right.',
    keyPoints: [
      'IP protects creations of the mind — including farming innovations',
      'Four types: Patents, Copyright, Trademarks, Trade Secrets',
      'Rwanda Law No. 31/2009 protects all four types',
      'Rwanda is an ARIPO member — protection extends across 22 African countries',
      'You already own IP — you just need to know how to protect it',
    ],
    quiz: [
      { question: 'A farmer in Rwanda develops a new drip irrigation system. Which type of IP protects this invention?',
        options: ['Copyright', 'Trademark', 'Patent', 'Trade Secret'], correct: 2,
        explanation: 'A patent protects inventions — new devices, processes, or methods. A drip irrigation system is a new invention, so a patent is the right protection.' },
      { question: 'Which type of IP is automatic — it exists from the moment you create something?',
        options: ['Patent', 'Trademark', 'Trade Secret', 'Copyright'], correct: 3,
        explanation: 'Copyright is automatic under Rwanda Law No. 31/2009. The moment you write a guide, take a photo, or record a video, copyright exists — no registration needed.' },
      { question: 'Rwanda joined ARIPO in which year?',
        options: ['2000', '2005', '2010', '2015'], correct: 2,
        explanation: 'Rwanda became the 18th ARIPO member state on March 24, 2010. ARIPO membership means Rwandan farmers can protect their IP across 22 African countries.' },
    ],
  },
  {
    id: 'copyright', number: 2, emoji: '©️',
    title: 'What is Copyright?',
    subtitle: 'Protecting your farming guides, photos, and videos',
    sections: [
      { heading: 'What Copyright Protects in Agriculture',
        body: 'Copyright protects original creative works expressed in a tangible form. For farmers:\n\n✅ Written cultivation guides and manuals\n✅ Farm photographs and drone images\n✅ Training videos and recorded workshops\n✅ Hand-drawn farm diagrams and maps\n✅ Educational materials and presentations\n✅ Software and apps (like AgriPio itself)\n\n❌ Ideas and techniques in your head — NOT protected (must be expressed first)\n❌ Seed varieties themselves — covered by Plant Variety Protection, a different law' },
      { heading: 'How Copyright Works in Rwanda',
        body: "Under Rwanda Law No. 31/2009, copyright is AUTOMATIC. The moment you create and express an original work, you own the copyright — no registration required.\n\nCopyright lasts for your entire life plus 50 years after your death (Article 228). This means your farming guide can protect your family's income for generations.\n\nYou can voluntarily register with Rwanda Development Board (RDB) to get official proof of ownership — useful if you ever need to prove your rights in a dispute." },
      { heading: 'What Copyright Gives You',
        body: 'As the copyright owner, only YOU have the right to:\n• Reproduce your work (print, copy, share)\n• Distribute it (sell, give away)\n• Create adaptations (translate, modify)\n• Perform or display it publicly\n\nAnyone who does these things without your permission is infringing your copyright — even if they found your work online.' },
    ],
    example: {
      title: 'Real Scenarios',
      lines: [
        '📱 Jean posts his composting guide on WhatsApp → He KEEPS copyright. Posting publicly does not give it away.',
        "📺 An NGO prints 500 copies of Claudine's irrigation guide for free → They STILL need her written permission.",
        "📷 A company uses Amina's farm photo in their advertisement → Copyright infringement. Amina can demand payment and removal.",
        '🎥 A cooperative records a training session → The cooperative holds RELATED RIGHTS as the producer of the recording.',
      ],
    },
    whyMatters: 'Every farming guide you write, every photo you take, every video you record is automatically yours. Copyright means you can earn money from your knowledge — through licensing, selling guides, or charging for training materials.',
    keyPoints: [
      'Copyright is AUTOMATIC from the moment of creation — no registration needed',
      'Lasts life of author + 50 years (Rwanda Law No. 31/2009, Article 228)',
      'Protects: written guides, photos, videos, diagrams, software',
      'Does NOT protect: ideas, techniques not yet written down, seed varieties',
      'Posting online does NOT remove your copyright',
      'Voluntary registration with RDB gives official proof of ownership',
    ],
    quiz: [
      { question: "A farmer writes a detailed guide about her bean cultivation method. When does copyright begin?",
        options: ['When she registers with RDB', 'When she publishes it online', 'The moment she writes it down', 'After 6 months'],
        correct: 2, explanation: 'Copyright is automatic under Rwanda Law No. 31/2009. It begins the moment the work is created and expressed in tangible form — no registration or publication needed.' },
      { question: 'How long does copyright last in Rwanda?',
        options: ['25 years', '50 years', 'Life of author + 50 years', 'Forever'],
        correct: 2, explanation: 'Rwanda Law No. 31/2009 Article 228: copyright lasts for the life of the author plus 50 years after their death.' },
      { question: 'Which of these is NOT protected by copyright?',
        options: ['A written guide on organic farming', 'A photo of your maize field', 'The idea of using drip irrigation (not yet written)', 'A recorded training video'],
        correct: 2, explanation: 'Copyright protects expressions, not ideas. An idea must be expressed in a tangible form before copyright applies.' },
    ],
  },
  {
    id: 'related_rights', number: 3, emoji: '🎙️',
    title: 'Related Rights',
    subtitle: 'Protecting performances, recordings, and broadcasts in agriculture',
    sections: [
      { heading: 'What are Related Rights?',
        body: 'Related rights (also called neighbouring rights) protect people who perform, produce, or broadcast creative works — even if they did not create the original work.\n\nIn agriculture, three groups benefit:\n\n1. Performers — Farmers who present at workshops or demonstrate techniques\n2. Producers of Recordings — Cooperatives or organisations that record training sessions\n3. Broadcasters — Radio stations or TV channels that broadcast farming advice' },
      { heading: 'How Related Rights Work in Agriculture',
        body: "Example: A cooperative organises a training session where expert farmers demonstrate composting. The session is recorded on video.\n\n• The farmers who demonstrated → hold PERFORMER'S rights in their performance\n• The cooperative that produced the recording → holds PRODUCER'S rights for 50 years\n• If a radio station broadcasts the audio → the station holds BROADCASTER'S rights\n\nAll three can exist at the same time, independently of each other.\n\nDuration: Related rights last 50 years from the end of the year of performance (WIPO WPPT 1996, Article 17)." },
      { heading: 'Collective Management Organisations (CMOs)',
        body: 'A CMO manages copyright and related rights on behalf of creators. They:\n• License works to users (broadcasters, publishers)\n• Collect royalties\n• Distribute payments to rights holders\n\nIn Rwanda, RDB oversees IP management. CMOs act as the link between farmers who create content and organisations that want to use it.' },
    ],
    example: {
      title: 'The Cooperative Recording Scenario',
      lines: [
        '🎬 Musanze Farmers Cooperative records a 2-hour training on soil health',
        "👨‍🌾 The 3 expert farmers who presented → hold performer's related rights",
        "🏢 The cooperative that produced the recording → holds producer's related rights for 50 years",
        '📻 Radio Rwanda wants to broadcast the audio → must get permission from the cooperative',
        '💰 The cooperative can charge a licensing fee for the broadcast',
      ],
    },
    whyMatters: 'Many farmers present at workshops and cooperatives record training sessions without knowing they have legal rights in those recordings. Related rights mean you can control how your performances and recordings are used — and earn from them.',
    keyPoints: [
      'Related rights protect performers, producers of recordings, and broadcasters',
      'Separate from copyright — can exist alongside it',
      'Duration: 50 years from end of year of performance (WIPO WPPT 1996)',
      "Cooperatives that record training sessions hold producer's related rights",
      'Permission is required before broadcasting or reproducing a recording',
      'CMOs help manage and collect royalties for rights holders',
    ],
    quiz: [
      { question: 'A cooperative records a farmer training session on composting. Who holds related rights in the recording?',
        options: ['No one — it was an informal session', 'The farmers who presented', 'The cooperative as producer of the recording', 'The Rwanda government'],
        correct: 2, explanation: "The cooperative, as the producer of the recording, holds related rights (neighbouring rights) for 50 years. This is separate from the performers' rights held by the farmers who presented." },
      { question: 'How long do related rights last under the WIPO WPPT 1996?',
        options: ['25 years', '50 years from end of year of performance', '70 years', 'Forever'],
        correct: 1, explanation: 'The WIPO Performances and Phonograms Treaty 1996 (Article 17) sets a minimum of 50 years for related rights protection, calculated from the end of the year of performance.' },
      { question: "A radio station wants to broadcast audio from a cooperative's recorded training. What must they do first?",
        options: ['Nothing — recordings are public once made', 'Pay a government fee', 'Get permission from the cooperative as producer', 'Only ask if they plan to charge listeners'],
        correct: 2, explanation: 'The cooperative holds related rights as producer of the recording. The radio station must obtain their permission before broadcasting — regardless of whether they charge listeners.' },
    ],
  },
  {
    id: 'creative_economy', number: 4, emoji: '🌍',
    title: 'IP and the Creative Economy',
    subtitle: 'How agriculture connects to the creative industries',
    sections: [
      { heading: 'Agriculture as a Creative Industry',
        body: 'The creative economy includes all industries where value comes from creativity and intellectual property. Agriculture is part of the creative economy when farmers:\n\n• Write original cultivation guides → literary works\n• Produce training videos → audiovisual works\n• Take farm photographs → artistic works\n• Develop branded products → trademarks\n• Invent new farming tools or methods → patents\n• Create educational programmes → literary and educational works\n\nThe 2025 ARIPO IP Club competition theme confirms this: "Intellectual Property and the Creative Industries: a perfect tool for development."' },
      { heading: 'The Economic Value of Agricultural IP',
        body: '• Branded agricultural products sell for 20–30% more than unbranded ones\n• Farmers with documented IP are 2–3x more attractive to investors\n• Africa is projected to contribute up to 10% of global creative goods exports by 2030 — worth $200 billion and 20+ million jobs\n• A farming guide with copyright can be licensed to NGOs, schools, and cooperatives — generating ongoing income\n\nAgriPio itself is an example: its source code, educational content, and AI persona are all copyrighted works under Rwanda Law No. 31/2009.' },
      { heading: 'Is This Protected? — Five Scenarios',
        body: "✅ Amina's written composting guide → YES — literary work, copyright automatic\n❌ Jean's idea for crop rotation (not written) → NO — ideas are not protected\n✅ Cooperative's recorded training video → YES — related rights as producer\n⚠️ Seed variety Jean developed → DIFFERENT — Plant Variety Protection (separate law)\n✅ Claudine's farm photo posted on WhatsApp → YES — posting does not remove copyright" },
    ],
    example: {
      title: "Rwanda's Creative Agriculture Economy",
      lines: [
        '🍍 "Kayonza Gold Pineapples™" — trademark adds premium value to the brand',
        '📚 Farmer Jean licenses his soil guide to 5 NGOs at RWF 50,000 each = RWF 250,000 income',
        '🎥 Cooperative sells training video rights to an agricultural TV channel',
        "🔬 AgriPio's IoT sensor patent protects the team's invention for 20 years",
        '🌍 ARIPO Kampala Protocol 2021 — register once, protect across East Africa',
      ],
    },
    whyMatters: "Understanding that agriculture is part of the creative economy changes how you see your work. Your farming knowledge is not just practical — it is intellectual property with real economic value. Protecting it means protecting your income and your family's future.",
    keyPoints: [
      'Agriculture is part of the creative economy when farmers create original content',
      'Branded products sell 20–30% more than unbranded ones',
      'Documented IP makes farmers 2–3x more attractive to investors',
      'Africa projected to contribute $200 billion to global creative economy by 2030',
      'ARIPO Kampala Protocol 2021 — register copyright across East Africa with one application',
      '2025 ARIPO theme: "IP and the Creative Industries: a perfect tool for development"',
    ],
    quiz: [
      { question: 'Agriculture becomes part of the creative economy when farmers do what?',
        options: ['Sell crops at market', 'Create original guides, videos, and training materials', 'Use fertilizer', 'Own more than 5 hectares'],
        correct: 1, explanation: 'Agriculture connects to the creative economy through original content creation — written guides, training videos, farm photos, educational programmes. These are all copyrightable works.' },
      { question: 'By how much can branding (trademark) increase the value of agricultural products?',
        options: ['5–10%', '10–15%', '20–30%', '50–60%'],
        correct: 2, explanation: 'Branded agricultural products typically sell for 20–30% more than unbranded equivalents. A trademark protects the brand name and builds consumer trust.' },
      { question: 'What does the ARIPO Kampala Protocol 2021 allow?',
        options: ['Patent registration only', 'Voluntary copyright registration across ARIPO member states', 'Trademark applications only', 'Agricultural land rights'],
        correct: 1, explanation: 'The Kampala Protocol (2021) provides a system for voluntary registration of copyright and related rights across all ARIPO member states — including Rwanda — with a single application.' },
    ],
  },
  {
    id: 'respect_ip', number: 5, emoji: '🤝',
    title: 'Respect for IP',
    subtitle: "How to protect your rights and respect others'",
    sections: [
      { heading: 'What Happens When IP is Ignored',
        body: "When intellectual property rights are not respected in agriculture:\n\n• A farmer's cultivation guide gets copied and sold by someone else — the farmer earns nothing\n• A cooperative's training video is broadcast without permission — no royalties paid\n• A branded product name is copied by a competitor — consumers are confused\n• An invented farming tool is manufactured by others — the inventor loses their advantage\n\nThese are not just unfair — they are illegal under Rwanda Law No. 31/2009 and can result in legal action." },
      { heading: 'How to Protect Your Own IP',
        body: 'Step 1: IDENTIFY — What have you created? Guides, photos, videos, methods, brands?\nStep 2: DOCUMENT — Write it down with dates. Take photos. Keep drafts. Email yourself a copy.\nStep 3: REGISTER (optional but recommended) — Register with RDB for official proof. Consider ARIPO Kampala Protocol for regional protection.\nStep 4: MONITOR — Watch for unauthorised use of your work online and in your community.\nStep 5: ENFORCE — If someone copies your work without permission:\n   → Contact them and ask them to stop\n   → If they refuse, report to RDB\n   → Legal action through courts is a further step' },
      { heading: "How to Respect Others' IP",
        body: "Before using another farmer's guide, photo, or video:\n\n✅ Ask for written permission\n✅ Credit the original creator\n✅ Pay any licensing fee they request\n✅ Do not modify their work without permission\n\nFor educational use: even for free educational purposes, you still need permission in Rwanda. 'Educational use' is not an automatic exception under Rwanda Law No. 31/2009.\n\nThe IP Pledge Wall in AgriPio is where you can publicly commit to respecting IP rights." },
    ],
    example: {
      title: 'Enforcement in Practice',
      lines: [
        '📋 Claudine finds a website selling copies of her seed calendar → She contacts them, demands removal, and reports to RDB',
        '📻 Radio station broadcasts cooperative training without permission → Cooperative sends a cease-and-desist letter',
        "🤝 NGO wants to use Jean's guide → They ask permission, Jean grants a licence for RWF 30,000",
        "🛡️ AgriPio registers its source code and content with RDB → Official proof of ownership for the team",
        '🌍 Team registers with ARIPO Kampala Protocol → Protected across 22 African countries',
      ],
    },
    whyMatters: 'Respecting IP is not just about following the law — it is about building a fair agricultural community where innovation is rewarded. When farmers know their work is protected, they share more knowledge, create more content, and drive agricultural development.',
    keyPoints: [
      'Ignoring IP rights is illegal under Rwanda Law No. 31/2009',
      'Protect your IP: Identify → Document → Register → Monitor → Enforce',
      'First step when infringed: contact the infringer and ask them to stop',
      'Report to RDB if the infringer refuses',
      "Always ask permission before using another farmer's guide, photo, or video",
      'Educational use is NOT an automatic exception in Rwanda',
      'ARIPO Kampala Protocol 2021 — register once for 22-country protection',
    ],
    quiz: [
      { question: "What should a farmer do FIRST if someone copies their guide without permission?",
        options: ['Do nothing', 'Contact the infringer and ask them to stop', 'Immediately go to court', 'Post about it on social media'],
        correct: 1, explanation: 'The first step is to contact the infringer directly and request they stop. If they refuse, report to RDB. Legal action through courts is a further step if needed.' },
      { question: 'Under Rwanda Law No. 31/2009, is educational use an automatic exception to copyright?',
        options: ['Yes, education is always free to use any content', 'No, permission is still required even for educational use', 'Only if the school is a public school', 'Only for content older than 10 years'],
        correct: 1, explanation: "Rwanda Law No. 31/2009 does not provide a broad educational use exception. Permission from the copyright owner is required before using their work, even for educational purposes." },
      { question: 'Which organisation handles IP registration and complaints in Rwanda?',
        options: ['The Ministry of Agriculture', 'WIPO Geneva directly', 'Rwanda Development Board (RDB)', 'The Rwanda Revenue Authority'],
        correct: 2, explanation: 'Rwanda Development Board (RDB) manages intellectual property registration and handles IP complaints in Rwanda. Visit rdb.rw for registration and enforcement support.' },
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
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lesson = lessons[currentLesson];
  const progress = (completedLessons.length / lessons.length) * 100;
  const allCompleted = completedLessons.length === lessons.length;
  const quizScore = lesson.quiz.reduce((acc, q, i) => acc + (quizAnswers[i] === q.correct ? 1 : 0), 0);
  const quizPassed = quizSubmitted && quizScore >= Math.ceil(lesson.quiz.length * 0.6);

  useEffect(() => {
    supabase.from('community_videos').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setCommunityVideos((data as CommunityVideo[]) || []); setLoadingVideos(false); });
    if (user) setCompletedLessons(getProgress(user.id));
  }, [user]);

  const saveProgress = (moduleId: string) => {
    if (!user || completedLessons.includes(moduleId)) return;
    saveLocalProgress(user.id, moduleId);
    setCompletedLessons(prev => [...prev, moduleId]);
  };

  const markComplete = () => {
    saveProgress(lesson.id);
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(prev => prev + 1);
      setShowQuiz(false); setShowReason(false); setQuizAnswers({}); setQuizSubmitted(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
    if (quizScore >= Math.ceil(lesson.quiz.length * 0.6)) {
      saveProgress(lesson.id);
      confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 }, colors: ['#1b3a2a', '#ffd700', '#a5d6a7'] });
    }
  };

  const handleVideoUpload = async () => {
    if (!uploadTitle.trim() || !selectedFile || !user) return;
    setUploading(true);
    const ext = selectedFile.name.split('.').pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage.from('videos').upload(path, selectedFile);
    if (uploadError) { toast.error(uploadError.message); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from('videos').getPublicUrl(path);
    const { error: insertError } = await supabase.from('community_videos').insert({
      user_id: user.id, title: uploadTitle, description: uploadDesc || null,
      video_url: urlData.publicUrl, author_name: profile?.display_name || 'Farmer',
    } as any);
    if (insertError) { toast.error(insertError.message); }
    else {
      toast.success(t('videoCopyright') + ' 🎉');
      confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 }, colors: ['#1b3a2a', '#a5d6a7'] });
      setUploadTitle(''); setUploadDesc(''); setSelectedFile(null);
      const { data } = await supabase.from('community_videos').select('*').order('created_at', { ascending: false });
      setCommunityVideos((data as CommunityVideo[]) || []);
    }
    setUploading(false);
  };

  const handleDeleteVideo = async (videoId: string, videoUrl: string) => {
    if (!user) return;
    setDeletingId(videoId);
    const urlParts = videoUrl.split('/videos/');
    if (urlParts[1]) await supabase.storage.from('videos').remove([decodeURIComponent(urlParts[1])]);
    const { error } = await supabase.from('community_videos').delete().eq('id', videoId);
    if (error) toast.error(error.message);
    else { toast.success('Video deleted'); setCommunityVideos(prev => prev.filter(v => v.id !== videoId)); }
    setDeletingId(null);
  };

  const goToLesson = (i: number) => {
    setCurrentLesson(i); setShowQuiz(false); setShowReason(false);
    setQuizAnswers({}); setQuizSubmitted(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-5 animate-fade-in pb-24">

        {/* Header */}
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="w-8 h-8 rounded-lg flex items-center justify-center bg-secondary border border-border">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold">📚 {t('ipLearning')}</h1>
            <p className="text-xs text-muted-foreground">{t('ipLearningDesc')}</p>
          </div>
        </div>

        {/* Section toggle */}
        <div className="flex gap-2">
          {(['lessons', 'videos'] as const).map(s => (
            <button key={s} onClick={() => setActiveSection(s)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={activeSection === s
                ? { background: 'hsl(var(--emerald) / 0.15)', color: 'hsl(var(--emerald))', border: '1px solid hsl(var(--emerald) / 0.3)' }
                : { background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))' }}>
              {s === 'lessons' ? <><BookOpen className="w-4 h-4" /> {t('lessons')}</> : <><Video className="w-4 h-4" /> {t('communityVideos')}</>}
            </button>
          ))}
        </div>

        {/* ── VIDEOS ── */}
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
                    className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40 flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, hsl(var(--sky)), hsl(200 80% 35%))' }}>
                    {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
                    🚀 {t('share')}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">⚠️ {t('videoCopyright')} 🛡️</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" style={{ color: 'hsl(var(--emerald))' }} />
                {t('communityVideos')} ({communityVideos.length})
              </h3>
              {loadingVideos ? (
                <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
              ) : communityVideos.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground text-sm">{t('noVideosYet')}</p>
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
                        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                          <span className="text-[9px] px-2 py-0.5 rounded-full font-bold"
                            style={{ background: 'hsl(var(--emerald) / 0.1)', color: 'hsl(var(--emerald))' }}>
                            © Protected
                          </span>
                          <button onClick={() => handleDeleteVideo(v.id, v.video_url)} disabled={deletingId === v.id}
                            className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all hover:opacity-80 disabled:opacity-40"
                            style={{ background: 'hsl(var(--alert) / 0.1)', color: 'hsl(var(--alert))' }}>
                            {deletingId === v.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                            Delete
                          </button>
                        </div>
                      </div>
                      <video src={v.video_url} controls className="w-full rounded-lg max-h-[300px]" preload="metadata" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── LESSONS ── */}
        {activeSection === 'lessons' && (
          <>
            {/* Progress bar */}
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{t('progress')}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold" style={{ color: 'hsl(var(--emerald))' }}>
                    {completedLessons.length}/{lessons.length}
                  </span>
                  {allCompleted && (
                    <button onClick={() => { setShowCertificate(true); confetti({ particleCount: 120, spread: 90, colors: ['#ffd700', '#1b3a2a', '#a5d6a7'] }); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                      style={{ background: 'hsl(var(--gold) / 0.15)', color: 'hsl(var(--gold))', border: '1px solid hsl(var(--gold) / 0.3)' }}>
                      <Trophy className="w-3.5 h-3.5" /> {t('certificate')}
                    </button>
                  )}
                </div>
              </div>
              <div className="w-full h-2.5 rounded-full overflow-hidden bg-secondary">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #1b3a2a, #2d5a3d)' }} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
              {/* Lesson list */}
              <div className="glass-card p-4 lg:col-span-1">
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" style={{ color: 'hsl(var(--emerald))' }} /> {t('lessons')}
                </h3>
                <div className="space-y-1">
                  {lessons.map((l, i) => {
                    const done = completedLessons.includes(l.id);
                    const locked = i > 0 && !completedLessons.includes(lessons[i - 1].id);
                    return (
                      <button key={l.id} onClick={() => !locked && goToLesson(i)} disabled={locked}
                        className="w-full text-left px-3 py-2.5 rounded-lg text-sm transition-all flex items-center gap-2 disabled:opacity-40"
                        style={currentLesson === i ? { background: 'hsl(var(--emerald) / 0.15)', color: 'hsl(var(--emerald))' } : {}}>
                        {done
                          ? <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'hsl(var(--emerald))' }} />
                          : locked
                            ? <Lock className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
                            : <span className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold bg-secondary">{l.number}</span>
                        }
                        <div className="flex-1 min-w-0">
                          <span className="text-xs truncate block">{l.emoji} {l.title}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Lesson content */}
              <div className="lg:col-span-3 space-y-4">
                {/* Title banner */}
                <div className="rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 text-white" style={{ background: 'linear-gradient(135deg, #1b3a2a, #2d5a3d)' }}>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{lesson.emoji}</span>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#a5d6a7' }}>
                          Lesson {lesson.number} of {lessons.length}
                        </p>
                        <h2 className="text-lg font-bold leading-tight">{lesson.title}</h2>
                        <p className="text-xs mt-0.5" style={{ color: '#c8e6c9' }}>{lesson.subtitle}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sections */}
                {lesson.sections.map((sec, i) => (
                  <div key={i} className="glass-card p-5">
                    <h3 className="font-semibold text-sm mb-3 flex items-center gap-2"
                      style={{ color: 'hsl(var(--emerald))' }}>
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                        style={{ background: '#1b3a2a' }}>{i + 1}</span>
                      {sec.heading}
                    </h3>
                    {sec.body.split('\n').map((line, j) => (
                      <p key={j} className="text-sm text-muted-foreground leading-relaxed mb-1">{line || '\u00A0'}</p>
                    ))}
                  </div>
                ))}

                {/* Why it matters */}
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid hsl(var(--gold) / 0.3)' }}>
                  <button onClick={() => setShowReason(!showReason)}
                    className="w-full px-4 py-3 flex items-center justify-between"
                    style={{ background: 'hsl(var(--gold) / 0.08)' }}>
                    <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'hsl(var(--gold))' }}>
                      <Lightbulb className="w-4 h-4" /> 💡 {t('whyMatters')}
                    </span>
                    <ChevronRight className="w-4 h-4 transition-transform"
                      style={{ color: 'hsl(var(--gold))', transform: showReason ? 'rotate(90deg)' : 'none' }} />
                  </button>
                  {showReason && (
                    <div className="p-4 bg-secondary">
                      <p className="text-sm text-muted-foreground leading-relaxed">{lesson.whyMatters}</p>
                    </div>
                  )}
                </div>

                {/* Example */}
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid hsl(var(--emerald) / 0.3)' }}>
                  <div className="px-4 py-2.5 flex items-center gap-2" style={{ background: 'hsl(var(--emerald) / 0.08)' }}>
                    <Star className="w-4 h-4" style={{ color: 'hsl(var(--emerald))' }} />
                    <span className="text-sm font-semibold" style={{ color: 'hsl(var(--emerald))' }}>
                      {t('example')}: {lesson.example.title}
                    </span>
                  </div>
                  <div className="p-4 bg-secondary space-y-1.5">
                    {lesson.example.lines.map((line, i) => (
                      <p key={i} className="text-sm text-muted-foreground leading-relaxed">{line}</p>
                    ))}
                  </div>
                </div>

                {/* Key points */}
                <div className="glass-card p-4">
                  <h3 className="text-sm font-semibold mb-3">📝 {t('keyPoints')}</h3>
                  <div className="space-y-2">
                    {lesson.keyPoints.map((kp, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" style={{ color: 'hsl(var(--emerald))' }} />
                        <span className="text-xs text-muted-foreground leading-relaxed">{kp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quiz */}
                <div className="rounded-xl overflow-hidden" style={{ border: '1px solid hsl(270 60% 60% / 0.3)' }}>
                  <button onClick={() => setShowQuiz(!showQuiz)}
                    className="w-full px-4 py-3 flex items-center justify-between"
                    style={{ background: 'hsl(270 60% 60% / 0.08)' }}>
                    <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'hsl(270 60% 55%)' }}>
                      <HelpCircle className="w-4 h-4" /> 📝 Quiz ({lesson.quiz.length} questions)
                    </span>
                    <ChevronRight className="w-4 h-4 transition-transform"
                      style={{ color: 'hsl(270 60% 55%)', transform: showQuiz ? 'rotate(90deg)' : 'none' }} />
                  </button>
                  {showQuiz && (
                    <div className="p-4 space-y-4 bg-secondary">
                      {lesson.quiz.map((q, qi) => (
                        <div key={qi} className="p-4 rounded-xl bg-background border border-border">
                          <p className="text-sm font-semibold mb-3">{qi + 1}. {q.question}</p>
                          <div className="space-y-2">
                            {q.options.map((opt, oi) => {
                              const selected = quizAnswers[qi] === oi;
                              const isCorrect = quizSubmitted && oi === q.correct;
                              const isWrong = quizSubmitted && selected && oi !== q.correct;
                              return (
                                <button key={oi} onClick={() => !quizSubmitted && setQuizAnswers(prev => ({ ...prev, [qi]: oi }))}
                                  className="w-full text-left px-4 py-2.5 rounded-xl text-sm transition-all flex items-center gap-2"
                                  style={{
                                    background: isCorrect ? 'hsl(var(--emerald) / 0.12)' : isWrong ? 'hsl(var(--alert) / 0.12)' : selected ? 'hsl(270 60% 60% / 0.12)' : 'hsl(var(--secondary))',
                                    border: `1px solid ${isCorrect ? 'hsl(var(--emerald) / 0.4)' : isWrong ? 'hsl(var(--alert) / 0.4)' : selected ? 'hsl(270 60% 60% / 0.4)' : 'hsl(var(--border))'}`,
                                  }}>
                                  {isCorrect && <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'hsl(var(--emerald))' }} />}
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                          {quizSubmitted && (
                            <div className="mt-3 p-3 rounded-lg text-xs leading-relaxed"
                              style={{ background: 'hsl(var(--emerald) / 0.06)', color: 'hsl(var(--emerald))' }}>
                              💡 {q.explanation}
                            </div>
                          )}
                        </div>
                      ))}
                      {!quizSubmitted ? (
                        <button onClick={handleQuizSubmit} disabled={Object.keys(quizAnswers).length < lesson.quiz.length}
                          className="w-full py-3 rounded-xl text-sm font-semibold disabled:opacity-40"
                          style={{ background: 'hsl(270 60% 60% / 0.15)', color: 'hsl(270 60% 55%)', border: '1px solid hsl(270 60% 60% / 0.3)' }}>
                          {t('submitQuiz')}
                        </button>
                      ) : (
                        <div className="text-center p-3 rounded-xl"
                          style={{ background: quizPassed ? 'hsl(var(--emerald) / 0.1)' : 'hsl(var(--alert) / 0.1)' }}>
                          <p className="text-sm font-bold" style={{ color: quizPassed ? 'hsl(var(--emerald))' : 'hsl(var(--alert))' }}>
                            {quizPassed ? `✅ ${t('quizPassed')}! ${quizScore}/${lesson.quiz.length}` : `❌ ${t('tryAgain')} — ${quizScore}/${lesson.quiz.length}`}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Navigation */}
                <div className="flex gap-3">
                  {currentLesson > 0 && (
                    <button onClick={() => goToLesson(currentLesson - 1)}
                      className="px-4 py-3 rounded-xl text-sm font-medium bg-secondary border border-border">
                      ← {t('previous')}
                    </button>
                  )}
                  <button onClick={markComplete}
                    className="flex-1 py-3 rounded-xl text-sm font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #1b3a2a, #2d5a3d)' }}>
                    {currentLesson < lessons.length - 1 ? t('nextLesson') : t('completeCourse')}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Certificate Modal */}
        {showCertificate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            onClick={() => setShowCertificate(false)}>
            <div className="w-full max-w-lg rounded-2xl p-8 text-center animate-slide-up"
              onClick={e => e.stopPropagation()}
              style={{ background: '#fff', border: '3px solid hsl(var(--gold) / 0.5)' }}>
              <Award className="w-16 h-16 mx-auto mb-4" style={{ color: 'hsl(var(--gold))' }} />
              <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'hsl(var(--gold))' }}>
                Certificate of Completion
              </p>
              <h2 className="text-2xl font-bold mb-1">🎉 {t('certificate')}</h2>
              <p className="text-muted-foreground text-sm mb-4">{t('ipLearning')} — AgriPio Learning Center</p>
              <div className="text-xl font-bold mb-2" style={{ color: '#1b3a2a' }}>
                {profile?.display_name || 'Outstanding Farmer'}
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                Has completed all {lessons.length} modules on Intellectual Property in Agriculture
              </p>
              <p className="text-xs text-muted-foreground mb-6">
                Issued by IP Club — École des Sciences Byimana<br />
                Rwanda Law No. 31/2009 | ARIPO Member State
              </p>
              <p className="text-xs" style={{ color: '#1b3a2a' }}>© 2026 AgriPio Team</p>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

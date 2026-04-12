import { useState, useEffect, ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/hooks/useAuth';
import {
  LayoutDashboard, Cpu, Bell, Settings, Globe, LogOut,
  Sparkles, BookOpen, ChevronDown, Leaf, TrendingUp, Moon, Sun,
  Users, Shield, Trophy, Info
} from 'lucide-react';
import { Language, languageNames, languageFlags, TranslationKey } from '@/lib/translations';
import NotificationPanel from './NotificationPanel';
import IPLessonModal from './IPLessonModal';

const navItems: { path: string; icon: React.ElementType; tKey: string; emoji: string }[] = [
  { path: '/dashboard',               icon: LayoutDashboard, tKey: 'navDashboard',   emoji: '🏠' },
  { path: '/dashboard/ai-guidance',   icon: Sparkles,        tKey: 'navAiGuide',     emoji: '🌟' },
  { path: '/dashboard/my-projects',   icon: TrendingUp,      tKey: 'navMyProjects',  emoji: '📈' },
  { path: '/dashboard/ip-learning',   icon: BookOpen,        tKey: 'navIpLearning',  emoji: '📚' },
  { path: '/dashboard/club-hub',      icon: Users,           tKey: 'navClubHub',     emoji: '👥' },
  { path: '/dashboard/pledge-wall',   icon: Shield,          tKey: 'navPledgeWall',  emoji: '🛡️' },
  { path: '/dashboard/activities',    icon: Trophy,          tKey: 'navActivities',  emoji: '🏆' },
  { path: '/dashboard/devices',       icon: Cpu,             tKey: 'navIot',         emoji: '📡' },
  { path: '/dashboard/settings',      icon: Settings,        tKey: 'navSettings',    emoji: '⚙️' },
  { path: '/dashboard/about',         icon: Info,            tKey: 'navAbout',       emoji: 'ℹ️' },
];

const allLanguages: Language[] = ['en', 'rw', 'fr', 'sw', 'lg', 'zu'];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { unreadCount, language, setLanguage, theme, toggleTheme, t } = useApp();
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen w-full" style={{ background: '#f4f7f4' }}>

      {/* ── Sidebar (desktop) ── */}
      {!isMobile && (
        <aside className="flex flex-col h-screen sticky top-0 w-56 flex-shrink-0"
          style={{ background: '#1b3a2a', color: '#e8f5e9' }}>

          {/* Logo */}
          <div className="flex items-center gap-2.5 px-5 h-16 border-b flex-shrink-0"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm tracking-widest text-white">✓ AGRIPIO</span>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
            {navItems.map(item => {
              const active = location.pathname === item.path ||
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link key={item.path} to={item.path}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                  style={{
                    color: active ? '#fff' : '#7fb87f',
                    background: active ? 'rgba(255,255,255,0.12)' : 'transparent',
                    borderLeft: active ? '3px solid #a5d6a7' : '3px solid transparent',
                  }}>
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span>{t(item.tKey as TranslationKey)}</span>
                </Link>
              );
            })}
          </nav>

          {/* Add farm promo */}
          <div className="mx-3 mb-3 rounded-2xl overflow-hidden flex-shrink-0"
            style={{ background: '#2d5a3d' }}>
            <div className="p-3.5">
              <div className="text-xl mb-1">🌿</div>
              <p className="text-xs font-semibold" style={{ color: '#a5d6a7' }}>{t('trackYourFarm')}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#6a9e6a' }}>{t('logCrops')}</p>
            </div>
            <div className="px-3.5 pb-3">
              <Link to="/dashboard/my-projects"
                className="block text-center text-xs font-semibold py-1.5 rounded-lg transition-all hover:opacity-90"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
                {t('addFarm')}
              </Link>
            </div>
          </div>

          {/* Bottom: language + logout */}
          <div className="px-3 pb-4 space-y-0.5 border-t flex-shrink-0"
            style={{ borderColor: 'rgba(255,255,255,0.07)', paddingTop: '10px' }}>
            <div className="relative">
              <button
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm w-full transition-all hover:bg-white/10"
                style={{ color: '#7fb87f' }}
                onClick={() => setShowLangPicker(!showLangPicker)}>
                <Globe className="w-4 h-4" />
                <span className="flex-1 text-left">{languageFlags[language]} {languageNames[language]}</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              {showLangPicker && (
                <div className="absolute bottom-full left-0 right-0 mb-1 rounded-xl overflow-hidden shadow-xl z-50"
                  style={{ background: '#1b3a2a', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {allLanguages.map(lang => (
                    <button key={lang} onClick={() => { setLanguage(lang); setShowLangPicker(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-all hover:bg-white/10"
                      style={{ color: language === lang ? '#a5d6a7' : '#7fb87f' }}>
                      <span>{languageFlags[lang]}</span>
                      <span>{languageNames[lang]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm w-full transition-all hover:bg-white/10"
              style={{ color: '#7fb87f' }}
              onClick={handleSignOut}>
              <LogOut className="w-4 h-4" />
              <span>{t('logOut')}</span>
            </button>
          </div>
        </aside>
      )}

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top header */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-5 md:px-8 h-16 flex-shrink-0"
          style={{ background: '#fff', borderBottom: '1px solid #e6efe6' }}>

          {isMobile ? (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#1b3a2a' }}>
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-sm" style={{ color: '#1b3a2a' }}>AGRIPIO</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl px-4 py-2 w-60 border"
              style={{ background: '#f7faf7', borderColor: '#e0ece0' }}>
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                className="bg-transparent text-sm outline-none text-gray-600 w-full placeholder-gray-400"
                placeholder={t('searchPlant')} />
            </div>
          )}

          <div className="flex items-center gap-1.5">
            <button onClick={toggleTheme}
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-all hover:bg-gray-100">
              {theme === 'light'
                ? <Moon className="w-4 h-4 text-gray-400" />
                : <Sun className="w-4 h-4 text-yellow-500" />}
            </button>

            <div className="relative">
              <button onClick={() => setShowLangPicker(!showLangPicker)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1"
                style={{ color: '#1b3a2a', borderColor: '#b2cfc0', background: '#eaf2ed' }}>
                {languageFlags[language]} {language.toUpperCase()}
                <ChevronDown className="w-3 h-3" />
              </button>
              {showLangPicker && (
                <div className="absolute top-full right-0 mt-1 rounded-xl overflow-hidden shadow-lg border border-gray-100 z-50 min-w-[160px] bg-white">
                  {allLanguages.map(lang => (
                    <button key={lang} onClick={() => { setLanguage(lang); setShowLangPicker(false); }}
                      className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-all hover:bg-gray-50"
                      style={{ color: language === lang ? '#1b3a2a' : '#555' }}>
                      <span>{languageFlags[lang]}</span>
                      <span>{languageNames[lang]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-all"
              onClick={() => setShowNotifications(!showNotifications)}>
              <Bell className="w-4 h-4 text-gray-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ background: '#e53935' }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {profile && (
              <div className="flex items-center gap-2 ml-1 pl-2 border-l" style={{ borderColor: '#e6efe6' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: '#1b3a2a' }}>
                  {profile.display_name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-gray-800 leading-none">{profile.display_name}</p>
                  <p className="text-[11px] capitalize" style={{ color: '#1b3a2a' }}>{profile.role}</p>
                </div>
                <ChevronDown className="w-3 h-3 text-gray-400 hidden md:block" />
              </div>
            )}
          </div>
        </header>

        {showNotifications && (
          <div className="absolute top-16 right-4 z-50 w-80 animate-slide-up">
            <NotificationPanel onClose={() => setShowNotifications(false)} />
          </div>
        )}

        <main className="flex-1 overflow-auto p-4 md:p-6">
          {children}
        </main>

        {/* Mobile bottom nav */}
        {isMobile && (
          <nav className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around px-2 py-2 border-t"
            style={{ background: '#fff', borderColor: '#e6efe6' }}>
            {navItems.slice(0, 5).map(item => {
              const active = location.pathname === item.path ||
                (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link key={item.path} to={item.path}
                  className="flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl transition-all min-w-[48px]"
                  style={{ color: active ? '#1b3a2a' : '#aaa' }}>
                  <span className="text-lg">{item.emoji}</span>
                  <span className="text-[10px] font-medium">{t(item.tKey as TranslationKey)}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      <IPLessonModal />
    </div>
  );
}

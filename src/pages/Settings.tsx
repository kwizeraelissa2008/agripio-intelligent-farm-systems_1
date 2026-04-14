import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/DashboardLayout';
import { Settings as SettingsIcon, Users, BookOpen, Globe, Sun, Moon, LogOut } from 'lucide-react';
import { Language, languageNames, languageFlags } from '@/lib/translations';

const allLanguages: Language[] = ['en', 'rw', 'fr', 'sw', 'lg', 'zu'];

export default function SettingsPage() {
  const { language, setLanguage, theme, toggleTheme, t } = useApp();
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'general' | 'team' | 'about'>('general');

  const tabs = [
    { id: 'general', label: t('general'), icon: SettingsIcon },
    { id: 'team', label: t('team'), icon: Users },
  ] as const;

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in pb-24">
        <div>
          <h1 className="text-xl font-bold">⚙️ {t('settings')}</h1>
          <p className="text-xs text-muted-foreground mt-0.5">{t('manageAccount')}</p>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {tabs.map(tb => (
            <button key={tb.id} onClick={() => setActiveTab(tb.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all"
              style={activeTab === tb.id
                ? { background: 'hsl(var(--emerald) / 0.15)', color: 'hsl(var(--emerald))', border: '1px solid hsl(var(--emerald) / 0.3)' }
                : { background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))' }}>
              <tb.icon className="w-4 h-4" /> {tb.label}
            </button>
          ))}
        </div>

        {activeTab === 'general' && (
          <div className="space-y-4">
            {/* Profile Info */}
            {profile && (
              <div className="glass-card p-5">
                <h2 className="font-semibold mb-4">👤 {t('profile')}</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">{t('fullName')}</span><span className="font-medium">{profile.display_name}</span></div>
                  <div className="flex justify-between"><span className="text-muted-foreground">{t('role')}</span><span className="font-medium capitalize">{profile.role}</span></div>
                  {profile.farm_type && <div className="flex justify-between"><span className="text-muted-foreground">{t('farmType')}</span><span className="font-medium">{profile.farm_type}</span></div>}
                  {profile.location_name && <div className="flex justify-between"><span className="text-muted-foreground">{t('location')}</span><span className="font-medium">{profile.location_name}</span></div>}
                </div>
              </div>
            )}

            {/* Theme */}
            

            {/* Language */}
            <div className="glass-card p-5">
              <h2 className="font-semibold mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4" style={{ color: 'hsl(var(--emerald))' }} />
                {t('language')} 🌍
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allLanguages.map(lang => (
                  <button key={lang} onClick={() => setLanguage(lang)}
                    className="px-4 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
                    style={language === lang
                      ? { background: 'hsl(var(--emerald) / 0.15)', color: 'hsl(var(--emerald))', border: '1px solid hsl(var(--emerald) / 0.3)' }
                      : { background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))' }}>
                    <span className="text-lg">{languageFlags[lang]}</span>
                    <span>{languageNames[lang]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sign Out */}
            <button onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20">
              <LogOut className="w-4 h-4" /> {t('signOut')}
            </button>
          </div>
        )}

        {activeTab === 'team' && (
          <div className="glass-card p-8 text-center">
            <div className="text-4xl mb-4">🏫</div>
            <h2 className="text-lg font-bold mb-2">{t('thisProductBy')}</h2>
            <p className="text-base font-semibold" style={{ color: 'hsl(var(--emerald))' }}>
              IP Club from Ecole Des Sciences Byimana.
            </p>
            
          </div>
        )}

        
      </div>
    </DashboardLayout>
  );
}

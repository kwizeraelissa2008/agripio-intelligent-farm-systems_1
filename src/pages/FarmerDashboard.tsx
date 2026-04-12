import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import {
  Sparkles, ChevronRight, Shield, TrendingUp, Users,
  ShoppingCart, Cpu, Settings, BookOpen, X, Lightbulb,
  Droplets, Thermometer, FlaskConical
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { getTodaysLesson, hasSeenTodaysLesson, markLessonSeen } from '@/lib/ipDailyLessons';

import { getProgress } from '@/lib/localStorage';

interface IoTReading { soil_moisture: number | null; temperature: number | null; ph_level: number | null; recorded_at: string; }

const MODULES = ['copyright', 'related_rights', 'creative_economy', 'respect_ip'];

export default function FarmerDashboard() {
  const { profile, user } = useAuth();
  const { t } = useApp();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t('goodMorning') : hour < 17 ? t('goodAfternoon') : t('goodEvening');
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const [showTipPopup, setShowTipPopup] = useState(false);
  const [iotReading, setIotReading] = useState<IoTReading | null>(null);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  // Daily tip — show once per day
  useEffect(() => {
    if (!hasSeenTodaysLesson()) {
      const timer = setTimeout(() => setShowTipPopup(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  // Fetch latest IoT reading
  useEffect(() => {
    if (!user) return;
    supabase.from('device_data').select('moisture, temperature, ph, recorded_at')
      .eq('user_id', user.id).order('recorded_at', { ascending: false }).limit(1)
      .then(({ data }) => {
        if (data?.[0]) {
          setIotReading({ soil_moisture: data[0].moisture, temperature: data[0].temperature, ph_level: data[0].ph, recorded_at: data[0].recorded_at });
        }
      });
  }, [user]);

  // Load learning progress from localStorage
  useEffect(() => {
    if (user) setCompletedModules(getProgress(user.id));
  }, [user]);

  const todayTip = t(`ipTip${new Date().getDay() % 8}` as any);
  const dailyLesson = getTodaysLesson();
  const learningPct = Math.round((completedModules.length / MODULES.length) * 100);

  const dismissTip = () => { markLessonSeen(); setShowTipPopup(false); };

  const quickActions = [
    { to: '/dashboard/ai-guidance', icon: Sparkles,     label: t('navAiGuide')    },
    { to: '/dashboard/my-projects', icon: TrendingUp,   label: t('navMyProjects') },
    { to: '/dashboard/ip-learning', icon: Shield,       label: t('navIpLearning') },
    { to: '/dashboard/club-hub',    icon: Users,        label: t('navClubHub')    },
    { to: '/dashboard/marketplace', icon: ShoppingCart, label: t('navMarket')     },
    { to: '/dashboard/devices',     icon: Cpu,          label: t('navIot')        },
    { to: '/dashboard/settings',    icon: Settings,     label: t('navSettings')   },
  ];

  const aiTips = [
    { emoji: '🌾', title: t('tip1Title'), desc: t('tip1Desc') },
    { emoji: '💧', title: t('tip2Title'), desc: t('tip2Desc') },
    { emoji: '🧪', title: t('tip3Title'), desc: t('tip3Desc') },
    { emoji: '🛡️', title: t('tip4Title'), desc: t('tip4Desc') },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5 animate-fade-in pb-24 max-w-2xl mx-auto w-full">

        {/* Greeting */}
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {greeting}, {profile?.display_name?.split(' ')[0] || t('farmer')} 👋
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{today}</p>
        </div>

        {/* Daily IP Tip card */}
        <div className="rounded-2xl p-4 flex items-start gap-3"
          style={{ background: 'hsl(var(--gold) / 0.08)', borderLeft: '4px solid hsl(var(--gold))' }}>
          <Lightbulb className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'hsl(var(--gold))' }} />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: 'hsl(var(--gold))' }}>
              {t('dailyIpTip')}
            </p>
            <p className="text-sm leading-relaxed text-gray-700">{todayTip}</p>
          </div>
          <Link to="/dashboard/ip-learning"
            className="text-xs font-semibold flex-shrink-0 px-3 py-1.5 rounded-lg"
            style={{ color: 'hsl(var(--gold))', background: 'hsl(var(--gold) / 0.12)' }}>
            Learn →
          </Link>
        </div>

        {/* Farm Snapshot */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">{t('farmSnapshot')}</p>
            <Link to="/dashboard/devices" className="text-xs" style={{ color: 'hsl(var(--emerald))' }}>{t('viewAll')}</Link>
          </div>
          {iotReading ? (
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Droplets,     label: t('sensorMoisture'), value: iotReading.soil_moisture != null ? `${iotReading.soil_moisture}%` : '—', ok: iotReading.soil_moisture != null && iotReading.soil_moisture >= 40 && iotReading.soil_moisture <= 70 },
                { icon: Thermometer,  label: t('sensorTemp'),     value: iotReading.temperature != null ? `${iotReading.temperature}°C` : '—', ok: iotReading.temperature != null && iotReading.temperature >= 18 && iotReading.temperature <= 28 },
                { icon: FlaskConical, label: t('sensorPh'),       value: iotReading.ph_level != null ? `${iotReading.ph_level}` : '—', ok: iotReading.ph_level != null && iotReading.ph_level >= 5.5 && iotReading.ph_level <= 7.0 },
              ].map(({ icon: Icon, label, value, ok }) => (
                <div key={label} className="rounded-xl p-3 text-center" style={{ background: 'hsl(var(--secondary))' }}>
                  <Icon className="w-4 h-4 mx-auto mb-1" style={{ color: ok ? 'hsl(var(--emerald))' : 'hsl(var(--warning))' }} />
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-sm font-bold">{value}</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium"
                    style={{ background: ok ? 'hsl(var(--emerald) / 0.1)' : 'hsl(var(--warning) / 0.1)', color: ok ? 'hsl(var(--emerald))' : 'hsl(var(--warning))' }}>
                    {ok ? t('sensorGood') : t('sensorCheck')}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-gray-400">{t('noSensorConnected')}</p>
              <Link to="/dashboard/devices" className="text-xs mt-1 block" style={{ color: 'hsl(var(--emerald))' }}>{t('connectIotDevice')}</Link>
            </div>
          )}
        </div>

        {/* Learning Progress */}
        <div className="glass-card p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" style={{ color: 'hsl(var(--emerald))' }} />
              <p className="text-sm font-semibold">{t('ipLearningTitle')}</p>
            </div>
            <span className="text-xs font-bold" style={{ color: 'hsl(var(--emerald))' }}>
              {completedModules.length}/{MODULES.length} modules
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full transition-all duration-700"
              style={{ width: `${learningPct}%`, background: 'var(--gradient-emerald)' }} />
          </div>
          {completedModules.length < MODULES.length && (
            <Link to="/dashboard/ip-learning" className="text-xs mt-2 block" style={{ color: 'hsl(var(--emerald))' }}>
              {t('continueLearnig')}
            </Link>
          )}
        </div>

        {/* AI Farmer Guide hero card */}
        <Link to="/dashboard/ai-guidance"
          className="block rounded-2xl p-5 text-white transition-all hover:scale-[1.01] hover:shadow-2xl group"
          style={{ background: 'linear-gradient(135deg, #1b3a2a 0%, #2d5a3d 55%, #3d8b40 100%)' }}>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.12)' }}>
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: '#81c784' }}>
                  {t('aiPowered')}
                </p>
                <h2 className="text-base font-bold leading-tight">{t('aiFarmerGuide')}</h2>
                <p className="text-xs mt-0.5" style={{ color: '#c8e6c9' }}>{t('aiFarmerGuideDesc')}</p>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 group-hover:translate-x-1 transition-transform"
              style={{ background: 'rgba(255,255,255,0.2)' }}>
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {aiTips.map((tip, i) => (
              <div key={i} className="rounded-xl px-3 py-2.5 flex items-start gap-2"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <span className="text-sm flex-shrink-0 mt-0.5">{tip.emoji}</span>
                <div>
                  <p className="text-xs font-semibold leading-tight">{tip.title}</p>
                  <p className="text-[11px] mt-0.5 leading-relaxed" style={{ color: '#a5d6a7' }}>{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Link>

        {/* Quick Actions */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">{t('quickActions')}</p>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2.5">
            {quickActions.map(({ to, icon: Icon, label }) => (
              <Link key={to} to={to}
                className="flex flex-col items-center gap-2 py-3 px-2 rounded-2xl bg-white border border-gray-100
                           shadow-sm transition-all hover:shadow-md hover:border-green-200 hover:-translate-y-0.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#eaf2ed' }}>
                  <Icon className="w-4 h-4" style={{ color: '#1b3a2a' }} />
                </div>
                <span className="text-[10px] font-medium text-gray-600 text-center leading-tight">{label}</span>
              </Link>
            ))}
          </div>
        </div>

      </div>

      {/* Daily IP Tip Popup */}
      {showTipPopup && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40"
          onClick={dismissTip}>
          <div className="w-full max-w-sm rounded-2xl p-6 animate-slide-up"
            style={{ background: '#fff', border: '2px solid hsl(var(--gold) / 0.4)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{dailyLesson.icon}</span>
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'hsl(var(--gold))' }}>
                  {t('dailyIpTip')}
                </p>
              </div>
              <button onClick={dismissTip} className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-100">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <h3 className="font-bold mb-2">{dailyLesson.titleEn}</h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">{dailyLesson.bodyEn}</p>
            <button onClick={dismissTip} className="w-full py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: '#1b3a2a' }}>
              {t('gotIt')}
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

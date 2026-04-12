import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Users, Calendar, Award, BookOpen, CheckCircle, Star, MapPin, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface ClubMember {
  id: string; name: string; role: string; avatar: string;
  joined_date: string; sessions_attended: number; expertise: string[]; is_team: boolean;
}
interface DBSession {
  id: string; title: string; session_date: string; description: string | null; debate_proposition: string | null;
}

export default function ClubHub() {
  const { user } = useAuth();
  const { t } = useApp();
  const [members] = useState<ClubMember[]>([
    { id: '1', name: 'KWIZERA Elissa',    role: 'Team Lead',     avatar: '👩‍🌾', joined_date: '2024-01-01', sessions_attended: 45, expertise: ['IP Rights', 'Crop Management'],       is_team: true },
    { id: '2', name: 'INEZA Elyon Ivo',   role: 'Tech Lead',     avatar: '👨‍💻', joined_date: '2024-01-01', sessions_attended: 42, expertise: ['IoT Systems', 'Data Analysis'],       is_team: true },
    { id: '3', name: 'INEZA Aliza',       role: 'Content Lead',  avatar: '👩‍🏫', joined_date: '2024-01-01', sessions_attended: 38, expertise: ['Education', 'Copyright'],             is_team: true },
    { id: '4', name: 'ISHIMWE Ornella',   role: 'Research Lead', avatar: '👩‍🔬', joined_date: '2024-01-01', sessions_attended: 40, expertise: ['Agricultural Research', 'IP Protection'], is_team: true },
    { id: '5', name: 'MUTANGANA Jean',    role: 'Member', avatar: '👨‍🌾', joined_date: '2024-02-15', sessions_attended: 12, expertise: ['Maize Farming'],       is_team: false },
    { id: '6', name: 'MUKAMANA Grace',    role: 'Member', avatar: '👩‍🌾', joined_date: '2024-02-20', sessions_attended: 15, expertise: ['Bean Cultivation'],    is_team: false },
    { id: '7', name: 'NTWARI Paul',       role: 'Member', avatar: '👨‍🌾', joined_date: '2024-03-01', sessions_attended: 10, expertise: ['Coffee Farming'],      is_team: false },
    { id: '8', name: 'NYIRAHABIMANA Aline', role: 'Member', avatar: '👩‍🌾', joined_date: '2024-03-10', sessions_attended: 8, expertise: ['Vegetable Farming'], is_team: false },
    { id: '9', name: 'HABIMANA Joseph',   role: 'Member', avatar: '👨‍🌾', joined_date: '2024-03-15', sessions_attended: 11, expertise: ['Rice Cultivation'],   is_team: false },
    { id: '10', name: 'MUKANYANDWI Esther', role: 'Member', avatar: '👩‍🌾', joined_date: '2024-03-20', sessions_attended: 9, expertise: ['Organic Farming'],  is_team: false },
  ]);
  const [sessions, setSessions] = useState<DBSession[]>([]);
  const [checkedIn, setCheckedIn] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'members' | 'sessions' | 'resources'>('members');

  useEffect(() => {
    loadSessions();
    if (user) loadAttendance();
  }, [user]);

  const loadSessions = async () => {
    setLoading(true);
    const { data } = await supabase.from('club_sessions').select('*').order('session_date', { ascending: false });
    setSessions((data as DBSession[]) || []);
    setLoading(false);
  };

  const loadAttendance = async () => {
    const { data } = await supabase.from('session_attendance').select('session_id').eq('user_id', user!.id);
    if (data) setCheckedIn(new Set(data.map(r => r.session_id)));
  };

  const checkIn = async (sessionId: string) => {
    if (!user) return;
    const { error } = await supabase.from('session_attendance').insert({ session_id: sessionId, user_id: user.id });
    if (error) toast.error('Already checked in or error occurred');
    else { toast.success('Checked in! ✓'); setCheckedIn(prev => new Set([...prev, sessionId])); }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    );
  }

  const tabStyle = (id: string) => activeTab === id
    ? { background: 'hsl(var(--emerald) / 0.15)', color: 'hsl(var(--emerald))', borderBottom: '2px solid hsl(var(--emerald))' }
    : { color: 'hsl(var(--muted-foreground))', borderBottom: '2px solid transparent' };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in pb-24">

        {/* Header */}
        <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #1b3a2a 0%, #2d5a3d 60%, #1b3a2a 100%)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-1">{t('clubHubTitle')}</h1>
              <p className="text-sm" style={{ color: '#c8e6c9' }}>{t('clubHubDesc')}</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{members.length}</div>
                <div className="text-xs" style={{ color: '#a5d6a7' }}>{t('members')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{sessions.length}</div>
                <div className="text-xs" style={{ color: '#a5d6a7' }}>{t('sessions')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b" style={{ borderColor: 'hsl(var(--border))' }}>
          {[
            { id: 'members',   label: t('members'),   icon: Users },
            { id: 'sessions',  label: t('sessions'),  icon: Calendar },
            { id: 'resources', label: t('resources'), icon: BookOpen },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors"
              style={tabStyle(tab.id)}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'hsl(var(--foreground))' }}>
                <Award className="w-4 h-4" style={{ color: 'hsl(var(--gold))' }} />
                {t('ourTeam')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {members.filter(m => m.is_team).map(member => (
                  <div key={member.id} className="rounded-xl p-4"
                    style={{ background: 'hsl(var(--emerald) / 0.08)', border: '1px solid hsl(var(--emerald) / 0.25)' }}>
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{member.avatar}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm">{member.name}</h4>
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ background: '#1b3a2a' }}>Team</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{member.sessions_attended} sessions</span>
                          <span className="flex items-center gap-1"><Star className="w-3 h-3" />{member.expertise.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="w-4 h-4" style={{ color: 'hsl(var(--emerald))' }} />
                {t('allMembers')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {members.filter(m => !m.is_team).map(member => (
                  <div key={member.id} className="glass-card p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{member.avatar}</div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{member.name}</h4>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">
                            {t('joined')} {new Date(member.joined_date).toLocaleDateString()}
                          </span>
                          {member.sessions_attended > 0 && (
                            <span className="text-xs flex items-center gap-1" style={{ color: 'hsl(var(--emerald))' }}>
                              <CheckCircle className="w-3 h-3" />{member.sessions_attended}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {member.expertise.map((skill, idx) => (
                            <span key={idx} className="px-1.5 py-0.5 rounded text-[10px]"
                              style={{ background: 'hsl(var(--secondary))', color: 'hsl(var(--muted-foreground))' }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-3">
            {sessions.length === 0 && (
              <p className="text-center text-muted-foreground py-8 text-sm">No sessions yet.</p>
            )}
            {sessions.map(session => (
              <div key={session.id} className="glass-card p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{session.title}</h4>
                    {session.description && <p className="text-xs text-muted-foreground mt-0.5">{session.description}</p>}
                    {session.debate_proposition && (
                      <p className="text-xs mt-1.5 italic" style={{ color: 'hsl(var(--gold))' }}>
                        💬 "{session.debate_proposition}"
                      </p>
                    )}
                    <span className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                      <Calendar className="w-3 h-3" />{new Date(session.session_date).toLocaleDateString()}
                    </span>
                  </div>
                  {checkedIn.has(session.id) ? (
                    <span className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold flex-shrink-0"
                      style={{ background: 'hsl(var(--emerald) / 0.1)', color: 'hsl(var(--emerald))' }}>
                      <CheckCircle className="w-3.5 h-3.5" /> Checked In
                    </span>
                  ) : (
                    <button onClick={() => checkIn(session.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white flex-shrink-0"
                      style={{ background: '#1b3a2a' }}>
                      Check In
                    </button>
                  )}
                </div>
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <Link to="/dashboard/activities"
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center"
                style={{ background: 'hsl(var(--emerald) / 0.1)', color: 'hsl(var(--emerald))' }}>
                🏆 Go to Activities (Quiz, Debate)
              </Link>
            </div>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-4">
            <div className="glass-card p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4" style={{ color: 'hsl(var(--emerald))' }} />
                {t('learningResources')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { title: 'Copyright Basics for Farmers', desc: 'Understanding how copyright protects your farming guides and content', type: 'Guide' },
                  { title: 'IP Registration Process', desc: 'Step-by-step guide to protecting your agricultural innovations', type: 'Tutorial' },
                  { title: 'ARIPO IP Resources', desc: 'Official resources from the African Regional Intellectual Property Organization', type: 'External' },
                  { title: 'Case Studies', desc: 'Real examples of IP protection in African agriculture', type: 'Examples' },
                ].map((resource, idx) => (
                  <div key={idx} className="rounded-xl p-4 transition-colors"
                    style={{ border: '1px solid hsl(var(--border))' }}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'hsl(var(--emerald) / 0.1)' }}>
                        <BookOpen className="w-4 h-4" style={{ color: 'hsl(var(--emerald))' }} />
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{resource.title}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">{resource.desc}</p>
                        <span className="inline-block mt-1.5 px-2 py-0.5 rounded text-[10px]"
                          style={{ background: 'hsl(var(--secondary))', color: 'hsl(var(--muted-foreground))' }}>
                          {resource.type}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl p-5" style={{ background: 'hsl(var(--gold) / 0.08)', border: '1px solid hsl(var(--gold) / 0.3)' }}>
              <h3 className="font-semibold mb-2" style={{ color: 'hsl(var(--gold))' }}>🏆 {t('aripo2026')}</h3>
              <p className="text-sm text-muted-foreground mb-3">{t('aripo2026Desc')}</p>
              <div className="flex items-center gap-2 text-sm" style={{ color: 'hsl(var(--gold))' }}>
                <MapPin className="w-4 h-4" />
                <span>{t('competingAt')}</span>
              </div>
            </div>
          </div>
        )}

        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">© 2026 AgriPio Team — Rwanda National IP Club</p>
        </div>
      </div>
    </DashboardLayout>
  );
}

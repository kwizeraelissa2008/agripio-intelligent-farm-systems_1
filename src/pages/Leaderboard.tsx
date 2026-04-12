import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import DashboardLayout from '@/components/DashboardLayout';
import { Trophy, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface LeaderEntry { user_id: string; display_name: string; quiz_correct: number; scenarios_done: number; sessions_attended: number; total: number; }

export default function Leaderboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<LeaderEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    // Fetch quiz correct counts
    const { data: quizData } = await supabase.from('quiz_attempts').select('user_id, is_correct');
    // Fetch scenario counts
    const { data: scenData } = await supabase.from('scenario_attempts').select('user_id');
    // Fetch attendance counts
    const { data: attData } = await supabase.from('session_attendance').select('user_id');
    // Fetch profiles
    const { data: profiles } = await supabase.from('profiles').select('user_id, display_name');

    if (!profiles) { setLoading(false); return; }

    const map: Record<string, LeaderEntry> = {};
    profiles.forEach(p => {
      map[p.user_id] = { user_id: p.user_id, display_name: p.display_name || 'Farmer', quiz_correct: 0, scenarios_done: 0, sessions_attended: 0, total: 0 };
    });

    quizData?.forEach(q => { if (map[q.user_id] && q.is_correct) map[q.user_id].quiz_correct++; });
    scenData?.forEach(s => { if (map[s.user_id]) map[s.user_id].scenarios_done++; });
    attData?.forEach(a => { if (map[a.user_id]) map[a.user_id].sessions_attended++; });

    const result = Object.values(map).map(e => ({ ...e, total: e.quiz_correct + e.scenarios_done + e.sessions_attended }));
    result.sort((a, b) => b.total - a.total);
    setEntries(result);
    setLoading(false);
  };

  const medal = (rank: number) => rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-5 animate-fade-in pb-24">
        <div className="flex items-center gap-3">
          <Trophy className="w-6 h-6" style={{ color: 'hsl(var(--gold))' }} />
          <h1 className="text-xl font-bold">Leaderboard</h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : entries.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No data yet. Complete quizzes and attend sessions to appear here!</p>
        ) : (
          <div className="space-y-2">
            {/* Header */}
            <div className="grid grid-cols-12 text-xs font-semibold text-muted-foreground px-4 py-2">
              <span className="col-span-1">Rank</span>
              <span className="col-span-5">Name</span>
              <span className="col-span-2 text-center">Quiz</span>
              <span className="col-span-2 text-center">Scenarios</span>
              <span className="col-span-2 text-center">Score</span>
            </div>
            {entries.map((e, i) => (
              <div key={e.user_id}
                className="glass-card grid grid-cols-12 items-center px-4 py-3 transition-all"
                style={e.user_id === user?.id ? { border: '1px solid hsl(var(--emerald) / 0.4)', background: 'hsl(var(--emerald) / 0.05)' } : {}}>
                <span className="col-span-1 text-lg">{medal(i + 1)}</span>
                <div className="col-span-5 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                    style={{ background: '#1b3a2a' }}>
                    {e.display_name.charAt(0)}
                  </div>
                  <span className="text-sm font-medium truncate">{e.display_name}</span>
                  {e.user_id === user?.id && <span className="text-[10px] px-1.5 py-0.5 rounded-full" style={{ background: 'hsl(var(--emerald) / 0.15)', color: 'hsl(var(--emerald))' }}>You</span>}
                </div>
                <span className="col-span-2 text-center text-sm">{e.quiz_correct}</span>
                <span className="col-span-2 text-center text-sm">{e.scenarios_done}</span>
                <span className="col-span-2 text-center text-sm font-bold" style={{ color: 'hsl(var(--emerald))' }}>{e.total}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Shield, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getPledges, getMyPledge, savePledge, type Pledge } from '@/lib/localStorage';

export default function PledgeWall() {
  const { user, profile } = useAuth();
  const { t } = useApp();
  const [pledges, setPledges] = useState<Pledge[]>([]);
  const [myPledge, setMyPledge] = useState<Pledge | null>(null);
  const [statement, setStatement] = useState('');

  const suggestions = [t('pledgeSuggestion1'), t('pledgeSuggestion2'), t('pledgeSuggestion3')];

  useEffect(() => {
    const all = getPledges();
    setPledges(all);
    if (user) setMyPledge(getMyPledge(user.id));
  }, [user]);

  const handleSign = () => {
    if (!statement.trim() || !user || !profile) return;
    const pledge = savePledge(user.id, profile.display_name || 'Farmer', statement.trim());
    setMyPledge(pledge);
    setPledges(getPledges());
    toast.success('🛡️ ' + t('youPledged'));
  };

  const counter = pledges.length === 1
    ? `1 ${t('pledgeMember')}`
    : `${pledges.length} ${t('pledgeCounter')}`;

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in pb-24">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'hsl(var(--gold) / 0.15)' }}>
            <Shield className="w-5 h-5" style={{ color: 'hsl(var(--gold))' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold">{t('pledgeWallTitle')}</h1>
            <p className="text-xs text-muted-foreground">{counter}</p>
          </div>
        </div>

        {/* Sign form or signed state */}
        {!myPledge ? (
          <div className="glass-card p-5" style={{ border: '1px solid hsl(var(--gold) / 0.3)' }}>
            <h2 className="font-semibold mb-3">{t('iPledge')}</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {suggestions.map(s => (
                <button key={s} onClick={() => setStatement(s)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all text-left"
                  style={statement === s
                    ? { background: 'hsl(var(--gold) / 0.2)', color: 'hsl(var(--gold))', border: '1px solid hsl(var(--gold) / 0.4)' }
                    : { background: 'hsl(var(--secondary))', border: '1px solid hsl(var(--border))' }}>
                  {s}
                </button>
              ))}
            </div>
            <textarea value={statement} onChange={e => setStatement(e.target.value)}
              placeholder={t('pledgeOwnText')} rows={2}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none bg-secondary border border-border mb-3" />
            <button onClick={handleSign} disabled={!statement.trim()}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-40"
              style={{ background: '#1b3a2a' }}>
              {t('signPledge')}
            </button>
          </div>
        ) : (
          <div className="glass-card p-5 flex items-center gap-3"
            style={{ border: '1px solid hsl(var(--emerald) / 0.3)', background: 'hsl(var(--emerald) / 0.05)' }}>
            <CheckCircle className="w-6 h-6 flex-shrink-0" style={{ color: 'hsl(var(--emerald))' }} />
            <div>
              <p className="font-semibold text-sm" style={{ color: 'hsl(var(--emerald))' }}>{t('youPledged')}</p>
              <p className="text-xs text-muted-foreground mt-0.5">"{myPledge.statement}"</p>
            </div>
          </div>
        )}

        {/* Pledge mosaic */}
        {pledges.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pledges.map(p => (
              <div key={p.id} className="glass-card p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: '#1b3a2a' }}>
                    {p.display_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{p.display_name}</p>
                    <p className="text-[10px] text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground italic">"{p.statement}"</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

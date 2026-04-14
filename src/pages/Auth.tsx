import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useApp } from '@/contexts/AppContext';
import { Leaf, Eye, EyeOff, Loader2, ChevronLeft } from 'lucide-react';

export default function Auth() {
  const navigate = useNavigate();
  const { t, language } = useApp();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate('/dashboard');
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (mode === 'signup') {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { display_name: name || 'Farmer' },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) {
        setError(error.message);
      } else {
        setSuccess(language === 'rw' ? 'Reba imeyili yawe kugira ngo wemeze konti yawe!' : 'Check your email to verify your account!');
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
      } else {
        navigate('/dashboard');
      }
    }
    setLoading(false);
  };

  const inputStyle = 'w-full px-4 py-3 rounded-xl text-sm outline-none bg-secondary border border-border focus:ring-1 focus:ring-primary';

  return (
    <div className="min-h-screen hero-bg hero-grid flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-8">
          <button onClick={() => navigate('/')} className="absolute top-4 left-4 w-9 h-9 rounded-xl flex items-center justify-center bg-secondary border border-border">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-emerald)' }}>
            <Leaf className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold">AGRIPIO</span>
        </div>

        <div className="glass-card p-8 animate-slide-up">
          <h2 className="text-2xl font-bold mb-2 text-center">
            {mode === 'login' ? (language === 'rw' ? 'Injira' : 'Sign In') : (language === 'rw' ? 'Kwiyandikisha' : 'Create Account')}
          </h2>
          <p className="text-muted-foreground text-sm text-center mb-6">
            {mode === 'login' ? (language === 'rw' ? 'Injira mu konti yawe' : 'Welcome back to AgriPio') : (language === 'rw' ? 'Tangira urugendo rwawe' : 'Start your farming journey')}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">{t('fullName')}</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Jean Paul" className={inputStyle} />
              </div>
            )}
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">{t('email')}</label>
              <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" className={inputStyle} required />
            </div>
            <div className="relative">
              <label className="text-xs text-muted-foreground mb-1.5 block">{t('password')}</label>
              <input value={password} onChange={e => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'} placeholder="••••••••" className={inputStyle} required minLength={6} />
              <button type="button" className="absolute right-3 bottom-3 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
            {success && <p className="text-sm" style={{ color: 'hsl(var(--emerald))' }}>{success}</p>}

            <button type="submit" disabled={loading} className="btn-emerald w-full flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === 'login' ? (language === 'rw' ? '🌱 Injira' : '🌱 Sign In') : (language === 'rw' ? '🚀 Kwiyandikisha' : '🚀 Create Account')}
            </button>
          </form>

          <div className="text-center mt-4">
            <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setSuccess(''); }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              {mode === 'login'
                ? (language === 'rw' ? "Nta konti? Kwiyandikisha" : "Don't have an account? Sign Up")
                : (language === 'rw' ? "Ufite konti? Injira" : "Already have an account? Sign In")}
            </button>
          </div>
        </div>

        <div className="text-center mt-6 space-y-0.5">
          <p className="text-[11px] text-muted-foreground">
            © 2026 AgriPio Team &nbsp;|&nbsp; Rwanda IP Law No. 31/2009
          </p>
          <p className="text-[10px] text-muted-foreground/60">ARIPO Member State &nbsp;|&nbsp; All rights reserved</p>
        </div>
      </div>
    </div>
  );
}

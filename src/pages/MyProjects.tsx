import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useApp } from '@/contexts/AppContext';
import DashboardLayout from '@/components/DashboardLayout';
import { Plus, Shield, Calendar, X, Loader2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { getWorks, saveWork, deleteWork, type Work } from '@/lib/localStorage';

const WORK_TYPES = ['guide', 'photo', 'video', 'training', 'other'];

export default function MyProjects() {
  const { user } = useAuth();
  const { t } = useApp();
  const [works, setWorks] = useState<Work[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: '', type: 'guide', description: '', created_date: '', is_registered: 'no' });

  useEffect(() => {
    if (user) setWorks(getWorks(user.id));
  }, [user]);

  const handleAdd = () => {
    if (!form.title.trim() || !user) return;
    setSaving(true);
    const work = saveWork(user.id, form);
    setWorks(getWorks(user.id));
    toast.success(t('saveWork'));
    setShowModal(false);
    setForm({ title: '', type: 'guide', description: '', created_date: '', is_registered: 'no' });
    setSaving(false);
  };

  const handleDelete = (workId: string) => {
    if (!user) return;
    deleteWork(user.id, workId);
    setWorks(getWorks(user.id));
    toast.success('Work removed');
  };

  const regBadge = (status: string) => {
    if (status === 'yes')         return { label: 'Registered ✓', bg: 'hsl(var(--emerald) / 0.1)', color: 'hsl(var(--emerald))' };
    if (status === 'in_progress') return { label: 'In Progress',  bg: 'hsl(var(--gold) / 0.1)',    color: 'hsl(var(--gold))' };
    return { label: 'Not Registered', bg: 'hsl(var(--secondary))', color: 'hsl(var(--muted-foreground))' };
  };

  const typeIcon = (type: string) =>
    ({ guide: '📄', photo: '📷', video: '🎥', training: '📋', other: '📁' }[type] ?? '📁');

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in pb-24 max-w-3xl mx-auto">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{t('myProjects')}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{t('myProjectsDesc')}</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #1b3a2a, #2d5a3d)' }}>
            <Plus className="w-4 h-4" /> {t('newProject')}
          </button>
        </div>

        {works.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'hsl(var(--secondary))' }}>
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-1">{t('noProjectsYet')}</h3>
            <p className="text-sm text-muted-foreground mb-4">{t('noProjectsDesc')}</p>
            <button onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, #1b3a2a, #2d5a3d)' }}>
              <Plus className="w-4 h-4" /> {t('createProject')}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {works.map(work => {
              const badge = regBadge(work.is_registered);
              return (
                <div key={work.id} className="glass-card p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{typeIcon(work.type)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-semibold text-sm">{work.title}</h3>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                          style={{ background: badge.bg, color: badge.color }}>
                          <Shield className="w-2.5 h-2.5" /> {badge.label}
                        </span>
                      </div>
                      {work.description && <p className="text-xs text-muted-foreground">{work.description}</p>}
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                        <span className="capitalize px-2 py-0.5 rounded bg-secondary">{work.type}</span>
                        {work.created_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />{new Date(work.created_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Link to="/dashboard/registration"
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium"
                        style={{ background: 'hsl(var(--emerald) / 0.1)', color: 'hsl(var(--emerald))' }}>
                        {t('registerWork')}
                      </Link>
                      <button onClick={() => handleDelete(work.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-red-50"
                        style={{ color: 'hsl(var(--alert))' }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="rounded-xl p-4 text-xs text-center text-muted-foreground"
          style={{ background: 'hsl(var(--gold) / 0.06)', border: '1px solid hsl(var(--gold) / 0.2)' }}>
          🛡️ {t('ipAutoProtected')}
        </div>
      </div>

      {/* Add Work Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40"
          onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md rounded-2xl p-6 bg-white animate-slide-up"
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">{t('addCreativeWork')}</h2>
              <button onClick={() => setShowModal(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-100">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">{t('workTitle')} *</label>
                <input value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. My Composting Guide"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-secondary border border-border" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">{t('workType')}</label>
                <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-secondary border border-border">
                  {WORK_TYPES.map(wt => <option key={wt} value={wt}>{wt.charAt(0).toUpperCase() + wt.slice(1)}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">{t('workDescription')}</label>
                <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={2} placeholder="Brief description..."
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none resize-none bg-secondary border border-border" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">{t('workDateCreated')}</label>
                <input type="date" value={form.created_date}
                  onChange={e => setForm(p => ({ ...p, created_date: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-secondary border border-border" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">{t('workRegistered')}</label>
                <select value={form.is_registered} onChange={e => setForm(p => ({ ...p, is_registered: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none bg-secondary border border-border">
                  <option value="no">No</option>
                  <option value="in_progress">In Progress</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              <button onClick={handleAdd} disabled={!form.title.trim() || saving}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-40 flex items-center justify-center gap-2"
                style={{ background: '#1b3a2a' }}>
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {t('saveWork')}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

/**
 * AgriPio Local Storage helpers
 * All data that doesn't need a DB lives here.
 */

export interface Work {
  id: string;
  user_id: string;
  title: string;
  type: string;
  description: string;
  created_date: string;
  is_registered: string;
  created_at: string;
}

export interface Pledge {
  id: string;
  user_id: string;
  display_name: string;
  statement: string;
  created_at: string;
}

export interface LearningProgress {
  user_id: string;
  module_id: string;
  completed_at: string;
}

// ── Keys ──────────────────────────────────────────────────────
const key = (name: string, userId: string) => `agripio_${name}_${userId}`;
const globalKey = (name: string) => `agripio_${name}`;

// ── Works ─────────────────────────────────────────────────────
export function getWorks(userId: string): Work[] {
  try { return JSON.parse(localStorage.getItem(key('works', userId)) || '[]'); }
  catch { return []; }
}

export function saveWork(userId: string, work: Omit<Work, 'id' | 'user_id' | 'created_at'>): Work {
  const works = getWorks(userId);
  const newWork: Work = { ...work, id: crypto.randomUUID(), user_id: userId, created_at: new Date().toISOString() };
  localStorage.setItem(key('works', userId), JSON.stringify([newWork, ...works]));
  return newWork;
}

export function deleteWork(userId: string, workId: string): void {
  const works = getWorks(userId).filter(w => w.id !== workId);
  localStorage.setItem(key('works', userId), JSON.stringify(works));
}

// ── Pledges ───────────────────────────────────────────────────
export function getPledges(): Pledge[] {
  try { return JSON.parse(localStorage.getItem(globalKey('pledges')) || '[]'); }
  catch { return []; }
}

export function getMyPledge(userId: string): Pledge | null {
  return getPledges().find(p => p.user_id === userId) || null;
}

export function savePledge(userId: string, displayName: string, statement: string): Pledge {
  const pledges = getPledges().filter(p => p.user_id !== userId); // replace if exists
  const pledge: Pledge = { id: crypto.randomUUID(), user_id: userId, display_name: displayName, statement, created_at: new Date().toISOString() };
  localStorage.setItem(globalKey('pledges'), JSON.stringify([pledge, ...pledges]));
  return pledge;
}

// ── Learning Progress ─────────────────────────────────────────
export function getProgress(userId: string): string[] {
  try { return JSON.parse(localStorage.getItem(key('progress', userId)) || '[]'); }
  catch { return []; }
}

export function saveProgress(userId: string, moduleId: string): void {
  const current = getProgress(userId);
  if (!current.includes(moduleId)) {
    localStorage.setItem(key('progress', userId), JSON.stringify([...current, moduleId]));
  }
}

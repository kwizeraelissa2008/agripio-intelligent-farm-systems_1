/**
 * First-Use EULA / Privacy Policy Modal
 * Must be accepted before completing onboarding
 * Covers: screenshots, fake usernames, stolen media, AI content reposting
 * © 2026 AgriPio — All rights reserved.
 */
import { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';

interface EULAModalProps {
  language: string;
  onAccept: () => void;
}

const eulaEN = [
  { icon: '📸', title: 'No Commercial Screenshots', text: 'You may not take screenshots of AgriPio content and redistribute them for commercial purposes without written permission.' },
  { icon: '🚫', title: 'No Fake Usernames', text: 'Usernames must be original and not impersonate other individuals, brands, or organizations. AI verification is applied.' },
  { icon: '🖼️', title: 'No Stolen Media', text: 'All photos, videos, and media you upload must be your own original content. Reposting others\' content is prohibited.' },
  { icon: '🤖', title: 'No AI Content Reposting', text: 'AI-generated insights, reports, and advice from AgriPio are for personal use only. Do not repost or republish as your own original work.' },
  { icon: '🔒', title: 'IP Respect & Protection', text: 'You agree to respect intellectual property rights of other users, the platform, and third parties. Violations may result in account suspension.' },
  { icon: '📊', title: 'Data Usage Consent', text: 'AgriPio collects agricultural data to improve AI recommendations. Your personal data is encrypted and never sold to third parties.' },
];

const eulaRW = [
  { icon: '📸', title: 'Nta Gufata Ifoto zo Kugurisha', text: 'Ntushobora gufata amafoto y\'ibiri muri AgriPio ukabikoresha mu bucuruzi utabyemerewe mu nyandiko.' },
  { icon: '🚫', title: 'Nta Mazina y\'Ikinyoma', text: 'Amazina agomba kuba ay\'ukuri kandi ntashobora gukoresha aya bandi. AI yigerageza gusuzuma.' },
  { icon: '🖼️', title: 'Nta Gukoresha Ibya Bandi', text: 'Amafoto, videwo, n\'ibindi ushyira kuri sisitemu bigomba kuba ibyawe bwite. Gusubiramo iby\'abandi birabuza.' },
  { icon: '🤖', title: 'Nta Gusubiramo Ibya AI', text: 'Inama za AI, raporo, n\'ubujyanama biva muri AgriPio ni ubwawe gusa. Ntubisangire nk\'ibyawe.' },
  { icon: '🔒', title: 'Kubahiriza IP', text: 'Wemeye kubahiriza uburenganzira bw\'umwuga bw\'abandi bakoresha, urubuga, n\'abandi. Kunyuranya bishobora guhagarika konti.' },
  { icon: '📊', title: 'Kwemera Gukoresha Amakuru', text: 'AgriPio ikusanya amakuru y\'ubuhinzi kugira ngo iterambere inama za AI. Amakuru yawe bwite arinzwe kandi ntagurishwa.' },
];

export default function EULAModal({ language, onAccept }: EULAModalProps) {
  const [accepted, setAccepted] = useState(false);
  const items = language === 'rw' ? eulaRW : eulaEN;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'hsl(0 0% 0% / 0.9)', backdropFilter: 'blur(12px)' }}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="glass-card p-6" style={{ border: '1px solid hsl(var(--emerald) / 0.3)' }}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'hsl(var(--emerald) / 0.15)' }}>
              <Shield className="w-5 h-5" style={{ color: 'hsl(var(--emerald))' }} />
            </div>
            <div>
              <h2 className="text-lg font-bold">{language === 'rw' ? 'Amategeko n\'Ibanga' : 'Terms of Use & Privacy'}</h2>
              <p className="text-xs text-muted-foreground">{language === 'rw' ? 'Soma kandi wemere mbere yo gukomeza' : 'Please read and accept before continuing'}</p>
            </div>
          </div>

          {/* Terms */}
          <div className="space-y-3 mb-6">
            {items.map((item, i) => (
              <div key={i} className="p-3 rounded-xl" style={{ background: 'hsl(0 0% 6%)', border: '1px solid hsl(0 0% 12%)' }}>
                <div className="flex items-start gap-3">
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <div>
                    <h4 className="text-sm font-semibold mb-0.5">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2 p-3 rounded-xl mb-5" style={{ background: 'hsl(var(--warning) / 0.08)', border: '1px solid hsl(var(--warning) / 0.2)' }}>
            <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'hsl(var(--warning))' }} />
            <p className="text-xs" style={{ color: 'hsl(var(--warning))' }}>
              {language === 'rw'
                ? 'Kunyuranya n\'aya mategeko bishobora guhagarika konti yawe.'
                : 'Violation of these terms may result in permanent account suspension.'}
            </p>
          </div>

          {/* Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer mb-5 p-3 rounded-xl transition-all"
            style={{ background: accepted ? 'hsl(var(--emerald) / 0.08)' : 'hsl(0 0% 6%)', border: `1px solid ${accepted ? 'hsl(var(--emerald) / 0.3)' : 'hsl(0 0% 12%)'}` }}>
            <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} className="hidden" />
            <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
              style={accepted
                ? { background: 'hsl(var(--emerald))', color: 'hsl(0 0% 4%)' }
                : { background: 'hsl(0 0% 12%)', border: '1px solid hsl(0 0% 20%)' }}>
              {accepted && <CheckCircle className="w-3.5 h-3.5" />}
            </div>
            <span className="text-sm">
              {language === 'rw'
                ? 'Nasomye kandi nemeye amategeko n\'ibanga bya AgriPio'
                : 'I have read and agree to the AgriPio Terms of Use & Privacy Policy'}
            </span>
          </label>

          {/* Accept */}
          <button onClick={onAccept} disabled={!accepted}
            className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all"
            style={accepted
              ? { background: 'var(--gradient-emerald)', color: 'hsl(var(--primary-foreground))', boxShadow: 'var(--shadow-emerald)' }
              : { background: 'hsl(0 0% 12%)', color: 'hsl(var(--muted-foreground))', cursor: 'not-allowed', opacity: 0.5 }}>
            {language === 'rw' ? '✓ Emeza kandi Ukomeze' : '✓ Accept & Continue'}
          </button>

          <p className="text-center text-xs text-muted-foreground mt-4">© 2026 AgriPio. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

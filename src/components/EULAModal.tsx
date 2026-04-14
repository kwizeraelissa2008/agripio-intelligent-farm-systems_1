/**
 * EULA / Terms & Conditions Modal
 * Shows once per user after registration.
 * Accept → proceed. Reject → sign out.
 * © 2026 AgriPio — Rwanda Law No. 31/2009
 */
import { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, X } from 'lucide-react';

interface EULAModalProps {
  language: string;
  onAccept: () => void;
  onReject: () => void;
}

const termsEN = [
  { icon: '©️', title: 'Copyright Protection', text: "AgriPio and all its content — source code, UI design, educational modules, AI persona, and IoT firmware — are protected under Rwanda's IP Law No. 31/2009 as original creative works." },
  { icon: '📸', title: 'No Unauthorised Screenshots', text: 'You may not capture, reproduce, or redistribute AgriPio content for commercial purposes without written permission from the AgriPio Team.' },
  { icon: '🖼️', title: 'Original Media Only', text: "All photos, videos, and media you upload must be your own original work. Uploading others' content without permission violates copyright law." },
  { icon: '🤖', title: 'AI Content Usage', text: 'AI-generated advice from AgriGuide is for your personal farm use only. You may not republish or redistribute it as your own original work.' },
  { icon: '🛡️', title: "Respect Others' IP", text: "You agree to respect the intellectual property rights of other farmers, the platform, and third parties. Copying another farmer's guide, video, or training material without permission is prohibited." },
  { icon: '🚫', title: 'No Impersonation', text: 'Your display name must be genuine. Impersonating other individuals, brands, or organisations is not permitted.' },
  { icon: '📊', title: 'Data & Privacy', text: 'AgriPio collects agricultural and sensor data to improve AI recommendations. Your personal data is encrypted and never sold to third parties.' },
  { icon: '⚖️', title: 'Governing Law', text: 'These terms are governed by the laws of Rwanda. Violations may result in permanent account suspension and legal action under Rwandan IP law.' },
];

const termsRW = [
  { icon: '©️', title: "Uburenganzira bw'Umwanditsi", text: "AgriPio n'ibikubiyemo byose birinzwe n'Itegeko No. 31/2009 nk'ibikorwa by'ubuhanzi." },
  { icon: '📸', title: 'Nta Gufata Amafoto Bitemewe', text: "Ntushobora gufata, gusubiramo, cyangwa gusangira ibikubiyemo bya AgriPio mu bucuruzi utabyemerewe mu nyandiko." },
  { icon: '🖼️', title: "Ibikoresho by'Ukuri Gusa", text: "Amafoto, videwo, n'ibindi ushyira kuri sisitemu bigomba kuba ibyawe bwite. Gusubiramo iby'abandi birabuza." },
  { icon: '🤖', title: 'Gukoresha Ibya AI', text: "Inama za AgriGuide ni iz'ubuhinzi bwawe gusa. Ntubisangire nk'ibyawe bwite." },
  { icon: '🛡️', title: "Kubahiriza IP y'Abandi", text: "Wemeye kubahiriza uburenganzira bw'abandi bahinzi, urubuga, n'abandi. Gukopera umwirondoro, videwo, cyangwa amahugurwa by'undi muntu birabuza." },
  { icon: '🚫', title: 'Nta Kwigana Abandi', text: "Izina ryawe rigomba kuba iry'ukuri. Kwigana abandi birabuza." },
  { icon: '📊', title: "Amakuru n'Ibanga", text: "AgriPio ikusanya amakuru y'ubuhinzi kugira ngo iterambere inama za AI. Amakuru yawe bwite arinzwe kandi ntagurishwa." },
  { icon: '⚖️', title: 'Amategeko Agenga', text: "Aya mategeko agenga n'amategeko y'u Rwanda. Kunyuranya bishobora guhagarika konti yawe burundu." },
];

export default function EULAModal({ language, onAccept, onReject }: EULAModalProps) {
  const [accepted, setAccepted] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const isRw = language === 'rw';
  const items = isRw ? termsRW : termsEN;

  const handleReject = async () => {
    setRejecting(true);
    await onReject();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-lg animate-slide-up flex flex-col" style={{ maxHeight: '92vh' }}>
        <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: '#fff', border: '2px solid #1b3a2a' }}>

          {/* Header */}
          <div className="px-6 py-4 flex items-center gap-3 flex-shrink-0" style={{ background: '#1b3a2a' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-bold text-white">
                {isRw ? "Amategeko n'Ibanga" : 'Terms of Use & Privacy Policy'}
              </h2>
              <p className="text-[11px]" style={{ color: '#a5d6a7' }}>
                {isRw ? 'Soma kandi wemere mbere yo gukomeza' : 'Read and accept before continuing'}
              </p>
            </div>
            <span className="text-[10px] font-medium px-2 py-1 rounded-lg flex-shrink-0"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#c8e6c9' }}>
              Rwanda Law No. 31/2009
            </span>
          </div>

          {/* Scrollable terms */}
          <div className="overflow-y-auto px-5 py-4 space-y-2.5" style={{ maxHeight: '52vh' }}>
            {items.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: '#f7faf7', border: '1px solid #e0ece0' }}>
                <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-0.5">{item.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{item.text}</p>
                </div>
              </div>
            ))}

            <div className="flex items-start gap-2 p-3 rounded-xl"
              style={{ background: 'hsl(45 90% 48% / 0.08)', border: '1px solid hsl(45 90% 48% / 0.3)' }}>
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'hsl(45 90% 48%)' }} />
              <p className="text-xs leading-relaxed" style={{ color: 'hsl(45 90% 38%)' }}>
                {isRw
                  ? "Kunyuranya n'aya mategeko bishobora guhagarika konti yawe burundu."
                  : 'Violation of these terms may result in permanent account suspension and legal action under Rwandan IP law.'}
              </p>
            </div>
          </div>

          {/* Checkbox + buttons */}
          <div className="px-5 pb-5 pt-4 flex-shrink-0 border-t" style={{ borderColor: '#e0ece0' }}>
            <label className="flex items-start gap-3 cursor-pointer mb-4 p-3 rounded-xl transition-all"
              style={{
                background: accepted ? 'rgba(27,58,42,0.06)' : '#f7faf7',
                border: `1px solid ${accepted ? 'rgba(27,58,42,0.35)' : '#e0ece0'}`,
              }}>
              <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} className="hidden" />
              <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all"
                style={accepted
                  ? { background: '#1b3a2a' }
                  : { background: '#fff', border: '2px solid #b2cfc0' }}>
                {accepted && <CheckCircle className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className="text-sm text-gray-700 leading-relaxed">
                {isRw
                  ? "Nasomye kandi nemeye amategeko n'ibanga bya AgriPio. Nzubahiriza uburenganzira bw'imitungo y'ubwenge."
                  : "I have read and agree to the AgriPio Terms of Use & Privacy Policy. I will respect intellectual property rights."}
              </span>
            </label>

            <div className="flex gap-3">
              <button onClick={handleReject} disabled={rejecting}
                className="flex-1 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-80 disabled:opacity-50"
                style={{ background: 'hsl(0 80% 55% / 0.08)', color: 'hsl(0 80% 45%)', border: '1px solid hsl(0 80% 55% / 0.25)' }}>
                <X className="w-4 h-4" />
                {isRw ? 'Anga & Sohoka' : 'Reject & Sign Out'}
              </button>
              <button onClick={onAccept} disabled={!accepted}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: '#1b3a2a' }}>
                {isRw ? '✓ Emeza & Komeza' : '✓ Accept & Continue'}
              </button>
            </div>

            <p className="text-center text-[10px] text-gray-400 mt-3">
              © 2026 AgriPio Team | Rwanda IP Law No. 31/2009 | ARIPO Member State
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

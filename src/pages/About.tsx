import DashboardLayout from '@/components/DashboardLayout';
import { Shield, Code, Cpu, BookOpen, Sparkles } from 'lucide-react';

const team = [
  { name: 'KWIZERA Elissa',    role: 'Team Lead',      desc: 'IP rights education & project coordination' },
  { name: 'INEZA Elyon Ivo',   role: 'Tech Lead',      desc: 'IoT systems, data analysis & backend' },
  { name: 'INEZA Aliza',       role: 'Content Lead',   desc: 'Educational content & copyright curriculum' },
  { name: 'ISHIMWE Ornella',   role: 'Research Lead',  desc: 'Agricultural research & IP protection' },
];

const techStack = ['React', 'TypeScript', 'Supabase', 'Anthropic Claude API', 'Recharts', 'Framer Motion'];

export default function About() {
  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-24">

        {/* Hero */}
        <div className="rounded-2xl p-8 text-white text-center"
          style={{ background: 'linear-gradient(135deg, #1b3a2a 0%, #2d5a3d 60%, #3d8b40 100%)' }}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: 'rgba(255,255,255,0.15)' }}>
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Protecting Farmers' Creative Works with Technology</h1>
          <p className="text-sm leading-relaxed" style={{ color: '#c8e6c9' }}>
            AgriPio combines AI, IoT hardware, and IP education to help Rwandan farmers understand
            and protect their copyright — and improve their productivity.
          </p>
        </div>

        {/* Team */}
        <div>
          <h2 className="text-lg font-bold mb-4">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {team.map(m => (
              <div key={m.name} className="glass-card p-5 flex items-start gap-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
                  style={{ background: '#1b3a2a' }}>
                  {m.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-sm">{m.name}</p>
                  <p className="text-xs font-medium mt-0.5" style={{ color: 'hsl(var(--emerald))' }}>{m.role}</p>
                  <p className="text-xs text-muted-foreground mt-1">{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-center text-muted-foreground mt-3">
            IP Club — École des Sciences Byimana | ARIPO/WIPO IP Club Initiative
          </p>
        </div>

        {/* IP Notice */}
        <div className="rounded-2xl p-6" style={{ border: '2px solid hsl(var(--gold) / 0.5)', background: 'hsl(var(--gold) / 0.05)' }}>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5" style={{ color: 'hsl(var(--gold))' }} />
            <h2 className="font-bold" style={{ color: 'hsl(var(--gold))' }}>Intellectual Property Notice</h2>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground leading-relaxed">
            <p className="font-semibold text-foreground">© 2025 AgriPio Team. All rights reserved.</p>
            <p>AgriPio is an original creative work protected under Rwanda's Intellectual Property Law No. 31/2009:</p>
            <ul className="space-y-1.5 ml-2">
              {[
                ['Source code', 'Computer program = Literary work (Article 5)'],
                ['User interface design', 'Original artistic work'],
                ['Educational content (modules, quizzes, scenarios)', 'Literary works'],
                ['AgriGuide AI persona', 'Original creative work'],
                ['IoT device firmware', 'Computer program = Literary work (Article 5)'],
              ].map(([item, desc]) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0">•</span>
                  <span><strong>{item}</strong> → {desc}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs pt-2 border-t" style={{ borderColor: 'hsl(var(--gold) / 0.2)' }}>
              Unauthorized reproduction, distribution, or modification of any part of AgriPio without
              written permission from the AgriPio Team is prohibited.
            </p>
            <p className="text-xs">
              Developed as an IP Club project under the ARIPO/WIPO IP Club initiative with support
              from Rwanda Development Board (RDB).
            </p>
          </div>
        </div>

        {/* Tech Credits */}
        <div className="glass-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Code className="w-4 h-4" style={{ color: 'hsl(var(--emerald))' }} />
            <h2 className="font-semibold text-sm">Technology</h2>
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            {techStack.map(t => (
              <span key={t} className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ background: 'hsl(var(--emerald) / 0.1)', color: 'hsl(var(--emerald))' }}>
                {t}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            AI responses from AgriGuide do not constitute legal advice.
          </p>
        </div>

        {/* Bottom copyright bar */}
        <div className="text-center py-4 border-t" style={{ borderColor: '#e6efe6' }}>
          <p className="text-[11px] text-gray-400">
            © 2026 AgriPio Team &nbsp;
          </p>
          <p className="text-[10px] text-gray-300 mt-0.5">
            Source code, UI design, educational content &amp; AI persona are original creative works. All rights reserved.
          </p>
        </div>

      </div>
    </DashboardLayout>
  );
}

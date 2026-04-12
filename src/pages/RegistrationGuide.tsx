import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { ChevronRight, CheckCircle, ExternalLink, Download } from 'lucide-react';

const steps = [
  {
    num: 1, title: 'Confirm your work qualifies',
    content: 'Ask yourself: Is it original? Did I create it myself? Is it expressed in a tangible form (written, recorded, photographed)? If yes — your work qualifies for copyright protection.',
    tips: ['Written guides and manuals ✅', 'Farm photographs ✅', 'Training videos ✅', 'Ideas in your head only ❌'],
  },
  {
    num: 2, title: 'Document it',
    content: 'Before registering, document your work thoroughly. This creates evidence of your ownership and the date of creation.',
    tips: ['Print or save a copy with today\'s date', 'Write a description of what makes it original', 'Keep drafts and earlier versions', 'Email yourself a copy (creates a timestamp)'],
  },
  {
    num: 3, title: 'Register with RDB',
    content: 'Visit the Rwanda Development Board (RDB) to register your copyright. Registration is voluntary but gives you official proof of ownership.',
    tips: ['Website: rdb.rw', 'Bring: copy of work, ID, description, date of creation', 'Registration fee applies', 'You receive an official certificate'],
    link: { label: 'Visit RDB Website', url: 'https://www.rdb.rw' },
  },
  {
    num: 4, title: 'Consider ARIPO regional protection',
    content: 'The ARIPO Kampala Protocol 2021 allows you to register copyright across 22 African countries with a single application.',
    tips: ['Protects your work in all ARIPO member states', 'Rwanda is an ARIPO member since 2010', 'Useful if you share content across East Africa', 'Apply through RDB or directly to ARIPO'],
    link: { label: 'Visit ARIPO Website', url: 'https://www.aripo.org' },
  },
  {
    num: 5, title: 'Download your checklist',
    content: 'Use this checklist to make sure you have completed all steps before and after registration.',
    tips: ['Work is original and expressed in tangible form', 'Documentation complete with dates', 'RDB registration submitted', 'ARIPO registration considered', 'Certificate stored safely'],
    isDownload: true,
  },
];

export default function RegistrationGuide() {
  const [open, setOpen] = useState<number | null>(0);

  const handleDownload = () => {
    const content = `AgriPio IP Registration Checklist
Generated: ${new Date().toLocaleDateString()}
Rwanda Law No. 31/2009 | ARIPO Kampala Protocol 2021

STEP 1 — Confirm your work qualifies
[ ] Work is original (created by me)
[ ] Work is expressed in tangible form (written, recorded, photographed)
[ ] Not just an idea — it is expressed

STEP 2 — Document it
[ ] Printed/saved copy with date
[ ] Written description of originality
[ ] Earlier drafts kept
[ ] Timestamped copy (email to self)

STEP 3 — Register with RDB
[ ] Visited rdb.rw
[ ] Prepared: copy of work, ID, description, creation date
[ ] Registration fee paid
[ ] Certificate received and stored

STEP 4 — ARIPO Regional (optional)
[ ] Considered ARIPO Kampala Protocol 2021
[ ] Applied if sharing content across East Africa

STEP 5 — Ongoing
[ ] Certificate stored safely
[ ] Monitoring for infringement
[ ] Know how to report: contact infringer → report to RDB → court if needed

© 2025 AgriPio Team | Rwanda Law No. 31/2009`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'AgriPio_IP_Registration_Checklist.txt';
    a.click(); URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-5 animate-fade-in pb-24">
        <div>
          <h1 className="text-xl font-bold">📋 IP Registration Guide</h1>
          <p className="text-xs text-muted-foreground mt-0.5">5 steps to protect your creative works</p>
        </div>

        <div className="space-y-3">
          {steps.map(step => (
            <div key={step.num} className="glass-card overflow-hidden">
              <button onClick={() => setOpen(open === step.num ? null : step.num)}
                className="w-full flex items-center gap-4 p-4 text-left transition-all hover:bg-secondary/50">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: '#1b3a2a' }}>
                  {step.num}
                </div>
                <span className="font-semibold text-sm flex-1">{step.title}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform"
                  style={{ transform: open === step.num ? 'rotate(90deg)' : 'none' }} />
              </button>
              {open === step.num && (
                <div className="px-4 pb-4 space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.content}</p>
                  <ul className="space-y-1.5">
                    {step.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'hsl(var(--emerald))' }} />
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                  {step.link && (
                    <a href={step.link.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium"
                      style={{ background: 'hsl(var(--emerald) / 0.1)', color: 'hsl(var(--emerald))' }}>
                      <ExternalLink className="w-4 h-4" /> {step.link.label}
                    </a>
                  )}
                  {step.isDownload && (
                    <button onClick={handleDownload}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                      style={{ background: '#1b3a2a' }}>
                      <Download className="w-4 h-4" /> Download Checklist
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center text-xs text-muted-foreground pt-2">
          Based on Rwanda Law No. 31/2009 | ARIPO Kampala Protocol 2021
        </div>
      </div>
    </DashboardLayout>
  );
}

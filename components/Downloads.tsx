'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Monitor, Download, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const documents = [
  { title: 'Topic Assessment', date: '2024/05/13', type: 'Group' },
  { title: 'Project Proposal', date: '2024/08/23', type: 'Individual' },
  { title: 'Research Paper', date: '2025/03/22', type: 'Group' },
  { title: 'Final Report', date: '2025/05/11', type: 'Group + Individual' },
];

const presentations = [
  { title: 'Project Proposal', date: '2024/08/08', type: 'Group' },
  { title: 'Progress Presentation I', date: '2024/12/05', type: 'Group' },
  { title: 'Progress Presentation II', date: '2025/03/20', type: 'Group' },
  { title: 'Final Presentation', date: '2025/05/28', type: 'Group' },
];

const DownloadCard = ({ title, date, type, icon: Icon }: any) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="glass-card p-6 rounded-2xl group flex flex-col h-full"
  >
    <div className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center mb-6 group-hover:bg-brand-blue transition-colors duration-300">
      <Icon className="w-5 h-5 text-brand-blue group-hover:text-white transition-colors" />
    </div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <div className="flex items-center gap-2 mb-6">
      <div className="w-2 h-2 rounded-full bg-emerald-500" />
      <span className="text-xs text-slate-500 font-medium">{date}</span>
    </div>
    
    <div className="mt-auto flex items-center justify-between">
      <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
        {type}
      </span>
      <button className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-brand-blue hover:bg-brand-blue/10 text-white flex items-center gap-2 transition-all duration-300">
        <ArrowDown className="w-4 h-4" />
        <span className="text-xs font-bold uppercase">Download</span>
      </button>
    </div>
  </motion.div>
);

export default function Downloads() {
  return (
    <section id="downloads" className="py-24 bg-brand-dark/30">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Downloads</h2>
          <p className="text-slate-400">Access all project documents and presentations</p>
        </div>

        <div className="space-y-16">
          {/* Documents Section */}
          <div>
            <div className="flex items-center gap-3 mb-10">
              <FileText className="w-6 h-6 text-brand-blue" />
              <h3 className="text-2xl font-bold text-white tracking-tight">Documents</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {documents.map((doc, idx) => (
                <DownloadCard key={idx} {...doc} icon={FileText} />
              ))}
            </div>
          </div>

          {/* Presentations Section */}
          <div>
            <div className="flex items-center gap-3 mb-10">
              <Monitor className="w-6 h-6 text-brand-purple" />
              <h3 className="text-2xl font-bold text-white tracking-tight">Presentations</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {presentations.map((pres, idx) => (
                <DownloadCard key={idx} {...pres} icon={Monitor} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

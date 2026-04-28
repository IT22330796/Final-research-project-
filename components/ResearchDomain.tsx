'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Search, Target, Layout, Layers, Cpu, Info, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const domains = [
  { id: 'survey', label: 'Literature Survey', icon: Search, content: {
      highlight: "Vision disorders affect approximately 2.2 billion people worldwide, with retinal diseases being among the leading causes of preventable blindness. Our comprehensive literature survey reveals critical gaps in current diagnostic approaches.",
      findings: [
        { title: "Diabetic Retinopathy (DR)", icon: Eye, text: "Leading cause of blindness in working-age adults. Current automated systems show limited accuracy for mild-stage detection." },
        { title: "Age-Related Macular Degeneration", icon: Layout, text: "AMD affects 196 million globally. VGG16-based models show high computational cost limiting real-world deployment." }
      ]
  }},
  { id: 'gap', label: 'Research Gap', icon: Layers, content: {
      highlight: "Existing methodologies often fail to detect early-stage symptoms due to low image contrast and subtle pathological changes that AI models frequently misclassify.",
      findings: [
        { title: "Dataset Limitations", icon: Target, text: "Most datasets lack ethnic diversity, leading to biased AI predictions in non-represented populations." },
        { title: "Real-time Processing", icon: Cpu, text: "Current high-accuracy models are too heavy for portable diagnostic devices used in rural clinics." }
      ]
  }},
  { id: 'problem', label: 'Research Problem', icon: Target },
  { id: 'objectives', label: 'Research Objectives', icon: Cpu },
  { id: 'methodology', label: 'Methodology', icon: Layers },
  { id: 'technologies', label: 'Technologies Used', icon: Cpu },
];

export default function ResearchDomain() {
  const [activeTab, setActiveTab] = useState('survey');

  return (
    <section id="domain" className="py-24 bg-brand-dark/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Research Domain</h2>
          <p className="text-slate-400">Comprehensive research methodology and technological framework</p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {domains.map((domain) => (
            <button
              key={domain.id}
              onClick={() => setActiveTab(domain.id)}
              className={cn(
                'px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border flex items-center gap-2',
                activeTab === domain.id 
                  ? 'bg-brand-blue/10 border-brand-blue text-brand-blue shadow-[0_0_15px_rgba(14,165,233,0.2)]' 
                  : 'border-slate-800 text-slate-400 hover:border-slate-600 hover:text-slate-200'
              )}
            >
              <domain.icon className="w-4 h-4" />
              {domain.label}
            </button>
          ))}
        </div>

        <div className="glass p-1 rounded-3xl border-slate-800/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="p-8 md:p-12"
            >
              {domains.find(d => d.id === activeTab)?.content ? (
                <div className="space-y-12">
                  <div className="flex gap-6 p-6 rounded-2xl bg-brand-blue/5 border-l-4 border-brand-blue">
                    <div className="text-brand-blue text-lg leading-relaxed">
                      {domains.find(d => d.id === activeTab)?.content?.highlight}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-8 flex items-center gap-2">
                      Key Survey Findings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {domains.find(d => d.id === activeTab)?.content?.findings?.map((finding, idx) => (
                        <div key={idx} className="glass-card p-8 rounded-2xl group">
                          <div className="w-12 h-12 rounded-xl bg-brand-blue/10 flex items-center justify-center mb-6 group-hover:bg-brand-blue/20 transition-colors">
                            <finding.icon className="w-6 h-6 text-brand-blue" />
                          </div>
                          <h4 className="text-xl font-bold text-white mb-3">{finding.title}</h4>
                          <p className="text-slate-400 leading-relaxed">{finding.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500">
                  <Info className="w-12 h-12 mb-4 opacity-20" />
                  <p className="text-lg">Detailed content for {domains.find(d => d.id === activeTab)?.label} coming soon...</p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center mt-12">
          <button className="w-10 h-10 rounded-full glass border-slate-700 flex items-center justify-center hover:border-brand-blue transition-colors animate-bounce">
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>
    </section>
  );
}

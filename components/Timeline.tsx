'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const milestones = [
  {
    date: 'July 2024',
    title: 'Proposal Presentation',
    description: 'Oral presentation demonstrating project concept, objectives, and feasibility.',
    marks: '6%',
    status: 'Complete',
    side: 'left'
  },
  {
    date: 'August 2024',
    title: 'Proposal Report',
    description: 'Comprehensive written document detailing methodology, timeline, and expected outcomes.',
    marks: '6%',
    status: 'Complete',
    side: 'right'
  },
  {
    date: 'December 2024',
    title: 'Progress Presentation I',
    description: 'Reviews 50% completion status, revealing gaps or inconsistencies in design.',
    marks: '15%',
    status: 'Complete',
    side: 'left'
  },
  {
    date: 'March 2025',
    title: 'Research Paper',
    description: 'Describes contribution to existing knowledge with due recognition to prior work.',
    marks: '10%',
    status: 'Complete',
    side: 'right'
  },
  {
    date: 'May 2025',
    title: 'Final Presentation & Viva',
    description: 'Comprehensive final presentation followed by individual viva assessing each member.',
    marks: '20%',
    status: 'Upcoming',
    side: 'left'
  }
];

export default function Timeline() {
  return (
    <section id="milestones" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Timeline in Brief</h2>
          <p className="text-slate-400">Track our comprehensive project journey and achievements</p>
        </div>

        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-brand-blue via-brand-purple to-transparent opacity-30" />

          <div className="space-y-12">
            {milestones.map((item, index) => (
              <div key={index} className="relative flex items-center justify-between group">
                {/* Milestone Node */}
                <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full bg-brand-dark border-2 border-brand-blue z-10 shadow-[0_0_10px_rgba(14,165,233,0.5)] group-hover:scale-125 transition-transform" />

                <div className={cn(
                  "w-[45%] flex",
                  item.side === 'left' ? "justify-end text-right" : "opacity-0 invisible pointer-events-none"
                )}>
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="glass-card p-6 rounded-2xl w-full max-w-md relative"
                  >
                    <div className="flex items-center justify-between mb-4">
                       <span className="px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase">
                        {item.date}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">{item.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                      <span className="text-xs font-bold text-brand-blue">Marks: {item.marks}</span>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1",
                        item.status === 'Complete' ? "bg-emerald-500/10 text-emerald-500" : "bg-brand-blue/10 text-brand-blue"
                      )}>
                        {item.status === 'Complete' && <CheckCircle2 className="w-3 h-3" />}
                        {item.status}
                      </span>
                    </div>
                  </motion.div>
                </div>

                <div className={cn(
                  "w-[45%] flex",
                  item.side === 'right' ? "justify-start" : "opacity-0 invisible pointer-events-none"
                )}>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="glass-card p-6 rounded-2xl w-full max-w-md relative"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className="px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-[10px] font-bold uppercase">
                        {item.date}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                    <p className="text-slate-400 text-sm mb-6 leading-relaxed">{item.description}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                      <span className="text-xs font-bold text-brand-blue">Marks: {item.marks}</span>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1",
                        item.status === 'Complete' ? "bg-emerald-500/10 text-emerald-500" : "bg-brand-blue/10 text-brand-blue"
                      )}>
                        {item.status === 'Complete' && <CheckCircle2 className="w-3 h-3" />}
                        {item.status}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center mt-20">
          <button className="w-10 h-10 rounded-full glass border-slate-700 flex items-center justify-center hover:border-brand-blue transition-colors">
            <ChevronDown className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      </div>
    </section>
  );
}

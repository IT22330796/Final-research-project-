'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const Linkedin = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const supervisors = [
  {
    name: 'Dr. Junius Anjana',
    role: 'Supervisor',
    initials: 'JA',
    image: '/images/supervisors/dr_junius_anjana.png',
    title: 'Senior Lecturer',
    inst: 'Sri Lanka Institute of Information Technology',
    dept: 'Information Technology',
    color: 'border-brand-blue'
  },
  {
    name: 'Prof. Samantha Thelijjagoda',
    role: 'Co-Supervisor',
    initials: 'ST',
    image: '/images/supervisors/prof_samantha_thelijjagoda.png',
    title: 'Professor',
    inst: 'Sri Lanka Institute of Information Technology',
    dept: 'Information Technology',
    color: 'border-brand-cyan'
  },
  {
    name: 'Dr. Tharindu Fernando',
    role: 'External Supervisor',
    initials: 'TF',
    image: '/images/supervisors/dr_tharindu_fernando.png',
    title: 'External Expert',
    inst: 'Queensland University of Technology',
    dept: 'Computer Science',
    color: 'border-amber-500'
  }
];

const team = [
  { name: 'YAPA M.A.A C', role: 'Team Leader', initials: 'YA', image: '/images/team/yapa_maac.png' },
  { name: 'HIMASHA M M K', role: 'Team Member', initials: 'HI', image: '/images/team/himasha_mmk.png' },
  { name: 'Kumara P L G O L', role: 'Team Member', initials: 'KU', image: '/images/team/kumara_plgol.png' },
  { name: 'Chathuranga KHD', role: 'Team Member', initials: 'CH', image: '/images/team/chathuranga_khd.png' },
];

const SupervisorCard = ({ name, role, image, initials }: any) => (
  <motion.div
    whileHover={{ y: -10 }}
    className="relative group overflow-hidden rounded-2xl bg-slate-900 border border-slate-800"
  >
    <div className="aspect-[4/5] relative overflow-hidden bg-slate-800 flex items-center justify-center">
      {image ? (
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-all duration-700 scale-110 group-hover:scale-100" 
        />
      ) : (
        <div className="text-4xl font-bold text-slate-700">{initials}</div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
    <div className="bg-[#0D5C56] p-5 text-center relative z-10">
      <h3 className="text-white text-sm font-bold mb-1 tracking-wide uppercase">{name}</h3>
      <p className="text-[#A7D129] text-[10px] font-black uppercase tracking-[0.2em]">{role}</p>
    </div>
  </motion.div>
);



export default function AboutUs() {
  return (
    <section id="about" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">About Us</h2>
          <p className="text-slate-400">Meet our dedicated research team and supervisors</p>
        </div>

        <div className="mb-20">
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-10 text-center md:text-left">Supervisors</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {supervisors.map((s, idx) => (
              <SupervisorCard key={idx} {...s} />
            ))}
          </div>
        </div>

        <div className="flex justify-center mb-16">
           <button className="w-10 h-10 rounded-full glass border-slate-700 flex items-center justify-center animate-bounce">
              <ChevronDown className="w-5 h-5 text-slate-400" />
           </button>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500 mb-10 text-center md:text-left">Team Members</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((t, idx) => (
              <SupervisorCard key={idx} {...t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-grid z-0" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/20 rounded-full blur-[120px] z-0 animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-purple/10 rounded-full blur-[120px] z-0 animate-pulse-slow" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 mb-6">
            <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
            <span className="text-xs font-semibold text-brand-blue uppercase tracking-wider">AI Medical Research</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-extrabold mb-4 tracking-tighter leading-tight">
            Irisa <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-cyan">AI</span>
          </h1>
          
          <p className="text-sm font-medium tracking-[0.3em] text-slate-400 uppercase mb-8 ml-1">
            Early Detection · Lifelong Vision
          </p>
          
          <p className="text-lg text-slate-400 max-w-lg mb-10 leading-relaxed">
            An Integrated Deep Learning Framework for Early Detection of Vision Disorders using fundus image analysis and advanced computer vision.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="px-8 py-4 rounded-xl bg-white text-brand-dark font-bold flex items-center gap-2 hover:bg-brand-blue hover:text-white transition-all duration-300 group shadow-lg shadow-white/5">
              Explore Research
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 rounded-xl glass text-white font-bold flex items-center gap-3 hover:bg-slate-800/50 transition-all">
              <div className="w-10 h-10 rounded-full bg-brand-blue/20 flex items-center justify-center">
                <Play className="w-4 h-4 fill-brand-blue text-brand-blue" />
              </div>
              Watch Demo
            </button>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-8">
            <div>
              <div className="text-3xl font-bold text-white mb-1">4</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Diseases Detected</div>
            </div>
            <div className="border-l border-slate-800 pl-8">
              <div className="text-3xl font-bold text-white mb-1">96%</div>
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Project Complete</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative hidden lg:block"
        >
          {/* Radar Animation */}
          <div className="relative w-full aspect-square flex items-center justify-center">
            {/* Outer Rings */}
            <div className="absolute inset-0 border border-brand-blue/10 rounded-full" />
            <div className="absolute inset-4 border border-brand-blue/10 rounded-full" />
            <div className="absolute inset-12 border border-brand-blue/20 rounded-full" />
            <div className="absolute inset-24 border border-brand-blue/30 rounded-full" />
            
            {/* Central Circle */}
            <div className="w-48 h-48 rounded-full glass flex items-center justify-center border-brand-blue/30 relative">
               <div className="absolute inset-0 rounded-full bg-brand-blue/5 animate-pulse" />
               <div className="w-12 h-12 rounded-full bg-brand-blue/20 flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-brand-blue shadow-[0_0_15px_rgba(14,165,233,1)]" />
               </div>
            </div>

            {/* Radar Sweep */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-blue/20 to-transparent opacity-50 origin-center"
              style={{ clipPath: 'polygon(50% 50%, 50% 0, 100% 0, 100% 50%)' }}
            />

            {/* Scanning dots */}
            <div className="absolute top-1/4 right-1/3 w-2 h-2 bg-brand-blue rounded-full shadow-[0_0_10px_rgba(14,165,233,1)]" />
            <div className="absolute bottom-1/3 left-1/4 w-1.5 h-1.5 bg-brand-cyan rounded-full shadow-[0_0_10px_rgba(6,182,212,1)]" />
            <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-brand-blue rounded-full shadow-[0_0_10px_rgba(14,165,233,1)]" />

            {/* Connecting lines (SVG) */}
            <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 400 400">
               <circle cx="200" cy="200" r="150" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-brand-blue" />
               <line x1="200" y1="50" x2="200" y2="350" stroke="currentColor" strokeWidth="0.5" className="text-brand-blue" />
               <line x1="50" y1="200" x2="350" y2="200" stroke="currentColor" strokeWidth="0.5" className="text-brand-blue" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

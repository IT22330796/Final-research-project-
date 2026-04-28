'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Send, Shield } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-brand-dark/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h2>
          <p className="text-slate-400">Have questions about our research? We'd love to hear from you</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="glass-card p-8 rounded-3xl">
              <h3 className="text-2xl font-bold text-white mb-8">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center group-hover:bg-brand-blue transition-colors duration-300">
                    <Mail className="w-6 h-6 text-brand-blue group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Email</p>
                    <p className="text-lg font-bold text-white">irisa.org@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500 transition-colors duration-300">
                    <Phone className="w-6 h-6 text-emerald-500 group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Phone</p>
                    <p className="text-lg font-bold text-white">+94 77 134 7788</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-10 rounded-3xl">
            <h3 className="text-2xl font-bold text-white mb-8">Send us a Message</h3>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Your full name"
                  className="w-full px-6 py-4 rounded-xl bg-brand-dark/50 border border-slate-800 text-white placeholder:text-slate-600 focus:border-brand-blue focus:outline-none transition-colors"
                />
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  className="w-full px-6 py-4 rounded-xl bg-brand-dark/50 border border-slate-800 text-white placeholder:text-slate-600 focus:border-brand-blue focus:outline-none transition-colors"
                />
              </div>
              <input
                type="text"
                placeholder="What's this about?"
                className="w-full px-6 py-4 rounded-xl bg-brand-dark/50 border border-slate-800 text-white placeholder:text-slate-600 focus:border-brand-blue focus:outline-none transition-colors"
              />
              <textarea
                rows={4}
                placeholder="Tell us more about your inquiry..."
                className="w-full px-6 py-4 rounded-xl bg-brand-dark/50 border border-slate-800 text-white placeholder:text-slate-600 focus:border-brand-blue focus:outline-none transition-colors resize-none"
              />
              <button className="w-full py-5 rounded-xl bg-transparent border border-slate-700 hover:bg-brand-blue hover:border-brand-blue text-white font-bold flex items-center justify-center gap-3 transition-all duration-300 group">
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="py-20 border-t border-slate-900 bg-brand-dark/80">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-blue flex items-center justify-center">
                <Shield className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Irisa AI</span>
            </div>
            <p className="text-slate-500 max-w-sm leading-relaxed">
              Advancing healthcare through innovative AI solutions for early vision disorder detection. Our research focuses on developing cutting-edge deep learning frameworks for medical imaging.
            </p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              <li><a href="#domain" className="text-slate-500 hover:text-brand-blue transition-colors">Domain</a></li>
              <li><a href="#milestones" className="text-slate-500 hover:text-brand-blue transition-colors">Milestones</a></li>
              <li><a href="#downloads" className="text-slate-500 hover:text-brand-blue transition-colors">Downloads</a></li>
              <li><a href="#about" className="text-slate-500 hover:text-brand-blue transition-colors">About Us</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 text-center">
          <p className="text-slate-600 text-xs">
            © 2025 Irisa AI. All rights reserved. — Early Detection, Lifelong Vision
          </p>
        </div>
      </div>
    </footer>
  );
}

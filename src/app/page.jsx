"use client";

import React, { useEffect, useState } from 'react';
import { Button, Link, Card, Badge, Progress } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { isLoggedIn } from '@/services/authService';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Terminal, 
  Zap, 
  ShieldCheck, 
  Trophy,
  ArrowRight,
  Github,
  Layout,
  Cpu,
  Globe,
  CheckCircle2,
  Users,
  Search,
  ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  const [isAuth, setIsAuth] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsAuth(isLoggedIn());
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 selection:bg-sky-500/30 overflow-x-hidden font-sans">
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-sky-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#020617]/80 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Terminal size={18} className="text-white" />
            </div>
            <span className="font-bold tracking-tight text-xl text-white">
              PLAYGROUND
            </span>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="hidden md:flex items-center gap-6">
              <NavLink href="#features">Features</NavLink>
              <NavLink href="#roadmap">Roadmap</NavLink>
            </div>
            <div className="flex items-center gap-4">
              {isAuth ? (
                <Button 
                  onClick={() => router.push('/problem')}
                  radius="full"
                  className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6"
                >
                  Dashboard
                </Button>
              ) : (
                <>
                  <Link href="/login" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Sign in</Link>
                  <Button 
                    onClick={() => router.push('/register')}
                    radius="full"
                    className="bg-white text-black font-semibold px-6 hover:bg-slate-200"
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="pt-48 pb-32 px-6">
          <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge content="v2.0" color="primary" variant="flat" className="mb-8 font-mono">
                <div className="px-4 py-1 rounded-full border border-sky-500/20 bg-sky-500/5 text-sky-400 text-xs font-semibold tracking-wide flex items-center gap-2">
                  <Zap size={14} /> NOW IN PUBLIC ALPHA
                </div>
              </Badge>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 leading-[1.1]"
            >
              Master your technical <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-500">
                problem solving depth.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg md:text-xl text-slate-400 max-w-3xl mb-12 leading-relaxed"
            >
              Playground is a modern, high-performance platform for engineers to solve complex coding 
              challenges, benchmark their logic, and track their growth in a realistic development environment.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                size="lg"
                onClick={() => router.push(isAuth ? '/problem' : '/register')}
                className="h-14 px-10 bg-sky-500 text-white font-bold text-base hover:shadow-2xl hover:shadow-sky-500/20 transition-all"
                endContent={<ArrowRight size={20} />}
              >
                Start Coding Now
              </Button>
              <Button 
                size="lg"
                variant="bordered"
                className="h-14 px-10 border-white/10 text-white font-semibold text-base hover:bg-white/5"
                startContent={<Github size={20} />}
              >
                Star on GitHub
              </Button>
            </motion.div>

            {/* Product Preview - Realistic Mockup */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mt-24 w-full max-w-5xl mx-auto rounded-2xl border border-white/10 bg-[#0f172a] shadow-2xl overflow-hidden relative group"
            >
              <div className="h-12 border-b border-white/5 bg-[#020617] px-6 flex justify-between items-center px-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-800" />
                  <div className="w-3 h-3 rounded-full bg-slate-800" />
                  <div className="w-3 h-3 rounded-full bg-slate-800" />
                </div>
                <div className="text-xs font-medium text-slate-500 uppercase tracking-widest flex items-center gap-4">
                   <div className="flex items-center gap-2">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                     Production Environment
                   </div>
                </div>
              </div>
              <div className="grid grid-cols-12 h-[500px]">
                <div className="col-span-4 border-r border-white/5 p-8 text-left space-y-6">
                  <h3 className="text-xl font-bold text-white">Reverse Integer</h3>
                  <div className="flex gap-2">
                    <div className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[10px] font-bold uppercase">Medium</div>
                    <div className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-bold uppercase">Algorithm</div>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.
                  </p>
                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Submissions</span>
                      <span className="text-slate-300">14.2k</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Success Rate</span>
                      <span className="text-slate-300">42%</span>
                    </div>
                  </div>
                </div>
                <div className="col-span-8 bg-[#020617] relative p-0 overflow-hidden">
                  <div className="absolute inset-0 p-8 font-mono text-sm">
                    <div className="flex gap-4 mb-4">
                      <span className="text-slate-600">1</span>
                      <span className="text-indigo-400">class</span> <span className="text-sky-400">Solution</span> {'{'}
                    </div>
                    <div className="flex gap-4 mb-4">
                      <span className="text-slate-600">2</span>
                      <span className="pl-6 text-sky-400 font-bold">reverse</span>(x: <span className="text-amber-400">number</span>): <span className="text-amber-400">number</span> {'{'}
                    </div>
                    <div className="flex gap-4 mb-4">
                      <span className="text-slate-600">3</span>
                      <span className="pl-12 text-slate-400 font-medium">const isNegative = x {'<'} 0;</span>
                    </div>
                    <div className="flex gap-4 mb-4">
                      <span className="text-slate-600">4</span>
                      <span className="pl-12 text-slate-400 font-medium">{"const reversed = parseInt(Math.abs(x).toString().split('').reverse().join(''));"}</span>
                    </div>
                    <div className="flex gap-4 mb-4">
                      <span className="text-slate-600">5</span>
                    </div>
                    <div className="flex gap-4 mb-4">
                      <span className="text-slate-600">6</span>
                      <span className="pl-12 text-pink-500">if</span> (reversed {'>'} <span className="text-blue-400">Math.pow</span>(2, 31) - 1) <span className="text-pink-500">return</span> 0;
                    </div>
                  </div>
                  {/* Floating Action Hint */}
                  <div className="absolute bottom-10 right-10 flex items-center gap-4 animate-bounce">
                    <div className="bg-sky-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-xl">
                      RUN CODE
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Value Propositions */}
        <section id="features" className="py-32 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <ValueItem 
                icon={Layout}
                title="Workspace Ergonomics"
                desc="A workspace designed for flow. Collapsible panes, multi-file support, and a high-density testcase manager."
              />
              <ValueItem 
                icon={ShieldCheck}
                title="Isolated Runtime"
                desc="Your code runs in secure, containerized environments. Instant execution with distributed nodes globally."
              />
              <ValueItem 
                icon={Trophy}
                title="Performance Benchmarking"
                desc="Don't just solve problems, optimize them. Get detailed memory and execution speed metrics for every submission."
              />
            </div>
          </div>
        </section>

        {/* Roadmap / Future Section */}
        <section id="roadmap" className="py-32 bg-slate-900/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-20 space-y-4">
              <h2 className="text-4xl font-bold text-white tracking-tight">The Evolution Roadmap.</h2>
              <p className="text-slate-400 max-w-xl">We are building the future of technical interview preparation and engineering skill tracking.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
              <RoadmapItem 
                title="System Design Labs"
                desc="Interactive diagrams and system architecture challenges to test your high-level engineering skills."
                time="Q2 2026"
                progress={20}
                icon={Cpu}
              />
              <RoadmapItem 
                title="Collaborative Mock Interviews"
                desc="Real-time shared editor with video/voice integration for peer-to-peer technical practice."
                time="Q3 2026"
                progress={45}
                icon={Users}
              />
              <RoadmapItem 
                title="Company-Specific Tracks"
                desc="Curated challenge categories based on actual interview patterns from top-tier tech companies."
                time="Active Testing"
                progress={85}
                icon={Search}
              />
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-48 px-6 text-center overflow-hidden relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-sky-500/5 blur-[150px] pointer-events-none" />
          <div className="max-w-4xl mx-auto relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight">
              Ready to take your engineering <br /> skills to the next level?
            </h2>
            <p className="text-slate-400 text-lg mb-12">
              Join 1,500+ engineers already solving challenges in the Playground environment.
            </p>
            <Button 
                size="lg"
                radius="full"
                onClick={() => router.push(isAuth ? '/problem' : '/register')}
                className="h-16 px-16 bg-sky-500 text-white font-bold text-lg hover:shadow-2xl hover:shadow-sky-500/20 transition-all border-none"
              >
                Access Alpha
              </Button>
          </div>
        </section>

        {/* Simple Footer */}
        <footer className="py-20 px-6 border-t border-white/5 bg-[#020617]">
          <div className="max-w-7xl mx-auto flex flex-col md:row justify-between items-center gap-12 text-slate-500">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-2">
                <Terminal size={20} className="text-sky-500" />
                <span className="font-bold tracking-tight text-white mb-0 text-lg">PLAYGROUND</span>
              </div>
              <p className="text-xs">© 2026 Playground Platform Inc. All rights reserved.</p>
            </div>
            
            <div className="flex gap-12 text-xs font-semibold uppercase tracking-widest">
              <Link href="#" className="text-slate-500 hover:text-white transition-colors">Documentation</Link>
              <Link href="#" className="text-slate-500 hover:text-white transition-colors">Security</Link>
              <Link href="#" className="text-slate-500 hover:text-white transition-colors">Privacy</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function NavLink({ href, children }) {
  return (
    <a 
      href={href} 
      className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
    >
      {children}
    </a>
  );
}

function ValueItem({ icon: Icon, title, desc }) {
  return (
    <div className="space-y-6">
      <div className="w-12 h-12 rounded-2xl bg-sky-500/10 flex items-center justify-center text-sky-500 border border-sky-500/10">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-bold text-white tracking-tight">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function RoadmapItem({ title, desc, time, progress, icon: Icon }) {
  return (
    <Card className="bg-white/5 border border-white/5 p-8 hover:border-white/10 transition-all group">
      <div className="flex justify-between items-start mb-8">
        <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-sky-400 group-hover:bg-sky-500/10 transition-all">
          <Icon size={20} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{time}</span>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed mb-6">{desc}</p>
      <div className="space-y-3">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-600">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress size="sm" color="primary" value={progress} className="bg-white/5" />
      </div>
    </Card>
  );
}

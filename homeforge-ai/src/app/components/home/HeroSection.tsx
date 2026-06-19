"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowRight, Cuboid, Sparkles } from "lucide-react";

const HouseScene = dynamic(() => import("@/components/three/HouseScene"), {
  ssr: false,
});

export default function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden grid-bg px-6 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.2),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(250,204,21,0.12),transparent_30%)]" />

      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between rounded-2xl glass px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-cyan-400/15 text-cyan-300">
            <Cuboid size={22} />
          </div>
          <span className="text-lg font-semibold tracking-wide">HomeForge AI</span>
        </div>

        <div className="hidden gap-8 text-sm text-white/70 md:flex">
          <a href="#modules" className="hover:text-cyan-300">Modules</a>
          <a href="#workflow" className="hover:text-cyan-300">Workflow</a>
          <a href="#ai" className="hover:text-cyan-300">AI Assistant</a>
          <a href="#start" className="hover:text-cyan-300">Start</a>
        </div>
      </nav>

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 pt-20 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm text-cyan-200">
            <Sparkles size={16} />
            3D Digital House Configurator
          </div>

          <h1 className="glow-text max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-7xl">
            Build your dream home before construction begins.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
            Design floor plans, customize interiors, explore the exterior, walk through
            the house in 3D, estimate costs, and export your final concept for builders.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <a
              href="#modules"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-cyan-300 px-7 py-4 font-semibold text-slate-950 transition hover:scale-105 hover:bg-cyan-200"
            >
              Explore Platform
              <ArrowRight className="transition group-hover:translate-x-1" size={18} />
            </a>

            <a
              href="#workflow"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-7 py-4 font-semibold text-white/80 transition hover:bg-white/10"
            >
              See Workflow
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-[2rem] bg-cyan-300/20 blur-3xl" />
          <div className="relative rounded-[2rem] glass p-4 shadow-2xl">
            <HouseScene />
            <div className="grid gap-3 border-t border-white/10 p-4 text-sm text-white/70 sm:grid-cols-3">
              <div>
                <p className="text-white">600 m²</p>
                <p>Land size</p>
              </div>
              <div>
                <p className="text-white">4 Bed / 3 Bath</p>
                <p>AI layout</p>
              </div>
              <div>
                <p className="text-white">$520k est.</p>
                <p>Cost preview</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
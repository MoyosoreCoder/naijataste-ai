"use client"

import Link from "next/link"
import { motion, Variants } from "framer-motion"
import {
  ArrowRight,
  Sparkles,
  Brain,
  MessageSquareText,
  UtensilsCrossed,
  Star,
} from "lucide-react"

// ─────────────────────────────────────────────────────────────────────────────
// Animation
// ─────────────────────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
}

const stagger: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    title: "AI Food Persona",
    desc: "Create a Nigerian food personality that matches your taste, spice level, and review style.",
    icon: Brain,
  },
  {
    title: "Review Simulation",
    desc: "See exactly how you would rate and describe any restaurant using AI.",
    icon: MessageSquareText,
  },
  {
    title: "Smart Recommendations",
    desc: "Get restaurant suggestions ranked by your actual preferences and vibe.",
    icon: UtensilsCrossed,
  },
]

const SAMPLE_REVIEWS = [
  {
    name: "Pepper’s Grill",
    text: "The jollof sharp, but the turkey dry small. Still worth another try sha.",
    rating: "4.2",
  },
  {
    name: "Mama Nkechi Kitchen",
    text: "This egusi no dey joke. Correct swallow experience.",
    rating: "4.8",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden font-poppins">
      {/* Background */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 overflow-hidden"
      >
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#1D9E75]/10 blur-[140px] rounded-full" />

        <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] bg-[#1D9E75]/5 blur-[120px] rounded-full" />
      </div>

      {/* NAV */}
      <header className="relative z-10 border-b border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#1D9E75]/15 border border-[#1D9E75]/25 flex items-center justify-center">
              🍽️
            </div>

            <div>
              <p className="font-bold tracking-tight">NaijaTaste AI</p>
              <p className="text-[11px] text-white/35">
                Nigerian Food Intelligence
              </p>
            </div>
          </div>

          <Link href="/persona">
            <button className="h-11 px-5 rounded-xl bg-[#1D9E75] hover:bg-[#22b884] transition-colors text-sm font-semibold">
              Get Started
            </button>
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 px-5 pt-16 pb-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          {/* LEFT */}
          <motion.div
            initial="hidden"
            animate="show"
            className="max-w-xl"
          >
            {/* badge */}
            <motion.div variants={fadeUp} custom={0}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#1D9E75]/25 bg-[#1D9E75]/10 mb-6">
                <Sparkles size={14} className="text-[#1D9E75]" />
                <span className="text-[11px] tracking-[0.16em] uppercase font-bold text-[#1D9E75]">
                  AI Food Reviewer
                </span>
              </div>
            </motion.div>

            {/* title */}
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="text-[46px] sm:text-[62px] leading-[0.95] font-extrabold tracking-[-0.04em] mb-6"
            >
              Nigeria’s
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#1D9E75] to-[#72e0bc]">
                AI food critic
              </span>
            </motion.h1>

            {/* desc */}
            <motion.p
              variants={fadeUp}
              custom={2}
              className="text-white/45 text-[16px] sm:text-[17px] leading-relaxed mb-8"
            >
              Build your food persona, simulate restaurant reviews in your own
              voice, and discover places you would actually enjoy eating at.
            </motion.p>

            {/* CTA */}
            <motion.div
              variants={fadeUp}
              custom={3}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link href="/persona">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto h-14 px-7 rounded-2xl bg-[#1D9E75]
                  hover:bg-[#22b884] transition-colors font-bold text-sm
                  shadow-[0_0_40px_#1D9E7530] flex items-center justify-center gap-2"
                >
                  Build your persona
                  <ArrowRight size={16} />
                </motion.button>
              </Link>

              <Link href="/review">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto h-14 px-7 rounded-2xl bg-white/[0.05]
                  hover:bg-white/[0.08] border border-white/[0.08]
                  hover:border-white/15 transition-all text-sm font-semibold text-white/75"
                >
                  Try review simulator
                </motion.button>
              </Link>
            </motion.div>

            {/* mini stats */}
            <motion.div
              variants={fadeUp}
              custom={4}
              className="grid grid-cols-3 gap-4 mt-10"
            >
              {[
                ["AI Powered", "LLM"],
                ["Naija Vibes", "100%"],
                ["Review Styles", "∞"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="bg-white/[0.03] border border-white/[0.06]
                  rounded-2xl p-4"
                >
                  <p className="text-[#1D9E75] text-2xl font-extrabold">
                    {value}
                  </p>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-white/30 mt-1">
                    {label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* RIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            {/* floating card */}
            <div
              className="relative bg-white/[0.04] border border-white/[0.08]
              rounded-[32px] p-6 backdrop-blur-xl
              shadow-[0_0_60px_#1D9E7510]"
            >
              {/* top */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.14em] text-[#1D9E75] font-bold">
                    Sample AI Review
                  </p>

                  <h3 className="text-xl font-bold mt-2">
                    Buka Hut Lagos
                  </h3>
                </div>

                <div
                  className="w-16 h-16 rounded-2xl bg-[#1D9E75]/12
                  border border-[#1D9E75]/25 flex flex-col items-center justify-center"
                >
                  <span className="text-2xl font-extrabold text-[#1D9E75]">
                    4.6
                  </span>
                  <span className="text-[10px] text-[#1D9E75]/70">
                    rating
                  </span>
                </div>
              </div>

              {/* review */}
              <div
                className="rounded-2xl bg-white/[0.03]
                border border-white/[0.05] p-5 mb-5"
              >
                <p className="text-[15px] leading-[1.9] text-white/75">
                  “Omo this jollof rice balance well. Pepper dey, smoky flavour
                  dey, and the chicken soft. Portion size fit two people sef.”
                </p>
              </div>

              {/* tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  "🌶️ Pepper Lover",
                  "🇳🇬 Naija Mode",
                  "🔥 Smoky Jollof",
                ].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full text-[11px]
                    bg-[#1D9E75]/10 border border-[#1D9E75]/20
                    text-[#1D9E75] font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* recommendations */}
              <div className="space-y-3">
                {SAMPLE_REVIEWS.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start justify-between gap-4
                    bg-white/[0.03] border border-white/[0.05]
                    rounded-2xl p-4"
                  >
                    <div>
                      <p className="font-semibold text-white/90">
                        {item.name}
                      </p>

                      <p className="text-sm text-white/40 mt-1 leading-relaxed">
                        {item.text}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-[#1D9E75] shrink-0">
                      <Star size={14} fill="currentColor" />
                      <span className="font-bold text-sm">
                        {item.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* floating glow */}
            <div
              className="absolute -z-10 inset-0 bg-[#1D9E75]/10
              blur-[100px] rounded-full scale-90"
            />
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="relative z-10 px-5 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <p
              className="text-[#1D9E75] uppercase tracking-[0.18em]
              text-[11px] font-bold mb-3"
            >
              Features
            </p>

            <h2 className="text-4xl font-extrabold tracking-tight">
              Everything built around
              <span className="text-[#1D9E75]"> Nigerian food culture</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {FEATURES.map((feature, i) => {
              const Icon = feature.icon

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white/[0.04] border border-white/[0.07]
                  rounded-3xl p-6 hover:border-[#1D9E75]/30
                  hover:bg-white/[0.06] transition-all duration-300"
                >
                  <div
                    className="w-14 h-14 rounded-2xl bg-[#1D9E75]/12
                    border border-[#1D9E75]/20 flex items-center justify-center mb-5"
                  >
                    <Icon className="text-[#1D9E75]" size={26} />
                  </div>

                  <h3 className="text-xl font-bold mb-3">
                    {feature.title}
                  </h3>

                  <p className="text-white/45 leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-5 pb-24">
        <div
          className="max-w-5xl mx-auto rounded-[36px]
          border border-[#1D9E75]/20 bg-[#1D9E75]/8
          px-6 sm:px-10 py-14 text-center"
        >
          <h2 className="text-4xl font-extrabold tracking-tight mb-4">
            Ready to discover
            <span className="text-[#1D9E75]"> your food personality?</span>
          </h2>

          <p className="max-w-2xl mx-auto text-white/45 leading-relaxed mb-8">
            Create your AI food persona in minutes and start getting restaurant
            reviews and recommendations tailored to your exact taste.
          </p>

          <Link href="/persona">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="h-14 px-8 rounded-2xl bg-[#1D9E75]
              hover:bg-[#22b884] transition-colors
              text-sm font-bold shadow-[0_0_40px_#1D9E7530]"
            >
              Start now →
            </motion.button>
          </Link>
        </div>
      </section>
    </main>
  )
}
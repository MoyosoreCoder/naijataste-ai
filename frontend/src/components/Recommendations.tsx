"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Persona, Recommendation } from "@/types"
import { getRecommendations } from "@/lib/api"

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
}

const cardVariant = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] },
  }),
}

// ─── Category emoji map ───────────────────────────────────────────────────────

const categoryEmoji: Record<string, string> = {
  "local nigerian": "🍲",
  "street food": "🍢",
  "modern nigerian": "🍽️",
  "buka": "🥘",
  "fine dining": "✨",
  "nigerian fine dining": "✨",
  "fast food": "🍔",
  "seafood": "🐟",
  "suya spot": "🔥",
}

function getCategoryEmoji(category: string) {
  return categoryEmoji[category.toLowerCase()] ?? "🍴"
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function SkeletonCard({ delay }: { delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
      className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 space-y-3"
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="h-3 w-16 bg-white/[0.06] rounded-full animate-pulse" />
          <div className="h-5 w-40 bg-white/[0.08] rounded-full animate-pulse" />
        </div>
        <div className="w-12 h-12 bg-white/[0.06] rounded-xl animate-pulse" />
      </div>
      <div className="space-y-1.5">
        <div className="h-3 w-full bg-white/[0.05] rounded-full animate-pulse" />
        <div className="h-3 w-4/5 bg-white/[0.05] rounded-full animate-pulse" />
      </div>
      <div className="flex items-center justify-between pt-1">
        <div className="h-3 w-20 bg-white/[0.06] rounded-full animate-pulse" />
        <div className="h-2 w-24 bg-white/[0.06] rounded-full animate-pulse" />
      </div>
    </motion.div>
  )
}

// ─── Recommendation card ──────────────────────────────────────────────────────

function RecCard({ rec, index }: { rec: Recommendation; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      custom={index}
      variants={cardVariant}
      initial="hidden"
      animate="show"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className={`relative bg-white/[0.04] border rounded-2xl p-5 transition-all duration-300
        cursor-default overflow-hidden
        ${hovered
          ? "border-[#1D9E75]/40 bg-white/[0.06] shadow-[0_0_40px_#1D9E7512]"
          : "border-white/[0.07]"
        }`}
    >
      {/* Rank badge */}
      <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-white/[0.05]
                      border border-white/[0.08] flex items-center justify-center">
        <span className="text-[10px] font-bold text-white/30 font-poppins">
          {index + 1}
        </span>
      </div>

      {/* Top row */}
      <div className="flex items-start gap-3 mb-3 pr-8">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl
                         shrink-0 transition-all duration-300
                         ${hovered
            ? "bg-[#1D9E75]/20 border border-[#1D9E75]/30"
            : "bg-white/[0.05] border border-white/[0.08]"
          }`}>
          {getCategoryEmoji(rec.category)}
        </div>
        <div className="min-w-0">
          <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-white/30
                        font-poppins mb-1">
            {rec.category}
          </p>
          <p className="text-[15px] font-semibold text-white/90 leading-tight font-poppins
                        truncate">
            {rec.name}
          </p>
        </div>
      </div>

      {/* Reason */}
      <p className="text-[13px] text-white/50 leading-relaxed mb-4 line-clamp-2">
        {rec.reason}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Predicted rating */}
        <div className="flex items-center gap-1.5">
          <span className="text-[#1D9E75] text-sm">★</span>
          <span className="text-sm font-bold text-white/80 font-poppins">
            {rec.predicted_rating.toFixed(1)}
          </span>
          <span className="text-[11px] text-white/25">predicted</span>
        </div>

        {/* Match bar */}
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 bg-white/[0.07] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${rec.match_pct}%` }}
              transition={{ duration: 0.8, delay: 0.3 + index * 0.07, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#1D9E75] to-[#5DCAA5] rounded-full"
            />
          </div>
          <span className="text-[11px] font-bold text-[#1D9E75] font-poppins w-8">
            {rec.match_pct}%
          </span>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Loading dots ─────────────────────────────────────────────────────────────

function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-[#1D9E75]"
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Recommendations() {
  const router = useRouter()
  const [persona, setPersona] = useState<Persona | null>(null)
  const [recs, setRecs] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMsg, setLoadingMsg] = useState("")
  const [fetched, setFetched] = useState(false)
  const [error, setError] = useState("")

  const LOADING_MSGS = [
    "Analysing your taste profile…",
    "Scanning Nigerian food spots…",
    "Matching your vibe to restaurants…",
    "Ranking your top picks…",
  ]

  const vibeLabel: Record<string, string> = {
    pepper_lover: "Pepper Lover 🌶️",
    local_chop: "Local Chop 🍲",
    harsh_rater: "Harsh Rater 🧐",
    owambe_lover: "Owambe Lover 🎉",
  }

  useEffect(() => {
    const stored = localStorage.getItem("naijataste_persona")
    if (stored) setPersona(JSON.parse(stored))
  }, [])

  useEffect(() => {
    let i = 0
    if (!loading) return
    setLoadingMsg(LOADING_MSGS[0])
    const interval = setInterval(() => {
      i = (i + 1) % LOADING_MSGS.length
      setLoadingMsg(LOADING_MSGS[i])
    }, 1800)
    return () => clearInterval(interval)
  }, [loading])

  async function fetchRecs() {
    if (!persona) return
    setLoading(true)
    setError("")
    setRecs([])
    try {
      const data = await getRecommendations(persona)
      setRecs(data.recommendations ?? [])
      setFetched(true)
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (persona && !fetched) fetchRecs()
  }, [persona])

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white px-4 py-12">

      {/* Ambient glow */}
      <div aria-hidden className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2
        w-[700px] h-[400px] bg-[#1D9E75]/8 blur-[130px] rounded-full" />

      <div className="max-w-[580px] mx-auto relative">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <motion.div
          className="mb-10"
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
        >
          <motion.p
            variants={fadeUp} custom={0}
            initial="hidden"
            animate="show"
            className="flex items-center gap-2 text-[11px] font-bold tracking-[0.18em]
                       uppercase text-[#1D9E75] font-poppins mb-3"
          >
            <span className="inline-block w-5 h-px bg-[#1D9E75]" />
            NaijaTaste AI · Recommendations
          </motion.p>

          <motion.h1
            variants={fadeUp} custom={1}
            initial="hidden"
            animate="show"
            className="font-poppins text-[36px] leading-[1.1] font-extrabold mb-3 tracking-tight"
          >
            Places{" "}
            <span className="text-transparent bg-clip-text
                             bg-gradient-to-r from-[#1D9E75] to-[#5DCAA5]">
              {persona?.name ?? "you"}
            </span>
            <br />would actually love
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            initial="hidden"
            animate="show"
            className="text-sm text-white/40 leading-relaxed">
            Ranked by how well they match your taste profile — not just popularity.
          </motion.p>
        </motion.div>

        {/* ── Progress ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-2 mb-8"
        >
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-[3px] rounded-full transition-all duration-500 ${i === 2 ? "w-8 bg-[#1D9E75]" : "w-5 bg-white/10"
              }`} />
          ))}
          <span className="text-[11px] text-white/30 ml-1 tracking-wide">Step 3 of 3</span>
        </motion.div>

        {/* ── Persona pill ──────────────────────────────────────────────── */}
        {persona && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="flex items-center justify-between bg-white/[0.04]
                       border border-white/[0.08] rounded-2xl px-4 py-3 mb-8"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#1D9E75]/15 border border-[#1D9E75]/25
                              flex items-center justify-center text-base font-bold text-[#1D9E75]">
                {persona.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-white/90">{persona.name}</p>
                <p className="text-xs text-white/35">
                  {vibeLabel[persona.vibe]} · {persona.favoriteFoods?.slice(0, 2).join(", ")}
                </p>
              </div>
            </div>
            <button
              onClick={fetchRecs}
              disabled={loading}
              className="text-[11px] text-white/30 hover:text-[#1D9E75]
                         disabled:opacity-40 transition-colors tracking-wide"
            >
              Refresh ↺
            </button>
          </motion.div>
        )}

        {/* ── Loading state ─────────────────────────────────────────────── */}
        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              {/* Loading header */}
              <div className="flex items-center gap-3 mb-6">
                <LoadingDots />
                <span className="text-sm text-white/40">{loadingMsg}</span>
              </div>
              {/* Skeleton cards */}
              <div className="space-y-3">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <SkeletonCard key={i} delay={i * 0.05} />
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Error state ──────────────────────────────────────────────── */}
          {!loading && error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <p className="text-4xl mb-4">😬</p>
              <p className="text-sm text-white/40 mb-6">{error}</p>
              <button
                onClick={fetchRecs}
                className="px-6 py-3 bg-[#1D9E75] hover:bg-[#22b884] text-white
                           font-poppins font-bold text-sm rounded-xl transition-colors"
              >
                Try again
              </button>
            </motion.div>
          )}

          {/* ── Results ──────────────────────────────────────────────────── */}
          {!loading && recs.length > 0 && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              {/* Results header */}
              <div className="flex items-center justify-between mb-5">
                <p className="text-[11px] font-bold tracking-[0.1em] uppercase
                              text-white/30 font-poppins">
                  {recs.length} places matched
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] animate-pulse" />
                  <span className="text-[11px] text-white/30">AI ranked</span>
                </div>
              </div>

              {/* Cards */}
              <div className="space-y-3">
                {recs.map((rec, i) => (
                  <RecCard key={`${rec.name}-${i}`} rec={rec} index={i} />
                ))}
              </div>

              {/* Bottom actions */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex gap-3 mt-8"
              >
                <button
                  onClick={() => router.push("/review")}
                  className="flex-1 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08]
                             hover:border-white/15 text-white/60 hover:text-white font-poppins
                             font-semibold text-sm py-3.5 rounded-2xl transition-all duration-200"
                >
                  ← Simulate a review
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={fetchRecs}
                  className="flex-1 bg-[#1D9E75] hover:bg-[#22b884] text-white font-poppins
                             font-bold text-sm py-3.5 rounded-2xl transition-colors duration-200
                             shadow-[0_0_30px_#1D9E7520]"
                >
                  Regenerate ↺
                </motion.button>
              </motion.div>

            </motion.div>
          )}

          {/* ── No persona fallback ───────────────────────────────────────── */}
          {!loading && !persona && (
            <motion.div
              key="no-persona"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <p className="text-4xl mb-4">🍽️</p>
              <p className="text-sm text-white/40 mb-6">
                Build your food persona first to get recommendations.
              </p>
              <button
                onClick={() => router.push("/persona")}
                className="px-6 py-3 bg-[#1D9E75] hover:bg-[#22b884] text-white
                           font-poppins font-bold text-sm rounded-xl transition-colors"
              >
                Build persona →
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
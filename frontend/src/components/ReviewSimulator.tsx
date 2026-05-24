"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence, Variants } from "framer-motion"
import {
  Sparkles,
  ArrowRight,
  Flame,
  MapPin,
  User2,
} from "lucide-react"

import { Persona, Review } from "@/types"
import { generateReview } from "@/lib/api"

// ─────────────────────────────────────────────────────────────
// Animations
// ─────────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

const glass =
  "backdrop-blur-2xl bg-white/[0.03] border border-white/[0.08]"

const glow =
  "shadow-[0_0_80px_rgba(16,185,129,0.12)]"

// ─────────────────────────────────────────────────────────────
// Stars
// ─────────────────────────────────────────────────────────────

function Stars({
  rating,
  animate = false,
}: {
  rating: number
  animate?: boolean
}) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.floor(rating)

        return (
          <motion.span
            key={i}
            initial={
              animate
                ? { opacity: 0, scale: 0.3, rotate: -20 }
                : false
            }
            animate={
              animate
                ? { opacity: 1, scale: 1, rotate: 0 }
                : false
            }
            transition={{
              delay: 0.4 + i * 0.08,
              duration: 0.4,
              type: "spring",
              stiffness: 300,
            }}
            className={`text-2xl ${
              filled
                ? "text-emerald-400"
                : "text-white/10"
            }`}
          >
            ★
          </motion.span>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Typing
// ─────────────────────────────────────────────────────────────

function TypingText({
  text,
  onDone,
}: {
  text: string
  onDone?: () => void
}) {
  const [displayed, setDisplayed] = useState("")
  const [cursor, setCursor] = useState(true)

  const idx = useRef(0)

  useEffect(() => {
    idx.current = 0
    setDisplayed("")

    const interval = setInterval(() => {
      if (idx.current < text.length) {
        setDisplayed(text.slice(0, idx.current + 1))
        idx.current++
      } else {
        clearInterval(interval)

        setTimeout(() => {
          setCursor(false)
          onDone?.()
        }, 500)
      }
    }, 15)

    return () => clearInterval(interval)
  }, [text])

  useEffect(() => {
    if (!cursor) return

    const blink = setInterval(() => {
      setCursor((c) => !c)
    }, 500)

    return () => clearInterval(blink)
  }, [cursor])

  return (
    <>
      {displayed}
      {cursor && (
        <span className="ml-1 inline-block h-[1em] w-[2px] animate-pulse bg-emerald-400 align-middle" />
      )}
    </>
  )
}

// ─────────────────────────────────────────────────────────────
// Loading Dots
// ─────────────────────────────────────────────────────────────

function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-emerald-400"
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────────────────────

export default function ReviewSimulator() {
  const router = useRouter()

  const [persona, setPersona] =
    useState<Persona | null>(null)

  const [restaurantName, setRestaurantName] =
    useState("")

  const [restaurantDesc, setRestaurantDesc] =
    useState("")

  const [review, setReview] =
    useState<Review | null>(null)

  const [loading, setLoading] = useState(false)

  const [loadingMsg, setLoadingMsg] =
    useState("")

  const [typingDone, setTypingDone] =
    useState(false)

  const [errors, setErrors] = useState<{
    name?: string
    desc?: string
  }>({})

  const resultRef = useRef<HTMLDivElement>(null)

  const LOADING_MSGS = [
    "AI is tasting the food...",
    "Analyzing your food personality...",
    "Generating Naija-style review...",
    "Almost done...",
  ]

  useEffect(() => {
    const stored = localStorage.getItem(
      "naijataste_persona"
    )

    if (stored) {
      setPersona(JSON.parse(stored))
    }
  }, [])

  useEffect(() => {
    if (!loading) return

    let i = 0

    setLoadingMsg(LOADING_MSGS[0])

    const interval = setInterval(() => {
      i = (i + 1) % LOADING_MSGS.length
      setLoadingMsg(LOADING_MSGS[i])
    }, 1800)

    return () => clearInterval(interval)
  }, [loading])

  function validate() {
    const e: {
      name?: string
      desc?: string
    } = {}

    if (!restaurantName.trim()) {
      e.name = "Enter restaurant name"
    }

    if (!restaurantDesc.trim()) {
      e.desc = "Add short description"
    }

    setErrors(e)

    return Object.keys(e).length === 0
  }

  async function handleGenerate() {
    if (!validate()) return

    setLoading(true)
    setReview(null)
    setTypingDone(false)

    try {
      const result = await generateReview(
        persona,
        restaurantName,
        restaurantDesc
      )

      setReview(result)

      setTimeout(() => {
        resultRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }, 100)
    } finally {
      setLoading(false)
    }
  }

  const vibeLabel: Record<string, string> = {
    pepper_lover: "Pepper Lover 🌶️",
    local_chop: "Local Chop 🍲",
    harsh_rater: "Harsh Rater 🧐",
    owambe_lover: "Owambe Lover 🎉",
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] text-white">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(29,158,117,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(93,202,165,0.12),transparent_25%)]" />

      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.4, 0.55, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-emerald-500/20 blur-[140px]"
      />

      {/* Floating Food Emojis */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{
          duration: 6,
          repeat: Infinity,
        }}
        className="absolute left-[8%] top-[18%] text-5xl opacity-[0.08]"
      >
        🍜
      </motion.div>

      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
        }}
        className="absolute right-[10%] top-[25%] text-6xl opacity-[0.06]"
      >
        🌶️
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 md:px-6 lg:py-14">

        <div className="grid gap-10 lg:grid-cols-[1fr_560px]">

          {/* LEFT SIDE */}
          <div className="flex flex-col justify-center">

            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={0}
              className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2"
            >
              <Sparkles className="h-4 w-4 text-emerald-300" />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                NaijaTaste AI Review
              </span>
            </motion.div>

            <motion.h1
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={1}
              className="max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl "
            >
              Let your{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-500 to-teal-300 bg-clip-text text-transparent">
                AI food persona
              </span>{" "}
              review restaurants like a real Naija foodie.
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={2}
              className="mt-6 max-w-xl text-base leading-8 text-white/55"
            >
              Enter a restaurant and watch your AI
              personality generate authentic food
              reviews based on your taste, vibe,
              spice tolerance, and Naija energy.
            </motion.p>

            {/* Persona Card */}
            {persona && (
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`relative mt-10 overflow-hidden rounded-[32px] p-6 ${glass} ${glow}`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />

                <div className="relative flex items-start justify-between">
                  <div>
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-emerald-200">
                      <Flame className="h-3.5 w-3.5" />
                      Active Persona
                    </div>

                    <h3 className="text-3xl font-bold">
                      {persona.name}
                    </h3>

                    <p className="mt-2 text-sm text-white/45">
                      {vibeLabel[persona.vibe]} ·{" "}
                      {persona.location}
                    </p>
                  </div>

                  <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-500/10 text-3xl">
                    🍛
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {persona.favoriteFoods.map((food) => (
                    <span
                      key={food}
                      className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/60"
                    >
                      {food}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>

          {/* RIGHT SIDE */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${glass} rounded-[32px] p-5 sm:p-7 ${glow}`}
          >

            {/* Header */}
            <div className="mb-8 flex items-center justify-between">

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  Step 2 of 3
                </p>

                <h2 className="mt-2 text-2xl font-bold">
                  Generate AI Review
                </h2>
              </div>

              <div className="flex gap-2">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className={`h-2 rounded-full ${
                      n === 2
                        ? "w-10 bg-emerald-400"
                        : "w-2 bg-white/15"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Inputs */}
            <div className="space-y-5">

              <Field
                label="Restaurant Name"
                icon={<User2 size={16} />}
                error={errors.name}
              >
                <input
                  value={restaurantName}
                  onChange={(e) =>
                    setRestaurantName(e.target.value)
                  }
                  placeholder="e.g. Buka Hut Lagos"
                  className={inputCls(!!errors.name)}
                />
              </Field>

              <Field
                label="Restaurant Description"
                icon={<MapPin size={16} />}
                error={errors.desc}
              >
                <textarea
                  rows={4}
                  value={restaurantDesc}
                  onChange={(e) =>
                    setRestaurantDesc(e.target.value)
                  }
                  placeholder="Describe the food, vibe, price, location..."
                  className={`${inputCls(
                    !!errors.desc
                  )} resize-none py-4`}
                />
              </Field>

              {/* Naija mode */}
              {persona?.naijaMode && (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-xl">
                    🇳🇬
                  </div>

                  <div>
                    <h4 className="font-semibold">
                      Naija Mode Enabled
                    </h4>

                    <p className="text-xs text-white/45">
                      AI reviews will include pidgin,
                      slang & local vibes.
                    </p>
                  </div>
                </div>
              )}

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.015 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGenerate}
                disabled={loading}
                className="group mt-3 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-4 font-semibold text-black shadow-2xl shadow-emerald-500/30"
              >
                {loading ? (
                  <>
                    <LoadingDots />
                    {loadingMsg}
                  </>
                ) : (
                  <>
                    Generate Review

                    <motion.div
                      animate={{ x: [0, 4, 0] }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                      }}
                    >
                      <ArrowRight size={18} />
                    </motion.div>
                  </>
                )}
              </motion.button>
            </div>

            {/* Result */}
            <AnimatePresence mode="wait">
              {review && (
                <motion.div
                  ref={resultRef}
                  initial={{
                    opacity: 0,
                    y: 30,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  className={`relative mt-8 overflow-hidden rounded-[32px] p-6 ${glass} ${glow}`}
                >

                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />

                  <div className="relative">

                    {/* Header */}
                    <div className="mb-6 flex items-start justify-between">

                      <div>
                        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-white/35">
                          Simulated Review
                        </p>

                        <Stars
                          rating={review.rating}
                          animate
                        />
                      </div>

                      {/* Score */}
                      <div className="relative flex h-20 w-20 items-center justify-center">

                        <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-2xl" />

                        <div className="relative text-center">
                          <div className="text-3xl font-black text-emerald-300">
                            {review.rating.toFixed(1)}
                          </div>

                          <div className="text-[10px] text-emerald-200/60">
                            SCORE
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Review */}
                    <div className="rounded-3xl bg-white/[0.03] p-5">
                      <p className="text-[15px] leading-8 text-white/75">
                        <TypingText
                          text={review.review}
                          onDone={() =>
                            setTypingDone(true)
                          }
                        />
                      </p>
                    </div>

                    {/* Tags */}
                    {typingDone && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 10,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        className="mt-5 flex flex-wrap gap-2"
                      >
                        <Tag>
                          👤 {review.persona_name}
                        </Tag>

                        {review.naija_mode && (
                          <Tag>🇳🇬 Naija Mode</Tag>
                        )}

                        <Tag>
                          {vibeLabel[
                            persona?.vibe ??
                              "local_chop"
                          ]}
                        </Tag>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>

        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────

function inputCls(hasError: boolean) {
  return `
    h-12 w-full rounded-2xl border px-4 text-sm text-white
    bg-white/[0.04] outline-none transition-all duration-300
    placeholder:text-white/25
    focus:border-emerald-400/50
    focus:bg-white/[0.06]
    focus:ring-4 focus:ring-emerald-500/10
    ${
      hasError
        ? "border-red-500/50"
        : "border-white/[0.08] hover:border-white/15"
    }
  `
}

function Field({
  label,
  children,
  error,
  icon,
}: {
  label: string
  children: React.ReactNode
  error?: string
  icon?: React.ReactNode
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/40">
        {icon}
        {label}
      </label>

      {children}

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{
              opacity: 0,
              y: -4,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
            }}
            className="mt-2 text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function Tag({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200">
      {children}
    </span>
  )
}
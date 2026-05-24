"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, ArrowRight, Check, MapPin, User2, Flame } from "lucide-react"
import { Persona, FoodVibe } from "@/types"

// ─────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────

const FOOD_OPTIONS = [
  { label: "Jollof Rice", emoji: "🍚" },
  { label: "Suya", emoji: "🍢" },
  { label: "Pepper Soup", emoji: "🍲" },
  { label: "Egusi Soup", emoji: "🥘" },
  { label: "Asun", emoji: "🥩" },
  { label: "Amala & Ewedu", emoji: "🫙" },
  { label: "Pounded Yam", emoji: "🫓" },
  { label: "Shawarma", emoji: "🌯" },
  { label: "Small Chops", emoji: "🍤" },
  { label: "Moi Moi", emoji: "🫔" },
  { label: "Fried Rice", emoji: "🍳" },
  { label: "Boli & Fish", emoji: "🐟" },

]

const VIBES: {
  value: FoodVibe
  label: string
  desc: string
  emoji: string
}[] = [
    {
      value: "pepper_lover",
      label: "Pepper Lover",
      desc: "Extra spice. Extra enjoyment.",
      emoji: "🌶️",
    },
    {
      value: "local_chop",
      label: "Local Chop",
      desc: "Authentic Naija food hunter.",
      emoji: "🍲",
    },
    {
      value: "harsh_rater",
      label: "Harsh Rater",
      desc: "Standards high. Ratings low.",
      emoji: "🧐",
    },
    {
      value: "owambe_lover",
      label: "Owambe Lover",
      desc: "Party food & premium vibes.",
      emoji: "🎉",
    },
  ]

const AGE_RANGES = ["18 – 24", "25 – 34", "35 – 44", "45+"]

// ─────────────────────────────────────────────────────────────
// Animation
// ─────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: i * 0.06,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
}

const glass =
  "backdrop-blur-2xl bg-white/[0.03] border border-white/[0.08]"

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export default function PersonaForm() {
  const router = useRouter()

  const [form, setForm] = useState<Persona>({
    name: "",
    ageRange: "",
    location: "",
    favoriteFoods: [],
    vibe: "local_chop",
    naijaMode: true,
  })

  const [errors, setErrors] = useState<
    Partial<Record<keyof Persona, string>>
  >({})

  const completion = useMemo(() => {
    let total = 0

    if (form.name) total += 20
    if (form.ageRange) total += 20
    if (form.location) total += 20
    if (form.favoriteFoods.length > 0) total += 20
    if (form.vibe) total += 20

    return total
  }, [form])

  function toggleFood(food: string) {
    setForm((prev) => ({
      ...prev,
      favoriteFoods: prev.favoriteFoods.includes(food)
        ? prev.favoriteFoods.filter((f) => f !== food)
        : [...prev.favoriteFoods, food],
    }))
  }

  function validate() {
    const e: Partial<Record<keyof Persona, string>> = {}

    if (!form.name.trim()) e.name = "Enter your name"
    if (!form.ageRange) e.ageRange = "Select age range"
    if (!form.location.trim()) e.location = "Enter location"
    if (form.favoriteFoods.length === 0)
      e.favoriteFoods = "Select at least one food"

    setErrors(e)

    return Object.keys(e).length === 0
  }

  function handleSave() {
    if (!validate()) return

    localStorage.setItem(
      "naijataste_persona",
      JSON.stringify(form)
    )

    router.push("/review")
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

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 md:px-6 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          {/* LEFT CONTENT */}
          <div>
            {/* Badge */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={0}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2"
            >
              <Sparkles className="h-4 w-4 text-emerald-300" />
              <span className="text-xs font-semibold tracking-[0.18em] text-emerald-200 uppercase">
                NaijaTaste AI Persona
              </span>
            </motion.div>

            {/* Hero */}
            <motion.h1
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={1}
              className="max-w-2xl text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl"
            >
              Create your{" "}
              <span className="bg-gradient-to-r from-emerald-300 via-emerald-500 to-teal-300 bg-clip-text text-transparent">
                food identity
              </span>{" "}
              before the AI reviews like you.
            </motion.h1>

            <motion.p
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={2}
              className="mt-5 max-w-xl text-base leading-7 text-white/55"
            >
              Your taste profile shapes how the AI thinks,
              rates restaurants, reacts to pepper levels,
              and delivers authentic Naija-style reviews.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={fadeUp}
              custom={3}
              className="mt-8 flex flex-wrap gap-4"
            >
              {[
                ["12+", "Naija dishes"],
                ["4", "Reviewer vibes"],
                ["AI", "Personalized reviews"],
              ].map(([num, label]) => (
                <div
                  key={label}
                  className={`${glass} rounded-2xl px-5 py-4`}
                >
                  <h3 className="text-2xl font-bold">{num}</h3>
                  <p className="mt-1 text-sm text-white/45">
                    {label}
                  </p>
                </div>
              ))}
            </motion.div>

            {/* Preview Card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`relative mt-8 overflow-hidden rounded-[28px] p-6 ${glass}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-transparent" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-emerald-200">
                    <Flame className="h-3.5 w-3.5" />
                    AI Persona Preview
                  </div>

                  <h3 className="text-2xl font-bold">
                    {form.name || "Your Persona"}
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-white/50">
                    {form.favoriteFoods.length > 0
                      ? `Loves ${form.favoriteFoods
                        .slice(0, 3)
                        .join(", ")} and enjoys ${VIBES.find(
                          (v) => v.value === form.vibe
                        )?.label
                      } energy.`
                      : "Select your favorite meals and vibe to generate your personalized AI food reviewer."}
                  </p>
                </div>

                <motion.div
                  animate={{
                    rotate: [0, 6, -6, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 5,
                  }}
                  className="text-5xl"
                >
                  🍛
                </motion.div>
              </div>

              {/* Completion */}
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between text-xs text-white/40">
                  <span>Profile completion</span>
                  <span>{completion}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    animate={{ width: `${completion}%` }}
                    transition={{
                      type: "spring",
                      stiffness: 120,
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-300"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT FORM */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={`${glass} rounded-[32px] p-5 shadow-2xl shadow-emerald-500/10 sm:p-7`}
          >
            {/* Step */}
            <div className="mb-7 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300">
                  Step 1 of 3
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  Build your persona
                </h2>
              </div>

              <div className="flex gap-2">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className={`h-2 rounded-full transition-all duration-300 ${n === 1
                        ? "w-10 bg-emerald-400"
                        : "w-2 bg-white/15"
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* Naija Mode */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="mb-6 flex items-center justify-between rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-2xl">
                  🇳🇬
                </div>

                <div>
                  <h4 className="font-semibold">
                    Naija Mode
                  </h4>

                  <p className="text-xs text-white/45">
                    Add slang, pidgin & authentic vibes
                  </p>
                </div>
              </div>

              <button
                onClick={() =>
                  setForm((p) => ({
                    ...p,
                    naijaMode: !p.naijaMode,
                  }))
                }
                className={`relative h-7 w-14 rounded-full transition ${form.naijaMode
                    ? "bg-emerald-500"
                    : "bg-white/10"
                  }`}
              >
                <motion.span
                  layout
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 35,
                  }}
                  className="absolute top-1 h-5 w-5 rounded-full bg-white"
                  style={{
                    left: form.naijaMode
                      ? "calc(100% - 24px)"
                      : "4px",
                  }}
                />
              </button>
            </motion.div>

            {/* Inputs */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Your Name"
                error={errors.name}
                icon={<User2 size={16} />}
              >
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      name: e.target.value,
                    }))
                  }
                  placeholder="e.g. Chisom"
                  className={inputCls(!!errors.name)}
                />
              </Field>

              <Field
                label="Age Range"
                error={errors.ageRange}
              >
                <select
                  value={form.ageRange}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      ageRange: e.target.value,
                    }))
                  }
                  className={inputCls(!!errors.ageRange)}
                >
                  <option value="">Select...</option>

                  {AGE_RANGES.map((range) => (
                    <option key={range}>{range}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-4">
              <Field
                label="Location"
                error={errors.location}
                icon={<MapPin size={16} />}
              >
                <input
                  value={form.location}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      location: e.target.value,
                    }))
                  }
                  placeholder="Lagos, Nigeria"
                  className={inputCls(!!errors.location)}
                />
              </Field>
            </div>

            {/* Foods */}
            <div className="mt-8">
              <SectionLabel
                title="Favorite Foods"
                subtitle="Choose what you enjoy most"
              />

              <div className="mt-4 flex flex-wrap gap-2">
                {FOOD_OPTIONS.map((food, i) => {
                  const selected =
                    form.favoriteFoods.includes(food.label)

                  return (
                    <motion.button
                      key={food.label}
                      initial="hidden"
                      animate="show"
                      variants={fadeUp}
                      custom={i}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() =>
                        toggleFood(food.label)
                      }
                      className={`group relative overflow-hidden rounded-2xl border px-3 py-2 transition-all duration-300 ${selected
                          ? "border-emerald-400 bg-emerald-500/15 shadow-lg shadow-emerald-500/20"
                          : "border-white/10 bg-white/[0.03] hover:border-emerald-400/30"
                        }`}
                    >
                      <div className="flex items-center gap-1">
                        {/* <span className="text-medium">
                          {food.emoji}
                        </span> */}

                        <span
                          className={`text-sm font-medium ${selected
                              ? "text-white"
                              : "text-white/70"
                            }`}
                        >
                          {food.label}
                        </span>

                        {selected && (
                          <Check className="ml-1 h-4 w-4 text-emerald-300" />
                        )}
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              <AnimatePresence>
                {errors.favoriteFoods && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 text-sm text-red-400"
                  >
                    {errors.favoriteFoods}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Vibes */}
            <div className="mt-9">
              <SectionLabel
                title="Reviewer Vibe"
                subtitle="Select your personality"
              />

              <div className="mt-4 grid gap-3 sm:grid-cols-4">
                {VIBES.map((vibe) => {
                  const selected = form.vibe === vibe.value

                  return (
                    <motion.button
                      key={vibe.value}
                      whileHover={{ y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() =>
                        setForm((p) => ({
                          ...p,
                          vibe: vibe.value,
                        }))
                      }
                      className={`relative overflow-hidden rounded-3xl border p-2 text-left transition-all duration-300 ${selected
                          ? "border-emerald-400 bg-emerald-500/12"
                          : "border-white/10 bg-white/[0.03]"
                        }`}
                    >
                      {selected && (
                        <motion.div
                          layoutId="active-vibe"
                          className="absolute inset-0 rounded-3xl border border-emerald-400"
                        />
                      )}

                      <div className="relative z-10">
                        <div className="mb-3 flex items-center justify-between">
                          <span className="text-2xl">
                            {vibe.emoji}
                          </span>

                          {selected && (
                            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-black">
                              <Check size={14} />
                            </div>
                          )}
                        </div>

                        <h3 className="font-semibold">
                          {vibe.label}
                        </h3>
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>

            {/* CTA */}
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              className="group mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-4 font-semibold text-black shadow-2xl shadow-emerald-500/30"
            >
              Save Persona

              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{
                  repeat: Infinity,
                  duration: 1.5,
                }}
              >
                <ArrowRight size={18} />
              </motion.div>
            </motion.button>

            {/* <p className="mt-4 text-center text-xs tracking-wide text-white/30">
              Securely saved in local storage · No sign up required
            </p> */}
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
    ${hasError
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
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-2 text-xs text-red-400"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

function SectionLabel({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-white/50">
        {title}
      </h3>

      <p className="mt-1 text-sm text-white/35">
        {subtitle}
      </p>
    </div>
  )
}
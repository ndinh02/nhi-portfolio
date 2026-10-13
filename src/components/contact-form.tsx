import { useId, useMemo, useState, type FormEvent } from "react"
import { motion } from "motion/react"
import { Bloom } from "@/components/sakura"
import { Link } from "react-router-dom"
import { useT } from "@/lib/i18n"
import { cn } from "@/lib/utils"

/* Small contact form: the recipient (me) is fixed, visitors only add their email and a message.
   Sent through FormSubmit (no account or API key needed); every message carries the subject tag
   "[Portfolio]" so Gmail can file it under the "Job contacting" label with one filter. */

export const EMAIL = "nhidinh.digibeez@gmail.com"
const ENDPOINT = `https://formsubmit.co/ajax/${EMAIL}`

// the draft survives the form unmounting (e.g. switching folders in the menu while typing)
const draft = { email: "", message: "" }

type State = "idle" | "sending" | "sent" | "error"

export function ContactForm({ className, compact = false, buttonClass = "bg-ink text-paper" }: { className?: string; compact?: boolean; buttonClass?: string }) {
  const t = useT()
  const id = useId()
  const [email, setEmail] = useState(draft.email)
  const [message, setMessage] = useState(draft.message)
  const [state, setState] = useState<State>("idle")

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const honey = (e.currentTarget.elements.namedItem("_honey") as HTMLInputElement | null)?.value
    if (honey) return // a bot filled the hidden field
    setState("sending")
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          email, message,
          _subject: `[Portfolio] ${t("Nachricht von", "Message from")} ${email}`,
          _replyto: email, _template: "table", _captcha: "false",
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || data.success === "false" || data.success === false) throw new Error(data.message || "send failed")
      draft.email = ""; draft.message = ""
      setMessage(""); setState("sent")
    } catch {
      setState("error")
    }
  }

  if (state === "sent") {
    return (
      <div className={cn("relative flex flex-col justify-center gap-3 py-2", className)} role="status">
        <Celebration />
        <div className="relative flex items-end gap-3">
          <motion.span initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.15 }} className="w-12 shrink-0 sm:w-14">
            <Bloom n={1} className="h-auto w-full" />
          </motion.span>
          <p className="display text-[clamp(1.4rem,2.4vw,2rem)] leading-tight">{t("Danke! Ihre Nachricht ist unterwegs.", "Thank you! Your message is on its way.")}</p>
          <motion.span initial={{ scale: 0, rotate: 40 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.3 }} className="w-10 shrink-0 -scale-x-100 sm:w-12">
            <Bloom n={2} className="h-auto w-full" delay={0.8} />
          </motion.span>
        </div>
        <motion.p className="relative text-lg leading-snug" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          {t("Nhi kämpft sich durch alles, um Ihnen so schnell wie möglich zu antworten.", "Nhi will fight through everything to answer you as soon as she can.")}
        </motion.p>
        <p className="relative text-sm">{t("Die Antwort geht an", "The reply goes to")} {email}.</p>
        <button type="button" onClick={() => setState("idle")} className="relative self-start font-mono text-xs uppercase tracking-wider underline underline-offset-4">
          {t("Noch eine Nachricht schreiben", "Write another message")}
        </button>
      </div>
    )
  }

  const field = "w-full rounded-[6px] border bg-[color-mix(in_oklab,var(--form-bg,white)_85%,transparent)] px-3 text-[#0e1116] placeholder:text-[#5b606b] outline-offset-2 focus:outline-2"
  return (
    <form onSubmit={submit} className={cn("flex flex-col gap-2.5", className)} noValidate={false}>
      <p className="flex items-baseline gap-2 font-mono text-[0.7rem] uppercase tracking-wider">
        <span>{t("An", "To")}:</span>
        <span className="normal-case tracking-normal">{EMAIL}</span>
      </p>
      <label htmlFor={`${id}-email`} className="sr-only">{t("Ihre E-Mail-Adresse", "Your email address")}</label>
      <input id={`${id}-email`} type="email" required autoComplete="email" value={email}
        onChange={(e) => { setEmail(e.target.value); draft.email = e.target.value }}
        placeholder={t("Ihre E-Mail-Adresse", "Your email address")}
        className={cn(field, "h-10 border-black/15")} />
      <label htmlFor={`${id}-msg`} className="sr-only">{t("Ihre Nachricht", "Your message")}</label>
      <textarea id={`${id}-msg`} required value={message} rows={compact ? 3 : 5}
        onChange={(e) => { setMessage(e.target.value); draft.message = e.target.value }}
        placeholder={t("Worum geht es? Zum Beispiel eine Stelle, ein Projekt oder eine Frage.", "What’s it about? A role, a project or a question, for example.")}
        className={cn(field, "min-h-0 flex-1 resize-none border-black/15 py-2.5 leading-snug")} />
      {/* honeypot: invisible to people, tempting for bots */}
      <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-[0.72rem] leading-snug">
          {t("Wird über FormSubmit versendet. ", "Sent via FormSubmit. ")}
          <Link to="/datenschutz" className="underline underline-offset-2">{t("Datenschutz", "Privacy")}</Link>
        </p>
        <button type="submit" disabled={state === "sending"}
          className={cn("rounded-full px-5 py-2.5 font-mono text-xs uppercase tracking-wider transition-opacity hover:opacity-85 disabled:opacity-60", buttonClass)}>
          {state === "sending" ? t("Wird gesendet …", "Sending …") : t("Senden →", "Send →")}
        </button>
      </div>
      {state === "error" && (
        <p role="alert" className="text-sm">
          {t("Das hat leider nicht geklappt. Schreiben Sie mir gern direkt: ", "Sorry, that didn’t work. Feel free to email me directly: ")}
          <a href={`mailto:${EMAIL}`} className="underline underline-offset-2">{EMAIL}</a>
        </p>
      )}
    </form>
  )
}

/* one confetti burst in the site's colours, plus sakura petals drifting down.
   With reduced motion the burst is skipped (MotionConfig) and only the text and blooms show. */
const COLORS = ["#8b2f5c", "#f5a3c0", "#ffc933", "#c9f24a", "#0a7770", "#cab1fd", "#ff5fa2"]
const PETAL = "M0 -5 C 7 -11, 10 -22, 4 -30 L 0 -26 L -4 -30 C -10 -22, -7 -11, 0 -5 Z"

function Celebration() {
  // fixed pseudo-random values, so the burst doesn't reshuffle on re-render
  const pieces = useMemo(() => Array.from({ length: 42 }, (_, i) => {
    const r = (n: number) => { const x = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453; return x - Math.floor(x) }
    const angle = r(1) * Math.PI * 2, dist = 90 + r(2) * 170
    return { x: Math.cos(angle) * dist, y: Math.sin(angle) * dist * 0.7 - 40, fall: 90 + r(3) * 120, rot: (r(4) - 0.5) * 720,
      color: COLORS[i % COLORS.length], w: 5 + r(5) * 6, round: r(6) > 0.7, delay: r(7) * 0.12, dur: 1.4 + r(8) * 0.9 }
  }), [])
  const petals = useMemo(() => Array.from({ length: 9 }, (_, i) => ({ left: 6 + i * 11, delay: i * 0.35, dur: 4.5 + (i % 3) * 0.8, sway: i % 2 ? 18 : -18, size: 10 + (i % 3) * 3 })), [])
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      <div className="absolute left-1/2 top-1/2">
        {pieces.map((p, i) => (
          <motion.span key={i} className="absolute block" style={{ width: p.w, height: p.round ? p.w : p.w * 0.45, background: p.color, borderRadius: p.round ? 999 : 1 }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 }}
            animate={{ x: [0, p.x, p.x * 1.1], y: [0, p.y, p.y + p.fall], opacity: [1, 1, 0], rotate: p.rot, scale: 1 }}
            transition={{ duration: p.dur, delay: p.delay, times: [0, 0.35, 1], ease: ["easeOut", "easeIn"] }} />
        ))}
      </div>
      <div className="absolute inset-0 overflow-hidden">
        {petals.map((p, i) => (
          <motion.svg key={i} viewBox="-12 -32 24 30" className="absolute top-0" style={{ left: `${p.left}%`, width: p.size }}
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: [-30, 260], x: [0, p.sway, -p.sway / 2], rotate: [0, 200], opacity: [0, 1, 1, 0] }}
            transition={{ duration: p.dur, delay: 0.2 + p.delay, repeat: Infinity, repeatDelay: 0.6, ease: "linear" }}>
            <path d={PETAL} fill="#f7b6cc" stroke="#8b2f5c" strokeWidth="1.2" />
          </motion.svg>
        ))}
      </div>
    </div>
  )
}

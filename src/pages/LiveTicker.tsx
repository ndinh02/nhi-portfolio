import { useState, type ReactNode } from "react"
import { AnimatePresence, motion } from "motion/react"
import TextRotate from "@/fancy/text-rotate"
import SimpleMarquee from "@/fancy/simple-marquee"
import StackingCards, { StackingCardItem } from "@/fancy/stacking-cards"
import { AutoVideo, Footer, Nav, Pager, Pic, Reveal, ScrambleKicker, SectionHead, Tradeoffs, img, ratio, type Id, Brief } from "@/components/ui"
import { CaseLayout } from "@/components/case-index"
import { useLang } from "@/lib/i18n"
import { cn } from "@/lib/utils"

/* ---------- small LiveTicker-styled controls ---------- */

// Segmented control in the product's own look (mono caps, lime active state)
function Segmented<T extends string>({ options, value, onChange, label }: {
  options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; label: string
}) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex border border-line bg-panel p-1 font-mono text-xs uppercase tracking-[0.14em]">
      {options.map((o) => (
        <button key={o.value} role="tab" aria-selected={value === o.value} onClick={() => onChange(o.value)}
          className={cn("px-4 py-2 transition-colors", value === o.value ? "bg-accent text-[#0d0d10]" : "text-muted hover:text-ink")}>
          {o.label}
        </button>
      ))}
    </div>
  )
}

function Swap({ id, alt, className }: { id: Id; alt: string; className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-[6px] border border-line bg-black", className)}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.img key={id} src={img(id)} alt={alt} loading="lazy"
          className="mx-auto block max-h-[70svh] w-full object-contain"
          style={{ aspectRatio: ratio(id) }}
          initial={{ opacity: 0, filter: "blur(6px)" }} animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(6px)" }} transition={{ duration: 0.35 }} />
      </AnimatePresence>
    </div>
  )
}

function Clip({ src, label }: { src: string; label: string }) {
  return <AutoVideo src={src} label={label} className="rounded-[6px] border border-line bg-black" />
}

function Label({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-accent">{children}</p>
}

type Mode = "auto" | "coop" | "manual"
type Pair = { key: string; title: string; before: Id; after: Id; beforeCap: string; afterCap: string }

/* ---------- page ---------- */

export default function LiveTicker() {
  const { lang, t } = useLang()
  const [pair, setPair] = useState<Record<string, "before" | "after">>({ ws: "after", onb: "after", dd: "after" })
  const [mode, setMode] = useState<Mode>("coop")
  const [zone, setZone] = useState<number | null>(null)

  const facts = [
    [t("Zeitraum", "Period"), "03–04/2026"],
    [t("Rolle", "Role"), t("UX-Beraterin", "UX consultant")],
    [t("Umfang", "Scope"), t("Research, Architektur, Interaktion, Marke", "Research, architecture, interaction, brand")],
    ["Status", t("Co-Op-Modus live im Einsatz", "Co-op mode live in use")],
  ]

  const scope = [
    t("UX-Research und Problemdefinition", "UX research and problem definition"),
    t("Informationsarchitektur", "Information architecture"),
    t("Sicherungen beim Moduswechsel", "Safeguards when switching modes"),
    t("Visuelles System: KI vs. Mensch", "Visual system: AI vs. human"),
    t("Tastatur-first-Interaktion", "Keyboard-first interaction"),
    t("Interaktiver Prototyp", "Interactive prototype"),
    t("Marke und Logo", "Brand and logo"),
  ]

  const pairs: Pair[] = [
    { key: "ws", title: t("Arbeitsfläche: vom Dashboard zum Cockpit", "Workspace: from dashboard to cockpit"), before: "lt-before-ws", after: "lt-hero",
      beforeCap: t("Vorher war alles eine dichte Spalte. Man konnte nicht sehen, wo die KI arbeitet und was schon live ist.", "Before, everything was one dense column. You couldn't tell where the AI was working or what was already live."),
      afterCap: t("Ich habe die Fläche in drei klare Zonen geteilt: Entwurf, Veröffentlichtes und Kontext.", "I split the screen into three clear zones: drafts, published entries and context.") },
    { key: "onb", title: t("Einstieg: vom Formular zum geführten Ablauf", "Onboarding: from form to guided flow"), before: "lt-before-onb", after: "lt-after-onb",
      beforeCap: t("Vorher war der Einstieg ungebrandet, mit englischen Labels und einfachen Browser-Dropdowns.", "Before, the entry screen was unbranded, with English-only labels and plain browser dropdowns."),
      afterCap: t("Jetzt ist er gebrandet und übersetzt. Man wählt das Spiel, und der Ticker startet sofort.", "Now it's branded and localised. You pick the match and the ticker starts right away.") },
    { key: "dd", title: t("Detail: vom Dropdown zur Suche", "Detail: from dropdown to search"), before: "lt-before-dd", after: "lt-after-dd",
      beforeCap: t("Vorher gab es nur ein rohes Browser-Dropdown, das man mit der Maus bedienen musste.", "Before, there was just a raw browser dropdown that you had to use with the mouse."),
      afterCap: t("Jetzt kann man alle 171 Länder durch Tippen filtern und alles mit der Tastatur steuern.", "Now you can filter all 171 countries by typing and control everything with the keyboard.") },
  ]

  const modes: Record<Mode, { id: Id; text: string }> = {
    auto: { id: "lt-mode-auto", text: t("Im Auto-Modus veröffentlicht die KI direkt. Deshalb muss man den Wechsel in diesen Modus ausdrücklich bestätigen.", "In auto mode the AI publishes directly, so you have to explicitly confirm switching into it.") },
    coop: { id: "lt-mode-coop", text: t("Im Co-Op-Modus schreibt die KI Entwürfe und die Redaktion entscheidet. Einen Entwurf zu übernehmen kostet nur einen Tastendruck.", "In co-op mode the AI writes drafts and the editor decides. Accepting a draft takes just one key press.") },
    manual: { id: "lt-mode-manual", text: t("Im manuellen Modus schreibt die Redaktion alles selbst, unterstützt von Slash-Befehlen.", "In manual mode the editor writes everything, helped by slash commands.") },
  }

  const risks = [
    { t: t("Zu viel Vertrauen", "Too much trust"), p: t("Die Redaktion liest KI-Texte nicht mehr und veröffentlicht einen falschen Spielstand.", "Editors stop reading AI text and publish a wrong score."),
      a: t("Deshalb muss man den Wechsel zu Auto bestätigen, jeder KI-Text trägt ein sichtbares Label und jede Veröffentlichung lässt sich zurücknehmen.", "That's why switching to auto needs a confirmation, every AI text carries a visible label and every post can be undone.") },
    { t: t("Zu wenig Vertrauen", "Too little trust"), p: t("Die Redaktion schreibt alles selbst und fällt hinter das Spiel zurück.", "Editors write everything themselves and fall behind the match."),
      a: t("Deshalb übernimmt ein einziger Tastendruck (Tab) den KI-Entwurf. Vertrauen soll leichter sein als Abtippen.", "That's why a single key press (Tab) accepts the AI draft. Trusting it should be easier than retyping.") },
    { t: t("Fehler unter Druck", "Mistakes under pressure"), p: t("Im Trubel nach einem Tor entstehen leicht leere oder doppelte Einträge.", "In the chaos after a goal it's easy to post empty or duplicate entries."),
      a: t("Deshalb sind leere Einträge gesperrt, und nach jeder Veröffentlichung bleiben fünf Sekunden zum Stornieren.", "That's why empty entries are blocked, and every post has five seconds to be undone.") },
  ]

  const features: { tag: string; title: string; text: string; media: ReactNode }[] = [
    { tag: t("Tempo", "Speed"), title: t("Slash-Befehle mit Autovervollständigung", "Slash commands with autocomplete"),
      text: t("Man tippt /g für ein Tor und wählt den Spieler direkt aus der Aufstellung. So entsteht ein fertiger Eintrag in wenigen Tastendrücken.", "You type /g for a goal and pick the player straight from the line-up. That gives you a finished entry in just a few key presses."),
      media: <Clip src="/video/lt-slash_autocomplete.mp4" label={t("Manueller Modus: /g, Spieler-Autovervollständigung, fertiger Eintrag", "Manual mode: /g, player autocomplete, finished entry")} /> },
    { tag: t("Befehle", "Commands"), title: t("Ein Befehl für jedes Ereignis", "One command for every event"),
      text: t("Für Tore, Karten, Wechsel und Elfmeter gibt es eigene Befehle. Eine Inline-Hilfe zeigt beim Tippen, was noch fehlt.", "Goals, cards, substitutions and penalties each have their own command. Inline help shows what's still missing as you type."),
      media: <div className="grid grid-cols-2 gap-3"><Pic id="lt-slash" alt={t("Liste aller Slash-Befehle", "List of all slash commands")} className="rounded-[6px] bg-black" /><Pic id="lt-slash-help" alt={t("Inline-Hilfe zeigt fehlende Angaben", "Inline help shows missing details")} className="rounded-[6px] bg-black" /></div> },
    { tag: t("Tastatur zuerst", "Keyboard first"), title: t("Alle Kürzel in einem Overlay", "Every shortcut in one overlay"),
      text: t("Strg+Enter veröffentlicht, Strg+1/2/3 wechseln den Modus. Alle Kürzel lassen sich jederzeit einblenden, man muss also nichts auswendig lernen.", "Ctrl+Enter publishes and Ctrl+1/2/3 switch modes. You can bring up every shortcut at any time, so there's nothing to memorise."),
      media: <Pic id="lt-help" alt={t("Overlay mit allen Tastaturkürzeln", "Overlay with all keyboard shortcuts")} className="mx-auto max-w-md rounded-[6px] bg-black" /> },
    { tag: t("Sicherheitsnetz", "Safety net"), title: t("Jede Veröffentlichung ist widerrufbar", "Every post can be undone"),
      text: t("Nach dem Veröffentlichen bleiben fünf Sekunden zum Stornieren. Ein Fehler kostet so nur einen Klick und keinen Korrektur-Post.", "After publishing there are five seconds to undo. A mistake costs one click instead of a correction post."),
      media: <Clip src="/video/lt-undo_toast.mp4" label={t("Veröffentlichen, dann 5-Sekunden-Countdown zum Stornieren", "Publish, then a 5-second countdown to undo")} /> },
    { tag: t("Korrekturen", "Corrections"), title: t("Veröffentlicht ist nicht endgültig", "Published isn’t final"),
      text: t("Jeder Eintrag lässt sich auch später noch bearbeiten oder löschen, sogar Stunden nach dem Anpfiff.", "Every entry can still be edited or deleted later, even hours after kick-off."),
      media: <Pic id="lt-retrieval" alt={t("Menü zum Bearbeiten oder Löschen eines veröffentlichten Eintrags", "Menu to edit or delete a published entry")} className="rounded-[6px] bg-black" /> },
  ]

  const zones = [
    { n: 1, x: 50, y: 11, t: t("Spielkopf & Stand", "Match header & score"), d: t("Spielstand und Status sind immer im Blick.", "Score and status are always in view.") },
    { n: 2, x: 37, y: 22.6, t: t("Modus & Sprache", "Mode & language"), d: t("Hier wählt man mit einem Klick zwischen Kontrolle und Tempo.", "Here you choose between control and speed with one click.") },
    { n: 3, x: 11, y: 45, t: t("KI-Entwürfe", "AI drafts"), d: t("Hier liegt vorbereitet, was als Nächstes kommt.", "What's coming next is prepared here.") },
    { n: 4, x: 48, y: 45, t: t("Veröffentlichter Feed", "Published feed"), d: t("Hier sieht man, was schon öffentlich ist.", "This shows what's already public.") },
    { n: 5, x: 87, y: 40, t: t("Statistik & Aufstellung", "Stats & line-up"), d: t("Hier sieht man, was gerade im Spiel passiert.", "This shows what's happening in the match right now.") },
    { n: 6, x: 90, y: 22.6, t: t("Tastenkürzel", "Shortcuts"), d: t("Alles lässt sich mit der Tastatur steuern.", "Everything can be controlled from the keyboard.") },
  ]

  const palette = [
    ["Canvas", "#0D0D10"], [t("Live / Alarm", "Live / Alert"), "#DC3C2E"], ["Signal", "#C9F24A"], [t("Papier", "Paper"), "#F5F3EF"],
  ]

  const proves = [
    [t("Vertrauen ist eine Designfrage.", "Trust is a design question."), t("Eine KI wird nicht dadurch gut, dass sie schnell ist. Ich musste gestalten, wann man ihr folgt und wann nicht.", "An AI doesn’t become good by being fast. I had to design when you follow it and when you don’t.")],
    [t("Reibung sparsam einsetzen.", "Use friction sparingly."), t("Jede Sicherung kostet Sekunden. Deshalb habe ich sie nur dort eingebaut, wo ein Fehler wirklich wehtut.", "Every safeguard costs seconds. So I only put them where a mistake really hurts.")],
    [t("Mit dem arbeiten, was feststeht.", "Work with what’s fixed."), t("Modi und KI-Technik waren gesetzt. Mein Spielraum war die Kontrolle, und genau dort habe ich angesetzt.", "The modes and the AI technology were set. My room to move was control, and that’s where I focused.")],
    [t("Es läuft im Alltag.", "It runs day to day."), t("Der Co-Op-Modus, den ich empfohlen habe, ist heute live im Einsatz.", "The co-op mode I recommended is now live in use.")],
  ]

  return (
    <>
      <Nav />
      <CaseLayout className="signal-grid" title={t("Kapitel", "Chapters")} chapters={[
        { id: "problem", label: t("Das Problem", "The problem") }, { id: "entwicklung", label: t("Vorher → nachher", "Before → after") },
        { id: "ki-modi", label: t("KI-Modi", "AI modes") }, { id: "interaktionen", label: t("Interaktionen", "Interactions") },
        { id: "architektur", label: t("Architektur", "Architecture") }, { id: "mobil", label: t("Mobil", "Mobile") },
        { id: "marke", label: t("Marke", "Brand") }, { id: "abwaegungen", label: t("Abwägungen", "Trade-offs") }, { id: "fazit", label: t("Was ich mitnehme", "Takeaways") }]}>
        {/* Hero */}
        <section className="gutter pb-12 pt-10 sm:pt-16">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--alert)] opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[var(--alert)]" />
            </span>
            <ScrambleKicker text={`01 · LiveTicker · ${t("UX-Case-Study", "UX case study")}`} chars="0123456789:'+" />
          </div>
          <h1 className="display mt-6 max-w-6xl text-[clamp(2.6rem,7.4vw,7.5rem)]">
            {t("Im Spieltempo veröffentlichen.", "Publish at match speed.")}
            <span className="mt-2 flex font-serif font-normal italic tracking-normal text-accent">
              <TextRotate key={lang}
                texts={t(["Die Kontrolle behalten.", "Der KI nicht blind folgen.", "Fehler sofort zurücknehmen."],
                  ["Stay in control.", "Don’t follow the AI blindly.", "Undo mistakes instantly."])}
                mainClassName="overflow-hidden pb-[0.3em] -mb-[0.2em]" splitLevelClassName="overflow-hidden pb-[0.3em] -mb-[0.3em] pr-[0.08em] -mr-[0.08em]" staggerFrom="first" staggerDuration={0.015}
                rotationInterval={3200} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-110%" }}
                transition={{ type: "spring", damping: 30, stiffness: 380 }} />
            </span>
          </h1>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted">
            {t("Ein Freund hat ein Redaktionswerkzeug für Live-Ticker gebaut, und ich habe als UX-Beraterin die Nutzerführung und die Marke übernommen. Eine Frage hat mich dabei die ganze Zeit begleitet: Wie schnell darf die KI sein, bevor die Redaktion ihr blind vertraut?",
              "A friend built a newsroom tool for live tickers, and I took on the UX and the brand as a consultant. One question stayed with me the whole time: how fast can the AI be before editors start trusting it blindly?")}
          </p>
          <dl className="mt-14 grid gap-8 border-t border-line pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map(([k, v]) => (
              <div key={k}><dt className="label">{k}</dt><dd className="mt-2 leading-snug">{v}</dd></div>
            ))}
          </dl>
        </section>
        <section className="gutter pb-24">
          <Reveal><Pic id="lt-hero" eager alt={t("Das Cockpit im Co-Op-Modus: KI-Entwürfe links, veröffentlichter Feed Mitte, Statistik und Aufstellung rechts", "The cockpit in co-op mode: AI drafts left, published feed centre, stats and line-up right")} className="rounded-[8px] border border-line" /></Reveal>
          <p className="label mt-4">{t("So sieht das Cockpit im Co-Op-Modus aus: Ein Blick reicht für das ganze Lagebild.", "This is the cockpit in co-op mode: one glance gives you the whole picture.")}</p>
        </section>

        {/* 01 Problem */}
        <section id="problem" className="gutter section border-t border-line">
          <SectionHead no="01" kicker={t("Problem", "Problem")}
            title={<>{t("Tempo und Genauigkeit ziehen in ", "Speed and accuracy pull in ")}<span className="font-serif font-normal italic tracking-normal">{t("entgegengesetzte Richtungen.", "opposite directions.")}</span></>}>
            <p>
              {t("Auf den ersten Blick ging es um Tempo: Die Redaktion hat nur Sekunden, bevor schon das nächste passiert. Aber eine KI, die schnell schreibt, hilft nichts, wenn man jeden Satz nachlesen muss. Und sie schadet, wenn man es irgendwann nicht mehr tut. Ich habe die Aufgabe deshalb als Frage des Vertrauens behandelt, nicht als Feature-Wunsch.",
                "At first glance it was about speed: editors only have seconds before the next thing happens. But an AI that writes fast doesn’t help if you have to reread every sentence. And it does harm once you stop. So I treated the brief as a question of trust, not a feature request.")}
            </p>
          </SectionHead>
          <Brief className="mt-16"
            why={t("Die Redaktion muss Tore, Karten und Wechsel in Sekunden veröffentlichen. Die KI sollte ihr dabei Zeit verschaffen.", "Editors have to publish goals, cards and substitutions within seconds. The AI was meant to buy them time.")}
            constraint={t("Die drei KI-Modi standen schon fest, bevor ich dazukam. Ob die KI schreibt, konnte ich also nicht mehr entscheiden, nur noch, wie viel Kontrolle die Redaktion dabei behält.", "The three AI modes were already set before I joined. So I couldn’t decide whether the AI writes anymore, only how much control the editors keep.")}
            response={t("Ich habe mir zuerst überlegt, wo es schiefgehen kann: Man vertraut der KI zu sehr, zu wenig, oder schickt im Stress etwas Falsches ab. Genau an diesen drei Stellen habe ich Reibung eingebaut, und sonst nirgends.", "First I worked out where it could go wrong: you trust the AI too much, too little, or send something wrong under stress. I added friction at exactly those three points, and nowhere else.")}
            result={t("Der Co-Op-Modus, den ich empfohlen habe, ist heute live im Einsatz. Gebaut hat das Produkt ein Freund.", "The co-op mode I recommended is now live in use. A friend built the product.")} />
          <div className="mt-20 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Label>{t("Meine Rolle", "My role")}</Label>
              <h3 className="display mt-3 text-3xl">{t("Vom Problem bis zur Marke.", "From problem to brand.")}</h3>
              <p className="mt-5 max-w-sm leading-relaxed text-muted">
                {t("Ich habe das Briefing geschärft, die Architektur festgelegt, jeden Modus gestaltet und die Marke gebaut.",
                  "I sharpened the brief, defined the architecture, designed every mode and built the brand.")}
              </p>
            </div>
            <ol className="grid gap-px self-start border border-line bg-line sm:grid-cols-2 lg:col-span-7">
              {scope.map((s, i) => (
                <li key={s} className="flex gap-4 bg-paper p-5"><span className="font-mono text-xs text-accent">0{i + 1}</span>{s}</li>
              ))}
            </ol>
          </div>
        </section>

        {/* 02 Evolution */}
        <section id="entwicklung" className="gutter section border-t border-line">
          <SectionHead no="02" kicker={t("Entwicklung", "Evolution")} title={t("Vorher → nachher.", "Before → after.")}>
            <p>{t("Am Anfang war alles eine dichte Spalte. Man konnte nicht sehen, was die KI geschrieben hatte und was schon öffentlich war. Ich habe dieselben Screens so lange umgebaut, bis man das auf einen Blick erkennt. Schalten Sie gern selbst zwischen vorher und nachher um.", "At the start, everything was one dense column. You couldn’t see what the AI had written or what was already public. I kept reworking the same screens until you could tell at a glance. Feel free to switch between before and after yourself.")}</p>
          </SectionHead>
          <div className="mx-auto mt-16 grid max-w-5xl gap-24">
            <Reveal>
              <Label>00</Label>
              <h3 className="display mt-2 text-[clamp(1.5rem,2.6vw,2.4rem)]">{t("Erster Entwurf mit Figma Make", "First draft with Figma Make")}</h3>
              <Pic id="lt-make" alt={t("Erster klickbarer Entwurf des Cockpits, erstellt mit Figma Make", "First clickable draft of the cockpit, made with Figma Make")} className="mt-6 rounded-[6px] border border-line" />
              <p className="mt-4 max-w-2xl text-muted">
                {t("Mein erster klickbarer Prototyp. Modi, Übernahme per Tab und Slash-Befehle waren schon drin, aber Layout und Hierarchie waren noch unklar. Das habe ich erst in den nächsten Runden gelöst.",
                  "My first clickable prototype. Modes, accepting with Tab and slash commands were already in, but the layout and hierarchy were still unclear. I only solved that in the rounds that followed.")}
              </p>
            </Reveal>
            {pairs.map((p, i) => {
              const state = pair[p.key]
              return (
                <Reveal key={p.key}>
                  <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                    <div>
                      <Label>0{i + 1}</Label>
                      <h3 className="display mt-2 text-[clamp(1.5rem,2.6vw,2.4rem)]">{p.title}</h3>
                    </div>
                    <Segmented label={p.title} value={state} onChange={(v) => setPair((s) => ({ ...s, [p.key]: v }))}
                      options={[{ value: "before", label: t("Vorher", "Before") }, { value: "after", label: t("Nachher", "After") }]} />
                  </div>
                  <Swap id={state === "before" ? p.before : p.after} alt={state === "before" ? p.beforeCap : p.afterCap}
                    className={p.key === "dd" ? "flex min-h-[22rem] items-center justify-center p-6 [&_img]:max-h-[26rem] [&_img]:w-auto" : ""} />
                  <p className="mt-4 max-w-2xl text-muted">
                    <span className={cn("mr-2 font-mono text-xs uppercase tracking-wider", state === "before" ? "text-alert" : "text-accent")}>
                      {state === "before" ? t("Vorher", "Before") : t("Nachher", "After")}
                    </span>
                    {state === "before" ? p.beforeCap : p.afterCap}
                  </p>
                </Reveal>
              )
            })}
          </div>
        </section>

        {/* 03 AI modes */}
        <section id="ki-modi" className="gutter section border-t border-line">
          <SectionHead no="03" kicker={t("KI-Modi", "AI modes")}
            title={<>{t("Gegen die KI gestalten, ", "Designing against the AI, ")}<span className="font-serif font-normal italic tracking-normal">{t("nicht nur mit ihr.", "not just with it.")}</span></>}>
            <p>
              {t("Die drei Modi gab es schon. Meine Aufgabe war das Urteil: Wo vertraut man der KI zu viel, wo zu wenig? Jede Sicherung kostet die Redaktion einen Moment. Deshalb habe ich Reibung nur dort eingebaut, wo ein Fehler wirklich Schaden anrichtet, und überall sonst das Tempo gelassen.",
                "The three modes already existed. My job was the judgement: where do people trust the AI too much, where too little? Every safeguard costs the editor a moment. So I only added friction where a mistake does real damage, and left the speed alone everywhere else.")}
            </p>
          </SectionHead>
          <div className="mx-auto mt-16 max-w-5xl">
            <Segmented label={t("Modus", "Mode")} value={mode} onChange={setMode}
              options={[{ value: "auto", label: "Auto" }, { value: "coop", label: "Co-Op" }, { value: "manual", label: "Manual" }]} />
            <p className="mt-5 max-w-xl text-muted">{modes[mode].text}</p>
            <Swap id={modes[mode].id} alt={`${t("Cockpit im Modus", "Cockpit in mode")} ${mode}`} className="mt-6" />
          </div>
          <div className="mt-20 grid gap-6 md:grid-cols-3">
            {risks.map((r, i) => (
              <Reveal key={i} delay={i * 0.08} className="flex flex-col rounded-[6px] border border-line bg-panel p-6 sm:p-8">
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-alert">{t("Risiko", "Risk")} · {r.t}</p>
                <p className="mt-4 leading-relaxed">{r.p}</p>
                <p className="mt-auto border-t border-line pt-5 leading-relaxed text-muted">
                  <span className="font-mono text-xs uppercase tracking-wider text-accent">{t("Antwort", "Answer")}</span><br />{r.a}
                </p>
              </Reveal>
            ))}
          </div>
          <div className="mt-24 grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <Label>{t("Schranke gegen zu viel Vertrauen", "A gate against over-trust")}</Label>
              <h3 className="display mt-3 text-3xl">{t("Wer der KI mehr Macht gibt, bestätigt das.", "Giving the AI more power needs a confirmation.")}</h3>
              <p className="mt-5 max-w-md leading-relaxed text-muted">
                {t("Diese Schranke habe ich gestaltet. Die KI-Technik dahinter stammt nicht von mir.", "I designed this gate. The AI technology behind it isn’t mine.")}
              </p>
            </Reveal>
            <Reveal delay={0.1}><Clip src="/video/lt-mode_switch.mp4" label={t("Moduswechsel mit Bestätigungsdialog", "Mode switch with confirmation dialog")} /></Reveal>
          </div>
          <div className="mt-24 grid items-center gap-12 lg:grid-cols-2">
            <Reveal className="lg:order-2">
              <Label>{t("KI ist immer bearbeitbar", "AI is always editable")}</Label>
              <h3 className="display mt-3 text-3xl">{t("Nie endgültig.", "Never final.")}</h3>
              <p className="mt-5 max-w-md leading-relaxed text-muted">{t("Jeder Vorschlag lässt sich umschreiben, bevor er live geht.", "Every suggestion can be rewritten before it goes live.")}</p>
            </Reveal>
            <Reveal delay={0.1} className="lg:order-1"><Pic id="lt-ai-edit" alt={t("KI-Entwurf wird vor dem Veröffentlichen bearbeitet", "AI draft being edited before publishing")} className="rounded-[6px] border border-line bg-black" /></Reveal>
          </div>
        </section>

        {/* 04 Interactions */}
        <section id="interaktionen" className="section border-t border-line">
          <div className="gutter">
            <SectionHead no="04" kicker={t("Interaktionen", "Interactions")} title={t("Gebaut für eine Schicht unter Hochdruck.", "Built for a high-pressure shift.")}>
              <p>{t("Eine Live-Schicht ist Stress. Deshalb musste alles mit der Tastatur gehen, und jeder Fehler musste sich zurücknehmen lassen. Diese Interaktionen habe ich im laufenden Produkt aufgenommen.", "A live shift is stressful. So everything had to work from the keyboard, and every mistake had to be reversible. I recorded these interactions in the running product.")}</p>
            </SectionHead>
            <Reveal className="mt-16 grid gap-10 border-t border-line pt-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <Label>{t("Warum Tastatur zuerst", "Why keyboard first")}</Label>
                <h3 className="display mt-3 text-3xl">{t("Keine Zeit für die Maus.", "No time for the mouse.")}</h3>
              </div>
              <div className="grid gap-5 leading-relaxed text-muted lg:col-span-7">
                <p>{t("Ich habe mich in die Redaktion hineinversetzt: Ein Tor fällt, und man hat nur Sekunden, um es rauszuschicken. Zur Maus greifen, in einer Liste scrollen oder einen Button suchen kostet Zeit, die man nicht hat. Deshalb habe ich für jemanden gestaltet, der die Hände nie von der Tastatur nimmt.",
                  "I put myself in the editor’s seat: a goal goes in, and you have only seconds to get it out. Reaching for the mouse, scrolling a list or hunting for a button all cost time you don’t have. So I designed for someone who never takes their hands off the keyboard.")}</p>
                <p>{t("Daraus sind die Slash-Befehle entstanden. Die Vorschläge sind für jedes Team schon vorbereitet, so bleibt die Redaktion im Schreibfluss, statt Namen oder Schreibweisen nachzuschlagen. Bei wiederkehrenden Ereignissen wie einem Tor ist das Format immer gleich: Name und Team tippen, und es entsteht eine fertige Vorlage, die man direkt veröffentlichen kann. Das geht schneller, und die Einträge stimmen.",
                  "That’s where the slash commands came from. The suggestions are already prepared for each team, so the editor stays in the flow of writing instead of looking up names or spellings. For recurring events like a goal, the format is always the same: type the name and the team, and a ready template is generated that you can publish straight away. It’s quicker, and the entries come out correct.")}</p>
              </div>
            </Reveal>
          </div>
          <StackingCards totalCards={features.length} scaleMultiplier={0.03} className="gutter relative mt-6">
            {features.map((f, i) => (
              <StackingCardItem key={i} index={i} className="h-[84svh]">
                <article className="flex h-[76svh] flex-col gap-8 overflow-hidden rounded-[8px] border border-line bg-panel p-6 shadow-[0_-20px_60px_-30px_rgba(0,0,0,0.9)] sm:p-10 lg:flex-row lg:items-center lg:gap-12">
                  <div className="lg:w-[32%] lg:shrink-0">
                    <Label>{String(i + 1).padStart(2, "0")} · {f.tag}</Label>
                    <h3 className="display mt-4 text-[clamp(1.6rem,2.6vw,2.4rem)]">{f.title}</h3>
                    <p className="mt-5 max-w-sm text-lg leading-relaxed text-muted">{f.text}</p>
                  </div>
                  {/* media is capped in height so every card fits one screen */}
                  <div className="flex min-h-0 flex-1 items-center justify-center [&_img]:max-h-[52svh] [&_img]:object-contain [&_video]:max-h-[52svh] [&_video]:w-auto [&_video]:mx-auto">
                    {f.media}
                  </div>
                </article>
              </StackingCardItem>
            ))}
          </StackingCards>
        </section>

        {/* 05 Architecture */}
        <section id="architektur" className="gutter section border-t border-line">
          <SectionHead no="05" kicker={t("Architektur", "Architecture")}
            title={<>{t("Ein Screen, drei Aufgaben, ", "One screen, three jobs, ")}<span className="font-serif font-normal italic tracking-normal">{t("kein Kampf um Aufmerksamkeit.", "no fight for attention.")}</span></>}>
            <p>{t("Während des Spiels stellt sich die Redaktion immer wieder dieselben drei Fragen: Was kommt als Nächstes? Was ist schon öffentlich? Was passiert gerade? Jede Frage hat bei mir ihre eigene Zone bekommen.", "During the match, editors keep asking the same three questions: what’s next? What’s already public? What’s happening right now? I gave each question its own zone.")}</p>
          </SectionHead>
          <div className="mt-16 grid gap-8 lg:grid-cols-12">
            <div className="relative lg:col-span-8">
              <img src={img("lt-hero")} alt={t("Cockpit mit nummerierten Zonen", "Cockpit with numbered zones")} loading="lazy" style={{ aspectRatio: ratio("lt-hero") }}
                className="w-full rounded-[8px] border border-line" />
              {zones.map((z) => (
                <button key={z.n} onMouseEnter={() => setZone(z.n)} onMouseLeave={() => setZone(null)} onFocus={() => setZone(z.n)} onBlur={() => setZone(null)}
                  aria-label={`${z.n}: ${z.t}`}
                  className={cn("absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-mono text-xs font-bold transition-all sm:h-9 sm:w-9",
                    zone === z.n ? "scale-125 bg-accent text-[#0d0d10]" : "bg-[#c8352a] text-white shadow-[0_0_0_6px_rgba(220,60,46,0.25)]")}
                  style={{ left: `${z.x}%`, top: `${z.y}%` }}>
                  {z.n}
                </button>
              ))}
            </div>
            <ol className="grid content-start gap-2 lg:col-span-4">
              {zones.map((z) => (
                <li key={z.n} onMouseEnter={() => setZone(z.n)} onMouseLeave={() => setZone(null)}
                  className={cn("flex gap-4 rounded-[6px] border p-4 transition-colors", zone === z.n ? "border-accent bg-panel" : "border-line")}>
                  <span className="font-mono text-sm text-accent">{z.n}</span>
                  <span><b className="font-semibold">{z.t}</b><br /><span className="text-muted">{z.d}</span></span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 06 Mobile */}
        <section id="mobil" className="gutter section border-t border-line">
          <SectionHead no="06" kicker={t("Mobil", "Mobile")} title={t("Dieselbe Aufgabe, gedacht für einen Daumen.", "The same job, designed for one thumb.")}>
            <p>{t("Auf dem Handy musste ich etwas aufgeben. Drei Zonen gleichzeitig wären dort nur Lärm, also habe ich sie in drei Tabs geteilt: Editor, Ticker und Statistik. Den Überblick auf einen Blick gibt es mobil nicht mehr, dafür hat jede Aufgabe den ganzen Screen.", "On the phone I had to give something up. Three zones at once would just be noise there, so I split them into three tabs: editor, ticker and stats. The at-a-glance overview is gone on mobile, but each task gets the whole screen.")}</p>
          </SectionHead>
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-3 gap-4 sm:gap-10">
            {([["lt-m-coop", "Editor"], ["lt-m-ticker", "Ticker"], ["lt-m-stats", t("Statistik", "Stats")]] as [Id, string][]).map(([id, x], i) => (
              <Reveal key={id} delay={i * 0.08} className="text-center">
                <div className="overflow-hidden rounded-[22px] border-[6px] border-[#26262c] bg-black shadow-2xl">
                  <img src={img(id, true)} alt={`${t("Mobil: Tab", "Mobile: tab")} ${x}`} loading="lazy" style={{ aspectRatio: ratio(id) }} className="w-full" />
                </div>
                <p className="label mt-4">{x}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 07 Brand */}
        <section id="marke" className="section border-t border-line">
          <div className="gutter">
            <SectionHead no="07" kicker={t("Marke", "Brand")} title={t("Ein „Live“-Zeichen für ein Echtzeit-Werkzeug.", "A “live” mark for a real-time tool.")}>
              <p>
                {t("Das schräge LT-Monogramm steht für Bewegung, die schwarze Fläche lässt dem Spiel den Vortritt, und Rot nutze ich nur für Live-Momente. Die Schrift bleibt bewusst ruhig, denn das Werkzeug soll sich wie ein Kontrollraum anfühlen und nicht wie eine Consumer-App.", "The slanted LT monogram stands for motion, the black surface lets the match take centre stage, and I use red only for live moments. The type stays deliberately calm, because the tool should feel like a control room, not a consumer app.")}
              </p>
            </SectionHead>
            <Reveal className="mx-auto mt-16 max-w-5xl"><div className="flex justify-center rounded-[8px] border border-line bg-black py-10"><Pic id="lt-logo" alt={t("LiveTicker Logo", "LiveTicker logo")} zoom={false} className="w-full max-w-2xl" /></div></Reveal>
          </div>
          <div className="mt-6 overflow-hidden">
            <SimpleMarquee baseVelocity={22} repeat={4} slowdownOnHover slowDownFactor={0.2} className="w-full">
              {(["lt-var-1", "lt-var-2", "lt-var-3", "lt-var-4"] as Id[]).map((id) => (
                <div key={id} className="mx-3 h-40 shrink-0 overflow-hidden rounded-[4px] border border-line sm:h-52">
                  <img src={img(id, true)} alt="" loading="lazy" draggable={false} style={{ aspectRatio: ratio(id) }} className="h-full w-auto" />
                </div>
              ))}
            </SimpleMarquee>
          </div>
          <div className="gutter mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {palette.map(([n, hex]) => (
              <div key={hex} className="overflow-hidden rounded-[6px] border border-line">
                <div className="h-28" style={{ background: hex }} />
                <div className="p-4"><p className="font-semibold">{n}</p><p className="font-mono text-xs text-muted">{hex}</p></div>
              </div>
            ))}
          </div>
        </section>

        {/* 08 Trade-offs */}
        <Tradeoffs id="abwaegungen" no="08"
          intro={t("Nicht alles lag in meiner Hand. Diese Punkte gehören genauso zur Geschichte wie die Lösungen.", "Not everything was in my hands. These points are as much part of the story as the solutions.")}
          items={[
            [t("Die Modi standen fest.", "The modes were fixed."), t("Ob die KI schreibt, war schon entschieden. Ich habe mich deshalb ganz darauf konzentriert, wie viel Kontrolle die Redaktion behält.", "Whether the AI writes was already decided. So I focused entirely on how much control the editors keep.")],
            [t("Den Auto-Modus habe ich nur abgesichert.", "I only safeguarded auto mode."), t("Die KI-Technik dahinter war nicht meine Aufgabe. Mein Teil war die Schranke davor: Wer der KI mehr Macht gibt, muss das bestätigen.", "The AI technology behind it wasn’t my job. My part was the gate in front of it: whoever gives the AI more power has to confirm it.")],
            [t("Jede Sicherung kostet Sekunden.", "Every safeguard costs seconds."), t("In einem Werkzeug, das vom Tempo lebt, ist jede Rückfrage ein Preis. Ich habe ihn nur dort bezahlt, wo ein Fehler öffentlich sichtbar wird.", "In a tool that lives on speed, every extra question has a price. I only paid it where a mistake becomes publicly visible.")],
            [t("Mobil fehlt der Überblick.", "Mobile loses the overview."), t("Drei Zonen passen nicht auf ein Handy. Ich habe den Überblick aufgegeben und jeder Aufgabe einen eigenen Tab gegeben.", "Three zones don’t fit on a phone. I gave up the overview and gave each task its own tab.")],
            [t("Kein echter Live-Zustand in den Aufnahmen.", "No real live state in the recordings."), t("Als ich aufgenommen habe, gab es nur beendete Spiele. Der Zustand mit laufender Uhr ist deshalb meine Design-Absicht und keine Aufnahme.", "When I recorded, only finished matches were available. The state with a running clock is therefore my design intent, not a recording.")],
            [t("Gebaut hat es jemand anderes.", "Someone else built it."), t("Ich habe UX und Marke gemacht, ein Freund hat das Produkt entwickelt. Meine Entscheidungen mussten deshalb so klar sein, dass sie ohne mich umsetzbar sind.", "I did the UX and the brand; a friend developed the product. So my decisions had to be clear enough to build without me.")],
          ]} />

        {/* 09 Takeaways */}
        <section id="fazit" className="gutter section border-t border-line">
          <SectionHead no="09" kicker={t("Fazit", "Takeaways")} title={t("Was ich mitnehme.", "What I take away.")} />
          <div className="mt-16 grid gap-px border border-line bg-line sm:grid-cols-2">
            {proves.map(([x, d], i) => (
              <div key={x} className="bg-paper p-6 sm:p-8">
                <p className="font-mono text-xs text-accent">0{i + 1}</p>
                <h3 className="display mt-3 text-2xl">{x}</h3>
                <p className="mt-3 leading-relaxed text-muted">{d}</p>
              </div>
            ))}
          </div>
        </section>
      </CaseLayout>
      <Pager to="/ekkodale" label={t("Nächstes Projekt · 02", "Next project · 02")} title="ekkodale" />
      <Footer />
    </>
  )
}

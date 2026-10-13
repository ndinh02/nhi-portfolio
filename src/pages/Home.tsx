import type { ReactNode } from "react"
import { Link } from "react-router-dom"
import { motion, useReducedMotion } from "motion/react"
import Floating, { FloatingElement } from "@/fancy/parallax-floating"
import VerticalCutReveal from "@/fancy/vertical-cut-reveal"
import TextRotate from "@/fancy/text-rotate"
import { Footer, Nav, Reveal, SectionHead } from "@/components/ui"
import { useLang, useT } from "@/lib/i18n"
import { PaperFace } from "@/components/paper-face"
import { EkkodaleMotion, LiveTickerMotion, SiviCampMotion } from "@/components/case-motion"
import { Bloom, FallingPetals } from "@/components/sakura"

/* real sakura cut-outs where the posters used to float */
const blooms = [
  { n: 1, depth: 1.4, cls: "top-[32%] left-[3%] w-[min(7vw,12vh)]" },
  { n: 2, depth: 2.4, cls: "bottom-[4%] left-[12%] w-[min(5vw,9vh)]" },
  { n: 1, depth: 2, cls: "top-[9%] right-[9%] w-[min(5.5vw,10vh)] -scale-x-100" },
] as const

/* paper cut-outs of Nhi's face in the free side bands next to the text. Sized by width AND height,
   so they stay inside the one-screen hero on wide-but-short laptops too. */
const faces = [
  { face: 1, depth: 2, cls: "top-[52%] left-[5%] w-[min(12vw,22vh)] rotate-[-6deg]" },
  { face: 2, depth: 1.2, cls: "top-[44%] right-[4%] w-[min(13vw,24vh)] rotate-[5deg]" },
  { face: 3, depth: 2.6, cls: "top-[5%] left-[4%] w-[min(7.5vw,14vh)] rotate-[-4deg]" },
] as const

export default function Home() {
  const { lang, t } = useLang()
  const reduce = useReducedMotion()


  // previews: each personal project is introduced by the question it answers
  const own: { href: string; title: string; tag: string; bg: string; q: string }[] = [
    { href: "/projekte#studio", bg: "#ece6f5", title: "Studio", tag: t("KI-System · Research", "AI system · Research"),
      q: t("Wie liefert KI Research-Ergebnisse, ohne etwas zu erfinden?", "How can AI deliver research without making things up?") },
    { href: "/projekte#design-system", bg: "#e6e8f8", title: t("Design-System", "Design system"), tag: t("Pipeline · Storybook", "Pipeline · Storybook"),
      q: t("Wie kommt eine Änderung automatisch in jede App?", "How does one change reach every app automatically?") },
    { href: "/projekte#voicemeup", bg: "#e6f0e2", title: "voicemeup", tag: t("Produkt · App", "Product · App"),
      q: t("Wie verschickt man etwas Herzliches in unter einer Minute?", "How do you send something warm in under a minute?") },
    { href: "/projekte#jude", bg: "#fbe6d8", title: t("Jude Fan-Seite", "Jude fan site"), tag: t("Website · inoffiziell", "Website · unofficial"),
      q: t("Wie erzählt man eine Fußballkarriere auf einer einzigen Seite?", "How do you tell a football career on a single page?") },
    { href: "/projekte#archive-touch", bg: "#dfedf5", title: "Archive Touch", tag: t("Interface-Experiment", "Interface experiment"),
      q: t("Kann man ein Fotoarchiv nur mit der Hand bedienen?", "Can you browse a photo archive with just your hand?") },
    { href: "/projekte#desktop-pet", bg: "#fbefcf", title: "Desktop Pet", tag: "Electron · Pixel-Art",
      q: t("Was, wenn zwei kleine Figuren auf dem Desktop wohnen?", "What if two tiny characters lived on your desktop?") },
  ]

  return (
    <>
      <Nav />
      <main>
        {/* ---------- Hero ---------- */}
        <section className="relative flex min-h-[72svh] items-center justify-center overflow-hidden py-16 xl:min-h-[calc(100svh-var(--nav-h,4.25rem))] xl:py-[3vh]">
          <FallingPetals />
          <Floating sensitivity={-0.6} className="pointer-events-none hidden xl:block">
            {blooms.map((f, i) => (
              <FloatingElement key={`bloom-${i}`} depth={f.depth} className={f.cls}>
                <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.15, duration: 0.9 }}>
                  <Bloom n={f.n} className="h-auto w-full" delay={i * 0.8} />
                </motion.div>
              </FloatingElement>
            ))}
            {faces.map((f, i) => (
              <FloatingElement key={`face-${f.face}`} depth={f.depth} className={`pointer-events-auto ${f.cls}`}>
                <motion.div initial={{ opacity: 0, y: 30, rotate: -12 }} animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ delay: 0.9 + i * 0.2, type: "spring", stiffness: 160, damping: 14 }}>
                  <PaperFace face={f.face} delay={i * 0.35} />
                </motion.div>
              </FloatingElement>
            ))}
          </Floating>

          <div className="gutter relative z-10 text-center">
            {/* a quirky line about me instead of a job-title label: life as a journey, with a hand-drawn squiggle */}
            <p className="mx-auto mb-[clamp(0.75rem,2.5vh,1.5rem)] max-w-md font-serif text-[clamp(1.05rem,2.2vh,1.3rem)] italic leading-snug text-muted">
              {t("Ich erlebe das Leben als ", "I experience life as a ")}
              <span className="relative inline-block text-accent">
                {t("Reise", "journey")}
                <svg aria-hidden viewBox="0 0 100 14" preserveAspectRatio="none" className="absolute -bottom-1.5 left-0 h-2.5 w-full overflow-visible">
                  <motion.path d="M2 8 C 14 2, 22 13, 34 7 S 56 2, 66 8 S 86 13, 98 5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"
                    initial={reduce ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1.1, duration: 0.9, ease: "easeInOut" }} />
                </svg>
              </span>
              {t(": mit vielen Hobbys und kreativen Interessen, die ich unterwegs entdecke.", ", with lots of hobbies and creative interests to discover along the way.")}
            </p>
            <h1 className="display text-[clamp(2.8rem,min(9vw,10vh),8.5rem)]">
              <VerticalCutReveal key={lang} splitBy="characters" staggerDuration={0.025} staggerFrom="first"
                containerClassName="justify-center" wordLevelClassName="pb-[0.14em] -mb-[0.14em]"
                transition={{ type: "spring", stiffness: 200, damping: 21 }}>
                {t("Nhi Dinh gestaltet", "Nhi Dinh designs")}
              </VerticalCutReveal>
              <span className="mt-2 flex justify-center">
                <TextRotate key={lang}
                  texts={t(["Interfaces.", "Nutzerführung.", "Design-Systeme.", "Kampagnen."],
                    ["interfaces.", "user journeys.", "design systems.", "campaigns."])}
                  mainClassName="font-serif font-normal italic tracking-normal text-accent overflow-hidden pb-[0.3em] -mb-[0.2em]"
                  splitLevelClassName="overflow-hidden pb-[0.3em] -mb-[0.3em] pr-[0.08em] -mr-[0.08em]"
                  staggerFrom="last"
                  staggerDuration={0.02}
                  rotationInterval={2600}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-110%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                />
              </span>
            </h1>
            {/* positioning: who I am, what I do differently, proof, and where to go next */}
            <p className="mx-auto mt-[clamp(1rem,3vh,2.5rem)] max-w-xl text-lg leading-relaxed text-ink sm:text-[clamp(1.05rem,2.3vh,1.25rem)]">
              {t("Ich spreche zuerst mit den Menschen, die ein Produkt nutzen, gestalte dann in Figma und baue das Ergebnis als Komponenten in Storybook, damit das Team es direkt verwenden kann.",
                "I start by talking to the people who use a product, then design in Figma and build the result as components in Storybook, so the team can use it right away.")}
            </p>
            <dl className="mx-auto mt-[clamp(1rem,3vh,2.5rem)] grid max-w-2xl grid-cols-3 gap-px overflow-hidden rounded-[6px] border border-line bg-line text-left">
              {([
                ["0", t("Support-Anrufe nach meinem Relaunch der Karriereseite", "support calls after I relaunched the careers page"), "/ekkodale#karriereseite"],
                ["53", t("Komponenten, gestaltet und in Storybook gebaut", "components, designed and built in Storybook"), "/ekkodale#gaeco"],
                ["1 Mio.+", t("Views für die SiviCamp-Kampagne", "views for the SiviCamp campaign"), "/sivicamp"],
              ] as [string, string, string][]).map(([n, d, href]) => (
                <Link key={href} to={href} className="group bg-paper p-4 transition-colors hover:bg-panel sm:p-[clamp(0.75rem,1.8vh,1.25rem)]">
                  <dt className="display text-[clamp(1.6rem,min(3vw,4.5vh),2.4rem)]">{n}</dt>
                  <dd className="mt-1 text-xs leading-snug text-muted sm:text-sm">{d}</dd>
                </Link>
              ))}
            </dl>
            <div className="mt-[clamp(1rem,3vh,2.5rem)] flex flex-wrap items-center justify-center gap-3">
              <a href="#arbeiten" className="rounded-full bg-ink px-6 py-3 font-mono text-xs uppercase tracking-wider text-paper transition-opacity hover:opacity-85">{t("Arbeiten ansehen ↓", "See the work ↓")}</a>
              <a href="#kontakt" className="rounded-full border border-ink px-6 py-3 font-mono text-xs uppercase tracking-wider transition-colors hover:bg-ink hover:text-paper">{t("Kontakt aufnehmen", "Get in touch")}</a>
            </div>
            {/* phones: the floating collage is hidden, so the faces sit in a row */}
            <div className="mx-auto mt-10 flex max-w-xs items-end justify-center gap-2 xl:hidden">
              <Bloom n={1} className="w-[16%] self-start" />
              <PaperFace face={1} className="w-[30%] -rotate-6" />
              <PaperFace face={2} className="w-[36%]" delay={0.3} />
              <PaperFace face={3} className="w-[27%] rotate-6" delay={0.6} />
              <Bloom n={2} className="w-[16%] self-start" delay={1} />
            </div>
          </div>
        </section>

        {/* ---------- Three main cases, one format ---------- */}
        <section id="arbeiten" className="gutter section scroll-mt-20">
          <SectionHead className="mb-16" kicker={t("Ausgewählte Arbeiten", "Selected work")}
            title={<>{t("Drei Projekte, ", "Three projects, ")}<span className="font-serif font-normal italic tracking-normal text-accent">{t("drei gelöste Probleme.", "three solved problems.")}</span></>}>
            <p>{t("Jedes Projekt zeigt, wo es hakte, welche Einschränkung es gab und wie ich darauf reagiert habe.", "Each project shows what went wrong, which constraint there was and how I responded to it.")}</p>
          </SectionHead>
          <div className="grid gap-10 lg:gap-14">
            <FeatureCase to="/liveticker" no="01" bg="#0d0d10" fg="#f5f3ef" accent="#c9f24a" title="LiveTicker"
              kicker={t("UX-Beratung · KI-Modi · Marke", "UX consulting · AI modes · Brand")}
              line={t("Ich habe ein Redaktionswerkzeug gestaltet, das im Spieltempo funktioniert und bei dem man der KI nicht blind folgt.", "I designed a newsroom tool that keeps up with the match and never makes you follow the AI blindly.")}
              facts={[["3", t("KI-Modi mit Sicherungen gegen blindes Vertrauen", "AI modes with safeguards against blind trust")], ["5 s", t("zum Stornieren nach jeder Veröffentlichung", "to undo after every post")]]}
              visual={<LiveTickerMotion />} />
            <FeatureCase to="/ekkodale" no="02" bg="#075e58" fg="#ffffff" accent="#c9f0e6" title="ekkodale" flip
              kicker={t("UX-Research · Komponentenbibliothek · Marke", "UX research · Component library · Brand")}
              line={t("Ich habe die Karriereseite nach Interviews neu aufgebaut, eine Komponentenbibliothek gestaltet und in Storybook gebaut und ein KI-Produkt sichtbar gemacht.", "I rebuilt the careers page based on interviews, designed a component library and built it in Storybook, and made an AI product visible.")}
              facts={[["53", t("Komponenten in meiner Storybook-Bibliothek", "components in my Storybook library")], ["5", t("Kernkunden für hugo nach meiner Webinar-Kampagne", "key clients for hugo after my webinar campaign")]]}
              visual={<EkkodaleMotion />} />
            <FeatureCase to="/sivicamp" no="03" bg="#1a0d3d" fg="#f6efff" accent="#cab1fd" title="SiviCamp 2026"
              kicker={t("Kampagne · Marke · Website · freiberuflich", "Campaign · Brand · Website · freelance")}
              line={t("Ich habe eine Kampagne von der ersten Idee bis zum Event begleitet, mit eigener Marke, 39 Vorlagen, Website und Merch.", "I took a campaign from the first idea all the way to the event, with its own brand, 39 templates, a website and merch.")}
              facts={[["1 Mio.+", t("Views auf Facebook und Instagram", "views on Facebook and Instagram")], ["80/100", t("bezahlte Plätze verkauft", "paid seats sold")]]}
              visual={<SiviCampMotion />} />
          </div>
        </section>

        {/* ---------- How I work + toolkit: the section that matters most, in a calm dark ink with a sakura accent ---------- */}
        <section id="arbeitsweise" className="gutter section scroll-mt-20 bg-paper text-ink"
          style={{ ["--paper" as string]: "#1d1b24", ["--color-paper" as string]: "#1d1b24", ["--ink" as string]: "#ffffff", ["--color-ink" as string]: "#ffffff", ["--muted" as string]: "#c8c4d2", ["--color-muted" as string]: "#c8c4d2", ["--line" as string]: "rgba(255,255,255,0.18)", ["--color-line" as string]: "rgba(255,255,255,0.18)", ["--accent" as string]: "#f5a3c0", ["--color-accent" as string]: "#f5a3c0", ["--panel" as string]: "#26232f", ["--color-panel" as string]: "#26232f" }}>
          <SectionHead kicker={t("Wie ich arbeite", "How I work")}
            title={<>{t("Vom Gespräch mit Nutzern ", "From talking to users ")}<span className="font-serif font-normal italic tracking-normal text-accent">{t("bis zur ausgelieferten Komponente.", "to a shipped component.")}</span></>}>
            <p>{t("Ich höre mir zuerst an, wo es hakt, und baue daraus Struktur, Design und am Ende wiederverwendbare Bausteine. Jedes Werkzeug unten führt zu dem Projekt, in dem ich es eingesetzt habe.",
              "I start by listening to where things go wrong, then turn that into structure, design and finally reusable building blocks. Every tool below links to the project where I used it.")}</p>
          </SectionHead>
          <ol className="mt-16 grid gap-px overflow-hidden rounded-[6px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-5">
            {([
              [t("Verstehen", "Understand"), t("Interviews, Research-Bericht, Problem schärfen", "Interviews, research report, sharpening the problem")],
              [t("Strukturieren", "Structure"), t("Informationsarchitektur, Abläufe, Zonen", "Information architecture, flows, zones")],
              [t("Gestalten", "Design"), t("Figma-Prototyp, Varianten, Marke", "Figma prototype, variants, brand")],
              [t("Systematisieren", "Systemise"), t("Komponenten, Tokens, Storybook", "Components, tokens, Storybook")],
              [t("Ausliefern", "Ship"), t("Versioniertes Paket, CI, Barrierefreiheit", "Versioned package, CI, accessibility")],
            ] as [string, string][]).map(([k, d], i) => (
              <li key={k} className="bg-paper p-6">
                <p className="font-mono text-xs text-accent">0{i + 1}</p>
                <p className="display mt-3 text-2xl">{k}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </li>
            ))}
          </ol>
          <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {([
              [t("Research & UX", "Research & UX"), [
                [t("Nutzerinterviews", "User interviews"), "/ekkodale#karriereseite"], [t("Research-Bericht", "Research report"), "/ekkodale#karriereseite"],
                [t("Informationsarchitektur", "Information architecture"), "/liveticker"], [t("KI-Vertrauen & Sicherungen", "AI trust & safeguards"), "/liveticker"],
                [t("Barrierefreiheit (WCAG)", "Accessibility (WCAG)"), "/ekkodale#gaeco"]]],
              [t("Design & Prototyping", "Design & prototyping"), [
                [t("Figma: Komponenten & Varianten", "Figma: components & variants"), "/projekte#hf11"], [t("Figma: Prototyping & Scroll-Effekte", "Figma: prototyping & scroll effects"), "/projekte#hf11"],
                ["Figma Make", "/liveticker"], ["Affinity Designer", "/ekkodale"], [t("Markensysteme", "Brand systems"), "/sivicamp"]]],
              [t("Design-Systeme & Code", "Design systems & code"), [
                ["Storybook", "/ekkodale#gaeco"], ["React & TypeScript", "/projekte#voicemeup"], ["Mantine", "/ekkodale#gaeco"],
                ["Design Tokens", "/projekte#design-system"], ["Astro & Keystatic CMS", "/ekkodale#gaeco"]]],
              [t("Auslieferung", "Delivery"), [
                ["GitHub Actions", "/projekte#design-system"], ["Changesets", "/projekte#design-system"], ["Chromatic", "/projekte#design-system"],
                ["Azure DevOps", "/ekkodale#gaeco"], ["TYPO3", "/ekkodale#karriereseite"], ["Vercel", "/projekte#voicemeup"]]],
            ] as [string, [string, string][]][]).map(([group, items]) => (
              <div key={group}>
                <p className="label border-b border-line pb-3">{group}</p>
                <ul className="mt-3">
                  {items.map(([name, href]) => (
                    <li key={name}>
                      <Link to={href} className="group flex items-center justify-between gap-3 border-b border-line py-3 hover:text-accent">
                        <span>{name}</span><span aria-hidden className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-accent">→</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Own projects, grouped like the /projekte page ---------- */}
        <section className="gutter section border-t border-line">
          <SectionHead kicker={t("Eigene Projekte", "Personal projects")}
            title={t("Was ich neben der Arbeit gestalte und baue.", "What I design and build alongside my job.")}>
            <p>
              {t("Jedes Projekt beginnt mit einer Frage.", "Every project starts with a question.")}{" "}
              <Link to="/projekte" className="underline underline-offset-4 hover:text-accent">{t("Alle Projekte ansehen →", "See all projects →")}</Link>
            </p>
          </SectionHead>
          {([[t("UX/UI & Web", "UX/UI & web"), own.slice(0, 4)], [t("Experimente", "Experiments"), own.slice(4)]] as [string, typeof own][]).map(([group, items]) => (
            <div key={group} className="mt-16">
              <h3 className="label mb-6 border-b border-line pb-3">{group}</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4 lg:gap-x-8">
                {items.map((m, i) => (
                  <Reveal key={m.href} delay={i * 0.05}>
                    <Link to={m.href} className="group block">
                      <div className="flex aspect-[4/3] flex-col justify-between overflow-hidden rounded-[3px] p-4 text-[#141312] sm:p-6" style={{ background: m.bg }}>
                        <span aria-hidden className="hidden font-mono text-xl leading-none opacity-40 sm:block">?</span>
                        <p className="font-serif text-[0.95rem] italic leading-[1.2] transition-transform duration-700 group-hover:-translate-y-1 sm:text-[clamp(1.15rem,1.6vw,1.5rem)] sm:leading-[1.15]">{m.q}</p>
                      </div>
                      <p className="label mt-4">{m.tag}</p>
                      <h4 className="mt-1 text-lg leading-snug">{m.title}</h4>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </>
  )
}

/* One featured case: brand panel with visuals on one side, the story and two proven results on the other */
function FeatureCase({ to, no, bg, fg, accent, title, kicker, line, facts, visual, flip }: {
  to: string; no: string; bg: string; fg: string; accent: string; title: string; kicker: string; line: string
  facts: [string, string][]; visual: ReactNode; flip?: boolean
}) {
  const t = useT()
  return (
    <Reveal>
      <Link to={to} className="group grid overflow-hidden rounded-[8px] lg:min-h-[34rem] lg:grid-cols-12" style={{ background: bg, color: fg }}>
        <div className={`relative min-h-[20rem] lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>{visual}</div>
        <div className={`flex flex-col justify-between gap-10 p-7 sm:p-10 lg:col-span-5 ${flip ? "lg:order-1" : ""}`}>
          <div>
            <p className="font-mono text-xs uppercase tracking-wider" style={{ color: accent }}>{no} · {kicker}</p>
            <h3 className="display mt-4 text-[clamp(2.4rem,4.6vw,4.4rem)]">{title}</h3>
            <p className="mt-5 max-w-md text-lg leading-relaxed opacity-85">{line}</p>
          </div>
          <div>
            <dl className="grid grid-cols-2 gap-6 border-t pt-6" style={{ borderColor: `color-mix(in oklab, ${fg} 22%, transparent)` }}>
              {facts.map(([n, d]) => (
                <div key={n}>
                  <dt className="display text-[clamp(2rem,3.4vw,3rem)]">{n}</dt>
                  <dd className="mt-2 text-sm leading-snug opacity-80">{d}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-wider">
              {t("Case ansehen", "View case")}<span className="transition-transform duration-500 group-hover:translate-x-2" style={{ color: accent }}>→</span>
            </p>
          </div>
        </div>
      </Link>
    </Reveal>
  )
}

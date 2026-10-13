import { useEffect, useRef, useState, type ReactNode } from "react"
import { useLocation } from "react-router-dom"
import { motion } from "motion/react"
import { ChapterDemo, type Chapter } from "@/components/chapter-demo"
import { AutoVideo, Footer, More, Nav, Pager, Pic, Reveal, ScrambleKicker, SectionHead, type Id, Brief } from "@/components/ui"
import { PetStage } from "@/components/pet-stage"
import { ChapterClip, FxTile, Palette, Variants } from "@/components/figma-fx"
import { useLang } from "@/lib/i18n"
import { cn } from "@/lib/utils"

function Project({ id, no, kicker, title, meta, children, links, media, brief }: {
  id: string; no: string; kicker: string; title: ReactNode; meta: string[]; children: ReactNode
  links?: [string, string][]; media?: ReactNode; brief?: ReactNode
}) {
  return (
    <section id={id} className="gutter section scroll-mt-20 border-t border-line">
      <SectionHead no={no} kicker={kicker} title={title}>
        {children}
        <p className="label !mt-8 flex flex-wrap gap-x-5 gap-y-1">{meta.map((m) => <span key={m}>{m}</span>)}</p>
        {links && (
          <p className="!mt-4 flex flex-wrap gap-4">
            {links.map(([href, label]) => (
              <a key={href} href={href} target="_blank" rel="noreferrer" className="font-mono text-xs uppercase tracking-wider underline underline-offset-4 hover:opacity-70">
                {label} ↗
              </a>
            ))}
          </p>
        )}
      </SectionHead>
      {brief && <div className="mt-14">{brief}</div>}
      {media && <div className="mt-16">{media}</div>}
    </section>
  )
}

type Cat = "all" | "ux" | "other" | "practice"

/* Which filter each project belongs to */
const CAT: Record<string, Exclude<Cat, "all">> = {
  jude: "ux", voicemeup: "ux", studio: "ux", "design-system": "ux",
  "archive-touch": "other", "desktop-pet": "other",
  hf11: "practice", bershka: "practice",
}

function FilterBar({ value, onChange }: { value: Cat; onChange: (c: Cat) => void }) {
  const { t } = useLang()
  const opts: [Cat, string][] = [
    ["all", t("Alle", "All")], ["ux", t("UX/UI & Web", "UX/UI & web")], ["other", t("Experimente", "Experiments")], ["practice", t("Übungen", "Practice")],
  ]
  const count = (c: Cat) => (c === "all" ? Object.keys(CAT).length : Object.values(CAT).filter((x) => x === c).length)
  return (
    <div role="tablist" aria-label={t("Projekte filtern", "Filter projects")}
      className="inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-line bg-paper p-1 font-mono text-[0.7rem] uppercase tracking-wider sm:text-xs">
      {opts.map(([c, label]) => {
        const on = value === c
        return (
          <button key={c} type="button" role="tab" aria-selected={on} onClick={() => onChange(c)}
            className={cn("relative shrink-0 rounded-full px-3 py-2 transition-colors sm:px-4", on ? "text-paper" : "hover:text-ink")}>
            {/* the dark pill slides between tabs */}
            {on && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
            <span className="relative">{label} <span className={on ? "opacity-90" : "text-muted"}>{count(c)}</span></span>
          </button>
        )
      })}
    </div>
  )
}

/* Group heading: the page has three kinds of work, and each group says what it is before its projects start */
function Group({ title, text, count }: { title: string; text: string; count: number }) {
  const { t } = useLang()
  return (
    <div className="gutter border-t border-line bg-panel py-14 sm:py-16">
      <div className="grid gap-4 md:grid-cols-12">
        <p className="label md:col-span-3">{count} {t("Projekte", "projects")}</p>
        <div className="md:col-span-9">
          <h2 className="display text-[clamp(1.8rem,3.4vw,2.8rem)]">{title}</h2>
          <p className="mt-3 max-w-xl text-lg leading-relaxed text-muted">{text}</p>
        </div>
      </div>
    </div>
  )
}

/* A pipeline drawn as five connected steps: [name, tool, text]. The line fills in on scroll. */
function Pipeline({ steps }: { steps: [string, string, string][] }) {
  return (
    <motion.ol className="relative grid gap-10 lg:grid-cols-5 lg:gap-6"
      initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
      {/* connector: vertical on phones, horizontal on desktop */}
      <motion.span aria-hidden className="absolute left-[1.1rem] top-2 h-[calc(100%-1rem)] w-px origin-top bg-ink lg:hidden"
        variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1 } }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }} />
      <motion.span aria-hidden className="absolute left-4 right-4 top-[1.1rem] hidden h-px origin-left bg-ink lg:block"
        variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1 } }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }} />
      {steps.map(([name, tool, text], i) => (
        <motion.li key={i} className="relative grid grid-cols-[2.2rem_1fr] gap-4 lg:block"
          variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
          transition={{ delay: 0.15 + i * 0.18, duration: 0.5 }}>
          <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-ink bg-paper font-mono text-xs">{String(i + 1).padStart(2, "0")}</span>
          <div className="lg:mt-6">
            <p className="display text-2xl">{name}</p>
            <p className="label mt-2">{tool}</p>
            <p className="mt-3 max-w-xs leading-relaxed text-muted">{text}</p>
          </div>
        </motion.li>
      ))}
    </motion.ol>
  )
}

function ReleasePipeline() {
  const { t } = useLang()
  return <Pipeline steps={[
    [t("Ändern", "Change"), "Changesets", t("Jede Änderung bekommt eine kurze Notiz: Was ist neu, Patch oder Minor?", "Every change gets a short note: what’s new, patch or minor?")],
    [t("Prüfen", "Check"), "GitHub Actions · Chromatic", t("Jeder Pull Request: Lint, Build, Storybook-Build. Chromatic zeigt jede visuelle Änderung.", "Every pull request: lint, build, Storybook build. Chromatic shows every visual change.")],
    [t("Versionieren", "Version"), "Changesets Bot", t("Nach dem Merge öffnet ein Bot einen PR mit neuer Version und Changelog.", "After merging, a bot opens a PR with the new version and changelog.")],
    [t("Veröffentlichen", "Publish"), "GitHub Packages", t("Merge = Release. Jede Version genau einmal, ohne persönlichen Token.", "Merge = release. Every version exactly once, no personal token.")],
    [t("Nutzen", "Use"), "npm install", t("Apps wie Studio installieren eine feste Version, statt Code zu kopieren.", "Apps like Studio install a fixed version instead of copying code.")],
    ]} />
}

function StudioPipeline() {
  const { t } = useLang()
  return <Pipeline steps={[
    [t("Quellen", "Sources"), t("Interviews", "Interviews"), t("Interviews kommen ins Projekt. Beispieldaten sind markiert und zählen nie als echte Forschung.", "Interviews go into the project. Sample data is labelled and never counts as real research.")],
    [t("Planen", "Plan"), "Orchestrator", t("Ein Orchestrator stellt Rückfragen und verteilt die Arbeit an Fach-Agenten, etwa für Personas oder Journeys.", "An orchestrator asks follow-up questions and hands work to specialist agents, e.g. for personas or journeys.")],
    [t("Strukturieren", "Structure"), t("Typisierte Artefakte", "Typed artifacts"), t("Jedes Ergebnis muss in ein festes Schema passen: Persona, Journey Map, Design Brief und mehr.", "Every result must fit a fixed schema: persona, journey map, design brief and more.")],
    [t("Prüfen", "Verify"), "Server", t("Der Server prüft jedes Zitat gegen die Quelle und rechnet Kontrastwerte selbst nach.", "The server checks every quote against its source and recalculates contrast values itself.")],
    [t("Freigeben", "Approve"), t("Mensch im Loop", "Human in the loop"), t("Nichts landet auf dem Board ohne Freigabe durch einen Menschen.", "Nothing lands on the board without a human’s approval.")],
  ]} />
}

export default function Projekte() {
  const { t } = useLang()
  const [cat, setCat] = useState<Cat>("all")
  const show = (id: string) => cat === "all" || CAT[id] === cat
  const barRef = useRef<HTMLDivElement>(null)
  const { hash } = useLocation()
  // a deep link (e.g. /projekte#jude from the homepage) must never land on a hidden project
  useEffect(() => { if (hash) setCat("all") }, [hash])
  const pick = (c: Cat) => {
    setCat(c)
    const bar = barRef.current
    if (bar && bar.getBoundingClientRect().top < 0) bar.scrollIntoView({ block: "start" })
  }

  const vmChapters: Chapter[] = [
    { at: 0, title: t("Ticket gestalten", "Design the ticket"), text: t("Man wählt eine Farbe und zeichnet direkt aufs Ticket.", "You pick a colour and draw right onto the ticket.") },
    { at: 26, title: t("Sprachnachricht", "Voice message"), text: t("Man nimmt eine Sprachnachricht auf und hört sie an, auch in Safari.", "You record a voice message and play it back, Safari included.") },
    { at: 33, title: t("Foto hinzufügen", "Add a photo"), text: t("Ein Selfie kommt direkt aus der Kamera aufs Ticket.", "A selfie goes straight from the camera onto the ticket.") },
    { at: 43, title: t("Absender & Link", "Sender & link"), text: t("Man trägt seinen Namen ein, und das Ticket wird zu einem Link.", "You add your name and the ticket turns into a link.") },
    { at: 50, title: t("Fertiges Ticket", "Finished ticket"), text: t("Am Ende stecken Zeichnung, Foto und Stimme in einem kleinen Objekt.", "In the end, drawing, photo and voice all live in one small object.") },
  ]

  const atChapters: Chapter[] = [
    { at: 0, title: t("Pinch zum Starten", "Pinch to start"), text: t("Wenn man zwei Finger zusammenführt, startet das Archiv.", "Bringing two fingers together starts the archive.") },
    { at: 7, title: t("Zeigen zum Hovern", "Point to hover"), text: t("Der Zeigefinger steuert, und die Ordner leuchten auf, wenn man auf sie zeigt.", "Your index finger steers, and folders light up when you point at them.") },
    { at: 14, title: t("Ordner öffnen", "Open a folder"), text: t("Öffnet man einen Ordner, bauen sich die Fotos als Ring auf.", "When you open a folder, the photos form a ring.") },
    { at: 20, title: t("Durchblättern", "Browse"), text: t("Mit einer Handbewegung dreht man den Ring weiter.", "A movement of your hand turns the ring.") },
    { at: 30, title: t("Foto ansehen", "View a photo"), text: t("Wählt man ein Foto aus, füllt es den ganzen Raum.", "When you pick a photo, it fills the whole space.") },
  ]


  return (
    <>
      <Nav />
      <main className="dot-grid">
        <section className="gutter pb-16 pt-10 sm:pt-16">
          <ScrambleKicker text={`04 · ${t("Eigene Projekte", "Personal projects")}`} chars="+×÷~*/\\" className="text-ink" />
          <h1 className="display mt-6 max-w-6xl text-[clamp(2.6rem,7.4vw,7.5rem)]">
            {t("Neben der Arbeit: ", "Beyond work: ")}
            <span className="font-serif font-normal italic tracking-normal text-accent">{t("Interfaces, Systeme, Experimente.", "interfaces, systems, experiments.")}</span>
          </h1>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted">
            {t("Hier zeige ich Projekte, die ich neben der Arbeit gestaltet und meist auch selbst gebaut habe, jeweils mit KI-Unterstützung.", "Here are projects I designed alongside my job and mostly built myself, each with AI assistance.")}
          </p>
        </section>

        {/* solid band under the nav, so project text never runs underneath the pills */}
        <div ref={barRef} className="gutter sticky z-40 border-b border-line py-3 backdrop-blur-md"
          style={{ top: "var(--nav-h, 4.25rem)", background: "color-mix(in oklab, var(--paper) 90%, transparent)", scrollMarginTop: "var(--nav-h, 4.25rem)" }}>
          <FilterBar value={cat} onChange={pick} />
        </div>

        {(cat === "all" || cat === "ux") && <Group count={4} title={t("UX/UI & Web", "UX/UI & web")}
          text={t("Produkte und Websites, die ich gestaltet und selbst gebaut habe, vom KI-Werkzeug bis zur Fan-Seite.", "Products and websites I designed and built myself, from an AI tool to a fan site.")} />}

        {/* ---------- Studio ---------- */}
        {show("studio") && <Project id="studio"
          brief={<Brief why={t("Aus Interviews sollen schnell brauchbare Research-Ergebnisse werden, zum Beispiel Personas und Journey Maps.", "Interviews should quickly turn into usable research results, such as personas and journey maps.")}
            constraint={t("Ein Sprachmodell kann Zitate und Zahlen erfinden, und erfundene Research-Ergebnisse sind schlimmer als gar keine.", "A language model can invent quotes and numbers, and made-up research is worse than none.")}
            response={t("Deshalb entscheidet der Server, nicht das Modell: Er prüft jedes Zitat gegen die Quelle, rechnet Kontrastwerte selbst nach, markiert Beispieldaten, und nichts landet ohne menschliche Freigabe auf dem Board.", "So the server decides, not the model: it checks every quote against its source, recalculates contrast values itself, labels sample data, and nothing reaches the board without human approval.")} />} no="01" kicker={t("Studio · KI-System", "Studio · AI system")}
          title={t("Ein KI-Copilot für UX-Research, der nichts ohne Beleg behauptet.", "An AI copilot for UX research that claims nothing without evidence.")}
          meta={["Design & Build", "Pydantic AI, FastAPI, React", t("Mit KI-Unterstützung", "Made with AI assistance")]}
          media={<StudioPipeline />}>
          <p>
            {t("Studio macht aus Interviews Personas, Journey Maps und Design Briefs. Links läuft der Chat, rechts entstehen die Ergebnisse als Karten. Im Hintergrund prüft eine Pipeline jedes Ergebnis, bevor ein Mensch es freigibt.", "Studio turns interviews into personas, journey maps and design briefs. The chat runs on the left, and the results appear as cards on the right. In the background, a pipeline checks every result before a person approves it.")}
          </p>
        </Project>}

        {/* ---------- Design system ---------- */}
        {show("design-system") && <Project id="design-system"
          brief={<Brief why={t("Bei der Arbeit sahen Komponenten einzeln gut aus, passten auf echten Seiten aber nicht zusammen, und das Veröffentlichen war ein manueller Schritt mit persönlichem Zugangstoken.", "At work, components looked fine on their own but didn’t fit together on real pages, and publishing was a manual step with a personal access token.")}
            constraint={t("Ich wollte denselben Weg privat üben, konnte aber Azure DevOps dafür nicht nutzen, weil es für ein Übungsprojekt zu teuer ist.", "I wanted to practise the same path privately but couldn’t use Azure DevOps for it, because it’s too expensive for a practice project.")}
            response={t("Ich habe die Pipeline mit GitHub nachgebaut: Changesets für Versionen, Chromatic für visuelle Prüfung, GitHub Packages zum Veröffentlichen. Eine separate App installiert das Paket, erst das beweist, dass es funktioniert.", "I rebuilt the pipeline on GitHub: Changesets for versions, Chromatic for visual review, GitHub Packages for publishing. A separate app installs the package, which is what proves it works.")} />} no="02" kicker={t("Design-System · Pipeline", "Design system · Pipeline")}
          title={t("Vom Commit zum installierbaren Paket, ganz automatisch.", "From commit to installable package, fully automated.")}
          meta={["GitHub Actions", "Changesets", "Chromatic", "GitHub Packages", t("Mit KI-Unterstützung", "Made with AI assistance")]}
          media={<ReleasePipeline />}>
          <p>
            {t("Mir geht es hier nicht um die Komponenten, sondern um den Weg dorthin. Jede Änderung wird automatisch geprüft, bekommt eine Version und landet als Paket, das andere Apps installieren können.", "What matters to me here isn't the components but the path they take. Every change is checked automatically, gets a version number and ships as a package that other apps can install.")}
          </p>
        </Project>}

        {/* ---------- voicemeup ---------- */}
        {show("voicemeup") && <Project id="voicemeup"
          brief={<Brief why={t("Ich wollte, dass man in unter einer Minute etwas Herzliches verschicken kann, ganz ohne Konto.", "I wanted people to be able to send something warm in under a minute, without an account.")}
            constraint={t("Kamera, Mikrofon und Aufnahme laufen im Browser, und Safari ist dabei am strengsten. Dort brach die App zuerst.", "Camera, microphone and recording run in the browser, and Safari is the strictest about it. That’s where the app broke first.")}
            response={t("Ich habe Berechtigungen, Content-Security-Policy und Audio-Format an Safari angepasst, damit derselbe Link auf iPhone und Desktop funktioniert.", "I adapted permissions, content security policy and audio format to Safari so the same link works on iPhone and desktop.")} />} no="03" kicker={t("voicemeup · Produkt", "voicemeup · Product")}
          title={t("Eine Nachricht in Ticketform: Zeichnung, Stimme, Foto.", "A message shaped like a ticket: drawing, voice, photo.")}
          meta={["Design & Build", "React, Vite, Vercel", t("Mit KI-Unterstützung", "Made with AI assistance")]}
          links={[["https://github.com/ndinh02/voicemeup", t("Quellcode", "Source code")]]}
          media={
            <Reveal>
              {/* one compact, centred unit: phone on the left, a narrow chapter list beside it */}
              <div className="rounded-[10px] border border-line bg-panel px-6 py-12 sm:px-10 md:py-16">
                <ChapterDemo src="/video/vm-demo.mp4" label={t("voicemeup Demo: Ticket gestalten, Sprachnachricht aufnehmen, Link teilen", "voicemeup demo: design a ticket, record a voice message, share the link")}
                  chapters={vmChapters}
                  className="mx-auto max-w-3xl items-center md:grid-cols-[17rem_minmax(0,22rem)] md:justify-center md:gap-16"
                  videoClassName="mx-auto max-w-[17rem] rounded-[28px] border-[6px] !border-ink bg-ink shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)]" />
              </div>
            </Reveal>
          }>
          <p>
            {t("Man gestaltet ein Ticket mit Zeichnung, Sprachnachricht und Foto und verschickt es als Link. So wird aus einem simplen Link ein kleines Objekt, das man gern öffnet.", "You design a ticket with a drawing, a voice message and a photo and send it as a link. That turns a simple link into a small object you actually want to open.")}
          </p>
        </Project>}

        {/* ---------- Jude fan site ---------- */}
        {show("jude") && <Project id="jude"
          brief={<Brief why={t("Als Fan wollte ich Karriere, Rekorde und die großen Spiele auf einer einzigen Seite erzählen.", "As a fan, I wanted to tell his career, records and defining matches on a single page.")}
            constraint={t("Die Zahlen ändern sich weiter, weil seine Karriere läuft. Und die Fotos sind Pressebilder, für die ich keine Lizenz habe.", "The numbers keep changing because his career is ongoing. And the photos are press images I have no licence for.")}
            response={t("Alle Zahlen kommen aus einer einzigen Datendatei, und Summen werden berechnet statt eingetippt. Die Seite ist als inoffiziell gekennzeichnet und nicht für Suchmaschinen freigegeben.", "Every number comes from one data file, and totals are computed rather than typed. The page is labelled unofficial and hidden from search engines.")} />} no="04" kicker={t("Fan-Website · inoffiziell", "Fan website · unofficial")}
          title={t("Eine Fan-Seite über Jude Bellingham.", "A fan site about Jude Bellingham.")}
          meta={["Design & Build", "JavaScript, GSAP, Lenis", t("Fan-Projekt", "Fan project"), t("Mit KI-Unterstützung", "Made with AI assistance")]}
          media={
            <Reveal className="mx-auto max-w-5xl">
              <AutoVideo src="/video/jude.webm" label={t("Aufnahme der Fan-Website über Jude Bellingham", "Recording of the Jude Bellingham fan website")}
                className="rounded-[8px] border border-line bg-black shadow-xl" />
            </Reveal>
          }>
          <p>
            {t("Ein One-Pager über seine Karriere, seine Rekorde und die großen Spiele, mit Scroll-Animationen, die die Geschichte Kapitel für Kapitel erzählen.", "A one-pager about his career, his records and his defining matches, with scroll animations that tell the story chapter by chapter.")}
          </p>
        </Project>}

        {(cat === "all" || cat === "other") && <Group count={2} title={t("Experimente", "Experiments")}
          text={t("Hier probiere ich neue Arten der Bedienung aus: mit der Hand statt mit der Maus, oder mit Figuren direkt auf dem Desktop.", "Here I try out new ways of interacting: with your hand instead of a mouse, or with characters right on the desktop.")} />}

        {/* ---------- Archive Touch ---------- */}
        {show("archive-touch") && <Project id="archive-touch"
          brief={<Brief why={t("Ich wollte ausprobieren, ob man ein Fotoarchiv ganz ohne Maus und Tastatur bedienen kann.", "I wanted to find out whether a photo archive can be used without a mouse or keyboard.")}
            constraint={t("Handerkennung ist ungenau. Eine zufällige Bewegung kann schnell wie ein Befehl aussehen.", "Hand tracking is imprecise. A random movement can easily look like a command.")}
            response={t("Ich habe die Ziele groß und farbig gemacht und jede Geste mit klaren Schwellenwerten und einer kurzen Haltezeit abgesichert.", "I made the targets big and colourful and secured every gesture with clear thresholds and a short hold time.")} />} no="05" kicker={t("Archive Touch · Interface-Experiment", "Archive Touch · Interface experiment")}
          title={t("Ein Fotoarchiv, das man nur mit der Hand bedient.", "A photo archive you control with your hand only.")}
          meta={["Design & Build", "React Three Fiber, GSAP, MediaPipe", t("Mit KI-Unterstützung", "Made with AI assistance")]}
          links={[["https://github.com/ndinh02/motion_tracking_gallery", t("Quellcode", "Source code")]]}
          media={
            <Reveal className="mx-auto max-w-6xl">
              <ChapterDemo src="/video/at-demo.mp4" label={t("Archive Touch Demo: Pinch zum Starten, Ordner zeigen und öffnen, Fotos per Handbewegung durchblättern", "Archive Touch demo: pinch to start, point at and open folders, browse photos by hand")}
                chapters={atChapters} className="lg:grid-cols-[2fr_1fr]" videoClassName="rounded-[6px]" />
            </Reveal>
          }>
          <p>
            {t("Hier gibt es weder Maus noch Tastatur. Man startet mit einer Pinch-Geste und wählt durch Zeigen aus. Die Ordner habe ich groß und farbig gestaltet, damit man sie auch mit einer ungenauen Handbewegung gut trifft.", "There's no mouse and no keyboard here. You start with a pinch and select by pointing. I made the folders big and colourful so they're easy to hit even with an imprecise hand.")}
          </p>
        </Project>}

        {/* ---------- Desktop Pet ---------- */}
        {show("desktop-pet") && <Project id="desktop-pet"
          brief={<Brief why={t("Ich wollte meine gezeichneten Figuren als kleine Begleiter auf dem Desktop haben.", "I wanted my drawn characters as little companions on the desktop.")}
            constraint={t("Das Fenster liegt über dem ganzen Bildschirm, darf aber keinen Klick schlucken. Und pro Richtung gibt es nur ein einziges Bild.", "The window covers the whole screen but must not swallow any click. And there is only one image per direction.")}
            response={t("Das Fenster ignoriert die Maus und reagiert nur, solange der Zeiger über einer Figur steht. Die Bewegung entsteht im Code durch Hüpfen, Stauchen und Atmen.", "The window ignores the mouse and only reacts while the pointer is over a character. The motion comes from code: hopping, squashing and breathing.")} />} no="06" kicker="Desktop Pet · Electron"
          title={t("Ein Hase und ein Pinguin, die über den Bildschirm laufen.", "A bunny and a penguin that walk across your screen.")}
          meta={["Design & Build", "Electron, Pixel-Art", t("Figuren selbst gezeichnet, 360°-Ansichten mit KI", "Characters drawn by me, 360° views made with AI")]}
          media={
            <>
            <Reveal><PetStage /></Reveal>
            <p className="label mb-4 mt-16">{t("Das sind meine Zeichnungen, mit acht Ansichten pro Figur.", "These are my drawings, with eight views per character.")}</p>
            <div className="grid gap-6 md:grid-cols-2">
              <Reveal><Pic id="st-bunny" alt={t("Selbst gezeichnetes Pixel-Maskottchen Hase in acht Ansichten", "Hand-drawn pixel mascot bunny in eight views")} className="rounded-[6px]" /></Reveal>
              <Reveal delay={0.06}><Pic id="st-penguin" alt={t("Selbst gezeichnetes Pixel-Maskottchen Pinguin in acht Ansichten", "Hand-drawn pixel mascot penguin in eight views")} className="rounded-[6px]" /></Reveal>
            </div>
            </>
          }>
          <p>
            {t("Ich habe zwei Pixel-Figuren gezeichnet, die über den Desktop laufen, sich ausruhen und sich hochheben lassen. Unten laufen die beiden live im Rahmen, probieren Sie es gern aus.", "I drew two pixel characters that walk across the desktop, take breaks and can be picked up. Below, both of them run live inside the frame, so feel free to try it.")}
          </p>
        </Project>}

        {(cat === "all" || cat === "practice") && <Group count={2} title={t("Übungen", "Practice")}
          text={t("Figma-Übungen, mit denen ich gezielt Prototyping und mobile Muster trainiert habe.", "Figma exercises I used to deliberately train prototyping and mobile patterns.")} />}

        {/* ---------- Practice: Figma exercises ---------- */}
        {show("hf11") && <Project id="hf11"
          brief={<Brief why={t("Ich wollte ausprobieren, wie weit dynamisches Scrollen in einem Figma-Prototyp geht.", "I wanted to find out how far dynamic scrolling goes in a Figma prototype.")}
            constraint={t("In Figma ist es schwierig, beim Scrollen das Richtige zur richtigen Zeit auszulösen.", "In Figma it’s hard to trigger the right thing at the right time while scrolling.")}
            response={t("Ich habe jede Bewegung als eigene Komponente mit Varianten gebaut, etwa die Headline, die Spec-Balken und das Karussell. So konnte ich jeden Zustand einzeln steuern und testen.", "I built every movement as its own component with variants, such as the headline, the spec bars and the carousel. That let me control and test each state separately.")} />} no="07" kicker={t("Übung · Konzept", "Practice · Concept")}
          title={t("Eine Launch-Seite für ein Auto, in Schwarz-Weiß.", "A launch page for a car, in black and white.")}
          meta={["Figma", t("Komponenten & Varianten", "Components & variants"), t("Mit KI-Unterstützung", "Made with AI assistance")]}
          media={
            <div>
              <p className="label mb-5 mt-16 first:mt-0">{t("Farben", "Colours")}</p>
              <Palette colors={[["Carbon", "#1e1e1e"], ["Studiograu", "#a9a9a9"], ["Weiß", "#ffffff"], ["Oilstain-Orange", "#d03700"], ["Schwarz", "#000000"]]} />
              <p className="label mb-5 mt-16 first:mt-0">{t("Der Prototyp in vier Kapiteln · aus Figma aufgenommen", "The prototype in four chapters · recorded from Figma")}</p>
              <div className="grid gap-x-8 gap-y-10 md:grid-cols-3">
                <ChapterClip className="md:col-span-3" no="01" src="/video/hf-hero.mp4" title={t("Hero", "Hero")}
                  text={t("Das Auto dreht sich ins Bild, dann fährt „THE NEW AGE“ ein und die Spec-Balken bauen sich auf.", "The car turns into view, then “THE NEW AGE” slides in and the spec bars build up.")} />
                <ChapterClip no="02" src="/video/hf-maniacs.mp4" title="Maniacs"
                  text={t("Das MANIAC*-Typoband läuft durch und öffnet ein Fenster auf das Foto dahinter.", "The MANIAC* type band runs through and opens a window onto the photo behind it.")} />
                <ChapterClip no="03" src="/video/hf-mission.mp4" title={t("Mission", "Mission")}
                  text={t("Das Karussell blättert mit Pfeilen durch die Rennstrecke.", "The carousel moves through the race track with arrows.")} />
                <ChapterClip no="04" src="/video/hf-finale.mp4" title={t("Finale", "Finale")}
                  text={t("Zum Schluss steht die große Zeile „Descend into madness with your HF 11“.", "It ends with the big line “Descend into madness with your HF 11”.")} />
              </div>
              <p className="label mb-5 mt-16 first:mt-0">{t("Komponenten · als Varianten gebaut", "Components · built as variants")}</p>
              <div className="max-w-sm">
                <FxTile title={t("Der Fotostreifen wechselt durch sechs Bilder.", "The photo strip cycles through six images.")} how={t("Sechs Varianten · eine Komponente", "Six variants · one component")}>
                  <Variants ids={["fx-hf-strip-1", "fx-hf-strip-2", "fx-hf-strip-3", "fx-hf-strip-4", "fx-hf-strip-5", "fx-hf-strip-6"] as Id[]} delay={1100} alt="HF-11 Fotos" />
                </FxTile>
              </div>
            </div>
          }>
          <p>
            {t("Für den HF-11 habe ich einen fiktiven Auftritt entworfen, mit Schwarz-Weiß-Fotos, einer roten Akzentfarbe und großer Typografie. Die Bewegungen habe ich als Figma-Komponenten mit Varianten gebaut, unten spielen sie so ab wie im Prototyp.", "For the HF-11 I designed a fictional presence with black-and-white photos, one red accent and big type. I built the motion as Figma components with variants, and below they play just like in the prototype.")}
          </p>
          <More>
            <p>{t("Inoffiziell und nicht mit Oilstainlab verbunden. Die Fotos gehören ihren Urhebern.", "Unofficial and not affiliated with Oilstainlab. The photos belong to their owners.")}</p>
          </More>
        </Project>}

        {show("bershka") && <Project id="bershka"
          brief={<Brief why={t("Ich wollte verstehen, wie sich eine gute mobile Shopping-Erfahrung anfühlt.", "I wanted to understand what a good mobile shopping experience feels like.")}
            constraint={t("Einige Scroll-Effekte waren schwer genau nachzubauen, zum Beispiel wie das große Logo beim Scrollen in den Header wandert.", "Some scrolling effects were hard to recreate exactly, for example how the big logo moves into the header as you scroll.")}
            response={t("Ich habe den Ablauf auf mehrere Screens aufgeteilt, auf denen das Logo Schritt für Schritt in den Header wandert, statt alles in einen einzigen Screen zu packen.", "I split the flow across several screens in which the logo moves into the header step by step, instead of packing everything into a single screen.")} />} no="08" kicker={t("Übung · UI-Nachbau", "Practice · UI recreation")}
          title={t("Die Bershka-App nachgebaut, um von ihr zu lernen.", "Recreating the Bershka app to learn from it.")}
          meta={["Figma", t("Mobile UI", "Mobile UI"), t("Mit KI-Unterstützung", "Made with AI assistance")]}
          media={
            <div className="mx-auto max-w-xs">
              <FxTile title={t("Beim Scrollen schrumpft das Logo in den Header.", "As you scroll, the logo shrinks into the header.")} how={t("Drei Screens aus meiner Figma-Datei", "Three screens from my Figma file")}>
                <div className="mx-auto max-w-[17rem] overflow-hidden rounded-[26px] border-[6px] border-ink">
                  <Variants ids={["fx-br-1", "fx-br-2", "fx-br-3"] as Id[]} delay={1500} alt="Bershka App" />
                </div>
              </FxTile>
            </div>
          }>
          <p>
            {t("Ich habe den Startscreen einer echten Mode-App genau nachgebaut. So habe ich ihr Raster, ihre Abstände und Komponenten wirklich verstanden, statt sie mir nur anzusehen.", "I recreated the home screen of a real fashion app in detail. That's how I truly understood its grid, spacing and components instead of just looking at them.")}
          </p>
          <More>
            <p>{t("Reine Übung. Marke, Fotos und Inhalte gehören Bershka.", "Practice only. Brand, photos and content belong to Bershka.")}</p>
          </More>
        </Project>}
      </main>
      <Pager to="/liveticker" label={t("Zurück zum Anfang · 01", "Back to the start · 01")} title="LiveTicker" />
      <Footer />
    </>
  )
}

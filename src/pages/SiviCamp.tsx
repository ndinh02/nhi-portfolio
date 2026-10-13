import ScrambleIn from "@/fancy/scramble-in"
import DragElements from "@/fancy/drag-elements"
import StackingCards, { StackingCardItem } from "@/fancy/stacking-cards"
import { Footer, More, Nav, Pager, Pic, Reveal, SectionHead, Tradeoffs, img, ratio, type Id, Brief } from "@/components/ui"
import { CaseLayout } from "@/components/case-index"
import { useLang } from "@/lib/i18n"

/* Pixel-font kicker; it sits in the hero, so it scrambles in on load */
function PixelKicker({ text }: { text: string }) {
  return (
    <span className="font-pixel text-sm tracking-wide text-accent">
      <ScrambleIn text={text} scrambleSpeed={28} scrambledLetterCount={4}
        characters="#{}<>/_01" scrambledClassName="opacity-50" />
    </span>
  )
}

const templates: { id: Id; x: number; y: number; r: number; w: string }[] = [
  { id: "sc-tpl-title", x: 2, y: 6, r: -6, w: "w-[15rem]" },
  { id: "sc-tpl-carousel", x: 20, y: 18, r: 3, w: "w-[13rem]" },
  { id: "sc-tpl-long", x: 36, y: 2, r: -2, w: "w-[14rem]" },
  { id: "sc-tpl-quote", x: 52, y: 20, r: 5, w: "w-[13rem]" },
  { id: "sc-tpl-tiles", x: 66, y: 4, r: -4, w: "w-[13rem]" },
  { id: "sc-tpl-count", x: 80, y: 16, r: 4, w: "w-[12rem]" },
  { id: "sc-tpl-end", x: 12, y: 44, r: 2, w: "w-[12rem]" },
]

export default function SiviCamp() {
  const { t } = useLang()

  const facts = [
    [t("Auftraggeber", "Client"), t("SiviDuc e.V., Verband vietnamesischer Studierender in Deutschland", "SiviDuc e.V., association of Vietnamese students in Germany")],
    [t("Rolle", "Role"), t("Kampagne, Marke, Website und Merch, freiberuflich", "Campaign, brand, website and merch, freelance")],
    [t("Zeitraum", "Period"), "04–09/2026"],
    ["Event", t("17.–19.09.2026, Frankfurt am Main", "17–19 Sep 2026, Frankfurt am Main")],
  ]

  const phases: { date: string; title: string; text: string; ids: Id[] }[] = [
    {
      date: "14.06.",
      title: "Teaser: „Ai cũng có thể tham gia“",
      text: t("„Ai“ heißt auf Vietnamesisch „jeder“ und liest sich wie „AI“. Mit diesem Wortspiel wollte ich zeigen, dass der Hackathon auch für Leute ohne Informatik-Hintergrund offen ist.", "“Ai” means “anyone” in Vietnamese and reads like “AI”. I used the pun to show that the hackathon was open to people without a computer science background too."),
      ids: ["sc-01-teaser"],
    },
    {
      date: t("19.–30.06.", "19–30 Jun"),
      title: t("Anmeldung öffnet · Early Bird", "Registration opens · Early bird"),
      text: t("Ich habe das Ticket wie eine Bordkarte gestaltet, damit Frankfurt sich wie ein Reiseziel anfühlt.", "I designed the ticket like a boarding pass so Frankfurt would feel like a destination."),
      ids: ["sc-02-open", "sc-03-early"],
    },
    {
      date: t("Juli", "July"),
      title: t("SiviHack in fünf Slides", "SiviHack in five slides"),
      text: t("In fünf Slides habe ich erklärt, was SiviHack ist. Ordner und Programmfenster machen die vielen Infos leicht überfliegbar.", "In five slides I explained what SiviHack is. Folders and program windows make all that information easy to skim."),
      ids: ["sc-04-hack-1", "sc-04-hack-2", "sc-04-hack-3", "sc-04-hack-4", "sc-04-hack-5"],
    },
    {
      date: t("24.07.", "24 Jul"),
      title: t("Full Experience Pass · Sponsoren", "Full Experience Pass · Sponsors"),
      text: t("Statt vieler Einzeltickets gab es einen Pass für alles. Die Sponsoren habe ich in dieselbe Bildwelt geholt, damit sie Teil der Geschichte sind und nicht nur ein Logo am Rand.", "Instead of many separate tickets there was one pass for everything. I brought the sponsors into the same visual world so they became part of the story, not just a logo in the corner."),
      ids: ["sc-05-pass", "sc-sponsor"],
    },
    {
      date: "August",
      title: t("Die Jury zeigen", "Introducing the jury"),
      text: t("Ich habe die Jury wie Fundstücke in Ordnern vorgestellt. Bei einem Wettbewerb, den es vorher nie gab, schafft das Vertrauen.", "I introduced the jury like finds tucked into folders. For a competition that had never existed before, that built trust."),
      ids: ["sc-06-judges", "sc-06-judge"],
    },
    {
      date: t("Aug. bis Sep.", "Aug to Sep"),
      title: "Frankfurt, Top 10, Countdown",
      text: t("Mit der Stadttour, den Top 10 der Vorrunde und einem Countdown habe ich die Community bis zum Event bei der Stange gehalten.", "With the city tour, the top 10 of the first round and a countdown, I kept the community engaged right up to the event."),
      ids: ["sc-07-tour-1", "sc-08-top10", "sc-09-count"],
    },
  ]

  return (
    <>
      <Nav tone="sivi" />
      <CaseLayout className="pixel-grid" title={t("Kapitel", "Chapters")} chapters={[
        { id: "ausgangslage", label: t("Ausgangslage", "The brief") }, { id: "idee", label: t("Die Idee", "The idea") },
        { id: "vorlagen", label: t("Vorlagen-Kit", "Template kit") }, { id: "kampagne", label: t("Kampagnenverlauf", "Campaign timeline") },
        { id: "vor-ort", label: t("Vor Ort", "On site") }, { id: "website", label: "Website" },
        { id: "abwaegungen", label: t("Abwägungen", "Trade-offs") }, { id: "rolle", label: t("Meine Rolle", "My role") }]}>
        {/* ---------- Hero ---------- */}
        <section className="gutter pb-20 pt-10 sm:pt-16">
          <PixelKicker text="03 · SIVICAMP 2026 · {#} RAMMASTIC" />
          <h1 className="display mt-6 max-w-6xl text-[clamp(2.6rem,7.4vw,7.5rem)]">
            {t("Eine Kampagne als Universum: ", "A campaign as a universe: ")}
            <span className="font-serif font-normal italic tracking-normal text-accent">
              {t("80 von 100 Plätzen, über eine Million Views.", "80 of 100 seats, over a million views.")}
            </span>
          </h1>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted">
            {t("SiviCamp hatte 2026 zum ersten Mal einen Hackathon, und ich habe freiberuflich alles Visuelle übernommen, von der ersten Idee bis zur Bühnenwand. Das Schwierigste war dabei nicht die Gestaltung, sondern dass am Ende viele Leute im selben Look posten mussten, nicht nur ich.",
              "In 2026 SiviCamp had a hackathon for the first time, and I took on everything visual as a freelancer, from the first idea to the stage wall. The hardest part wasn’t the design itself, but that in the end lots of people had to post in the same look, not just me.")}
          </p>
        </section>

        <section className="gutter grid items-start gap-10 pb-24 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <Pic id="sc-keyvisual" eager alt={t("Key Visual: 3D-Logo {#} RAMmastic mit Schriftzug SiviCamp 2026", "Key visual: 3D logo {#} RAMmastic with SiviCamp 2026 lettering")} className="rounded-[4px]" />
          </Reveal>
          <dl className="grid gap-8 lg:col-span-5">
            {facts.map(([k, v]) => (
              <div key={k} className="border-t border-line pt-4">
                <dt className="label">{k}</dt>
                <dd className="mt-2 text-lg leading-snug">{v}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ---------- 01 Brief ---------- */}
        <section id="ausgangslage" className="gutter section border-t border-line">
          <SectionHead no="01" kicker={t("Ausgangslage", "The brief")}
            title={t("100 Plätze verkaufen, an Leute, die noch nie bei einem Hackathon waren.", "Sell 100 seats to people who had never been to a hackathon.")}>
            <p>
              {t("SiviCamp ist das Sommercamp für junge Vietnamesinnen und Vietnamesen in Deutschland. 2026 kam zum ersten Mal ein Hackathon dazu, und 100 bezahlte Plätze mussten verkauft werden, an Leute, von denen viele noch nie bei einem Hackathon waren.",
                "SiviCamp is the summer camp for young Vietnamese people in Germany. In 2026 it added a hackathon for the first time, and 100 paid seats had to be sold, to people many of whom had never been to a hackathon.")}
            </p>
            <More>
              <p>
                {t(<>Das Camp hatte drei Teile: den Hackathon <strong>SiviHack</strong>, die Stadttour <strong>SiviTour</strong> und
                  die Talentshow <strong>SiviTa</strong> mit Gala. Drei gemeinnützige Verbände haben es organisiert, Sponsoren wie FPT,
                  NVIDIA, VietinBank und Code4You haben es unterstützt.</>,
                <>The camp had three parts: the hackathon <strong>SiviHack</strong>, the city tour <strong>SiviTour</strong> and the
                  talent show <strong>SiviTa</strong> with a gala. Three non-profit associations organised it, with sponsors such as
                  FPT, NVIDIA, VietinBank and Code4You.</>)}
              </p>
              <p>
                {t("Mein Auftritt musste zwei Dinge schaffen: seriös genug für Sponsoren und verspielt genug für die Community.", "My design had to do two things at once: feel serious enough for sponsors and playful enough for the community.")}
              </p>
            </More>
          </SectionHead>
          <Brief className="mt-16"
            why={t("SiviCamp bekam 2026 zum ersten Mal einen Hackathon, und 100 bezahlte Plätze mussten verkauft werden.", "In 2026 SiviCamp added a hackathon for the first time, and 100 paid seats had to be sold.")}
            constraint={t("Viele aus der Zielgruppe waren noch nie bei einem Hackathon. Drei Verbände organisierten mit, der Auftritt musste Sponsoren und Community zugleich überzeugen, und posten sollte das ganze Orga-Team, nicht nur ich.", "Many in the audience had never been to a hackathon. Three associations co-organised, the look had to convince sponsors and the community at once, and the whole organising team was going to post, not just me.")}
            response={t("Ich habe einen Retro-Desktop als verspielte, aber klare Bildsprache gewählt, mit dem Wortspiel „Ai“ Nicht-Informatiker angesprochen und 39 Vorlagen mit Anleitung gebaut, damit jeder im selben Look posten konnte.", "I chose a retro desktop as a playful yet clear visual language, used the “Ai” pun to speak to non-coders, and built 39 templates with a guide so everyone could post in the same look.")}
            result={t("80 der 100 bezahlten Plätze waren verkauft, also 80 Prozent, und die Kampagne erreichte über eine Million Views.", "80 of the 100 paid seats sold, 80 percent, and the campaign reached over a million views.")} />
        </section>

        {/* ---------- 02 Idea / system ---------- */}
        <section id="idee" className="gutter section border-t border-line">
          <SectionHead no="02" kicker={t("Die Idee", "The idea")}
            title={<>{t("Der Desktop als Bühne: ", "The desktop as a stage: ")}<span className="font-serif font-normal italic tracking-normal">{t("Code trifft Kultur.", "code meets culture.")}</span></>}>
            <p>
              {t("„RAMmastic“ verbindet Arbeitsspeicher und Romantik. Daraus habe ich einen Retro-Desktop gemacht: Jeder Post ist ein Fenster, jede Information liegt in einem Ordner. So durfte die Kampagne verspielt sein und war trotzdem ordentlich genug für Sponsoren.", "“RAMmastic” blends computer memory and romance. I turned that into a retro desktop: every post is a window, and every piece of information sits in a folder. That let the campaign be playful and still tidy enough for sponsors.")}
            </p>
            <More>
              <p>
                {t("Ich habe zwei Display-Schriften mit klaren Rollen gewählt: Arcade Gamer für Titel und Toni Batac nur zum Hervorheben. Für den Fließtext nutze ich Helvetica, dazu kommt eine Palette aus Brand Purple, Plum und Blau.", "I chose two display fonts with clear roles: Arcade Gamer for titles and Toni Batac only for emphasis. Body text is set in Helvetica, alongside a palette of brand purple, plum and blue.")}
              </p>
            </More>
          </SectionHead>
          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {([
              ["sc-brandguide", t("Brand Guidelines", "Brand guidelines"), t("Logo, Schriften, Farben, Button-Stil", "Logo, fonts, colours, button style")],
              ["sc-colors", t("Farbsystem", "Colour system"), "Primary Purple, Accent Plum, Secondary Blue, Neutral"],
              ["sc-type", t("Typografie", "Typography"), "Arcade Gamer, Toni Batac, Helvetica"],
            ] as [Id, string, string][]).map(([id, label, detail], i) => (
              <Reveal key={id} delay={i * 0.08}>
                <Pic id={id} alt={`${label}: ${detail}`} className="rounded-[4px]" />
                <p className="label mt-4">{label}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ---------- 03 Template kit ---------- */}
        <section id="vorlagen" className="section border-t border-line">
          <div className="gutter">
            <SectionHead no="03" kicker={t("Vorlagen-Kit", "Template kit")}
              title={t("39 Vorlagen, damit das ganze Team im selben Look posten kann.", "39 templates so the whole team could post in the same look.")}>
              <p>
                {t("Ich konnte nicht jeden Post selbst machen, und das war auch nicht der Plan: Posten sollte das ganze Orga-Team. Also habe ich Vorlagen für Titel, Karussells, Zitate, Countdowns, Sponsoren und mehr gebaut und eine kurze Anleitung dazugeschrieben. So sah jeder Post gleich aus, egal wer ihn gemacht hat.", "I couldn’t make every post myself, and that wasn’t the plan anyway: the whole organising team was going to post. So I built templates for titles, carousels, quotes, countdowns, sponsors and more, and wrote a short guide to go with them. That way every post looked the same, no matter who made it.")}
              </p>
            </SectionHead>
            <p className="label mt-12 hidden md:block">↓ {t("Ziehen Sie die Vorlagen", "Drag the templates")}</p>
          </div>
          <div className="gutter mt-6 hidden md:block">
            <div className="relative h-[40rem] overflow-hidden rounded-[6px] border border-line bg-panel/60">
              <DragElements dragMomentum={false} className="h-full"
                itemStyles={templates.map((x) => ({ left: `${x.x}%`, top: `${x.y}%`, rotate: `${x.r}deg` }))}>
                {templates.map((x) => (
                  <div key={x.id} className={x.w}>
                    <img src={img(x.id, true)} alt="" draggable={false} style={{ aspectRatio: ratio(x.id) }}
                      className="pointer-events-none w-full rounded-[3px] shadow-[0_30px_60px_-25px_rgba(0,0,0,0.8)]" />
                  </div>
                ))}
              </DragElements>
            </div>
          </div>
          <div className="gutter mt-10 grid grid-cols-3 gap-3 md:hidden">
            {templates.slice(0, 6).map((x) => <Pic key={x.id} id={x.id} alt={t("Vorlage aus dem Kit", "Template from the kit")} className="rounded-[3px]" />)}
          </div>
        </section>

        {/* ---------- 04 Campaign ---------- */}
        <section id="kampagne" className="border-t border-line pt-24">
          <div className="gutter">
            <SectionHead no="04" kicker={t("Kampagnenverlauf", "Campaign timeline")}
              title={t("Sechs Phasen, eine Geschichte.", "Six phases, one story.")}>
              <p>
                {t("Die Kampagne lief von Juni bis September, und jede Phase hatte ihr eigenes Ziel. Das Bildsystem habe ich trotzdem bewusst nicht verändert, damit man jeden Post sofort wiedererkennt.", "The campaign ran from June to September, and each phase had its own goal. Even so, I deliberately didn’t change the visual system, so every post was instantly recognisable.")}
              </p>
            </SectionHead>
          </div>
          <StackingCards totalCards={phases.length} scaleMultiplier={0.03} className="gutter relative mt-16">
            {phases.map((p, i) => (
              <StackingCardItem key={i} index={i} className="h-[88svh]">
                <article className="flex h-[80svh] flex-col gap-8 overflow-hidden rounded-[8px] border border-line bg-panel p-6 shadow-[0_-20px_60px_-30px_rgba(0,0,0,0.9)] sm:p-10 lg:flex-row lg:gap-12">
                  <div className="lg:w-[30%] lg:shrink-0">
                    <p className="font-pixel text-sm text-accent">Phase {i + 1} · {p.date}</p>
                    <h3 className="display mt-4 text-[clamp(1.6rem,2.8vw,2.6rem)]">{p.title}</h3>
                    <p className="mt-5 max-w-sm text-lg leading-relaxed text-muted">{p.text}</p>
                  </div>
                  <div className="flex min-h-0 flex-1 items-center gap-3 overflow-x-auto pb-2 sm:gap-4">
                    {p.ids.map((id) => (
                      <img key={id} src={img(id)} alt={`${p.title}: ${t("Kampagnenpost", "campaign post")}`} loading="lazy"
                        style={{ aspectRatio: ratio(id) }}
                        className="h-full max-h-[62svh] w-auto shrink-0 rounded-[4px] object-contain lg:max-h-full" />
                    ))}
                  </div>
                </article>
              </StackingCardItem>
            ))}
          </StackingCards>
        </section>

        {/* ---------- 05 On site ---------- */}
        <section id="vor-ort" className="gutter section border-t border-line">
          <SectionHead no="05" kicker={t("Vor Ort", "On site")}
            title={t("Vom Screen auf die Bühne und auf die T-Shirts.", "From screen to stage to T-shirt.")}>
            <p>
              {t("Die Bühnenwand und das Camp-Shirt folgen demselben System wie die Posts. So hat sich das Event angefühlt wie die Kampagne, die dafür geworben hat.", "The stage wall and the camp shirt follow the same system as the posts. That made the event feel like the campaign that promoted it.")}
            </p>
          </SectionHead>
          <div className="mt-16 grid items-end gap-8 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <Pic id="sc-merch" alt={t("Camp-Shirt: Vorder- und Rückseite", "Camp shirt: front and back")} className="rounded-[4px] bg-white" />
              <p className="label mt-4">{t("Camp-Shirt", "Camp shirt")}</p>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-7">
              <Pic id="sc-irl-1" alt={t("Gruppenfoto der Teilnehmenden in den Camp-Shirts", "Group photo of participants in the camp shirts")} className="rounded-[4px]" />
              <p className="label mt-4">{t("Vor Ort", "On site")}</p>
            </Reveal>
          </div>
          <div className="mt-12 grid items-end gap-8 lg:grid-cols-12">
            <Reveal className="lg:col-span-5">
              <Pic id="sc-backdrop" alt={t("Entwurf der Bühnenwand mit Pixel-Landschaft und Sponsorenleiste", "Stage wall design with pixel landscape and sponsor bar")} className="rounded-[4px]" />
              <p className="label mt-4">{t("Bühnenwand · Entwurf", "Stage wall · Design")}</p>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-7">
              <Pic id="sc-backdrop-irl" alt={t("Die Bühnenwand vor Ort beim SiviCamp 2026", "The stage wall on site at SiviCamp 2026")} className="rounded-[4px]" />
              <p className="label mt-4">{t("Bühnenwand · Vor Ort", "Stage wall · On site")}</p>
            </Reveal>
          </div>
        </section>

        {/* ---------- 06 Website ---------- */}
        <section id="website" className="gutter section border-t border-line">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <SectionHead kicker={`06 · ${t("Website", "Website")}`} title={t("Von Wireframe bis Livegang, selbst gebaut.", "From wireframe to launch, built by me.")} className="md:grid-cols-1 [&>*]:md:col-span-1">
                <p>
                  {t("Die Eventseite habe ich selbst gestaltet und mit KI-Unterstützung gebaut. Sie bringt die Kampagne ins Web, mit Countdown, dem Programm als „Missionen“, einer Stadtkarte und den Tickets.", "I designed the event site myself and built it with AI assistance. It brings the campaign to the web, with a countdown, the programme as “missions”, a city map and the tickets.")}
                </p>
              </SectionHead>
              <a href="https://sividuc.org/sivicamp2026/" target="_blank" rel="noreferrer"
                className="mt-10 inline-flex items-center gap-2 rounded-full border border-accent px-5 py-3 font-mono text-xs uppercase tracking-wider text-accent transition-colors hover:bg-accent hover:text-paper">
                sividuc.org/sivicamp2026 ↗
              </a>
            </div>
            <Reveal className="lg:col-span-7">
              <div className="overflow-hidden rounded-[8px] border border-line bg-panel shadow-2xl">
                <div className="flex gap-1.5 border-b border-line px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <div tabIndex={0} className="scroll-shot relative h-[30rem] overflow-hidden" style={{ ["--frame-h" as string]: "30rem" }}>
                  <img src={img("sc-site-full")} alt={t("Die komplette SiviCamp-2026-Website als Scroll-Ansicht", "The full SiviCamp 2026 website as a scrolling view")} loading="lazy" className="w-full" />
                </div>
              </div>
              <p className="label mt-4">{t("Zum Scrollen: Maus darüber oder antippen", "To scroll: hover or tap")}</p>
            </Reveal>
          </div>

          {/* the first Figma draft, so the step from wireframe to launch is visible */}
          <div className="mt-20 grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="label">{t("Mein erster Entwurf in Figma", "My first draft in Figma")}</p>
              <p className="mt-4 max-w-sm text-lg leading-relaxed text-muted">
                {t("So hat die Seite angefangen. Ich habe zuerst Aufbau und Inhalte in Figma festgelegt, mit Platzhaltern statt fertiger Grafiken, und erst danach das Design ausgearbeitet.", "This is how the site started. I first set up the structure and content in Figma, with placeholders instead of finished graphics, and only then worked out the design.")}
              </p>
            </div>
            <Reveal className="lg:col-span-7">
              <div tabIndex={0} className="scroll-shot relative h-[26rem] overflow-hidden rounded-[8px] border border-line bg-white shadow-2xl">
                <img src={img("sc-figma-wire")} alt={t("Erster Figma-Entwurf der SiviCamp-Website", "First Figma draft of the SiviCamp website")} loading="lazy" />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ---------- 07 Trade-offs ---------- */}
        <Tradeoffs id="abwaegungen" no="07"
          intro={t("Eine Kampagne für drei Verbände, Sponsoren und eine Community zu machen, heißt, sich ständig zu entscheiden. Das hier waren die wichtigsten Abwägungen.", "Making a campaign for three associations, sponsors and a community means deciding all the time. These were the most important trade-offs.")}
          items={[
            [t("Seriös und verspielt zugleich.", "Serious and playful at once."), t("Der Auftritt musste Sponsoren und Community gleichzeitig überzeugen. Der Retro-Desktop war mein Mittelweg: verspielt in der Form, aber klar in der Ordnung.", "The look had to win over sponsors and the community at the same time. The retro desktop was my middle ground: playful in form, but clear in structure.")],
            [t("Nicht jeder Post kommt von mir.", "Not every post comes from me."), t("Das ganze Orga-Team hat gepostet. Statt alles selbst zu machen, habe ich 39 Vorlagen und eine Anleitung gebaut. Das System musste so einfach sein, dass es auch ohne mich funktioniert.", "The whole organising team posted. Instead of doing everything myself, I built 39 templates and a guide. The system had to be simple enough to work without me.")],
            [t("Ein Wortspiel statt Fachsprache.", "A pun instead of jargon."), t("Viele in der Zielgruppe kannten keine Hackathons. Statt Technik zu erklären, habe ich sie mit „Ai“ angesprochen, vietnamesisch für „jeder“.", "Many in the audience didn’t know what a hackathon was. Instead of explaining technology, I spoke to them with “Ai”, Vietnamese for “anyone”.")],
            [t("Ein Bildsystem, drei Monate lang.", "One visual system for three months."), t("Jede Phase hatte ein neues Ziel, aber ich habe das Bildsystem nicht verändert. So hat man jeden Post sofort wiedererkannt.", "Each phase had a new goal, but I didn’t change the visual system. That way every post was instantly recognisable.")],
            [t("Sponsoren als Teil der Geschichte.", "Sponsors as part of the story."), t("Sponsorenlogos stören schnell. Ich habe sie in dieselbe Bildwelt geholt, statt sie an den Rand zu schieben.", "Sponsor logos can easily get in the way. I brought them into the same visual world instead of pushing them to the edge.")],
            [t("Erst Aufbau, dann Design.", "Structure first, then design."), t("Bei der Website habe ich in Figma mit Platzhaltern angefangen und das Design bewusst erst ausgearbeitet, als Aufbau und Inhalte standen.", "For the website I started in Figma with placeholders and deliberately only worked out the design once structure and content were settled.")],
          ]} />

        {/* ---------- Role ---------- */}
        <section id="rolle" className="gutter section border-t border-line">
          <SectionHead kicker={t("Meine Rolle", "My role")} title={t("Alles Visuelle, von der Idee bis zum Event.", "Everything visual, from idea to event.")}>
            <ul className="grid gap-x-8 gap-y-4 text-lg sm:grid-cols-2">
              {[
                t("Kampagnenkonzept und Phasenplanung", "Campaign concept and phase planning"),
                t("Markenelemente, Farben und Schriften", "Brand elements, colours and type"),
                t("Vorlagen-Kit mit Anleitung", "Template kit with guide"),
                t("Posts für Facebook und Instagram", "Posts for Facebook and Instagram"),
                t("Website von Wireframe bis Livegang", "Website from wireframe to launch"),
                t("Merch, Bühnenwand und Eventgrafiken", "Merch, stage wall and event graphics"),
              ].map((x) => (
                <li key={x} className="flex gap-3 border-t border-line pt-4"><span className="font-pixel text-accent">›</span>{x}</li>
              ))}
            </ul>
          </SectionHead>
        </section>
      </CaseLayout>
      <Pager to="/projekte" label={t("Weiter · 04", "Next · 04")} title={t("Eigene Projekte", "Personal projects")} />
      <Footer />
    </>
  )
}

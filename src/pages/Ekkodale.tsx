import type { ReactNode } from "react"
import StackingCards, { StackingCardItem } from "@/fancy/stacking-cards"
import { AutoVideo, Brief, Footer, More, Nav, Pager, Pic, Reveal, RoleList, ScrambleKicker, SectionHead, Tradeoffs, img, ratio, type Id } from "@/components/ui"
import { CaseLayout } from "@/components/case-index"
import { useLang } from "@/lib/i18n"

/* One sub-project: heading, short copy, then its media in the same section */
function Sub({ id, no, kicker, title, children, media }: {
  id: string; no: string; kicker: string; title: ReactNode; children: ReactNode; media?: ReactNode
}) {
  return (
    <section id={id} className="gutter section scroll-mt-20 border-t border-line">
      <SectionHead no={no} kicker={kicker} title={title}>{children}</SectionHead>
      {media && <div className="mt-16">{media}</div>}
    </section>
  )
}


/* Track divider: splits the page into UX work and design work */
function Track({ letter, title, text }: { letter: string; title: string; text: string }) {
  return (
    <div className="gutter border-t border-line bg-panel py-14 sm:py-20">
      <div className="grid gap-6 md:grid-cols-12">
        <p className="display text-[clamp(4rem,9vw,8rem)] leading-none text-accent md:col-span-3">{letter}</p>
        <div className="md:col-span-9">
          <p className="display text-[clamp(2rem,4.4vw,3.6rem)]">{title}</p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{text}</p>
        </div>
      </div>
    </div>
  )
}

/* The tools a chapter was built with */
function Tools({ items }: { items: string[] }) {
  const { t } = useLang()
  return (
    <div className="mt-10 flex flex-wrap items-center gap-2">
      <span className="label mr-2">{t("Werkzeuge", "Tools")}</span>
      {items.map((x) => <span key={x} className="rounded-full border border-line bg-paper px-3 py-1 font-mono text-xs">{x}</span>)}
    </div>
  )
}

export default function Ekkodale() {
  const { t } = useLang()

  const facts = [
    [t("Unternehmen", "Company"), t("ekkodale GmbH, Wiesbaden: Software für die Baubranche", "ekkodale GmbH, Wiesbaden: software for the construction industry")],
    [t("Rolle", "Role"), t("Praktikum PM & UX (03–06/2025), seit 08/2025 Werkstudentin Kommunikation & Medien", "Intern PM & UX (03–06/2025), working student in communications & media since 08/2025")],
    [t("Produkte", "Products"), "hugo, gaeco"],
    [t("Ergebnisse", "Results"), t("Niemand ruft mehr an, um nach der Bewerbung zu fragen, und hugo hat fünf Kernkunden gewonnen.", "Nobody calls to ask how to apply anymore, and hugo won five key clients.")],
  ]

  const webinar: { id: Id; step: string; text: string }[] = [
    { id: "wb-01-announce", step: t("Ankündigung", "Announcement"), text: t("Im ersten Post sieht man Thema, Datum und Speaker auf einen Blick.", "The first post shows the topic, date and speakers at a glance.") },
    { id: "wb-02-speakers", step: "Speaker", text: t("Danach stellen sich Geschäftsführer Tim Hoffeller und Roger Winkler vor.", "Next, managing director Tim Hoffeller and Roger Winkler introduce themselves.") },
    { id: "wb-03-bridge", step: t("Leitmotiv Brücke", "Bridge motif"), text: t("Die Brücke ist mein Leitmotiv: Sie verbindet Wissen, das sonst zwischen Abteilungen feststeckt.", "The bridge is my key motif: it connects knowledge that would otherwise be stuck between departments.") },
    { id: "wb-05-live", step: t("Live-Hinweis", "Live notice"), text: t("Am Tag selbst erinnert ein Post daran, dass es gleich losgeht.", "On the day itself, a post reminds people that it's about to start.") },
    { id: "wb-04-lastcall", step: "Last Call", text: t("Zum Schluss kommt der letzte Aufruf zur Anmeldung.", "Finally, there's a last call to register.") },
  ]

  return (
    <>
      <Nav tone="ekko" />
      <CaseLayout className="blueprint-grid" title={t("Kapitel", "Chapters")} chapters={[
        { id: "karriereseite", label: t("Karriereseite", "Careers page"), group: t("A · UX & Produkt", "A · UX & product") },
        { id: "gaeco", label: t("Komponentenbibliothek", "Component library"), group: t("A · UX & Produkt", "A · UX & product") },
        { id: "website", label: "ekkodale.com", group: t("A · UX & Produkt", "A · UX & product") },
        { id: "hugo", label: t("hugo · Marke", "hugo · Brand"), group: t("B · Design & Kommunikation", "B · Design & communication") },
        { id: "webinar", label: t("Webinar-Kampagne", "Webinar campaign"), group: t("B · Design & Kommunikation", "B · Design & communication") },
        { id: "linkedin", label: t("LinkedIn-Serie", "LinkedIn series"), group: t("B · Design & Kommunikation", "B · Design & communication") },
        { id: "recruiting", label: "Recruiting", group: t("B · Design & Kommunikation", "B · Design & communication") },
        { id: "messe", label: t("Messe", "Trade fair"), group: t("B · Design & Kommunikation", "B · Design & communication") },
        { id: "workshops", label: t("Workshops & Events", "Workshops & events"), group: t("B · Design & Kommunikation", "B · Design & communication") },
        { id: "abwaegungen", label: t("Abwägungen", "Trade-offs"), group: t("Rückblick", "Looking back") },
        { id: "rolle", label: t("Meine Rolle", "My role"), group: t("Rückblick", "Looking back") }]}>
        {/* ---------- Hero ---------- */}
        <section className="gutter pb-20 pt-10 sm:pt-16">
          <ScrambleKicker text={`02 · ekkodale · ${t("UX & Kommunikation", "UX & communication")}`} chars="▪▫■□▖▘▝▗" />
          <h1 className="display mt-6 max-w-6xl text-[clamp(2.6rem,7.4vw,7.5rem)]">
            {t("Software für die Baubranche: ", "Software for construction: ")}
            <span className="font-serif font-normal italic tracking-normal text-accent">{t("seriös, klar und sichtbar.", "serious, clear and visible.")}</span>
          </h1>
          <p className="mt-10 max-w-xl text-lg leading-relaxed text-muted">
            {t("Ich habe bei ekkodale als Praktikantin angefangen und bin danach als Werkstudentin geblieben. In dieser Zeit habe ich zwei ganz verschiedene Dinge gemacht: Probleme von Nutzerinnen und Nutzern gelöst und ein KI-Produkt sichtbar gemacht. Oft musste ich dafür mit dem arbeiten, was schon da war.",
              "I started at ekkodale as an intern and then stayed on as a working student. In that time I did two very different things: solved problems for real users and made an AI product visible. Often I had to work with what was already there.")}
          </p>
        </section>
        <section className="gutter grid items-start gap-10 pb-24 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <Pic id="hu-series" eager alt={t("Titelgrafik der hugo-Webinarreihe", "Title graphic of the hugo webinar series")} className="rounded-[6px]" />
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

        <Track letter="A" title={t("UX & Produkt", "UX & product")}
          text={t("Hier ging es um Menschen, die etwas nicht fanden. Die Lösung lag selten in neuen Bausteinen, sondern in Gesprächen, in der Struktur und in einem System, das andere wiederverwenden können.", "This was about people who couldn’t find something. The answer rarely lay in new building blocks, but in conversations, in structure and in a system others can reuse.")} />
        {/* ---------- 01 Career site ---------- */}
        <section id="karriereseite" className="gutter section scroll-mt-20 border-t border-line">
          <SectionHead no="01" kicker={t("Karriereseite · UX-Research", "Careers page · UX research")}
            title={<>{t("Bewerbende fanden die Stelle nicht. ", "Applicants couldn’t find the job. ")}<span className="font-serif font-normal italic tracking-normal">{t("Also habe ich sie gefragt.", "So I asked them.")}</span></>}>
            <p>
              {t("Bewerbende fanden nicht, wo sie sich bewerben können, und haben deshalb beim Support angerufen. Ich war selbst gerade erst Praktikantin geworden und kannte die Hürden. Also habe ich mit den neuen Praktikantinnen und Praktikanten gesprochen, die den Weg gerade hinter sich hatten.",
                "Applicants couldn’t find where to apply, so they called support. I had only just become an intern myself and knew the hurdles. So I talked to the new interns who had just been through it.")}
            </p>
            <More>
              <p>
                {t("Aus den Interviews habe ich einen Research-Bericht geschrieben, den mein Chef freigegeben hat. Dann kam die eigentliche Hürde: Ich durfte nur die Standardbausteine von TYPO3 benutzen. Ich konnte also nichts Neues gestalten, sondern musste alles über Aufbau, Reihenfolge und Inhalt lösen.",
                  "I turned the interviews into a research report, which my boss approved. Then came the real hurdle: I could only use TYPO3’s standard blocks. So I couldn’t design anything new and had to solve everything through structure, order and content.")}
              </p>
            </More>
          </SectionHead>

          <Brief className="mt-16"
            why={t("Bewerbende fanden nicht, wo sie sich bewerben können, und riefen deshalb beim Support an.", "Applicants couldn’t find where to apply, so they called support instead.")}
            constraint={t("Ich durfte nur die Standardbausteine von TYPO3 benutzen. Eigene Komponenten waren nicht möglich.", "I could only use TYPO3’s standard blocks. Custom components weren’t possible.")}
            response={t("Ich habe zuerst zugehört und dann die Nutzerführung allein über die Struktur gelöst: fünf klare Schritte, ein Formular ohne Anmeldung und eigene Seiten für Benefits und Abschlussarbeiten. Das Design musste mit dem auskommen, was TYPO3 mitbringt.", "I listened first and then solved the guidance purely through structure: five clear steps, one form without sign-up, and dedicated pages for benefits and theses. The design had to make do with what TYPO3 offers.")}
            result={t("Seit dem Livegang ruft niemand mehr an, um nach der Bewerbung zu fragen.", "Since launch, nobody calls to ask how to apply.")} />
          <Tools items={[t("Nutzerinterviews", "User interviews"), t("Research-Bericht", "Research report"), t("Informationsarchitektur", "Information architecture"), "TYPO3", "Figma"]} />

          <Reveal className="mx-auto mt-16 max-w-5xl">
            <AutoVideo src="/video/ekkodale-karriere.webm" label={t("Aufnahme der ekkodale-Karriereseite", "Recording of the ekkodale careers page")}
              className="rounded-[8px] border border-line bg-white shadow-xl" />
            <p className="label mt-4">{t("Die Karriereseite auf ekkodale.com", "The careers page on ekkodale.com")}</p>
          </Reveal>

          <div className="mt-16 grid gap-px overflow-hidden rounded-[6px] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {([
              [t("Wo bewerbe ich mich?", "Where do I apply?"), t("Ich habe den Ablauf in fünf klare Schritte gegliedert, mit einem Formular ohne Anmeldung.", "I split the process into five clear steps, with one form and no sign-up.")],
              [t("Was bekomme ich?", "What do I get?"), t("Die Benefits haben jetzt eine eigene Seite, damit man sie nicht suchen muss.", "Benefits now have their own page, so nobody has to hunt for them.")],
              [t("Wie ist die Kultur?", "What’s the culture like?"), t("Ich habe echte Fotos aus dem Arbeitsalltag gezeigt statt Stockbilder.", "I used real photos from everyday work instead of stock images.")],
              [t("Was bringt ein Praktikum?", "What does an internship offer?"), t("Eine eigene Seite erklärt, was man bei einem Praktikum oder einer Abschlussarbeit bekommt.", "A dedicated page explains what you get from an internship or a thesis.")],
            ] as [string, string][]).map(([q, a], i) => (
              <Reveal key={i} delay={i * 0.06} className="bg-paper p-6 sm:p-8">
                <p className="label">{t("Frage", "Question")} {i + 1}</p>
                <p className="mt-3 text-lg font-semibold leading-snug">{q}</p>
                <p className="mt-3 leading-relaxed text-muted">{a}</p>
              </Reveal>
            ))}
          </div>

          <Reveal className="mx-auto mt-16 max-w-5xl">
            <Pic id="ca-process" alt={t("Bewerbungsprozess in fünf Schritten: Bewerbung, Erstgespräch, Arbeitsprobe, Teamvorstellung, Newcomer", "Five-step application process: application, first interview, work sample, meeting the team, newcomer")}
              className="rounded-[6px] border border-line bg-white" />
            <p className="label mt-4">{t("Der Bewerbungsprozess in fünf Schritten", "The application process in five steps")}</p>
          </Reveal>

          <div className="mt-20 grid gap-8 rounded-[8px] border border-line bg-panel p-8 sm:p-12 md:grid-cols-12">
            <div className="md:col-span-5">
              <p className="label">{t("Ergebnis", "Result")}</p>
              <p className="display mt-3 text-[clamp(2rem,4vw,3.4rem)]">{t("Keine Anrufe mehr.", "No more calls.")}</p>
            </div>
            <p className="max-w-[48ch] text-lg leading-relaxed md:col-span-7">
              {t("Seit dem Livegang ruft niemand mehr an, um zu fragen, wie die Bewerbung geht. Beschwerden über die Navigation gibt es auch keine mehr.",
                "Since launch, nobody has called to ask how to apply, and there are no more complaints about the navigation.")}
            </p>
          </div>
        </section>

        {/* ---------- 02 gaeco + component library ---------- */}
        <section id="gaeco" className="gutter section scroll-mt-20 border-t border-line">
          <SectionHead no="02" kicker={t("gaeco-Website · Komponentenbibliothek", "gaeco website · Component library")}
            title={<>{t("Eine Website aus Bausteinen, ", "A website made of building blocks, ")}<span className="font-serif font-normal italic tracking-normal">{t("die ich gestaltet und in Storybook gebaut habe.", "designed and built by me in Storybook.")}</span></>}>
            <p>
              {t("Die gaeco-Website sollte ihre Seiten nicht einzeln bauen, sondern aus einer gemeinsamen Bibliothek zusammensetzen. Die Komponenten habe ich gestaltet und mit KI-Unterstützung in Storybook gebaut. Das Schwierige war dabei weniger das Aussehen als das, was ich bewusst weglassen musste.",
                "The gaeco website was meant to assemble its pages from a shared library instead of building each one separately. I designed the components and built them in Storybook with AI assistance. The hard part wasn’t so much the look as what I deliberately had to leave out.")}
            </p>
            <More>
              <p>
                {t("Jede Komponente wird nur über Props gesteuert. Texte, Icons und Verhalten kommen von außen, deshalb funktioniert derselbe Baustein auf Deutsch und Englisch und in jedem Projekt. Die Bibliothek wird als versioniertes Paket veröffentlicht, und die gaeco-Seite installiert es, statt Code zu kopieren.",
                  "Every component is controlled only through props. Copy, icons and behaviour come from outside, so the same block works in German and English and in any project. The library ships as a versioned package, and the gaeco site installs it instead of copying code.")}
              </p>
              <p>{t("Der Code gehört ekkodale und bleibt privat. Die Bilder hier stammen aus meinem eigenen Storybook-Build.", "The code belongs to ekkodale and stays private. The images here come from my own Storybook build.")}</p>
            </More>
          </SectionHead>

          <Brief className="mt-16"
            why={t("Mehrere ekkodale-Websites sollen gleich aussehen und sich gleich verhalten, ohne dass jede Seite ihre Bausteine neu baut.", "Several ekkodale websites should look and behave the same without each site rebuilding its building blocks.")}
            constraint={t("Die Bibliothek baut auf Mantine auf und darf keine Texte, Icons oder Logik enthalten, weil sie mehrsprachig und in verschiedenen Projekten laufen muss. Die finalen Design-Tokens des Teams standen noch aus.", "The library builds on Mantine and may not contain copy, icons or logic, because it has to run in several languages and projects. The team’s final design tokens were still pending.")}
            response={t("Ich habe jede Komponente so gestaltet, dass sie nur über Props gesteuert wird, und ihre Varianten und Zustände in Stories festgehalten. Statt Farben zu raten, habe ich ein neutrales Platzhalter-Theme akzeptiert, damit die Tokens später an einer einzigen Stelle eingesetzt werden können.", "I designed every component to be controlled only through props and captured its variants and states in stories. Instead of guessing colours, I accepted a neutral placeholder theme so the tokens can later be dropped in at a single place.")}
            result={t("Die gaeco-Website installiert die Bibliothek als Paket und setzt ihre Seiten aus diesen Bausteinen zusammen.", "The gaeco website installs the library as a package and assembles its pages from these blocks.")} />

          <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[6px] border border-line bg-line sm:grid-cols-4">
            {([["53", t("Komponenten", "components")], ["190", t("Stories mit Varianten und Zuständen", "stories with variants and states")], ["4", t("Ebenen: Atoms bis Templates", "levels: atoms to templates")], ["1", t("Paket für alle Projekte", "package for every project")]] as [string, string][]).map(([n, d]) => (
              <div key={d} className="bg-paper p-6"><dt className="display text-4xl">{n}</dt><dd className="mt-2 text-sm leading-snug text-muted">{d}</dd></div>
            ))}
          </dl>

          <Reveal className="mt-16">
            <Pic id="sb-ui" alt={t("Storybook der Komponentenbibliothek: Baum mit Sections und Templates, Controls für Varianten, Tab für Barrierefreiheit", "Storybook of the component library: tree with sections and templates, controls for variants, accessibility tab")} className="rounded-[8px] border border-line shadow-xl" />
            <p className="label mt-4">{t("Mein Storybook: links die Struktur, unten die Varianten als Controls, daneben der Barrierefreiheits-Check. Die Bausteine wirken hier neutral, weil das Theme noch auf die finalen Tokens wartet.", "My Storybook: structure on the left, variants as controls below, the accessibility check next to them. The blocks look neutral here because the theme is still waiting for the final tokens.")}</p>
          </Reveal>

          <p className="label mb-5 mt-20">{t("Ausgewählte Bausteine", "Selected components")}</p>
          <div className="grid gap-x-8 gap-y-10 md:grid-cols-2">
            <figure className="md:col-span-2">
              <AutoVideo src="/video/sb-orbit.mp4" label="OrbitReveal" className="rounded-[6px] border border-line bg-white" />
              <figcaption className="mt-3"><span className="font-medium">OrbitReveal</span>
                <span className="block text-sm leading-relaxed text-muted">{t("Beim Scrollen fliegen die Symbole für Dokumente, Daten und Team heran und ordnen sich im Kreis um die Suche. So wird sichtbar, dass ein Assistent alle Quellen verbindet.", "As you scroll, the icons for documents, data and team fly in and settle in a ring around the search. It shows that one assistant connects every source.")}</span></figcaption>
            </figure>
            <figure>
              <AutoVideo src="/video/sb-bridge.mp4" label="BridgeStatement" className="rounded-[6px] border border-line bg-white" />
              <figcaption className="mt-3"><span className="font-medium">BridgeStatement</span>
                <span className="block text-sm leading-relaxed text-muted">{t("Die Kernaussage bekommt beim Hereinscrollen eine Markierung, die sich unter den Worten aufbaut.", "The key statement gets a highlight that draws itself under the words as it scrolls in.")}</span></figcaption>
            </figure>
            <figure>
              <AutoVideo src="/video/sb-stats.mp4" label="StatsBar" className="rounded-[6px] border border-line bg-white" />
              <figcaption className="mt-3"><span className="font-medium">StatsBar</span>
                <span className="block text-sm leading-relaxed text-muted">{t("Die Kennzahlen zählen hoch, sobald sie im Bild sind, und nur einmal.", "The figures count up once they come into view, and only once.")}</span></figcaption>
            </figure>
          </div>

          <p className="label mb-5 mt-20">{t("Vom Baustein zur Seite", "From block to page")}</p>
          <Reveal className="mx-auto max-w-4xl">
            <AutoVideo src="/video/ekkodale-gaeco.webm" label={t("Aufnahme der gaeco-Seite", "Recording of the gaeco page")} className="rounded-[6px] border border-line bg-white" />
            <p className="label mt-3">{t("Die live gaeco-Seite, aus denselben Bausteinen gebaut", "The live gaeco site, built from the same blocks")}</p>
          </Reveal>

          <Tools items={["Storybook", "React", "TypeScript", "Mantine", "Astro", "Keystatic CMS", "Azure DevOps", t("Barrierefreiheit (axe)", "Accessibility (axe)"), t("Mit KI-Unterstützung gebaut", "Built with AI assistance")]} />
        </section>

        {/* ---------- 03 Website ---------- */}
        <Sub id="website" no="03" kicker="ekkodale.com" title={t("Neue Ordnung für ekkodale.com.", "A new order for ekkodale.com.")}
          media={null}>
          <p>
            {t("Ich habe Layout, Bildsprache und Nutzerführung der Unternehmensseite neu ausgerichtet.",
              "I reworked the company site’s layout, imagery and navigation.")}
          </p>
          <Tools items={["Figma", "TYPO3", t("Nutzerführung", "Navigation design")]} />
        </Sub>

        <Track letter="B" title={t("Design & Kommunikation", "Design & communication")}
          text={t("Hier war die Aufgabe eine andere: Ein KI-Produkt sollte Menschen erreichen, die KI eher misstrauen. Dafür habe ich eine Marke, Kampagnen und Materialien für Events gestaltet.", "Here the job was different: an AI product had to reach people who tend to distrust AI. For that I designed a brand, campaigns and event materials.")} />
        {/* ---------- 04 hugo identity ---------- */}
        <section id="hugo" className="gutter section scroll-mt-20 border-t border-line">
          <SectionHead no="04" kicker={t("hugo · Marke", "hugo · Brand")} title={t("Ein KI-Assistent bekommt ein Gesicht.", "An AI assistant gets a face.")}>
            <p>
              {t("hugo beantwortet Fragen zu Normen und Projekten. Die Menschen, für die es gedacht ist, stehen KI eher skeptisch gegenüber. Ich habe mit Scribbles zur Wortmarke angefangen und mich am Ende für das Ruhigste entschieden: ein aus Blöcken gebautes „H“, das mit dem gaeco-Zeichen eine Familie bildet.",
                "hugo answers questions about standards and projects. The people it’s for tend to be sceptical of AI. I started with sketches for the wordmark and in the end chose the calmest option: an “H” built from blocks that forms a family with the gaeco mark.")}
            </p>
            <More>
              <p>
                {t("Am Anfang standen Scribbles zur Wortmarke. Die offizielle Bildmarke ist ein aus Blöcken gebautes „H“. Zusammen mit dem gaeco-Zeichen bildet sie eine Produktfamilie, die ich über alle Kampagnenmittel ausgerollt habe.",
                  "It started with sketches for the wordmark. The official logo mark is an “H” built from blocks. Together with the gaeco mark it forms a product family, which I rolled out across all campaign material.")}
              </p>
            </More>
          
            <Tools items={["Affinity Designer", t("Logo & Vektor", "Logo & vector"), t("Markenfamilie", "Brand family")]} />
          </SectionHead>
          <Brief className="mt-16"
            why={t("hugo ist ein KI-Assistent für die Baubranche und brauchte ein Gesicht, bevor die Kampagnen starten konnten.", "hugo is an AI assistant for the construction industry and needed a face before the campaigns could start.")}
            constraint={t("Die Zielgruppe aus Planern, Herstellern und Bauunternehmen ist KI gegenüber skeptisch. Außerdem musste die Marke mit dem bestehenden gaeco-Zeichen eine Familie bilden.", "The audience of planners, manufacturers and construction firms is sceptical of AI. The brand also had to form a family with the existing gaeco mark.")}
            response={t("Ich habe mich gegen alles Verspielte entschieden: ein ruhiges, aus Blöcken gebautes „H“ in derselben Logik wie gaeco, konsequent über alle Kampagnenmittel ausgerollt.", "I decided against anything playful: a calm “H” built from blocks, following the same logic as gaeco, rolled out consistently across all campaign material.")} />
          <div className="mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
            {([
              ["hu-sketches", t("1 · Scribbles", "1 · Sketches"), t("Frühe Logo-Scribbles zur Wortmarke hugo", "Early logo sketches for the hugo wordmark")],
              ["hu-mark", t("2 · Bildmarke hugo", "2 · hugo logo mark"), t("Offizielle hugo Bildmarke: ein aus Blöcken gebautes H", "Official hugo logo mark: an H built from blocks")],
              ["hu-wordmark", t("3 · Wortmarke hugo", "3 · hugo wordmark"), t("hugo Wort-Bild-Marke", "hugo combined logo")],
              ["ga-wordmark", t("4 · Produktfamilie gaeco", "4 · gaeco, same family"), t("gaeco Wort-Bild-Marke aus derselben Familie", "gaeco logo from the same family")],
            ] as [Id, string, string][]).map(([id, label, alt], i) => (
              <Reveal key={id} delay={i * 0.08}>
                <Pic id={id} alt={alt} cover className="aspect-square rounded-[4px] border border-line bg-white"
                  imgClassName={id === "hu-sketches" ? "object-contain p-3" : id === "hu-mark" ? "object-contain p-10 [clip-path:inset(0_round_18%)]" : "object-contain p-6"} />
                <p className="label mt-4">{label}</p>
              </Reveal>
            ))}
          </div>

        </section>

        {/* ---------- 05 Webinar ---------- */}
        <section id="webinar" className="section scroll-mt-20 border-t border-line">
          <div className="gutter">
            <SectionHead no="05" kicker={t("Webinar-Kampagne", "Webinar campaign")}
              title={t("„Von Datensilos zum Unternehmenswissen“", "“From data silos to company knowledge”")}>
              <p>
                {t("Ich habe diese Kampagne vom Konzept bis zur Durchführung verantwortet. Wissen, das zwischen Abteilungen feststeckt, ist ein sehr abstraktes Thema. Deshalb habe ich ein Bild gesucht, das jeder sofort versteht: eine Brücke. Nach dem Webinar haben fünf Kernkunden in hugo investiert.", "I was responsible for this campaign from concept to delivery. Knowledge stuck between departments is a very abstract topic. So I looked for an image everyone gets straight away: a bridge. After the webinar, five key clients invested in hugo.")}
              </p>
              <More>
                <p>
                  {t("Ein Live-Webinar mit Geschäftsführer Tim Hoffeller und Roger Winkler. Fünf Posts führen von der Ankündigung bis zum Last Call.",
                    "A live webinar with managing director Tim Hoffeller and Roger Winkler. Five posts lead from the announcement to the last call.")}
                </p>
              </More>
            
            <Tools items={["Affinity Designer", t("Kampagnenplanung", "Campaign planning"), "LinkedIn"]} />
          </SectionHead>
          </div>
          <StackingCards totalCards={webinar.length} scaleMultiplier={0.03} className="gutter relative mt-16">
            {webinar.map((w, i) => (
              <StackingCardItem key={w.id} index={i} className="h-[80svh]">
                <article className="flex h-[72svh] flex-col gap-8 overflow-hidden rounded-[8px] border border-line bg-paper p-6 shadow-[0_-20px_60px_-35px_rgba(11,28,61,0.45)] sm:p-10 lg:flex-row lg:items-center lg:gap-12">
                  <div className="lg:w-[34%] lg:shrink-0">
                    <p className="font-mono text-xs uppercase tracking-[0.14em] text-accent">Post {i + 1} / {webinar.length}</p>
                    <h3 className="display mt-4 text-[clamp(1.6rem,2.8vw,2.6rem)]">{w.step}</h3>
                    <p className="mt-5 max-w-sm text-lg leading-relaxed text-muted">{w.text}</p>
                  </div>
                  <div className="flex min-h-0 flex-1 items-center justify-center">
                    <img src={img(w.id)} alt={`${t("Webinar-Kampagne", "Webinar campaign")}: ${w.step}`} loading="lazy" style={{ aspectRatio: ratio(w.id) }}
                      className="h-auto max-h-full w-auto max-w-full rounded-[4px] border border-line lg:max-h-[60svh]" />
                  </div>
                </article>
              </StackingCardItem>
            ))}
          </StackingCards>
        </section>

        {/* ---------- 04 LinkedIn series ---------- */}
        <Sub id="linkedin" no="06" kicker={t("LinkedIn-Serie", "LinkedIn series")}
          title={<>{t("„Wie ich es geschafft habe …“: ", "“How I made it …”: ")}<span className="font-serif font-normal italic tracking-normal">{t("Lektionen aus zwei Jahren KI.", "lessons from two years of AI.")}</span></>}
          media={
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
              {(["li-geht", "li-tisch", "li-code", "li-traeumen"] as Id[]).map((id, i) => (
                <Reveal key={id} delay={i * 0.06}>
                  <Pic id={id} alt={t("LinkedIn-Post der Serie „Wie ich es geschafft habe …“", "LinkedIn post from the series “How I made it …”")} className="rounded-[4px]" />
                </Reveal>
              ))}
            </div>
          }>
          <p>
            {t("Ich habe mich für Collagen statt Stockfotos entschieden. So fällt ein B2B-Thema im Feed auf und bleibt trotzdem erkennbar ekkodale. Konzept, Farben und Auftritt sind von mir, die Motive habe ich mit KI-Unterstützung umgesetzt.", "I chose collages over stock photos. That way a B2B topic stands out in the feed and still clearly looks like ekkodale. The concept, colours and presentation are mine; I made the motifs with AI assistance.")}
          </p>
          <Brief className="!mt-10"
            why={t("Die Serie teilt, was der Geschäftsführer in zwei Jahren KI-Einsatz gelernt hat.", "The series shares what the managing director learned in two years of using AI.")}
            constraint={t("Ein B2B-Thema geht im LinkedIn-Feed schnell unter, und Stockfotos sehen überall gleich aus. Trotzdem sollte jeder Post erkennbar ekkodale bleiben.", "A B2B topic easily gets lost in the LinkedIn feed, and stock photos all look the same. Still, every post had to stay recognisably ekkodale.")}
            response={t("Ich habe Collagen statt Stockfotos gewählt und Konzept und Farbwelt festgelegt. Die einzelnen Motive habe ich mit KI-Unterstützung umgesetzt.", "I chose collages over stock photos and set the concept and colours. I made the individual motifs with AI assistance.")} />
          <Tools items={["Affinity Designer", t("KI-Bildgenerierung", "AI image generation"), t("Editorial-Konzept", "Editorial concept")]} />
        </Sub>

        {/* ---------- 05 Recruiting ---------- */}
        <Sub id="recruiting" no="07" kicker="Recruiting · Hochschule RheinMain"
          title={t("#KarriereBeiEkkodale: Talente dort abholen, wo sie studieren.", "#KarriereBeiEkkodale: meeting talent where they study.")}
          media={
            <div className="grid gap-6 md:grid-cols-3">
              <Reveal><Pic id="rm-poster" alt={t("Recruiting-Poster #KarriereBeiEkkodale", "Recruiting poster #KarriereBeiEkkodale")} className="rounded-[4px] border border-line" /></Reveal>
              <Reveal delay={0.06}><Pic id="rm-dark" alt={t("Recruiting-Motiv in dunkler Variante", "Recruiting visual, dark version")} className="rounded-[4px]" /></Reveal>
              <Reveal delay={0.12}><Pic id="rm-connect" alt={t("Karte „Connect with us“", "“Connect with us” card")} className="rounded-[4px] border border-line" /></Reveal>
            </div>
          }>
          <p>
            {t("Für Studierende der Hochschule RheinMain habe ich Poster, Posts und QR-Karten gestaltet. Die farbigen Balken zeigen auf einen Blick, was man bei ekkodale bekommt.", "For students at RheinMain University I designed posters, posts and QR cards. The coloured bars show at a glance what you get at ekkodale.")}
          </p>
          <Tools items={["Affinity Designer", t("QR-Karten & Print", "QR cards & print")]} />
        </Sub>

        {/* ---------- 06 Trade fair ---------- */}
        <Sub id="messe" no="08" kicker={t("Messe · Light + Building 2026", "Trade fair · Light + Building 2026")}
          title={t("Live-Demo Smart Building: ein Motiv, drei Formate.", "Live demo smart building: one visual, three formats.")}
          media={
            <div className="mx-auto max-w-5xl">
              <Reveal><Pic id="lb-banner" alt={t("Banner: Live-Demo am Arbeitsplatz, Smart Building Reallabor", "Banner: live demo at the workplace, smart building lab")} className="rounded-[4px] border border-line" /></Reveal>
              <div className="mt-6 grid grid-cols-2 gap-6">
                <Reveal><Pic id="lb-poster" alt={t("Poster-Format Smart Building Reallabor", "Poster format, smart building lab")} className="rounded-[4px] border border-line" /></Reveal>
                <Reveal delay={0.06}><Pic id="lb-square" alt={t("Social-Kachel Smart Building Reallabor", "Social tile, smart building lab")} className="rounded-[4px] border border-line" /></Reveal>
              </div>
            </div>
          }>
          <p>
            {t("Für den gemeinsamen Messeauftritt mit der Hochschule Mainz habe ich ein isometrisches Gebäude als Leitmotiv entwickelt und es als Banner, Poster und Social-Kachel umgesetzt.", "For our joint trade-fair presence with Mainz University of Applied Sciences, I developed an isometric building as the key visual and applied it to a banner, a poster and a social tile.")}
          </p>
        </Sub>

        {/* ---------- 07 Workshops ---------- */}
        <Sub id="workshops" no="09" kicker={t("Workshops & Events", "Workshops & events")}
          title={t("Workshops und ein Meetup: Methoden sichtbar machen.", "Workshops and a meetup: making methods visible.")}
          media={
            <div className="mx-auto max-w-5xl">
              <div className="grid gap-6 md:grid-cols-2">
                <Reveal><Pic id="ws-scrum" alt={t("Workshop-Karte Scrum", "Workshop card: Scrum")} className="rounded-[4px]" /></Reveal>
                <Reveal delay={0.06}><Pic id="ws-require" alt={t("Workshop-Karte Requirements Engineering", "Workshop card: requirements engineering")} className="rounded-[4px]" /></Reveal>
              </div>
              <Reveal className="mt-6"><Pic id="ws-meetup" alt={t("Design Technology Meetup, 4. März 2026: Publikum vor dem Keyvisual", "Design Technology Meetup, 4 March 2026: audience in front of the key visual")} className="rounded-[4px]" /></Reveal>
            </div>
          }>
          <p>
            {t("Für unsere Workshops, zum Beispiel zu Scrum und Requirements Engineering, habe ich Bildkarten und einen Ablaufweg gestaltet. Beim Design Technology Meetup im März 2026 lief mein Keyvisual auf der großen Leinwand.", "For our workshops, for example on Scrum and requirements engineering, I designed picture cards and a flow. At the Design Technology Meetup in March 2026, my key visual ran on the big screen.")}
          </p>
          <Tools items={["Affinity Designer", t("Ablaufgrafik", "Process graphics")]} />
        </Sub>

        {/* ---------- 10 Trade-offs ---------- */}
        <Tradeoffs id="abwaegungen" no="10"
          intro={t("In einer Firma arbeitet man nie auf einem weißen Blatt. Das hier waren die Grenzen, mit denen ich gearbeitet habe, und was ich daraus gemacht habe.", "At a company you never work on a blank page. These were the limits I worked within, and what I made of them.")}
          items={[
            [t("Nur TYPO3-Standardbausteine.", "Only TYPO3 standard blocks."), t("Für die Karriereseite durfte ich keine eigenen Komponenten bauen. Ich habe das Problem über Aufbau und Inhalt gelöst, und das hat gereicht: Niemand ruft mehr an.", "For the careers page I couldn’t build my own components. I solved the problem through structure and content, and that was enough: nobody calls anymore.")],
            [t("Ein Theme als Platzhalter.", "A placeholder theme."), t("Die finalen Design-Tokens standen noch aus. Ich habe die Bibliothek so gebaut, dass sie später an einer Stelle eingesetzt werden, und dafür akzeptiert, dass mein Storybook vorerst neutral aussieht.", "The final design tokens were still pending. I built the library so they can be dropped in at one place later, and accepted that my Storybook looks neutral for now.")],
            [t("Keine Texte, Icons oder Logik in den Bausteinen.", "No copy, icons or logic in the blocks."), t("Die Bibliothek muss mehrsprachig und in verschiedenen Projekten laufen. Deshalb wird jede Komponente nur über Props gesteuert.", "The library has to run in several languages and projects. So every component is controlled only through props.")],
            [t("Der Code bleibt privat.", "The code stays private."), t("Die Bibliothek gehört ekkodale. Ich zeige hier nur Bilder und Aufnahmen aus meinem eigenen Storybook-Build.", "The library belongs to ekkodale. Here I only show images and recordings from my own Storybook build.")],
            [t("Eine skeptische Zielgruppe.", "A sceptical audience."), t("Die Menschen, für die hugo gedacht ist, misstrauen KI eher. Ich habe mich deshalb gegen alles Verspielte entschieden. Ruhe war hier wichtiger als Auffallen.", "The people hugo is for tend to distrust AI. So I decided against anything playful. Calm mattered more than standing out here.")],
            [t("Motive mit KI, Konzept von mir.", "Motifs by AI, concept by me."), t("Bei der LinkedIn-Serie kamen die Motive aus der KI. Mein Teil waren Konzept, Farben und die Entscheidung für Collagen statt Stockfotos.", "For the LinkedIn series the motifs came from AI. My part was the concept, the colours and the decision for collages over stock photos.")],
          ]} />

        {/* ---------- Role ---------- */}
        <section id="rolle" className="gutter section border-t border-line">
          <SectionHead kicker={t("Meine Rolle", "My role")} title={t("Von der Recherche bis zum Messestand.", "From research to the trade-fair stand.")}>
            <RoleList bullet="▪" items={[
              t("UX-Research und Neugestaltung der Karriereseite", "UX research and redesign of the careers page"),
              t("hugo-Marke über alle Kanäle ausgerollt", "hugo brand rolled out across all channels"),
              t("Webinar-Kampagne von Konzept bis Durchführung", "Webinar campaign from concept to delivery"),
              t("Konzept und Farbwelt der LinkedIn-Serie", "Concept and colours of the LinkedIn series"),
              t("Recruiting-Kampagne mit der Hochschule RheinMain", "Recruiting campaign with RheinMain University"),
              t("Messe-Motiv, Workshop-Grafiken, Website", "Trade-fair visual, workshop graphics, website"),
            ]} />
          </SectionHead>
        </section>
      </CaseLayout>
      <Pager to="/sivicamp" label={t("Nächstes Projekt · 03", "Next project · 03")} title="SiviCamp 2026" />
      <Footer />
    </>
  )
}

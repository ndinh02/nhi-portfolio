import type { ReactNode } from "react"
import { EMAIL, Footer, Nav } from "@/components/ui"
import { useLang } from "@/lib/i18n"

const ADDRESS = ["Heinrich-Zille-Str. 1", "65201 Wiesbaden", "Deutschland"]

function Page({ title, children }: { title: string; children: ReactNode }) {
  const { lang } = useLang()
  return (
    <>
      <Nav />
      <main className="gutter py-16">
        <h1 className="display text-[clamp(2.6rem,6vw,5rem)]">{title}</h1>
        {lang === "en" && <p className="label mt-6">This is a translation. The German version is legally binding.</p>}
        <div className="prose-case mt-12 max-w-3xl space-y-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold">{children}</div>
      </main>
      <Footer />
    </>
  )
}

export function Impressum() {
  const { t } = useLang()
  return (
    <Page title={t("Impressum", "Legal notice")}>
      <section>
        <h2>{t("Angaben gemäß § 5 DDG", "Information according to § 5 DDG")}</h2>
        <p>Nhi Ngoc Uyen Dinh<br />{ADDRESS.map((l) => <span key={l}>{l}<br /></span>)}</p>
      </section>
      <section>
        <h2>{t("Kontakt", "Contact")}</h2>
        <p>{t("E-Mail", "Email")}: {EMAIL}</p>
      </section>
      <section>
        <h2>{t("Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV", "Responsible for content according to § 18 (2) MStV")}</h2>
        <p>{t("Nhi Ngoc Uyen Dinh, Anschrift wie oben.", "Nhi Ngoc Uyen Dinh, address as above.")}</p>
      </section>
      <section>
        <h2>{t("Hinweis zu gezeigten Arbeiten", "About the work shown")}</h2>
        <p>
          {t("Die gezeigten Arbeiten entstanden für SiviDuc e.V. und die ekkodale GmbH. Marken, Logos und Produktnamen sind Eigentum der jeweiligen Inhaber und werden nur zur Dokumentation meiner eigenen Gestaltungsleistung gezeigt.",
            "The work shown was created for SiviDuc e.V. and ekkodale GmbH. Brands, logos and product names belong to their respective owners and are shown only to document my own design work.")}
        </p>
      </section>
    </Page>
  )
}

export function Datenschutz() {
  const { t } = useLang()
  return (
    <Page title={t("Datenschutz", "Privacy")}>
      <section>
        <h2>{t("Verantwortliche", "Controller")}</h2>
        <p>Nhi Ngoc Uyen Dinh, {ADDRESS.join(", ")} · {EMAIL}</p>
      </section>
      <section>
        <h2>Hosting</h2>
        <p>
          {t("Diese Website wird bei Vercel Inc. gehostet. Beim Aufruf verarbeitet Vercel technisch notwendige Daten (IP-Adresse, Zeitpunkt, aufgerufene Seite, Browser) in Server-Logfiles, um die Seite auszuliefern und abzusichern. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Eine Übermittlung in die USA erfolgt auf Grundlage des EU-US Data Privacy Framework.",
            "This website is hosted by Vercel Inc. When you visit, Vercel processes technically necessary data (IP address, time, page visited, browser) in server log files to deliver and secure the site. The legal basis is Art. 6 (1) (f) GDPR. Transfers to the USA are based on the EU-US Data Privacy Framework.")}
        </p>
      </section>
      <section>
        <h2>{t("Keine Cookies, kein Tracking", "No cookies, no tracking")}</h2>
        <p>
          {t("Diese Website setzt keine Cookies und verwendet keine Analyse- oder Tracking-Dienste. Schriften werden lokal ausgeliefert, nicht über Google Fonts. Ihre Sprachwahl (Deutsch/Englisch) und ob die Kapitelübersicht ein- oder ausgeklappt ist, werden nur lokal in Ihrem Browser gespeichert.",
            "This website sets no cookies and uses no analytics or tracking services. Fonts are served locally, not via Google Fonts. Your language choice (German/English) and whether the chapter overview is collapsed are stored only locally in your browser.")}
        </p>
      </section>
      <section>
        <h2>{t("Kontakt per E-Mail und Kontaktformular", "Contact by email and contact form")}</h2>
        <p>
          {t("Wenn Sie mir schreiben, verarbeite ich Ihre Angaben nur zur Beantwortung Ihrer Anfrage (Art. 6 Abs. 1 lit. b bzw. f DSGVO).",
            "If you write to me, I process your details only to answer your request (Art. 6 (1) (b) or (f) GDPR).")}
        </p>
        <p>
          {t("Das Kontaktformular auf dieser Website wird über den Dienst FormSubmit (formsubmit.co) versendet. Dabei werden Ihre E-Mail-Adresse, Ihre Nachricht sowie technisch notwendige Daten wie IP-Adresse und Zeitpunkt an FormSubmit übertragen, das die Nachricht an mein E-Mail-Postfach weiterleitet. Dabei kann eine Übermittlung in Länder außerhalb der EU stattfinden. Wenn Sie das nicht möchten, schreiben Sie mir gern direkt per E-Mail.",
            "The contact form on this website is sent via the FormSubmit service (formsubmit.co). Your email address, your message and technically necessary data such as IP address and time are transmitted to FormSubmit, which forwards the message to my inbox. This may involve a transfer to countries outside the EU. If you’d rather avoid that, feel free to email me directly.")}
        </p>
      </section>
      <section>
        <h2>{t("Ihre Rechte", "Your rights")}</h2>
        <p>
          {t("Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Widerspruch und Datenübertragbarkeit sowie das Recht auf Beschwerde bei einer Datenschutzaufsichtsbehörde.",
            "You have the right to access, rectification, erasure, restriction of processing, objection and data portability, and the right to lodge a complaint with a data protection authority.")}
        </p>
      </section>
    </Page>
  )
}

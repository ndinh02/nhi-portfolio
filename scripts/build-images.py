"""Curated asset manifest -> public/img/<id>.webp (+ <id>-sm.webp).
Only files listed here ship. Source files are never modified."""
import os, subprocess, tempfile, json
from PIL import Image, ImageOps, ImageChops
Image.MAX_IMAGE_PIXELS = None

CV = os.path.expanduser("~/Documents/CV")
S = f"{CV}/sividuc/Rammastic2026"
W = f"{CV}/sividuc/WEB_Building"
E = f"{CV}/ekkodale"
H = f"{E}/HUGO-2"
P = f"{CV}/privat_propjects"

ASSETS = {
  # --- SiviCamp: identity
  "sc-keyvisual":   f"{W}/brand_assets/logo.png",
  "sc-brandguide":  f"{W}/brand_assets/brand_guide.png",
  "sc-colors":      f"{S}/post_template/Bảng màu.png",
  "sc-type":        f"{S}/post_template/Font chữ.png",
  "sc-site-full":   "scripts/captures/sivicamp-site-full.png",  # live site, captured 2026-09-23
  # --- SiviCamp: template system
  "sc-tpl-title":   f"{S}/post_template/Title Ảnh 1.png",
  "sc-tpl-carousel":f"{S}/post_template/Carousel 1.png",
  "sc-tpl-long":    f"{S}/post_template/Long Text.png",
  "sc-tpl-quote":   f"{S}/post_template/Quote.png",
  "sc-tpl-tiles":   f"{S}/post_template/Tiles 2.png",
  "sc-tpl-count":   f"{S}/post_template/Title đếm ngược.png",
  "sc-tpl-end":     f"{S}/post_template/End Page + Sponsors.png",
  # --- SiviCamp: campaign in order
  "sc-01-teaser":   f"{S}/campaign_post/14.06.2026.png",
  "sc-02-open":     f"{S}/campaign_post/19.06.2026 Mở đơn (3).png",
  "sc-03-early":    f"{S}/campaign_post/ticket_var_2.png",
  "sc-04-hack-1":   f"{S}/campaign_post/126_1.png",
  "sc-04-hack-2":   f"{S}/campaign_post/126_2.png",
  "sc-04-hack-3":   f"{S}/campaign_post/126_3.png",
  "sc-04-hack-4":   f"{S}/campaign_post/126_4.png",
  "sc-04-hack-5":   f"{S}/campaign_post/126_5.png",
  "sc-05-pass":     f"{S}/campaign_post/24.07 (2).png",
  "sc-06-judges":   f"{S}/campaign_post/307_1.png",
  "sc-06-judge":    f"{S}/campaign_post/307_2.png",
  "sc-07-tour-1":   f"{S}/campaign_post/39_1.png",
  "sc-07-tour-2":   f"{S}/campaign_post/39_2.png",
  "sc-08-top10":    f"{S}/campaign_post/17.08.2026.png",
  "sc-09-count":    f"{S}/campaign_post/30.08.2026.png",
  "sc-sponsor":     f"{S}/campaign_post/28.07.png",
  # --- SiviCamp: on site
  "sc-backdrop":    f"{S}/Backdrop/Idea 1.png",
  "sc-merch":       f"{S}/merch/merch_design.png",
  "sc-backdrop-irl":f"{S}/Backdrop/IMG_0786.JPG",
  "sc-irl-1":       f"{S}/merch/merch_irl_1.JPG",
  # --- ekkodale
  "hu-sketches":    f"{E}/Praktikum/image_123650291 (1).JPG",
  "hu-mark":        f"{H}/TYPO3_hugo/hugo_logo_blau.svg",    # official block-H app mark
  "hu-wordmark":    f"{H}/Logo/hugo_logo_mit_name.svg",
  "ga-wordmark":    f"{H}/gaeco/gaeco_logo_mit_name.svg",
  "hu-universe":    f"{H}/TYPO3_hugo/universum_hugo.svg",
  "hu-laptop":      f"{H}/laptop.webp",
  "hu-series":      f"{H}/webcast/hugo_webinarreihe.svg",
  "hu-community":   f"{H}/webcast/hug_community.svg",
  # webinar campaign
  "wb-01-announce": f"{E}/Praktikum/1.png",
  "wb-02-speakers": f"{E}/Praktikum/7.png",
  "wb-03-bridge":   f"{E}/Praktikum/linkedin_post_2.png",
  "wb-04-lastcall": f"{E}/Praktikum/last_call_2.png",
  "wb-05-live":     f"{E}/Praktikum/LinkedIn Postings.png",
  # --- LinkedIn editorial series
  "li-geht":        f"{E}/Praktikum/017.png",
  "li-tisch":       f"{E}/Praktikum/018.png",
  "li-code":        f"{E}/Praktikum/019.png",
  "li-traeumen":    f"{E}/Praktikum/020.png",
  # --- HS RheinMain recruiting
  "rm-poster":      f"{E}/Praktikum/rheinmain_hochschule.png",
  "rm-dark":        f"{E}/Praktikum/dunkel_01.png",
  "rm-connect":     f"{E}/Praktikum/c.png",
  # --- Light + Building / BTGA
  "lb-banner":      f"{E}/Praktikum/BTGA_LUX_Mainz_banner_format.png",
  "lb-poster":      f"{E}/Praktikum/BTGA_LUX_Mainz_poster_format.png",
  "lb-square":      f"{E}/Praktikum/BTGA_26_ekkodale_1x1.png",
  # --- Workshops & meetup
  "ws-scrum":       f"{H}/Website/Workshop/scrum_karte.svg",
  "ws-require":     f"{H}/Website/Workshop/require_karte.svg",
  "ws-roadmap":     f"{H}/Website/Workshop/scrum_ablauf.svg",
  "ws-meetup":      f"{E}/Praktikum/021.png",
  # --- Archive
  "ar-web-home":    f"{E}/Entwürfe für Website/Entwürfe für Website/final_draft_.jpeg",
  "ar-web-work":    f"{E}/Entwürfe für Website/Entwürfe für Website/workshop_neu.jpeg",
  "ar-white-1":     f"{E}/Praktikum/011.png",
  "ar-white-2":     f"{E}/Praktikum/012.png",
  "sc-figma-wire": "scripts/captures/figma/sivi-wireframe.png",  # from Figma, 2026-09-25
  "ex-hf11": "scripts/captures/figma/hf11.png",  # from Figma, 2026-09-25
  "ex-bershka": "scripts/captures/figma/bershka.png",  # from Figma, 2026-09-25
  "lt-make": "scripts/captures/figma/lt-make-draft.png",  # from Figma, 2026-09-25
  "vm-live":        "scripts/captures/live/voicemeup-ticket.png",  # live app, ticket crop, 2026-09-25
  "pet-duo":        "scripts/captures/live/pet-duo.png",  # real sprites on card colour
  "fx-hf-bars-1": "scripts/captures/figma/fx/hf-bars-1.png",
  "fx-hf-bars-2": "scripts/captures/figma/fx/hf-bars-2.png",
  "fx-hf-bars-3": "scripts/captures/figma/fx/hf-bars-3.png",
  "fx-hf-carousel-1": "scripts/captures/figma/fx/hf-carousel-1.png",
  "fx-hf-carousel-2": "scripts/captures/figma/fx/hf-carousel-2.png",
  "fx-hf-carousel-3": "scripts/captures/figma/fx/hf-carousel-3.png",
  "fx-hf-spec-1": "scripts/captures/figma/fx/hf-spec-1.png",
  "fx-hf-spec-2": "scripts/captures/figma/fx/hf-spec-2.png",
  "fx-hf-spec-3": "scripts/captures/figma/fx/hf-spec-3.png",
  "fx-hf-strip-1": "scripts/captures/figma/fx/hf-strip-1.png",
  "fx-hf-strip-2": "scripts/captures/figma/fx/hf-strip-2.png",
  "fx-hf-strip-3": "scripts/captures/figma/fx/hf-strip-3.png",
  "fx-hf-strip-4": "scripts/captures/figma/fx/hf-strip-4.png",
  "fx-hf-strip-5": "scripts/captures/figma/fx/hf-strip-5.png",
  "fx-hf-strip-6": "scripts/captures/figma/fx/hf-strip-6.png",
  "fx-br-1": "scripts/captures/figma/fx/br-1.png",
  "fx-br-2": "scripts/captures/figma/fx/br-2.png",
  "fx-br-3": "scripts/captures/figma/fx/br-3.png",
  "sb-ui": "scripts/captures/storybook/sb-ui.png",  # own Storybook build of website.components, 2026-09-25
  "sb-pricing": "scripts/captures/storybook/sb-pricing.png",  # own Storybook build of website.components, 2026-09-25
  "sb-compare": "scripts/captures/storybook/sb-compare.png",  # own Storybook build of website.components, 2026-09-25
  "sb-steps": "scripts/captures/storybook/sb-steps.png",
  "sb-schedule": "scripts/captures/storybook/sb-schedule.png",
  "gaeco-frame": "scripts/captures/live/gaeco-frame.png",  # still from my gaeco recording
  "jd-top":         "scripts/captures/jude/top.png",  # fan site hero, captured 2026-09-25
  "ar-gaeco":       f"{H}/gaeco/visuals gaecooo.svg",
  # --- Own projects (privat_propjects). Excluded on purpose: jude (press photos),
  #     archive_touch photo references (personal photos), Claude Project (Starbucks assets),
  #     posters 001/002/007 (fan designs with unlicensed photos, e.g. Joji) – keep out.
  "lt-logo":        f"{P}/LiveTicker/case-study-assets/logo-lt-full.png",
  "lt-var-1":       f"{P}/LiveTicker/Liveticker_Logos/ArtBoard1_2.png",
  "lt-var-2":       f"{P}/LiveTicker/Liveticker_Logos/ArtBoard5_2.png",
  "lt-var-3":       f"{P}/LiveTicker/Liveticker_Logos/ArtBoard6.png",
  "lt-var-4":       f"{P}/LiveTicker/Liveticker_Logos/ArtBoard2_3.png",
  "lt-coop":        f"{P}/LiveTicker/liveticker-screenshots/m04_ticker_coop_full.png",
  "lt-edit":        f"{P}/LiveTicker/liveticker-screenshots/17_editable_entry.png",
  "lt-guard":       f"{P}/LiveTicker/liveticker-screenshots/20_blank_publish_guard.png",
  "lt-matchday":    f"{P}/LiveTicker/liveticker-screenshots/m03_matchday_picker.png",
  "vm-1":           f"{P}/voicme_app/interface/Artboard1.png",
  "vm-2":           f"{P}/voicme_app/interface/Artboard1_2.png",
  "vm-3":           f"{P}/voicme_app/interface/Artboard1_3.png",
  "vm-4":           f"{P}/voicme_app/interface/Artboard1_5.png",
  "at-select":      f"{P}/archive_touch/references/Selection_Op1.png",
  "at-folder":      f"{P}/archive_touch/references/FolderPick_1.png",
  "st-bunny":       f"{P}/puppy_jk/assets/frames/final_bunny.png",
  "st-penguin":     f"{P}/puppy_jk/assets/frames/final_penguin.png",
  # --- LiveTicker case study
  "lt-mark":        f"{P}/LiveTicker/case-study-assets/logo-lt-mark.png",
  "lt-hero":        f"{P}/LiveTicker/liveticker-screenshots/07_ticker_coop.png",
  "lt-before-ws":   f"{P}/LiveTicker/before_state/PHOTO-2026-02-19-17-43-51.jpg",
  "lt-before-onb":  f"{P}/LiveTicker/before_state/PHOTO-2026-03-09-17-54-30.jpg",
  "lt-after-onb":   f"{P}/LiveTicker/liveticker-screenshots/01_start.png",
  "lt-before-dd":   f"{P}/LiveTicker/before_state/PHOTO-2026-03-09-17-54-37.jpg",
  "lt-after-dd":    f"{P}/LiveTicker/liveticker-screenshots/crops/country.png",
  "lt-mode-auto":   f"{P}/LiveTicker/liveticker-screenshots/crops/auto_top.png",
  "lt-mode-coop":   f"{P}/LiveTicker/liveticker-screenshots/crops/coop_top.png",
  "lt-mode-manual": f"{P}/LiveTicker/liveticker-screenshots/crops/manual_top.png",
  "lt-ai-edit":     f"{P}/LiveTicker/liveticker-screenshots/crops/ai_edit.png",
  "lt-slash":       f"{P}/LiveTicker/liveticker-screenshots/13_slash_command.png",
  "lt-slash-help":  f"{P}/LiveTicker/liveticker-screenshots/14_slash_command_help.png",
  "lt-help":        f"{P}/LiveTicker/liveticker-screenshots/crops/help.png",
  "lt-retrieval":   f"{P}/LiveTicker/liveticker-screenshots/16_retrieval_entries.png",
  "lt-m-coop":      f"{P}/LiveTicker/liveticker-screenshots/m05_ticker_coop_top.png",
  "lt-m-ticker":    f"{P}/LiveTicker/liveticker-screenshots/m06_ticker_tab_top.png",
  "lt-m-stats":     f"{P}/LiveTicker/liveticker-screenshots/m07_stats_tab_top.png",
  "ds-tokens":      "scripts/captures/ds/tokens.png",  # drawn from ~/design-system/src/tokens.json
  # --- ekkodale career site (live pages captured 2026-09-24)
  "ca-process":     "scripts/captures/career/process.png",
  "ca-benefits":    "scripts/captures/career/benefits-full.png",
  "ca-praktikum":   "scripts/captures/career/praktikum-full.png",
  "ca-bewerbung":   "scripts/captures/career/bewerbung-full.png",
}
TALL = {"sc-figma-wire", "ex-hf11", "ex-bershka", "ex-stack-new", "ex-stack-old", "ar-web-home", "ar-web-work", "sc-site-full", "ca-benefits", "ca-praktikum", "ca-bewerbung"}   # long page captures: keep width, cap height separately

def load(src, tmp):
    if src.lower().endswith(".svg"):
        subprocess.run(["qlmanage","-t","-s","2000","-o",tmp,src],capture_output=True)
        im = Image.open(os.path.join(tmp, os.path.basename(src)+".png")).convert("RGB")
        bg = Image.new("RGB", im.size, (255,255,255))
        box = ImageChops.difference(im, bg).getbbox()
        return im.crop(box) if box else im
    return ImageOps.exif_transpose(Image.open(src)).convert("RGB")

out = "public/img"; os.makedirs(out, exist_ok=True)
meta = {}
with tempfile.TemporaryDirectory() as tmp:
    for id_, src in ASSETS.items():
        if not os.path.exists(src):
            # source moved/removed: keep the already-built image, but say so
            print(f"SKIP {id_}: source missing ({src}); keeping existing output" if os.path.exists(f"{out}/{id_}.webp") else f"MISSING {id_}: {src}")
            if os.path.exists(f"{out}/{id_}.webp"):
                meta[id_] = json.load(open("src/data/image-sizes.json")).get(id_) or [0, 0]
            continue
        im = load(src, tmp)
        for suffix, edge in (("", 1800), ("-sm", 720)):
            c = im.copy()
            if id_ in TALL: c.thumbnail((edge if suffix else 1200, 100000))
            else: c.thumbnail((edge, edge))
            c.save(f"{out}/{id_}{suffix}.webp", "WEBP", quality=80, method=6)
        meta[id_] = [im.width, im.height]
        print(f"{id_:18} {im.width}x{im.height}  {os.path.getsize(f'{out}/{id_}.webp')//1024} KB")
json.dump(meta, open("src/data/image-sizes.json","w"), indent=0)

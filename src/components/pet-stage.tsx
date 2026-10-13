import { useEffect, useRef, useState } from "react"
import { useT } from "@/lib/i18n"
import { cn } from "@/lib/utils"

/* The desktop pet from privat_propjects/puppy_jk, living inside one framed stage instead of the
   whole desktop. Same WALK / IDLE state machine: one static frame per compass direction, motion is
   procedural (hop and squash while walking, breathing while idle, the bunny's wiggle, the penguin's
   sway). Pets can be picked up and dropped anywhere inside the frame. */

type Dir = { frame: string; flip: boolean }
type PetData = { displayHeight: number; dirs: Record<string, Dir>; special?: string | null }

const BASE = "/pet/"
const COMPASS = ["e", "se", "s", "sw", "w", "nw", "n", "ne"]
const compassFromVec = (dx: number, dy: number) => COMPASS[((Math.round(Math.atan2(dy, dx) / (Math.PI / 4)) % 8) + 8) % 8]

class Pet {
  wrap: HTMLDivElement; img: HTMLImageElement
  h: number; w: number; flip = false; facing = "s"; src: string | null = null
  cx = 0; cy = 0; tx = 0; ty = 0; speed = 34 + Math.random() * 22; bob = Math.random() * Math.PI * 2
  state: "idle" | "walk" | "grabbed" = "idle"; stateT = 0; idleDur = 1.5 + Math.random() * 3
  special = false; specialT = 0; gx = 0; gy = 0

  constructor(public name: string, public data: PetData, stage: HTMLElement, scale: number) {
    this.wrap = document.createElement("div")
    this.wrap.className = "absolute left-0 top-0 cursor-grab touch-none will-change-transform"
    this.img = document.createElement("img")
    this.img.alt = ""
    this.img.draggable = false
    this.img.className = "block h-full w-auto select-none [image-rendering:pixelated]"
    this.wrap.appendChild(this.img)
    stage.appendChild(this.wrap)
    this.h = data.displayHeight * scale
    this.w = this.h * 0.75
    this.wrap.style.height = `${this.h}px`
    this.img.addEventListener("load", () => { const r = this.wrap.getBoundingClientRect(); if (r.width) this.w = r.width })
    this.setDir("s")
  }
  contains(x: number, y: number) {
    return Math.abs(x - this.cx) <= this.w / 2 && Math.abs(y - this.cy) <= this.h / 2
  }
  setDir(c: string) {
    const d = this.data.dirs[c]; if (!d) return
    if (this.src !== d.frame) { this.img.src = BASE + d.frame; this.src = d.frame }
    this.facing = c; this.flip = d.flip
  }
  grab(x: number, y: number) {
    this.state = "grabbed"; this.special = false; this.gx = this.cx - x; this.gy = this.cy - y
    this.setDir("s"); this.wrap.style.cursor = "grabbing"
  }
  drop() { this.wrap.style.cursor = ""; this.state = "idle"; this.stateT = 0; this.idleDur = 0.8 + Math.random() * 1.5 }
  pickTarget(W: number, H: number) {
    const m = 8
    this.tx = m + this.w / 2 + Math.random() * Math.max(0, W - 2 * m - this.w)
    this.ty = m + this.h / 2 + Math.random() * Math.max(0, H - 2 * m - this.h)
  }
  update(dt: number, W: number, H: number, now: number, still: boolean) {
    if (this.state === "walk" && !still) {
      const dx = this.tx - this.cx, dy = this.ty - this.cy, dist = Math.hypot(dx, dy)
      if (dist < 3) { this.state = "idle"; this.stateT = 0; this.idleDur = 1.5 + Math.random() * 4 }
      else {
        const step = Math.min(dist, this.speed * dt)
        this.cx += (dx / dist) * step; this.cy += (dy / dist) * step
        this.setDir(compassFromVec(dx, dy))
      }
    } else if (this.state === "idle" && !still) {
      this.stateT += dt
      if (this.data.special && !this.special && Math.random() < dt * 0.12) {
        this.special = true; this.specialT = 1.4; this.img.src = BASE + this.data.special; this.src = this.data.special
      }
      if (this.special && (this.specialT -= dt) <= 0) { this.special = false; this.src = null; this.setDir(this.facing) }
      if (this.stateT >= this.idleDur && !this.special) { this.pickTarget(W, H); this.state = "walk" }
    }
    this.cx = Math.max(this.w / 2, Math.min(W - this.w / 2, this.cx))
    this.cy = Math.max(this.h / 2, Math.min(H - this.h / 2, this.cy))
    this.render(now, still)
  }
  render(now: number, still: boolean) {
    this.wrap.style.transform = `translate3d(${Math.round(this.cx - this.w / 2)}px, ${Math.round(this.cy - this.h / 2)}px, 0)`
    this.wrap.style.zIndex = this.state === "grabbed" ? "3" : this.state === "walk" ? "2" : "1"
    let t = `scaleX(${this.flip ? -1 : 1})`
    if (this.state === "grabbed") t += ` translateY(-6px) scale(1.12) rotate(${(Math.sin(now / 90) * 5).toFixed(2)}deg)`
    else if (still) { /* reduced motion: no bobbing */ }
    else if (this.state === "walk") {
      const p = now / 140 + this.bob
      t += ` translateY(${(-Math.abs(Math.sin(p)) * 6).toFixed(2)}px) scale(${(1 + Math.sin(p) * 0.04).toFixed(3)},${(1 - Math.sin(p) * 0.04).toFixed(3)})`
    } else {
      const b = Math.sin(now / 650 + this.bob) * 0.02
      const sway = this.name === "penguin" ? ` rotate(${(Math.sin(now / 700 + this.bob) * 3).toFixed(2)}deg)` : ""
      t += ` scale(${(1 - b).toFixed(3)},${(1 + b).toFixed(3)})${sway}`
    }
    this.img.style.transform = t
  }
}

export function PetStage({ className }: { className?: string }) {
  const t = useT()
  const stageRef = useRef<HTMLDivElement>(null)
  const [held, setHeld] = useState(false)

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const pets: Pet[] = []
    let raf = 0, last = performance.now(), dead = false, grabbed: Pet | null = null
    let cleanupIO = () => {}
    const local = (e: PointerEvent) => { const r = stage.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top] as const }

    fetch(`${BASE}manifest.json`).then((r) => r.json()).then((m: Record<string, PetData>) => {
      if (dead) return
      const W = stage.clientWidth, H = stage.clientHeight
      const scale = W < 640 ? 0.6 : 0.85
      ;(["penguin", "bunny"] as const).forEach((name, i) => {
        if (!m[name]) return
        const p = new Pet(name, m[name], stage, scale)
        p.cx = W * (0.3 + i * 0.4); p.cy = H * 0.55
        pets.push(p)
      })
      // in view only: no animation work while the section is off screen
      let visible = true
      const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
      io.observe(stage)
      const tick = (now: number) => {
        const dt = Math.min(0.05, (now - last) / 1000); last = now
        if (visible) for (const p of pets) p.update(dt, stage.clientWidth, stage.clientHeight, now, still)
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
      cleanupIO = () => io.disconnect()
    })

    const onDown = (e: PointerEvent) => {
      const [x, y] = local(e)
      const hit = [...pets].reverse().find((p) => p.contains(x, y))
      if (!hit) return
      e.preventDefault()
      grabbed = hit; hit.grab(x, y); setHeld(true)
      stage.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!grabbed) return
      const [x, y] = local(e)
      grabbed.cx = x + grabbed.gx; grabbed.cy = y + grabbed.gy
    }
    const onUp = () => { if (grabbed) { grabbed.drop(); grabbed = null; setHeld(false) } }
    stage.addEventListener("pointerdown", onDown)
    stage.addEventListener("pointermove", onMove)
    stage.addEventListener("pointerup", onUp)
    stage.addEventListener("pointercancel", onUp)
    return () => {
      dead = true; cancelAnimationFrame(raf); cleanupIO()
      stage.removeEventListener("pointerdown", onDown)
      stage.removeEventListener("pointermove", onMove)
      stage.removeEventListener("pointerup", onUp)
      stage.removeEventListener("pointercancel", onUp)
      pets.forEach((p) => p.wrap.remove())
    }
  }, [])

  return (
    <div className={className}>
      <div ref={stageRef} role="img"
        aria-label={t("Pixel-Hase und Pixel-Pinguin laufen in einem Rahmen umher. Man kann sie hochheben und absetzen.",
          "A pixel bunny and a pixel penguin walk around inside a frame. You can pick them up and drop them.")}
        className={cn("relative h-[22rem] overflow-hidden rounded-[8px] border border-line bg-panel sm:h-[26rem]",
          "bg-[radial-gradient(color-mix(in_oklab,var(--ink)_12%,transparent)_1px,transparent_1px)] [background-size:18px_18px]")} />
      <p className="label mt-4">{held ? t("Loslassen zum Absetzen", "Release to drop") : t("Figur anklicken und ziehen, um sie hochzuheben", "Click and drag a character to pick it up")}</p>
    </div>
  )
}

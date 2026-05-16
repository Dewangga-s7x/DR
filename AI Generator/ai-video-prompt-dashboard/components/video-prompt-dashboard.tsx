"use client"

import { useState, useEffect, useCallback } from "react"
import {
  ChevronDown,
  Film,
  Sparkles,
  Sun,
  Heart,
  RatioIcon,
  Clock,
  Music,
  Wand2,
  Copy,
  Clapperboard,
  Palette,
  Lightbulb,
  Camera,
  Menu,
  X,
  Circle,
  Play,
  Check,
  Layers,
  Radio,
  Shuffle,
  RotateCcw,
  Send,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Option {
  id: string
  label: string
  color?: string
}

interface Section {
  id: string
  title: string
  icon: React.ReactNode
  options: Option[]
  multiSelect?: boolean
  useThumbnails?: boolean
}

const EXPORT_TARGETS = ["Veo", "Kling", "Runway", "Sora"] as const
type ExportTarget = (typeof EXPORT_TARGETS)[number]

const presets = [
  {
    id: "cinematic-drama",
    title: "Cinematic Drama",
    description: "Emotional depth with dramatic lighting",
    preview: "from-amber-950/40 via-stone-800/70 to-stone-900/95",
    accentColor: "bg-amber-900/50 ring-1 ring-amber-800/25",
    icon: Film,
  },
  {
    id: "sci-fi-epic",
    title: "Sci-Fi Epic",
    description: "Futuristic atmosphere, deep navy palette",
    preview: "from-indigo-950/50 via-slate-800/75 to-slate-950/98",
    accentColor: "bg-slate-700/50 ring-1 ring-indigo-900/30",
    icon: Sparkles,
  },
  {
    id: "nature-doc",
    title: "Nature Doc",
    description: "Organic landscapes, golden hour warmth",
    preview: "from-emerald-950/35 via-stone-800/70 to-stone-950/95",
    accentColor: "bg-emerald-950/50 ring-1 ring-emerald-900/25",
    icon: Sun,
  },
  {
    id: "noir-thriller",
    title: "Noir Thriller",
    description: "Muted steel tones, high contrast shadows",
    preview: "from-zinc-700/25 via-zinc-900/85 to-zinc-950/98",
    accentColor: "bg-zinc-600/40 ring-1 ring-zinc-500/20",
    icon: Camera,
  },
]

const lightingOptions: Option[] = [
  { id: "golden-hour", label: "Golden Hour", color: "from-amber-900/80 to-stone-900/95" },
  { id: "blue-hour", label: "Blue Hour", color: "from-slate-600/60 to-indigo-950/90" },
  { id: "neon", label: "Neon Glow", color: "from-indigo-950/70 via-slate-900/80 to-stone-950/95" },
  { id: "natural", label: "Natural", color: "from-stone-600/40 to-amber-950/50" },
  { id: "studio", label: "Studio", color: "from-zinc-500/35 to-zinc-700/55" },
  { id: "dramatic", label: "Dramatic", color: "from-zinc-900/90 via-amber-950/35 to-zinc-950/95" },
  { id: "low-key", label: "Low Key", color: "from-zinc-900/95 to-zinc-800/75" },
  { id: "high-key", label: "High Key", color: "from-zinc-400/25 to-zinc-500/35" },
]

const sections: Section[] = [
  {
    id: "project-type",
    title: "Project Type",
    icon: <Film className="h-3.5 w-3.5" />,
    options: [
      { id: "commercial", label: "Commercial" },
      { id: "music-video", label: "Music Video" },
      { id: "short-film", label: "Short Film" },
      { id: "documentary", label: "Documentary" },
      { id: "social-media", label: "Social" },
      { id: "trailer", label: "Trailer" },
    ],
  },
  {
    id: "visual-style",
    title: "Visual Style",
    icon: <Palette className="h-3.5 w-3.5" />,
    options: [
      { id: "cinematic", label: "Cinematic" },
      { id: "minimalist", label: "Minimal" },
      { id: "vintage", label: "Vintage" },
      { id: "futuristic", label: "Futuristic" },
      { id: "anime", label: "Anime" },
      { id: "noir", label: "Noir" },
      { id: "surreal", label: "Surreal" },
      { id: "documentary", label: "Doc Style" },
    ],
  },
  {
    id: "lighting",
    title: "Lighting",
    icon: <Lightbulb className="h-3.5 w-3.5" />,
    options: lightingOptions,
    useThumbnails: true,
  },
  {
    id: "camera-movement",
    title: "Camera",
    icon: <Camera className="h-3.5 w-3.5" />,
    options: [
      { id: "static", label: "Static" },
      { id: "dolly", label: "Dolly" },
      { id: "tracking", label: "Track" },
      { id: "crane", label: "Crane" },
      { id: "handheld", label: "Handheld" },
      { id: "steadicam", label: "Steadicam" },
      { id: "drone", label: "Drone" },
      { id: "whip-pan", label: "Whip Pan" },
    ],
  },
  {
    id: "emotion",
    title: "Emotion",
    icon: <Heart className="h-3.5 w-3.5" />,
    options: [
      { id: "dramatic", label: "Dramatic" },
      { id: "uplifting", label: "Uplifting" },
      { id: "mysterious", label: "Mystery" },
      { id: "nostalgic", label: "Nostalgic" },
      { id: "tense", label: "Tense" },
      { id: "peaceful", label: "Peaceful" },
      { id: "energetic", label: "Energetic" },
      { id: "melancholic", label: "Melancholy" },
    ],
  },
  {
    id: "aspect-ratio",
    title: "Aspect Ratio",
    icon: <RatioIcon className="h-3.5 w-3.5" />,
    options: [
      { id: "16:9", label: "16:9" },
      { id: "21:9", label: "21:9" },
      { id: "4:3", label: "4:3" },
      { id: "1:1", label: "1:1" },
      { id: "9:16", label: "9:16" },
      { id: "2.39:1", label: "2.39:1" },
    ],
  },
  {
    id: "duration",
    title: "Duration",
    icon: <Clock className="h-3.5 w-3.5" />,
    options: [
      { id: "5s", label: "5s" },
      { id: "10s", label: "10s" },
      { id: "15s", label: "15s" },
      { id: "30s", label: "30s" },
      { id: "60s", label: "60s" },
    ],
  },
  {
    id: "audio-mood",
    title: "Audio",
    icon: <Music className="h-3.5 w-3.5" />,
    options: [
      { id: "orchestral", label: "Orchestral" },
      { id: "electronic", label: "Electronic" },
      { id: "ambient", label: "Ambient" },
      { id: "rock", label: "Rock" },
      { id: "jazz", label: "Jazz" },
      { id: "silence", label: "Silent" },
      { id: "nature-sounds", label: "Nature" },
      { id: "lo-fi", label: "Lo-Fi" },
    ],
  },
]

function pad2(n: number) {
  return String(n).padStart(2, "0")
}

function AnimatedTimecode({ active }: { active?: boolean }) {
  const [timecode, setTimecode] = useState("00:00:00:00")

  useEffect(() => {
    const start = performance.now()
    const tick = () => {
      const elapsed = performance.now() - start
      const totalFrames = Math.floor((elapsed / 1000) * 24)
      const frames = totalFrames % 24
      const secs = Math.floor(elapsed / 1000) % 60
      const mins = Math.floor(elapsed / 60000) % 60
      const hrs = Math.floor(elapsed / 3600000)
      setTimecode(`${pad2(hrs)}:${pad2(mins)}:${pad2(secs)}:${pad2(frames)}`)
    }
    tick()
    const ms = active ? 1000 / 30 : 1000 / 24
    const id = setInterval(tick, ms)
    return () => clearInterval(id)
  }, [active])

  return (
    <span
      className={cn(
        "font-mono text-[11px] tabular-nums tracking-wide text-accent/90",
        active && "text-accent"
      )}
    >
      TC {timecode}
    </span>
  )
}

function WaveformBars({ active, bars = 16 }: { active?: boolean; bars?: number }) {
  return (
    <div
      className={cn("flex h-5 items-end gap-[3px]", active && "waveform-active")}
      aria-hidden
    >
      {Array.from({ length: bars }).map((_, i) => (
        <div
          key={i}
          className="waveform-bar w-[3px] rounded-full bg-accent/50"
          style={{
            height: `${8 + (i % 6) * 2}px`,
            animationDelay: `${i * 0.06}s`,
          }}
        />
      ))}
    </div>
  )
}

function ActiveSelectionBar({
  chips,
  onRemove,
}: {
  chips: { sectionId: string; optionId: string; label: string }[]
  onRemove: (sectionId: string, optionId: string) => void
}) {
  const [exiting, setExiting] = useState<string | null>(null)

  const handleRemove = (sectionId: string, optionId: string) => {
    const key = `${sectionId}-${optionId}`
    setExiting(key)
    setTimeout(() => {
      onRemove(sectionId, optionId)
      setExiting(null)
    }, 200)
  }

  if (chips.length === 0) return null

  return (
    <div className="glass-panel rounded-2xl px-5 py-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
            Production Deck
          </p>
          <p className="mt-0.5 text-xs text-foreground/80">
            Assembling creative direction live
          </p>
        </div>
        <span className="rounded-full border border-border/60 bg-secondary/50 px-2.5 py-1 font-mono text-[10px] text-accent">
          {chips.length} armed
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => {
          const key = `${chip.sectionId}-${chip.optionId}`
          return (
            <button
              key={key}
              type="button"
              onClick={() => handleRemove(chip.sectionId, chip.optionId)}
              className={cn(
                "group chip-enter flex items-center gap-2 rounded-lg border border-border/50 bg-secondary/50 pl-3 pr-2 py-1.5 text-[11px] font-medium text-foreground/90 transition-all duration-300",
                "hover:border-accent/35 hover:bg-accent/10 hover:shadow-[0_0_20px_var(--cinema-glow)]",
                exiting === key && "chip-exit pointer-events-none"
              )}
            >
              <span>{chip.label}</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-md bg-muted/50 text-muted-foreground transition-colors group-hover:bg-red-950/40 group-hover:text-red-300/90">
                <X className="h-3 w-3" />
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export function VideoPromptDashboard() {
  const [selections, setSelections] = useState<Record<string, string[]>>({})
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(sections.map((s) => [s.id, false]))
  )
  const [activePreset, setActivePreset] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [exportTarget, setExportTarget] = useState<ExportTarget>("Runway")
  const [generatedOutput, setGeneratedOutput] = useState({
    creativeDirection: "",
    finalPrompt: "",
    negativePrompt: "",
    whyThisWorks: "",
  })

  const handleGenerate = async () => {
    try {
      setIsGenerating(true)
  
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
  
        body: JSON.stringify({
          projectType: selections["project-type"]?.[0] || "",
          visualStyle: selections["visual-style"]?.[0] || "",
          lighting: selections["lighting"]?.[0] || "",
          camera: selections["camera-movement"]?.[0] || "",
          emotion: selections["emotion"]?.[0] || "",
          aspectRatio: selections["aspect-ratio"]?.[0] || "",
          duration: selections["duration"]?.[0] || "",
          audio: selections["audio-mood"]?.[0] || "",
          exportTarget,
        }),
      })
  
      const data = await response.json()
  
      setGeneratedOutput({
        creativeDirection: data.creativeDirection || "",
        finalPrompt: data.finalPrompt || "",
        negativePrompt: data.negativePrompt || "",
        whyThisWorks: data.whyThisWorks || "",
      })
  
    } catch (error) {
      console.error(error)
    } finally {
      setIsGenerating(false)
    }
  }
  const selectionCount = Object.values(selections).reduce(
    (sum, arr) => sum + (arr?.length ?? 0),
    0
  )

  const getSelectedLabel = useCallback((sectionId: string, optionId: string) => {
    const section = sections.find((s) => s.id === sectionId)
    return section?.options.find((o) => o.id === optionId)?.label || optionId
  }, [])

  const generateCreativeDirection = useCallback(() => {
    return (
      generatedOutput.creativeDirection ||
      "Arm your production deck to generate tailored creative direction for this take."
    )
  }, [generatedOutput])

  const generateShotList = useCallback(() => {
    const camera = selections["camera-movement"]?.[0]
    const style = selections["visual-style"]?.[0]

    return [
      {
        shot: "Opening",
        description: camera === "drone" ? "Aerial establishing shot, slow descent" : "Wide establishing shot",
        timecode: "00:00:00",
      },
      {
        shot: "Mid",
        description: style === "cinematic" ? "Medium close-up, shallow DOF" : "Dynamic medium shot",
        timecode: "00:00:08",
      },
      {
        shot: "Detail",
        description: "Extreme close-up, textural focus",
        timecode: "00:00:16",
      },
      {
        shot: "Closing",
        description: camera === "dolly" ? "Slow dolly out, reveal context" : "Final wide shot",
        timecode: "00:00:24",
      },
    ]
  }, [selections])

  const generateFinalPrompt = useCallback(() => {
    const parts: string[] = []

    if (selections["project-type"]?.[0]) {
      parts.push(getSelectedLabel("project-type", selections["project-type"][0]))
    }
    if (selections["visual-style"]?.[0]) {
      parts.push(`${getSelectedLabel("visual-style", selections["visual-style"][0])} style`)
    }
    if (selections["lighting"]?.[0]) {
      parts.push(`${getSelectedLabel("lighting", selections["lighting"][0])} lighting`)
    }
    if (selections["camera-movement"]?.[0]) {
      parts.push(`${getSelectedLabel("camera-movement", selections["camera-movement"][0])} camera movement`)
    }
    if (selections["emotion"]?.[0]) {
      parts.push(`${getSelectedLabel("emotion", selections["emotion"][0])} mood`)
    }
    if (selections["aspect-ratio"]?.[0]) {
      parts.push(getSelectedLabel("aspect-ratio", selections["aspect-ratio"][0]))
    }
    if (selections["duration"]?.[0]) {
      parts.push(getSelectedLabel("duration", selections["duration"][0]))
    }
    if (selections["audio-mood"]?.[0]) {
      parts.push(`${getSelectedLabel("audio-mood", selections["audio-mood"][0])} audio`)
    }

    if (parts.length === 0) {
      return "Arm parameters from the production deck to build your export-ready cinematic prompt..."
    }

    const base = `Create a ${parts.join(", ")}. The video should feature professional-grade cinematography with attention to composition, pacing, and visual storytelling.`
    return exportTarget ? `${base}\n\n[Optimized for ${exportTarget}]` : base
  }, [selections, exportTarget, getSelectedLabel])

  const generateNegativePrompt = useCallback(() => {
    const negatives = [
      "amateur footage",
      "poor lighting",
      "shaky camera",
      "overexposed",
      "underexposed",
      "blurry",
      "low resolution",
      "compression artifacts",
      "watermarks",
      "text overlays",
    ]

    const style = selections["visual-style"]?.[0]
    if (style === "cinematic") negatives.push("flat color grading", "standard video look")
    if (style === "noir") negatives.push("bright colors", "high saturation", "cheerful mood")
    if (style === "vintage") negatives.push("modern aesthetics", "digital perfection")

    return negatives.join(", ")
  }, [selections])

  const toggleSelection = (sectionId: string, optionId: string) => {
    setSelections((prev) => {
      const current = prev[sectionId] || []
      const section = sections.find((s) => s.id === sectionId)

      if (section?.multiSelect) {
        if (current.includes(optionId)) {
          return { ...prev, [sectionId]: current.filter((id) => id !== optionId) }
        }
        return { ...prev, [sectionId]: [...current, optionId] }
      }
      return { ...prev, [sectionId]: [optionId] }
    })
    setActivePreset(null)
  }

  const removeChip = (sectionId: string, optionId: string) => {
    setSelections((prev) => {
      const current = prev[sectionId] || []
      const next = current.filter((id) => id !== optionId)
      if (next.length === 0) {
        const { [sectionId]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [sectionId]: next }
    })
    setActivePreset(null)
  }

  const applyPreset = (presetId: string) => {
    setActivePreset(presetId)
    const presetSelections: Record<string, string[]> = {
      "cinematic-drama": {
        "project-type": ["short-film"],
        "visual-style": ["cinematic"],
        lighting: ["dramatic"],
        "camera-movement": ["dolly"],
        emotion: ["dramatic"],
        "aspect-ratio": ["21:9"],
        duration: ["30s"],
        "audio-mood": ["orchestral"],
      },
      "sci-fi-epic": {
        "project-type": ["trailer"],
        "visual-style": ["futuristic"],
        lighting: ["neon"],
        "camera-movement": ["drone"],
        emotion: ["energetic"],
        "aspect-ratio": ["21:9"],
        duration: ["15s"],
        "audio-mood": ["electronic"],
      },
      "nature-doc": {
        "project-type": ["documentary"],
        "visual-style": ["documentary"],
        lighting: ["golden-hour"],
        "camera-movement": ["drone"],
        emotion: ["peaceful"],
        "aspect-ratio": ["16:9"],
        duration: ["60s"],
        "audio-mood": ["nature-sounds"],
      },
      "noir-thriller": {
        "project-type": ["short-film"],
        "visual-style": ["noir"],
        lighting: ["low-key"],
        "camera-movement": ["steadicam"],
        emotion: ["mysterious"],
        "aspect-ratio": ["2.39:1"],
        duration: ["30s"],
        "audio-mood": ["jazz"],
      },
    }
    setSelections(presetSelections[presetId] || {})
  }

  const surpriseMe = () => {
    const random: Record<string, string[]> = {}
    sections.forEach((section) => {
      const opt = section.options[Math.floor(Math.random() * section.options.length)]
      random[section.id] = [opt.id]
    })
    setSelections(random)
    setActivePreset(null)
  }

  const newSession = () => {
    setSelections({})
    setActivePreset(null)
    setOpenSections(Object.fromEntries(sections.map((s) => [s.id, false])))
    setCopiedField(null)
  }


  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const copyAll = () => {
    const shots = generateShotList()
      .map((s) => `${s.timecode} · ${s.shot} — ${s.description}`)
      .join("\n")
    const text = [
      "=== CREATIVE DIRECTION ===",
      generateCreativeDirection(),
      "",
      "=== FINAL PROMPT ===",
      generateFinalPrompt(),
      "",
      "=== NEGATIVE PROMPT ===",
      generateNegativePrompt(),
      "",
      "=== SHOT LIST ===",
      shots,
      "",
      `=== EXPORT TARGET: ${exportTarget} ===`,
    ].join("\n")
    copyToClipboard(text, "all")
  }

  const activeChips = sections.flatMap((section) =>
    (selections[section.id] ?? []).map((optionId) => ({
      sectionId: section.id,
      optionId,
      label: getSelectedLabel(section.id, optionId),
    }))
  )

  const creativeDirection = generateCreativeDirection()
  const finalPrompt = generateFinalPrompt()
  const negativePrompt = generateNegativePrompt()
  const shotList = generateShotList()

  return (
    <div className="cos-bg relative flex h-screen flex-col overflow-hidden text-foreground">
      <div className="pointer-events-none absolute inset-0 z-0 cinema-grid" />
      <div className="pointer-events-none absolute inset-0 z-0 cinema-grain" />
      <div className="pointer-events-none absolute -top-48 left-1/2 z-0 h-80 w-[800px] -translate-x-1/2 rounded-full bg-accent/7 blur-[130px] animate-ambient-glow" />
      <div className="pointer-events-none absolute bottom-0 right-0 z-0 h-96 w-96 rounded-full bg-[var(--navy-mist)] blur-[100px]" />

      {/* Mobile header */}
      <div className="relative z-20 flex items-center justify-between border-b border-border/50 glass-panel px-5 py-3.5 lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary/70 ring-1 ring-accent/15">
            <Clapperboard className="h-4 w-4 text-accent" />
          </div>
          <div>
            <span className="text-sm font-semibold tracking-tight">CinePrompt</span>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">
              Creative OS
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 border border-border/50"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      <header className="relative z-20 hidden shrink-0 items-center justify-between border-b border-border/50 glass-panel px-6 py-3.5 lg:flex">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary/60 ring-1 ring-accent/12 shadow-[0_0_28px_var(--cinema-glow)]">
            <Clapperboard className="h-4 w-4 text-accent" />
          </div>
          <div>
            <h1 className="text-base font-semibold tracking-tight">CinePrompt Studio</h1>
            <p className="text-[10px] font-mono uppercase tracking-[0.22em] text-muted-foreground">
              Cinematic Creative Operating System
            </p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
            <Radio className="h-3 w-3 text-emerald-500/75" />
            <span className="text-emerald-500/75">SIGNAL OK</span>
          </div>
          <span className="hidden font-mono text-[10px] text-muted-foreground xl:inline">
            {selections["aspect-ratio"]?.[0] || "16:9"} · {selections["duration"]?.[0] || "30s"} · 24 FPS
          </span>
          <div className="rounded-full border border-border/50 bg-secondary/40 px-3.5 py-1.5 font-mono text-[10px]">
            <span className="text-accent">{selectionCount}</span>
            <span className="text-muted-foreground"> armed</span>
          </div>
        </div>
      </header>

      <div className="relative z-10 flex flex-1 overflow-hidden">
        <aside
          className={cn(
            "sidebar-surface fixed inset-y-0 left-0 z-50 flex w-[292px] flex-col border-r border-sidebar-border transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:relative lg:translate-x-0",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="border-b border-sidebar-border px-5 py-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Production Deck
            </p>
            <p className="mt-1.5 text-sm text-foreground/85">Creative instruments</p>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-1.5 px-3 py-4">
              {sections.map((section) => {
                const isOpen = openSections[section.id]
                const hasSelection = (selections[section.id]?.length ?? 0) > 0

                return (
                  <Collapsible
                    key={section.id}
                    open={isOpen}
                    onOpenChange={(open) =>
                      setOpenSections((prev) => ({ ...prev, [section.id]: open }))
                    }
                  >
                    <div
                      className={cn(
                        "flex items-center gap-0.5 rounded-xl border transition-all duration-300",
                        isOpen
                          ? "border-accent/20 bg-sidebar-accent/70 shadow-[inset_0_0_24px_oklch(0.74_0.1_65/0.04)]"
                          : "border-transparent hover:border-border/40 hover:bg-sidebar-accent/50"
                      )}
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3 px-3.5 py-3">
                        <span
                          className={cn(
                            "transition-colors duration-300",
                            hasSelection ? "text-accent" : "text-muted-foreground"
                          )}
                        >
                          {section.icon}
                        </span>
                        <span className="truncate text-xs font-medium">{section.title}</span>
                        {hasSelection && (
                          <span className="ml-auto shrink-0 rounded-md bg-accent/15 px-1.5 py-0.5 font-mono text-[9px] text-accent">
                            {selections[section.id]?.length}
                          </span>
                        )}
                      </div>
                      <CollapsibleTrigger asChild>
                        <button
                          type="button"
                          aria-label={`${isOpen ? "Collapse" : "Expand"} ${section.title}`}
                          className={cn(
                            "mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-all duration-300",
                            "hover:bg-accent/12 hover:text-accent hover:shadow-[0_0_20px_var(--cinema-glow)]",
                            isOpen && "bg-accent/12 text-accent ring-1 ring-accent/25"
                          )}
                        >
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform duration-300",
                              isOpen && "rotate-180"
                            )}
                          />
                        </button>
                      </CollapsibleTrigger>
                    </div>

                    <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapse-up data-[state=open]:animate-collapse-down">
                      {section.useThumbnails ? (
                        <div className="grid grid-cols-4 gap-2 px-3 pb-3 pt-1">
                          {section.options.map((option) => {
                            const isSelected = selections[section.id]?.includes(option.id)
                            return (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => toggleSelection(section.id, option.id)}
                                className={cn(
                                  "group flex flex-col items-center gap-1 rounded-lg p-1.5 transition-all duration-300",
                                  isSelected
                                    ? "bg-accent/12 ring-1 ring-accent/35 shadow-[0_0_18px_var(--cinema-glow)]"
                                    : "hover:bg-secondary/50"
                                )}
                              >
                                <div
                                  className={cn(
                                    "h-9 w-full rounded-md bg-gradient-to-br transition-transform duration-300 group-hover:scale-[1.03]",
                                    option.color
                                  )}
                                />
                                <span className="w-full truncate text-center text-[9px] text-muted-foreground">
                                  {option.label}
                                </span>
                              </button>
                            )
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-2 px-3 pb-3 pt-1">
                          {section.options.map((option) => {
                            const isSelected = selections[section.id]?.includes(option.id)
                            return (
                              <button
                                key={option.id}
                                type="button"
                                onClick={() => toggleSelection(section.id, option.id)}
                                className={cn(
                                  "rounded-lg px-3 py-1.5 text-[10px] font-medium transition-all duration-300",
                                  isSelected
                                    ? "bg-accent/85 text-accent-foreground shadow-[0_0_16px_var(--cinema-glow)] ring-1 ring-accent/40"
                                    : "bg-secondary/45 text-secondary-foreground hover:bg-secondary/70 hover:ring-1 hover:ring-accent/15"
                                )}
                              >
                                {option.label}
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </CollapsibleContent>
                  </Collapsible>
                )
              })}
            </div>
          </ScrollArea>

          <div className="space-y-2 border-t border-sidebar-border p-4">
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={cn(
                "h-12 w-full gap-2 rounded-xl text-sm font-semibold tracking-wide transition-all duration-500",
                "bg-accent/90 text-accent-foreground shadow-[0_4px_28px_var(--cinema-glow)]",
                "hover:bg-accent hover:shadow-[0_6px_36px_var(--cinema-glow)]",
                isGenerating && "animate-pulse"
              )}
            >
              {isGenerating ? (
                <>
                  <Circle className="h-2 w-2 fill-red-500 text-red-500 rec-generating" />
                  <span className="text-render-pulse">Rendering take…</span>
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4" />
                  Generate Prompt
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              onClick={newSession}
              className="h-10 w-full gap-2 rounded-xl border border-border/50 text-xs text-muted-foreground transition-all duration-300 hover:border-border hover:bg-secondary/50 hover:text-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              New Session
            </Button>
          </div>
        </aside>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-background/50 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="relative flex-1 overflow-auto">
          <div className="mx-auto max-w-[90rem] space-y-12 px-5 py-10 lg:px-12 lg:py-12">
            <ActiveSelectionBar chips={activeChips} onRemove={removeChip} />

            {/* HERO: Director Monitor */}
            <section className="space-y-6">
              <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.34em] text-accent/75">
                    Director Monitor
                  </p>
                  <h2 className="mt-1.5 text-2xl font-semibold tracking-tight lg:text-3xl">
                    Live program output
                  </h2>
                </div>
                <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
                  Your creative cockpit — direction, export prompt, and sequencing in one cinematic feed.
                </p>
              </div>

              <div
                className={cn(
                  "monitor-float monitor-bezel relative mx-auto max-w-5xl overflow-hidden rounded-2xl p-[4px] lg:rounded-[28px] lg:p-1.5",
                  isGenerating && "monitor-generating"
                )}
              >
                <div className="monitor-reflection relative overflow-hidden rounded-[18px] lg:rounded-[24px]">
                  <div className="shimmer-sweep" />

                  <div className="monitor-hero-inner rounded-[16px] lg:rounded-[22px]">
                    {/* Monitor toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 px-5 py-3.5 lg:px-6">
                      <div className="flex flex-wrap items-center gap-3">
                        <div
                          className={cn(
                            "flex items-center gap-2 rounded-lg px-2.5 py-1 ring-1 ring-red-900/25",
                            isGenerating ? "bg-red-950/50" : "bg-red-950/35"
                          )}
                        >
                          <Circle
                            className={cn(
                              "h-2 w-2 fill-red-500 text-red-500",
                              isGenerating ? "rec-generating" : "animate-rec-blink"
                            )}
                          />
                          <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-red-400/85">
                            {isGenerating ? "Rendering" : "Rec"}
                          </span>
                        </div>
                        <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
                          Program Feed
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 lg:gap-4">
                        <WaveformBars active={isGenerating} />
                        <AnimatedTimecode active={isGenerating} />
                        <Play className="hidden h-4 w-4 text-accent/60 sm:block" />
                      </div>
                    </div>

                    {/* Actions row */}
                    <div className="flex flex-wrap items-center gap-2 border-b border-border/30 px-5 py-3 lg:px-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyAll}
                        className="h-8 gap-1.5 border border-border/50 text-[11px] hover:border-accent/30 hover:text-accent"
                      >
                        {copiedField === "all" ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        Copy All
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={surpriseMe}
                        className="h-8 gap-1.5 border border-border/50 text-[11px] hover:border-accent/30 hover:text-accent"
                      >
                        <Shuffle className="h-3.5 w-3.5" />
                        Surprise Me
                      </Button>
                      <div className="ml-auto flex items-center gap-2">
                        <Send className="h-3.5 w-3.5 text-muted-foreground" />
                        <Select
                          value={exportTarget}
                          onValueChange={(v) => setExportTarget(v as ExportTarget)}
                        >
                          <SelectTrigger
                            size="sm"
                            className="h-8 w-[130px] border-border/50 bg-secondary/30 font-mono text-[11px]"
                          >
                            <SelectValue placeholder="Export to" />
                          </SelectTrigger>
                          <SelectContent>
                            {EXPORT_TARGETS.map((target) => (
                              <SelectItem key={target} value={target} className="font-mono text-xs">
                                {target}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Output hierarchy */}
                    <div className="relative monitor-scanlines cinema-vignette space-y-6 p-5 lg:space-y-8 lg:p-8">
                      {/* 1. Creative Direction */}
                      <div className="glass-panel rounded-2xl p-5 lg:p-6">
                        <div className="mb-4 flex items-center gap-2">
                          <div className="h-1 w-1 rounded-full bg-accent/80 shadow-[0_0_8px_var(--cinema-glow)]" />
                          <h3 className="font-mono text-[10px] uppercase tracking-[0.26em] text-accent/85">
                            Creative Direction
                          </h3>
                        </div>
                        <p
                          className={cn(
                            "text-[15px] leading-[1.75] text-foreground/88 lg:text-base",
                            isGenerating && "text-render-pulse"
                          )}
                        >
                          {creativeDirection}
                        </p>
                      </div>

                      {/* 2. Final Prompt — HERO */}
                      <div className="prompt-hero relative overflow-hidden rounded-2xl p-6 lg:p-8">
                        <div className="pointer-events-none absolute inset-0 cinema-grain opacity-15" />
                        <div className="relative">
                          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent/70">
                                Primary Output
                              </p>
                              <h3 className="mt-1 text-lg font-semibold tracking-tight text-foreground">
                                Final Prompt
                              </h3>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(finalPrompt, "final")}
                              className="h-9 gap-2 border border-accent/20 bg-accent/5 text-[11px] hover:bg-accent/15 hover:text-accent"
                            >
                              {copiedField === "final" ? (
                                <Check className="h-3.5 w-3.5" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                              {copiedField === "final" ? "Copied" : "Copy Prompt"}
                            </Button>
                          </div>
                          <div
                            className={cn(
                              "rounded-xl border border-border/30 bg-background/30 p-5 font-mono text-[14px] leading-[1.8] text-foreground/92 lg:text-[15px]",
                              isGenerating && "text-render-pulse"
                            )}
                          >
                            {finalPrompt}
                          </div>
                        </div>
                      </div>

                      {/* 3. Negative Prompt */}
                      <div className="glass-panel rounded-2xl p-5 lg:p-6">
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1 w-1 rounded-full bg-red-500/50" />
                            <h3 className="font-mono text-[10px] uppercase tracking-[0.26em] text-red-400/70">
                              Negative Prompt
                            </h3>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(negativePrompt, "negative")}
                            className="h-8 gap-1.5 border border-border/50 text-[11px] text-muted-foreground hover:border-red-900/30"
                          >
                            {copiedField === "negative" ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                            {copiedField === "negative" ? "Copied" : "Copy"}
                          </Button>
                        </div>
                        <div className="rounded-xl border border-red-900/15 bg-red-950/15 p-4 font-mono text-[13px] leading-[1.7] text-red-200/55">
                          {negativePrompt}
                        </div>
                      </div>

                      {/* 4. Shot List — secondary */}
                      <details className="panel-muted group rounded-2xl open:ring-1 open:ring-border/40">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 [&::-webkit-details-marker]:hidden">
                          <div className="flex items-center gap-2">
                            <div className="h-1 w-1 rounded-full bg-muted-foreground/50" />
                            <h3 className="font-mono text-[10px] uppercase tracking-[0.26em] text-muted-foreground">
                              Shot Sequence
                            </h3>
                            <span className="rounded-md bg-secondary/50 px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                              optional
                            </span>
                          </div>
                          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
                        </summary>
                        <div className="border-t border-border/30 px-5 pb-5 pt-2">
                          <div className="relative space-y-0">
                            <div className="absolute bottom-2 left-[3.35rem] top-2 w-px bg-border/40" />
                            {shotList.map((shot, index) => (
                              <div
                                key={index}
                                className="relative flex items-start gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-secondary/25"
                              >
                                <span className="w-[3.35rem] shrink-0 font-mono text-[10px] tabular-nums text-muted-foreground/80">
                                  {shot.timecode}
                                </span>
                                <div className="relative z-10 mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/40" />
                                <div className="min-w-0 flex-1 pt-0.5">
                                  <span className="text-[10px] font-medium uppercase tracking-wide text-foreground/75">
                                    {shot.shot}
                                  </span>
                                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground/90">
                                    {shot.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </details>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/40 px-5 py-3.5 lg:px-6">
                      <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                        {selections["aspect-ratio"]?.[0] || "16:9"} · {selections["duration"]?.[0] || "30s"} · ProRes
                        422 · LOG-C
                      </span>
                      <span className="font-mono text-[9px] text-accent/55">
                        OUT → {exportTarget.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Look Library */}
            <section className="space-y-6">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                  Look Library
                </p>
                <h2 className="mt-1.5 text-lg font-semibold tracking-tight">Cinematic starting points</h2>
              </div>

              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5">
                {presets.map((preset) => {
                  const Icon = preset.icon
                  const isActive = activePreset === preset.id
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => applyPreset(preset.id)}
                      className={cn(
                        "group relative overflow-hidden rounded-xl border bg-card/50 text-left transition-all duration-500",
                        "hover:-translate-y-1 hover:shadow-[0_16px_40px_oklch(0_0_0/0.25)]",
                        isActive
                          ? "border-accent/35 shadow-[0_12px_36px_var(--cinema-glow)] ring-1 ring-accent/25"
                          : "border-border/45"
                      )}
                    >
                      <div className="relative aspect-[2.39/1] w-full overflow-hidden">
                        <div className={cn("absolute inset-0 bg-gradient-to-br", preset.preview)} />
                        <div className="absolute inset-x-0 top-0 h-[14%] bg-black/45" />
                        <div className="absolute inset-x-0 bottom-0 h-[14%] bg-black/45" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className={cn(
                              "flex h-11 w-11 items-center justify-center rounded-full transition-all duration-500 group-hover:scale-105",
                              preset.accentColor
                            )}
                          >
                            <Icon className="h-4 w-4 text-foreground/85" />
                          </div>
                        </div>
                        {isActive && (
                          <span className="absolute right-2.5 top-2.5 rounded-md bg-accent/85 px-2 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-wider text-accent-foreground">
                            Live
                          </span>
                        )}
                      </div>
                      <div className="border-t border-border/35 p-4">
                        <h3 className="text-sm font-medium">{preset.title}</h3>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground line-clamp-2">
                          {preset.description}
                        </p>
                      </div>
                      <div className="pointer-events-none absolute inset-0 cinema-grain opacity-15" />
                    </button>
                  )
                })}
              </div>
            </section>

            {copiedField && (
              <div className="fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-full glass-panel px-5 py-2.5 shadow-2xl">
                <Check className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Copied to clipboard</span>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

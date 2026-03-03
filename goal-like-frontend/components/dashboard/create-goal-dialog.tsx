"use client"

import { useState, useEffect, useCallback } from "react"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import type { ContactType, TargetType, Target, ChannelVideo } from "@/lib/api/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Loader2, Trash2, Youtube, ThumbsUp, ExternalLink } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

interface CreateGoalDialogProps {
  onCreated: () => void
}

const channelOptions: { value: ContactType; label: string }[] = [
  { value: "EMAIL", label: "E-mail" },
  { value: "SMS", label: "SMS" },
  { value: "DISCORD", label: "Discord" },
  { value: "PUSH", label: "Push" },
  { value: "MOCK", label: "Mock" },
]

const targetTypeOptions: { value: TargetType; label: string }[] = [
  { value: "NUMBER_OF_LIKES", label: "Quantidade de Likes" },
  { value: "GOAL_DESIRE", label: "Objetivo Desejado" },
  { value: "DEADLINE", label: "Prazo (data)" },
  { value: "DURATION", label: "Duracao" },
  { value: "PERCENTAGE", label: "Porcentagem" },
]

export function CreateGoalDialog({ onCreated }: CreateGoalDialogProps) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  // Channel videos state
  const [channelVideos, setChannelVideos] = useState<ChannelVideo[]>([])
  const [loadingVideos, setLoadingVideos] = useState(false)
  const [hasChannel, setHasChannel] = useState(false)
  const [videoSource, setVideoSource] = useState<"link" | "channel">("link")

  // Form state
  const [videoId, setVideoId] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [channel, setChannel] = useState<ContactType>("EMAIL")
  const [targets, setTargets] = useState<Target[]>([
    { amount: "", type: "NUMBER_OF_LIKES" },
  ])

  const fetchChannelVideos = useCallback(async () => {
    setLoadingVideos(true)
    try {
      // Check if user has contacts that could indicate a channel
      // For now use a localStorage-based default channel
      const stored =
        typeof window !== "undefined"
          ? localStorage.getItem("meta-de-like-default-channel")
          : null
      if (stored) {
        setHasChannel(true)
        const videosRes = await api.getChannelVideos(stored)
        if (videosRes.success) {
          setChannelVideos(videosRes.data)
        }
      } else {
        setHasChannel(false)
      }
    } finally {
      setLoadingVideos(false)
    }
  }, [])

  useEffect(() => {
    if (open) fetchChannelVideos()
  }, [open, fetchChannelVideos])

  function selectVideo(video: ChannelVideo) {
    // Extract video ID from URL
    const urlObj = new URL(video.url)
    const id = urlObj.searchParams.get("v") || video.id
    setVideoId(id)
    setName(name || video.title)
    setVideoSource("link")
  }

  function addTarget() {
    setTargets([...targets, { amount: "", type: "NUMBER_OF_LIKES" }])
  }

  function removeTarget(index: number) {
    setTargets(targets.filter((_, i) => i !== index))
  }

  function updateTarget(index: number, field: keyof Target, value: string) {
    const updated = [...targets]
    if (field === "type") {
      updated[index] = { ...updated[index], type: value as TargetType }
    } else {
      updated[index] = { ...updated[index], amount: value }
    }
    setTargets(updated)
  }

  function resetForm() {
    setVideoId("")
    setName("")
    setDescription("")
    setChannel("EMAIL")
    setTargets([{ amount: "", type: "NUMBER_OF_LIKES" }])
    setVideoSource("link")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setLoading(true)

    const validTargets = targets.filter((t) => t.amount.trim() !== "")

    const res = await api.createGoal({
      name,
      description,
      videoId,
      channel,
      contentCreatorId: user.creatorId,
      targets: validTargets,
    })

    if (res.success) {
      toast.success("Meta criada com sucesso!")
      resetForm()
      setOpen(false)
      onCreated()
    } else {
      toast.error(res.message || "Erro ao criar meta.")
    }

    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Meta
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-[family-name:var(--font-heading)]">
            Criar Nova Meta
          </DialogTitle>
          <DialogDescription>
            Adicione uma meta de likes para um video do YouTube.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          {/* Video Source Tabs */}
          {hasChannel && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-1">
                <button
                  type="button"
                  onClick={() => setVideoSource("link")}
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    videoSource === "link"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Colar Link / ID
                </button>
                <button
                  type="button"
                  onClick={() => setVideoSource("channel")}
                  className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                    videoSource === "channel"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="flex items-center justify-center gap-1.5">
                    <Youtube className="h-3.5 w-3.5" />
                    Meu Canal
                  </span>
                </button>
              </div>

              {videoSource === "channel" && (
                <div className="flex flex-col gap-2">
                  {loadingVideos ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <span className="ml-2 text-sm text-muted-foreground">
                        Carregando videos...
                      </span>
                    </div>
                  ) : channelVideos.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                      Nenhum video encontrado no canal.
                    </p>
                  ) : (
                    <div className="flex max-h-52 flex-col gap-1.5 overflow-y-auto rounded-lg border border-border p-2">
                      {channelVideos.map((video) => {
                        const vId =
                          new URL(video.url).searchParams.get("v") || video.id
                        const isSelected = videoId === vId
                        return (
                          <button
                            key={video.id}
                            type="button"
                            onClick={() => selectVideo(video)}
                            className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-all ${
                              isSelected
                                ? "border-primary bg-primary/5"
                                : "border-transparent hover:border-border hover:bg-muted/50"
                            }`}
                          >
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                              <Youtube className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                              <p className="truncate text-sm font-medium text-foreground">
                                {video.title}
                              </p>
                              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <ThumbsUp className="h-3 w-3" />
                                  {video.likeCount.toLocaleString("pt-BR")}
                                </span>
                                <span>
                                  {formatDistanceToNow(new Date(video.publishedAt), {
                                    addSuffix: true,
                                    locale: ptBR,
                                  })}
                                </span>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary">
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="3"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-primary-foreground"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                  {videoId && videoSource === "channel" && (
                    <p className="flex items-center gap-1.5 text-xs text-primary">
                      <ExternalLink className="h-3 w-3" />
                      Video selecionado - preencha os campos abaixo
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Video ID */}
          {videoSource === "link" && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="videoId">ID do Video (ou URL)</Label>
              <Input
                id="videoId"
                type="text"
                placeholder="dQw4w9WgXcQ ou https://youtube.com/watch?v=..."
                value={videoId}
                onChange={(e) => {
                  const val = e.target.value
                  // Auto-extract ID from URL
                  try {
                    const url = new URL(val)
                    const v = url.searchParams.get("v")
                    if (v) {
                      setVideoId(v)
                      return
                    }
                  } catch {
                    // not a URL, use as raw ID
                  }
                  setVideoId(val)
                }}
                required
              />
              <p className="text-xs text-muted-foreground">
                Cole a URL do video ou apenas o ID. O ID sera extraido automaticamente.
              </p>
            </div>
          )}

          {videoSource === "channel" && (
            <input type="hidden" value={videoId} required />
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="goalName">Nome da Meta</Label>
            <Input
              id="goalName"
              placeholder="Ex: 10K Likes no Tutorial"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="description">Descricao</Label>
            <Textarea
              id="description"
              placeholder="Descreva o objetivo dessa meta..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={2}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Canal de Notificacao</Label>
            <Select
              value={channel}
              onValueChange={(v) => setChannel(v as ContactType)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {channelOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Targets */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <Label>Metas (Targets)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addTarget}
                className="gap-1 text-xs"
              >
                <Plus className="h-3 w-3" />
                Adicionar
              </Button>
            </div>

            {targets.map((target, i) => (
              <div
                key={i}
                className="flex items-end gap-2 rounded-lg border border-border bg-muted/50 p-3"
              >
                <div className="flex flex-1 flex-col gap-2">
                  <Select
                    value={target.type}
                    onValueChange={(v) => updateTarget(i, "type", v)}
                  >
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {targetTypeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="text"
                    placeholder={
                      target.type === "NUMBER_OF_LIKES"
                        ? "10000"
                        : target.type === "DEADLINE"
                          ? "2026-12-31T23:59"
                          : target.type === "PERCENTAGE"
                            ? "75"
                            : "Valor"
                    }
                    value={target.amount}
                    onChange={(e) => updateTarget(i, "amount", e.target.value)}
                    className="h-9 text-xs"
                  />
                </div>
                {targets.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTarget(i)}
                    className="h-9 w-9 shrink-0 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button
            type="submit"
            className="mt-2 w-full"
            disabled={loading || (videoSource === "channel" && !videoId)}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando...
              </>
            ) : (
              "Criar Meta"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

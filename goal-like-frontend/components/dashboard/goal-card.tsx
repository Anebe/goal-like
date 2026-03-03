"use client"

import { useState } from "react"
import type { Goal, ContactType, GoalStatus, TargetType } from "@/lib/api/types"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  ThumbsUp,
  Trash2,
  ExternalLink,
  Mail,
  Smartphone,
  MessageCircle,
  Bell,
  Zap,
} from "lucide-react"
import { toast } from "sonner"

interface GoalCardProps {
  goal: Goal
  onDeleted: () => void
}

const statusLabels: Record<GoalStatus, string> = {
  ACTIVE: "Ativa",
  COMPLETED: "Concluida",
  EXPIRED: "Expirada",
  CANCELLED: "Cancelada",
}

const statusColors: Record<GoalStatus, string> = {
  ACTIVE: "bg-primary/10 text-primary border-primary/20",
  COMPLETED: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  EXPIRED: "bg-muted text-muted-foreground border-border",
  CANCELLED: "bg-muted text-muted-foreground border-border",
}

const channelIcons: Record<ContactType, React.ReactNode> = {
  EMAIL: <Mail className="h-3 w-3" />,
  SMS: <Smartphone className="h-3 w-3" />,
  DISCORD: <MessageCircle className="h-3 w-3" />,
  PUSH: <Bell className="h-3 w-3" />,
  MOCK: <Zap className="h-3 w-3" />,
}

const channelLabels: Record<ContactType, string> = {
  EMAIL: "E-mail",
  SMS: "SMS",
  DISCORD: "Discord",
  PUSH: "Push",
  MOCK: "Mock",
}

const targetLabels: Record<TargetType, string> = {
  GOAL_DESIRE: "Objetivo",
  DEADLINE: "Prazo",
  DURATION: "Duracao",
  PERCENTAGE: "Porcentagem",
  NUMBER_OF_LIKES: "Likes",
}

export function GoalCard({ goal, onDeleted }: GoalCardProps) {
  const [deleting, setDeleting] = useState(false)
  const status = goal.status || "ACTIVE"

  const videoUrl = goal.videoId
    ? `https://youtube.com/watch?v=${goal.videoId}`
    : "#"

  async function handleDelete() {
    if (!goal.id) return
    setDeleting(true)
    const res = await api.deleteGoal(goal.id)
    if (res.success) {
      toast.success("Meta removida com sucesso!")
      onDeleted()
    } else {
      toast.error(res.message || "Erro ao remover meta.")
    }
    setDeleting(false)
  }

  return (
    <div className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/20 hover:shadow-sm">
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-card-foreground">
              {goal.name}
            </h3>
            <Badge
              variant="outline"
              className={`text-xs ${statusColors[status] || ""}`}
            >
              {statusLabels[status] || status}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {goal.description}
          </p>
        </div>

        <div className="flex items-center gap-1">
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-label="Abrir video"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                aria-label="Excluir meta"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir meta</AlertDialogTitle>
                <AlertDialogDescription>
                  {"Tem certeza que deseja excluir a meta "}
                  <strong>{goal.name}</strong>
                  {"? Esta acao nao pode ser desfeita."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                  {deleting ? "Excluindo..." : "Excluir"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Targets */}
      {goal.targets.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {goal.targets.map((target, i) => (
            <div
              key={target.id || i}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/50 px-2.5 py-1.5"
            >
              {target.type === "NUMBER_OF_LIKES" && (
                <ThumbsUp className="h-3 w-3 text-primary" />
              )}
              <span className="text-xs font-medium text-foreground">{target.amount}</span>
              <span className="text-xs text-muted-foreground">
                {targetLabels[target.type] || target.type}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Meta info pills */}
      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
          {channelIcons[goal.channel]}
          {channelLabels[goal.channel]}
        </span>
        {goal.videoId && (
          <span className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
            <span className="font-mono text-xs">{goal.videoId}</span>
          </span>
        )}
      </div>
    </div>
  )
}

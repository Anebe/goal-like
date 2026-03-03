"use client"

import { useEffect, useState, useCallback } from "react"
import { api } from "@/lib/api"
import type { Goal } from "@/lib/api/types"
import { useAuth } from "@/lib/auth-context"
import { GoalCard } from "@/components/dashboard/goal-card"
import { EmptyGoals } from "@/components/dashboard/empty-goals"
import { CreateGoalDialog } from "@/components/dashboard/create-goal-dialog"
import { Loader2, ThumbsUp, Target, CheckCircle2 } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  const fetchGoals = useCallback(async () => {
    if (!user) return
    const res = await api.listGoals(user.creatorId)
    console.log(res)
    if (res.success) {
      setGoals(res.data._embedded["goals"] ?? [])
    }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  const activeGoals = goals.filter((g) => g.status === "ACTIVE")
  const completedGoals = goals.filter((g) => g.status === "COMPLETED")

  // Sum NUMBER_OF_LIKES targets to show total as a stat
  const totalLikesTarget = goals.reduce((acc, g) => {
    const likesTarget = g.targets.find((t) => t.type === "GOAL_DESIRE")
    return acc + (likesTarget ? Number(likesTarget.amount) : 0)
  }, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-foreground md:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Acompanhe suas metas de likes em tempo real.
          </p>
        </div>
        {goals.length > 0 && <CreateGoalDialog onCreated={fetchGoals} />}
      </div>

      {/* Stats */}
      {goals.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Metas Ativas</p>
                <p className="font-[family-name:var(--font-heading)] text-2xl font-bold text-foreground">
                  {activeGoals.length}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4/10">
                <CheckCircle2 className="h-5 w-5 text-chart-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Concluidas</p>
                <p className="font-[family-name:var(--font-heading)] text-2xl font-bold text-foreground">
                  {completedGoals.length}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ThumbsUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Meta Total de Likes</p>
                <p className="font-[family-name:var(--font-heading)] text-2xl font-bold text-foreground">
                  {totalLikesTarget.toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Goals list or empty state */}
      {goals.length === 0 ? (
        <EmptyGoals onCreated={fetchGoals} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} onDeleted={fetchGoals} />
          ))}
        </div>
      )}
    </div>
  )
}

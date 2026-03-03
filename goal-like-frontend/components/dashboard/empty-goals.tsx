import { ThumbsUp, Plus } from "lucide-react"
import { CreateGoalDialog } from "./create-goal-dialog"

interface EmptyGoalsProps {
  onCreated: () => void
}

export function EmptyGoals({ onCreated }: EmptyGoalsProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-card px-6 py-20 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
        <ThumbsUp className="h-8 w-8 text-primary" />
      </div>
      <h2 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-foreground">
        Nenhuma meta ainda
      </h2>
      <p className="mt-2 max-w-sm text-muted-foreground">
        Crie sua primeira meta de likes para comecar a monitorar seus videos do
        YouTube.
      </p>
      <div className="mt-6">
        <CreateGoalDialog onCreated={onCreated} />
      </div>
    </div>
  )
}

import Link from "next/link"
import { ThumbsUp } from "lucide-react"

export function LandingFooter() {
  return (
    <footer className="border-t border-border bg-background py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
            <ThumbsUp className="h-3 w-3 text-primary-foreground" />
          </div>
          <span className="font-[family-name:var(--font-heading)] text-sm font-semibold text-foreground">
            Meta De Like
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {"2026 Meta De Like. Todos os direitos reservados."}
        </p>
      </div>
    </footer>
  )
}

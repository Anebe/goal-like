import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CtaSection() {
  return (
    <section className="border-t border-border bg-card py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Pronto para acompanhar suas metas?
        </h2>
        <p className="mt-4 text-lg text-muted-foreground text-pretty">
          Junte-se a criadores que ja usam o Meta De Like para monitorar seus
          videos e alcançar seus objetivos de engajamento.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button size="lg" asChild className="gap-2">
            <Link href="/signup">
              Criar conta gratuita
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

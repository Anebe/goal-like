import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Bell, ThumbsUp, TrendingUp } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pb-20 pt-20 md:pb-32 md:pt-28">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-16 lg:flex-row lg:items-start lg:gap-20">
          {/* Left: Text */}
          <div className="flex max-w-xl flex-1 flex-col items-center text-center lg:items-start lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
              <Bell className="h-3.5 w-3.5 text-primary" />
              <span>Notificacoes inteligentes para criadores</span>
            </div>

            <h1 className="font-[family-name:var(--font-heading)] text-4xl font-bold leading-tight tracking-tight text-foreground text-balance md:text-5xl lg:text-6xl">
              Alcance suas metas de likes com
              <span className="text-primary"> precisao</span>
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-pretty">
              Defina metas de likes para seus videos do YouTube e receba alertas
              por e-mail ou SMS quando estiver perto de alcancar seus objetivos.
              Nunca mais perca um marco importante.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild className="gap-2">
                <Link href="/signup">
                  Comecar agora
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#how-it-works">Saiba mais</Link>
              </Button>
            </div>

            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <ThumbsUp className="h-4 w-4 text-primary" />
                Gratuito para comecar
              </span>
              <span className="flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-primary" />
                Tempo real
              </span>
            </div>
          </div>

          {/* Right: Visual mockup */}
          <div className="relative flex-1">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-lg">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-primary/30" />
                <div className="h-3 w-3 rounded-full bg-muted" />
                <div className="h-3 w-3 rounded-full bg-muted" />
              </div>

              {/* Mock goal card */}
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Meta ativa</p>
                      <p className="font-[family-name:var(--font-heading)] font-semibold text-foreground">
                        10K Likes - Tutorial React
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <ThumbsUp className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>7.200 / 10.000</span>
                      <span>72%</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[72%] rounded-full bg-primary transition-all" />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-border bg-background p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Meta ativa</p>
                      <p className="font-[family-name:var(--font-heading)] font-semibold text-foreground">
                        5K Likes - Vlog Semanal
                      </p>
                    </div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <ThumbsUp className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>4.800 / 5.000</span>
                      <span>96%</span>
                    </div>
                    <div className="mt-1.5 h-2 w-full rounded-full bg-muted">
                      <div className="h-2 w-[96%] rounded-full bg-primary transition-all" />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-primary" />
                    <p className="text-sm text-foreground">
                      <span className="font-medium">Lembrete:</span>{" "}
                      {"Vlog Semanal esta a 96% da meta!"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

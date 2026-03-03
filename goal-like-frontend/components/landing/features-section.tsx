import { Bell, Clock, Mail, Percent, Smartphone, Target } from "lucide-react"

const features = [
  {
    icon: Target,
    title: "Metas Personalizadas",
    description:
      "Defina metas de likes unicas para cada video com nome, mensagem e quantidade exata.",
  },
  {
    icon: Bell,
    title: "Notificacoes em Tempo Real",
    description:
      "Receba alertas instantaneos quando suas metas forem alcancadas ou estiverem proximas.",
  },
  {
    icon: Mail,
    title: "E-mail e SMS",
    description:
      "Escolha como quer ser notificado: por e-mail, SMS ou ambos. Voce decide.",
  },
  {
    icon: Percent,
    title: "Lembretes por Porcentagem",
    description:
      "Configure alertas quando atingir 50%, 75% ou qualquer porcentagem da sua meta.",
  },
  {
    icon: Clock,
    title: "Lembretes por Tempo",
    description:
      "Receba avisos quando faltar X dias ou horas para o prazo da sua meta.",
  },
  {
    icon: Smartphone,
    title: "Painel Intuitivo",
    description:
      "Acompanhe todas as suas metas em um dashboard limpo e organizado.",
  },
]

export function FeaturesSection() {
  return (
    <section id="features" className="border-t border-border bg-card py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Tudo o que voce precisa para monitorar suas metas
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Ferramentas poderosas e simples para criadores que levam seus
            objetivos a serio.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-background p-6 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

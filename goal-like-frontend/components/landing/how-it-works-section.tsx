export function HowItWorksSection() {
  const steps = [
    {
      number: "01",
      title: "Crie sua conta",
      description: "Cadastre-se gratuitamente em menos de um minuto.",
    },
    {
      number: "02",
      title: "Adicione uma meta",
      description:
        "Cole o link do video, defina a quantidade de likes e configure seus lembretes.",
    },
    {
      number: "03",
      title: "Receba notificacoes",
      description:
        "Relaxe e deixe o Meta De Like monitorar seus videos. Voce sera notificado automaticamente.",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-[family-name:var(--font-heading)] text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Como funciona
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Tres passos simples para nunca perder uma meta de likes.
          </p>
        </div>

        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-8">
          {steps.map((step, i) => (
            <div key={step.number} className="relative flex flex-col items-center text-center md:items-start md:text-left">
              {i < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-px w-full bg-border md:block" />
              )}
              <div className="relative z-10 mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary font-[family-name:var(--font-heading)] text-lg font-bold text-primary-foreground">
                {step.number}
              </div>
              <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

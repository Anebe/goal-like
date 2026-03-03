"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ThumbsUp, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface AuthFormProps {
  mode: "login" | "signup"
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const { login, signUp } = useAuth()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    try {
      const result =
        mode === "login"
          ? await login(email, password)
          : await signUp(name, email, password)

      if (result.success) {
        toast.success(mode === "login" ? "Bem-vindo de volta!" : "Conta criada com sucesso!")
        router.push("/dashboard")
      } else {
        toast.error(result.message || "Ocorreu um erro. Tente novamente.")
      }
    } catch {
      toast.error("Erro inesperado. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const isLogin = mode === "login"

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <Link href="/" className="mb-6 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <ThumbsUp className="h-5 w-5 text-primary-foreground" />
            </div>
          </Link>
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-foreground">
            {isLogin ? "Entrar na sua conta" : "Criar sua conta"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isLogin ? (
              <>
                {"Nao tem conta? "}
                <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
                  Cadastre-se
                </Link>
              </>
            ) : (
              <>
                {"Ja tem conta? "}
                <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                  Entrar
                </Link>
              </>
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                type="text"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="mt-2 w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isLogin ? "Entrando..." : "Criando conta..."}
              </>
            ) : isLogin ? (
              "Entrar"
            ) : (
              "Criar conta"
            )}
          </Button>
        </form>

        {isLogin && (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            {"Teste com: lucas@example.com / 123456"}
          </p>
        )}
      </div>
    </div>
  )
}

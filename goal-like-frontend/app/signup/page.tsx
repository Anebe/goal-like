import { AuthForm } from "@/components/auth/auth-form"

export const metadata = {
  title: "Criar Conta - Meta De Like",
  description: "Crie sua conta no Meta De Like e comece a monitorar suas metas de likes.",
}

export default function SignUpPage() {
  return <AuthForm mode="signup" />
}

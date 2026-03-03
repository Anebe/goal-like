import { AuthForm } from "@/components/auth/auth-form"

export const metadata = {
  title: "Entrar - Meta De Like",
  description: "Faca login na sua conta Meta De Like",
}

export default function LoginPage() {
  return <AuthForm mode="login" />
}

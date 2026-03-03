"use client"

import { useEffect, useState, useCallback } from "react"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import type { Contact, ContactType } from "@/lib/api/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Loader2, Save, Youtube, Plus, Trash2, Mail, Smartphone, MessageCircle, Bell, Zap } from "lucide-react"
import { toast } from "sonner"
import { id } from "date-fns/locale"

const contactTypeOptions: { value: ContactType; label: string; icon: React.ReactNode }[] = [
  { value: "EMAIL", label: "E-mail", icon: <Mail className="h-4 w-4" /> },
  { value: "SMS", label: "SMS", icon: <Smartphone className="h-4 w-4" /> },
  { value: "DISCORD", label: "Discord", icon: <MessageCircle className="h-4 w-4" /> },
  { value: "PUSH", label: "Push", icon: <Bell className="h-4 w-4" /> },
  { value: "MOCK", label: "Mock", icon: <Zap className="h-4 w-4" /> },
]

export default function ConfigPage() {
  const { user, refreshUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [savingContacts, setSavingContacts] = useState(false)
  const [savingChannel, setSavingChannel] = useState(false)

  // Contacts
  const [contacts, setContacts] = useState<(Contact & { _isNew?: boolean })[]>([])
  const [deletedContactIds, setDeletedContactIds] = useState<string[]>([])

  // Default channel (stored locally for the channel picker feature)
  const [defaultChannel, setDefaultChannel] = useState("")

  const fetchContacts = useCallback(async () => {
    if (!user?.creatorId) return
    
    const res = await api.listContacts(user.creatorId)
    if (res.success) {
      setContacts(res.data._embedded["contacts"] ?? [])
    }
  }, [])

  useEffect(() => {
    Promise.all([fetchContacts()]).finally(() => setLoading(false))
    // Load default channel from localStorage
    if (typeof window !== "undefined") {
      setDefaultChannel(localStorage.getItem("meta-de-like-default-channel") || "")
    }
  }, [fetchContacts])

  function addContact() {
    setContacts([...contacts, { contact: "", type: "EMAIL", _isNew: true }])
  }

  function removeContact(index: number) {
    const c = contacts[index]
    if (c.id) {
      setDeletedContactIds([...deletedContactIds, c.id])
    }
    setContacts(contacts.filter((_, i) => i !== index))
  }

  function updateContactField(index: number, field: keyof Contact, value: string) {
    const updated = [...contacts]
    if (field === "type") {
      updated[index] = { ...updated[index], type: value as ContactType }
    } else {
      updated[index] = { ...updated[index], contact: value }
    }
    setContacts(updated)
  }

  async function handleSaveContacts(e: React.FormEvent) {
    e.preventDefault()
    setSavingContacts(true)

    try {
      // Delete removed contacts
      for (const id of deletedContactIds) {
        await api.deleteContact(id)
      }
      setDeletedContactIds([])

      // Create new and update existing
      for (const c of contacts) {
        if (c._isNew) {
          await api.createContact({ contact: c.contact, type: c.type, contentCreatorId: user?.creatorId })
        } else if (c.id) {
          await api.updateContact(c.id, { contact: c.contact, type: c.type })
        }
      }

      toast.success("Contatos salvos com sucesso!")
      await fetchContacts()
      await refreshUser()
    } catch {
      toast.error("Erro ao salvar contatos.")
    }

    setSavingContacts(false)
  }

  function handleSaveChannel() {
    setSavingChannel(true)
    if (typeof window !== "undefined") {
      if (defaultChannel.trim()) {
        localStorage.setItem("meta-de-like-default-channel", defaultChannel.trim())
      } else {
        localStorage.removeItem("meta-de-like-default-channel")
      }
    }
    toast.success("Canal padrao salvo com sucesso!")
    setSavingChannel(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-foreground md:text-3xl">
          Configuracoes
        </h1>
        <p className="mt-1 text-muted-foreground">
          Gerencie seus contatos, canal padrao e preferencias.
        </p>
      </div>

      <div className="max-w-2xl">
        {/* Profile Info (read-only from auth) */}
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground">
              Perfil
            </h2>
            <p className="text-sm text-muted-foreground">
              Informacoes do seu creator.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label>Nome</Label>
              <Input value={user?.fullName || ""} disabled />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Creator ID</Label>
              <Input value={user?.creatorId || ""} disabled className="font-mono text-xs" />
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Channel Section */}
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground">
              Canal Padrao
            </h2>
            <p className="text-sm text-muted-foreground">
              Salve seu canal do YouTube para carregar os videos recentes como atalho ao criar metas.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="defaultChannel">URL ou Handle do Canal</Label>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Youtube className="h-5 w-5 text-primary" />
              </div>
              <Input
                id="defaultChannel"
                type="text"
                placeholder="https://youtube.com/@seucanal ou @seucanal"
                value={defaultChannel}
                onChange={(e) => setDefaultChannel(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Com o canal configurado, ao criar uma nova meta voce vera os videos recentes para selecionar rapidamente.
            </p>
          </div>

          <Button
            type="button"
            onClick={handleSaveChannel}
            disabled={savingChannel}
            variant="outline"
            className="w-fit gap-2"
          >
            {savingChannel ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Salvar Canal
          </Button>
        </div>

        <Separator className="my-8" />

        {/* Contacts Section */}
        <form onSubmit={handleSaveContacts} className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-lg font-semibold text-foreground">
                Contatos
              </h2>
              <p className="text-sm text-muted-foreground">
                Configure os canais por onde voce quer receber notificacoes.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addContact}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              Adicionar
            </Button>
          </div>

          {contacts.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                Nenhum contato cadastrado. Adicione um contato para receber notificacoes.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {contacts.map((contact, i) => {
                const typeOption = contactTypeOptions.find(
                  (o) => o.value === contact.type
                )
                return (
                  <div
                    key={contact.id || `new-${i}`}
                    className="flex items-center gap-3 rounded-lg border border-border bg-card p-3"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                      {typeOption?.icon}
                    </div>
                    <div className="flex flex-1 items-center gap-3">
                      <Select
                        value={contact.type}
                        onValueChange={(v) => updateContactField(i, "type", v)}
                      >
                        <SelectTrigger className="h-9 w-32 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {contactTypeOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder={
                          contact.type === "EMAIL"
                            ? "seu@email.com"
                            : contact.type === "SMS"
                              ? "+5511999999999"
                              : contact.type === "DISCORD"
                                ? "usuario#1234"
                                : "Endereco"
                        }
                        value={contact.contact}
                        onChange={(e) => updateContactField(i, "contact", e.target.value)}
                        className="h-9 flex-1 text-sm"
                        required
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeContact(i)}
                      className="h-9 w-9 shrink-0 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )
              })}
            </div>
          )}

          <Button type="submit" disabled={savingContacts} className="w-fit gap-2">
            {savingContacts ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Salvar Contatos
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

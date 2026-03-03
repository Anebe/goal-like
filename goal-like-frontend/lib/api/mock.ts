// ============================================================
// Meta De Like - Mock API Implementation
// ============================================================

import type { IMetaDeLikeApi } from "./interface"
import type {
  AuthCredentials,
  SignUpData,
  LoginResponse,
  ContentCreator,
  CreateContentCreatorData,
  Contact,
  Goal,
  CreateGoalData,
  ApiResponse,
  ChannelVideo,
  PagedResponse,
} from "./types"

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

function uid(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).substring(2, 15)
}

// ── In-memory stores ────────────────────────────────────

interface MockUser {
  id: string
  email: string
  password: string
  fullname: string
}

let mockUsers: MockUser[] = [
  { id: "user-1", email: "lucas@example.com", password: "123456", fullname: "Lucas Silva" },
]

let mockCreators: ContentCreator[] = [
  { id: "creator-1", fullName: "Lucas Silva", authId: "user-1" },
]

let mockContacts: (Contact & { id: string; creatorId: string })[] = [
  { id: "contact-1", contact: "lucas@example.com", type: "EMAIL", creatorId: "creator-1" },
]

let mockGoals: (Goal & { id: string })[] = []

let currentUserId: string | null = null
let currentCreatorId: string | null = null

const mockChannelVideos: ChannelVideo[] = [
  {
    id: "vid-1",
    title: "React 19 - Tudo que voce precisa saber",
    url: "https://youtube.com/watch?v=abc123",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    likeCount: 3420,
  },
  {
    id: "vid-2",
    title: "Next.js 16 - Novidades e Migracoes",
    url: "https://youtube.com/watch?v=def456",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    publishedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
    likeCount: 8100,
  },
  {
    id: "vid-3",
    title: "Tailwind CSS v4 - Guia Completo",
    url: "https://youtube.com/watch?v=ghi789",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    publishedAt: new Date(Date.now() - 10 * 86400000).toISOString(),
    likeCount: 15200,
  },
  {
    id: "vid-4",
    title: "TypeScript Avancado - Generics na Pratica",
    url: "https://youtube.com/watch?v=jkl012",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    publishedAt: new Date(Date.now() - 15 * 86400000).toISOString(),
    likeCount: 6750,
  },
  {
    id: "vid-5",
    title: "Deploy com Vercel - Do Zero a Producao",
    url: "https://youtube.com/watch?v=mno345",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    publishedAt: new Date(Date.now() - 20 * 86400000).toISOString(),
    likeCount: 4300,
  },
]

// ── Helpers ─────────────────────────────────────────────

function ok<T>(data: T, message?: string): ApiResponse<T> {
  return { data, success: true, message }
}
function fail<T>(message: string): ApiResponse<T> {
  return { data: null as unknown as T, success: false, message }
}

function restoreSession() {
  if (typeof window === "undefined") return
  if (!currentUserId) {
    currentUserId = localStorage.getItem("mock-userId")
    currentCreatorId = localStorage.getItem("mock-creatorId")
  }
}

function saveSession(userId: string, creatorId: string) {
  currentUserId = userId
  currentCreatorId = creatorId
  if (typeof window !== "undefined") {
    localStorage.setItem("mock-userId", userId)
    localStorage.setItem("mock-creatorId", creatorId)
  }
}

function clearSession() {
  currentUserId = null
  currentCreatorId = null
  if (typeof window !== "undefined") {
    localStorage.removeItem("mock-userId")
    localStorage.removeItem("mock-creatorId")
  }
}

function paginate<K extends string, T>(
  key: K,
  items: T[],
  page: number,
  size: number
): PagedResponse<K, T> {
  const start = page * size
  const slice = items.slice(start, start + size)
  return {
    _embedded: { [key]: slice } as Record<K, T[]>,
    page: {
      size,
      totalElements: items.length,
      totalPages: Math.ceil(items.length / size),
      number: page,
    },
  }
}

// ── Mock Implementation ─────────────────────────────────

export class MockApi implements IMetaDeLikeApi {
  // ── Auth ──────────────────────────────────────────────

  async login(credentials: AuthCredentials): Promise<ApiResponse<LoginResponse>> {
    await delay(500)
    const user = mockUsers.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    )
    if (!user) return fail("Email ou senha incorretos.")

    const creator = mockCreators.find((c) => c.authId === user.id)
    saveSession(user.id, creator?.id || "")
    return ok({ id: user.id })
  }

  async signUp(data: SignUpData): Promise<ApiResponse<null>> {
    await delay(500)
    if (mockUsers.some((u) => u.email === data.email))
      return fail("Este email ja esta em uso.")

    const newUser: MockUser = {
      id: `user-${uid()}`,
      email: data.email,
      password: data.password,
      fullname: data.fullname,
    }
    mockUsers.push(newUser)

    // Automatically create a content creator for the new user
    const newCreator: ContentCreator = {
      id: `creator-${uid()}`,
      fullName: data.fullname,
      authId: newUser.id,
    }
    mockCreators.push(newCreator)
    saveSession(newUser.id, newCreator.id!)
    return ok(null)
  }

  async logout(): Promise<ApiResponse<null>> {
    await delay(200)
    clearSession()
    return ok(null)
  }

  // ── Content Creator ────────────────────────────────────

  async getMe(): Promise<ApiResponse<string>> {
    await delay(300)
    restoreSession()
    if (!currentCreatorId) return fail("Nao autenticado.")
    return ok(currentCreatorId)
  }

  async getCreator(id: string): Promise<ApiResponse<ContentCreator>> {
    await delay(300)
    const creator = mockCreators.find((c) => c.id === id)
    if (!creator) return fail("Creator nao encontrado.")
    const goals = mockGoals.filter((g) => g.contentCreatorId === id)
    return ok({ ...creator, goalEntities: goals })
  }

  async createCreator(data: CreateContentCreatorData): Promise<ApiResponse<null>> {
    await delay(400)
    restoreSession()
    const creator: ContentCreator = {
      id: `creator-${uid()}`,
      fullName: data.fullName,
      authId: currentUserId || "",
    }
    mockCreators.push(creator)
    for (const c of data.contacts) {
      mockContacts.push({ ...c, id: `contact-${uid()}`, creatorId: creator.id! })
    }
    currentCreatorId = creator.id!
    if (typeof window !== "undefined") localStorage.setItem("mock-creatorId", creator.id!)
    return ok(null)
  }

  async deleteCreator(id: string): Promise<ApiResponse<null>> {
    await delay(300)
    mockCreators = mockCreators.filter((c) => c.id !== id)
    mockContacts = mockContacts.filter((c) => c.creatorId !== id)
    mockGoals = mockGoals.filter((g) => g.contentCreatorId !== id)
    return ok(null)
  }

  async listCreators(
    page = 0,
    size = 20
  ): Promise<ApiResponse<PagedResponse<"content-creators", ContentCreator>>> {
    await delay(300)
    return ok(paginate("content-creators", mockCreators, page, size))
  }

  // ── Contacts ────────────────────────────────────────────

  async listContacts(
    page = 0,
    size = 20
  ): Promise<ApiResponse<PagedResponse<"contacts", Contact>>> {
    await delay(300)
    restoreSession()
    const mine = mockContacts.filter((c) => c.creatorId === currentCreatorId)
    return ok(paginate("contacts", mine, page, size))
  }

  async getContact(id: string): Promise<ApiResponse<Contact>> {
    await delay(200)
    const c = mockContacts.find((c) => c.id === id)
    if (!c) return fail("Contato nao encontrado.")
    return ok({ id: c.id, contact: c.contact, type: c.type })
  }

  async createContact(data: Contact): Promise<ApiResponse<Contact>> {
    await delay(400)
    restoreSession()
    const newC = { ...data, id: `contact-${uid()}`, creatorId: currentCreatorId || "" }
    mockContacts.push(newC)
    return ok({ id: newC.id, contact: newC.contact, type: newC.type })
  }

  async updateContact(id: string, data: Contact): Promise<ApiResponse<Contact>> {
    await delay(300)
    const idx = mockContacts.findIndex((c) => c.id === id)
    if (idx === -1) return fail("Contato nao encontrado.")
    mockContacts[idx] = { ...mockContacts[idx], ...data }
    return ok({ id, contact: mockContacts[idx].contact, type: mockContacts[idx].type })
  }

  async patchContact(id: string, data: Partial<Contact>): Promise<ApiResponse<null>> {
    await delay(300)
    const idx = mockContacts.findIndex((c) => c.id === id)
    if (idx === -1) return fail("Contato nao encontrado.")
    mockContacts[idx] = { ...mockContacts[idx], ...data }
    return ok(null)
  }

  async deleteContact(id: string): Promise<ApiResponse<null>> {
    await delay(300)
    mockContacts = mockContacts.filter((c) => c.id !== id)
    return ok(null)
  }

  // ── Goals ──────────────────────────────────────────────

  async listGoals(
    page = 0,
    size = 20
  ): Promise<ApiResponse<PagedResponse<"goals", Goal>>> {
    await delay(400)
    restoreSession()
    const mine = mockGoals.filter((g) => g.contentCreatorId === currentCreatorId)
    return ok(paginate("goals", mine, page, size))
  }

  async getGoal(id: string): Promise<ApiResponse<Goal>> {
    await delay(300)
    const goal = mockGoals.find((g) => g.id === id)
    if (!goal) return fail("Meta nao encontrada.")
    return ok(goal)
  }

  async createGoal(data: CreateGoalData): Promise<ApiResponse<null>> {
    await delay(500)
    restoreSession()
    const goal: Goal & { id: string } = {
      id: `goal-${uid()}`,
      name: data.name,
      description: data.description,
      videoId: data.videoId,
      channel: data.channel,
      contentCreatorId: data.contentCreatorId || currentCreatorId || "",
      targets: data.targets.map((t) => ({ ...t, id: `target-${uid()}` })),
      status: "ACTIVE",
    }
    mockGoals.push(goal)
    return ok(null, "Meta criada com sucesso!")
  }

  async deleteGoal(id: string): Promise<ApiResponse<null>> {
    await delay(400)
    const idx = mockGoals.findIndex((g) => g.id === id)
    if (idx === -1) return fail("Meta nao encontrada.")
    mockGoals.splice(idx, 1)
    return ok(null, "Meta removida com sucesso!")
  }

  // ── Relationships ──────────────────────────────────────

  async getCreatorContacts(creatorId: string): Promise<ApiResponse<Contact[]>> {
    await delay(300)
    const contacts = mockContacts
      .filter((c) => c.creatorId === creatorId)
      .map((c) => ({ id: c.id, contact: c.contact, type: c.type }))
    return ok(contacts)
  }

  async deleteCreatorContacts(creatorId: string): Promise<ApiResponse<null>> {
    await delay(300)
    mockContacts = mockContacts.filter((c) => c.creatorId !== creatorId)
    return ok(null)
  }

  async getCreatorGoals(creatorId: string): Promise<ApiResponse<Goal[]>> {
    await delay(300)
    return ok(mockGoals.filter((g) => g.contentCreatorId === creatorId))
  }

  async getGoalCreator(goalId: string): Promise<ApiResponse<ContentCreator>> {
    await delay(300)
    const goal = mockGoals.find((g) => g.id === goalId)
    if (!goal) return fail("Meta nao encontrada.")
    const creator = mockCreators.find((c) => c.id === goal.contentCreatorId)
    if (!creator) return fail("Creator nao encontrado.")
    return ok(creator)
  }

  // ── Channel Videos ────────────────────────────────────

  async getChannelVideos(_channelUrl: string): Promise<ApiResponse<ChannelVideo[]>> {
    await delay(500)
    return ok(mockChannelVideos)
  }
}

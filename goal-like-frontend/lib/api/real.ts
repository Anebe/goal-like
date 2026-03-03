// ============================================================
// Meta De Like - Real API Implementation (HTTP Client)
// ============================================================
// Base URL: http://localhost:8080/api/v1
// Auth:     Cookie: AUTH_TOKEN (sent automatically with credentials)
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

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"

/** Generic request helper. Sends cookies for auth. */
async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
      credentials: "include", // sends AUTH_TOKEN cookie
    })

    // 204 No Content
    if (res.status === 204) {
      return { data: null as unknown as T, success: true }
    }

    // Try to parse JSON
    const text = await res.text()
    let json: unknown = null
    try {
      json = text ? JSON.parse(text) : null
    } catch {
      // plain text response (e.g. /content-creator/me returns a string)
      if (res.ok) return { data: text as unknown as T, success: true }
    }

    if (!res.ok) {
      const msg =
        (json && typeof json === "object" && "message" in json
          ? (json as { message: string }).message
          : null) || `Erro ${res.status}`
      return { data: null as unknown as T, success: false, message: msg }
    }

    return { data: (json ?? text) as T, success: true }
  } catch {
    return {
      data: null as unknown as T,
      success: false,
      message: "Erro de conexao com o servidor.",
    }
  }
}

function qs(page?: number, size?: number) {
  const params = new URLSearchParams()
  if (page !== undefined) params.set("page", String(page))
  if (size !== undefined) params.set("size", String(size))
  const s = params.toString()
  return s ? `?${s}` : ""
}

export class RealApi implements IMetaDeLikeApi {
  // ── Auth ──────────────────────────────────────────────

  async login(credentials: AuthCredentials): Promise<ApiResponse<LoginResponse>> {
    return request<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    })
  }

  async signUp(data: SignUpData): Promise<ApiResponse<null>> {
    return request<null>("/auth/signup", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async logout(): Promise<ApiResponse<null>> {
    // Backend has no explicit logout; we clear cookie client-side
    if (typeof document !== "undefined") {
      document.cookie = "AUTH_TOKEN=; Max-Age=0; path=/"
    }
    return { data: null, success: true }
  }

  // ── Content Creator ────────────────────────────────────

  async getMe(): Promise<ApiResponse<string>> {
    return request<string>("/content-creator/me")
  }

  async getCreator(id: string): Promise<ApiResponse<ContentCreator>> {
    return request<ContentCreator>(`/content-creator/${id}`)
  }

  async createCreator(data: CreateContentCreatorData): Promise<ApiResponse<null>> {
    return request<null>("/content-creator", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async deleteCreator(id: string): Promise<ApiResponse<null>> {
    return request<null>(`/content-creator/${id}`, { method: "DELETE" })
  }

  async listCreators(
    id: string,
    page = 0,
    size = 20
  ): Promise<ApiResponse<PagedResponse<"content-creators", ContentCreator>>> {
    return request(`/content-creator${qs(page, size)}`)
  }

  // ── Contacts ────────────────────────────────────────────

  async listContacts(
    id: string,
    page = 0,
    size = 20
  ): Promise<ApiResponse<PagedResponse<"contacts", Contact>>> {
    return request(`/content-creator/${id}/contacts`)
  }

  async getContact(id: string): Promise<ApiResponse<Contact>> {
    return request<Contact>(`/contacts/${id}`)
  }

  async createContact(data: Contact): Promise<ApiResponse<Contact>> {
    return request<Contact>("/contacts", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateContact(id: string, data: Contact): Promise<ApiResponse<Contact>> {
    return request<Contact>(`/contacts/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async patchContact(id: string, data: Partial<Contact>): Promise<ApiResponse<null>> {
    return request<null>(`/contacts/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async deleteContact(id: string): Promise<ApiResponse<null>> {
    return request<null>(`/contacts/${id}`, { method: "DELETE" })
  }

  // ── Goals ──────────────────────────────────────────────

  async listGoals(
    id: string,
    page = 0,
    size = 20
  ): Promise<ApiResponse<PagedResponse<"goals", Goal>>> {
    return request(`/content-creator/${id}/goals`)
  }

  async getGoal(id: string): Promise<ApiResponse<Goal>> {
    return request<Goal>(`/goal/${id}`)
  }

  async createGoal(data: CreateGoalData): Promise<ApiResponse<null>> {
    return request<null>("/goal", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async deleteGoal(id: string): Promise<ApiResponse<null>> {
    return request<null>(`/goal/${id}`, { method: "DELETE" })
  }

  // ── Relationships ──────────────────────────────────────

  async getCreatorContacts(creatorId: string): Promise<ApiResponse<Contact[]>> {
    return request<Contact[]>(`/content-creator/${creatorId}/contacts`)
  }

  async deleteCreatorContacts(creatorId: string): Promise<ApiResponse<null>> {
    return request<null>(`/content-creator/${creatorId}/contacts`, { method: "DELETE" })
  }

  async getCreatorGoals(creatorId: string): Promise<ApiResponse<Goal[]>> {
    return request<Goal[]>(`/content-creator/${creatorId}/goals`)
  }

  async getGoalCreator(goalId: string): Promise<ApiResponse<ContentCreator>> {
    return request<ContentCreator>(`/goal/${goalId}/content-creator`)
  }

  // ── Channel Videos (not a real endpoint — stubbed) ────

  async getChannelVideos(_channelUrl: string): Promise<ApiResponse<ChannelVideo[]>> {
    return { data: [], success: true, message: "Channel videos not implemented in backend." }
  }
}

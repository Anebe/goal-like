// ============================================================
// Meta De Like - Domain Types (adapted to real backend)
// ============================================================

// ── Enums ───────────────────────────────────────────────

export type ContactType = "EMAIL" | "SMS" | "DISCORD" | "PUSH" | "MOCK"

export type GoalStatus = "ACTIVE" | "COMPLETED" | "EXPIRED" | "CANCELLED"

export type TargetType =
  | "GOAL_DESIRE"
  | "DEADLINE"
  | "DURATION"
  | "PERCENTAGE"
  | "NUMBER_OF_LIKES"

// ── Auth ────────────────────────────────────────────────

export interface AuthCredentials {
  email: string
  password: string
}

export interface SignUpData {
  email: string
  password: string
  fullname: string
}

/** POST /auth/login response */
export interface LoginResponse {
  id: string
}

// ── Content Creator ────────────────────────────────────

export interface Contact {
  id?: string
  contact: string
  type: ContactType
  contentCreatorId?: string
}

export interface ContentCreator {
  id?: string
  fullName: string
  authId: string
  goalEntities?: Goal[]
}

export interface CreateContentCreatorData {
  fullName: string
  contacts: Contact[]
}

// ── Goals ───────────────────────────────────────────────

export interface Target {
  id?: string
  amount: string
  type: TargetType
}

export interface Goal {
  id?: string
  name: string
  description: string
  videoId: string
  status?: GoalStatus
  channel: ContactType
  contentCreatorId?: string
  targets: Target[]
}

export interface CreateGoalData {
  name: string
  description: string
  videoId: string
  channel: ContactType
  contentCreatorId: string
  targets: Target[]
}

// ── Pagination (Spring HATEOAS) ────────────────────────

export interface PageInfo {
  size: number
  totalElements: number
  totalPages: number
  number: number
}

export interface PagedResponse<K extends string, T> {
  _embedded: Record<K, T[]>
  page: PageInfo
}

// ── Channel Videos (frontend-only, for channel picker) ─

export interface ChannelVideo {
  id: string
  title: string
  url: string
  thumbnail: string
  publishedAt: string
  likeCount: number
}

// ── Generic API response wrapper (used by our adapter) ─

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

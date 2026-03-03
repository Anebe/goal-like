// ============================================================
// Meta De Like - API Interface (Contract)
// ============================================================

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

export interface IMetaDeLikeApi {
  // ── Auth ────────────────────────────────────────────────
  login(credentials: AuthCredentials): Promise<ApiResponse<LoginResponse>>
  signUp(data: SignUpData): Promise<ApiResponse<null>>
  logout(): Promise<ApiResponse<null>>

  // ── Content Creator ────────────────────────────────────
  getMe(): Promise<ApiResponse<string>>
  getCreator(id: string): Promise<ApiResponse<ContentCreator>>
  createCreator(data: CreateContentCreatorData): Promise<ApiResponse<null>>
  deleteCreator(id: string): Promise<ApiResponse<null>>
  listCreators(id: string, page?: number, size?: number): Promise<ApiResponse<PagedResponse<"content-creators", ContentCreator>>>

  // ── Contacts ────────────────────────────────────────────
  listContacts(id: string, page?: number, size?: number): Promise<ApiResponse<PagedResponse<"contacts", Contact>>>
  getContact(id: string): Promise<ApiResponse<Contact>>
  createContact(data: Contact): Promise<ApiResponse<Contact>>
  updateContact(id: string, data: Contact): Promise<ApiResponse<Contact>>
  patchContact(id: string, data: Partial<Contact>): Promise<ApiResponse<null>>
  deleteContact(id: string): Promise<ApiResponse<null>>

  // ── Goals ──────────────────────────────────────────────
  listGoals(id: string, page?: number, size?: number): Promise<ApiResponse<PagedResponse<"goals", Goal>>>
  getGoal(id: string): Promise<ApiResponse<Goal>>
  createGoal(data: CreateGoalData): Promise<ApiResponse<null>>
  deleteGoal(id: string): Promise<ApiResponse<null>>

  // ── Relationships ──────────────────────────────────────
  getCreatorContacts(creatorId: string): Promise<ApiResponse<Contact[]>>
  deleteCreatorContacts(creatorId: string): Promise<ApiResponse<null>>
  getCreatorGoals(creatorId: string): Promise<ApiResponse<Goal[]>>
  getGoalCreator(goalId: string): Promise<ApiResponse<ContentCreator>>

  // ── Channel Videos (frontend helper) ───────────────────
  getChannelVideos(channelUrl: string): Promise<ApiResponse<ChannelVideo[]>>
}

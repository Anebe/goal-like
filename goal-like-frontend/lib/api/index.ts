// ============================================================
// Meta De Like - API Factory
// ============================================================
//
// Toggle between mock and real implementations:
//   NEXT_PUBLIC_API_MODE=mock  (default)
//   NEXT_PUBLIC_API_MODE=real
// ============================================================

import type { IMetaDeLikeApi } from "./interface"
import { MockApi } from "./mock"
import { RealApi } from "./real"

const API_MODE = process.env.NEXT_PUBLIC_API_MODE || "real"

let apiInstance: IMetaDeLikeApi | null = null

export function getApi(): IMetaDeLikeApi {
  if (!apiInstance) {
    apiInstance = API_MODE === "real" ? new RealApi() : new MockApi()
  }
  return apiInstance
}

export const api = getApi()

// Re-export everything for convenience
export type { IMetaDeLikeApi } from "./interface"
export * from "./types"

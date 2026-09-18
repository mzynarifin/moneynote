export type ActionResult<T = undefined> =
  | { success: true; data?: T }
  | { success: false; code?: string; message: string; fieldErrors?: Record<string, string[]> };
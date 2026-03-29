/**
 * Strip null/undefined values before sending to API
 */
export function stripNulls(obj: Record<string, any>): Record<string, any> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== null && v !== undefined))
}

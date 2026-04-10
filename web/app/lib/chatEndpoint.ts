/**
 * NEXT_PUBLIC_MYFI_API_URL examples:
 * - API server: https://api.example.com  -> posts to https://api.example.com/api/v1/chat
 * - Netlify function: https://www.myfi.club/.netlify/functions/chat -> used as-is
 * - Full path: https://api.example.com/api/v1/chat -> used as-is
 */
export function resolveChatEndpoint(): string {
  const raw = (process.env.NEXT_PUBLIC_MYFI_API_URL || '').trim().replace(/\/$/, '')
  if (!raw) return ''
  if (raw.includes('functions/chat') || /\/api\/v1\/chat$/i.test(raw)) return raw
  return `${raw}/api/v1/chat`
}

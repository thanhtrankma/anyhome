import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client Supabase phía server, dùng SUPABASE_SECRET_KEY (bỏ qua RLS).
 * Tuyệt đối không import file này vào Client Component.
 */
const globalForSupabase = globalThis as unknown as { __anyhomeSupabase?: SupabaseClient };

export function supabase(): SupabaseClient {
  if (globalForSupabase.__anyhomeSupabase) return globalForSupabase.__anyhomeSupabase;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Thiếu SUPABASE_URL hoặc SUPABASE_SECRET_KEY trong .env.local");

  globalForSupabase.__anyhomeSupabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return globalForSupabase.__anyhomeSupabase;
}

export const UPLOAD_BUCKET = "uploads";
export const DOCUMENT_BUCKET = "documents";

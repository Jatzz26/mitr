import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

function isLikelyValidSupabaseUrl(url: unknown): boolean {
  if (typeof url !== "string") return false;
  try {
    const parsed = new URL(url);
    // Typical Supabase domains end with .supabase.co or .supabase.net
    const isSupabaseHost = /\.supabase\.(co|net)$/i.test(parsed.hostname);
    const isHttp = parsed.protocol === "https:";
    return isHttp && isSupabaseHost;
  } catch {
    return false;
  }
}

function isLikelyValidAnonKey(key: unknown): boolean {
  if (typeof key !== "string") return false;
  // anon keys are JWTs that start with eyJ... (base64-encoded header)
  return key.startsWith("ey");
}

function createMockSupabase() {
  const warn = (method: string) =>
    console.warn(
      `[supabase-mock] ${method} called but VITE_SUPABASE_URL/ANON_KEY are not set. Add them to .env.`
    );
  return {
    auth: {
      async getSession() {
        warn("auth.getSession");
        return { data: { session: null }, error: null } as any;
      },
      onAuthStateChange() {
        warn("auth.onAuthStateChange");
        return { data: { subscription: { unsubscribe() {} } } } as any;
      },
      async signInWithPassword() {
        warn("auth.signInWithPassword");
        return { data: null, error: new Error("Supabase not configured") } as any;
      },
      async signUp() {
        warn("auth.signUp");
        return { data: null, error: new Error("Supabase not configured") } as any;
      },
      async signOut() {
        warn("auth.signOut");
        return { error: null } as any;
      },
    },
  } as any;
}

const shouldUseRealClient =
  isLikelyValidSupabaseUrl(supabaseUrl) && isLikelyValidAnonKey(supabaseAnonKey);

if (!shouldUseRealClient) {
  const urlNote = typeof supabaseUrl === "string" ? supabaseUrl : String(supabaseUrl);
  const keyNote = typeof supabaseAnonKey === "string" ? "[present]" : "[missing]";
  console.error(
    `[supabase] Invalid or missing configuration. VITE_SUPABASE_URL=${urlNote} VITE_SUPABASE_ANON_KEY=${keyNote}.` +
      "\nEnsure your .env contains the correct project URL (https://<id>.supabase.co) and anon key, and that your Supabase Auth CORS settings include your local origin."
  );
}

export const supabase = shouldUseRealClient
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : createMockSupabase();



import { supabase } from "../supabase/client";

export const auth = {
  signInWithOAuth: async (provider: "google" | "apple" | "github") => {
    return supabase.auth.signInWithOAuth({ provider });
  },
};

import { SupabaseClient } from "@supabase/supabase-js";

export class AuthRepository {
    constructor(private supabase: SupabaseClient) {}

    async signUp(email: string, password: string) {
        return await this.supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: "http://localhost:3000/login",
            },
        });
    }

    async login(email: string, password: string) {
        return await this.supabase.auth.signInWithPassword({
            email,
            password,
        });
    }

    async getProfile(userId: string) {
        return await this.supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
    }

    async updateProfile(userId: string, updates: Record<string, any>) {
        return await this.supabase
            .from("profiles")
            .update(updates)
            .eq("id", userId)
            .select()
            .maybeSingle();
    }

    

    async updateAuth(authUpdate: {
        email?: string;
        password?: string;
    }) {
        return await this.supabase.auth.updateUser(authUpdate);
    }

    async getUser() {
        return await this.supabase.auth.getUser();
    }
}
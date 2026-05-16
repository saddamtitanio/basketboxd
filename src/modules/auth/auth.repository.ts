import { SupabaseClient } from "@supabase/supabase-js";

export class AuthRepository {
    constructor(private supabase: SupabaseClient) {}

    async signUp(email: string, password: string, username: string) {
        const { data: existingUser, error } = await this.supabase
            .from("profiles")
            .select("username")
            .eq("username", username)
            .maybeSingle();

        if (existingUser) {
            throw new Error("Username already taken");
        }

        if (error) {
            throw new Error("Error checking username availability");
        }
        
        return await this.supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: "http://localhost:3000/authlogin",
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
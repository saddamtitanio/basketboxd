import { SupabaseClient } from "@supabase/supabase-js";

export class UsersRepository {
    constructor(private supabase: SupabaseClient) {}

    async getProfileById(userId: string) {
        return await this.supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .single();
    }

    async getUser() {
        return await this.supabase.auth.getUser();
    }
}
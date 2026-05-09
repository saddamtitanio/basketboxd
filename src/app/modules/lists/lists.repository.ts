import { SupabaseClient } from "@supabase/supabase-js";

export class ListsRepository {
    constructor(private supabase: SupabaseClient) {}

    async getUser() {
        return await this.supabase.auth.getUser();
    }

    async createList(list: {
        user_id: string;
        title: string;
        description?: string;
        is_public?: boolean;
        type: string;
    }) {
        return await this.supabase
            .from("lists")
            .insert(list)
            .select()
            .single();
    }

    async getMyLists(userId: string) {
        return await this.supabase
            .from("lists")
            .select("*")
            .eq("user_id", userId);
    }

    async getPublicLists() {
        return await this.supabase
            .from("lists")
            .select("*")
            .eq("is_public", true);
    }

    async getListById(id: string) {
        return await this.supabase
            .from("lists")
            .select("*")
            .eq("id", id)
            .single();
    }

    async deleteList(id: string) {
        return await this.supabase
            .from("lists")
            .delete()
            .eq("id", id);
    }

    async addGameToList(
        listId: string,
        gameId: number
    ) {
        return await this.supabase
            .from("list_games")
            .insert({
                list_id: listId,
                game_id: gameId,
            });
    }

    async removeGameFromList(
        listId: string,
        gameId: number
    ) {
        return await this.supabase
            .from("list_games")
            .delete()
            .eq("list_id", listId)
            .eq("game_id", gameId);
    }

    async getGamesInList(listId: string) {
        return await this.supabase
            .from("list_games")
            .select("*")
            .eq("list_id", listId);
    }
}
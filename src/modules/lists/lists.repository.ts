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
            .select(`
                *,
                profiles:profiles (
                    id,
                    username,
                    display_name
                ),
                games:list_games (
                    added_at,
                    game:games (
                        id,
                        game_date,
                        season,
                        arena,
                        status,
                        home_score,
                        away_score,
                        image_url,
                        home_team:teams!games_home_team_id_fkey (
                            id,
                            name,
                            city,
                            abbreviation,
                            logo_url
                        ),
                        away_team:teams!games_away_team_id_fkey (
                            id,
                            name,
                            city,
                            abbreviation,
                            logo_url
                        )
                    )
                )
            `)
            .eq("is_public", true)
            .order("created_at", { ascending: false });
    }

    async getListById(id: string) {
        return await this.supabase
            .from("lists")
            .select("*")
            .eq("id", id)
            .single();
    }

    async getListWithGames(id: string) {
        return await this.supabase
            .from("lists")
            .select(`
                *,
                profiles:user_id (
                    id,
                    username,
                    display_name
                ),
                games:list_games (
                    added_at,
                    game:games (
                        id,
                        game_date,
                        season,
                        arena,
                        status,
                        home_score,
                        away_score,
                        image_url,
                        home_team:teams!games_home_team_id_fkey (
                            id,
                            name,
                            city,
                            abbreviation,
                            logo_url
                        ),
                        away_team:teams!games_away_team_id_fkey (
                            id,
                            name,
                            city,
                            abbreviation,
                            logo_url
                        )
                    )
                )
            `)
            .eq("id", id)
            .single();
    }

    async deleteList(id: string) {
        return await this.supabase
            .from("lists")
            .delete()
            .eq("id", id);
    }

    async addGameToList(listId: string, gameId: string) {
        const { data, error } = await this.supabase
            .from("list_games")
            .insert({
                list_id: listId,
                game_id: gameId,
            })
            .select();

        console.log("INSERT RESULT:", { data, error });

        return { data, error };
    }

    async removeGameFromList(listId: string, gameId: string) {
        return await this.supabase
            .from("list_games")
            .delete()
            .eq("list_id", listId)
            .eq("game_id", gameId);
    }

    async getGamesInList(listId: string) {
        return await this.supabase
            .from("list_games")
            .select(`
                added_at,
                game:games (
                    id,
                    game_date,
                    season,
                    arena,
                    status,
                    home_score,
                    away_score,
                    image_url,
                    home_team:teams!games_home_team_id_fkey (
                        id,
                        name,
                        city,
                        abbreviation,
                        logo_url
                    ),
                    away_team:teams!games_away_team_id_fkey (
                        id,
                        name,
                        city,
                        abbreviation,
                        logo_url
                    )
                )
            `)
            .eq("list_id", listId)
            .order("added_at", { ascending: false });
    }
    async updateList(
    id: string,
    updates: {
        title?: string;
        description?: string;
        is_public?: boolean;
        type?: string;
    }
    ) {
    return await this.supabase
        .from("lists")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
    }
}
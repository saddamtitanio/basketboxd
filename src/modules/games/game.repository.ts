import { createClient } from "@/src/app/lib/supabase/server";

export class GameRepository {
    /* Get all games */
    async findAll(filters: {
        query?: string;
        season?: string;
        teamId?: string;
        arena?: string;
        date?: string;
        startDate?: string;
        endDate?: string;
        status?: string;
    } = {}) {
        const supabase = await createClient();

        const { data, error } = await supabase.rpc("search_games", {
            search_query: filters.query ?? null,
            filter_team_id: filters.teamId ?? null,
            filter_season: filters.season ?? null,
            filter_arena: filters.arena ?? null,
            filter_status: filters.status ??  null,
            filter_date: filters.date ?? null,
            filter_start_date: filters.startDate ? `${filters.startDate}T00:00:00Z` : null,
            filter_end_date: filters.endDate ? `${filters.endDate}T23:59:59Z` : null,
        });

        if (error) throw new Error(error.message);
        return data;
    }
    /* Get game by ID */
    async findById(id: string) {
        const supabase = await createClient();

        const { data, error } = await supabase
        .from("games")
        .select(`
            *,
            home_team:teams!games_home_team_id_fkey (
                id,
                name,
                logo_url,
                players (
                    id,
                    full_name,
                    image_url,
                    jersey_number,
                    position,
                    stats:player_games!player_games_player_id_fkey (
                        game_id,
                        pts,
                        ast,
                        reb,
                        min,
                        fga,
                        fgm,
                        three_fga,
                        three_fgm,
                        fta,
                        ftm,
                        fg_pct,
                        stl,
                        blk
                    )
                )
            ),
            away_team:teams!games_away_team_id_fkey (
                id,
                name,
                logo_url,
                players (
                    id,
                    full_name,
                    image_url,
                    jersey_number,
                    position,
                    stats:player_games!player_games_player_id_fkey (
                        game_id,
                        pts,
                        ast,
                        reb,
                        min,
                        fga,
                        fgm,
                        three_fga,
                        three_fgm,
                        fta,
                        ftm,
                        fg_pct,
                        stl,
                        blk
                    )
                )
            )
        `)
        .eq("id", id)
        .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    /* Search games */
    async search(query: string) {
        const supabase = await createClient();

        const { data, error } = await supabase
        .from("games")
        .select(`
            *,
            home_team:teams!games_home_team_id_fkey (
                id,
                name,
                logo_url
            ),
            away_team:teams!games_away_team_id_fkey (
                id,
                name,
                logo_url
            )
        `)
        .or(`
            season.ilike.%${query}%,
            arena.ilike.%${query}%,
            status.ilike.%${query}%
        `)
        .order("game_date", { ascending: false });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    /* Get games by season */
    async findBySeason(season: string) {
        const supabase = await createClient();

        const { data, error } = await supabase
        .from("games")
        .select(`
            *,
            home_team:teams!games_home_team_id_fkey (
                id,
                name,
                logo_url
            ),
            away_team:teams!games_away_team_id_fkey (
                id,
                name,
                logo_url
            )
        `)
        .eq("season", season)
        .order("game_date", { ascending: false });

        if (error) {
        throw new Error(error.message);
        }

        return data;
    }

    /* Get live games */
    async findLiveGames() {
        const supabase = await createClient();

        const { data, error } = await supabase
        .from("games")
        .select(`
            *,
            home_team:teams!games_home_team_id_fkey (
                id,
                name,
                logo_url
            ),
            away_team:teams!games_away_team_id_fkey (
                id,
                name,
                logo_url
            )
        `)
        .eq("status", "LIVE");

        if (error) {
        throw new Error(error.message);
        }

        return data;
    }

    /* Get completed games */
    async findCompletedGames() {
        const supabase = await createClient();

        const { data, error } = await supabase
        .from("games")
        .select(`
            *,
            home_team:teams!games_home_team_id_fkey (
                id,
                name,
                logo_url
            ),
            away_team:teams!games_away_team_id_fkey (
                id,
                name,
                logo_url
            )
        `)
        .eq("status", "FINISHED")
        .order("game_date", { ascending: false });

        if (error) {
        throw new Error(error.message);
        }

        return data;
    }

    /* Get games by team */ 

    async findByTeam(teamId: string) {
        const supabase = await createClient();

        const { data, error } = await supabase
        .from("games")
        .select(`
            *,
            home_team:teams!games_home_team_id_fkey (
                id,
                name,
                logo_url
            ),
            away_team:teams!games_away_team_id_fkey (
                id,
                name,
                logo_url
            )
        `)
        .or(`
            home_team_id.eq.${teamId},
            away_team_id.eq.${teamId}
        `)
        .order("game_date", { ascending: false });

        if (error) {
        throw new Error(error.message);
        }

        return data;
    }
}
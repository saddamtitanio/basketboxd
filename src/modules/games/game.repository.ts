import { createClient } from "@/src/app/lib/supabase/server";

export class GameRepository {
    /* Get all games */
    async findAll(filters: {
        season?: string;
        teamId?: string;
        arena?: string;
        date?: string;
        startDate?: string;
        endDate?: string;
        status?: string;
    } = {}) {
        const supabase = await createClient();

        let q = supabase
            .from("games")
            .select(`
                *,
                home_team:teams!games_home_team_id_fkey (id, name, city, abbreviation, logo_url),
                away_team:teams!games_away_team_id_fkey (id, name, city, abbreviation, logo_url),
                reviews (rating)
            `);

        if (filters.status) {
            q = q.eq("status", filters.status);
        }
        if (filters.season) {
            q = q.eq("season", filters.season);
        }
        if (filters.teamId) {
            q = q.or(`home_team_id.eq.${filters.teamId},away_team_id.eq.${filters.teamId}`);
        }
        if (filters.arena) {
            q = q.ilike("arena", `%${filters.arena}%`);
        }
        if (filters.date) {
            const day = filters.date;
            q = q.gte("game_date", `${day}T00:00:00Z`).lte("game_date", `${day}T23:59:59Z`);
        }

        if (filters.startDate) {
            q = q.gte("game_date", `${filters.startDate}T00:00:00Z`);
        }
        if (filters.endDate) {
            q = q.lte("game_date", `${filters.endDate}T23:59:59Z`);
        }

        q = q.order("game_date", { ascending: false });

        const { data, error } = await q;
        

        if (error) {
            throw new Error(error.message);
        }

        return data.map(game => ({
            ...game,
            rating: game.reviews.length
                ? game.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) / game.reviews.length
                : undefined,
            review_count: game.reviews.length || undefined,
            reviews: undefined,
        }));
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
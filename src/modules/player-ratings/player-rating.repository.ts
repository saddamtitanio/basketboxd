import { createClient } from "@/src/app/lib/supabase/server";

export class PlayerRatingRepository {
    /* Create player rating */
    async create(data: {
        user_id: string;
        game_id: string;
        player_id: string;
        rating: number;
    }) {
        const supabase = await createClient();
        const { data: playerRating, error } =
        await supabase
            .from("player_ratings")
            .insert({...data })
            .select(`
            *,
            player:players (
                id,
                name,
                image_url
            )
            `)
            .single();

        if (error) {
            throw new Error(error.message);
        }

        return playerRating;
    }

    /* Get ratings by game */
    async findByGame(gameId: string) {
        const supabase = await createClient();
        const { data, error } = await supabase
        .from("player_ratings")
        .select(`
            *,
            player:players (
            id,
            name,
            image_url,
            team_id
            ),
            user:profiles (
            id,
            username
            )
        `)
        .eq("game_id", gameId);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    /* Get ratings by player */
    async findByPlayer(playerId: string) {
        const supabase = await createClient();
        const { data, error } = await supabase
        .from("player_ratings")
        .select(`
            *,
            game:games (
            id,
            season,
            game_date
            )
        `)
        .eq("player_id", playerId);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    /* Check existing rating */
    async findExistingRating(
        userId: string,
        gameId: string,
        playerId: string
    ) {
        const supabase = await createClient();
        const { data, error } = await supabase
        .from("player_ratings")
        .select("*")
        .eq("user_id", userId)
        .eq("game_id", gameId)
        .eq("player_id", playerId)
        .maybeSingle();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    /* Delete ratings by review/game */
    async deleteByGameAndUser(
        gameId: string,
        userId: string
    ) {
        const supabase = await createClient();
        const { error } = await supabase
        .from("player_ratings")
        .delete()
        .eq("game_id", gameId)
        .eq("user_id", userId);

        if (error) {
            throw new Error(error.message);
        }
    }

    async update(
        ratingId: string,
        data: {
            rating: number;
        }
    ) {
        const supabase = await createClient();
        const { data: updatedRating, error } = await supabase
        .from("player_ratings")
        .update({
            rating: data.rating,
        })
        .eq("id", ratingId)
        .select("*")
        .single();

        if (error) {
            throw new Error(error.message);
        }

        return updatedRating;
    }
    async findByUserGamePlayer(
        userId: string,
        gameId: string,
        playerId: string
    ) {
        const supabase = await createClient();
        const { data, error } = await supabase
        .from("player_ratings")
        .select("*")
        .eq("user_id", userId)
        .eq("game_id", gameId)
        .eq("player_id", playerId)
        .maybeSingle();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    // Get top N players by average rating
    async getLeaderboardByGame(gameId: string, limit = 10) {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("player_ratings")
            .select(`
                player_id,
                rating,
                player:players (
                    id,
                    full_name,
                    image_url,
                    team_id
                ),
                game:games (
                    id,
                    home_team:home_team_id_fkey (
                        id,
                        name,
                        logo_url
                    ),
                    away_team:away_team_id_fkey (
                        id,
                        name,
                        logo_url
                    )
                )
            `)
            .eq("game_id", gameId)
            .order('rating', { ascending: false })
            .limit(limit);

        if (error) throw new Error(error.message);

        // Map data to include team info based on player's team_id
        return data.map(d => {
            const playerData = d.player[0];
            const playerTeamId = playerData.team_id;
            const game = d.game[0];
            const team = game.home_team[0].id === playerTeamId ? game.home_team[0] : game.away_team[0];

            return {
                player: playerData,
                rating: d.rating,
                team,
            };
        });
    }
}
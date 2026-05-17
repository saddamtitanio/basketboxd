import { createClient } from "@/src/app/lib/supabase/server";
import { use } from "react";

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
                full_name,
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
                full_name,
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
            console.log(error)
            throw new Error(error.message);
        }
    }

    /* Delete ratings by player, game, and user */
    async deleteByPlayerGameUser(
        playerId: string,
        gameId: string
    ) {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user === null) {
            throw new Error("User not authenticated");
        }
        
        const { error } = await supabase
        .from("player_ratings")
        .delete()
        .eq("player_id", playerId)
        .eq("game_id", gameId)
        .eq("user_id", user.id);

        if (error) {
            throw new Error(error.message);
        }
    }

    async update(data: {
        user_id: string;
        game_id: string;
        player_id: string;
        rating: number;
    }) {
        const supabase = await createClient();

        const { data: updatedRating, error } = await supabase
            .from("player_ratings")
            .update({
                rating: data.rating,
            })
            .eq("user_id", data.user_id)
            .eq("game_id", data.game_id)
            .eq("player_id", data.player_id)
            .select("*")
            .maybeSingle();

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
    async getLeaderboardByGame(gameId: string, limit = 5) {
        const supabase = await createClient();

        const { data, error } = await supabase.rpc(
            "get_game_leaderboard",
            {
                p_game_id: gameId,
                p_limit: limit,
            }
        );

        if (error) {
            console.error(error);
            throw new Error(error.message);
        }

        return data;
    }
   
    
    async findByUserAndGame(userId: string, gameId: string) {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("player_ratings")
            .select(`
                *,
                player:players (
                    id,
                    full_name,
                    image_url,
                    team_id
                )
            `)
            .eq("user_id", userId)
            .eq("game_id", gameId);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
    async upsertRating(data: {
        user_id: string;
        game_id: string;
        player_id: string;
        rating: number;
    }) {
    const supabase = await createClient();

    const { data: result, error } = await supabase
        .from("player_ratings")
        .upsert(
        {
            user_id: data.user_id,
            game_id: data.game_id,
            player_id: data.player_id,
            rating: data.rating,
        },
        {
            onConflict: "user_id,game_id,player_id",
        }
        )
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

        return result;
    }

    async findBatchByUserGame(
        userId: string, gameId: string, playerIds: string[]
    ): Promise<Record<string, number | null>> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("player_ratings")
            .select("player_id, rating")
            .eq("user_id", userId)
            .eq("game_id", gameId)
            .in("player_id", playerIds);
        if (error) throw new Error(error.message);
 
        const map: Record<string, number | null> = {};
        playerIds.forEach(id => { map[id] = null; });

        (data ?? []).forEach((row: { player_id: string; rating: number }) => {
            map[row.player_id] = row.rating;
        });
        return map;
    }
}
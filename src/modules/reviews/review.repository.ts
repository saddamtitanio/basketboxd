import { createClient } from "@/src/app/lib/supabase/server";

export class ReviewRepository {
    /* Create review */
    async create(data: {
        user_id: string;
        game_id: string;
        rating: number;
        review_text: string;
    }) {
        const supabase = await createClient();
        const { data: review, error } = await supabase
        .from("reviews")
        .insert({
            ...data,
            created_at: new Date().toISOString(),
        })
        .select(`
            *,
            user:profiles (
                id,
                username,
                avatar_url
            )
        `)
        .single();

        if (error) {
            throw new Error(error.message);
        }

        return review;
    }

    /* Check existing review */
    async findExistingReview(
        userId: string,
        gameId: string
    ) {
        const supabase = await createClient();
        const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("user_id", userId)
        .eq("game_id", gameId)
        .maybeSingle();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    /* Get reviews by game */
    async findByGame(gameId: string) {
        const supabase = await createClient();
        const { data, error } = await supabase
        .from("reviews")
        .select(`
            *,
            user:profiles (
                id,
                username,
                avatar_url
            )
        `)
        .eq("game_id", gameId)
        .order("created_at", {
            ascending: false,
        });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async delete(reviewId: string) {
        const supabase = await createClient();
        const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("id", reviewId);

        if (error) {
            throw new Error(error.message);
        }

        return true;
    }

    async update(reviewId: string, data: {
        rating?: number;
        review_text?: string;
    }) {
        const supabase = await createClient();
        const { data: updatedReview, error } = await supabase
        .from("reviews")
        .update(data)
        .eq("id", reviewId)
        .select()
        .single();

        if (error) {
            throw new Error(error.message);
        }

        return updatedReview;
    }

    async findById(reviewId: string) {
        const supabase = await createClient();
        const { data, error } = await supabase
        .from("reviews")
        .select(`
            *,
            user:profiles (
                id,
                username,
                avatar_url
            )
        `)
        .eq("id", reviewId)
        .single();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async findByUser(userId: string) {
        const supabase = await createClient();
        const { data, error } = await supabase
        .from("reviews")
        .select(`
            *,
            user:profiles (
                id,
                username,
                display_name,
                bio,
                avatar_url
            ),
            home_team:teams!games_home_team_id_fkey (
                name,
                logo_url
            ),
            away_team:teams!games_away_team_id_fkey (
                name,
                logo_url
            )
        `)
        .eq("user_id", userId)
        .order("created_at", {
            ascending: false,
        });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
    
    async incrementLikes(reviewId: string) {
        const supabase = await createClient();

        const { data: review, error: fetchError } = await supabase
            .from("reviews")
            .select("likes_count")
            .eq("id", reviewId)
            .single();

        if (fetchError) throw new Error(fetchError.message);

        const { data, error } = await supabase
            .from("reviews")
            .update({ likes_count: (review.likes_count || 0) + 1 })
            .eq("id", reviewId)
            .select()
            .single();

        if (error) throw new Error(error.message);

        return data;
    }

    async decrementLikes(reviewId: string) {
        const supabase = await createClient();

        const { data: review, error: fetchError } = await supabase
            .from("reviews")
            .select("likes_count")
            .eq("id", reviewId)
            .single();

        if (fetchError) throw new Error(fetchError.message);

        const { data, error } = await supabase
            .from("reviews")
            .update({ likes_count: Math.max((review.likes_count || 0) - 1, 0) })
            .eq("id", reviewId)
            .select()
            .single();

        if (error) throw new Error(error.message);

        return data;
    }

    async getLeaderboard(limit = 10) {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("player_ratings")
            .select(`
                player_id,
                avg:rating,
                player:players (
                    id,
                    name,
                    image_url
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
            .order('avg', { ascending: false })
            .limit(limit);

        if (error) throw new Error(error.message);

        return data;
    }
}
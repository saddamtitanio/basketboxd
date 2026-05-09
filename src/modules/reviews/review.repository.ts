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
            user:profiles!reviews_user_id_fkey (
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
            user:profiles!reviews_user_id_fkey (
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
        // temp
        await supabase.auth.signInWithPassword({
            email: process.env.TEMP_USER_EMAIL!,
            password: process.env.TEMP_USER_PASSWORD!
        });
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase.rpc("toggle_like", { p_review_id: reviewId, p_user_id: user.id, p_action: "like" });

        if (error) throw new Error(error.message);
        return data;
    }

    async decrementLikes(reviewId: string) {
        const supabase = await createClient();

        // temp
        await supabase.auth.signInWithPassword({
            email: process.env.TEMP_USER_EMAIL!,
            password: process.env.TEMP_USER_PASSWORD!
        });
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .rpc("toggle_like", { p_review_id: reviewId, p_user_id: user.id, p_action: "unlike" });

        if (error) throw new Error(error.message);
        return data;
    }
}
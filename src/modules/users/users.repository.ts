import { SupabaseClient } from "@supabase/supabase-js";

export class UsersRepository {
    constructor(private supabase: SupabaseClient) {}

    async getUser() {
        return this.supabase.auth.getUser();
    }

    async getProfileById(userId: string) {
        return this.supabase
            .from("profiles")
            .select("id, username, display_name, bio, avatar_url, created_at")
            .eq("id", userId)
            .single();
    }

    async getFollowerCount(userId: string) {
        return this.supabase
            .from("follows")
            .select("*", { count: "exact", head: true })
            .eq("following_id", userId);
    }

    async getFollowingCount(userId: string) {
        return this.supabase
            .from("follows")
            .select("*", { count: "exact", head: true })
            .eq("follower_id", userId);
    }

    async isFollowing(followerId: string, followingId: string) {
        return this.supabase
            .from("follows")
            .select("follower_id")
            .eq("follower_id", followerId)
            .eq("following_id", followingId)
            .maybeSingle();
    }

    async getRecentReviews(userId: string, limit = 5) {
        return this.supabase
            .from("reviews")
            .select(`
                id, review_text, rating, created_at,
                game:games!reviews_game_id_fkey (
                    id,
                    home_team:teams!games_home_team_id_fkey (name, abbreviation, logo_url),
                    away_team:teams!games_away_team_id_fkey (name, abbreviation, logo_url)
                )
            `)
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(limit);
    }

    async getReviewCount(userId: string) {
        return this.supabase
            .from("reviews")
            .select("*", { count: "exact", head: true })
            .eq("user_id", userId);
    }

    async follow(followerId: string, followingId: string) {
        return this.supabase
            .from("follows")
            .insert({ follower_id: followerId, following_id: followingId });
    }

    async unfollow(followerId: string, followingId: string) {
        const result = await this.supabase
            .from("follows")
            .delete()
            .eq("follower_id", followerId)
            .eq("following_id", followingId)
            .select();

        if (result.error) {
            console.error("Unfollow error:", result.error);
        }

        return result;
    }
    async getFollowers(userId: string) {
        return this.supabase
            .from("follows")
            .select(`
                created_at,
                follower:profiles!follows_follower_id_fkey (
                    id, username, display_name, avatar_url
                )
            `)
            .eq("following_id", userId)
            .order("created_at", { ascending: false });
    }

    async getFollowing(userId: string) {
        return this.supabase
            .from("follows")
            .select(`
                created_at,
                following:profiles!follows_following_id_fkey (
                    id, username, display_name, avatar_url
                )
            `)
            .eq("follower_id", userId)
            .order("created_at", { ascending: false });
    }
}
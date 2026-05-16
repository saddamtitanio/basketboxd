import { createClient } from "@/src/app/lib/supabase/server";

export class FollowRepository {
    async getFollowerCount(userId: string) {
        const supabase = await createClient();

        const { count } = await supabase
            .from("follows")
            .select("*", { count: "exact", head: true })
            .eq("following_id", userId);

        return count ?? 0;
    }

    async getFollowingCount(userId: string) {
        const supabase = await createClient();

        const { count } = await supabase
            .from("follows")
            .select("*", { count: "exact", head: true })
            .eq("follower_id", userId);

        return count ?? 0;
    }

    async isFollowing(followerId: string, followingId: string) {
        const supabase = await createClient();

        const { data } = await supabase
            .from("follows")
            .select("follower_id")
            .eq("follower_id", followerId)
            .eq("following_id", followingId)
            .maybeSingle();

        return !!data;
    }

    async follow(followerId: string, followingId: string) {
        const supabase = await createClient();

        return await supabase
            .from("follows")
            .insert({ follower_id: followerId, following_id: followingId });
    }

    async unfollow(followerId: string, followingId: string) {
        const supabase = await createClient();

        return await supabase
            .from("follows")
            .delete()
            .eq("follower_id", followerId)
            .eq("following_id", followingId);
    }

    async getFollowers(userId: string) {
        const supabase = await createClient();

        const { data } = await supabase
            .from("follows")
            .select(`
                created_at,
                follower:profiles!follows_follower_id_fkey (
                    id, username, display_name, avatar_url
                )
            `)
            .eq("following_id", userId)
            .order("created_at", { ascending: false });

        return data ?? [];
    }

    async getFollowing(userId: string) {
        const supabase = await createClient();

        const { data } = await supabase
            .from("follows")
            .select(`
                created_at,
                following:profiles!follows_following_id_fkey (
                    id, display_name, avatar_url
                )
            `)
            .eq("follower_id", userId)
            .order("created_at", { ascending: false });

        return data ?? [];
    }
}
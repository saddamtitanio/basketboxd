import { createClient } from "@/src/app/lib/supabase/server";

export class FollowRepository {
    async follow(followerId: string, followingId: string) {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("follows")
            .insert({ follower_id: followerId, following_id: followingId, created_at: new Date().toISOString() })
            .select()
            .single();

        if (error) throw new Error(error.message);
        return data;
    }

    async unfollow(followerId: string, followingId: string) {
        const supabase = await createClient();
        const { error } = await supabase
            .from("follows")
            .delete()
            .eq("follower_id", followerId)
            .eq("following_id", followingId);

        if (error) throw new Error(error.message);
    }

    async isFollowing(followerId: string, followingId: string) {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("follows")
            .select("follower_id")
            .eq("follower_id", followerId)
            .eq("following_id", followingId)
            .maybeSingle();

        if (error) throw new Error(error.message);
        return !!data;
    }

    async getFollowers(userId: string) {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("follows")
            .select(`
                created_at,
                follower:profiles!follows_follower_id_fkey (
                    id, username, display_name, avatar_url, bio
                )
            `)
            .eq("following_id", userId)
            .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);
        return data;
    }

    async getFollowing(userId: string) {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("follows")
            .select(`
                created_at,
                following:profiles!follows_following_id_fkey (
                    id, username, display_name, avatar_url, bio
                )
            `)
            .eq("follower_id", userId)
            .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);
        return data;
    }

    async getFollowerCount(userId: string) {
        const supabase = await createClient();
        const { count, error } = await supabase
            .from("follows")
            .select("*", { count: "exact", head: true })
            .eq("following_id", userId);

        if (error) throw new Error(error.message);
        return count ?? 0;
    }

    async getFollowingCount(userId: string) {
        const supabase = await createClient();
        const { count, error } = await supabase
            .from("follows")
            .select("*", { count: "exact", head: true })
            .eq("follower_id", userId);

        if (error) throw new Error(error.message);
        return count ?? 0;
    }
}
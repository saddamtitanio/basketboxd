import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { UsersRepository } from "./users.repository";

export class UsersService {
    private repository;

    private constructor(repository: UsersRepository) {
        this.repository = repository;
    }

    static async create() {
        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },
                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    },
                },
            }
        );

        const repository = new UsersRepository(supabase);
        return new UsersService(repository);
    }

    async getProfileById(userId: string) {
        const { data, error } =
            await this.repository.getProfileById(userId);

        if (error) throw new Error(error.message);
        return data;
    }

    async getMyProfile() {
        const { data: { user }, error } =
            await this.repository.getUser();

        if (error || !user) {
            throw new Error("Unauthorized");
        }

        const { data: profile, error: profileError } =
            await this.repository.getProfileById(user.id);

        if (profileError) throw new Error(profileError.message);

        return profile;
    }

    async getProfilePage(userId: string) {
        const { data: profile, error } =
            await this.repository.getProfileById(userId);

        if (error || !profile) {
            throw new Error("Profile not found");
        }

        const [
            { count: followers },
            { count: following },
            { count: reviews }
        ] = await Promise.all([
            this.repository.getFollowerCount(userId),
            this.repository.getFollowingCount(userId),
            this.repository.getReviewCount(userId),
        ]);

        const {
            data: { user }
        } = await this.repository.getUser();

        let isFollowing = false;

        if (user && user.id !== userId) {
            const { data } = await this.repository.isFollowing(
                user.id,
                userId
            );
            isFollowing = !!data;
        }

        const { data: recentReviews } =
            await this.repository.getRecentReviews(userId);

        return {
            profile,
            stats: {
                followers: followers ?? 0,
                following: following ?? 0,
                reviews: reviews ?? 0,
            },
            isFollowing,
            recentReviews: recentReviews ?? [],
            isOwnProfile: user?.id === userId,
        };
    }

    async follow(userId: string, targetId: string) {
        if (userId === targetId) {
            throw new Error("Cannot follow yourself");
        }

        const { error } = await this.repository.follow(userId, targetId);

        if (error && error.code !== "23505") {
            throw new Error(error.message);
        }

        return { isFollowing: true };
    }

    async unfollow(userId: string, targetId: string) {
        const { error } = await this.repository.unfollow(userId, targetId);

        if (error) throw new Error(error.message);

        return { isFollowing: false };
    }

    async getFollowers(userId: string) {
        const { data, error } =
            await this.repository.getFollowers(userId);

        if (error) throw new Error(error.message);

        return (data ?? []).map((r: any) => r.follower);
    }

    async getFollowing(userId: string) {
        const { data, error } =
            await this.repository.getFollowing(userId);

        if (error) throw new Error(error.message);

        return (data ?? []).map((r: any) => r.following);
    }
}
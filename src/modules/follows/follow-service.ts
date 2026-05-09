import { FollowRepository } from "./follow-repository";

export class FollowService {
    private followRepository: FollowRepository;

    constructor() {
        this.followRepository = new FollowRepository();
    }

    async follow(followerId: string, followingId: string) {
        if (followerId === followingId) {
            throw new Error("You cannot follow yourself");
        }
        const already = await this.followRepository.isFollowing(followerId, followingId);
        if (already) {
            throw new Error("Already following this user");
        }

        return await this.followRepository.follow(followerId, followingId);
    }

    async unfollow(followerId: string, followingId: string) {
        if (followerId === followingId) {
            throw new Error("You cannot unfollow yourself");
        }
        const exists = await this.followRepository.isFollowing(followerId, followingId);
        if (!exists) {
            throw new Error("You are not following this user");
        }

        return await this.followRepository.unfollow(followerId, followingId);
    }

    async isFollowing(followerId: string, followingId: string) {
        return await this.followRepository.isFollowing(followerId, followingId);
    }

    async getFollowers(userId: string) {
        const [followers, count] = await Promise.all([
            this.followRepository.getFollowers(userId),
            this.followRepository.getFollowerCount(userId),
        ]);
        return { followers, count };
    }

    async getFollowing(userId: string) {
        const [following, count] = await Promise.all([
            this.followRepository.getFollowing(userId),
            this.followRepository.getFollowingCount(userId),
        ]);
        return { following, count };
    }
}
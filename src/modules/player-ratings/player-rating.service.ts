import { PlayerRatingRepository } from "./player-rating.repository";

const playerRatingRepo = new PlayerRatingRepository();

export class PlayerRatingService {
    async submitRating(data: {
        user_id: string;
        game_id: string;
        player_id: string;
        rating: number;
    }) {
        const existing = await playerRatingRepo.findExistingRating(
            data.user_id,
            data.game_id,
            data.player_id
        );
        if (existing) {
            throw new Error("You already rated this player for this game");
        }

        // Validate rating
        if (data.rating < 1 || data.rating > 10) {
            throw new Error("Rating must be between 1 and 10");
        }

        return playerRatingRepo.create(data);
    }

    // Update a rating
    async updateRating(ratingId: string, rating: number) {
        if (rating < 1 || rating > 10) {
            throw new Error("Rating must be between 1 and 10");
        }
        return playerRatingRepo.update(ratingId, { rating });
    }

    // Delete ratings by game and user
    async deleteRatingsByGameUser(gameId: string, userId: string) {
        return playerRatingRepo.deleteByGameAndUser(gameId, userId);
    }

    // Get ratings for a specific game
    async getRatingsByGame(gameId: string) {
        return playerRatingRepo.findByGame(gameId);
    }

    // Get ratings for a specific player
    async getRatingsByPlayer(playerId: string) {
        return playerRatingRepo.findByPlayer(playerId);
    }

    // Get top players leaderboard
    async getLeaderboard(limit = 10, gameId: string) {
        return playerRatingRepo.getLeaderboardByGame(gameId, limit);
    }
}
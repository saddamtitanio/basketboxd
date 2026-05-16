import { PlayerRatingRepository } from "./player-rating.repository";

export class PlayerRatingService {
    private playerRatingRepo: PlayerRatingRepository;

    constructor() {
        this.playerRatingRepo = new PlayerRatingRepository();
    }

    async submitRating(data: {
        user_id: string;
        game_id: string;
        player_id: string;
        rating: number;
    }) {
    if (data.rating < 1 || data.rating > 10) {
        throw new Error("Rating must be between 1 and 10");
    }

    return this.playerRatingRepo.upsertRating(data);
    }

    // Delete ratings by game and user
    async deleteRatingsByPlayerGame(playerId: string, gameId: string) {
        return this.playerRatingRepo.deleteByPlayerGameUser(playerId, gameId);
    }

    // Get ratings for a specific game
    async getRatingsByGame(gameId: string) {
        return this.playerRatingRepo.findByGame(gameId);
    }

    // Get ratings for a specific player
    async getRatingsByPlayer(playerId: string) {
        return this.playerRatingRepo.findByPlayer(playerId);
    }

    // Get top players leaderboard
    async getLeaderboard(limit = 5, gameId: string) {
        return this.playerRatingRepo.getLeaderboardByGame(gameId, limit);
    }

    async getUserPlayerRating(userId: string, gameId: string, playerId: string) {
        return this.playerRatingRepo.findByUserGamePlayer(userId, gameId, playerId);
    }
    
}
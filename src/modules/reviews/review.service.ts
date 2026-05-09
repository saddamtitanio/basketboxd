import { ReviewRepository } from "./review.repository";
import { PlayerRatingRepository } from "@/src/modules/player-ratings/player-rating.repository";


export class ReviewService {
    private reviewRepository: ReviewRepository;
    private playerRatingRepository: PlayerRatingRepository;

    constructor() {
        this.reviewRepository = new ReviewRepository();
        this.playerRatingRepository = new PlayerRatingRepository();
    }

    /* Submit full game review */
    async submitReview(data: {
        user_id: string;
        game_id: string;
        rating: number;
        review_text: string;

        player_ratings: {
            player_id: string;
            rating: number;
        }[];
    }) {
        // prevent duplicate reviews
        const existingReview =
        await this.reviewRepository.findExistingReview(
            data.user_id,
            data.game_id
        );

        if (existingReview) {
        throw new Error("You already reviewed this game");
        }

        // validate game rating
        if (data.rating < 0 || data.rating > 5) {
            throw new Error("Game rating must be between 0 and 5");
        }

        // validate player ratings
        for (const player of data.player_ratings) {
        if (player.rating < 1 || player.rating > 10) {
            throw new Error("Player ratings must be between 1 and 10");
        }
        }

        // create review
        const review =
        await this.reviewRepository.create({
            user_id: data.user_id,
            game_id: data.game_id,
            rating: data.rating,
            review_text: data.review_text,
        });

        // create player ratings
        const playerRatings = [];

        for (const player of data.player_ratings) {
            const playerRating = await this.playerRatingRepository.create({
                user_id: data.user_id,
                game_id: data.game_id,
                player_id: player.player_id,
                rating: player.rating        
            });
            playerRatings.push(playerRating);
        }

        return {
            success: true,
            review,
            playerRatings,
        };
    }

    /* Get reviews for game */
    async getGameReviews(gameId: string) {
        return this.reviewRepository.findByGame(gameId);
    }

    async getReview(reviewId: string) {
        const review = await this.reviewRepository.findById(reviewId);
        if (!review) {
            throw new Error("Review not found");
        }

        const playerRatings = await this.playerRatingRepository.findByUserAndGame(
            review.user_id,
            review.game_id
        );

        return {
            ...review,
            player_ratings: playerRatings
        };
    }

    async updateReview(
        reviewId: string,
        data: {
            rating?: number;
            review_text?: string;
            player_ratings?: {
                player_id: string;
                rating: number;
            }[];
        }
    ) {
        // Find existing review
        const existingReview = await this.reviewRepository.findById(reviewId);
        if (!existingReview) {
            throw new Error("Review not found");
        }

        // Validate game rating
        if (data.rating !== undefined) {
            if (data.rating < 0 || data.rating > 5) {
                throw new Error("Game rating must be between 0 and 5");
            }
        }

        // Validate player ratings if provided
        if (data.player_ratings) {
            for (const player of data.player_ratings) {
                if (player.rating < 1 || player.rating > 10) {
                    throw new Error("Player ratings must be between 1 and 10");
                }
            }
        }

        // Update the main review
        const updatedReview = await this.reviewRepository.update(reviewId, {
            rating: data.rating,
            review_text: data.review_text,
        });

        // Update player ratings if provided
        const updatedPlayerRatings = [];
        if (data.player_ratings) {
            for (const player of data.player_ratings) {
                // Check if rating already exists for this user/game/player
                const existingPlayerRating = await this.playerRatingRepository.findByUserGamePlayer(
                    existingReview.user_id,
                    existingReview.game_id,
                    player.player_id
                );

                let updatedPlayer;
                if (existingPlayerRating) {
                    // Update existing
                    updatedPlayer = await this.playerRatingRepository.update(
                        existingPlayerRating.id,
                        { rating: player.rating }
                    );
                } else {
                    // Create new
                    updatedPlayer = await this.playerRatingRepository.create({
                        user_id: existingReview.user_id,
                        game_id: existingReview.game_id,
                        player_id: player.player_id,
                        rating: player.rating
                    });
                }

                updatedPlayerRatings.push(updatedPlayer);
            }
        }

        // Return updated review and player ratings
        return {
            success: true,
            review: updatedReview,
            playerRatings: updatedPlayerRatings,
        };
    }

    async getUserReviews(userId: string) {
        return this.reviewRepository.findByUser(userId);
    }
    
    async likeReview(reviewId: string) {
        return this.reviewRepository.incrementLikes(reviewId);
    }

    async unlikeReview(reviewId: string) {
        return this.reviewRepository.decrementLikes(reviewId);
    }

    async deleteReview(reviewId: string) {
        // Find existing review
        const existingReview = await this.reviewRepository.findById(reviewId);
        if (!existingReview) {
            throw new Error("Review not found");
        }

        // Delete associated player ratings
        await this.playerRatingRepository.deleteByGameAndUser(
            existingReview.game_id,
            existingReview.user_id
        );

        // Delete the review
        return this.reviewRepository.delete(reviewId);
    }
}
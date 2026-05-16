import { ReviewRepository } from "./review.repository";

export class ReviewService {
    private reviewRepository: ReviewRepository;

    constructor() {
        this.reviewRepository = new ReviewRepository();
    }

    /* Submit full game review */
    async submitReview(data: {
        game_id: string;
        rating: number;
        review_text: string;
        user_id: string;
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

        // create review
        const review =
        await this.reviewRepository.create({
            user_id: data.user_id,
            game_id: data.game_id,
            rating: data.rating,
            review_text: data.review_text,
        });


        return {
            success: true,
            review
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

        return {
            ...review,
        };
    }

    async updateReview(
        reviewId: string,
        userId: string,
        data: {
            rating?: number;
            review_text?: string;
        }
    ) {
        // Validate game rating
        if (data.rating !== undefined && (data.rating < 0 || data.rating > 5)) {
            throw new Error("Game rating must be between 0 and 5");
        }

        // Find existing review
        const existingReview = await this.reviewRepository.findById(reviewId);
        if (!existingReview) {
            throw new Error("Review not found");
        }
        if (existingReview.user_id !== userId) {
            throw new Error("Unauthorized");
        }

        // Update the main review
        const updatedReview = await this.reviewRepository.update(reviewId, {
            rating: data.rating,
            review_text: data.review_text,
        });


        // Return updated review and player ratings
        return {
            success: true,
            review: updatedReview
        };
    }

    async getUserReviews(userId: string) {
        return this.reviewRepository.findByUser(userId);
    }
    
    async likeReview(reviewId: string, userId: string) {
        return this.reviewRepository.incrementLikes(reviewId, userId);
    }

    async unlikeReview(reviewId: string, userId: string) {
        return this.reviewRepository.decrementLikes(reviewId, userId);
    }

    async deleteReview(reviewId: string, userId: string) {
        // Find existing review
        const existingReview = await this.reviewRepository.findById(reviewId);
        if (!existingReview) {
            throw new Error("Review not found");
        }
        if (existingReview.user_id !== userId) {
            throw new Error("Unauthorized");
        }

        // Delete the review
        return this.reviewRepository.delete(reviewId);
    }
}
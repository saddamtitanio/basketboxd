import { NextRequest, NextResponse } from "next/server";
import { ReviewService } from "@/src/modules/reviews/review.service";

const reviewService = new ReviewService();

// GET /api/games/:id/reviews --- Get reviews for a specific game
export async function GET(req: NextRequest, 
    { params }: { params: Promise<{ id: string; }> }
) {
    const { id: gameId } = await params;
    try {
        const reviews = await reviewService.getGameReviews(gameId);
        return NextResponse.json(reviews);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/games/:id/reviews --- Submit a new review for a specific game
export async function POST(req: NextRequest, 
    { params }: { params: Promise<{ id: string; }> }
) {
    const { id: gameId } = await params;
    try {
        const data = await req.json();
        const result = await reviewService.submitReview({
            ...data,
            game_id: gameId
        });
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
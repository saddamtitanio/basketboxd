import { NextRequest, NextResponse } from "next/server";
import { ReviewService } from "@/src/modules/reviews/review.service";
import { createClient } from "@/src/app/lib/supabase/server";

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
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) { 
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const data = await req.json();
        const result = await reviewService.submitReview({
            ...data,
            game_id: gameId,
            user_id: user.id
        });
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
import { NextRequest, NextResponse } from "next/server";
import { ReviewService } from "@/src/modules/reviews/review.service";
import { createClient } from "@/src/app/lib/supabase/server";

const reviewService = new ReviewService();

// GET /api/games/:id/reviews --- Get detailed reviews for a specific game
export async function GET(req: NextRequest, 
    { params }: { params: Promise<{ id: string; reviewId: string }> }
) {
    const { id: gameId, reviewId } = await params;

    try {
        const reviews = await reviewService.getReview(reviewId);
        return NextResponse.json(reviews);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATH /api/games/:id/reviews/:reviewId --- Update a specific review
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; reviewId: string }> }
) {
    const { id: gameId, reviewId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { 
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const data = await req.json();
        const result = await reviewService.updateReview(reviewId, user.id, data);
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

// DELETE /api/games/:id/reviews/:reviewId --- Delete a specific review
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; reviewId: string }> }
) {
    const { reviewId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { 
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        await reviewService.deleteReview(reviewId, user.id);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}

// PUT /api/games/:id/reviews/:reviewId --- Like or unlike a specific review
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; reviewId: string }> }
) {
    const { reviewId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { 
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { action } = await req.json();
        let result;

        if (action === "like") {
            result = await reviewService.likeReview(reviewId, user.id);
        } else if (action === "unlike") {
            result = await reviewService.unlikeReview(reviewId, user.id);
        } else {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            liked: action === 'like',
            likes_count: result.likes_count,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
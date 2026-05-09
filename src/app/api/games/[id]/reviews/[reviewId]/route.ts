import { NextRequest, NextResponse } from "next/server";
import { ReviewService } from "@/src/modules/reviews/review.service";

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

    try {
        const data = await req.json();
        const result = await reviewService.updateReview(reviewId, data);
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

    try {
        await reviewService.deleteReview(reviewId);
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

    try {
        const { action } = await req.json();
        let result;

        if (action === "like") {
            result = await reviewService.likeReview(reviewId);
        } else if (action === "unlike") {
            result = await reviewService.unlikeReview(reviewId);
        } else {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
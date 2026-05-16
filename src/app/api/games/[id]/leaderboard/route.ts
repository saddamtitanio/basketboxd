import { NextRequest, NextResponse } from "next/server";
import { PlayerRatingService } from '@/src/modules/player-ratings/player-rating.service';

const playerRatingService = new PlayerRatingService();
// GET /api/games/:id/leaderboard --- Get the leaderboard for a specific game
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }

) {
    const { id: gameId } = await params;
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get('limit') || 5);

    try {
        // Fetch all player ratings for this game
        const leaderboard = await playerRatingService.getLeaderboard(limit, gameId);

        return NextResponse.json(leaderboard);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
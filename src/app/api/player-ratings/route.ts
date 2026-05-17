import { NextRequest, NextResponse } from 'next/server';
import { PlayerRatingService } from '@/src/modules/player-ratings/player-rating.service';

const playerRatingService = new PlayerRatingService();

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('user_id');
        const gameId = searchParams.get('game_id');
        const playerIds = searchParams.get('player_ids');

        if (!userId || !gameId || !playerIds) {
            return NextResponse.json({ error: 'Missing query params' }, { status: 400 });
        }

        const ids = playerIds.split(',').filter(Boolean);
        if (ids.length === 0) return NextResponse.json({});

        // Fetch all ratings for this user and game in one query
        const result = await playerRatingService.getBatchRatings(userId, gameId, ids);
        return NextResponse.json(result);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
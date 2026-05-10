import { NextRequest, NextResponse } from 'next/server';
import { PlayerRatingService } from '@/src/modules/player-ratings/player-rating.service';

const playerRatingService = new PlayerRatingService();

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const result = await playerRatingService.submitRating({
            user_id: body.user_id,
            game_id: body.game_id,
            player_id: body.player_id,
            rating: body.rating,
        });

        return NextResponse.json(result);

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 400 }
        );
    }
}
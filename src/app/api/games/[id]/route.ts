import { GameService } from "@/src/modules/games/game.service";
import { NextRequest, NextResponse } from "next/server";

const gameService = new GameService();

// GET /api/games/:id --- Get details of a specific game
export async function GET(req: NextRequest, 
    { params }: { params: Promise<{ id: string }> 
}) {
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: "Game ID is required" }, { status: 400 });
    }

    try {
        const game = await gameService.getGameById(id);

        if (!game) {
            return NextResponse.json({ error: "Game not found" }, { status: 404 });
        }

        return NextResponse.json(game);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
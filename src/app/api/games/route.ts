import { NextRequest, NextResponse } from "next/server";
import { GameService } from "@/src/modules/games/game.service";

const gameService = new GameService();

// GET /api/games --- Get a list of games with optional filters
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const filters = {
        query: searchParams.get("query") ?? undefined,
        season: searchParams.get("season") ?? undefined,
        teamId: searchParams.get("teamId") ?? undefined,
        arena: searchParams.get("arena") ?? undefined,
        date: searchParams.get("date") ?? undefined,
        startDate: searchParams.get("startDate") ?? undefined,
        endDate: searchParams.get("endDate") ?? undefined,
        status: searchParams.get("status") ?? undefined,
    };

    const dateFields = ["date", "startDate", "endDate"] as const;
    for (const field of dateFields) {
        if (filters[field] && isNaN(new Date(filters[field]!).getTime())) {
            return NextResponse.json({ error: `Invalid ${field} format` }, { status: 400 });
        }
    }

    try {
        const games = await gameService.getGames(filters);
        return NextResponse.json(games);
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
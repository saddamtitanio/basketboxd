import { NextRequest, NextResponse } from "next/server";
import { GameService } from "@/src/modules/games/game.service";

const gameService = new GameService();

// GET /api/games --- Get all games or search/filter games based on query parameters
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const searchQuery = searchParams.get("query");
    const season = searchParams.get("season");
    const teamId = searchParams.get("teamId");

    try {
        if (searchQuery) {
            const games = await gameService.searchGames(searchQuery);
            return NextResponse.json(games);
        }

        if (season) {
            const games = await gameService.getGamesBySeason(season);
            return NextResponse.json(games);
        }

        if (teamId) {
            const games = await gameService.getGamesByTeam(teamId);
            return NextResponse.json(games);
        }

        // Default (return all games)
        const games = await gameService.getAllGames();
        return NextResponse.json(games);

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
import { NextResponse } from "next/server";
import { createClient } from "@/src/app/lib/supabase/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
        return NextResponse.json({ games: [], profiles: [], reviews: [] });
    }

    const supabase = await createClient();

    const [gamesRes, profilesRes, reviewsRes] = await Promise.all([
        supabase
            .from("games")
            .select(`
                id, game_date, season, arena, status, home_score, away_score,
                home_team:teams!games_home_team_id_fkey (id, name, city, abbreviation, logo_url),
                away_team:teams!games_away_team_id_fkey (id, name, city, abbreviation, logo_url)
            `)
            .or(`arena.ilike.%${query}%`)
            .limit(5),

        supabase
            .from("profiles")
            .select("id, username, display_name, avatar_url")
            .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
            .limit(5),

        supabase
            .from("reviews")
            .select(`
                id, review_text, rating, created_at,
                user:profiles!reviews_user_id_fkey (id, username, display_name, avatar_url),
                game:games!reviews_game_id_fkey (
                    id,
                    home_team:teams!games_home_team_id_fkey (name, abbreviation),
                    away_team:teams!games_away_team_id_fkey (name, abbreviation)
                )
            `)
            .ilike("review_text", `%${query}%`)
            .limit(5),
    ]);

    const { data: teamMatches } = await supabase
        .from("teams")
        .select("id")
        .or(`name.ilike.%${query}%,city.ilike.%${query}%`);

    const teamIds = (teamMatches ?? []).map((t: { id: string }) => t.id);

    let extraGames: any[] = [];
    if (teamIds.length > 0) {
        const { data } = await supabase
            .from("games")
            .select(`
                id, game_date, season, arena, status, home_score, away_score,
                home_team:teams!games_home_team_id_fkey (id, name, city, abbreviation, logo_url),
                away_team:teams!games_away_team_id_fkey (id, name, city, abbreviation, logo_url)
            `)
            .or(`home_team_id.in.(${teamIds.join(",")}),away_team_id.in.(${teamIds.join(",")})`)
            .limit(5);
        extraGames = data ?? [];
    }

    const gamesMap = new Map<string, any>();
    [...(gamesRes.data ?? []), ...extraGames].forEach((g) => gamesMap.set(g.id, g));

    return NextResponse.json({
        games:    [...gamesMap.values()].slice(0, 5),
        profiles: profilesRes.data ?? [],
        reviews:  reviewsRes.data ?? [],
    });
}
// src/app/api/users/[userId]/follow/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/src/app/lib/supabase/server";
import { FollowService } from "@/src/modules/follows/follow-service";

const followService = new FollowService();

// GET /api/users/[userId]/follow --- check follow status and counts
export async function GET(req: NextRequest, 
        { params }: { params: Promise<{ id: string }> }
) {
    const { id: userId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    try {
        const [followers, following] = await Promise.all([
            followService.getFollowers(userId),
            followService.getFollowing(userId),
        ]);

        const isFollowing = user
            ? await followService.isFollowing(user.id, userId)
            : false;

        return NextResponse.json({ followers, following, isFollowing });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/users/[userId]/follow --- follow a user
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: userId } = await params;
    const supabase = await createClient();
    
    await supabase.auth.signInWithPassword({
        email: process.env.TEMP_USER_EMAIL!,
        password: process.env.TEMP_USER_PASSWORD!
    });

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const result = await followService.follow(user.id, userId);
        return NextResponse.json(result, { status: 201 });
    } catch (error: any) {
        const status = error.message === "Already following this user" ? 409 : 500;
        return NextResponse.json({ error: error.message }, { status });
    }
}

// DELETE /api/users/[userId]/follow --- unfollow a user
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: userId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        await followService.unfollow(user.id, userId);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        const status = error.message === "You are not following this user" ? 404 : 500;
        return NextResponse.json({ error: error.message }, { status });
    }
}
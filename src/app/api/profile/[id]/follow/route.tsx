import { NextResponse } from "next/server";
import { createClient } from "@/src/app/lib/supabase/server";
import { UsersService } from "@/src/modules/users/users.service";

type Params = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: Params) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const service = await UsersService.create();
        
        const targetId = await service.getProfileById(id);
        if (!targetId) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }
        if (targetId.id === user.id) {
            return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 });
        }
        const result = await service.follow(user.id, targetId.id);

        return NextResponse.json({ success: true, result });
    } catch (err: any) {
        const status = err.message === "Profile not found" ? 404 : 400;

        return NextResponse.json({ error: err.message }, { status });
    }
}

export async function DELETE(_req: Request, { params }: Params) {
    try {
        const { id } = await params;
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const service = await UsersService.create();

        const targetId = await service.getProfileById(id);

        if (!targetId) {
            return NextResponse.json({ error: "Profile not found" }, { status: 404 });
        }

        const result = await service.unfollow(user.id, targetId.id)

        return NextResponse.json({ success: true, result });
    } catch (err: any) {
        const status = err.message === "Profile not found" ? 404 : 400;

        return NextResponse.json({ error: err.message }, { status });
    }
}
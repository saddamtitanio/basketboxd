import { NextResponse } from "next/server";
import { UsersService } from "@/src/modules/users/users.service";

type Params = { params: Promise<{ username: string }> };

export async function GET(_req: Request, { params }: Params) {
    try {
        const { username } = await params;

        const service = await UsersService.create();

        const data = await service.getFollowing(username);

        return NextResponse.json(data);

    } catch (err: any) {
        return NextResponse.json(
            { error: err.message },
            { status: err.message === "Profile not found" ? 404 : 400 }
        );
    }
}
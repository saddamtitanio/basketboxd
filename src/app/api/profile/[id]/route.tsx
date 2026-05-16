import { NextResponse } from "next/server";
import { UsersService } from "@/src/modules/users/users.service";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
    const { id } = await params;

    const service = await UsersService.create();

    try {
        const data = await service.getProfilePage(id);
        return NextResponse.json(data);
    } catch (err: any) {
        return NextResponse.json(
            { error: err.message },
            { status: 404 }
        );
    }
}
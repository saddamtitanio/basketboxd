import { UsersService } from "@/src/modules/users/users.service";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const usersService =
            await UsersService.create();

        const data =
            await usersService.getProfileById(id);

        return Response.json(data);

    } catch (error: any) {
        console.error(error);

        return Response.json(
            { error: error.message },
            { status: 400 }
        );
    }
}
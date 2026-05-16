import { UsersService } from "@/src/modules/users/users.service";

export async function GET() {
    try {
        const usersService =
            await UsersService.create();

        const data =
            await usersService.getMyProfile();

        return Response.json(data);

    } catch (error: any) {
        console.error(error);

        return Response.json(
            { error: error.message },
            { status: 401 }
        );
    }
}
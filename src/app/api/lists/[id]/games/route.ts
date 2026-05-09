import { ListsService } from "@/src/app/modules/lists/lists.service";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const service =
            await ListsService.create();

        const data =
            await service.getGamesInList(id);

        return Response.json(data);

    } catch (error: any) {
        return Response.json(
            { error: error.message },
            { status: 400 }
        );
    }
}

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const { gameId } =
            await request.json();

        const service =
            await ListsService.create();

        const data =
            await service.addGameToList(
                id,
                gameId
            );

        return Response.json(data);

    } catch (error: any) {
        return Response.json(
            { error: error.message },
            { status: 400 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const { gameId } =
            await request.json();

        const service =
            await ListsService.create();

        const data =
            await service.removeGameFromList(
                id,
                gameId
            );

        return Response.json(data);

    } catch (error: any) {
        return Response.json(
            { error: error.message },
            { status: 400 }
        );
    }
}
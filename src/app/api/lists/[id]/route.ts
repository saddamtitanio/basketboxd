import { ListsService } from "@/src/modules/lists/lists.service";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const service = await ListsService.create();

        const data = await service.getListById(id);

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

        const service =
            await ListsService.create();

        const data =
            await service.deleteList(id);

        return Response.json(data);

    } catch (error: any) {
        return Response.json(
            { error: error.message },
            { status: 400 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }  
) {
    try {
        const { id } = await params;

        const body = await request.json()
        const service = await ListsService.create();
        const data = await service.updateList(id, body)

        return Response.json(data);
    } catch (error: any) {
        return Response.json(
            { error: error.message },
            { status: 400 }
        );
    }
}
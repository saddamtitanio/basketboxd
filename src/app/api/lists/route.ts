import { ListsService } from "@/src/modules/lists/lists.service";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const service =
            await ListsService.create();

        const data =
            await service.createList(body);

        return Response.json(data);

    } catch (error: any) {
        return Response.json(
            { error: error.message },
            { status: 400 }
        );
    }
}
import { ListsService } from "@/src/app/modules/lists/lists.service";

export async function GET() {
    try {
        const service =
            await ListsService.create();

        const data =
            await service.getPublicLists();

        return Response.json(data);

    } catch (error: any) {
        return Response.json(
            { error: error.message },
            { status: 400 }
        );
    }
}
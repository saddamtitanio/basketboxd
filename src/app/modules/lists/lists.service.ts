import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ListsRepository } from "./lists.repository";

export class ListsService {
    private repository;

    private constructor(repository: ListsRepository) {
        this.repository = repository;
    }

    static async create() {
        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
            {
                cookies: {
                    getAll() {
                        return cookieStore.getAll();
                    },

                    setAll(cookiesToSet) {
                        cookiesToSet.forEach(
                            ({ name, value, options }) =>
                                cookieStore.set(
                                    name,
                                    value,
                                    options
                                )
                        );
                    },
                },
            }
        );

        return new ListsService(
            new ListsRepository(supabase)
        );
    }

    async verifyOwnership(
        listId: string,
        userId: string
    ) {
        const { data } =
            await this.repository.getListById(
                listId
            );

        if (!data) {
            throw new Error("List not found");
        }

        if (data.user_id !== userId) {
            throw new Error("Unauthorized");
        }

        return data;
    }

    async createList(body: any) {
        const {
            data: { user },
        } = await this.repository.getUser();

        if (!user) {
            throw new Error("Unauthorized");
        }

        const { data, error } =
            await this.repository.createList({
                user_id: user.id,
                title: body.title,
                description: body.description,
                is_public: body.is_public,
                type: body.type,
            });

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async getMyLists() {
        const {
            data: { user },
        } = await this.repository.getUser();

        if (!user) {
            throw new Error("Unauthorized");
        }

        const { data, error } =
            await this.repository.getMyLists(
                user.id
            );

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async getPublicLists() {
        const { data, error } =
            await this.repository.getPublicLists();

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async getListById(id: string) {
        const {
            data: { user },
        } = await this.repository.getUser();

        const { data, error } =
            await this.repository.getListById(id);

        if (error) {
            throw new Error(error.message);
        }

        if (!data.is_public) {
            if (!user || user.id !== data.user_id) {
                throw new Error("Unauthorized");
            }
        }

        return data;
    }

    async deleteList(id: string) {
        const {
            data: { user },
        } = await this.repository.getUser();

        if (!user) {
            throw new Error("Unauthorized");
        }

        await this.verifyOwnership(
            id,
            user.id
        );

        const { error } =
            await this.repository.deleteList(id);

        if (error) {
            throw new Error(error.message);
        }

        return {
            success: true,
        };
    }

    async addGameToList(
        listId: string,
        gameId: number
    ) {
        const {
            data: { user },
        } = await this.repository.getUser();

        if (!user) {
            throw new Error("Unauthorized");
        }

        await this.verifyOwnership(
            listId,
            user.id
        );

        const { error } =
            await this.repository.addGameToList(
                listId,
                gameId
            );

        if (error) {
            throw new Error(error.message);
        }

        return {
            success: true,
        };
    }

    async removeGameFromList(
        listId: string,
        gameId: number
    ) {
        const {
            data: { user },
        } = await this.repository.getUser();

        if (!user) {
            throw new Error("Unauthorized");
        }

        await this.verifyOwnership(
            listId,
            user.id
        );

        const { error } =
            await this.repository.removeGameFromList(
                listId,
                gameId
            );

        if (error) {
            throw new Error(error.message);
        }

        return {
            success: true,
        };
    }

    async getGamesInList(listId: string) {
        const { data, error } =
            await this.repository.getGamesInList(
                listId
            );

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }
}
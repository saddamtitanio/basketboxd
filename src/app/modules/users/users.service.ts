import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { UsersRepository } from "./users.repository";

export class UsersService {
    private repository;

    private constructor(repository: UsersRepository) {
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

        const repository =
            new UsersRepository(supabase);

        return new UsersService(repository);
    }

    async getProfileById(userId: string) {
        const { data, error } =
            await this.repository.getProfileById(
                userId
            );

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async getMyProfile() {
        const {
            data: { user },
            error,
        } = await this.repository.getUser();
    
        if (error || !user) {
            throw new Error("Unauthorized");
        }
    
        const {
            data: profile,
            error: profileError,
        } = await this.repository.getProfileById(
            user.id
        );
    
        if (profileError) {
            throw new Error(profileError.message);
        }
    
        return profile;
    }
}
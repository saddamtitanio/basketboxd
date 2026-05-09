import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { AuthRepository } from "./auth.repository";

export class AuthService {
    private repository;

    private constructor(repository: AuthRepository) {
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
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    },
                },
            }
        );

        const repository = new AuthRepository(supabase);

        return new AuthService(repository);
    }

    async register(data: {
        email: string;
        password: string;
        display_name: string;
        username: string;
        avatar_url?: string;
    }) {
        const { data: authData, error } =
            await this.repository.signUp(
                data.email,
                data.password
            );
    
        if (error) {
            throw new Error(error.message);
        }
        
    
        if (!authData.user) {
            throw new Error("User creation failed");
        }
    
        const { error: profileError } =
            await this.repository.updateProfile(
                authData.user.id,
                {
                    display_name: data.display_name,
                    username: data.username,
                    avatar_url: data.avatar_url,
                }
            );
    
        if (profileError) {
            throw new Error(profileError.message);
        }
    
        return authData;
    }
    

    async login(email: string, password: string) {
        const { data, error } =
            await this.repository.login(email, password);

        if (error) {
            throw new Error(error.message);
        }

        return data;
    }

    async updateProfile(body: any) {
        const {
            data: { user },
            error: authError,
        } = await this.repository.getUser();

        if (authError || !user) {
            throw new Error("Unauthorized");
        }

        const profileUpdate: Record<string, any> = {};

        if (body.display_name !== undefined)
            profileUpdate.display_name = body.display_name;

        if (body.username !== undefined)
            profileUpdate.username = body.username;

        if (body.avatar_url !== undefined)
            profileUpdate.avatar_url = body.avatar_url;

        if (body.bio !== undefined)
            profileUpdate.bio = body.bio;

        const { data: existingProfile } =
            await this.repository.getProfile(user.id);

        if (!existingProfile) {
            throw new Error("Profile not found");
        }

        const { data, error } =
            await this.repository.updateProfile(
                user.id,
                profileUpdate
            );

        if (error) {
            throw new Error(error.message);
        }

        const authUpdate: {
            email?: string;
            password?: string;
        } = {};

        if (body.email)
            authUpdate.email = body.email;

        if (body.password)
            authUpdate.password = body.password;

        if (Object.keys(authUpdate).length > 0) {
            const { error: authUpdateError } =
                await this.repository.updateAuth(authUpdate);

            if (authUpdateError) {
                throw new Error(authUpdateError.message);
            }
        }

        return {
            success: true,
            profile: data,
        };
    }
}
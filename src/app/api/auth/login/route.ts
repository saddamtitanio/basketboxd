import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
        );

        const { email, password } = await request.json();

        const { data, error } =
            await supabase.auth.signInWithPassword({
                email,
                password,
            });

        if (error) {
            return Response.json(
                { error: error.message },
                { status: 400 }
            );
        }

        return Response.json(data);

    } catch (error) {
        console.error(error);

        return Response.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
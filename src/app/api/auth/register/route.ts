import { AuthService } from '@/src/app/modules/auth/auth.service';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if(!body.password){
            return Response.json(
                { error: "Password is required" },
                { status: 400 }
            );
        }

        if(!body.email) {
            return Response.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        if(!body.username) {
            return Response.json(
                { error: "Username is required" },
                { status: 400 }
            );
        }

        const authService = await AuthService.create();

        const data = await authService.register(body);

        return Response.json(data);

    } catch (error: any) {
        console.error(error);

        return Response.json(
            { error: error.message },
            { status: 400 }
        );
    }
}
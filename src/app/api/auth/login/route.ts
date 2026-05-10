import { AuthService } from '@/src/modules/auth/auth.service';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        const authService = await AuthService.create();

        const data = await authService.login(
            email,
            password
        );

        return Response.json(data);

    } catch (error: any) {
        console.error(error);

        return Response.json(
            { error: error.message },
            { status: 400 }
        );
    }
}
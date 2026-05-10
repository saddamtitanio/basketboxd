import { AuthService } from '@/src/modules/auth/auth.service';

export async function PUT(request: Request) {
    try {
        const body = await request.json();

        const authService = await AuthService.create();

        const data = await authService.updateProfile(body);

        return Response.json(data);

    } catch (error: any) {
        console.error(error);

        return Response.json(
            { error: error.message },
            { status: 400 }
        );
    }
}
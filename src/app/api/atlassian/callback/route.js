import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers'

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const cookieStore = await cookies()

  if (!code) {
    return NextResponse.json({ error: 'No se encontró el parámetro "code"' }, { status: 400 });
  }

  try {
    // 2. Intercambiar el code por el token en Atlassian
    const tokenResponse = await axios.post(
      'https://auth.atlassian.com/oauth/token',
      {
        grant_type: 'authorization_code',
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const { access_token, expires_in } = tokenResponse.data;

    // 3. Guardar el token en una cookie HTTP-only (más seguro)
    const response = NextResponse.redirect(new URL('/dashboard', request.url)); 
    cookieStore.set({
      name: 'atl_token',
      value: access_token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: expires_in,
    })

    return response;
  } catch (error) {
    console.error('Error al obtener token:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Hubo un problema al intercambiar el code por el token' }, { status: 500 });
  }
}

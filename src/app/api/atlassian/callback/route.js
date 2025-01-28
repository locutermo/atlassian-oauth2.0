import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  // 1. Obtener el `code` y `state` del query
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code) {
    return NextResponse.json({ error: 'No se encontró el parámetro "code"' }, { status: 400 });
  }

  try {
    // 2. Intercambiar el code por el token en Atlassian
    const tokenResponse = await axios.post(
      'https://auth.atlassian.com/oauth/token',
      {
        grant_type: 'authorization_code',
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID, // Se expone en front, aunque sea "menos ideal"
        client_secret: process.env.CLIENT_SECRET,     // Mantener privado en tu .env
        code,
        redirect_uri: 'http://localhost:3000/api/atlassian/callback',
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const { access_token, expires_in } = tokenResponse.data;

    // 3. Guardar el token en una cookie HTTP-only (más seguro)
    const response = NextResponse.redirect(new URL('/dashboard', request.url)); 
    // O: NextResponse.redirect('http://localhost:3000/dashboard');

    // setCookie(name, value, options)
    // maxAge se expresa en segundos
    response.cookies.set('atl_token', access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: expires_in, // normalmente ~3600 segundos
    });

    return response;
  } catch (error) {
    console.error('Error al obtener token:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Hubo un problema al intercambiar el code por el token' }, { status: 500 });
  }
}

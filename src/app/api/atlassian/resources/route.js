import { NextResponse } from 'next/server';
import axios from 'axios';
import { cookies } from 'next/headers'

export async function GET(request) {
  // 1. Obtener la cookie con el token
  const cookieStore = await cookies()
  const atlToken = cookieStore.get('atl_token').value

  if (!atlToken) {
    return NextResponse.json({ error: 'No se encontró el token en cookies' }, { status: 401 });
  }

  try {
    
    const url = 'https://api.atlassian.com/oauth/token/accessible-resources';

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${atlToken}`,
        'Accept': 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error al llamar a Jira:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Error llamando a la API de Jira' }, { status: 500 });
  }
}


import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  // 1. Obtener la cookie con el token
  const cookieHeader = request.headers.get('cookie') || '';
  const tokenMatch = cookieHeader
    .split(';')
    .map(v => v.trim())
    .find(v => v.startsWith('atl_token='));

  if (!tokenMatch) {
    return NextResponse.json({ error: 'No se encontró el token en cookies' }, { status: 401 });
  }

  const atlToken = tokenMatch.split('=')[1];

  try {
    
    const url = 'https://api.atlassian.com/oauth/token/accessible-resources';

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${atlToken}`,
        'Accept': 'application/json',
      },
      // Si se necesita params: params: { jql: 'project=XYZ' },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error al llamar a Jira:', error.response?.data || error.message);
    return NextResponse.json({ error: 'Error llamando a la API de Jira' }, { status: 500 });
  }
}


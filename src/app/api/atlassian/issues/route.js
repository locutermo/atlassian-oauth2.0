import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(request) {
  // 1. Obtener la cookie con el token
  const cookieHeader = request.headers.get('cookie') || '';
  const searchParams = request.nextUrl.searchParams
  const cloudId = searchParams.get('cloud_id')
  const tokenMatch = cookieHeader
    .split(';')
    .map(v => v.trim())
    .find(v => v.startsWith('atl_token='));

  if (!tokenMatch) {
    return NextResponse.json({ error: 'No se encontró el token en cookies' }, { status: 401 });
  }

  const atlToken = tokenMatch.split('=')[1];

  try {

    
    const url = `https://api.atlassian.com/ex/jira/${cloudId}/rest/api/3/search?maxResults=1`;

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

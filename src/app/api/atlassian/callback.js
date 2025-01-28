import axios from 'axios';
import cookie from 'cookie';

export default async function handler(req, res) {
  const { code, state } = req.query;
  
  // Validar que existe code
  if (!code) {
    return res.status(400).json({ error: 'No se recibió el parámetro code' });
  }

  try {
    const tokenResponse = await axios.post(
      'https://auth.atlassian.com/oauth/token',
      {
        grant_type: 'authorization_code',
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,  // O lo tomas de config/variable que no sea pública
        client_secret: process.env.CLIENT_SECRET,      // importante usar la variable privada
        code: code,
        redirect_uri: process.env.REDIRECT_URI || 'http://localhost:3000/api/atlassian/callback',
      },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    // tokenData contendrá access_token, refresh_token, etc.
    const tokenData = tokenResponse.data;

    // Podrías guardarlo en una cookie, o redirigir a otra página del frontend, etc.
    // En este ejemplo, simplemente respondemos con el token:
    return res.status(200).json({
      message: 'Token obtenido correctamente',
      tokenData,
    });
  } catch (error) {
    console.error('Error al intercambiar el código:', error?.response?.data || error.message);
    return res.status(500).json({
      error: 'Hubo un problema al obtener el token',
      details: error?.response?.data || error.message,
    });
  }
}

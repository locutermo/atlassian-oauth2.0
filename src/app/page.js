'use client'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter();

  const handleAuth = () => {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    // NOTA: process.env.REDIRECT_URI no es "NEXT_PUBLIC", 
    // así que vendrá indefinido en el cliente. 
    // Si quisieras usar la misma en el frontend, tendrías que duplicarla 
    // como NEXT_PUBLIC_REDIRECT_URI o construir la URL manualmente.

    const stateValue = 'VALOR_UNICO'; // Podrías generar un estado dinámico.

    // Arma la URL de autorización
    const authorizationUrl =
      `https://auth.atlassian.com/authorize?audience=api.atlassian.com` +
      `&client_id=${clientId}` +
      `&scope=read%3Ajira-work` +
      `&redirect_uri=${encodeURIComponent("http://localhost:3000/api/atlassian/callback")}` +
      `&state=${encodeURIComponent(stateValue)}` +
      `&response_type=code` +
      `&prompt=consent`;

    // Redirige al usuario a la ventana de Atlassian

    router.push(authorizationUrl)
  };

  return (
    <div className='min-w-full min-h-screen flex items-center justify-center'>
      <div className="flex flex-col gap-4 text-center">
        <h1>Atlassian OAuth 2.0 con Next.js</h1>
        <button onClick={handleAuth} className="border-2 p-4 rounded-xl hover:font-extrabold">
          Iniciar autenticación con Atlassian
        </button>
      </div>
    </div>
  );
}

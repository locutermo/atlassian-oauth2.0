'use client'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter();

  const handleAuth = () => {
    const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
    const stateValue = 'VALOR_UNICO';
    const authorizationUrl =
      `https://auth.atlassian.com/authorize?audience=api.atlassian.com` +
      `&client_id=${clientId}` +
      `&scope=read%3Ajira-work` +
      `&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_REDIRECT_URI)}` +
      `&state=${encodeURIComponent(stateValue)}` +
      `&response_type=code` +
      `&prompt=consent`;

    router.push(authorizationUrl)
  };

  return (
    <div className='min-w-full min-h-screen flex items-center justify-center'>
      <div className="flex flex-col gap-4 text-center">
        <h1>Atlassian OAuth 2.0 (3LO)</h1>
        <button onClick={handleAuth} className="border-2 p-4 rounded-xl hover:font-extrabold">
          Log in with Atlassian
        </button>
      </div>
    </div>
  );
}

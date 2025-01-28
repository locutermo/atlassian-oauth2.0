'use client'
import React, { useEffect, useState } from 'react';

export default function Dashboard() {
    const [resources, setResource] = useState(null);
    const [issues, setIssues] = useState(null);

    useEffect(() => {
        fetch('/api/atlassian/resources')
            .then((res) => res.json())
            .then((data) => setResource(data))
            .catch((error) => console.error(error));
    }, []);

    const getIssues = async ({ id }) => {
        fetch('/api/atlassian/issues?cloud_id=' + id)
            .then((res) => res.json())
            .then((data) => setIssues(prevIssues => ({ ...prevIssues, [id]: data })))
            .catch((error) => console.error(error))
    }


    return (
        <div className='min-h-screen flex items-center justify-center my-20'>
            <div className="flex flex-col gap-4 w-1/2">
                <h2>Home</h2>
                {
                    resources && (<>
                        <h3>Recursos disponibles con mi token</h3>
                        <pre>{JSON.stringify(resources, null, 2)}</pre>
                    </>)
                }

                <div className="max-w-full overflow-x-auto">
                    <div className="whitespace-nowrap space-x-4 flex gap-4">

                        {resources && (
                            resources.map((resource, index) => (
                                <div key={index}>
                                    <button onClick={() => { getIssues(resource) }} className="border-2 p-4 rounded-xl hover:font-extrabold"> Obtener issues de {resource.url}</button>
                                    {issues && (
                                        <pre>{JSON.stringify(issues[resource.id], null, 2)}</pre>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}

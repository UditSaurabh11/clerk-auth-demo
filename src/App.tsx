import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { useAuth } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';
import { useState } from 'react';
import axios from "axios"

const App = () => {
    const { getToken, isSignedIn } = useAuth();
    const [error, setError] = useState()
    const [success, setSuccess] = useState()
    const { user } = useUser();
    console.log(isSignedIn)
    console.log(user)


    const fetchData = async () => {
        const query = `
    {
        page(id:"61576807405147") {
        name
        fan_count
    }
    }
    
`;
        const accessToken = await getToken(); // Gets JWT token
        console.log(accessToken)

        try {

            const pagesRes = await axios.get(`https://graph.facebook.com/v19.0/me/accounts`, {
                params: { access_token: accessToken },
            });
            console.log("pageres --->",pagesRes)
            const page = pagesRes.data.data[0];
            const pageToken = page.access_token;

            const formsRes = await axios.get(`https://graph.facebook.com/v19.0/${page.id}/leadgen_forms`, {
                params: { access_token: pageToken },
            });
            console.log("formres --->",pagesRes)    
            const formId = formsRes.data.data[0].id;
                  
            const leadsRes = await axios.get(`https://graph.facebook.com/v19.0/${formId}/leads`, {
                params: { access_token: pageToken },
            });
            console.log("leadsRes ---->",leadsRes)
            setSuccess(leadsRes.data)
        } catch (err) {
            console.log(err)
        }
        fetch('https://graph.facebook.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ query }),
        }).then(res => res.json())
            .then(data => {
                setSuccess(data)
                console.log(data)
            })
            .catch(err => {
                setError(error)
                console.error('Error:', err)
            });

    };




    return (
        <div>
            <h1 className="text-3xl font-bold underline">Social media signup example</h1>
            <button className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded m-2' onClick={fetchData}>Get Token</button>
            <header className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded m-2">
                <SignedOut>
                    <SignInButton />
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </header>
            {JSON.stringify(success)}
            {JSON.stringify(error)}
        </div>
    );
}

export default App
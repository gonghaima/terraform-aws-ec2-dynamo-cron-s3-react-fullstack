import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Main = () => {
    const [user, setUser] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [query, setQuery] = useState({ title: '', year: '', artist: '' });
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data and subscriptions
        // Example: setUser({ username: 'JohnDoe' });
        // Example: setSubscriptions([{ title: 'Song1', artist: 'Artist1', year: '2021', image_url: '...' }]);
    }, []);

    const handleQuery = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/music/query`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(query),
            });
            const data = await response.json();
            setResults(data);
        } catch (err) {
            console.error('An error occurred', err);
        }
    };

    const handleSubscribe = async (music) => {
        // Handle subscription logic
    };

    const handleRemove = async (music) => {
        // Handle removal logic
    };

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div>
            <h2>Main Page</h2>
            {user && <p>Welcome, {user.username}</p>}
            <button onClick={handleLogout}>Logout</button>
            <div>
                <h3>Subscriptions</h3>
                {subscriptions.map((music) => (
                    <div key={music.title}>
                        <p>{music.title} by {music.artist} ({music.year})</p>
                        <img src={music.image_url} alt={music.artist} />
                        <button onClick={() => handleRemove(music)}>Remove</button>
                    </div>
                ))}
            </div>
            <div>
                <h3>Query Music</h3>
                <form onSubmit={handleQuery}>
                    <div>
                        <label>Title:</label>
                        <input type="text" value={query.title} onChange={(e) => setQuery({ ...query, title: e.target.value })} />
                    </div>
                    <div>
                        <label>Year:</label>
                        <input type="text" value={query.year} onChange={(e) => setQuery({ ...query, year: e.target.value })} />
                    </div>
                    <div>
                        <label>Artist:</label>
                        <input type="text" value={query.artist} onChange={(e) => setQuery({ ...query, artist: e.target.value })} />
                    </div>
                    <button type="submit">Query</button>
                </form>
                {results.map((music) => (
                    <div key={music.title}>
                        <p>{music.title} by {music.artist} ({music.year})</p>
                        <img src={music.image_url} alt={music.artist} />
                        <button onClick={() => handleSubscribe(music)}>Subscribe</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Main;
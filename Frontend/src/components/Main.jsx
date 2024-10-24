import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Typography, Button, TextField, Box, Card, CardContent, CardMedia, Grid, AppBar, Toolbar, IconButton } from '@mui/material';

const Main = () => {
    const [user, setUser] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [query, setQuery] = useState({ title: '', year: '', artist: '' });
    const [results, setResults] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Get user data from location state
        const userData = location.state?.user;
        if (userData) {
            setUser(userData);
            fetchSubscriptions(userData.id);
        }
    }, [location.state]);

    const fetchSubscriptions = async (userId) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/${userId}`);
            const data = await response.json();
            setSubscriptions(data.subscriptionsData || []);
        } catch (err) {
            console.error('An error occurred', err);
        }
    };

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
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscriptions/add`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, musicId: music.id }),
            });
            if (response.ok) {
                fetchSubscriptions(user.id);
            }
        } catch (err) {
            console.error('An error occurred', err);
        }
    };

    const handleRemove = async (music) => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/subscriptions/remove`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, musicId: music.id }),
            });
            if (response.ok) {
                fetchSubscriptions(user.id);
            }
        } catch (err) {
            console.error('An error occurred', err);
        }
    };

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <Container maxWidth="md">
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        {user && (
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                                Welcome, {user.username}
                            </Typography>
                        )}
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>

                    </Typography>
                    <Button variant="contained" color="secondary" onClick={handleLogout}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Subscriptions
                </Typography>
                <Grid container spacing={2}>
                    {subscriptions.map((music) => (
                        <Grid item xs={12} sm={6} md={4} key={music.id}>
                            <Card>
                                <CardMedia component="img" height="140" image={music.img_url} alt={music.artist} />
                                <CardContent>
                                    <Typography variant="h6" component="p">
                                        {music.title} by {music.artist} ({music.year})
                                    </Typography>
                                    <Button variant="contained" color="secondary" onClick={() => handleRemove(music)} sx={{ mt: 2 }}>
                                        Remove
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                    Query Music
                </Typography>
                <form onSubmit={handleQuery}>
                    <TextField
                        label="Title"
                        value={query.title}
                        onChange={(e) => setQuery({ ...query, title: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Year"
                        value={query.year}
                        onChange={(e) => setQuery({ ...query, year: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Artist"
                        value={query.artist}
                        onChange={(e) => setQuery({ ...query, artist: e.target.value })}
                        fullWidth
                        margin="normal"
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                        Query
                    </Button>
                </form>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    {results.map((music) => (
                        <Grid item xs={12} sm={6} md={4} key={music.id}>
                            <Card>
                                <CardMedia component="img" height="140" image={music.img_url} alt={music.artist} />
                                <CardContent>
                                    <Typography variant="h6" component="p">
                                        {music.title} by {music.artist} ({music.year})
                                    </Typography>
                                    <Button variant="contained" color="primary" onClick={() => handleSubscribe(music)} sx={{ mt: 2 }}>
                                        Subscribe
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    );
};

export default Main;
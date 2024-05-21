const { response } = require('express');
const express = require('./node_modules/express');
const request = require('./node_modules/request');
const app = express();
const path = require('path');
const cookie = process.env.COOKIE;

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// New endpoint for serving documentation
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/key', (req, res) => {
    return res.send("success")
});

app.get('/getLyrics/:trackId', (req, res) => {
    request.get({
        url: process.env.TOKEN_URL,
        headers: {
            "Cookie": cookie,
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36"
        }
    }, (error, response, body) => {
        if (error) {
            console.log(error);
            console.log(respone);
            return res.status(500).send(error);
        }
        let json = JSON.parse(body);
        let clientId = json.clientId;
        let accessToken = json.accessToken;
        console.log(accessToken);

        request.get({
            url: process.env.LYRICS_BASE_URL + `${req.params.trackId}?format=json&vocalRemoval=false&market=from_token`,
            headers: {
                "app-platform": "WebPlayer",
                "Authorization": `Bearer ${accessToken}`
            }
        }, (error, response, body) => {
            if (error) {
                return res.status(500).send
            }
            console.log(response.body);
            res.send(JSON.stringify(JSON.parse(response.body), null, 2));
        });
    });
});

app.get('/getLyricsByName/:musician/:track', (req, res) => {
    // Your client ID and secret
    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

    // Encode the client ID and secret
    const encoded = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

    // Make a POST request to the Spotify token endpoint to get an access token
    request.post({
        url: process.env.SEARCH_TOKEN,
        headers: {
            'Authorization': `Basic ${encoded}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            grant_type: 'client_credentials'
        }
    }, (error, response, body) => {
        if (error) {
            return res.status(500).send(error);
        }

        // Parse the response body into JSON
        let json = JSON.parse(body);

        // Get the access token from the response
        let accessToken = json.access_token;

        // Build the Spotify API search URL with the musician and track name, and set the limit to 5
        const searchUrl = process.env.SEARCH_URL + `${req.params.musician}%20track:${req.params.track}&type=track&limit=10`;

        // Make a GET request to the Spotify API search URL
        request.get({
            url: searchUrl,
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }, (error, response, body) => {
            if (error) {
                return res.status(500).send(error);
            }

            // Parse the response body into JSON
            let json = JSON.parse(body);

            if (!json.tracks.items.length) {
                return res.status(404).send("No remix lyrics was found");
            }

            let realTrack;
            if (req.query.remix === 'true') {
                json.tracks.items =
                    json.tracks.items = json.tracks.items
                        .filter(track => track.name.toLowerCase().includes("remix"))
                        .sort((a, b) => b.popularity - a.popularity);
                if (json.tracks.items.length == 0) {
                    json.tracks.items = json.tracks.items
                        .filter(track => !track.name.toLowerCase().includes("remix"))
                        .sort((a, b) => b.popularity - a.popularity);
                }
            } else {
                json.tracks.items = json.tracks.items
                    .filter(track => !track.name.toLowerCase().includes("remix"))
                    .sort((a, b) => b.popularity - a.popularity);
            }
            realTrack = json.tracks.items.shift();
            if (realTrack) {
                console.log(realTrack.id);
                let trackId = realTrack.id;

                // Use the track ID to make a request to the initial route
                res.redirect(`/getLyrics/${trackId}`);
            } else {
                res.status(404).send("No Remix lyrics was found");
            }

        });
    });
});

module.exports = app;

app.listen(3000, () => {
    console.log('Server started on port 3000');
});

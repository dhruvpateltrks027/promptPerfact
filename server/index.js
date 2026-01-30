const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Route
app.post('/api/rephrase', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    try {
        const response = await axios.post('https://promptperfect.xyz/rephrase_extension',
            {
                text: text,
                userId: "",
                stripeCustomerId: ""
            },
            {
                headers: {
                    'accept': '*/*',
                    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8,hi;q=0.7',
                    'content-type': 'application/json',
                    'origin': 'https://chatgpt.com',
                    'priority': 'u=1, i',
                    'referer': 'https://chatgpt.com/',
                    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error('Error proxying request:', error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

// Serve static files from React app in production
const path = require('path');
// Serve static files from the "client/dist" directory (assuming monorepo structure)
// Adjust path as needed depending on where this is deployed
app.use(express.static(path.join(__dirname, '../client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});

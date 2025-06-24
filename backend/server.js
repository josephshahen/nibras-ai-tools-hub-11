// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require('@google/generative-ai');

// --- Configuration ---
const app = express();
const PORT = process.env.PORT || 3001; // Default port for backend
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Ensure API key is present
if (!GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY is not set in .env file.');
    console.error('Please get your API key from https://aistudio.google.com/ and set it in a .env file.');
    process.exit(1); // Exit if API key is missing
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Choose a model that's appropriate for your use case.
// For text-only input: 'gemini-pro'
// For text-and-image input: 'gemini-pro-vision'
const textModel = genAI.getGenerativeModel({ model: 'gemini-pro' });
const visionModel = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

// --- Middleware ---
app.use(cors({
    origin: ['http://localhost:8080', 'http://localhost:3000'], // Allow requests from your React app
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '50mb' })); // Increased limit for image data (base64)

// --- Gemini Safety Settings (Optional but Recommended) ---
const safetySettings = [
    {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
];

// --- Helper function for image parts (for gemini-pro-vision) ---
function fileToGenerativePart(base64String, mimeType) {
    return {
        inlineData: {
            data: base64String.split(',')[1], // Remove "data:image/png;base64," prefix
            mimeType,
        },
    };
}

// --- API Endpoints ---

// 1. Chatbot Endpoint
app.post('/api/chatbot', async (req, res) => {
    const { message, history } = req.body; // history for conversational context

    if (!message) {
        return res.status(400).json({ error: 'Message is required.' });
    }

    try {
        const chat = textModel.startChat({
            history: history || [], // Initialize with provided history
            safetySettings: safetySettings,
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();
        res.json({ reply: text });

    } catch (error) {
        console.error('Error in chatbot API:', error);
        if (error.response && error.response.data && error.response.data.candidates) {
            console.error('Gemini API Error Details:', error.response.data.candidates);
            return res.status(500).json({ error: 'Failed to get a response from AI. This might be due to safety settings blocking the content or an internal error.', details: error.response.data.candidates });
        }
        res.status(500).json({ error: 'Failed to get a response from AI. Please try again.' });
    }
});

// 2. Translator Endpoint
app.post('/api/translator', async (req, res) => {
    const { text, sourceLang, targetLang } = req.body;

    if (!text || !targetLang) {
        return res.status(400).json({ error: 'Text and target language are required for translation.' });
    }

    try {
        let prompt = `Translate the following text to ${targetLang}`;
        if (sourceLang && sourceLang !== 'auto') {
            prompt += ` from ${sourceLang}`;
        }
        prompt += `: "${text}"`;

        const result = await textModel.generateContent(prompt);
        const response = await result.response;
        const translatedText = response.text();
        res.json({ translatedText });

    } catch (error) {
        console.error('Error in translator API:', error);
        res.status(500).json({ error: 'Failed to translate text. Please try again.' });
    }
});

// 3. Summarizer Endpoint
app.post('/api/summarizer', async (req, res) => {
    const { article, summaryLength } = req.body;

    if (!article) {
        return res.status(400).json({ error: 'Article text is required for summarization.' });
    }

    try {
        let prompt = `Summarize the following article`;
        
        if (summaryLength === 'short') {
            prompt += ' in 2-3 sentences, highlighting only the most important points';
        } else if (summaryLength === 'medium') {
            prompt += ' in one paragraph, covering the main ideas';
        } else if (summaryLength === 'long') {
            prompt += ' in detail with multiple paragraphs, covering all important aspects';
        } else {
            prompt += ' concisely, highlighting key points and main ideas';
        }
        
        prompt += `:\n\n${article}`;

        const result = await textModel.generateContent(prompt);
        const response = await result.response;
        const summary = response.text();
        res.json({ summary });

    } catch (error) {
        console.error('Error in summarizer API:', error);
        res.status(500).json({ error: 'Failed to summarize article. Please try again.' });
    }
});

// 4. Website Generator Endpoint (Generates HTML/CSS)
app.post('/api/website-generator', async (req, res) => {
    const { title, description, type, color, editRequest } = req.body;

    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required.' });
    }

    try {
        let prompt = `Generate a complete, modern, responsive HTML website with embedded CSS and JavaScript. The website should be professional and fully functional.

Website Details:
- Title: ${title}
- Description: ${description}
- Type: ${type}
- Primary Color: ${color}

${editRequest ? `Additional Requirements: ${editRequest}` : ''}

Requirements:
1. Complete HTML5 structure with DOCTYPE
2. Embedded CSS in <style> tags with modern design
3. Responsive design that works on all devices
4. Professional typography and layout
5. Interactive elements with JavaScript if appropriate
6. Use the specified color (${color}) as the primary color theme
7. Include proper meta tags for SEO
8. Make it visually appealing and modern

Return only the complete HTML code without any markdown formatting or explanations.`;

        const result = await textModel.generateContent(prompt);
        const response = await result.response;
        let htmlCssCode = response.text();

        // Remove markdown backticks if present
        if (htmlCssCode.startsWith('```html')) {
            htmlCssCode = htmlCssCode.replace(/```html\n?/, '').replace(/\n?```/, '');
        } else if (htmlCssCode.startsWith('```')) {
             htmlCssCode = htmlCssCode.replace(/```[a-zA-Z]*\n?/, '').replace(/\n?```/, '');
        }

        res.json({ websiteCode: htmlCssCode });

    } catch (error) {
        console.error('Error in website generator API:', error);
        res.status(500).json({ error: 'Failed to generate website code. Please try again.' });
    }
});

// 5. Code Assistant Endpoint
app.post('/api/code-assistant', async (req, res) => {
    const { prompt, language, editRequest } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Code prompt is required.' });
    }

    try {
        let fullPrompt = `Generate ${language} code for the following request. Provide clean, well-commented, and production-ready code.

Request: "${prompt}"

${editRequest ? `Additional modifications: ${editRequest}` : ''}

Requirements:
1. Write clean, readable code
2. Include helpful comments
3. Follow best practices for ${language}
4. Make the code production-ready
5. Include error handling where appropriate

Return only the code without markdown formatting.`;

        const result = await textModel.generateContent(fullPrompt);
        const response = await result.response;
        let codeResult = response.text();

        // Attempt to remove markdown backticks if present to get raw code
        if (codeResult.includes('```')) {
             codeResult = codeResult.replace(/```[a-zA-Z]*\n?/g, '').replace(/\n?```/g, '');
        }

        res.json({ code: codeResult });

    } catch (error) {
        console.error('Error in code assistant API:', error);
        res.status(500).json({ error: 'Failed to generate code. Please try again.' });
    }
});

// 6. Image Generator Endpoint (Uses gemini-pro-vision for analysis/generation based on prompt)
app.post('/api/image-generator', async (req, res) => {
    const { prompt, style } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Image prompt is required.' });
    }

    try {
        // Since Gemini doesn't generate images, we'll provide a detailed description
        // that could be used with other image generation APIs
        let fullPrompt = `Create a detailed description for an image generation AI based on this prompt: "${prompt}"`;
        
        if (style) {
            fullPrompt += ` in ${style} style`;
        }
        
        fullPrompt += `. Include specific details about composition, colors, lighting, mood, and artistic style. Make it detailed enough for an AI image generator to create a high-quality image.`;

        const result = await textModel.generateContent(fullPrompt);
        const response = await result.response;
        const imageDescription = response.text();

        // Return the description - in a real implementation, you'd use this with DALL-E or Stable Diffusion
        res.json({ 
            imageDescription,
            message: 'Image generation requires integration with DALL-E or Stable Diffusion API. This is a detailed description that can be used with those services.',
            prompt,
            style
        });

    } catch (error) {
        console.error('Error in image generator API:', error);
        res.status(500).json({ error: 'Failed to process image request. Please try again.' });
    }
});

// 7. Games Search Endpoint
app.post('/api/games-search', async (req, res) => {
    const { gameName, platform } = req.body;

    if (!gameName) {
        return res.status(400).json({ error: 'Game name is required.' });
    }

    try {
        const prompt = `Provide comprehensive information about the video game "${gameName}" for ${platform}. Include:

1. Game title and release year
2. Genre and category
3. Developer and publisher
4. Detailed description of gameplay
5. System requirements (if PC)
6. Rating and reviews summary
7. Key features and highlights
8. Similar games recommendations
9. Where to legally purchase or download (official stores only)
10. File size and technical specifications

Format the response as a detailed game information report. Do not provide illegal download links.`;

        const result = await textModel.generateContent(prompt);
        const response = await result.response;
        const gameInfo = response.text();

        // Parse the response into structured data
        const gameData = {
            name: gameName,
            platform: platform,
            description: gameInfo,
            // You could parse specific fields from the response here
            rating: 8.5, // Mock rating
            size: "Unknown",
            category: "Game",
            releaseYear: "Unknown",
            developer: "Unknown",
            publisher: "Unknown",
            downloadLinks: {
                official: `https://store.steampowered.com/search/?term=${encodeURIComponent(gameName)}`,
                free: "Not available",
                demos: "Check official store"
            },
            features: ["High-quality graphics", "Engaging gameplay", "Multiplayer support"],
            alternatives: ["Similar games available on official stores"]
        };

        res.json(gameData);

    } catch (error) {
        console.error('Error in games search API:', error);
        res.status(500).json({ error: 'Failed to search for game information. Please try again.' });
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Gemini API Backend is running' });
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`🚀 Gemini API Backend is running on http://localhost:${PORT}`);
    console.log(`🔑 Gemini API Key: ${GEMINI_API_KEY ? 'Configured' : 'Missing'}`);
    console.log(`📱 Frontend should connect to: http://localhost:${PORT}`);
});
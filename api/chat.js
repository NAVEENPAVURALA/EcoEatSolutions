export default async function handler(req, res) {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const apiKey = process.env.VITE_HUGGING_FACE_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Server configuration error: Missing API Key' });
    }

    try {
        const { message } = req.body;
        const systemPrompt = "You are EcoEat Assistant, a helpful AI for a food donation platform. Keep answers concise (max 3 sentences).";
        const prompt = `<s>[INST] ${systemPrompt} ${message} [/INST]`;

        const response = await fetch(
            "https://router.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
            {
                headers: {
                    Authorization: `Bearer ${apiKey.trim()}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify({
                    inputs: prompt,
                    parameters: {
                        max_new_tokens: 150,
                        temperature: 0.7,
                        return_full_text: false,
                    },
                }),
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            return res.status(response.status).json({ error: errorText });
        }

        const result = await response.json();
        const text = result[0]?.generated_text || "I couldn't generate a response.";
        return res.status(200).json({ response: text.trim() });

    } catch (error) {
        console.error("Proxy Error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

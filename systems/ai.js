import { CONFIG } from '../config.js';

export class AIService {
    constructor(game) {
        this.game = game;
    }

    async generateEvent() {
        if (!CONFIG.AI_API_KEY) {
            console.warn("No API Key found for AI Service");
            return null;
        }

        const player = this.game.player;
        const job = this.game.jobSystem.currentJobId;

        // Context for the AI
        const prompt = `
            You are a Game Master for a "Modern Life Idle RPG". 
            Generate a random short event that happens to the player.
            
            Player Status:
            - Job: ${job}
            - Money: ${player.money}
            - Stress: ${player.stress}/${player.maxStress}
            - Energy: ${player.energy}/${player.maxEnergy}

            Output valid JSON ONLY with this structure:
            {
                "title": "Short Title",
                "desc": "One sentence description of what happened.",
                "effects": {
                    "money": 0, // Integer (positive or negative)
                    "stress": 0, // Integer
                    "energy": 0 // Integer
                }
            }
            
            Make it funny, realistic, or ironic suitable for modern life.
        `;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.AI_MODEL}:generateContent?key=${CONFIG.AI_API_KEY}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        responseMimeType: "application/json"
                    }
                })
            });

            if (!response.ok) {
                const err = await response.text();
                throw new Error(`API Error: ${response.status} - ${err}`);
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) throw new Error("No content generated");

            try {
                const eventData = JSON.parse(text);
                return {
                    id: 'ai_generated_' + Date.now(),
                    ...eventData,
                    type: 'ai'
                };
            } catch (e) {
                console.error("Failed to parse JSON from AI:", text);
                return null;
            }

        } catch (error) {
            console.error("AI Service Error:", error);
            return null;
        }
    }

    async generateJobs() {
        if (!CONFIG.AI_API_KEY) return [];

        const prompt = `
            Generate 3 creative freelance "gigs" or micro-jobs for a modern life game.
            Output JSON only:
            [
                {
                    "title": "Job Title",
                    "desc": "Short description",
                    "pay": 100, // Range 50-500
                    "energy": 10, // Cost 10-50
                    "stress": 5 // Cost 0-20
                }
            ]
            Make them varied (funny, serious, tech, labor).
        `;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.AI_MODEL}:generateContent?key=${CONFIG.AI_API_KEY}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: "application/json" }
                })
            });

            if (!response.ok) return [];

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) return [];

            const jobs = JSON.parse(text);
            return jobs.map(j => ({ ...j, id: 'gig_' + Date.now() + Math.random() }));
        } catch (error) {
            console.error("AI Jobs Error:", error);
            return [];
        }
    async generateNews() {
            if (!CONFIG.AI_API_KEY) return null;

            const prompt = `
            Generate a single short, funny, or satirical "Breaking News" headline for a fictional modern city.
            Topics: Tech, Economy, traffic, weather, pop culture.
            Max 10 words.
            Output JSON only: { "headline": "..." }
        `;

            const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.AI_MODEL}:generateContent?key=${CONFIG.AI_API_KEY}`;

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: prompt }] }],
                        generationConfig: { responseMimeType: "application/json" }
                    })
                });

                if (!response.ok) return null;

                const data = await response.json();
                const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                if (!text) return null;

                return JSON.parse(text).headline;
            } catch (error) {
                console.error("AI News Error:", error);
                return null;
            }
        }
    }

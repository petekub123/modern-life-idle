import { CONFIG } from '../config.js';
import {
    getEventPrompt,
    getNewsPrompt,
    getGigsPrompt,
    getFriendCallPrompt,
    FRIEND_NAMES
} from '../data/prompts.js';

export class AIService {
    constructor(game) {
        this.game = game;
    }

    // Helper to get player status object
    getPlayerStatus() {
        const player = this.game.player;
        const job = this.game.jobSystem.currentJob?.name || "ว่างงาน";

        let mood = "ปกติ";
        if (player.stress > 70) mood = "เครียดมาก";
        else if (player.energy < 30) mood = "เหนื่อยมาก";
        else if (player.money > 50000) mood = "รวย";
        else if (player.money < 0) mood = "ถังแตก";

        return {
            money: Math.floor(player.money),
            energy: Math.floor(player.energy),
            stress: Math.floor(player.stress),
            health: Math.floor(player.health),
            job: job,
            mood: mood
        };
    }

    // Generic API call helper
    async callGemini(prompt, parseAsArray = false) {
        if (!CONFIG.AI_API_KEY) {
            console.warn("No API Key found for AI Service");
            return null;
        }

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.AI_MODEL}:generateContent?key=${CONFIG.AI_API_KEY}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        responseMimeType: "application/json",
                        temperature: 0.8
                    }
                })
            });

            if (!response.ok) {
                console.error("API Error:", response.status);
                return null;
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!text) return null;

            return JSON.parse(text);
        } catch (error) {
            console.error("AI Service Error:", error);
            return null;
        }
    }

    // Generate random event (Thai)
    async generateEvent() {
        const prompt = getEventPrompt(this.getPlayerStatus());
        const result = await this.callGemini(prompt);

        if (result) {
            return {
                id: 'ai_event_' + Date.now(),
                title: result.title || "เหตุการณ์ลึกลับ",
                desc: result.desc || "มีบางอย่างเกิดขึ้น... 🤔",
                effects: result.effects || {},
                type: 'ai'
            };
        }
        return null;
    }

    // Generate freelance gigs (Thai)
    async generateJobs() {
        const prompt = getGigsPrompt();
        const result = await this.callGemini(prompt);

        if (result && Array.isArray(result)) {
            return result.map(j => ({
                ...j,
                id: 'gig_' + Date.now() + Math.random()
            }));
        }
        return [];
    }

    // Generate news headline (Thai)
    async generateNews() {
        const prompt = getNewsPrompt();
        const result = await this.callGemini(prompt);
        return result?.headline || null;
    }

    // Call friend - test API with Thai Gen-Z style
    async callFriend() {
        if (!CONFIG.AI_API_KEY) {
            return { success: false, error: "NO_API_KEY", message: "ยังไม่ได้ตั้งค่า API Key นะ" };
        }

        const randomName = FRIEND_NAMES[Math.floor(Math.random() * FRIEND_NAMES.length)];
        const prompt = getFriendCallPrompt(randomName, this.getPlayerStatus());

        try {
            const result = await this.callGemini(prompt);

            if (result) {
                return {
                    success: true,
                    name: result.name || randomName,
                    message: result.message || "ว่าไงจ้า! 😊"
                };
            }

            // Fallback if AI doesn't respond
            return {
                success: true,
                name: randomName,
                message: "เฮ้ยยย โทรมาไงอ่ะ! 📞 ว่างป่ะ ไปกินข้าวกัน~"
            };
        } catch (error) {
            console.error("AI Call Friend Error:", error);
            return { success: false, error: "NETWORK", message: "เน็ตมีปัญหา ลองใหม่นะ 😅" };
        }
    }
}

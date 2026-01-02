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

    // Test API by "calling a friend" - Thai Gen-Z style
    async callFriend() {
        if (!CONFIG.AI_API_KEY) {
            return { success: false, error: "NO_API_KEY", message: "ยังไม่ได้ตั้งค่า API Key นะ" };
        }

        const player = this.game.player;
        const job = this.game.jobSystem.currentJob?.name || "ว่างงาน";

        // Determine player mood based on stats
        let playerMood = "ปกติ";
        if (player.stress > 70) playerMood = "เครียดมาก";
        else if (player.energy < 30) playerMood = "เหนื่อยมาก";
        else if (player.money > 50000) playerMood = "รวย";
        else if (player.money < 0) playerMood = "ถังแตก";

        // Thai Gen-Z friend names
        const friendNames = ["ฟลุ๊ค", "มิ้นท์", "เจมส์", "พลอย", "บิ๊ก", "นิว", "เบล", "ก้อง"];
        const randomName = friendNames[Math.floor(Math.random() * friendNames.length)];

        const prompt = `
คุณคือ "${randomName}" เพื่อนสนิทของผู้เล่นในเกม Idle RPG ชีวิตคนเมือง
ผู้เล่นเพิ่งโทรมาหาคุณ ตอบกลับแบบเพื่อนสนิท วัยรุ่นไทย Gen-Z

สไตล์การพูด:
- ใช้ภาษาไทยวัยรุ่น เช่น "จ้า", "อ่ะ", "นะ", "ชิมิ", "ป่ะ", "555"
- พูดสั้นๆ 1-2 ประโยค
- ใส่ emoji 1-2 ตัว
- ห้ามใช้ภาษาอังกฤษ ยกเว้นคำทับศัพท์

สถานะผู้เล่น:
- เงิน: ${Math.floor(player.money).toLocaleString()}฿
- พลังงาน: ${Math.floor(player.energy)}%
- ความเครียด: ${Math.floor(player.stress)}%
- อาชีพ: ${job}
- อารมณ์: ${playerMood}

ตอบตามอารมณ์ผู้เล่น:
- ถ้าเครียด: ปลอบใจ/ชวนไปเที่ยว
- ถ้าเหนื่อย: บอกให้พัก
- ถ้ารวย: ขอยืมตังค์/แซว
- ถ้าถังแตก: ให้กำลังใจ

Output JSON เท่านั้น: { "name": "${randomName}", "message": "ข้อความ" }
        `;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.AI_MODEL}:generateContent?key=${CONFIG.AI_API_KEY}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: {
                        responseMimeType: "application/json",
                        temperature: 0.9 // More creative
                    }
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                console.error("API Response Error:", errText);

                // Parse error for better message
                if (response.status === 400) {
                    return { success: false, error: "BAD_REQUEST", message: "API Key ไม่ถูกต้อง หรือ Model ไม่รองรับ" };
                } else if (response.status === 403) {
                    return { success: false, error: "FORBIDDEN", message: "API Key ถูกบล็อค หรือหมดโควต้า" };
                } else if (response.status === 429) {
                    return { success: false, error: "RATE_LIMIT", message: "เรียกบ่อยไป รอสักครู่นะ" };
                }
                return { success: false, error: "API_ERROR", message: `API Error: ${response.status}` };
            }

            const data = await response.json();
            const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!text) {
                // Fallback response if AI doesn't respond
                return {
                    success: true,
                    name: randomName,
                    message: "เฮ้ยยย โทรมาไงอ่ะ! 📞 ว่างป่ะ ไปกินข้าวกัน~"
                };
            }

            try {
                const result = JSON.parse(text);
                return {
                    success: true,
                    name: result.name || randomName,
                    message: result.message || "ว่าไงจ้า! 😊"
                };
            } catch (parseError) {
                // If JSON parse fails, use the text directly
                return {
                    success: true,
                    name: randomName,
                    message: text.slice(0, 100) || "เฮ้ย ว่าไงอ่ะ! 👋"
                };
            }
        } catch (error) {
            console.error("AI Call Friend Error:", error);
            return { success: false, error: "NETWORK", message: "เน็ตมีปัญหา ลองใหม่นะ" };
        }
    }
}

export const EVENTS = [
    {
        id: 'found_money',
        title: 'โชคหล่นทับ!',
        desc: 'คุณเดินเจอตังค์ตกอยู่ที่พื้น',
        chance: 0.05, // 5% chance check per minute? Or generic weight? Let's use generic chance per "Event Check"
        effects: { money: 100 },
        type: 'good'
    },
    {
        id: 'sick',
        title: 'ป่วยกะทันหัน',
        desc: 'รู้สึกเวียนหัวจากการทำงานหนักเกินไป',
        chance: 0.02,
        condition: (game) => game.player.stress > 50,
        effects: { energy: -30, health: -10, money: -200 }, // Medical bill
        type: 'bad'
    },
    {
        id: 'bonus',
        title: 'โบนัสออก!',
        desc: 'เจ้านายปลื้มผลงานของคุณมาก',
        chance: 0.01,
        condition: (game) => game.jobSystem.currentJobId !== 'unemployed',
        effects: { money: 500, stress: -10 },
        type: 'good'
    },
    {
        id: 'sale',
        title: 'โปรโมชั่นเด็ด',
        desc: 'ของลดราคา ทำให้คุณอดใจไม่ไหว',
        chance: 0.03,
        effects: { money: -100, stress: -20 }, // Forced spending but relief
        type: 'neutral'
    }
];

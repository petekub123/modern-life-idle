export const ACTIVITIES = {
    'sleep': {
        id: 'sleep',
        name: 'นอนหลับ',
        icon: '🛌',
        desc: 'ฟื้นพลังงานเต็มที่ (ข้ามเวลา 8 ชม.)',
        energyChange: 100,
        stressChange: -20,
        healthChange: 5,
        moneyCost: 0,
        timeCostSeconds: 8 * 3600,
        cooldown: 0
    },
    'relax': {
        id: 'relax',
        name: 'นั่งพัก',
        icon: '🎧',
        desc: 'ลดความเครียด (ข้ามเวลา 1 ชม.)',
        energyChange: 10,
        stressChange: -15,
        healthChange: 0,
        moneyCost: 0,
        timeCostSeconds: 1 * 3600,
        cooldown: 0
    },
    'exercise': {
        id: 'exercise',
        name: 'ออกกำลังกาย',
        icon: '💪',
        desc: 'สุขภาพดีขึ้น แต่เหนื่อยหน่อย',
        energyChange: -20,
        stressChange: -10,
        healthChange: 10,
        moneyCost: 0,
        timeCostSeconds: 1 * 3600,
        cooldown: 0
    },
    'shopping': {
        id: 'shopping',
        name: 'ช้อปปิ้ง',
        icon: '🛍️',
        desc: 'แก้เครียดด้วยการใช้เงิน',
        energyChange: -5,
        stressChange: -40,
        healthChange: 0,
        moneyCost: 500, // Fixed cost, or could be dynamic later
        timeCostSeconds: 2 * 3600,
        cooldown: 0
    }
};

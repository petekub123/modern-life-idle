// Skills Data - Used for career progression and income bonuses
// Players can learn skills through activities to unlock better jobs

export const SKILLS = {
    'coding': {
        id: 'coding',
        name: 'การเขียนโค้ด',
        icon: '💻',
        desc: 'ทักษะพัฒนาซอฟต์แวร์และเว็บไซต์',
        maxLevel: 10,
        incomeBonus: 0.05 // +5% income per level
    },
    'communication': {
        id: 'communication',
        name: 'การสื่อสาร',
        icon: '🗣️',
        desc: 'ทักษะการนำเสนอและเจรจาต่อรอง',
        maxLevel: 10,
        incomeBonus: 0.03 // +3% income per level
    },
    'leadership': {
        id: 'leadership',
        name: 'ความเป็นผู้นำ',
        icon: '👔',
        desc: 'ทักษะการบริหารทีมและการตัดสินใจ',
        maxLevel: 10,
        incomeBonus: 0.04 // +4% income per level
    },
    'finance': {
        id: 'finance',
        name: 'การเงิน',
        icon: '📊',
        desc: 'ทักษะการบริหารเงินและการลงทุน',
        maxLevel: 10,
        incomeBonus: 0.03 // +3% income per level
    },
    'creativity': {
        id: 'creativity',
        name: 'ความคิดสร้างสรรค์',
        icon: '🎨',
        desc: 'ทักษะการออกแบบและคิดนอกกรอบ',
        maxLevel: 10,
        incomeBonus: 0.04 // +4% income per level
    }
};

// Learning Activities - Ways to gain skills
export const COURSES = {
    'online_coding': {
        id: 'online_coding',
        name: 'คอร์สเขียนโค้ดออนไลน์',
        icon: '🎓',
        desc: 'เรียนเขียนโปรแกรมจากบ้าน',
        skillId: 'coding',
        xpGain: 25,
        energyCost: 15,
        moneyCost: 200,
        timeCostSeconds: 2 * 3600 // 2 hours
    },
    'workshop_comm': {
        id: 'workshop_comm',
        name: 'เวิร์คช็อปการพูด',
        icon: '🎤',
        desc: 'ฝึกการนำเสนอหน้าเวที',
        skillId: 'communication',
        xpGain: 30,
        energyCost: 20,
        moneyCost: 500,
        timeCostSeconds: 3 * 3600 // 3 hours
    },
    'read_leadership': {
        id: 'read_leadership',
        name: 'อ่านหนังสือผู้นำ',
        icon: '📖',
        desc: 'หนังสือพัฒนาตนเองด้านการนำทีม',
        skillId: 'leadership',
        xpGain: 15,
        energyCost: 10,
        moneyCost: 100,
        timeCostSeconds: 1 * 3600 // 1 hour
    },
    'finance_course': {
        id: 'finance_course',
        name: 'คอร์สการเงินส่วนบุคคล',
        icon: '💹',
        desc: 'เรียนรู้การลงทุนและเก็บออม',
        skillId: 'finance',
        xpGain: 20,
        energyCost: 15,
        moneyCost: 300,
        timeCostSeconds: 2 * 3600 // 2 hours
    },
    'art_class': {
        id: 'art_class',
        name: 'คลาสศิลปะ',
        icon: '🖌️',
        desc: 'เปิดความคิดสร้างสรรค์',
        skillId: 'creativity',
        xpGain: 20,
        energyCost: 10,
        moneyCost: 250,
        timeCostSeconds: 2 * 3600 // 2 hours
    }
};

// XP required per level (cumulative)
export function getXPForLevel(level) {
    return level * 100; // Level 1 = 100 XP, Level 2 = 200 XP, etc.
}

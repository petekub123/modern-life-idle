// data/furniture.js - Furniture data for home decoration system

export const FURNITURE = {
    // Basic Furniture
    'bed_basic': {
        id: 'bed_basic',
        name: 'เตียงธรรมดา',
        icon: '🛏️',
        desc: 'นอนหลับฟื้นพลังเพิ่ม +10%',
        price: 2000,
        effect: { type: 'sleep_bonus', value: 0.1 },
        category: 'bedroom'
    },
    'bed_premium': {
        id: 'bed_premium',
        name: 'เตียงหรู',
        icon: '🛏️',
        desc: 'นอนหลับฟื้นพลังเพิ่ม +25%',
        price: 8000,
        effect: { type: 'sleep_bonus', value: 0.25 },
        category: 'bedroom'
    },
    'sofa_basic': {
        id: 'sofa_basic',
        name: 'โซฟา',
        icon: '🛋️',
        desc: 'พักผ่อนลดเครียดเพิ่ม +10%',
        price: 1500,
        effect: { type: 'relax_bonus', value: 0.1 },
        category: 'living'
    },
    'sofa_premium': {
        id: 'sofa_premium',
        name: 'โซฟาหนังแท้',
        icon: '🛋️',
        desc: 'พักผ่อนลดเครียดเพิ่ม +30%',
        price: 6000,
        effect: { type: 'relax_bonus', value: 0.3 },
        category: 'living'
    },
    'tv': {
        id: 'tv',
        name: 'ทีวีจอใหญ่',
        icon: '📺',
        desc: 'ลดเครียด -5 ต่อวัน',
        price: 3000,
        effect: { type: 'daily_stress', value: -5 },
        category: 'living'
    },
    'fridge': {
        id: 'fridge',
        name: 'ตู้เย็น',
        icon: '🧊',
        desc: 'ลดค่าอาหารต่อวัน -50฿',
        price: 4000,
        effect: { type: 'daily_expense', value: -50 },
        category: 'kitchen'
    },
    'microwave': {
        id: 'microwave',
        name: 'ไมโครเวฟ',
        icon: '📦',
        desc: 'ลดค่าอาหารต่อวัน -30฿',
        price: 1500,
        effect: { type: 'daily_expense', value: -30 },
        category: 'kitchen'
    },
    'computer': {
        id: 'computer',
        name: 'คอมพิวเตอร์',
        icon: '💻',
        desc: 'งานฟรีแลนซ์รายได้ +20%',
        price: 15000,
        effect: { type: 'gig_bonus', value: 0.2 },
        category: 'office'
    },
    'desk': {
        id: 'desk',
        name: 'โต๊ะทำงาน',
        icon: '🪑',
        desc: 'เรียนคอร์สเร็วขึ้น +10%',
        price: 2500,
        effect: { type: 'study_bonus', value: 0.1 },
        category: 'office'
    },
    'plant': {
        id: 'plant',
        name: 'ต้นไม้ฟอกอากาศ',
        icon: '🪴',
        desc: 'สุขภาพ +2 ต่อวัน',
        price: 500,
        effect: { type: 'daily_health', value: 2 },
        category: 'decoration'
    },
    'aquarium': {
        id: 'aquarium',
        name: 'ตู้ปลา',
        icon: '🐠',
        desc: 'ลดเครียด -3 ต่อวัน',
        price: 3000,
        effect: { type: 'daily_stress', value: -3 },
        category: 'decoration'
    },
    'aircon': {
        id: 'aircon',
        name: 'เครื่องปรับอากาศ',
        icon: '❄️',
        desc: 'นอนหลับดีขึ้น ลดเครียด -5 ต่อวัน',
        price: 8000,
        effect: { type: 'daily_stress', value: -5 },
        category: 'appliance'
    },
    'washing_machine': {
        id: 'washing_machine',
        name: 'เครื่องซักผ้า',
        icon: '🔄',
        desc: 'ลดค่าครองชีพ -20฿/วัน',
        price: 5000,
        effect: { type: 'daily_expense', value: -20 },
        category: 'appliance'
    }
};

export function getFurnitureById(id) {
    return FURNITURE[id];
}

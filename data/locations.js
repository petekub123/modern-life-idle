// data/locations.js - Location data for Map Navigation System

export const LOCATIONS = {
    // Row 1
    'home': {
        id: 'home',
        name: 'บ้าน',
        icon: '🏠',
        description: 'พักผ่อน นอนหลับ ตกแต่งบ้าน',
        status: 'available',
        submenus: [
            { id: 'sleep', name: 'นอนหลับ', icon: '🛌', action: 'activity', actionId: 'sleep' },
            { id: 'relax', name: 'พักผ่อน', icon: '📺', action: 'activity', actionId: 'relax' },
            { id: 'furniture', name: 'เฟอร์นิเจอร์ในบ้าน', icon: '🛋️', action: 'panel', panel: 'my-furniture' }
        ]
    },
    'office': {
        id: 'office',
        name: 'ออฟฟิศ',
        icon: '🏢',
        description: 'ทำงานประจำ งานฟรีแลนซ์ สมัครงาน',
        status: 'available',
        submenus: [
            { id: 'work', name: 'ทำงานประจำ', icon: '💼', action: 'custom_work' },
            { id: 'gigs', name: 'งานฟรีแลนซ์ AI', icon: '⚡', action: 'custom_gigs' },
            { id: 'apply', name: 'สมัครงานใหม่', icon: '📋', action: 'panel', panel: 'jobs' }
        ]
    },
    'hospital': {
        id: 'hospital',
        name: 'โรงพยาบาล',
        icon: '🏥',
        description: 'รักษาตัว ซื้อยา',
        status: 'available',
        submenus: [
            { id: 'doctor', name: 'พบแพทย์', icon: '🏥', action: 'activity', actionId: 'hospital' },
            { id: 'pharmacy', name: 'ร้านขายยา', icon: '💊', action: 'shop', category: 'medicine' }
        ]
    },
    'school': {
        id: 'school',
        name: 'มหาวิทยาลัย',
        icon: '🏫',
        description: 'เรียนคอร์ส พัฒนาทักษะ',
        status: 'available',
        submenus: [
            { id: 'courses', name: 'ลงเรียนคอร์ส', icon: '📚', action: 'panel', panel: 'courses' },
            { id: 'skills', name: 'ดูทักษะ', icon: '⭐', action: 'panel', panel: 'skills' },
            { id: 'library', name: 'ห้องสมุด', icon: '📖', action: 'coming_soon' }
        ]
    },

    // Row 2
    'mall': {
        id: 'mall',
        name: 'ห้างสรรพสินค้า',
        icon: '🏬',
        description: 'ช้อปปิ้ง ซื้อของ เฟอร์นิเจอร์',
        status: 'available',
        submenus: [
            { id: 'shopping', name: 'ช้อปปิ้งลดเครียด', icon: '🛍️', action: 'activity', actionId: 'shopping' },
            { id: 'shop', name: 'ซื้ออุปกรณ์', icon: '🛒', action: 'panel', panel: 'shop' },
            { id: 'furniture', name: 'ร้านเฟอร์นิเจอร์', icon: '🛋️', action: 'panel', panel: 'furniture-shop' },
            { id: 'movie', name: 'ดูหนัง', icon: '🍿', action: 'coming_soon' }
        ]
    },
    'bank': {
        id: 'bank',
        name: 'ธนาคาร',
        icon: '🏦',
        description: 'ฝากเงิน กู้เงิน เล่นหุ้น',
        status: 'available',
        submenus: [
            { id: 'deposit', name: 'ฝาก/ถอนเงิน', icon: '💰', action: 'panel', panel: 'bank' },
            { id: 'loan', name: 'กู้เงิน/ชำระหนี้', icon: '💳', action: 'panel', panel: 'bank' },
            { id: 'stocks', name: 'ตลาดหุ้น', icon: '📈', action: 'panel', panel: 'stocks' }
        ]
    },
    'convenience': {
        id: 'convenience',
        name: 'ร้านสะดวกซื้อ',
        icon: '🏪',
        description: 'ซื้อกาแฟ ขนม เครื่องดื่ม',
        status: 'available',
        submenus: [
            { id: 'coffee', name: 'ซื้อกาแฟ', icon: '☕', action: 'buy_item', itemId: 'coffee' },
            { id: 'energy', name: 'เครื่องดื่มชูกำลัง', icon: '⚡', action: 'buy_item', itemId: 'energy_drink' },
            { id: 'book', name: 'หนังสือลดเครียด', icon: '📚', action: 'buy_item', itemId: 'book_relax' }
        ]
    },
    'casino': {
        id: 'casino',
        name: 'คาสิโน',
        icon: '🎰',
        description: 'เกมเสี่ยงโชค (เร็วๆนี้)',
        status: 'coming_soon',
        submenus: [
            { id: 'slots', name: 'สล็อต', icon: '🎰', action: 'coming_soon' },
            { id: 'poker', name: 'โป๊กเกอร์', icon: '🃏', action: 'coming_soon' }
        ]
    },

    // Row 3
    'gym': {
        id: 'gym',
        name: 'ฟิตเนส',
        icon: '🏋️',
        description: 'ออกกำลังกาย เพิ่มสุขภาพ',
        status: 'available',
        submenus: [
            { id: 'exercise', name: 'ออกกำลังกาย', icon: '💪', action: 'activity', actionId: 'exercise' },
            { id: 'yoga', name: 'โยคะ', icon: '🧘', action: 'coming_soon' }
        ]
    },
    'restaurant': {
        id: 'restaurant',
        name: 'ร้านอาหาร',
        icon: '🍜',
        description: 'กินข้าว ฟื้นพลัง',
        status: 'available',
        submenus: [
            { id: 'eat', name: 'กินอาหาร', icon: '🍔', action: 'coming_soon' },
            { id: 'cafe', name: 'คาเฟ่', icon: '☕', action: 'coming_soon' }
        ]
    },
    'realestate': {
        id: 'realestate',
        name: 'อสังหาริมทรัพย์',
        icon: '🏡',
        description: 'เช่า/ซื้อบ้าน',
        status: 'available',
        submenus: [
            { id: 'housing', name: 'เช่า/ซื้อที่พัก', icon: '🏠', action: 'panel', panel: 'housing' },
            { id: 'invest', name: 'ลงทุนอสังหาฯ', icon: '📊', action: 'coming_soon' }
        ]
    },
    'arcade': {
        id: 'arcade',
        name: 'เกมเซ็นเตอร์',
        icon: '🎮',
        description: 'เล่นเกม ลดเครียด (เร็วๆนี้)',
        status: 'coming_soon',
        submenus: [
            { id: 'games', name: 'เกมตู้', icon: '🕹️', action: 'coming_soon' },
            { id: 'prizes', name: 'แลกของรางวัล', icon: '🎁', action: 'coming_soon' }
        ]
    }
};

// Location order for grid display
export const LOCATION_ORDER = [
    ['home', 'office', 'hospital', 'school'],
    ['mall', 'bank', 'convenience', 'casino'],
    ['gym', 'restaurant', 'realestate', 'arcade']
];

export function getLocation(id) {
    return LOCATIONS[id];
}

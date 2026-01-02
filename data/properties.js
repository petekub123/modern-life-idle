// data/properties.js - Housing options for Modern Life: Idle RPG

export const PROPERTIES = [
    {
        id: 'shared_room',
        name: 'ห้องแชร์',
        icon: '🏠',
        description: 'ห้องเล็กๆ แชร์กับคนอื่น ราคาถูกสุด',
        rentPerDay: 50,
        buyPrice: null, // ไม่สามารถซื้อได้
        expenseReduction: 0,
        energyBonus: 0,
        stressReduction: 0,
        unlockRequirements: null // เริ่มต้นมี
    },
    {
        id: 'dormitory',
        name: 'หอพัก',
        icon: '🏢',
        description: 'ห้องพักส่วนตัว มีสิ่งอำนวยความสะดวกพื้นฐาน',
        rentPerDay: 80,
        buyPrice: null,
        expenseReduction: 0.1, // ลดค่าครองชีพ 10%
        energyBonus: 5, // ฟื้นพลังเร็วขึ้น
        stressReduction: 0,
        unlockRequirements: { money: 500 }
    },
    {
        id: 'studio',
        name: 'สตูดิโอ',
        icon: '🏙️',
        description: 'ห้องชุดขนาดเล็ก ใกล้รถไฟฟ้า ประหยัดค่าเดินทาง',
        rentPerDay: 120,
        buyPrice: null,
        expenseReduction: 0.2,
        energyBonus: 5,
        stressReduction: 5,
        unlockRequirements: { money: 2000 }
    },
    {
        id: 'condo',
        name: 'คอนโด',
        icon: '🏬',
        description: 'คอนโดวิวสวย สระว่ายน้ำ ฟิตเนส ครบครัน',
        rentPerDay: 200,
        buyPrice: 50000,
        expenseReduction: 0.4,
        energyBonus: 10,
        stressReduction: 10,
        unlockRequirements: { money: 5000 }
    },
    {
        id: 'townhouse',
        name: 'ทาวน์เฮาส์',
        icon: '🏡',
        description: 'บ้าน 2 ชั้น มีลานจอดรถ เหมาะสำหรับครอบครัว',
        rentPerDay: 350,
        buyPrice: 150000,
        expenseReduction: 0.6,
        energyBonus: 15,
        stressReduction: 15,
        unlockRequirements: { money: 20000 }
    },
    {
        id: 'house',
        name: 'บ้านเดี่ยว',
        icon: '🏰',
        description: 'บ้านหรูพร้อมสวน ความสุขสูงสุด ไม่ต้องจ่ายค่าเช่า!',
        rentPerDay: 0, // เจ้าของบ้านไม่ต้องจ่ายค่าเช่า
        buyPrice: 500000,
        expenseReduction: 0.8,
        energyBonus: 20,
        stressReduction: 20,
        unlockRequirements: { money: 100000 }
    }
];

export function getPropertyById(id) {
    return PROPERTIES.find(p => p.id === id);
}

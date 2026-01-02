export const ITEMS = {
    'coffee': {
        id: 'coffee',
        name: 'กาแฟดำ',
        icon: '☕',
        desc: 'ฟื้นพลังงานทันที',
        type: 'consumable',
        price: 50,
        effect: { type: 'energy', value: 20 }
    },
    'energy_drink': {
        id: 'energy_drink',
        name: 'เครื่องดื่มชูกำลัง',
        icon: '⚡',
        desc: 'ดีดสุดๆ แต่ระวังใจสั่น',
        type: 'consumable',
        price: 30,
        effect: { type: 'energy', value: 40, stress: 5 }
    },
    'book_relax': {
        id: 'book_relax',
        name: 'หนังสือลดความเครียด',
        icon: '📚',
        desc: 'อ่านแล้วใจสงบ',
        type: 'consumable',
        price: 150,
        effect: { type: 'stress', value: -10 }
    },
    'laptop': {
        id: 'laptop',
        name: 'แล็ปท็อปตกรุ่น',
        icon: '💻',
        desc: 'เพิ่มรายได้จากการทำงาน 10% (Passive)',
        type: 'equipment',
        price: 2000,
        effect: { type: 'passive_income_mult', value: 0.1 }
    },
    'smart_watch': {
        id: 'smart_watch',
        name: 'นาฬิกาอัจฉริยะ',
        icon: '⌚',
        desc: 'ช่วยจัดการความเครียดได้ดีขึ้น (Stress เพิ่มช้าลง)',
        type: 'equipment',
        price: 5000,
        effect: { type: 'passive_stress_mult', value: -0.1 }
    }
};

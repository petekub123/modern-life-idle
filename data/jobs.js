// Job Data with Thai Career Tracks 🇹🇭
// 5 Tracks: Service, Culinary, Online, Delivery, Tech
// Structure: Tier 1 -> Tier 6 (Employee Only)
// Perks added for each track

export const JOBS = {
    // --- UNEMPLOYED (DEFAULT) ---
    'unemployed': {
        id: 'unemployed',
        name: 'ว่างงาน',
        tier: 0,
        track: 'none',
        incomePerSec: 0,
        energyCostPerSec: 0,
        stressPerSec: 0,
        desc: 'ไม่มีรายได้',
        requirements: null
    },

    // --- SERVICE TRACK (สายบริการ) 🧹 ---
    // Perk: Stress Reduction (Service Mind)
    'trainee_maid': {
        id: 'trainee_maid',
        name: 'แม่บ้านฝึกหัด',
        tier: 1,
        track: 'service',
        incomePerSec: 10,
        energyCostPerSec: 1.0,
        stressPerSec: 0.5,
        desc: 'เริ่มต้นเรียนรู้วิธีจับไม้กวาดและการใช้น้ำยา',
        perk: { type: 'stress_reduction', value: 0.15, desc: 'เครียดช้าลง 15%' },
        reqSkill: { id: 'cleaning', level: 0 },
        requirements: null
    },
    'junior_housekeeper': {
        id: 'junior_housekeeper',
        name: 'พนักงานทำความสะอาด',
        tier: 2,
        track: 'service',
        incomePerSec: 25,
        energyCostPerSec: 1.5,
        stressPerSec: 1.0,
        desc: 'รับผิดชอบความสะอาดโซนห้องพักแขก',
        perk: { type: 'stress_reduction', value: 0.15, desc: 'เครียดช้าลง 15%' },
        reqSkill: { id: 'cleaning', level: 2 },
        requirements: { daysWorked: 7 }
    },
    'senior_housekeeper': {
        id: 'senior_housekeeper',
        name: 'หัวหน้าแม่บ้าน',
        tier: 3,
        track: 'service',
        incomePerSec: 50,
        energyCostPerSec: 2.0,
        stressPerSec: 1.5,
        desc: 'ตรวจเช็คความเรียบร้อยและสอนงานน้องๆ',
        perk: { type: 'stress_reduction', value: 0.15, desc: 'เครียดช้าลง 15%' },
        reqSkill: { id: 'cleaning', level: 5 },
        requirements: { money: 10000, daysWorked: 30 }
    },
    'executive_housekeeper': {
        id: 'executive_housekeeper',
        name: 'หัวหน้าแผนกแม่บ้าน',
        tier: 4,
        track: 'service',
        incomePerSec: 100,
        energyCostPerSec: 2.5,
        stressPerSec: 2.0,
        desc: 'คุมทีมแม่บ้านทั้งหมดของโรงแรม',
        perk: { type: 'stress_reduction', value: 0.20, desc: 'เครียดช้าลง 20%' }, // Tier 4+ buff
        reqSkill: { id: 'leadership', level: 3 },
        requirements: { money: 50000, daysWorked: 60 }
    },
    'rooms_div_manager': {
        id: 'rooms_div_manager',
        name: 'ผู้จัดการฝ่ายห้องพัก',
        tier: 5,
        track: 'service',
        incomePerSec: 250,
        energyCostPerSec: 3.0,
        stressPerSec: 2.5,
        desc: 'ดูแลภาพรวมทั้งแผนกแม่บ้านและต้อนรับ',
        perk: { type: 'stress_reduction', value: 0.20, desc: 'เครียดช้าลง 20%' },
        reqSkill: { id: 'leadership', level: 5 },
        requirements: { money: 200000, daysWorked: 120 }
    },
    'ops_director': {
        id: 'ops_director',
        name: 'ผอ. ฝ่ายปฏิบัติการ',
        tier: 6,
        track: 'service',
        incomePerSec: 600,
        energyCostPerSec: 4.0,
        stressPerSec: 3.0,
        desc: 'บริหารจัดการระบบหลังบ้านทั้งหมดของเครือโรงแรม',
        perk: { type: 'stress_reduction', value: 0.25, desc: 'เครียดช้าลง 25%' }, // Max tier buff
        reqSkill: { id: 'leadership', level: 8 },
        requirements: { money: 1000000, daysWorked: 365 }
    },

    // --- CULINARY TRACK (สายอาหาร) 🍜 ---
    // Perk: Energy Cost Reduction (Staff Meal)
    'dishwasher': {
        id: 'dishwasher',
        name: 'เด็กล้างจาน',
        tier: 1,
        track: 'culinary',
        incomePerSec: 12,
        energyCostPerSec: 1.2,
        stressPerSec: 0.6,
        desc: 'งานหลังร้านที่ใครๆ ก็ต้องผ่าน',
        perk: { type: 'energy_reduction', value: 0.15, desc: 'ประหยัดแรง 15%' },
        reqSkill: { id: 'cooking', level: 0 },
        requirements: null
    },
    'commis_chef': {
        id: 'commis_chef',
        name: 'ผู้ช่วยกุ๊ก',
        tier: 2,
        track: 'culinary',
        incomePerSec: 30,
        energyCostPerSec: 1.8,
        stressPerSec: 1.2,
        desc: 'หั่นผัก เตรียมของ เป็นลูกมือเชฟ',
        perk: { type: 'energy_reduction', value: 0.15, desc: 'ประหยัดแรง 15%' },
        reqSkill: { id: 'cooking', level: 2 },
        requirements: { daysWorked: 10 }
    },
    'chef_de_partie': {
        id: 'chef_de_partie',
        name: 'เชฟกระทะ',
        tier: 3,
        track: 'culinary',
        incomePerSec: 60,
        energyCostPerSec: 2.2,
        stressPerSec: 1.8,
        desc: 'รับผิดชอบหน้าเตา ปรุงอาหารจานหลัก',
        perk: { type: 'energy_reduction', value: 0.15, desc: 'ประหยัดแรง 15%' },
        reqSkill: { id: 'cooking', level: 5 },
        requirements: { money: 15000, daysWorked: 45 }
    },
    'sous_chef': {
        id: 'sous_chef',
        name: 'รองหัวหน้าเชฟ',
        tier: 4,
        track: 'culinary',
        incomePerSec: 120,
        energyCostPerSec: 2.8,
        stressPerSec: 2.2,
        desc: 'มือขวาของ Head Chef คุมคิวอาหาร',
        perk: { type: 'energy_reduction', value: 0.20, desc: 'ประหยัดแรง 20%' },
        reqSkill: { id: 'cooking', level: 8 },
        requirements: { money: 80000, daysWorked: 90 }
    },
    'head_chef': {
        id: 'head_chef',
        name: 'หัวหน้าเชฟ',
        tier: 5,
        track: 'culinary',
        incomePerSec: 300,
        energyCostPerSec: 3.5,
        stressPerSec: 2.8,
        desc: 'คุมรสชาติและเมนูทั้งหมดของห้องอาหาร',
        perk: { type: 'energy_reduction', value: 0.20, desc: 'ประหยัดแรง 20%' },
        reqSkill: { id: 'leadership', level: 5 },
        requirements: { money: 300000, daysWorked: 150 }
    },
    'exec_chef': {
        id: 'exec_chef',
        name: 'เชฟใหญ่บริหาร',
        tier: 6,
        track: 'culinary',
        incomePerSec: 700,
        energyCostPerSec: 4.5,
        stressPerSec: 3.5,
        desc: 'ดูแลห้องอาหารทุกห้องในโรงแรมระดับ 5 ดาว',
        perk: { type: 'energy_reduction', value: 0.25, desc: 'ประหยัดแรง 25%' },
        reqSkill: { id: 'leadership', level: 8 },
        requirements: { money: 1500000, daysWorked: 400 }
    },

    // --- ONLINE TRACK (สายออนไลน์) 📱 ---
    // Perk: Viral Luck (Random huge multiplier)
    'chat_admin': {
        id: 'chat_admin',
        name: 'แอดมินตอบแชท',
        tier: 1,
        track: 'online',
        incomePerSec: 15,
        energyCostPerSec: 1.0,
        stressPerSec: 0.8,
        desc: 'ตอบลูกค้าทั้งวัน พิมพ์จนนิ้วล็อค',
        perk: { type: 'viral_luck', chance: 0.05, multiplier: 3, desc: 'ลุ้นรายได้ x3 (5%)' },
        reqSkill: { id: 'social', level: 0 },
        requirements: null
    },
    'content_mod': {
        id: 'content_mod',
        name: 'ผู้ดูแลคอนเทนต์',
        tier: 2,
        track: 'online',
        incomePerSec: 35,
        energyCostPerSec: 1.5,
        stressPerSec: 1.2,
        desc: 'ดูแลความเรียบร้อยและโพสต์หน้าเพจ',
        perk: { type: 'viral_luck', chance: 0.05, multiplier: 3, desc: 'ลุ้นรายได้ x3 (5%)' },
        reqSkill: { id: 'social', level: 2 },
        requirements: { daysWorked: 10 }
    },
    'creative': {
        id: 'creative',
        name: 'ครีเอทีฟ',
        tier: 3,
        track: 'online',
        incomePerSec: 70,
        energyCostPerSec: 2.0,
        stressPerSec: 2.0,
        desc: 'คิดคอนเทนต์ ไวรัลคลิป เรียกยอดไลค์',
        perk: { type: 'viral_luck', chance: 0.05, multiplier: 3, desc: 'ลุ้นรายได้ x3 (5%)' },
        reqSkill: { id: 'creativity', level: 4 },
        requirements: { money: 20000, daysWorked: 45 }
    },
    'social_mgr': {
        id: 'social_mgr',
        name: 'ผจก. โซเชียลมีเดีย',
        tier: 4,
        track: 'online',
        incomePerSec: 150,
        energyCostPerSec: 2.5,
        stressPerSec: 2.5,
        desc: 'วางแผนกลยุทธ์สื่อออนไลน์ทั้งหมด',
        perk: { type: 'viral_luck', chance: 0.08, multiplier: 3, desc: 'ลุ้นรายได้ x3 (8%)' }, // Increased chance
        reqSkill: { id: 'social', level: 7 },
        requirements: { money: 100000, daysWorked: 100 }
    },
    'marketing_dir': {
        id: 'marketing_dir',
        name: 'ผอ. การตลาดดิจิทัล',
        tier: 5,
        track: 'online',
        incomePerSec: 350,
        energyCostPerSec: 3.5,
        stressPerSec: 3.0,
        desc: 'คุมงบการตลาดและทิศทางแบรนด์ออนไลน์',
        perk: { type: 'viral_luck', chance: 0.08, multiplier: 3, desc: 'ลุ้นรายได้ x3 (8%)' },
        reqSkill: { id: 'leadership', level: 6 },
        requirements: { money: 500000, daysWorked: 200 }
    },
    'cco': {
        id: 'cco',
        name: 'CCO',
        tier: 6,
        track: 'online',
        incomePerSec: 800,
        energyCostPerSec: 4.5,
        stressPerSec: 4.0,
        desc: 'ประธานเจ้าหน้าที่บริหารฝ่ายคอนเทนต์',
        perk: { type: 'viral_luck', chance: 0.10, multiplier: 4, desc: 'ลุ้นรายได้ x4 (10%)' }, // BIG BUFF
        reqSkill: { id: 'leadership', level: 9 },
        requirements: { money: 2500000, daysWorked: 500 }
    },

    // --- DELIVERY TRACK (สายขนส่ง) 🛵 ---
    // Perk: Tips (Regular bonus interval)
    'messenger': {
        id: 'messenger',
        name: 'พนักงานส่งเอกสาร',
        tier: 1,
        track: 'delivery',
        incomePerSec: 14,
        energyCostPerSec: 1.5,
        stressPerSec: 1.0,
        desc: 'รับส่งเอกสารด่วน ทั่วกรุงเทพฯ',
        perk: { type: 'tips', interval: 10, bonusRatio: 5, desc: 'โบนัสทิปทุก 10 วิ' },
        reqSkill: { id: 'driving', level: 0 },
        requirements: null
    },
    'food_rider': {
        id: 'food_rider',
        name: 'ไรเดอร์ส่งอาหาร',
        tier: 2,
        track: 'delivery',
        incomePerSec: 32,
        energyCostPerSec: 2.0,
        stressPerSec: 1.5,
        desc: 'ขับทำรอบ ส่งความอร่อยถึงหน้าบ้าน',
        perk: { type: 'tips', interval: 10, bonusRatio: 5, desc: 'โบนัสทิปทุก 10 วิ' },
        reqSkill: { id: 'driving', level: 3 },
        requirements: { daysWorked: 10 }
    },
    'station_lead': {
        id: 'station_lead',
        name: 'หัวหน้าจุดจอด',
        tier: 3,
        track: 'delivery',
        incomePerSec: 65,
        energyCostPerSec: 2.0,
        stressPerSec: 1.8,
        desc: 'คุมคิวรถและจัดเส้นทางส่งของในโซน',
        perk: { type: 'tips', interval: 10, bonusRatio: 5, desc: 'โบนัสทิปทุก 10 วิ' },
        reqSkill: { id: 'driving', level: 6 },
        requirements: { money: 15000, daysWorked: 40 }
    },
    'area_mgr': {
        id: 'area_mgr',
        name: 'ผู้จัดการเขตขนส่ง',
        tier: 4,
        track: 'delivery',
        incomePerSec: 130,
        energyCostPerSec: 2.5,
        stressPerSec: 2.2,
        desc: 'ดูแลการขนส่งครอบคลุมหลายเขต',
        perk: { type: 'tips', interval: 8, bonusRatio: 6, desc: 'โบนัสทิปทุก 8 วิ' }, // Faster tips
        reqSkill: { id: 'leadership', level: 3 },
        requirements: { money: 70000, daysWorked: 90 }
    },
    'center_mgr': {
        id: 'center_mgr',
        name: 'ผู้จัดการศูนย์กระจายสินค้า',
        tier: 5,
        track: 'delivery',
        incomePerSec: 300,
        energyCostPerSec: 3.0,
        stressPerSec: 2.8,
        desc: 'บริหารคลังสินค้าขนาดใหญ่ รถเข้าออกเป็นพันคัน',
        perk: { type: 'tips', interval: 8, bonusRatio: 6, desc: 'โบนัสทิปทุก 8 วิ' },
        reqSkill: { id: 'leadership', level: 6 },
        requirements: { money: 250000, daysWorked: 180 }
    },
    'logistics_dir': {
        id: 'logistics_dir',
        name: 'ผอ. ฝ่ายโลจิสติกส์',
        tier: 6,
        track: 'delivery',
        incomePerSec: 750,
        energyCostPerSec: 4.0,
        stressPerSec: 3.5,
        desc: 'วางแผนระบบขนส่งระดับประเทศ',
        perk: { type: 'tips', interval: 5, bonusRatio: 8, desc: 'โบนัสทิปทุก 5 วิ!' }, // Super fast
        reqSkill: { id: 'leadership', level: 9 },
        requirements: { money: 2000000, daysWorked: 450 }
    },

    // --- TECH TRACK (สายเทค) 💻 ---
    // Perk: Offline Income Boost (Automation)
    'junior_dev': {
        id: 'junior_dev',
        name: 'Junior Developer',
        tier: 1,
        track: 'tech',
        incomePerSec: 20,
        energyCostPerSec: 1.5,
        stressPerSec: 1.2,
        desc: 'นักพัฒนาซอฟต์แวร์รุ่นใหม่ (เขียนบัค)',
        perk: { type: 'automation', value: 0.20, desc: 'รายได้ออฟไลน์ +20%' },
        reqSkill: { id: 'coding', level: 1 },
        requirements: null
    },
    'mid_dev': {
        id: 'mid_dev',
        name: 'Mid-Level Developer',
        tier: 2,
        track: 'tech',
        incomePerSec: 45,
        energyCostPerSec: 2.0,
        stressPerSec: 1.5,
        desc: 'เริ่มแก้บัคได้มากกว่าสร้างบัค',
        perk: { type: 'automation', value: 0.20, desc: 'รายได้ออฟไลน์ +20%' },
        reqSkill: { id: 'coding', level: 3 },
        requirements: { daysWorked: 15 }
    },
    'senior_dev': {
        id: 'senior_dev',
        name: 'Senior Developer',
        tier: 3,
        track: 'tech',
        incomePerSec: 90,
        energyCostPerSec: 2.5,
        stressPerSec: 2.0,
        desc: 'เดอะแบกของทีม',
        perk: { type: 'automation', value: 0.30, desc: 'รายได้ออฟไลน์ +30%' },
        reqSkill: { id: 'coding', level: 6 },
        requirements: { money: 30000, daysWorked: 60 }
    },
    'tech_lead': {
        id: 'tech_lead',
        name: 'Tech Lead',
        tier: 4,
        track: 'tech',
        incomePerSec: 180,
        energyCostPerSec: 3.0,
        stressPerSec: 2.5,
        desc: 'ออกแบบระบบและรีวิวโค้ดน้องๆ',
        perk: { type: 'automation', value: 0.30, desc: 'รายได้ออฟไลน์ +30%' },
        reqSkill: { id: 'coding', level: 9 },
        requirements: { money: 120000, daysWorked: 120 }
    },
    'eng_mgr': {
        id: 'eng_mgr',
        name: 'Engineering Manager',
        tier: 5,
        track: 'tech',
        incomePerSec: 400,
        energyCostPerSec: 3.5,
        stressPerSec: 3.0,
        desc: 'คุมคน คุมตารางงาน คุมความคาดหวัง',
        perk: { type: 'automation', value: 0.40, desc: 'รายได้ออฟไลน์ +40%' },
        reqSkill: { id: 'leadership', level: 7 },
        requirements: { money: 600000, daysWorked: 250 }
    },
    'cto': {
        id: 'cto',
        name: 'CTO',
        tier: 6,
        track: 'tech',
        incomePerSec: 1000,
        energyCostPerSec: 5.0,
        stressPerSec: 4.5,
        desc: 'ประธานเจ้าหน้าที่ฝ่ายเทคโนโลยี',
        perk: { type: 'automation', value: 0.50, desc: 'รายได้ออฟไลน์ +50%' }, // Huge idle boost
        reqSkill: { id: 'leadership', level: 10 },
        requirements: { money: 5000000, daysWorked: 600 }
    }
};

// Helper to get jobs by tier
export function getJobsByTier(tier) {
    return Object.values(JOBS).filter(job => job.tier === tier);
}

// Helper to get next tier jobs
export function getNextTierJobs(currentTier) {
    return Object.values(JOBS).filter(job => job.tier === currentTier + 1);
}

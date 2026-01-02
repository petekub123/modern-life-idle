// Job Data with Career Progression Tiers
// Each job has a tier, requirements for unlock, and scaling stats

export const JOBS = {
    'unemployed': {
        id: 'unemployed',
        name: 'ว่างงาน',
        tier: 0,
        incomePerSec: 0,
        energyCostPerSec: 0,
        stressPerSec: 0,
        desc: 'ไม่มีรายได้',
        requirements: null // Always available
    },

    // Tier 1: Entry Level
    'intern': {
        id: 'intern',
        name: 'เด็กฝึกงาน',
        tier: 1,
        incomePerSec: 5,
        energyCostPerSec: 1,
        stressPerSec: 0.5,
        desc: 'งานแรกของชีวิต รายได้พอเลี้ยงตัว',
        requirements: null // Starting job
    },
    'freelance': {
        id: 'freelance',
        name: 'ฟรีแลนซ์',
        tier: 1,
        incomePerSec: 15,
        energyCostPerSec: 2,
        stressPerSec: 1,
        desc: 'รับงานอิสระ รายได้ดีแต่เหนื่อยหน่อย',
        requirements: null // Alternative starting path
    },

    // Tier 2: Junior
    'staff': {
        id: 'staff',
        name: 'พนักงาน',
        tier: 2,
        incomePerSec: 25,
        energyCostPerSec: 2,
        stressPerSec: 1,
        desc: 'พนักงานประจำ มีสวัสดิการ',
        requirements: {
            money: 5000,
            daysWorked: 7 // Must have worked 7 days total
        }
    },

    // Tier 3: Senior
    'senior': {
        id: 'senior',
        name: 'พนักงานอาวุโส',
        tier: 3,
        incomePerSec: 50,
        energyCostPerSec: 2.5,
        stressPerSec: 1.5,
        desc: 'ประสบการณ์สูง รับผิดชอบงานหนัก',
        requirements: {
            money: 20000,
            daysWorked: 30
        }
    },

    // Tier 4: Management
    'manager': {
        id: 'manager',
        name: 'ผู้จัดการ',
        tier: 4,
        incomePerSec: 100,
        energyCostPerSec: 3,
        stressPerSec: 2,
        desc: 'บริหารทีม ความรับผิดชอบสูง',
        requirements: {
            money: 100000,
            daysWorked: 90
        }
    },

    // Tier 5: Executive
    'director': {
        id: 'director',
        name: 'ผู้อำนวยการ',
        tier: 5,
        incomePerSec: 200,
        energyCostPerSec: 3,
        stressPerSec: 2.5,
        desc: 'ผู้บริหารระดับสูง รายได้มหาศาล',
        requirements: {
            money: 500000,
            daysWorked: 180
        }
    },

    // Tier 6: C-Suite
    'ceo': {
        id: 'ceo',
        name: 'CEO',
        tier: 6,
        incomePerSec: 500,
        energyCostPerSec: 4,
        stressPerSec: 3,
        desc: 'ผู้นำสูงสุด เงินเดือนระดับเทพ',
        requirements: {
            money: 2000000,
            daysWorked: 365
        }
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

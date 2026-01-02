export const JOBS = {
    'unemployed': {
        id: 'unemployed',
        name: 'ว่างงาน',
        incomePerSec: 0,
        energyCostPerSec: 0,
        stressPerSec: 0,
        desc: 'ไม่มีรายได้'
    },
    'intern': {
        id: 'intern',
        name: 'เด็กฝึกงาน',
        incomePerSec: 5, // Buffed for balance
        energyCostPerSec: 1,
        stressPerSec: 0.5,
        desc: 'งานแรกของชีวิต รายได้พอเลี้ยงตัว'
    },
    'freelance': {
        id: 'freelance',
        name: 'ฟรีแลนซ์',
        incomePerSec: 15,
        energyCostPerSec: 2,
        stressPerSec: 1,
        desc: 'รับงานอิสระ รายได้ดีแต่เหนื่อยหน่อย'
    }
};

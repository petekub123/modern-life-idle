// Market Events Data
// Events affect stock price volatility and trend bias
// trendBias: +1.0 (Strong Up) to -1.0 (Strong Down)
// volatilityMul: 1.0 (Normal) to 3.0 (Panic)

export const MARKET_EVENTS = [
    // --- TECH SECTOR (High Volatility) ---
    {
        id: 'tech_new_ai',
        headline: '📰 Tech: เปิดตัวชิป AI รุ่นใหม่! ประมวลผลเร็วกว่าเดิม 10 เท่า',
        targetStockId: 'TECH',
        trendBias: 0.35, volatilityMul: 1.5, duration: 15 * 60, type: 'good'
    },
    {
        id: 'tech_data_leak',
        headline: '📰 Tech: ข้อมูลหลุด! บัญชีผู้ใช้นับล้านรั่วไหล หุ้นเทคร่วงระนาว',
        targetStockId: 'TECH',
        trendBias: -0.4, volatilityMul: 2.5, duration: 20 * 60, type: 'bad'
    },
    {
        id: 'tech_vr_hype',
        headline: '📰 Tech: กระแส Metaverse กลับมาบูม! แว่น VR ขาดตลาด',
        targetStockId: 'TECH',
        trendBias: 0.25, volatilityMul: 1.2, duration: 10 * 60, type: 'good'
    },
    {
        id: 'tech_regulation',
        headline: '📰 Tech: รัฐบาลเล็งเก็บภาษี Digital Service ยักษ์ใหญ่เทคสะเทือน',
        targetStockId: 'TECH',
        trendBias: -0.2, volatilityMul: 1.0, duration: 30 * 60, type: 'bad'
    },
    {
        id: 'tech_startup_unicorn',
        headline: '📰 Tech: TechCorp เข้าซื้อ Startup ยูนิคอร์นมาแรง',
        targetStockId: 'TECH',
        trendBias: 0.15, volatilityMul: 1.5, duration: 15 * 60, type: 'good'
    },
    {
        id: 'tech_server_crash',
        headline: '📰 Tech: ระบบ Cloud ล่มทั่วโลก! ธุรกิจออนไลน์หยุดชะงัก',
        targetStockId: 'TECH',
        trendBias: -0.3, volatilityMul: 2.0, duration: 10 * 60, type: 'bad'
    },

    // --- BANK SECTOR (Stable, Dividend) ---
    {
        id: 'bank_rate_hike',
        headline: '📰 Bank: ธปท. ประกาศขึ้นดอกเบี้ยนโยบาย 0.25% หุ้นแบงก์เฮ',
        targetStockId: 'BANK',
        trendBias: 0.2, volatilityMul: 1.1, duration: 20 * 60, type: 'good'
    },
    {
        id: 'bank_npl_risk',
        headline: '📰 Bank: หนี้ครัวเรือนพุ่งสูง! ธนาคารตั้งสำรองหนี้เสียเพิ่ม',
        targetStockId: 'BANK',
        trendBias: -0.15, volatilityMul: 1.0, duration: 25 * 60, type: 'bad'
    },
    {
        id: 'bank_digital_app',
        headline: '📰 Bank: เปิดตัวแอปธนาคารเวอร์ชั่นใหม่ ใช้งานง่ายยอดโหลดพุ่ง',
        targetStockId: 'BANK',
        trendBias: 0.1, volatilityMul: 1.0, duration: 15 * 60, type: 'good'
    },
    {
        id: 'bank_system_glitch',
        headline: '📰 Bank: ระบบโอนเงินล่มสิ้นเดือน! ชาวเน็ตบ่นอุบ',
        targetStockId: 'BANK',
        trendBias: -0.1, volatilityMul: 1.5, duration: 10 * 60, type: 'bad'
    },
    {
        id: 'bank_profit_growth',
        headline: '📰 Bank: ผลประกอบการไตรมาสล่าสุดโตเกินคาด ปันผลจุกๆ',
        targetStockId: 'BANK',
        trendBias: 0.25, volatilityMul: 1.2, duration: 20 * 60, type: 'good'
    },
    {
        id: 'bank_scam_warning',
        headline: '📰 Bank: แก๊งคอลเซ็นเตอร์ระบาด! ปชช.ไม่กล้าทำธุรกรรมออนไลน์',
        targetStockId: 'BANK',
        trendBias: -0.1, volatilityMul: 1.2, duration: 15 * 60, type: 'bad'
    },

    // --- FOOD SECTOR (Defensive) ---
    {
        id: 'food_michelin',
        headline: '📰 Food: ฟู้ดแลนด์คว้าดาวมิชลิน! นักชิมต่อคิวยาวเหยียด',
        targetStockId: 'FOOD',
        trendBias: 0.3, volatilityMul: 1.2, duration: 20 * 60, type: 'good'
    },
    {
        id: 'food_ingredient_cost',
        headline: '📰 Food: ราคาหมู-ไก่ ปรับตัวสูงขึ้น ต้นทุนพุ่ง!',
        targetStockId: 'FOOD',
        trendBias: -0.15, volatilityMul: 1.0, duration: 25 * 60, type: 'bad'
    },
    {
        id: 'food_viral_menu',
        headline: '📰 Food: เมนูใหม่ "ข้าวเหนียวมะม่วงปั่น" ไวรัลทั่ว TikTok',
        targetStockId: 'FOOD',
        trendBias: 0.25, volatilityMul: 1.8, duration: 15 * 60, type: 'good'
    },
    {
        id: 'food_poisoning',
        headline: '📰 Food: ดราม่า! ลูกค้าเจอแมลงสาบในชานม แบรนด์สั่งปิดสาขา',
        targetStockId: 'FOOD',
        trendBias: -0.35, volatilityMul: 2.5, duration: 15 * 60, type: 'bad'
    },
    {
        id: 'food_delivery_boom',
        headline: '📰 Food: ฝนตกหนัก! ยอดสั่งเดลิเวอรี่พุ่งกระฉูด',
        targetStockId: 'FOOD',
        trendBias: 0.15, volatilityMul: 1.0, duration: 10 * 60, type: 'good'
    },
    {
        id: 'food_health_trend',
        headline: '📰 Food: เทรนด์รักสุขภาพมาแรง เมนูคลีนขายดีเทน้ำเทท่า',
        targetStockId: 'FOOD',
        trendBias: 0.1, volatilityMul: 1.0, duration: 20 * 60, type: 'good'
    },

    // --- ENERGY SECTOR (Global Impact) ---
    {
        id: 'ergy_oil_spike',
        headline: '📰 Energy: วิกฤตตะวันออกกลาง! ราคาน้ำมันโลกพุ่งทะลุ 100 เหรียญ',
        targetStockId: 'ERGY',
        trendBias: 0.5, volatilityMul: 3.0, duration: 15 * 60, type: 'good'
    },
    {
        id: 'ergy_green_policy',
        headline: '📰 Energy: รัฐฯ อัดฉีดงบพลังงานสะอาด หุ้นถ่านหินร่วง',
        targetStockId: 'ERGY',
        trendBias: -0.2, volatilityMul: 1.5, duration: 25 * 60, type: 'bad'
    },
    {
        id: 'ergy_winter',
        headline: '📰 Energy: ฤดูหนาวมาเยือน! ความต้องการใช้ก๊าซเพิ่มสูงขึ้น',
        targetStockId: 'ERGY',
        trendBias: 0.2, volatilityMul: 1.2, duration: 20 * 60, type: 'good'
    },
    {
        id: 'ergy_pipeline_leak',
        headline: '📰 Energy: ท่อส่งก๊าซรั่วในทะเล! ต้องระงับการผลิตชั่วคราว',
        targetStockId: 'ERGY',
        trendBias: -0.4, volatilityMul: 2.0, duration: 15 * 60, type: 'bad'
    },
    {
        id: 'ergy_fusion_breakthrough',
        headline: '📰 Energy: นักวิทย์ค้นพบพลังงานฟิวชั่น! อนาคตพลังงานเปลี่ยน',
        targetStockId: 'ERGY',
        trendBias: -0.1, volatilityMul: 4.0, duration: 10 * 60, type: 'bad' // Bad for oil companies
    },
    {
        id: 'ergy_ev_boom',
        headline: '📰 Energy: ยอดขายรถ EV พุ่ง! ปั๊มน้ำมันเร่งปรับตัว',
        targetStockId: 'ERGY',
        trendBias: -0.15, volatilityMul: 1.5, duration: 20 * 60, type: 'bad'
    },

    // --- PROPERTY SECTOR (Slow moving) ---
    {
        id: 'prop_stimulus',
        headline: '📰 Prop: รัฐฯ ลดค่าโอน-จดจำนอง กระตุ้นอสังหาฯ ท้ายปี',
        targetStockId: 'PROP',
        trendBias: 0.2, volatilityMul: 1.0, duration: 40 * 60, type: 'good'
    },
    {
        id: 'prop_bubble_fear',
        headline: '📰 Prop: คอนโดล้นตลาด! นักวิเคราะห์เตือนระวังฟองสบู่แตก',
        targetStockId: 'PROP',
        trendBias: -0.2, volatilityMul: 1.5, duration: 30 * 60, type: 'bad'
    },
    {
        id: 'prop_mrt_new',
        headline: '📰 Prop: รถไฟฟ้าสายสีม่วงเปิดให้บริการ! ราคาที่ดินแนวรถไฟฟ้าพุ่ง',
        targetStockId: 'PROP',
        trendBias: 0.25, volatilityMul: 1.2, duration: 30 * 60, type: 'good'
    },
    {
        id: 'prop_material_cost',
        headline: '📰 Prop: ราคาเหล็กและปูนซีเมนต์พุ่ง กระทบกำไรผู้รับเหมา',
        targetStockId: 'PROP',
        trendBias: -0.1, volatilityMul: 1.0, duration: 25 * 60, type: 'bad'
    },
    {
        id: 'prop_foreign_limit',
        headline: '📰 Prop: จำกัดโควต้าต่างชาติซื้อคอนโด! ตลาดชะลอตัว',
        targetStockId: 'PROP',
        trendBias: -0.15, volatilityMul: 1.0, duration: 20 * 60, type: 'bad'
    },
    {
        id: 'prop_office_renov',
        headline: '📰 Prop: เทรนด์ออฟฟิศยุคใหม่มาแรง! ยอดเช่าพื้นที่เกรด A เต็ม',
        targetStockId: 'PROP',
        trendBias: 0.15, volatilityMul: 0.8, duration: 30 * 60, type: 'good'
    },

    // --- MARKET WIDE ---
    {
        id: 'mkt_bull_run',
        headline: '📰 Market: ต่างชาติซื้อสุทธิ 5 พันล้าน! ดัน SET Index ทะลุแนวต้าน',
        targetStockId: 'ALL',
        trendBias: 0.2, volatilityMul: 1.5, duration: 20 * 60, type: 'good'
    },
    {
        id: 'mkt_bear_crash',
        headline: '📰 Market: Black Monday! ตลาดหุ้นทั่วโลกแดงเถือก',
        targetStockId: 'ALL',
        trendBias: -0.3, volatilityMul: 3.0, duration: 15 * 60, type: 'bad'
    },
    {
        id: 'mkt_stable_holiday',
        headline: '📰 Market: ปริมาณการซื้อขายเบาบางก่อนวันหยุดยาว',
        targetStockId: 'ALL',
        trendBias: 0, volatilityMul: 0.2, duration: 30 * 60, type: 'neutral'
    }
];

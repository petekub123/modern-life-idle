// data/stocks.js - Stock data for Modern Life: Idle RPG

export const STOCKS = {
    'TECH': {
        id: 'TECH',
        name: 'เทคคอร์ป',
        icon: '💻',
        description: 'บริษัทเทคโนโลยีชั้นนำ',
        basePrice: 100,
        volatility: 0.15, // High volatility
        dividendRate: 0 // No dividend
    },
    'BANK': {
        id: 'BANK',
        name: 'ธนาคารไทย',
        icon: '🏦',
        description: 'ธนาคารเก่าแก่ มั่นคง',
        basePrice: 50,
        volatility: 0.05, // Low volatility
        dividendRate: 0.02 // 2% daily
    },
    'FOOD': {
        id: 'FOOD',
        name: 'ฟู้ดแลนด์',
        icon: '🍔',
        description: 'เครือร้านอาหารขนาดใหญ่',
        basePrice: 30,
        volatility: 0.08, // Medium volatility
        dividendRate: 0.01 // 1% daily
    },
    'ERGY': {
        id: 'ERGY',
        name: 'พลังงานไทย',
        icon: '⚡',
        description: 'พลังงานและน้ำมัน ผันผวนสูง',
        basePrice: 80,
        volatility: 0.25, // Very high volatility
        dividendRate: 0.005 // 0.5% daily
    },
    'PROP': {
        id: 'PROP',
        name: 'อสังหาริมทรัพย์',
        icon: '🏢',
        description: 'อสังหาฯระดับพรีเมียม มั่นคง',
        basePrice: 200,
        volatility: 0.03, // Very low volatility
        dividendRate: 0.03 // 3% daily
    }
};

export function getStockById(id) {
    return STOCKS[id];
}

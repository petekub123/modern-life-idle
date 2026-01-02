// systems/stock.js - Stock Market System for Modern Life: Idle RPG
import { STOCKS, getStockById } from '../data/stocks.js';

export class StockSystem {
    constructor(game) {
        this.game = game;

        // Current prices (change daily)
        this.currentPrices = {};

        // Player's portfolio: { stockId: { shares: number, avgCost: number } }
        this.portfolio = {};

        // Initialize prices
        Object.keys(STOCKS).forEach(id => {
            this.currentPrices[id] = STOCKS[id].basePrice;
        });
    }

    load(data) {
        if (data) {
            this.currentPrices = data.currentPrices || {};
            this.portfolio = data.portfolio || {};

            // Ensure all stocks have prices
            Object.keys(STOCKS).forEach(id => {
                if (!this.currentPrices[id]) {
                    this.currentPrices[id] = STOCKS[id].basePrice;
                }
            });
        }
    }

    // Get current price for a stock
    getPrice(stockId) {
        return this.currentPrices[stockId] || STOCKS[stockId]?.basePrice || 0;
    }

    // Get shares owned
    getShares(stockId) {
        return this.portfolio[stockId]?.shares || 0;
    }

    // Get average cost basis
    getAvgCost(stockId) {
        return this.portfolio[stockId]?.avgCost || 0;
    }

    // Buy shares (uses bank money)
    buy(stockId, shares) {
        const stock = getStockById(stockId);
        if (!stock || shares <= 0) return false;

        const price = this.getPrice(stockId);
        const totalCost = price * shares;

        // Use bank money for stocks
        if (!this.game.bankSystem.spendFromBank(totalCost)) {
            this.game.ui.showToast('เงินในบัญชีธนาคารไม่พอ! ฝากเงินก่อน');
            return false;
        }

        // Update portfolio
        if (!this.portfolio[stockId]) {
            this.portfolio[stockId] = { shares: 0, avgCost: 0 };
        }

        const existing = this.portfolio[stockId];
        const newTotalShares = existing.shares + shares;
        const newAvgCost = ((existing.shares * existing.avgCost) + (shares * price)) / newTotalShares;

        this.portfolio[stockId] = {
            shares: newTotalShares,
            avgCost: Math.round(newAvgCost * 100) / 100
        };

        this.game.ui.log(`📈 ซื้อหุ้น ${stock.icon} ${stock.name} x${shares} @ ${price}฿`);
        this.game.sound?.playClick();
        this.game.saveSystem.save();

        return true;
    }

    // Sell shares
    sell(stockId, shares) {
        const stock = getStockById(stockId);
        if (!stock || shares <= 0) return false;

        const owned = this.getShares(stockId);
        if (owned < shares) {
            this.game.ui.showToast('หุ้นไม่พอขาย!');
            return false;
        }

        const price = this.getPrice(stockId);
        const avgCost = this.getAvgCost(stockId);
        const revenue = price * shares;
        const profit = (price - avgCost) * shares;

        // Add to bank account
        this.game.bankSystem.addToBank(revenue);

        // Update portfolio
        this.portfolio[stockId].shares -= shares;
        if (this.portfolio[stockId].shares <= 0) {
            delete this.portfolio[stockId];
        }

        const profitText = profit >= 0 ? `+${Math.floor(profit)}฿` : `${Math.floor(profit)}฿`;
        this.game.ui.log(`📉 ขายหุ้น ${stock.icon} ${stock.name} x${shares} @ ${price}฿ (${profitText})`);
        this.game.sound?.playMoneyGain();
        this.game.saveSystem.save();

        return true;
    }

    // Update prices daily (called from main.js on new day)
    updatePrices() {
        Object.keys(STOCKS).forEach(stockId => {
            const stock = STOCKS[stockId];
            const currentPrice = this.currentPrices[stockId];

            // Random price change based on volatility
            const changePercent = (Math.random() - 0.5) * 2 * stock.volatility;
            let newPrice = currentPrice * (1 + changePercent);

            // Clamp to reasonable range (20% - 300% of base price)
            const minPrice = stock.basePrice * 0.2;
            const maxPrice = stock.basePrice * 3;
            newPrice = Math.max(minPrice, Math.min(maxPrice, newPrice));

            this.currentPrices[stockId] = Math.round(newPrice * 100) / 100;
        });

        this.game.ui.log('📊 ตลาดหุ้นอัพเดทราคาแล้ว');
    }

    // Process daily dividends
    processDividends() {
        let totalDividend = 0;

        Object.entries(this.portfolio).forEach(([stockId, holding]) => {
            const stock = STOCKS[stockId];
            if (stock && stock.dividendRate > 0 && holding.shares > 0) {
                const price = this.getPrice(stockId);
                const dividend = Math.floor(price * holding.shares * stock.dividendRate);
                if (dividend > 0) {
                    totalDividend += dividend;
                }
            }
        });

        if (totalDividend > 0) {
            // Dividends go to bank account
            this.game.bankSystem.addToBank(totalDividend);
            this.game.ui.log(`💰 รับเงินปันผล +${totalDividend}฿ (เข้าบัญชีธนาคาร)`);
        }

        return totalDividend;
    }

    // Get total portfolio value
    getPortfolioValue() {
        let total = 0;
        Object.entries(this.portfolio).forEach(([stockId, holding]) => {
            total += this.getPrice(stockId) * holding.shares;
        });
        return Math.floor(total);
    }

    // Get total profit/loss
    getPortfolioProfitLoss() {
        let totalValue = 0;
        let totalCost = 0;

        Object.entries(this.portfolio).forEach(([stockId, holding]) => {
            totalValue += this.getPrice(stockId) * holding.shares;
            totalCost += holding.avgCost * holding.shares;
        });

        return Math.floor(totalValue - totalCost);
    }

    // Get all stocks with current info
    getAllStocksInfo() {
        return Object.values(STOCKS).map(stock => ({
            ...stock,
            currentPrice: this.getPrice(stock.id),
            shares: this.getShares(stock.id),
            avgCost: this.getAvgCost(stock.id),
            value: this.getPrice(stock.id) * this.getShares(stock.id),
            profitLoss: (this.getPrice(stock.id) - this.getAvgCost(stock.id)) * this.getShares(stock.id)
        }));
    }

    toJSON() {
        return {
            currentPrices: this.currentPrices,
            portfolio: this.portfolio
        };
    }
}

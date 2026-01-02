// systems/furniture.js - Furniture System for Modern Life: Idle RPG
import { FURNITURE, getFurnitureById } from '../data/furniture.js';

export class FurnitureSystem {
    constructor(game) {
        this.game = game;
        this.ownedFurniture = []; // Array of furniture IDs
    }

    load(data) {
        if (data) {
            this.ownedFurniture = data.ownedFurniture || [];
        }
    }

    // Check if player owns specific furniture
    hasFurniture(id) {
        return this.ownedFurniture.includes(id);
    }

    // Buy furniture
    buy(furnitureId) {
        const item = getFurnitureById(furnitureId);
        if (!item) return false;

        if (this.hasFurniture(furnitureId)) {
            this.game.ui.showToast('คุณมีเฟอร์นิเจอร์ชิ้นนี้แล้ว!');
            return false;
        }

        // Check money
        if (!this.game.player.spendMoney(item.price)) {
            this.game.ui.showToast('เงินไม่พอซื้อเฟอร์นิเจอร์!');
            return false;
        }

        // Check housing requirement (optional logic for future: capacity?)
        // For now, assume unlimited space or abstract slots

        this.ownedFurniture.push(furnitureId);
        this.game.ui.log(`🛋️ ซื้อเฟอร์นิเจอร์ใหม่: ${item.name}`);
        this.game.sound?.playClick(); // Or specific buy sound
        this.game.saveSystem.save();

        return true;
    }

    // Calculate bonus for specific effect type
    getBonusEffect(type) {
        let bonus = 0;
        this.ownedFurniture.forEach(id => {
            const item = getFurnitureById(id);
            if (item && item.effect && item.effect.type === type) {
                bonus += item.effect.value;
            }
        });
        return bonus;
    }

    // Get list of owned furniture objects
    getOwnedItems() {
        return this.ownedFurniture.map(id => getFurnitureById(id)).filter(i => i);
    }

    // Process daily furniture effects (stress reduction, etc.)
    processDaily() {
        let stressReduction = 0;
        let healthBonus = 0;
        let expenseReduction = 0;

        this.ownedFurniture.forEach(id => {
            const item = getFurnitureById(id);
            if (item && item.effect) {
                if (item.effect.type === 'daily_stress') stressReduction += Math.abs(item.effect.value);
                if (item.effect.type === 'daily_health') healthBonus += item.effect.value;
                if (item.effect.type === 'daily_expense') expenseReduction += Math.abs(item.effect.value);
            }
        });

        // Apply effects
        if (stressReduction > 0) {
            this.game.player.modifyStress(-stressReduction);
            this.game.ui.log(`🏠 บ้านแสนสุขช่วยลดเครียด -${stressReduction}`);
        }

        if (healthBonus > 0) {
            this.game.player.modifyHealth(healthBonus);
        }

        // Expense reduction is handled in main.js expenses calculation via helper method
        return expenseReduction;
    }

    toJSON() {
        return {
            ownedFurniture: this.ownedFurniture
        };
    }
}

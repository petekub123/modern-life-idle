import { ITEMS } from '../data/items.js';

export class InventorySystem {
    constructor(game) {
        this.game = game;
        this.items = {}; // { itemId: count }
        this.equipment = []; // [itemId]
    }

    load(data) {
        if (data) {
            this.items = data.items || {};
            this.equipment = data.equipment || [];
        }
    }

    buyItem(itemId) {
        const item = ITEMS[itemId];
        if (!item) return false;

        if (this.game.player.spendMoney(item.price)) {
            if (item.type === 'equipment') {
                if (!this.equipment.includes(itemId)) {
                    this.equipment.push(itemId);
                    this.game.ui.log(`ซื้อของใหม่: ${item.name}`);
                } else {
                    this.game.ui.log(`มี ${item.name} อยู่แล้ว`);
                    this.game.player.addMoney(item.price); // Refund
                    return false;
                }
            } else {
                this.items[itemId] = (this.items[itemId] || 0) + 1;
                this.game.ui.log(`ซื้อไอเทม: ${item.name}`);
            }
            this.game.saveSystem.save();
            return true;
        } else {
            this.game.ui.log(`เงินไม่พอซื้อ ${item.name}`);
            return false;
        }
    }

    useItem(itemId) {
        if (!this.items[itemId] || this.items[itemId] <= 0) return false;

        const item = ITEMS[itemId];
        if (item.type !== 'consumable') return false;

        // Apply Effect
        if (item.effect.type === 'energy') {
            this.game.player.modifyEnergy(item.effect.value);
        } else if (item.effect.type === 'stress') {
            this.game.player.modifyStress(item.effect.value);
        } else if (item.effect.type === 'health') {
            this.game.player.modifyHealth(item.effect.value);
        }

        // Side effects
        if (item.effect.stress) {
            this.game.player.modifyStress(item.effect.stress);
        }

        this.items[itemId]--;
        this.game.ui.log(`ใช้ไอเทม: ${item.name}`);
        this.game.ui.renderShop(); // Update shop/bag UI
        return true;
    }

    hasEquipment(itemId) {
        return this.equipment.includes(itemId);
    }

    getPassiveIncomeMultiplier() {
        let mult = 1.0;
        this.equipment.forEach(id => {
            const item = ITEMS[id];
            if (item && item.effect.type === 'passive_income_mult') {
                mult += item.effect.value;
            }
        });
        return mult;
    }

    toJSON() {
        return {
            items: this.items,
            equipment: this.equipment
        };
    }
}

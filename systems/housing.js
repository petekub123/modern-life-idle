// systems/housing.js - Housing System for Modern Life: Idle RPG
import { PROPERTIES, getPropertyById } from '../data/properties.js';

export class HousingSystem {
    constructor(game) {
        this.game = game;
        this.currentPropertyId = 'shared_room';
        this.ownedProperties = []; // List of property IDs the player owns
    }

    load(data) {
        if (data) {
            this.currentPropertyId = data.currentPropertyId || 'shared_room';
            this.ownedProperties = data.ownedProperties || [];
        }
    }

    get currentProperty() {
        return getPropertyById(this.currentPropertyId);
    }

    // Check if player can rent a property
    canRent(propertyId) {
        const property = getPropertyById(propertyId);
        if (!property) return false;
        if (!property.unlockRequirements) return true;

        const req = property.unlockRequirements;
        if (req.money && this.game.player.money < req.money) return false;

        return true;
    }

    // Check if player can buy a property
    canBuy(propertyId) {
        const property = getPropertyById(propertyId);
        if (!property || !property.buyPrice) return false;
        if (this.ownedProperties.includes(propertyId)) return false; // Already owns

        return this.game.player.money >= property.buyPrice;
    }

    // Check if player owns a property
    owns(propertyId) {
        return this.ownedProperties.includes(propertyId);
    }

    // Rent a property (switch to it)
    rent(propertyId) {
        if (!this.canRent(propertyId)) return false;

        const property = getPropertyById(propertyId);
        this.currentPropertyId = propertyId;

        this.game.ui.log(`🏠 ย้ายไปอยู่ ${property.icon} ${property.name}`);
        this.game.sound?.playClick();

        return true;
    }

    // Buy a property
    buy(propertyId) {
        if (!this.canBuy(propertyId)) return false;

        const property = getPropertyById(propertyId);

        if (!this.game.player.spendMoney(property.buyPrice)) {
            return false;
        }

        this.ownedProperties.push(propertyId);
        this.currentPropertyId = propertyId;

        this.game.ui.log(`🏡 ซื้อ ${property.icon} ${property.name} เรียบร้อย!`);
        this.game.sound?.playMoneyLoss();

        return true;
    }

    // Get daily rent cost (0 if owned)
    getDailyRent() {
        if (this.owns(this.currentPropertyId)) {
            return 0; // No rent if owned
        }
        return this.currentProperty.rentPerDay;
    }

    // Get expense reduction multiplier
    getExpenseReduction() {
        return this.currentProperty.expenseReduction || 0;
    }

    // Calculate total daily expenses (living cost + rent)
    getDailyExpenses() {
        const baseExpenses = 250; // Food + transport base cost
        const reduction = this.getExpenseReduction();
        const livingCost = Math.floor(baseExpenses * (1 - reduction));
        const rent = this.getDailyRent();

        return livingCost + rent;
    }

    // Get available properties (for UI)
    getAvailableProperties() {
        return PROPERTIES.map(prop => ({
            ...prop,
            canRent: this.canRent(prop.id),
            canBuy: this.canBuy(prop.id),
            isOwned: this.owns(prop.id),
            isCurrent: this.currentPropertyId === prop.id
        }));
    }

    toJSON() {
        return {
            currentPropertyId: this.currentPropertyId,
            ownedProperties: this.ownedProperties
        };
    }
}

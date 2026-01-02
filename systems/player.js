export class Player {
    constructor() {
        this.stats = {
            money: 0,
            energy: 100,
            maxEnergy: 100,
            stress: 0,
            maxStress: 100,
            health: 100,
            maxHealth: 100,
            xp: 0,
            level: 1,
            daysWorked: 0 // Total days worked for career progression
        };
    }

    load(data) {
        if (data) {
            this.stats = { ...this.stats, ...data };
        }
    }

    get money() { return this.stats.money; }
    get energy() { return this.stats.energy; }
    get maxEnergy() { return this.stats.maxEnergy; }
    get stress() { return this.stats.stress; }
    get maxStress() { return this.stats.maxStress; }
    get health() { return this.stats.health; }
    get maxHealth() { return this.stats.maxHealth; }
    get daysWorked() { return this.stats.daysWorked || 0; }

    addDayWorked() {
        this.stats.daysWorked++;
    }

    addMoney(amount) {
        this.stats.money += amount;
        // Play sound if game reference exists
        if (this.game && this.game.sound) {
            this.game.sound.playMoneyGain();
        }
        return amount; // return actual added
    }

    spendMoney(amount) {
        if (this.stats.money >= amount) {
            this.stats.money -= amount;
            if (this.game && this.game.sound) {
                this.game.sound.playMoneyLoss();
            }
            return true;
        }
        return false;
    }

    modifyEnergy(amount) {
        this.stats.energy = Math.min(this.stats.maxEnergy, Math.max(0, this.stats.energy + amount));
    }

    modifyStress(amount) {
        this.stats.stress = Math.min(this.stats.maxStress, Math.max(0, this.stats.stress + amount));
    }

    modifyHealth(amount) {
        this.stats.health = Math.min(this.stats.maxHealth, Math.max(0, this.stats.health + amount));
    }

    regenerate() {
        // Health Logic (not too harsh):
        // - High stress (>70) slowly damages health
        // - Very low energy (<20) slowly damages health
        // - Low stress (<30) and enough energy (>50) slowly heals

        const stress = this.stats.stress;
        const energy = this.stats.energy;

        // Stress damage (0.5 per tick if stress > 70)
        if (stress > 70) {
            this.modifyHealth(-0.5);
        }

        // Exhaustion damage (0.3 per tick if energy < 20)
        if (energy < 20) {
            this.modifyHealth(-0.3);
        }

        // Natural healing (0.2 per tick if stress < 30 and energy > 50)
        if (stress < 30 && energy > 50) {
            this.modifyHealth(0.2);
        }
    }

    // Check if player is too sick to work efficiently
    isUnhealthy() {
        return this.stats.health < 30;
    }

    toJSON() {
        return this.stats;
    }
}

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
            level: 1
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
    get health() { return this.stats.health; }

    addMoney(amount) {
        this.stats.money += amount;
        return amount; // return actual added
    }

    spendMoney(amount) {
        if (this.stats.money >= amount) {
            this.stats.money -= amount;
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
        // Passive regen rules can go here
    }

    toJSON() {
        return this.stats;
    }
}

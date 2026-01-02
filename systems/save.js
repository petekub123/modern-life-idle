export class SaveSystem {
    constructor(game) {
        this.game = game;
        this.KEY = 'modern-life-idle-save-v1';
    }

    save() {
        const data = {
            player: this.game.player.toJSON(),
            time: this.game.timeSystem.toJSON(),
            job: this.game.jobSystem.toJSON(),
            inventory: this.game.inventorySystem.toJSON(),
            skills: this.game.skillSystem.toJSON(),
            timestamp: Date.now()
        };
        try {
            localStorage.setItem(this.KEY, JSON.stringify(data));
            console.log("Game saved.");
            this.game.ui.showToast("บันทึกเกมแล้ว");
        } catch (e) {
            console.error("Save failed", e);
        }
    }

    load() {
        try {
            const raw = localStorage.getItem(this.KEY);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) {
            console.error("Load failed", e);
            return null;
        }
    }

    clear() {
        localStorage.removeItem(this.KEY);
    }
}

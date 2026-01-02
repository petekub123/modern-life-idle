export class TimeSystem {
    constructor() {
        this.data = {
            startTime: Date.now(),
            lastSaveTime: Date.now(),
            gameTime: 0 // In-game seconds
        };
        this.currentDay = 1;
    }

    load(data) {
        if (data) {
            this.data = { ...this.data, ...data };
            this.currentDay = Math.floor(this.getGameTimeTotalSeconds() / (24 * 3600)) + 1;
        }
    }

    tick() {
        this.data.gameTime += 60; // 1 real sec = 1 in-game minute
    }

    getGameTimeTotalSeconds() {
        // Start time offset is 8:00 AM (8 * 3600)
        return this.data.gameTime + (8 * 3600);
    }

    checkDayAdvanced() {
        const calculatedDay = Math.floor(this.getGameTimeTotalSeconds() / (24 * 3600)) + 1;
        if (calculatedDay > this.currentDay) {
            this.currentDay = calculatedDay;
            return true;
        }
        return false;
    }

    getOfflineSeconds() {
        const now = Date.now();
        const diff = (now - this.data.lastSaveTime) / 1000;
        return diff > 0 ? diff : 0;
    }

    advanceTime(seconds) {
        this.data.gameTime += seconds;
    }

    updateLastSaveTime() {
        this.data.lastSaveTime = Date.now();
    }

    getFormattedTime() {
        // Simple mock time: Start at 8:00 AM, add gameTime seconds
        // 1 real second = 1 in-game minute? No, let's keep it 1:1 for idle simplicity or faster?
        // Let's say 1 tick (1 sec) = 10 minutes in game to make days pass? 
        // Or keep it real time? Real time is boring for "Day 1".
        // Let's do: 1 real second = 1 real second for idle mechanics, 
        // but display Day X based on playtime?
        // ACTUALLY: User said "Idle", usually means fast time.
        // Let's just return Day + H:M based on raw seconds.

        // Let's assume day starts at 8:00
        const startOffset = 8 * 3600;
        const totalSeconds = this.data.gameTime + startOffset;

        const days = Math.floor(totalSeconds / (24 * 3600)) + 1;
        const timeInDay = totalSeconds % (24 * 3600);
        const hours = Math.floor(timeInDay / 3600);
        const minutes = Math.floor((timeInDay % 3600) / 60);

        const pad = (n) => n.toString().padStart(2, '0');
        return `Day ${days} - ${pad(hours)}:${pad(minutes)}`;
    }

    toJSON() {
        this.updateLastSaveTime();
        return this.data;
    }
}

import { EVENTS } from '../data/events.js';

export class EventSystem {
    constructor(game) {
        this.game = game;
        this.accumulator = 0;
        this.newsAccumulator = 0;
        this.CHECK_RATE = 60; // Event check every 60s
        this.NEWS_RATE = 120; // News check every 120s (2 mins)
    }

    tick() {
        this.accumulator++;
        if (this.accumulator >= this.CHECK_RATE) {
            this.accumulator = 0;
            this.tryTriggerEvent();
        }

        // News ticker logic removed or can be replaced with static news later
    }

    async updateNews() {
        // AI News removed
    }

    async tryTriggerEvent() {
        // Roll for Event Chance (e.g. 30% per minute to have *something* happen)
        if (Math.random() > 0.3) return;

        // Standard Logic
        const validEvents = EVENTS.filter(e => {
            if (e.condition && !e.condition(this.game)) return false;
            return true;
        });

        for (const event of validEvents) {
            if (Math.random() < event.chance) {
                this.trigger(event);
                return; // Trigger max 1 event
            }
        }
    }

    trigger(event) {
        console.log(`Event Triggered: ${event.title}`);

        // Apply effects
        if (event.effects) {
            if (event.effects.money) this.game.player.addMoney(event.effects.money);
            if (event.effects.energy) this.game.player.modifyEnergy(event.effects.energy);
            if (event.effects.stress) this.game.player.modifyStress(event.effects.stress);
            if (event.effects.health) this.game.player.modifyHealth(event.effects.health);
        }

        // Notify UI
        this.game.ui.showEventModal(event);

        const prefix = event.type === 'ai' ? '🤖' : '🎲';
        this.game.ui.log(`${prefix} เหตุการณ์: ${event.title}`);

        this.game.saveSystem.save();
    }
}

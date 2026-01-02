import { ACTIVITIES } from '../data/activities.js';

export class ActivitySystem {
    constructor(game) {
        this.game = game;
    }

    perform(activityId) {
        const act = ACTIVITIES[activityId];
        if (!act) return false;

        // Validation
        if (this.game.player.money < act.moneyCost) {
            this.game.ui.log(`เงินไม่พอสำหรับ ${act.name}`);
            return false;
        }

        if (act.energyChange < 0 && this.game.player.energy < Math.abs(act.energyChange)) {
            this.game.ui.log(`พลังงานไม่พอสำหรับ ${act.name}`);
            return false;
        }

        // Execute
        this.game.player.spendMoney(act.moneyCost);
        this.game.player.modifyEnergy(act.energyChange);
        this.game.player.modifyStress(act.stressChange);
        this.game.player.modifyHealth(act.healthChange);

        // Time pass
        this.game.timeSystem.advanceTime(act.timeCostSeconds);

        // Feedback
        this.game.ui.log(`คุณทำกิจกรรม: ${act.name}`);
        this.game.saveSystem.save(); // Auto save on big decisions

        return true;
    }
}

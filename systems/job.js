import { JOBS } from '../data/jobs.js';

export class JobSystem {
    constructor(player) {
        this.player = player;
        this.currentJobId = null;
        this.workProgress = 0;
        this.isWorking = false;
        this.availableGigs = [];
    }

    load(data) {
        if (data) {
            this.currentJobId = data.currentJobId;
            this.workProgress = data.workProgress || 0;
            this.isWorking = data.isWorking || false;
            // Gigs are ephemeral, no need to save/load? or maybe save for session?
            // Let's reset them for now.
        }
    }

    get currentJob() {
        return JOBS[this.currentJobId];
    }

    // Check if player meets job requirements
    canApplyForJob(jobId) {
        const job = JOBS[jobId];
        if (!job) return false;
        if (!job.requirements) return true; // No requirements = always available

        const reqs = job.requirements;
        if (reqs.money && this.player.money < reqs.money) return false;
        if (reqs.daysWorked && this.player.daysWorked < reqs.daysWorked) return false;
        // Future: can add skill requirements here
        return true;
    }

    setJob(jobId) {
        const job = JOBS[jobId];
        if (job && this.canApplyForJob(jobId)) {
            this.currentJobId = jobId;
            this.workProgress = 0;
            this.isWorking = true;
            return true;
        }
        return false;
    }

    tick() {
        if (!this.currentJobId || !this.isWorking) return;

        const job = this.currentJob;

        if (this.player.energy >= job.energyCostPerSec) {
            this.player.modifyEnergy(-job.energyCostPerSec);
            this.player.modifyStress(job.stressPerSec);

            let income = job.incomePerSec;

            // Equipment Bonuses
            if (this.player.game && this.player.game.inventorySystem) {
                income *= this.player.game.inventorySystem.getPassiveIncomeMultiplier();
            }

            // Stress Penalty: If stress > 80, income reduced by 50%
            if (this.player.stress > 80) {
                income *= 0.5;
            }

            this.player.addMoney(income);

            // Progress visual only for now, since it's continuous income
            this.workProgress = (this.workProgress + 10) % 100;
        } else {
            // Out of energy, stop working
            this.isWorking = false;
        }
    }

    calculateOfflineIncome(seconds) {
        if (!this.currentJobId || !this.isWorking) return { money: 0 };

        const job = this.currentJob;
        // Total cost
        const totalEnergyCost = job.energyCostPerSec * seconds;

        // How much can we actually afford?
        let workableSeconds = seconds;
        if (this.player.energy < totalEnergyCost) {
            workableSeconds = Math.floor(this.player.energy / job.energyCostPerSec);
        }

        if (workableSeconds <= 0) return { money: 0 };

        const moneyEarned = workableSeconds * job.incomePerSec;
        const energyConsumed = workableSeconds * job.energyCostPerSec;
        const stressInc = workableSeconds * job.stressPerSec;

        this.player.modifyEnergy(-energyConsumed);
        this.player.modifyStress(stressInc);

        if (this.player.energy <= 0) {
            this.isWorking = false;
        }

        return { money: moneyEarned };
    }

    toggleWork() {
        if (this.isWorking) {
            this.isWorking = false;
        } else {
            if (this.currentJobId && this.player.energy > 0) {
                this.isWorking = true;
            }
        }
    }

    // --- Gig System ---
    async refreshGigs(aiService) {
        this.availableGigs = [];
        const gigs = await aiService.generateJobs();
        this.availableGigs = gigs;
        return gigs;
    }

    doGig(gig) {
        if (this.player.energy >= gig.energy) {
            this.player.modifyEnergy(-gig.energy);
            this.player.modifyStress(gig.stress);
            this.player.addMoney(gig.pay);

            // Remove gig from available?
            this.availableGigs = this.availableGigs.filter(g => g.id !== gig.id);

            return true;
        }
        return false;
    }

    toJSON() {
        return {
            currentJobId: this.currentJobId,
            workProgress: this.workProgress,
            isWorking: this.isWorking
        };
    }
}

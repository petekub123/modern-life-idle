import { JOBS } from '../data/jobs.js';

export class JobSystem {
    constructor(player) {
        this.player = player;
        this.currentJobId = 'unemployed';
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
        // Legacy support or direct set
        const job = JOBS[jobId];
        if (job) {
            this.currentJobId = jobId;
            this.workProgress = 0;
            this.isWorking = false;
            return true;
        }
        return false;
    }

    // --- Career Track Logic ---

    getNextJobInTrack() {
        if (!this.currentJobId) return null;
        const current = this.currentJob;
        // Find job with same track and next tier
        return Object.values(JOBS).find(j => j.track === current.track && j.tier === current.tier + 1);
    }

    canPromote() {
        const nextJob = this.getNextJobInTrack();
        if (!nextJob) return { can: false, reason: 'Max Level' };

        return this.checkRequirements(nextJob);
    }

    checkRequirements(job) {
        if (!job.requirements && !job.reqSkill) return { can: true };

        const reasons = [];

        // Money
        if (job.requirements?.money && this.player.money < job.requirements.money) {
            reasons.push(`เงินเก็บ: ${this.player.money}/${job.requirements.money}`);
        }

        // Days Worked
        if (job.requirements?.daysWorked && this.player.daysWorked < job.requirements.daysWorked) {
            reasons.push(`อายุงาน: ${this.player.daysWorked}/${job.requirements.daysWorked} วัน`);
        }

        // Skill
        if (job.reqSkill) {
            const skillLevel = this.player.game.skillSystem.getSkillLevel(job.reqSkill.id);
            if (skillLevel < job.reqSkill.level) {
                reasons.push(`${this.player.game.skillSystem.getSkillName(job.reqSkill.id)} Lv.${job.reqSkill.level}`);
            }
        }

        return {
            can: reasons.length === 0,
            reasons: reasons
        };
    }

    promote() {
        const check = this.canPromote();
        if (!check.can) return false;

        const nextJob = this.getNextJobInTrack();
        if (nextJob) {
            this.currentJobId = nextJob.id;
            this.isWorking = false; // Stop working to celebrate
            this.player.game.ui.showEventModal({
                title: '🎉 เลื่อนตำแหน่ง! 🎉',
                desc: `ยินดีด้วย! คุณได้รับการเลื่อนขั้นเป็น ${nextJob.name}\nรายได้เพิ่มเป็น ${nextJob.incomePerSec}฿/วินาที`,
                effects: {}
            });
            return true;
        }
        return false;
    }

    switchJob(targetJobId) {
        const job = JOBS[targetJobId];
        if (!job) return false;

        // Verify requirements again just in case
        const check = this.checkRequirements(job);
        if (!check.can) return false;

        this.currentJobId = targetJobId;
        this.isWorking = false;
        this.player.game.ui.showToast(`ย้ายสายงานไปเป็น ${job.name} แล้ว!`);
        return true;
    }

    stopWork() {
        this.isWorking = false;
    }

    // Check and warn about high stress
    checkStressWarning() {
        if (this.player.stress >= 90 && this.isWorking && !this.stressWarned) {
            this.stressWarned = true;
            if (this.player.game && this.player.game.ui) {
                this.player.game.ui.showToast('⚠️ เครียดมาก! ควรหยุดพักก่อนจะป่วย!');
                this.player.game.ui.log('⚠️ ความเครียดสูงมาก! พักเถอะ!');
            }
        } else if (this.player.stress < 80) {
            this.stressWarned = false;
        }
    }

    tick() {
        // Check stress warning
        this.checkStressWarning();

        if (!this.currentJobId || !this.isWorking) return;

        const job = this.currentJob;
        const perk = job.perk || {};

        // Calculate Costs with Perks
        let energyCost = job.energyCostPerSec;
        let stressCost = job.stressPerSec;

        if (perk.type === 'energy_reduction') {
            energyCost *= (1 - perk.value);
        }
        if (perk.type === 'stress_reduction') {
            stressCost *= (1 - perk.value);
        }

        if (this.player.energy >= energyCost) {
            this.player.modifyEnergy(-energyCost);
            this.player.modifyStress(stressCost);

            let income = job.incomePerSec;

            // Perk: Viral Luck (Online)
            if (perk.type === 'viral_luck') {
                if (Math.random() < perk.chance) {
                    income *= perk.multiplier;
                    // Optional: Visual cue for viral hit?
                    // if (this.player.game.ui) this.player.game.ui.showFloatingText('Viral! x' + perk.multiplier);
                }
            }

            // Perk: Tips (Delivery)
            if (perk.type === 'tips') {
                this.tickCount = (this.tickCount || 0) + 1;
                if (this.tickCount % perk.interval === 0) {
                    const bonus = income * perk.bonusRatio;
                    income += bonus;
                    // if (this.player.game.ui) this.player.game.ui.showFloatingText('Tip! +' + Math.floor(bonus));
                }
            }

            // Equipment Bonuses
            if (this.player.game && this.player.game.inventorySystem) {
                income *= this.player.game.inventorySystem.getPassiveIncomeMultiplier();
            }

            // Skill Bonuses
            if (this.player.game && this.player.game.skillSystem) {
                income *= this.player.game.skillSystem.getSkillIncomeMultiplier();

                // --- On-the-Job Training Logic ---
                // Gain 1 XP per tick (approx 1 XP/sec) for the required skill
                if (job.reqSkill) {
                    this.player.game.skillSystem.addSkillXP(job.reqSkill.id, 1);
                }
            }

            // Stress Penalty: If stress > 80, income reduced by 50%
            if (this.player.stress > 80) {
                income *= 0.5;
            }

            // Note: ไม่มี health penalty - ได้เงินปกติแม้สุขภาพต่ำ

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

        let moneyEarned = workableSeconds * job.incomePerSec;

        // Perk: Tech Automation (Offline Bonus)
        if (job.perk && job.perk.type === 'automation') {
            moneyEarned *= (1 + job.perk.value);
        }

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

            // Apply skill bonus to gig pay
            let pay = gig.pay;
            if (this.player.game && this.player.game.skillSystem) {
                pay = Math.floor(pay * this.player.game.skillSystem.getSkillIncomeMultiplier());
            }

            this.player.addMoney(pay);

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

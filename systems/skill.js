// Skill System - Manages player skill levels and learning
import { SKILLS, COURSES, getXPForLevel } from '../data/skills.js';

export class SkillSystem {
    constructor(game) {
        this.game = game;
        // Store skill XP for each skill
        this.skillXP = {};
        Object.keys(SKILLS).forEach(id => {
            this.skillXP[id] = 0;
        });
    }

    load(data) {
        if (data && data.skillXP) {
            this.skillXP = { ...this.skillXP, ...data.skillXP };
        }
    }

    toJSON() {
        return {
            skillXP: this.skillXP
        };
    }

    // Get current level for a skill
    getSkillLevel(skillId) {
        const xp = this.skillXP[skillId] || 0;
        let level = 0;
        let totalXP = 0;
        const maxLevel = SKILLS[skillId]?.maxLevel || 10;

        while (level < maxLevel && xp >= totalXP + getXPForLevel(level + 1)) {
            level++;
            totalXP += getXPForLevel(level);
        }
        return level;
    }

    // Get XP progress towards next level
    getSkillProgress(skillId) {
        const xp = this.skillXP[skillId] || 0;
        const currentLevel = this.getSkillLevel(skillId);
        const maxLevel = SKILLS[skillId]?.maxLevel || 10;

        if (currentLevel >= maxLevel) return 100; // Maxed out

        let totalXPForCurrentLevel = 0;
        for (let i = 1; i <= currentLevel; i++) {
            totalXPForCurrentLevel += getXPForLevel(i);
        }

        const xpIntoCurrentLevel = xp - totalXPForCurrentLevel;
        const xpNeededForNextLevel = getXPForLevel(currentLevel + 1);

        return Math.floor((xpIntoCurrentLevel / xpNeededForNextLevel) * 100);
    }

    // Add XP to a skill
    addSkillXP(skillId, amount) {
        if (!SKILLS[skillId]) return false;

        const oldLevel = this.getSkillLevel(skillId);
        this.skillXP[skillId] = (this.skillXP[skillId] || 0) + amount;
        const newLevel = this.getSkillLevel(skillId);

        // Level up notification
        if (newLevel > oldLevel) {
            const skill = SKILLS[skillId];
            this.game.ui.showToast(`🎉 ${skill.name} เลเวลอัป! (Lv.${newLevel})`);
            this.game.sound?.playSuccess();
        }

        return true;
    }

    // Take a course to learn a skill
    takeCourse(courseId) {
        const course = COURSES[courseId];
        if (!course) return false;

        const player = this.game.player;

        // Check requirements
        if (player.energy < course.energyCost) {
            this.game.ui.showToast("พลังงานไม่พอ!");
            return false;
        }
        if (player.money < course.moneyCost) {
            this.game.ui.showToast("เงินไม่พอ!");
            return false;
        }

        // Deduct costs
        player.modifyEnergy(-course.energyCost);
        player.spendMoney(course.moneyCost);

        // Add time
        this.game.timeSystem.addSeconds(course.timeCostSeconds);

        // Add skill XP
        this.addSkillXP(course.skillId, course.xpGain);

        // Log
        const skill = SKILLS[course.skillId];
        this.game.ui.log(`📚 เรียน ${course.name} (+${course.xpGain} XP ${skill.name})`);

        this.game.saveSystem.save();
        return true;
    }

    // Calculate total income multiplier from all skills
    getSkillIncomeMultiplier() {
        let multiplier = 1.0;

        Object.keys(SKILLS).forEach(skillId => {
            const skill = SKILLS[skillId];
            const level = this.getSkillLevel(skillId);
            multiplier += skill.incomeBonus * level;
        });

        return multiplier;
    }

    // Get all skills with their current status
    getAllSkillsStatus() {
        return Object.values(SKILLS).map(skill => ({
            ...skill,
            level: this.getSkillLevel(skill.id),
            xp: this.skillXP[skill.id] || 0,
            progress: this.getSkillProgress(skill.id)
        }));
    }
}

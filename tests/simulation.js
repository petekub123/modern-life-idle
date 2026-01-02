import { Player } from '../systems/player.js';
import { TimeSystem } from '../systems/time.js';
import { JobSystem } from '../systems/job.js';
import { ActivitySystem } from '../systems/activity.js';
import { InventorySystem } from '../systems/inventory.js';
import { SaveSystem } from '../systems/save.js';

// Mock UI
class MockUI {
    constructor() {
        this.logs = [];
    }
    log(msg) {
        console.log(`[UI] ${msg}`);
        this.logs.push(msg);
    }
    update(dt) { }
    updateTags() { }
    renderShop() { }
    showToast(msg) { console.log(`[Toast] ${msg}`); }
}

class HeadlessGame {
    constructor() {
        this.player = new Player();
        this.player.game = this;
        this.timeSystem = new TimeSystem();
        this.jobSystem = new JobSystem(this.player);
        this.activitySystem = new ActivitySystem(this);
        this.inventorySystem = new InventorySystem(this);
        this.ui = new MockUI();
        this.saveSystem = new SaveSystem(this);

        // Disable save for test
        this.saveSystem.save = () => console.log("[SaveSystem] Save blocked for test");
    }
}

async function runTest() {
    console.log("=== Starting Logic Verification ===");
    const game = new HeadlessGame();

    // Test 1: Job System Basic
    console.log("\n--- Test 1: Intern Job ---");
    game.jobSystem.setJob('intern'); // 1 Income, 1 Energy Cost

    // Simulate 10 seconds
    for (let i = 0; i < 10; i++) {
        game.jobSystem.tick();
    }

    console.log(`Money: ${game.player.money} (Expected ~10)`);
    console.log(`Energy: ${game.player.energy} (Expected ~90)`);

    if (game.player.money === 10 && game.player.energy === 90) {
        console.log("✅ Basic Job: PASS");
    } else {
        console.error("❌ Basic Job: FAIL");
    }

    // Test 2: Stress Penalty
    console.log("\n--- Test 2: Stress Penalty ---");
    game.player.modifyStress(100); // Set stress to 100 (Max)
    const startMoney = game.player.money;

    // Simulate 10 seconds of Intern job (Income 1)
    // Penalty: >80 stress = 50% income => 0.5 per tick
    for (let i = 0; i < 10; i++) {
        game.jobSystem.tick();
    }

    const earned = game.player.money - startMoney;
    console.log(`Earned with High Stress: ${earned} (Expected 5)`);

    if (earned === 5) {
        console.log("✅ Stress Penalty: PASS");
    } else {
        console.error("❌ Stress Penalty: FAIL");
    }

    // Test 3: Inventory & Equipment
    console.log("\n--- Test 3: Equipment Bonus ---");
    // Give money to buy Laptop (Price 2000)
    game.player.addMoney(5000);
    const bought = game.inventorySystem.buyItem('laptop'); // +10% Passive Income

    if (bought) {
        // Reset stress for clean test
        game.player.modifyStress(-100);
        const moneyBefore = game.player.money;

        // Intern Job: 1 base. +10% = 1.1 per tick.
        game.jobSystem.tick();

        const moneyAfter = game.player.money;
        const diff = moneyAfter - moneyBefore;
        console.log(`Income with Laptop: ${diff} (Expected 1.1)`);

        if (Math.abs(diff - 1.1) < 0.001) {
            console.log("✅ Equipment Bonus: PASS");
        } else {
            console.error("❌ Equipment Bonus: FAIL");
        }
    } else {
        console.error("❌ Could not buy Laptop");
    }

    // Test 4: Activity (Sleep)
    console.log("\n--- Test 4: Sleep Activity ---");
    game.player.modifyEnergy(-50); // Drain energy
    const initialTime = game.timeSystem.data.gameTime;

    game.activitySystem.perform('sleep'); // +100 Energy, +8 hours (28800s)

    console.log(`Energy: ${game.player.energy} (Expected 100)`);
    console.log(`Time Passed: ${game.timeSystem.data.gameTime - initialTime} (Expected 28800)`);

    if (game.player.energy === 100 && (game.timeSystem.data.gameTime - initialTime) === 28800) {
        console.log("✅ Sleep Activity: PASS");
    } else {
        console.error("❌ Sleep Activity: FAIL");
    }

    console.log("\n=== Verification Complete ===");
}

runTest();

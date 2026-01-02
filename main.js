import { Player } from './systems/player.js';
import { TimeSystem } from './systems/time.js';
import { JobSystem } from './systems/job.js';
import { ActivitySystem } from './systems/activity.js';
import { InventorySystem } from './systems/inventory.js';
import { EventSystem } from './systems/event.js';
import { SaveSystem } from './systems/save.js';
import { UIManager } from './systems/ui.js';
import { SoundManager } from './systems/sound.js';
import { SkillSystem } from './systems/skill.js';
import { HousingSystem } from './systems/housing.js';
import { BankSystem } from './systems/bank.js';
import { StockSystem } from './systems/stock.js';

class Game {
    constructor() {
        this.player = new Player();
        this.player.game = this; // Circular ref for systems access from player if needed (cleaner via dependency injection but this works for now)
        this.timeSystem = new TimeSystem();
        this.jobSystem = new JobSystem(this.player);
        this.activitySystem = new ActivitySystem(this);
        this.inventorySystem = new InventorySystem(this);
        this.eventSystem = new EventSystem(this);
        this.skillSystem = new SkillSystem(this);
        this.housingSystem = new HousingSystem(this);
        this.bankSystem = new BankSystem(this);
        this.stockSystem = new StockSystem(this);
        this.ui = new UIManager(this);
        this.saveSystem = new SaveSystem(this);
        this.sound = new SoundManager();

        this.lastFrameTime = 0;
        this.tickAccumulator = 0;
        this.TICK_RATE = 1000; // 1 second per tick
    }

    async init() {
        console.log("Initializing game...");

        // Load data or existing save
        const savedData = this.saveSystem.load();
        if (savedData) {
            this.player.load(savedData.player);
            this.timeSystem.load(savedData.time);
            this.jobSystem.load(savedData.job);
            this.inventorySystem.load(savedData.inventory);
            this.skillSystem.load(savedData.skills);
            this.housingSystem.load(savedData.housing);
            this.bankSystem.load(savedData.bank);
            this.stockSystem.load(savedData.stocks);

            // Calculate offline progress
            const offlineSeconds = this.timeSystem.getOfflineSeconds();
            if (offlineSeconds > 0) {
                this.processOfflineProgress(offlineSeconds);
            }
        }

        this.ui.init();

        // Initialize sound on first click (browser security requirement)
        document.addEventListener('click', () => {
            this.sound.init();
        }, { once: true });

        this.startGameLoop();
        this.startAutoSave();
    }

    startGameLoop() {
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    gameLoop(timestamp) {
        if (!this.lastFrameTime) this.lastFrameTime = timestamp;
        const deltaTime = timestamp - this.lastFrameTime;
        this.lastFrameTime = timestamp;

        // Tick System (Logic updates usually happen every second)
        this.tickAccumulator += deltaTime;
        while (this.tickAccumulator >= this.TICK_RATE) {
            this.tick();
            this.tickAccumulator -= this.TICK_RATE;
        }

        // Frame System (UI updates happen every frame for smoothness)
        this.ui.update(deltaTime);

        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    tick() {
        this.timeSystem.tick();
        this.jobSystem.tick();
        this.eventSystem.tick();

        // Stock market updates every 15 minutes
        this.stockSystem.tick(this.timeSystem.gameTime);

        // Check for new day
        if (this.timeSystem.checkDayAdvanced()) {
            this.processDailyExpenses();
        }

        this.player.regenerate(); // Passive regeneration if needed

        // Check for hospitalization (health <= 0)
        if (this.player.health <= 0 && !this.isHospitalized) {
            this.forceHospitalization();
        }

        this.ui.updateTags(); // Update slower UI elements
    }

    forceHospitalization() {
        this.isHospitalized = true;
        const hospitalCost = 2000;

        // Stop working
        this.jobSystem.isWorking = false;

        // Deduct money (can go into debt)
        this.player.stats.money -= hospitalCost;

        // Advance 1 day (24 hours)
        this.timeSystem.advanceTime(24 * 3600);

        // Restore health to 60
        this.player.stats.health = 60;
        this.player.stats.energy = 100;
        this.player.stats.stress = 20;

        // Show modal
        this.ui.showEventModal({
            title: '🏥 นอนโรงพยาบาล!',
            desc: 'สุขภาพแย่มากจนต้องเข้าโรงพยาบาล! พักรักษาตัว 1 วัน',
            effects: { money: -hospitalCost, health: 60 }
        });

        this.ui.log(`🏥 นอนโรงพยาบาล 1 วัน (-${hospitalCost}฿)`);
        this.isHospitalized = false;
        this.saveSystem.save();
    }

    processDailyExpenses() {
        const expenses = this.housingSystem.getDailyExpenses();
        const paid = this.player.spendMoney(expenses);

        // Track work days
        if (this.jobSystem.isWorking && this.jobSystem.currentJobId !== 'unemployed') {
            this.player.addDayWorked();
        }

        if (paid) {
            this.ui.log(`🌞 เช้าวันใหม่! จ่ายค่าครองชีพ ${expenses} ฿`);
        } else {
            // Can't pay
            this.player.stats.money -= expenses; // Go into debt
            this.player.modifyStress(20);
            this.ui.log(`⚠️ เงินไม่พอจ่ายค่าครองชีพ! (${expenses} ฿) ความเครียดเพิ่มขึ้น!`);
        }

        // Banking: interest and loan interest
        this.bankSystem.processDaily();

        // Stocks: update prices and process dividends
        this.stockSystem.updatePrices();
        this.stockSystem.processDividends();

        // Refresh job list to update unlock status
        this.ui.renderJobList();

        this.saveSystem.save();
    }

    processOfflineProgress(seconds) {
        console.log(`Processing offline progress for ${seconds} seconds`);

        // 1. Calculate Job Income
        const jobResult = this.jobSystem.calculateOfflineIncome(seconds);
        if (jobResult.money > 0) {
            this.player.addMoney(jobResult.money);
        }

        // 2. Adjust Stats
        const energyRecovery = Math.floor(seconds * 0.1);
        this.player.modifyEnergy(energyRecovery);

        // 3. Show Result
        this.ui.showOfflineModal({
            seconds: seconds,
            income: jobResult.money,
            energy: energyRecovery
        });

        this.ui.log(`ผ่านไป ${Math.floor(seconds / 60)} นาทีในโลกจริง`);
    }

    startAutoSave() {
        setInterval(() => {
            this.saveSystem.save();
        }, 30000); // Save every 30s
    }

    // Actions
    reset() {
        if (confirm("ต้องการเริ่มใหม่ทั้งหมดใช่ไหม?")) {
            this.saveSystem.clear();
            location.reload();
        }
    }
}

// Start Game
window.game = new Game();
window.game.init();

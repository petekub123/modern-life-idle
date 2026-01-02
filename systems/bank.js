// systems/bank.js - Banking System for Modern Life: Idle RPG

// วงเงินกู้ตาม tier งาน
const LOAN_LIMITS = {
    0: 0,        // ว่างงาน - กู้ไม่ได้
    1: 5000,     // เด็กฝึกงาน/ฟรีแลนซ์
    2: 20000,    // พนักงาน
    3: 50000,    // พนักงานอาวุโส
    4: 150000,   // ผู้จัดการ
    5: 500000,   // ผู้อำนวยการ
    6: 2000000   // CEO
};

export class BankSystem {
    constructor(game) {
        this.game = game;
        this.balance = 0; // เงินในบัญชี
        this.loan = 0; // หนี้สินปัจจุบัน
        this.interestRate = 0.001; // 0.1% ดอกเบี้ยเงินฝากต่อวัน
        this.loanInterestRate = 0.002; // 0.2% ดอกเบี้ยเงินกู้ต่อวัน
    }

    load(data) {
        if (data) {
            this.balance = data.balance || 0;
            this.loan = data.loan || 0;
        }
    }

    // ฝากเงิน
    deposit(amount) {
        if (amount <= 0) return false;

        if (!this.game.player.spendMoney(amount)) {
            this.game.ui.showToast('เงินสดไม่พอฝาก!');
            return false;
        }

        this.balance += amount;
        this.game.ui.log(`🏦 ฝากเงิน +${amount}฿ (ยอดคงเหลือ: ${Math.floor(this.balance)}฿)`);
        this.game.sound?.playClick();
        this.game.saveSystem.save();

        return true;
    }

    // ถอนเงิน
    withdraw(amount) {
        if (amount <= 0) return false;

        if (this.balance < amount) {
            this.game.ui.showToast('เงินในบัญชีไม่พอ!');
            return false;
        }

        this.balance -= amount;
        this.game.player.addMoney(amount);
        this.game.ui.log(`🏦 ถอนเงิน -${amount}฿ (ยอดคงเหลือ: ${Math.floor(this.balance)}฿)`);
        this.game.sound?.playClick();
        this.game.saveSystem.save();

        return true;
    }

    // คำนวณวงเงินกู้ตาม tier งาน
    getLoanLimit() {
        const currentJob = this.game.jobSystem.currentJob;
        const tier = currentJob ? currentJob.tier : 0;
        return LOAN_LIMITS[tier] || 0;
    }

    // คำนวณวงเงินกู้ที่เหลือ
    getAvailableLoan() {
        return Math.max(0, this.getLoanLimit() - this.loan);
    }

    // กู้เงิน
    takeLoan(amount) {
        if (amount <= 0) return false;

        const available = this.getAvailableLoan();
        if (amount > available) {
            this.game.ui.showToast(`กู้ได้สูงสุด ${available}฿ เท่านั้น!`);
            return false;
        }

        this.loan += amount;
        this.game.player.addMoney(amount);
        this.game.ui.log(`💳 กู้เงิน ${amount}฿ (หนี้รวม: ${Math.floor(this.loan)}฿)`);
        this.game.sound?.playClick();
        this.game.saveSystem.save();

        return true;
    }

    // ชำระคืนเงินกู้
    repayLoan(amount) {
        if (amount <= 0 || this.loan <= 0) return false;

        const repayAmount = Math.min(amount, this.loan);

        if (!this.game.player.spendMoney(repayAmount)) {
            this.game.ui.showToast('เงินสดไม่พอชำระ!');
            return false;
        }

        this.loan -= repayAmount;
        this.game.ui.log(`💳 ชำระหนี้ ${repayAmount}฿ (หนี้คงเหลือ: ${Math.floor(this.loan)}฿)`);
        this.game.sound?.playClick();
        this.game.saveSystem.save();

        return true;
    }

    // ใช้เงินจากบัญชี (สำหรับซื้อหุ้น)
    spendFromBank(amount) {
        if (this.balance >= amount) {
            this.balance -= amount;
            return true;
        }
        return false;
    }

    // เพิ่มเงินเข้าบัญชี (สำหรับขายหุ้น)
    addToBank(amount) {
        this.balance += amount;
    }

    // ประมวลผลรายวัน (ดอกเบี้ยเงินฝาก + ดอกเบี้ยเงินกู้)
    processDaily() {
        let interestEarned = 0;
        let loanInterest = 0;

        // ดอกเบี้ยเงินฝาก
        if (this.balance > 0) {
            interestEarned = Math.floor(this.balance * this.interestRate);
            if (interestEarned > 0) {
                this.balance += interestEarned;
                this.game.ui.log(`💵 ดอกเบี้ยเงินฝาก +${interestEarned}฿`);
            }
        }

        // ดอกเบี้ยเงินกู้
        if (this.loan > 0) {
            loanInterest = Math.floor(this.loan * this.loanInterestRate);
            if (loanInterest > 0) {
                this.loan += loanInterest;
                this.game.ui.log(`📊 ดอกเบี้ยเงินกู้ +${loanInterest}฿`);
            }
        }

        return { interestEarned, loanInterest };
    }

    // เช็คว่ามีหนี้ไหม
    hasDebt() {
        return this.loan > 0;
    }

    toJSON() {
        return {
            balance: this.balance,
            loan: this.loan
        };
    }
}


import { JOBS } from '../data/jobs.js';
import { ACTIVITIES } from '../data/activities.js';
import { ITEMS } from '../data/items.js';
import { SKILLS, COURSES } from '../data/skills.js';

export class UIManager {
    constructor(game) {
        this.game = game;

        // Cache DOM elements
        this.els = {
            money: document.getElementById('money-val'),
            energyText: document.getElementById('energy-text'),
            energyBar: document.getElementById('energy-bar'),
            stressText: document.getElementById('stress-text'),
            stressBar: document.getElementById('stress-bar'),
            healthText: document.getElementById('health-text'),
            healthBar: document.getElementById('health-bar'),
            clock: document.getElementById('clock-display'),
            jobTitle: document.querySelector('.job-title'),
            jobIncome: document.querySelector('.job-income'),
            workStatus: document.getElementById('work-status-text'),
            workBar: document.getElementById('work-progress-bar'),
            logList: document.getElementById('game-log'),
            jobList: document.getElementById('job-list'),
            actionGrid: document.querySelector('.action-grid')
        };
    }

    init() {
        this.bindEvents();
        this.renderJobList();
        this.renderActivityList();
        this.renderShop();
        this.renderInventory();
        this.renderSkills();
        this.renderCourses();
    }

    bindEvents() {
        document.getElementById('btn-save').addEventListener('click', () => {
            this.game.sound?.playClick();
            this.game.saveSystem.save();
        });
        document.getElementById('btn-reset').addEventListener('click', () => {
            this.game.sound?.playClick();
            this.game.reset();
        });

        const gigBtn = document.getElementById('refresh-gigs-btn');
        if (gigBtn) {
            gigBtn.addEventListener('click', async () => {
                this.game.sound?.playClick();
                gigBtn.innerHTML = '<span class="icon">⏳</span><span class="name">AI กำลังคิดงาน...</span>';
                gigBtn.disabled = true;
                this.showToast("กำลังติดต่อลูกค้า...");

                try {
                    const gigs = await this.game.jobSystem.refreshGigs(this.game.eventSystem.aiService);
                    this.renderGigs(gigs);
                } catch (e) {
                    console.error("Gig Error", e);
                }

                gigBtn.disabled = false;
                gigBtn.innerHTML = '<span class="icon">🔄</span><span class="name">หางานใหม่ AI Generate</span>';
            });
        }

        // Call Friend Button (API Test)
        const callFriendBtn = document.getElementById('btn-call-friend');
        if (callFriendBtn) {
            callFriendBtn.addEventListener('click', async () => {
                this.game.sound?.playClick();
                this.showFriendCall();
            });
        }

        // Friend modal close button
        const friendCloseBtn = document.getElementById('friend-close');
        if (friendCloseBtn) {
            friendCloseBtn.addEventListener('click', () => {
                document.getElementById('friend-modal').classList.add('hidden');
            });
        }
    }

    renderShop() {
        const container = document.getElementById('shop-list');
        if (!container) return;

        container.innerHTML = '';
        Object.values(ITEMS).forEach(item => {
            const btn = document.createElement('button');
            btn.className = 'action-btn';

            // Check if own equipment
            const isOwned = this.game.inventorySystem.hasEquipment(item.id);
            btn.classList.toggle('owned', isOwned);

            let priceDisplay = isOwned ? 'มีแล้ว' : `${item.price}฿`;

            btn.innerHTML = `
                <span class="icon">${item.icon}</span>
                <span class="name">${item.name}</span>
                <span class="desc">${item.desc}</span>
                <span class="desc" style="color:${isOwned ? '#4ecca3' : '#f7b731'}">${priceDisplay}</span>
            `;

            btn.onclick = () => {
                if (this.game.inventorySystem.buyItem(item.id)) {
                    this.renderShop();
                    this.renderInventory();
                }
            };
            container.appendChild(btn);
        });
    }

    renderInventory() {
        const container = document.getElementById('inventory-list');
        if (!container) return;

        container.innerHTML = '';

        // Render Consumables
        Object.entries(this.game.inventorySystem.items).forEach(([id, count]) => {
            if (count <= 0) return;
            const item = ITEMS[id];
            if (!item) return;

            const btn = document.createElement('button');
            btn.className = 'action-btn';
            btn.innerHTML = `
                <span class="icon">${item.icon}</span>
                <span class="name">${item.name}</span>
                <span class="desc">${item.desc}</span>
                <span class="badge" style="background:#e94560">x${count}</span>
                <span class="desc" style="color:#4ecca3; font-size: 0.8em; margin-top: 5px;">คลิกเพื่อใช้</span>
            `;

            btn.addEventListener('click', () => {
                if (this.game.inventorySystem.useItem(id)) {
                    this.renderShop(); // Update shop if needed (rare)
                    this.renderInventory(); // Update count
                }
            });
            container.appendChild(btn);
        });

        // Show empty state if no consumables
        if (container.children.length === 0) {
            container.innerHTML = '<div style="color:#aaa; text-align:center; padding:10px;">ไม่มีไอเทม</div>';
        }
    }

    renderActivityList() {
        this.els.actionGrid.innerHTML = '';
        Object.values(ACTIVITIES).forEach(act => {
            const btn = document.createElement('button');
            btn.className = 'action-btn';
            btn.innerHTML = `
                <span class="icon">${act.icon}</span>
                <span class="name">${act.name}</span>
                <span class="desc">${act.desc}</span>
            `;
            if (act.moneyCost > 0) {
                btn.innerHTML += `<span class="desc" style="color:#e94560">-${act.moneyCost}฿</span>`;
            }
            btn.addEventListener('click', () => this.game.activitySystem.perform(act.id));
            this.els.actionGrid.appendChild(btn);
        });
    }

    renderJobList() {
        this.els.jobList.innerHTML = '';

        // Sort jobs by tier
        const sortedJobs = Object.values(JOBS)
            .filter(job => job.id !== 'unemployed')
            .sort((a, b) => a.tier - b.tier);

        sortedJobs.forEach(job => {
            const canApply = this.game.jobSystem.canApplyForJob(job.id);
            const isCurrentJob = this.game.jobSystem.currentJobId === job.id;

            const btn = document.createElement('div');
            btn.className = 'job-item-btn';

            if (isCurrentJob) {
                btn.classList.add('active-job');
            }

            if (!canApply) {
                btn.classList.add('locked');
                btn.style.opacity = '0.6';
            }

            // Build requirements text
            let reqText = '';
            if (job.requirements) {
                const reqs = [];
                if (job.requirements.money) {
                    const hasMoney = this.game.player.money >= job.requirements.money;
                    reqs.push(`💰 ${job.requirements.money.toLocaleString()}฿ ${hasMoney ? '✓' : ''}`);
                }
                if (job.requirements.daysWorked) {
                    const hasDays = this.game.player.daysWorked >= job.requirements.daysWorked;
                    reqs.push(`📅 ${job.requirements.daysWorked} วัน ${hasDays ? '✓' : ''}`);
                }
                reqText = reqs.join(' | ');
            }

            btn.innerHTML = `
                <div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="color:${canApply ? 'var(--accent)' : '#888'}; font-size:0.7rem;">Tier ${job.tier}</span>
                        <strong>${job.name}</strong>
                        ${isCurrentJob ? '<span style="color:var(--success); font-size:0.8rem;">✓ ปัจจุบัน</span>' : ''}
                    </div>
                    <div style="font-size:0.8em; color: #aaa;">${job.desc}</div>
                    ${reqText ? `<div style="font-size:0.7em; color: ${canApply ? 'var(--success)' : 'var(--stress)'}; margin-top:4px;">${canApply ? '✅ ปลดล็อคแล้ว' : '🔒 ' + reqText}</div>` : ''}
                </div>
                <div style="text-align:right">
                    <div style="font-weight:bold; color:var(--success)">+${job.incomePerSec}฿/วิ</div>
                    <div style="font-size:0.8em; color: var(--energy);">-${job.energyCostPerSec}⚡</div>
                </div>
            `;

            btn.addEventListener('click', () => {
                this.game.sound?.playClick();
                if (canApply) {
                    if (this.game.jobSystem.setJob(job.id)) {
                        this.log(`คุณเริ่มทำงาน: ${job.name}`);
                        this.renderJobList(); // Re-render to update active state
                        this.updateTags();
                    }
                } else {
                    this.showToast("ยังไม่ได้ปลดล็อคงานนี้!");
                    this.game.sound?.playError();
                }
            });
            this.els.jobList.appendChild(btn);
        });
    }

    update(deltaTime) {
        // Fast updates (bars, money animations)
        const p = this.game.player;

        this.els.money.textContent = Math.floor(p.money).toLocaleString() + ' ฿';

        this.els.energyBar.style.width = `${(p.energy / p.maxEnergy) * 100}%`;
        this.els.energyText.textContent = `${Math.floor(p.energy)}/${p.maxEnergy}`;

        this.els.stressBar.style.width = `${(p.stress / p.maxStress) * 100}%`;
        this.els.stressText.textContent = `${Math.floor(p.stress)}/${p.maxStress}`;

        this.els.healthBar.style.width = `${(p.health / p.maxHealth) * 100}%`;
        this.els.healthText.textContent = `${Math.floor(p.health)}/${p.maxHealth}`;

        // Work bar animation
        if (this.game.jobSystem.isWorking) {
            this.els.workBar.style.width = `${this.game.jobSystem.workProgress}%`;
        } else {
            this.els.workBar.style.width = '0%';
        }
    }

    updateTags() {
        // Slower updates (Text, Clock)
        this.els.clock.textContent = this.game.timeSystem.getFormattedTime();

        const currentJob = this.game.jobSystem.currentJob || JOBS.unemployed;
        this.els.jobTitle.textContent = currentJob.name;
        this.els.jobIncome.textContent = `รายได้: ${currentJob.incomePerSec} ฿/วิ`; // Fix: incomePerSec

        if (this.game.jobSystem.isWorking) {
            this.els.workStatus.textContent = "กำลังทำงาน... (คลิกงานอื่นเพื่อเปลี่ยน)";
            this.els.workStatus.style.color = "#4ecca3";
        } else {
            if (currentJob.id !== 'unemployed') {
                this.els.workStatus.textContent = "หยุดทำงาน (พลังงานหมด!)";
                this.els.workStatus.style.color = "#e94560";
            } else {
                this.els.workStatus.textContent = "ไม่ได้ทำงาน";
                this.els.workStatus.style.color = "#a0a0b0";
            }
        }
    }

    log(msg) {
        const li = document.createElement('li');
        li.className = 'log-item';
        li.textContent = `[${this.game.timeSystem.getFormattedTime().split(' - ')[1]}] ${msg}`;
        this.els.logList.prepend(li);

        if (this.els.logList.children.length > 50) {
            this.els.logList.removeChild(this.els.logList.lastChild);
        }
    }

    showEventModal(event) {
        const modal = document.getElementById('event-modal');
        const title = document.getElementById('modal-title');
        const desc = document.getElementById('modal-desc');
        const effects = document.getElementById('modal-effects');
        const closeBtn = document.getElementById('modal-close');

        title.textContent = event.title;
        desc.textContent = event.desc;

        // Format effects string
        const effs = [];
        if (event.effects) {
            if (event.effects.money) effs.push(`เงิน ${event.effects.money > 0 ? '+' : ''}${event.effects.money}`);
            if (event.effects.stress) effs.push(`ความเครียด ${event.effects.stress > 0 ? '+' : ''}${event.effects.stress}`);
            if (event.effects.energy) effs.push(`พลังงาน ${event.effects.energy > 0 ? '+' : ''}${event.effects.energy}`);
            if (event.effects.health) effs.push(`สุขภาพ ${event.effects.health > 0 ? '+' : ''}${event.effects.health}`);
        }
        effects.textContent = effs.join(', ');

        // Play alert sound
        this.game.sound?.playAlert();

        modal.classList.remove('hidden');

        closeBtn.onclick = () => {
            modal.classList.add('hidden');
        };
    }

    showToast(msg, type = 'normal') {
        this.log(msg);
    }

    showOfflineModal(data) {
        const modal = document.getElementById('offline-modal');
        const details = document.getElementById('offline-details');
        const closeBtn = document.getElementById('offline-close');

        if (!modal) return;

        let html = `
            <div class="result-row">
                <span>🕒 เวลาที่ผ่านไป:</span>
                <span>${Math.floor(data.seconds / 60)} นาที</span>
            </div>
        `;

        if (data.income > 0) {
            html += `
            <div class="result-row icon-row">
                <span>💰 รายได้จากงาน:</span>
                <span class="value">+${data.income} ฿</span>
            </div>`;
        } else {
            html += `
            <div class="result-row">
                <span>🏢 การทำงาน:</span>
                <span>ไม่ได้ทำงานอยู่</span>
            </div>`;
        }

        if (data.energy > 0) {
            html += `
            <div class="result-row icon-row">
                <span>⚡ พลังงานฟื้นฟู:</span>
                <span class="value">+${data.energy}</span>
            </div>`;
        }

        details.innerHTML = html;
        modal.classList.remove('hidden');

        closeBtn.onclick = () => {
            modal.classList.add('hidden');
        };
    }

    renderGigs(gigs) {
        const container = document.getElementById('gig-list');
        if (!container) return;
        container.innerHTML = '';

        if (!gigs || gigs.length === 0) {
            container.innerHTML = '<div class="status-subtext" style="text-align:center;">ไม่พบงานที่น่าสนใจ</div>';
            return;
        }

        gigs.forEach(gig => {
            const btn = document.createElement('button');
            btn.className = 'job-item-btn'; // Reuse style
            btn.style.flexDirection = 'column';
            btn.style.alignItems = 'flex-start';
            btn.style.gap = '8px';
            btn.style.height = 'auto'; // Auto height

            btn.innerHTML = `
                <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
                    <span style="font-weight:600; color:var(--accent); font-size:0.95rem;">${gig.title}</span>
                    <span style="color:var(--success); font-weight:700;">+${gig.pay}฿</span>
                </div>
                <div style="font-size:0.8rem; color:var(--text-secondary); line-height:1.4;">${gig.desc}</div>
                <div style="font-size:0.8rem; display:flex; gap:12px; margin-top:4px; border-top:1px solid rgba(255,255,255,0.05); padding-top:6px; width:100%;">
                    <span style="color:var(--energy)">⚡ -${gig.energy}</span>
                    <span style="color:var(--stress)">😫 +${gig.stress}</span>
                </div>
            `;

            btn.onclick = () => {
                const success = this.game.jobSystem.doGig(gig);
                if (success) {
                    this.showToast(`รับงาน: "${gig.title}" สำเร็จ! (+${gig.pay}฿)`);
                    btn.remove();
                } else {
                    this.showToast("พลังงานไม่พอทำงานนี้!", "error");
                }
            };
            container.appendChild(btn);
        });
    }

    renderSkills() {
        const container = document.getElementById('skills-summary');
        if (!container) return;

        container.innerHTML = '';

        const skills = this.game.skillSystem.getAllSkillsStatus();
        skills.forEach(skill => {
            const div = document.createElement('div');
            div.className = 'skill-item';
            div.style.cssText = 'display:flex; flex-direction:column; gap:4px; padding:8px; background:rgba(255,255,255,0.03); border-radius:8px;';

            div.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span>${skill.icon} ${skill.name}</span>
                    <span style="color:var(--accent); font-weight:bold;">Lv.${skill.level}${skill.level >= skill.maxLevel ? ' MAX' : ''}</span>
                </div>
                <div style="height:4px; background:rgba(255,255,255,0.1); border-radius:2px; overflow:hidden;">
                    <div style="height:100%; width:${skill.progress}%; background:var(--accent); transition:width 0.3s;"></div>
                </div>
                <div style="font-size:0.7rem; color:#888;">+${Math.round((SKILLS[skill.id].incomeBonus * skill.level) * 100)}% รายได้</div>
            `;
            container.appendChild(div);
        });
    }

    renderCourses() {
        const container = document.getElementById('courses-list');
        if (!container) return;

        container.innerHTML = '';

        Object.values(COURSES).forEach(course => {
            const skill = SKILLS[course.skillId];
            const btn = document.createElement('button');
            btn.className = 'action-btn';
            btn.innerHTML = `
                <span class="icon">${course.icon}</span>
                <span class="name">${course.name}</span>
                <span class="desc">${skill.icon} +${course.xpGain} XP</span>
                <span class="desc" style="color:var(--stress)">-${course.moneyCost}฿ -${course.energyCost}⚡</span>
            `;

            btn.addEventListener('click', () => {
                this.game.sound?.playClick();
                const success = this.game.skillSystem.takeCourse(course.id);
                if (success) {
                    this.renderSkills(); // Update skill display
                }
            });

            container.appendChild(btn);
        });
    }

    async showFriendCall() {
        const modal = document.getElementById('friend-modal');
        const statusDiv = document.getElementById('friend-status');
        const chatDiv = document.getElementById('friend-chat');
        const errorDiv = document.getElementById('friend-error');
        const nameEl = document.getElementById('friend-name');
        const messageEl = document.getElementById('friend-message');
        const errorMsgEl = document.getElementById('friend-error-msg');
        const apiStatusEl = document.getElementById('friend-api-status');

        // Reset state
        statusDiv.classList.remove('hidden');
        chatDiv.classList.add('hidden');
        errorDiv.classList.add('hidden');
        modal.classList.remove('hidden');

        // Play ring sound
        this.game.sound?.playAlert();

        // Call the AI
        const result = await this.game.eventSystem.aiService.callFriend();

        // Small delay for effect
        await new Promise(r => setTimeout(r, 500));

        statusDiv.classList.add('hidden');

        if (result.success) {
            // Success - show chat
            nameEl.textContent = result.name;
            messageEl.textContent = result.message;
            apiStatusEl.innerHTML = '✅ AI เชื่อมต่อสำเร็จ';
            chatDiv.classList.remove('hidden');
            this.game.sound?.playSuccess();
        } else {
            // Error - show error
            errorMsgEl.textContent = result.message || "เพื่อนไม่รับสาย";
            errorDiv.classList.remove('hidden');
            this.game.sound?.playError();
        }
    }
}

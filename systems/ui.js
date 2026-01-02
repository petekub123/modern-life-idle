import { JOBS } from '../data/jobs.js';
import { ACTIVITIES } from '../data/activities.js';
import { ITEMS } from '../data/items.js';
import { SKILLS, COURSES } from '../data/skills.js';
import { PROPERTIES } from '../data/properties.js';
import { LOCATIONS, LOCATION_ORDER } from '../data/locations.js';
import { FURNITURE } from '../data/furniture.js';

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
        this.renderMap();
        this.renderJobList();
        this.renderActivityList();
        this.renderShop();
        this.renderInventory();
        this.renderSkills();
        this.renderCourses();
        this.renderHousing();
        this.renderBank();
        this.renderStocks();

        // Map navigation state
        this.currentLocation = null;
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

        // Quick Bag Button
        const quickBagBtn = document.getElementById('btn-quick-bag');
        if (quickBagBtn) {
            quickBagBtn.addEventListener('click', () => {
                this.game.sound?.playClick();
                this.toggleQuickInventory();
            });
        }
    }

    toggleQuickInventory() {
        const quickItems = document.getElementById('quick-items');
        if (!quickItems) return;

        if (quickItems.style.display === 'none') {
            quickItems.style.display = 'flex';
            this.renderQuickInventory();
        } else {
            quickItems.style.display = 'none';
        }
    }

    renderQuickInventory() {
        const quickItems = document.getElementById('quick-items');
        if (!quickItems) return;

        const inventory = this.game.inventorySystem.items;
        quickItems.innerHTML = '';

        if (Object.keys(inventory).length === 0) {
            quickItems.innerHTML = '<span style="color:#888; font-size:0.8rem;">กระเป๋าว่าง</span>';
            return;
        }

        Object.entries(inventory).forEach(([itemId, qty]) => {
            const item = ITEMS[itemId];
            if (!item || qty <= 0) return;

            const btn = document.createElement('button');
            btn.className = 'quick-item-btn';
            btn.innerHTML = `${item.icon} ${qty}`;
            btn.title = `${item.name} - ${item.desc}`;
            btn.addEventListener('click', () => {
                this.game.sound?.playClick();
                this.game.inventorySystem.useItem(itemId);
                this.renderQuickInventory();
                this.renderInventory();
            });
            quickItems.appendChild(btn);
        });
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
        console.log('Rendering Job List...');
        this.renderCareerHub();
    }

    renderCareerHub() {
        try {
            this.els.jobList.innerHTML = '';
            const currentJob = this.game.jobSystem.currentJob;

            if (!currentJob) {
                console.error('Current job is invalid/null', this.game.jobSystem.currentJobId);
                this.els.jobList.innerHTML = '<div style="color:red; padding:20px;">Error: Invalid Job State</div>';
                return;
            }

            // Container for Tree View
            const treeContainer = document.createElement('div');
            treeContainer.style.display = 'flex';
            treeContainer.style.flexDirection = 'column';
            treeContainer.style.gap = '20px';
            this.els.jobList.appendChild(treeContainer);

            // --- 1. Current Branch (Active Track) ---
            const activeTrackDiv = document.createElement('div');
            activeTrackDiv.className = 'career-track active-track';
            activeTrackDiv.innerHTML = `
            <div style="margin-bottom:10px; border-bottom:1px solid #444; padding-bottom:5px;">
                <span style="font-size:1.2rem;">📍 เส้นทางของคุณ: <span style="color:var(--accent-color)">${currentJob.track.toUpperCase()}</span></span>
            </div>
        `;

            // Current Job Card
            const currentCard = document.createElement('div');
            currentCard.className = 'job-card current';
            currentCard.style.background = 'rgba(78, 204, 163, 0.1)';
            currentCard.style.border = '1px solid var(--success)';
            currentCard.style.padding = '15px';
            currentCard.style.borderRadius = '8px';

            let perkHtml = '';
            if (currentJob.perk) {
                perkHtml = `
            <div style="margin-top:8px; padding:5px; background:rgba(255, 215, 0, 0.1); border:1px dashed gold; border-radius:4px;">
                <span style="font-size:0.85rem; color:gold;">🌟 ความสามารถพิเศษ: ${currentJob.perk.desc}</span>
            </div>`;
            }

            currentCard.innerHTML = `
            <div style="display:flex; justify-content:space-between;">
                <strong>${currentJob.name} <span style="font-size:0.8em; color:#aaa;">(Tier ${currentJob.tier})</span></strong>
                <span style="color:var(--success)">✅ ปัจจุบัน</span>
            </div>
            <div style="font-size:0.9rem; color:#ccc; margin-top:5px;">${currentJob.desc}</div>
            <div style="font-size:0.9rem; color:#ccc;">รายได้: ${currentJob.incomePerSec}฿/วินาที</div>
            ${perkHtml}
        `;
            activeTrackDiv.appendChild(currentCard);

            // Connector Arrow
            const arrow = document.createElement('div');
            arrow.style.textAlign = 'center';
            arrow.style.fontSize = '1.5rem';
            arrow.style.color = '#666';
            arrow.style.margin = '5px 0';
            arrow.innerText = '⬇️';
            activeTrackDiv.appendChild(arrow);

            // Next Job (Promotion Target)
            const nextJob = this.game.jobSystem.getNextJobInTrack();
            if (nextJob) {
                const check = this.game.jobSystem.checkRequirements(nextJob);
                const promoCard = document.createElement('div');
                promoCard.className = 'job-card next';
                promoCard.style.background = 'rgba(255, 255, 255, 0.05)';
                promoCard.style.border = '1px dashed #666';
                promoCard.style.padding = '15px';
                promoCard.style.borderRadius = '8px';

                let reqHtml = check.reasons.length > 0
                    ? `<div style="color:#e94560; font-size:0.9rem; margin-top:10px;">⚠️ เงื่อนไข: ${check.reasons.join(', ')}</div>`
                    : `<div style="color:var(--success); font-size:0.9rem; margin-top:10px;">✅ เงื่อนไขครบ พร้อมเลื่อนขั้น!</div>`;

                promoCard.innerHTML = `
                <div style="display:flex; justify-content:space-between;">
                    <strong>${nextJob.name} <span style="font-size:0.8em; color:#aaa;">(Tier ${nextJob.tier})</span></strong>
                    <span style="color:#aaa">🎯 เป้าหมายถัดไป</span>
                </div>
                <div style="font-size:0.9rem; color:#ccc; margin-top:5px;">${nextJob.desc}</div>
                <div style="font-size:0.9rem; color:var(--success);">+${nextJob.incomePerSec}฿/วินาที</div>
                ${reqHtml}
            `;

                if (check.can) {
                    const btn = document.createElement('button');
                    btn.className = 'action-btn'; // reuse
                    btn.style.width = '100%';
                    btn.style.marginTop = '10px';
                    btn.style.background = 'var(--accent-color)';
                    btn.innerText = '🎉 เลื่อนตำแหน่ง (Promotion)';
                    btn.onclick = () => {
                        if (this.game.jobSystem.promote()) {
                            this.renderCareerHub();
                            this.renderBank();
                        }
                    };
                    promoCard.appendChild(btn);
                }

                activeTrackDiv.appendChild(promoCard);
            } else {
                // Max Level
                const maxCard = document.createElement('div');
                maxCard.style.textAlign = 'center';
                maxCard.style.padding = '10px';
                maxCard.style.color = 'gold';
                maxCard.innerHTML = '👑 สูงสุดของสายอาชีพนี้แล้ว!';
                activeTrackDiv.appendChild(maxCard);
            }

            treeContainer.appendChild(activeTrackDiv);

            // --- 2. Other Branches (Switch Track) ---
            const otherTracksDiv = document.createElement('div');
            otherTracksDiv.innerHTML = `<h4 style="margin-top:20px; border-top:1px solid #333; padding-top:15px;">🌐 เริ่มต้นสายอาชีพอื่น (Talent Tree)</h4>`;

            // Find entry jobs (Tier 1) of OTHER tracks
            const jobs = Object.values(JOBS);
            const startJobs = {};
            jobs.filter(j => j.tier === 1 && j.track !== currentJob.track).forEach(j => {
                if (!startJobs[j.track]) startJobs[j.track] = j;
            });

            const grid = document.createElement('div');
            grid.style.display = 'grid';
            grid.style.gridTemplateColumns = '1fr 1fr';
            grid.style.gap = '10px';

            Object.values(startJobs).forEach(job => {
                const check = this.game.jobSystem.checkRequirements(job);
                const card = document.createElement('div');
                card.className = 'job-item-btn';
                card.style.display = 'block';
                card.style.opacity = check.can ? '1' : '0.7';
                card.style.transition = 'all 0.2s ease';

                card.innerHTML = `
                <div style="font-weight:bold; margin-bottom:5px;">
                    ${job.track === 'tech' ? '💻' : job.track === 'creative' ? '🎨' : '💼'} ${job.name}
                </div>
                <div style="font-size:0.8rem; color:#aaa;">${job.desc}</div>
                <div style="font-size:0.8rem; color:var(--success); margin-top:5px;">รายได้: ${job.incomePerSec}฿/วิ</div>
                ${!check.can ? `<div style="font-size:0.75rem; color:#e94560;">ติดเงื่อนไข: ${check.reasons[0]}</div>` : ''}
                ${check.can ? `<div style="margin-top:8px; font-size:0.75rem; color:var(--accent); text-align:right; font-weight:600;">คลิกเพื่อสมัคร ➜</div>` : ''}
            `;

                if (check.can) {
                    card.style.cursor = 'pointer';
                    card.style.border = '1px solid rgba(78, 204, 163, 0.3)';

                    card.onmouseover = () => {
                        card.style.background = 'rgba(78, 204, 163, 0.1)';
                        card.style.transform = 'translateY(-2px)';
                    };
                    card.onmouseout = () => {
                        card.style.background = '';
                        card.style.transform = 'translateY(0)';
                    };

                    card.onclick = () => {
                        this.game.sound?.playClick();
                        // Check if currently unemployed to skip confirm maybe? Or just keep it safe
                        const isUnemployed = !this.game.jobSystem.currentJob || this.game.jobSystem.currentJob.id === 'unemployed';

                        if (isUnemployed || confirm(`ย้ายไปสาย ${job.name}?\n⚠️ ตำแหน่งปัจจุบันจะถูกรีเซ็ต!`)) {
                            this.game.jobSystem.switchJob(job.id);
                            this.renderCareerHub();
                        }
                    };
                }

                grid.appendChild(card);
            });

            otherTracksDiv.appendChild(grid);
            treeContainer.appendChild(otherTracksDiv);
        } catch (e) {
            console.error('Error rendering Career Hub:', e);
            this.showToast('เกิดข้อผิดพลาดในการโหลดข้อมูลงาน', 'error');
        }
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
            let statusText = "กำลังทำงาน...";
            let penalties = [];

            // Show penalties (stress only, no health penalty)
            if (this.game.player.stress > 80) {
                penalties.push("🔥 เครียด -50%");
            }

            if (penalties.length > 0) {
                statusText = `ทำงานอยู่ (${penalties.join(', ')})`;
                this.els.workStatus.style.color = "#fbbf24";
            } else {
                statusText = "กำลังทำงาน... (คลิกงานอื่นเพื่อเปลี่ยน)";
                this.els.workStatus.style.color = "#4ecca3";
            }
            this.els.workStatus.textContent = statusText;
        } else {
            if (currentJob.id !== 'unemployed') {
                if (this.game.player.energy <= 0) {
                    this.els.workStatus.textContent = "หยุดทำงาน (พลังงานหมด!)";
                    this.els.workStatus.style.color = "#e94560";
                } else {
                    this.els.workStatus.textContent = "ไม่ได้ทำงาน";
                    this.els.workStatus.style.color = "#aaa";
                }
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

    renderHousing() {
        const currentContainer = document.getElementById('current-housing');
        const listContainer = document.getElementById('housing-list');
        if (!currentContainer || !listContainer) return;

        const housing = this.game.housingSystem;
        const current = housing.currentProperty;
        const dailyExpenses = housing.getDailyExpenses();

        // Current housing info
        currentContainer.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <span style="font-size:1.5rem;">${current.icon}</span>
                    <strong style="margin-left:8px;">${current.name}</strong>
                    ${housing.owns(current.id) ? '<span style="color:var(--success); font-size:0.8rem; margin-left:8px;">🏠 เจ้าของ</span>' : ''}
                </div>
                <div style="text-align:right;">
                    <div style="color:var(--stress);">💸 ${dailyExpenses}฿/วัน</div>
                    <div style="font-size:0.75rem; color:#888;">ค่าครองชีพ + ค่าเช่า</div>
                </div>
            </div>
        `;

        // Housing list
        listContainer.innerHTML = '';
        const properties = housing.getAvailableProperties();

        properties.forEach(prop => {
            if (prop.isCurrent) return; // Skip current

            const btn = document.createElement('div');
            btn.className = 'job-item-btn';
            btn.style.flexDirection = 'column';
            btn.style.alignItems = 'stretch';
            btn.style.gap = '8px';

            const canRent = prop.canRent && !prop.isCurrent;
            const canBuy = prop.canBuy;
            const isOwned = prop.isOwned;

            if (!canRent && !isOwned) {
                btn.style.opacity = '0.5';
            }

            let actionsHtml = '';
            if (isOwned) {
                actionsHtml = `<button class="housing-btn rent-btn" data-action="move" data-id="${prop.id}">🏠 ย้ายเข้า</button>`;
            } else {
                if (canRent) {
                    actionsHtml += `<button class="housing-btn rent-btn" data-action="rent" data-id="${prop.id}">🔑 เช่า ${prop.rentPerDay}฿/วัน</button>`;
                }
                if (prop.buyPrice) {
                    actionsHtml += `<button class="housing-btn buy-btn ${canBuy ? '' : 'disabled'}" data-action="buy" data-id="${prop.id}" ${canBuy ? '' : 'disabled'}>💰 ซื้อ ${prop.buyPrice.toLocaleString()}฿</button>`;
                }
            }

            btn.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <span style="font-size:1.2rem;">${prop.icon}</span>
                        <strong style="margin-left:6px;">${prop.name}</strong>
                        ${isOwned ? '<span style="color:var(--success); font-size:0.7rem; margin-left:6px;">✓ เป็นเจ้าของ</span>' : ''}
                    </div>
                    <div style="color:var(--success); font-size:0.8rem;">ลดค่าใช้จ่าย ${Math.round(prop.expenseReduction * 100)}%</div>
                </div>
                <div style="font-size:0.8rem; color:#aaa;">${prop.description}</div>
                <div style="display:flex; gap:8px; font-size:0.75rem; color:#888;">
                    <span>⚡+${prop.energyBonus} ฟื้นพลัง</span>
                    <span>😌-${prop.stressReduction} ความเครียด</span>
                </div>
                <div style="display:flex; gap:8px; margin-top:4px;">
                    ${actionsHtml}
                </div>
            `;

            // Event listeners for buttons
            btn.querySelectorAll('button').forEach(actionBtn => {
                actionBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = actionBtn.dataset.action;
                    const id = actionBtn.dataset.id;
                    this.game.sound?.playClick();

                    if (action === 'rent' || action === 'move') {
                        if (housing.rent(id)) {
                            this.renderHousing();
                        }
                    } else if (action === 'buy') {
                        if (housing.buy(id)) {
                            this.renderHousing();
                        } else {
                            this.showToast('เงินไม่พอซื้อ!');
                        }
                    }
                });
            });

            listContainer.appendChild(btn);
        });
    }

    updateNewsTicker(event) {
        const ticker = document.getElementById('news-feed');
        if (!ticker) return;

        if (event) {
            ticker.innerHTML = `<span style="color:var(--accent); font-weight:bold;">${event.headline}</span>`;
            ticker.classList.add('breaking-news');
        } else {
            ticker.innerHTML = '📰 ตลาดหุ้นเปิดทำการปกติ... ติดตามข่าวสารเร็วๆ นี้';
            ticker.classList.remove('breaking-news');
        }
    }

    renderBank() {
        const infoEl = document.getElementById('bank-info');
        const actionsEl = document.getElementById('bank-actions');
        if (!infoEl || !actionsEl) return;

        const bank = this.game.bankSystem;
        const balance = Math.floor(bank.balance);
        const loan = Math.floor(bank.loan);
        const loanLimit = bank.getLoanLimit();
        const available = bank.getAvailableLoan();

        infoEl.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span>💰 ยอดเงินฝาก:</span>
                <strong style="color:var(--success);">${balance.toLocaleString()}฿</strong>
            </div>
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span>💳 หนี้สินคงค้าง:</span>
                <strong style="color:${loan > 0 ? 'var(--stress)' : 'var(--text-secondary)'};">${loan.toLocaleString()}฿</strong>
            </div>
            <div style="font-size:0.8rem; color:#888;">
                วงเงินกู้: ${loanLimit.toLocaleString()}฿ | กู้ได้อีก: ${available.toLocaleString()}฿
            </div>
        `;

        actionsEl.innerHTML = `
            <button class="small-btn" id="btn-deposit">🟢 ฝากเงิน</button>
            <button class="small-btn" id="btn-withdraw">🟡 ถอนเงิน</button>
            <button class="small-btn" id="btn-loan" ${available === 0 ? 'disabled style="opacity:0.5"' : ''}>💳 กู้เงิน</button>
            <button class="small-btn" id="btn-repay" ${loan === 0 ? 'disabled style="opacity:0.5"' : ''}>✅ ชำระหนี้</button>
        `;

        // Add event listeners (With ParseInt Fix)
        document.getElementById('btn-deposit')?.addEventListener('click', () => {
            const input = prompt('ฝากเงินเท่าไหร่?', '1000');
            const amount = parseInt(input);
            if (amount && amount > 0) {
                bank.deposit(amount);
                this.renderBank();
            }
        });

        document.getElementById('btn-withdraw')?.addEventListener('click', () => {
            const input = prompt('ถอนเงินเท่าไหร่?', '1000');
            const amount = parseInt(input);
            if (amount && amount > 0) {
                bank.withdraw(amount);
                this.renderBank();
            }
        });

        document.getElementById('btn-loan')?.addEventListener('click', () => {
            const max = bank.getAvailableLoan();
            const input = prompt(`กู้เงินเท่าไหร่? (สูงสุด ${max}฿)`, String(max));
            const amount = parseInt(input);
            if (amount && amount > 0) {
                bank.takeLoan(amount);
                this.renderBank();
            }
        });

        document.getElementById('btn-repay')?.addEventListener('click', () => {
            const owed = Math.floor(bank.loan);
            const input = prompt(`ชำระหนี้เท่าไหร่? (หนี้คงค้าง ${owed}฿)`, String(owed));
            const amount = parseInt(input);
            if (amount && amount > 0) {
                bank.repayLoan(amount);
                this.renderBank();
            }
        });
    }

    renderStocks() {
        const infoEl = document.getElementById('portfolio-info');
        const listEl = document.getElementById('stock-list');
        if (!infoEl || !listEl) return;

        const stock = this.game.stockSystem;
        const bank = this.game.bankSystem;
        const portfolioValue = stock.getPortfolioValue();
        const profitLoss = stock.getPortfolioProfitLoss();

        infoEl.innerHTML = `
            <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                <span>💼 มูลค่า Portfolio:</span>
                <strong style="color:var(--accent);">${portfolioValue.toLocaleString()}฿</strong>
            </div>
            <div style="display:flex; justify-content:space-between;">
                <span>📈 กำไร/ขาดทุน:</span>
                <strong style="color:${profitLoss >= 0 ? 'var(--success)' : 'var(--stress)'};">
                    ${profitLoss >= 0 ? '+' : ''}${profitLoss.toLocaleString()}฿
                </strong>
            </div>
            <div style="font-size:0.8rem; color:#888; margin-top:8px;">
                🏦 เงินในบัญชี: ${Math.floor(bank.balance).toLocaleString()}฿ | ราคาอัพเดททุก 15 นาที
            </div>
        `;

        listEl.innerHTML = '';
        const stocks = stock.getAllStocksInfo();

        stocks.forEach(s => {
            const item = document.createElement('div');
            item.className = 'stock-card';

            const hasShares = s.shares > 0;
            const plColor = s.profitLoss >= 0 ? 'var(--success)' : 'var(--stress)';
            const trendIcon = s.trend === 'up' ? '📈' : s.trend === 'down' ? '📉' : '➖';
            const trendColor = s.trend === 'up' ? 'var(--success)' : s.trend === 'down' ? 'var(--stress)' : 'var(--text-secondary)';
            const changeText = s.priceChange >= 0 ? `+${s.priceChange.toFixed(1)}%` : `${s.priceChange.toFixed(1)}%`;

            // Generate SVG sparkline
            const sparkline = this.generateSparkline(s.priceHistory, s.trend);

            item.innerHTML = `
                <div class="stock-header">
                    <div class="stock-info">
                        <span style="font-size:1.3rem;">${s.icon}</span>
                        <div>
                            <strong>${s.name}</strong>
                            <span style="color:var(--text-secondary); font-size:0.75rem; margin-left:4px;">${s.id}</span>
                        </div>
                    </div>
                    <div class="stock-price">
                        <div style="font-size:1.1rem; font-weight:bold; color:var(--accent);">${s.currentPrice.toFixed(2)}฿</div>
                        <div style="font-size:0.75rem; color:${trendColor};">${trendIcon} ${changeText}</div>
                    </div>
                </div>
                
                <div class="stock-chart">
                    ${sparkline}
                </div>
                
                ${s.dividendRate > 0 ? `<div style="font-size:0.75rem; color:var(--success); margin-bottom:6px;">💰 ปันผล ${(s.dividendRate * 100).toFixed(1)}%/วัน</div>` : ''}
                
                ${hasShares ? `
                    <div class="stock-holding">
                        <span>ถือ ${s.shares} หุ้น</span>
                        <span>ต้นทุน ${s.avgCost.toFixed(2)}฿</span>
                        <span style="color:${plColor};">${s.profitLoss >= 0 ? '+' : ''}${Math.floor(s.profitLoss)}฿</span>
                    </div>
                ` : ''}
                
                <div class="stock-actions">
                    <button class="stock-btn buy" data-action="buy" data-id="${s.id}">🟢 ซื้อ</button>
                    ${hasShares ? `<button class="stock-btn sell" data-action="sell" data-id="${s.id}">🟡 ขาย</button>` : ''}
                </div>
            `;

            // Event listeners
            item.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = btn.dataset.action;
                    const id = btn.dataset.id;
                    const price = stock.getPrice(id);

                    this.game.sound?.playClick();

                    if (action === 'buy') {
                        const maxShares = Math.floor(bank.balance / price);
                        const shares = parseInt(prompt(`ซื้อกี่หุ้น? (ราคา ${price.toFixed(2)}฿, ซื้อได้สูงสุด ${maxShares} หุ้น)`, '1'));
                        if (shares && shares > 0) {
                            stock.buy(id, shares);
                            this.renderStocks();
                            this.renderBank();
                        }
                    } else if (action === 'sell') {
                        const owned = stock.getShares(id);
                        const shares = parseInt(prompt(`ขายกี่หุ้น? (ถืออยู่ ${owned} หุ้น)`, String(owned)));
                        if (shares && shares > 0) {
                            stock.sell(id, shares);
                            this.renderStocks();
                            this.renderBank();
                        }
                    }
                });
            });

            listEl.appendChild(item);
        });
    }

    // Generate SVG sparkline for price history
    generateSparkline(history, trend) {
        if (!history || history.length < 2) {
            return '<div style="height:40px; display:flex; align-items:center; justify-content:center; color:#666; font-size:0.7rem;">รอข้อมูล...</div>';
        }

        const width = 200;
        const height = 40;
        const padding = 2;

        const min = Math.min(...history);
        const max = Math.max(...history);
        const range = max - min || 1;

        const points = history.map((price, i) => {
            const x = padding + (i / (history.length - 1)) * (width - padding * 2);
            const y = height - padding - ((price - min) / range) * (height - padding * 2);
            return `${x},${y}`;
        }).join(' ');

        const lineColor = trend === 'up' ? '#34d399' : trend === 'down' ? '#ef4444' : '#888';
        const fillColor = trend === 'up' ? 'rgba(52,211,153,0.1)' : trend === 'down' ? 'rgba(239,68,68,0.1)' : 'rgba(136,136,136,0.1)';

        // Create fill polygon
        const fillPoints = `${padding},${height - padding} ${points} ${width - padding},${height - padding}`;

        return `
            <svg width="100%" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
                <polygon points="${fillPoints}" fill="${fillColor}"/>
                <polyline points="${points}" fill="none" stroke="${lineColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
    }

    // ===================== MAP NAVIGATION =====================

    renderMap() {
        const mapGrid = document.getElementById('map-grid');
        if (!mapGrid) return;

        mapGrid.innerHTML = '';

        // Flatten location order to single array
        LOCATION_ORDER.forEach(row => {
            row.forEach(locId => {
                const loc = LOCATIONS[locId];
                if (!loc) return;

                const card = document.createElement('div');
                card.className = `location-card ${loc.status === 'coming_soon' ? 'coming-soon' : ''}`;
                card.dataset.id = loc.id;

                card.innerHTML = `
                    <span class="icon">${loc.icon}</span>
                    <span class="name">${loc.name}</span>
                    ${loc.status === 'coming_soon' ? '<span class="badge-soon">เร็วๆนี้</span>' : ''}
                `;

                if (loc.status !== 'coming_soon') {
                    card.addEventListener('click', () => {
                        this.game.sound?.playClick();
                        this.openLocation(loc.id);
                    });
                }

                mapGrid.appendChild(card);
            });
        });

        // Back to map button
        document.getElementById('back-to-map')?.addEventListener('click', () => {
            this.game.sound?.playClick();
            this.backToMap();
        });
    }

    openLocation(locationId) {
        const loc = LOCATIONS[locationId];
        if (!loc) return;

        this.currentLocation = locationId;

        // Hide map, show location panel
        document.getElementById('map-grid').classList.add('hidden');
        document.getElementById('location-panel').classList.remove('hidden');

        // Set title
        document.getElementById('location-title').textContent = `${loc.icon} ${loc.name}`;

        // Render submenu
        const submenuEl = document.getElementById('location-submenu');
        submenuEl.innerHTML = '';

        loc.submenus.forEach(item => {
            const menuItem = document.createElement('div');
            menuItem.className = `submenu-item ${item.action === 'coming_soon' ? 'coming-soon' : ''}`;

            menuItem.innerHTML = `
                <span class="icon">${item.icon}</span>
                <span class="name">${item.name}</span>
                ${item.action === 'coming_soon' ? '<span class="badge-soon">เร็วๆนี้</span>' : ''}
            `;

            if (item.action !== 'coming_soon') {
                menuItem.addEventListener('click', () => {
                    this.game.sound?.playClick();
                    this.handleSubmenuAction(item);
                });
            }

            submenuEl.appendChild(menuItem);
        });
    }

    backToMap() {
        // Hide location panel, show map
        document.getElementById('map-grid').classList.remove('hidden');
        document.getElementById('location-panel').classList.add('hidden');
        document.getElementById('sub-panels').classList.add('hidden');

        // Hide all sub-panels
        document.querySelectorAll('.sub-panel').forEach(p => p.classList.add('hidden'));

        this.currentLocation = null;
    }

    handleSubmenuAction(item) {
        const subPanels = document.getElementById('sub-panels');

        switch (item.action) {
            case 'activity':
                // Do activity directly
                if (this.game.activitySystem.doActivity(item.actionId)) {
                    // Success
                }
                break;

            case 'custom_work':
                this.toggleWorkAction();
                break;

            case 'custom_gigs':
                this.doInstantGigAction();
                break;

            case 'panel':
                // Show specific panel
                subPanels.classList.remove('hidden');
                document.querySelectorAll('.sub-panel').forEach(p => p.classList.add('hidden'));
                const panel = document.getElementById(`panel-${item.panel}`);
                if (panel) {
                    panel.classList.remove('hidden');

                    // Re-render panel content
                    switch (item.panel) {
                        case 'housing': this.renderHousing(); break;
                        case 'bank': this.renderBank(); break;
                        case 'stocks': this.renderStocks(); break;
                        case 'jobs': this.renderJobList(); break;
                        case 'skills': this.renderSkills(); break;
                        case 'courses': this.renderCourses(); break;
                        case 'shop': this.renderShop(); break;
                        case 'gigs': break; // Gigs loaded separately
                        case 'furniture-shop': this.renderFurnitureShop(); break;
                        case 'my-furniture': this.renderMyFurniture(); break;
                    }
                }
                break;

            case 'buy_item':
                // Quick buy item
                this.game.inventorySystem.buyItem(item.itemId);
                this.renderInventory();
                break;

            case 'shop':
                // Show shop with category
                subPanels.classList.remove('hidden');
                document.querySelectorAll('.sub-panel').forEach(p => p.classList.add('hidden'));
                document.getElementById('panel-shop')?.classList.remove('hidden');
                this.renderShop();
                break;

            default:
                console.log('Unknown action:', item.action);
        }
    }

    // Custom Action: Work Toggle
    toggleWorkAction() {
        if (this.game.jobSystem.isWorking) {
            this.game.jobSystem.stopWork();
            this.showToast('🛑 เลิกงานแล้ว');
            return;
        }

        if (!this.game.jobSystem.currentJob || this.game.jobSystem.currentJob.id === 'unemployed') {
            this.showToast('คุณยังไม่มีงานทำ! ไปสมัครงานก่อน');
            const subPanels = document.getElementById('sub-panels');
            subPanels.classList.remove('hidden');
            document.querySelectorAll('.sub-panel').forEach(p => p.classList.add('hidden'));
            document.getElementById('panel-jobs').classList.remove('hidden');
            this.renderJobList();
            return;
        }

        if (this.game.jobSystem.startWork()) {
            this.showToast(`💼 เริ่มทำงาน: ${this.game.jobSystem.currentJob.name}`);
        }
    }

    // Custom Action: Instant Gig
    async doInstantGigAction() {
        if (this.game.player.energy < 15) {
            this.showToast('⚡ พลังงานไม่พอสำหรับรับงานฟรีแลนซ์ (ต้องการ 15)');
            return;
        }

        this.showToast("⏳ AI กำลังหางานให้...");

        setTimeout(async () => {
            // 5% chance slightly funny fail
            if (Math.random() < 0.05) {
                const fails = [
                    "🤖 AI มึนตึ๊บ Error 404",
                    "📶 เน็ตหลุดระหว่างส่งงาน",
                    "💻 GPU ร้อนเกิน ขอพักก่อน",
                    "😵 ลูกค้าเทงานซะงั้น"
                ];
                this.showToast(fails[Math.floor(Math.random() * fails.length)]);
                return;
            }

            try {
                const gigs = await this.game.jobSystem.refreshGigs(this.game.eventSystem.aiService);
                if (gigs && gigs.length > 0) {
                    const gig = gigs[0];
                    this.game.jobSystem.activeGig = gig;
                    this.game.jobSystem.gigProgress = 0;
                    this.game.jobSystem.isGigWorking = true;
                    this.showToast(`⚡ รับงาน: ${gig.title} (รางวัล ${gig.reward}฿)`);
                } else {
                    this.showToast("🤖 AI หางานไม่เจอช่วงนี้");
                }
            } catch (e) {
                console.error(e);
            }
        }, 600);
    }

    // ===================== FURNITURE UI =====================

    renderFurnitureShop() {
        const listEl = document.getElementById('furniture-shop-list');
        if (!listEl) return;
        listEl.innerHTML = '';

        Object.values(FURNITURE).forEach(item => {
            const owned = this.game.furnitureSystem.hasFurniture(item.id);
            if (owned) return;

            const el = document.createElement('div');
            el.className = 'job-item-btn';
            el.style.justifyContent = 'space-between';
            el.innerHTML = `
                <div style="flex:1;">
                    <div style="display:flex; align-items:center; gap:8px;">
                        <span style="font-size:1.4rem;">${item.icon}</span>
                        <div>
                            <div style="font-weight:bold;">${item.name}</div>
                            <div style="font-size:0.8rem; color:#aaa;">${item.desc}</div>
                        </div>
                    </div>
                </div>
                <button class="buy-btn" style="min-width:80px;">${item.price.toLocaleString()}฿</button>
            `;

            el.querySelector('button').addEventListener('click', () => {
                if (this.game.furnitureSystem.buy(item.id)) {
                    this.renderFurnitureShop();
                    this.renderMyFurniture();
                    this.renderBank();
                }
            });

            listEl.appendChild(el);
        });

        if (listEl.children.length === 0) {
            listEl.innerHTML = '<div style="text-align:center; color:#666; padding:20px;">คุณซื้อเฟอร์นิเจอร์หมดร้านแล้ว! 🛋️✨</div>';
        }
    }

    renderMyFurniture() {
        const listEl = document.getElementById('my-furniture-list');
        if (!listEl) return;
        listEl.innerHTML = '';

        const items = this.game.furnitureSystem.getOwnedItems();
        if (items.length === 0) {
            listEl.innerHTML = '<div style="text-align:center; color:#666; padding:20px;">บ้านยังโล่งๆ นะ... ไปซื้อเฟอร์นิเจอร์ที่ห้างสิ!</div>';
            return;
        }

        items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'job-item-btn';
            el.style.background = 'rgba(74, 222, 128, 0.1)';
            el.style.border = '1px solid rgba(74, 222, 128, 0.3)';
            el.innerHTML = `
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-size:1.5rem;">${item.icon}</span>
                    <div>
                        <div style="font-weight:bold; color:var(--text-primary);">${item.name}</div>
                        <div style="font-size:0.8rem; color:var(--success);">${item.desc}</div>
                    </div>
                </div>
            `;
            listEl.appendChild(el);
        });
    }
}

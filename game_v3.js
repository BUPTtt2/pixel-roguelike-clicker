/**
 * 暗影猎手：终极版 - Shadow Hunter: Ultimate
 * 顶级像素肉鸽生存游戏
 * 
 * 核心亮点：
 * - 5种独特武器，每种有专属攻击动画和技能
 * - 8种专精构筑，build多样性拉满
 * - 6种敌人 + 4种Boss，各有独特AI
 * - Boss奖励三选一 + 武器进化系统
 * - 随从系统 + 成就系统
 * - 连击系统 + 暴击系统 + 吸血机制
 * - 超爽打击感和屏幕震动反馈
 */

const GW = 900, GH = 650, WS = 2500;

const COLORS = {
    player: 0x4488ff,
    playerBody: 0x3366cc,
    playerHead: 0xffcc99,
    sword: 0xff4466,
    axe: 0xff8800,
    staff: 0x00ffff,
    bow: 0x66ff66,
    wand: 0xff66ff,
    hp: 0xff3344,
    hpBg: 0x441122,
    exp: 0xffdd00,
    expBg: 0x222244,
    gold: 0xffd700,
    enemy: {
        slime: 0x44aa33,
        bat: 0x662266,
        skeleton: 0xcccccc,
        ghost: 0x44aaaa,
        gargoyle: 0x884444,
        archer: 0x997744
    },
    boss: {
        gk: 0x8B4513,
        sl: 0x666666,
        sd: 0x4B0082,
        dl: 0x8B0000
    }
};

// ==================== 粒子系统 ====================
class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
    }
    
    hit(x, y, color = 0xff4444, count = 10, speed = 3) {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5;
            const spd = speed + Math.random() * speed;
            const size = 2 + Math.random() * 4;
            const p = this.scene.add.circle(x, y, size, color);
            p.setDepth(200);
            this.scene.tweens.add({
                targets: p,
                x: x + Math.cos(angle) * spd * 15,
                y: y + Math.sin(angle) * spd * 15,
                alpha: { from: 1, to: 0 },
                scale: { from: 1, to: 0.3 },
                duration: 200 + Math.random() * 200,
                ease: 'Cubic.easeOut',
                onComplete: () => p.destroy()
            });
        }
    }
    
    slash(x, y, angle, color = 0xff4466, range = 100, arc = Math.PI / 2) {
        const g = this.scene.add.graphics();
        g.setDepth(150);
        g.lineStyle(4, color, 0.9);
        g.beginPath();
        g.arc(x, y, range * 0.7, angle - arc / 2, angle + arc / 2, false);
        g.strokePath();
        
        const g2 = this.scene.add.graphics();
        g2.setDepth(149);
        g2.fillStyle(color, 0.2);
        g2.beginPath();
        g2.moveTo(x, y);
        g2.arc(x, y, range * 0.8, angle - arc / 2, angle + arc / 2, false);
        g2.closePath();
        g2.fillPath();
        
        this.scene.tweens.add({
            targets: [g, g2],
            alpha: { from: 1, to: 0 },
            scale: { from: 0.8, to: 1.2 },
            duration: 180,
            ease: 'Cubic.easeOut',
            onComplete: () => { g.destroy(); g2.destroy(); }
        });
    }
    
    lineBeam(x1, y1, x2, y2, color = 0x00ffff, width = 8) {
        const g = this.scene.add.graphics();
        g.setDepth(150);
        g.lineStyle(width, color, 0.9);
        g.beginPath();
        g.moveTo(x1, y1);
        g.lineTo(x2, y2);
        g.strokePath();
        
        const g2 = this.scene.add.graphics();
        g2.setDepth(149);
        g2.lineStyle(width * 3, color, 0.3);
        g2.beginPath();
        g2.moveTo(x1, y1);
        g2.lineTo(x2, y2);
        g2.strokePath();
        
        this.scene.tweens.add({
            targets: [g, g2],
            alpha: { from: 1, to: 0 },
            scale: { from: 1, to: 0.5 },
            duration: 200,
            ease: 'Cubic.easeOut',
            onComplete: () => { g.destroy(); g2.destroy(); }
        });
    }
    
    explosion(x, y, radius = 80, color = 0xffaa00) {
        const g = this.scene.add.graphics();
        g.setDepth(150);
        g.fillStyle(color, 0.4);
        g.fillCircle(x, y, 10);
        
        const g2 = this.scene.add.graphics();
        g2.setDepth(149);
        g2.lineStyle(4, color, 0.8);
        g2.strokeCircle(x, y, 10);
        
        this.scene.tweens.add({
            targets: g,
            scale: { from: 0.3, to: radius / 10 },
            alpha: { from: 0.6, to: 0 },
            duration: 400,
            ease: 'Cubic.easeOut',
            onComplete: () => g.destroy()
        });
        
        this.scene.tweens.add({
            targets: g2,
            scale: { from: 0.5, to: radius / 10 },
            alpha: { from: 1, to: 0 },
            duration: 350,
            ease: 'Cubic.easeOut',
            onComplete: () => g2.destroy()
        });
        
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const p = this.scene.add.circle(x, y, 4, color);
            p.setDepth(155);
            this.scene.tweens.add({
                targets: p,
                x: x + Math.cos(angle) * radius * 0.8,
                y: y + Math.sin(angle) * radius * 0.8,
                alpha: { from: 1, to: 0 },
                scale: { from: 1, to: 0.3 },
                duration: 400,
                ease: 'Cubic.easeOut',
                onComplete: () => p.destroy()
            });
        }
    }
    
    levelUp() {
        const cx = GW / 2, cy = GH / 2;
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const p = this.scene.add.star(cx, cy, 5, 8, 16, 0xffd700);
            p.setDepth(300);
            this.scene.tweens.add({
                targets: p,
                x: cx + Math.cos(angle) * 250,
                y: cy + Math.sin(angle) * 200,
                alpha: { from: 0, to: 1, to: 0 },
                scale: { from: 0, to: 1.5, to: 0.5 },
                angle: angle * 2,
                duration: 1200,
                ease: 'Cubic.easeOut',
                onComplete: () => p.destroy()
            });
        }
        
        const ring = this.scene.add.graphics();
        ring.setDepth(299);
        ring.lineStyle(4, 0xffd700, 0.8);
        ring.strokeCircle(cx, cy, 50);
        
        this.scene.tweens.add({
            targets: ring,
            scale: { from: 0.3, to: 4 },
            alpha: { from: 1, to: 0 },
            duration: 800,
            ease: 'Cubic.easeOut',
            onComplete: () => ring.destroy()
        });
    }
    
    healEffect(x, y) {
        for (let i = 0; i < 6; i++) {
            const p = this.scene.add.text(x + (Math.random() - 0.5) * 30, y, '❤', {
                fontSize: '16px',
                color: '#ff4466'
            }).setOrigin(0.5);
            p.setDepth(200);
            this.scene.tweens.add({
                targets: p,
                y: y - 40 - Math.random() * 30,
                alpha: { from: 1, to: 0 },
                scale: { from: 0.5, to: 1.2 },
                duration: 700,
                ease: 'Cubic.easeOut',
                onComplete: () => p.destroy()
            });
        }
    }
    
    goldEffect(x, y, amount = 1) {
        const tx = GW - 80, ty = 35;
        for (let i = 0; i < Math.min(amount, 8); i++) {
            setTimeout(() => {
                const p = this.scene.add.circle(
                    x + (Math.random() - 0.5) * 20,
                    y + (Math.random() - 0.5) * 20,
                    5, 0xffd700
                );
                p.setDepth(200);
                this.scene.tweens.add({
                    targets: p,
                    x: tx + (Math.random() - 0.5) * 40,
                    y: ty + (Math.random() - 0.5) * 20,
                    alpha: { from: 1, to: 0 },
                    scale: { from: 1, to: 0.3 },
                    duration: 600 + Math.random() * 200,
                    ease: 'Cubic.easeIn',
                    onComplete: () => p.destroy()
                });
            }, i * 50);
        }
    }
    
    expEffect(x, y, amount = 1) {
        const tx = 70, ty = 55;
        for (let i = 0; i < Math.min(amount, 6); i++) {
            setTimeout(() => {
                const p = this.scene.add.star(
                    x + (Math.random() - 0.5) * 20,
                    y + (Math.random() - 0.5) * 20,
                    4, 3, 6, 0xffdd00
                );
                p.setDepth(200);
                this.scene.tweens.add({
                    targets: p,
                    x: tx + (Math.random() - 0.5) * 30,
                    y: ty + (Math.random() - 0.5) * 15,
                    alpha: { from: 1, to: 0 },
                    scale: { from: 1, to: 0.3 },
                    duration: 500 + Math.random() * 200,
                    ease: 'Cubic.easeIn',
                    onComplete: () => p.destroy()
                });
            }, i * 40);
        }
    }
    
    bossDefeat(x, y) {
        const colors = [0xffd700, 0xff6600, 0xff0000, 0x00ffff, 0xff00ff, 0x00ff00];
        for (let i = 0; i < 40; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 50 + Math.random() * 100;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const p = this.scene.add.circle(x, y, 5 + Math.random() * 8, color);
            p.setDepth(300);
            this.scene.tweens.add({
                targets: p,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                alpha: { from: 1, to: 0 },
                scale: { from: 1, to: 0.2 },
                duration: 800 + Math.random() * 400,
                ease: 'Cubic.easeOut',
                onComplete: () => p.destroy()
            });
        }
        
        const flash = this.scene.add.rectangle(GW / 2, GH / 2, GW, GH, 0xffffff, 0.8);
        flash.setDepth(400);
        this.scene.tweens.add({
            targets: flash,
            alpha: { from: 0.8, to: 0 },
            duration: 500,
            ease: 'Cubic.easeOut',
            onComplete: () => flash.destroy()
        });
    }
    
    spawnEffect(x, y, color = 0xff0000) {
        const ring = this.scene.add.graphics();
        ring.setDepth(100);
        ring.lineStyle(3, color, 0.6);
        ring.strokeCircle(x, y, 40);
        
        this.scene.tweens.add({
            targets: ring,
            scale: { from: 1.5, to: 0.5 },
            alpha: { from: 0.8, to: 0 },
            duration: 400,
            ease: 'Cubic.easeOut',
            onComplete: () => ring.destroy()
        });
    }
}

// ==================== 音效系统 ====================
class AudioSystem {
    constructor(scene) {
        this.scene = scene;
        this.ctx = null;
        this.volume = 0.3;
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {}
    }
    
    tone(freq, duration, type = 'sine', vol = 1) {
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(this.volume * vol * 0.3, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start();
            osc.stop(this.ctx.currentTime + duration);
        } catch (e) {}
    }
    
    play(type) {
        switch (type) {
            case 'sword': this.tone(440, 0.08, 'sawtooth', 0.8); break;
            case 'axe': this.tone(220, 0.12, 'sawtooth', 0.9); break;
            case 'staff': this.tone(880, 0.1, 'sine', 0.7); this.tone(660, 0.1, 'sine', 0.5); break;
            case 'bow': this.tone(660, 0.06, 'triangle', 0.6); break;
            case 'wand': this.tone(1200, 0.05, 'sine', 0.5); this.tone(900, 0.08, 'sine', 0.4); break;
            case 'hit': this.tone(150, 0.05, 'square', 0.7); break;
            case 'crit': this.tone(800, 0.1, 'sawtooth', 0.8); this.tone(1200, 0.15, 'sine', 0.6); break;
            case 'levelup': 
                this.tone(523, 0.1, 'sine', 0.8);
                setTimeout(() => this.tone(659, 0.1, 'sine', 0.8), 100);
                setTimeout(() => this.tone(784, 0.15, 'sine', 0.9), 200);
                break;
            case 'pickup': this.tone(880, 0.05, 'sine', 0.6); break;
            case 'hurt': this.tone(200, 0.15, 'sawtooth', 0.7); break;
            case 'skill': this.tone(400, 0.2, 'sawtooth', 0.8); this.tone(600, 0.15, 'sine', 0.6); break;
            case 'boss': this.tone(100, 0.5, 'sawtooth', 1); this.tone(80, 0.6, 'square', 0.8); break;
            case 'die': 
                this.tone(300, 0.2, 'sawtooth', 0.8);
                setTimeout(() => this.tone(200, 0.2, 'sawtooth', 0.7), 150);
                setTimeout(() => this.tone(100, 0.4, 'sawtooth', 0.6), 300);
                break;
            case 'minion': this.tone(1000, 0.04, 'triangle', 0.5); break;
        }
    }
}

// ==================== 数据存储 ====================
const SaveData = {
    load() {
        try {
            const d = localStorage.getItem('shadowHunter_v3');
            return d ? JSON.parse(d) : this.default();
        } catch (e) { return this.default(); }
    },
    save(d) {
        try { localStorage.setItem('shadowHunter_v3', JSON.stringify(d)); } catch (e) {}
    },
    default() {
        return {
            bestTime: 0,
            bestLevel: 0,
            totalKills: 0,
            totalGold: 0,
            totalRuns: 0,
            unlockedMinions: [],
            achievements: [],
            unlockedWeapons: ['sword', 'axe', 'bow']
        };
    }
};

// ==================== 武器系统 ====================
class Weapon {
    constructor(name, baseDmg, baseCd, range, type, arc, width, icon, color) {
        this.name = name;
        this.baseDmg = baseDmg;
        this.baseCd = baseCd;
        this.range = range;
        this.type = type;
        this.arc = arc;
        this.width = width;
        this.icon = icon;
        this.color = color;
        this.lastAttack = 0;
    }
    
    canAttack(now) { return now - this.lastAttack >= this.getCooldown(); }
    attack(now) { this.lastAttack = now; }
    
    getDamage(level, spec) {
        const base = this.baseDmg + (level - 1) * 5;
        return Math.floor(base * (1 + spec.atk * 0.1) * (1 + spec.weaponDmg * 0.15));
    }
    
    getCooldown(spec) {
        if (!spec) return this.baseCd;
        return this.baseCd / (1 + spec.aspd * 0.08);
    }
    
    getCritChance(spec) {
        return 0.05 + spec.crit * 0.025;
    }
    
    getCritDamage(spec) {
        return 2.0 + spec.critDmg * 0.25;
    }
}

const WeaponFactory = {
    create(type) {
        switch (type) {
            case 'sword': return new Weapon('暗影剑', 18, 350, 110, 'melee_arc', Math.PI / 2.5, 70, '⚔', COLORS.sword);
            case 'axe': return new Weapon('烈焰斧', 40, 900, 140, 'melee_arc', Math.PI / 1.8, 100, '🪓', COLORS.axe);
            case 'staff': return new Weapon('冰霜法杖', 28, 650, 550, 'ranged_line', 0, 14, '🔮', COLORS.staff);
            case 'bow': return new Weapon('狩猎弓', 35, 750, 650, 'ranged_projectile', 0, 8, '🏹', COLORS.bow);
            case 'wand': return new Weapon('奥术魔杖', 14, 300, 250, 'ranged_bounce', 0, 10, '✨', COLORS.wand);
            default: return new Weapon('暗影剑', 18, 350, 110, 'melee_arc', Math.PI / 2.5, 70, '⚔', COLORS.sword);
        }
    },
    all() { return ['sword', 'axe', 'staff', 'bow', 'wand']; },
    info(type) {
        const w = this.create(type);
        return {
            name: w.name,
            icon: w.icon,
            color: w.color,
            bg: w.color,
            desc: this.desc(type)
        };
    },
    desc(type) {
        const d = {
            sword: '快速近战，攻击范围适中，手感极佳',
            axe: '高伤害大范围，攻速较慢但一击必杀',
            staff: '穿透激光，一条直线贯穿所有敌人',
            bow: '远程箭矢，高伤害高射程，需要预判',
            wand: '奥术飞弹，自动追踪附近敌人'
        };
        return d[type] || '';
    }
};

// ==================== 技能系统 ====================
class Skill {
    constructor(name, cd, icon, desc) {
        this.name = name;
        this.cooldown = cd;
        this.icon = icon;
        this.desc = desc;
        this.lastUsed = -99999;
    }
    canUse(now) { return now - this.lastUsed >= this.cooldown; }
    use(now) { this.lastUsed = now; }
    getProgress(now) {
        return Math.min(1, (now - this.lastUsed) / this.cooldown);
    }
}

const SkillFactory = {
    create(type) {
        switch (type) {
            case 'sword': return new Skill('暗影冲刺', 8000, '💨', '向前冲刺并对沿途敌人造成暴击伤害');
            case 'axe': return new Skill('旋风斩', 10000, '🌀', '原地旋转，对周围所有敌人造成巨额伤害');
            case 'staff': return new Skill('冰霜新星', 9000, '❄', '释放冰环，冻结并伤害周围所有敌人');
            case 'bow': return new Skill('箭雨', 11000, '🌧', '向天空射出箭雨，覆盖大范围区域');
            case 'wand': return new Skill('奥术爆发', 7000, '💥', '释放奥术能量，追踪并连续攻击敌人');
            default: return new Skill('暗影冲刺', 8000, '💨', '向前冲刺并对沿途敌人造成暴击伤害');
        }
    }
};

// ==================== 专精系统 ====================
const Specializations = [
    { id: 'atk', name: '力量强化', icon: '💪', desc: '攻击力 +15%', color: 0xff6644 },
    { id: 'aspd', name: '迅捷打击', icon: '⚡', desc: '攻击速度 +10%', color: 0xffff44 },
    { id: 'crit', name: '致命一击', icon: '🎯', desc: '暴击率 +8%', color: 0xff44ff },
    { id: 'critDmg', name: '暴击伤害', icon: '💥', desc: '暴击伤害 +30%', color: 0xff8844 },
    { id: 'maxHp', name: '生命强化', icon: '❤', desc: '最大生命 +40', color: 0xff4466 },
    { id: 'regen', name: '生命回复', icon: '💚', desc: '每秒回复 2 生命', color: 0x44ff66 },
    { id: 'armor', name: '坚韧护甲', icon: '🛡', desc: '受到伤害 -15%', color: 0x8888ff },
    { id: 'speed', name: '疾风步', icon: '👟', desc: '移动速度 +12%', color: 0x44ffff },
    { id: 'gold', name: '财富祝福', icon: '💰', desc: '金币获取 +25%', color: 0xffd700 },
    { id: 'exp', name: '经验加成', icon: '⭐', desc: '经验获取 +20%', color: 0xffdd00 },
    { id: 'lifesteal', name: '吸血打击', icon: '🩸', desc: '攻击吸血 +5%', color: 0xcc2244 },
    { id: 'weaponDmg', name: '武器精通', icon: '🗡', desc: '武器伤害 +20%', color: 0xaa88ff }
];

// ==================== 运行时数据 ====================
class RuntimeData {
    constructor() {
        this.hp = 100;
        this.maxHp = 100;
        this.level = 1;
        this.exp = 0;
        this.expToNext = 50;
        this.gold = 0;
        this.surviveTime = 0;
        this.killCount = 0;
        this.bossKills = 0;
        this.weaponType = 'sword';
        this.weapon = null;
        this.weaponLevel = 1;
        this.skill = null;
        this.combo = 0;
        this.maxCombo = 0;
        this.comboTimer = 0;
        this.invincibleTimer = 0;
        this.regenTimer = 0;
        this.shield = 0;
        this.specLevels = {};
        this.minions = [];
        Specializations.forEach(s => this.specLevels[s.id] = 0);
    }
    
    get spec() {
        const s = {};
        Specializations.forEach(sp => s[sp.id] = this.specLevels[sp.id] || 0);
        return s;
    }
    
    addExp(amount) {
        const s = this.spec;
        const actual = Math.floor(amount * (1 + s.exp * 0.2));
        this.exp += actual;
        let leveled = false;
        while (this.exp >= this.expToNext) {
            this.exp -= this.expToNext;
            this.level++;
            this.expToNext = Math.floor(50 * Math.pow(1.25, this.level - 1));
            leveled = true;
        }
        return leveled;
    }
    
    addGold(amount) {
        const s = this.spec;
        const actual = Math.floor(amount * (1 + s.gold * 0.25));
        this.gold += actual;
        return actual;
    }
    
    takeDamage(amount) {
        const s = this.spec;
        let dmg = amount * (1 - s.armor * 0.15);
        dmg = Math.max(1, Math.floor(dmg));
        if (this.shield > 0) {
            const absorb = Math.min(this.shield, dmg);
            this.shield -= absorb;
            dmg -= absorb;
        }
        this.hp -= dmg;
        return dmg;
    }
    
    heal(amount) {
        const before = this.hp;
        this.hp = Math.min(this.maxHp, this.hp + amount);
        return this.hp - before;
    }
    
    updateMaxHp() {
        const s = this.spec;
        const newMax = 100 + s.maxHp * 40;
        const diff = newMax - this.maxHp;
        this.maxHp = newMax;
        if (diff > 0) this.hp += diff;
    }
}

// ==================== 投射物系统 ====================
class Projectile {
    constructor(scene, x, y, targetX, targetY, damage, type, options = {}) {
        this.scene = scene;
        this.worldX = x;
        this.worldY = y;
        this.damage = damage;
        this.type = type;
        this.alive = true;
        this.speed = options.speed || 500;
        this.pierce = options.pierce || 0;
        this.hitEnemies = new Set();
        this.bounceCount = options.bounce || 0;
        this.tracking = options.tracking || false;
        this.trackingTarget = null;
        this.color = options.color || 0xffffff;
        this.size = options.size || 6;
        
        const angle = Math.atan2(targetY - y, targetX - x);
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        
        this.createSprite();
    }
    
    createSprite() {
        const sx = this.screenX();
        const sy = this.screenY();
        
        switch (this.type) {
            case 'arrow':
                this.sprite = this.scene.add.rectangle(sx, sy, 5, 18, this.color);
                this.sprite.rotation = Math.atan2(this.vy, this.vx) + Math.PI / 2;
                break;
            case 'magic':
                this.sprite = this.scene.add.circle(sx, sy, this.size, this.color);
                this.glow = this.scene.add.circle(sx, sy, this.size * 1.8, this.color, 0.3);
                break;
            case 'frost':
                this.sprite = this.scene.add.circle(sx, sy, this.size, this.color);
                this.glow = this.scene.add.circle(sx, sy, this.size * 2, this.color, 0.25);
                break;
            case 'bone':
                this.sprite = this.scene.add.rectangle(sx, sy, 4, 14, 0xd4a574);
                this.sprite.rotation = Math.atan2(this.vy, this.vx) + Math.PI / 2;
                break;
            case 'enemyArrow':
                this.sprite = this.scene.add.rectangle(sx, sy, 4, 12, 0x997744);
                this.sprite.rotation = Math.atan2(this.vy, this.vx) + Math.PI / 2;
                break;
            default:
                this.sprite = this.scene.add.circle(sx, sy, this.size, this.color);
        }
        
        this.sprite.setDepth(120);
        if (this.glow) this.glow.setDepth(119);
    }
    
    screenX() { return this.worldX - this.scene.playerWorldX + GW / 2; }
    screenY() { return this.worldY - this.scene.playerWorldY + GH / 2; }
    
    update(delta, time) {
        if (!this.alive) return;
        
        const dt = delta / 1000;
        
        if (this.tracking && !this.trackingTarget) {
            this.findTarget();
        }
        
        if (this.tracking && this.trackingTarget && this.trackingTarget.alive) {
            const dx = this.trackingTarget.worldX - this.worldX;
            const dy = this.trackingTarget.worldY - this.worldY;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d > 0) {
                const targetVx = (dx / d) * this.speed;
                const targetVy = (dy / d) * this.speed;
                this.vx += (targetVx - this.vx) * 0.08;
                this.vy += (targetVy - this.vy) * 0.08;
                const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (speed > 0) {
                    this.vx = (this.vx / speed) * this.speed;
                    this.vy = (this.vy / speed) * this.speed;
                }
            }
        }
        
        this.worldX += this.vx * dt;
        this.worldY += this.vy * dt;
        
        const sx = this.screenX();
        const sy = this.screenY();
        this.sprite.x = sx;
        this.sprite.y = sy;
        if (this.glow) {
            this.glow.x = sx;
            this.glow.y = sy;
        }
        
        if (this.type === 'magic' || this.type === 'frost') {
            this.sprite.rotation += dt * 10;
        }
        
        if (sx < -80 || sx > GW + 80 || sy < -80 || sy > GH + 80) {
            this.destroy();
            return;
        }
        
        this.checkHit();
    }
    
    findTarget() {
        let nearest = null;
        let nearestDist = Infinity;
        for (const e of this.scene.enemyManager.enemies) {
            if (!e.alive) continue;
            const d = Phaser.Math.Distance.Between(this.worldX, this.worldY, e.worldX, e.worldY);
            if (d < nearestDist && d < 300) {
                nearestDist = d;
                nearest = e;
            }
        }
        this.trackingTarget = nearest;
    }
    
    checkHit() {
        if (this.type === 'enemyArrow' || this.type === 'bone') {
            const px = this.scene.playerWorldX;
            const py = this.scene.playerWorldY;
            const d = Phaser.Math.Distance.Between(this.worldX, this.worldY, px, py);
            if (d < 25) {
                this.scene.playerTakeDamage(this.damage);
                this.destroy();
            }
            return;
        }
        
        for (const e of this.scene.enemyManager.enemies) {
            if (!e.alive || this.hitEnemies.has(e.id)) continue;
            const d = Phaser.Math.Distance.Between(this.worldX, this.worldY, e.worldX, e.worldY);
            if (d < e.hitRadius + this.size) {
                this.hitEnemy(e);
                if (this.pierce <= 0 && this.bounceCount <= 0) {
                    this.destroy();
                    return;
                }
                if (this.bounceCount > 0) {
                    this.bounceCount--;
                    this.findNewTarget(e);
                }
                this.pierce--;
            }
        }
        
        if (this.scene.bossManager.boss && this.scene.bossManager.boss.alive) {
            const b = this.scene.bossManager.boss;
            const d = Phaser.Math.Distance.Between(this.worldX, this.worldY, b.worldX, b.worldY);
            if (d < b.hitRadius + this.size && !this.hitEnemies.has('boss')) {
                this.hitBoss(b);
                this.hitEnemies.add('boss');
                if (this.pierce <= 0 && this.bounceCount <= 0) {
                    this.destroy();
                }
            }
        }
    }
    
    hitEnemy(enemy) {
        this.hitEnemies.add(enemy.id);
        const crit = Math.random() < this.scene.runtime.weapon.getCritChance(this.scene.runtime.spec);
        const dmg = crit ? Math.floor(this.damage * this.scene.runtime.weapon.getCritDamage(this.scene.runtime.spec)) : this.damage;
        enemy.takeDamage(dmg, crit);
        this.scene.particles.hit(this.screenX(), this.screenY(), this.color, 6, 2);
    }
    
    hitBoss(boss) {
        const crit = Math.random() < this.scene.runtime.weapon.getCritChance(this.scene.runtime.spec);
        const dmg = crit ? Math.floor(this.damage * this.scene.runtime.weapon.getCritDamage(this.scene.runtime.spec)) : this.damage;
        boss.takeDamage(dmg, crit);
    }
    
    findNewTarget(fromEnemy) {
        let nearest = null;
        let nearestDist = Infinity;
        for (const e of this.scene.enemyManager.enemies) {
            if (!e.alive || e === fromEnemy || this.hitEnemies.has(e.id)) continue;
            const d = Phaser.Math.Distance.Between(this.worldX, this.worldY, e.worldX, e.worldY);
            if (d < nearestDist && d < 250) {
                nearestDist = d;
                nearest = e;
            }
        }
        if (nearest) {
            const dx = nearest.worldX - this.worldX;
            const dy = nearest.worldY - this.worldY;
            const d = Math.sqrt(dx * dx + dy * dy);
            this.vx = (dx / d) * this.speed;
            this.vy = (dy / d) * this.speed;
        }
    }
    
    destroy() {
        this.alive = false;
        if (this.sprite) { this.sprite.destroy(); this.sprite = null; }
        if (this.glow) { this.glow.destroy(); this.glow = null; }
    }
}

// ==================== 敌人系统 ====================
let enemyIdCounter = 0;

class Enemy {
    constructor(scene, type) {
        this.scene = scene;
        this.type = type;
        this.id = ++enemyIdCounter;
        this.alive = false;
        this.worldX = 0;
        this.worldY = 0;
        this.hp = 0;
        this.maxHp = 0;
        this.damage = 0;
        this.speed = 0;
        this.hitRadius = 20;
        this.sprite = null;
        this.hpBar = null;
        this.hpBarBg = null;
        this.pattern = 'direct';
        this.attackCooldown = 0;
        this.lastSpecial = 0;
        this.stunned = 0;
        this.slowed = 0;
        this.burning = 0;
        this.burnDamage = 0;
    }
    
    get config() {
        const configs = {
            slime: { hp: 30, dmg: 8, spd: 40, radius: 18, pattern: 'direct', color: COLORS.enemy.slime, exp: 5, gold: 2, size: 32 },
            bat: { hp: 20, dmg: 6, spd: 75, radius: 16, pattern: 'zigzag', color: COLORS.enemy.bat, exp: 6, gold: 2, size: 28, diveAttack: true },
            skeleton: { hp: 45, dmg: 12, spd: 50, radius: 20, pattern: 'direct', color: COLORS.enemy.skeleton, exp: 8, gold: 3, size: 34, throwBone: true },
            ghost: { hp: 35, dmg: 10, spd: 60, radius: 22, pattern: 'teleport', color: COLORS.enemy.ghost, exp: 10, gold: 4, size: 32 },
            gargoyle: { hp: 100, dmg: 20, spd: 35, radius: 26, pattern: 'slow', color: COLORS.enemy.gargoyle, exp: 20, gold: 8, size: 44, armor: true },
            archer: { hp: 30, dmg: 15, spd: 45, radius: 18, pattern: 'keepDistance', color: COLORS.enemy.archer, exp: 12, gold: 5, size: 30, shootArrow: true }
        };
        return configs[this.type] || configs.slime;
    }
    
    spawn(x, y, difficulty = 1) {
        const cfg = this.config;
        this.worldX = x;
        this.worldY = y;
        this.hp = Math.floor(cfg.hp * difficulty);
        this.maxHp = this.hp;
        this.damage = Math.floor(cfg.dmg * difficulty);
        this.speed = cfg.spd;
        this.hitRadius = cfg.radius;
        this.pattern = cfg.pattern;
        this.alive = true;
        this.stunned = 0;
        this.slowed = 0;
        this.burning = 0;
        this.lastSpecial = 0;
        this.attackCooldown = 0;
        
        this.createSprite();
        this.scene.particles.spawnEffect(this.screenX(), this.screenY(), cfg.color);
        return this;
    }
    
    createSprite() {
        const cfg = this.config;
        const sx = this.screenX();
        const sy = this.screenY();
        const size = cfg.size;
        
        this.container = this.scene.add.container(sx, sy);
        this.container.setDepth(50);
        
        switch (this.type) {
            case 'slime':
                const body = this.scene.add.ellipse(0, size * 0.1, size * 0.75, size * 0.55, cfg.color);
                const eye1 = this.scene.add.circle(-size * 0.15, -size * 0.05, size * 0.1, 0x000000);
                const eye2 = this.scene.add.circle(size * 0.15, -size * 0.05, size * 0.1, 0x000000);
                const shine = this.scene.add.ellipse(-size * 0.2, -size * 0.15, size * 0.15, size * 0.08, 0xffffff, 0.4);
                this.container.add([body, eye1, eye2, shine]);
                break;
                
            case 'bat':
                const bBody = this.scene.add.ellipse(0, 0, size * 0.4, size * 0.55, cfg.color);
                const w1 = this.scene.add.ellipse(-size * 0.35, 0, size * 0.5, size * 0.2, cfg.color);
                const w2 = this.scene.add.ellipse(size * 0.35, 0, size * 0.5, size * 0.2, cfg.color);
                w1.rotation = -0.4;
                w2.rotation = 0.4;
                const bEye1 = this.scene.add.circle(-size * 0.1, -size * 0.1, size * 0.08, 0xff0000);
                const bEye2 = this.scene.add.circle(size * 0.1, -size * 0.1, size * 0.08, 0xff0000);
                this.container.add([bBody, w1, w2, bEye1, bEye2]);
                this.wing1 = w1;
                this.wing2 = w2;
                break;
                
            case 'skeleton':
                const skHead = this.scene.add.circle(0, -size * 0.25, size * 0.28, 0xdddddd);
                const skEye1 = this.scene.add.circle(-size * 0.1, -size * 0.28, size * 0.07, 0x000000);
                const skEye2 = this.scene.add.circle(size * 0.1, -size * 0.28, size * 0.07, 0x000000);
                const skBody = this.scene.add.rectangle(0, size * 0.1, size * 0.25, size * 0.4, 0xcccccc);
                const skArm1 = this.scene.add.rectangle(-size * 0.25, size * 0.05, size * 0.1, size * 0.3, 0xcccccc);
                const skArm2 = this.scene.add.rectangle(size * 0.25, size * 0.05, size * 0.1, size * 0.3, 0xcccccc);
                skArm1.rotation = -0.3;
                skArm2.rotation = 0.3;
                this.container.add([skHead, skEye1, skEye2, skBody, skArm1, skArm2]);
                break;
                
            case 'ghost':
                const gBody = this.scene.add.ellipse(0, 0, size * 0.6, size * 0.8, cfg.color, 0.6);
                const gEye1 = this.scene.add.circle(-size * 0.15, -size * 0.1, size * 0.12, 0x00ffff);
                const gEye2 = this.scene.add.circle(size * 0.15, -size * 0.1, size * 0.12, 0x00ffff);
                const gMouth = this.scene.add.ellipse(0, size * 0.15, size * 0.12, size * 0.08, 0x000033);
                this.container.add([gBody, gEye1, gEye2, gMouth]);
                break;
                
            case 'gargoyle':
                const gargBody = this.scene.add.rectangle(0, 0, size * 0.55, size * 0.7, cfg.color);
                const gargHead = this.scene.add.circle(0, -size * 0.35, size * 0.28, cfg.color);
                const gargHorn1 = this.scene.add.triangle(-size * 0.2, -size * 0.5, -size * 0.1, -size * 0.35, -size * 0.3, -size * 0.35, 0x663333);
                const gargHorn2 = this.scene.add.triangle(size * 0.2, -size * 0.5, size * 0.1, -size * 0.35, size * 0.3, -size * 0.35, 0x663333);
                const gargEye = this.scene.add.circle(0, -size * 0.35, size * 0.1, 0xff0000);
                const gargWing1 = this.scene.add.triangle(-size * 0.5, -size * 0.1, -size * 0.25, -size * 0.3, -size * 0.25, size * 0.1, 0x552222);
                const gargWing2 = this.scene.add.triangle(size * 0.5, -size * 0.1, size * 0.25, -size * 0.3, size * 0.25, size * 0.1, 0x552222);
                this.container.add([gargBody, gargHead, gargHorn1, gargHorn2, gargEye, gargWing1, gargWing2]);
                break;
                
            case 'archer':
                const archBody = this.scene.add.rectangle(0, size * 0.1, size * 0.3, size * 0.5, cfg.color);
                const archHead = this.scene.add.circle(0, -size * 0.2, size * 0.22, 0xddddaa);
                const archEye = this.scene.add.circle(size * 0.05, -size * 0.22, size * 0.05, 0x000000);
                const archBow = this.scene.add.arc(size * 0.35, size * 0.1, size * 0.25, -Math.PI / 2, Math.PI / 2, false, 0x664422);
                archBow.lineStyle(3, 0x664422);
                this.container.add([archBody, archHead, archEye, archBow]);
                break;
        }
        
        this.hpBarBg = this.scene.add.rectangle(0, -size * 0.6, size * 0.9, 5, 0x331111);
        this.hpBar = this.scene.add.rectangle(0, -size * 0.6, size * 0.9, 5, 0xff3344);
        this.hpBar.setOrigin(0.5, 0.5);
        this.container.add(this.hpBarBg);
        this.container.add(this.hpBar);
    }
    
    screenX() { return this.worldX - this.scene.playerWorldX + GW / 2; }
    screenY() { return this.worldY - this.scene.playerWorldY + GH / 2; }
    
    update(delta, time) {
        if (!this.alive) return;
        
        const dt = delta / 1000;
        
        if (this.stunned > 0) {
            this.stunned -= delta;
            this.updateSpritePosition();
            return;
        }
        
        if (this.slowed > 0) {
            this.slowed -= delta;
        }
        
        if (this.burning > 0) {
            this.burning -= delta;
            if (Math.random() < dt * 2) {
                this.hp -= this.burnDamage;
                this.updateHpBar();
                if (this.hp <= 0) {
                    this.die();
                    return;
                }
            }
        }
        
        if (this.attackCooldown > 0) {
            this.attackCooldown -= delta;
        }
        
        this.move(dt, time);
        this.specialBehavior(time);
        this.checkPlayerCollision();
        this.updateSpritePosition();
        
        if (this.wing1 && this.wing2) {
            const flap = Math.sin(time * 0.02) * 0.3;
            this.wing1.rotation = -0.4 + flap;
            this.wing2.rotation = 0.4 - flap;
        }
    }
    
    move(dt, time) {
        const px = this.scene.playerWorldX;
        const py = this.scene.playerWorldY;
        const dx = px - this.worldX;
        const dy = py - this.worldY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 5) return;
        
        let speed = this.speed * (this.slowed > 0 ? 0.5 : 1);
        let mx = 0, my = 0;
        
        switch (this.pattern) {
            case 'direct':
                mx = (dx / dist) * speed;
                my = (dy / dist) * speed;
                break;
                
            case 'zigzag':
                const zig = Math.sin(time * 0.008 + this.id) * 30;
                mx = (dx / dist) * speed;
                my = ((dy + zig) / dist) * speed;
                break;
                
            case 'slow':
                mx = (dx / dist) * speed * 0.8;
                my = (dy / dist) * speed * 0.8;
                break;
                
            case 'keepDistance':
                if (dist < 180) {
                    mx = -(dx / dist) * speed * 0.6;
                    my = -(dy / dist) * speed * 0.6;
                } else if (dist > 280) {
                    mx = (dx / dist) * speed * 0.8;
                    my = (dy / dist) * speed * 0.8;
                }
                break;
                
            case 'teleport':
                if (dist > 150 && Math.random() < 0.003) {
                    const angle = Math.random() * Math.PI * 2;
                    this.worldX = px - Math.cos(angle) * 100;
                    this.worldY = py - Math.sin(angle) * 100;
                    this.scene.particles.hit(this.screenX(), this.screenY(), COLORS.enemy.ghost, 8, 2);
                    return;
                }
                mx = (dx / dist) * speed;
                my = (dy / dist) * speed;
                break;
        }
        
        this.worldX += mx * dt;
        this.worldY += my * dt;
        
        this.worldX = Math.max(-WS / 2, Math.min(WS / 2, this.worldX));
        this.worldY = Math.max(-WS / 2, Math.min(WS / 2, this.worldY));
    }
    
    specialBehavior(time) {
        const cfg = this.config;
        const dist = Phaser.Math.Distance.Between(
            this.worldX, this.worldY,
            this.scene.playerWorldX, this.scene.playerWorldY
        );
        
        if (cfg.diveAttack && time - this.lastSpecial > 3500 && dist < 300) {
            this.lastSpecial = time;
            this.diveAttack();
        }
        
        if (cfg.throwBone && time - this.lastSpecial > 2500 && dist < 250) {
            this.lastSpecial = time;
            this.throwBone();
        }
        
        if (cfg.shootArrow && time - this.lastSpecial > 2000 && dist < 350 && dist > 100) {
            this.lastSpecial = time;
            this.shootArrow();
        }
    }
    
    diveAttack() {
        const px = this.scene.playerWorldX;
        const py = this.scene.playerWorldY;
        const dx = px - this.worldX;
        const dy = py - this.worldY;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > 0) {
            this.worldX += (dx / d) * 80;
            this.worldY += (dy / d) * 80;
        }
        this.scene.tweens.add({
            targets: this.container,
            scale: { from: 1, to: 1.5, to: 1 },
            duration: 300,
            ease: 'Cubic.easeOut'
        });
    }
    
    throwBone() {
        const px = this.scene.playerWorldX;
        const py = this.scene.playerWorldY;
        this.scene.projectiles.push(new Projectile(
            this.scene, this.worldX, this.worldY, px, py,
            this.damage * 0.7, 'bone',
            { speed: 300, color: 0xd4a574 }
        ));
    }
    
    shootArrow() {
        const px = this.scene.playerWorldX;
        const py = this.scene.playerWorldY;
        this.scene.projectiles.push(new Projectile(
            this.scene, this.worldX, this.worldY, px, py,
            this.damage * 0.8, 'enemyArrow',
            { speed: 350 }
        ));
    }
    
    checkPlayerCollision() {
        if (this.attackCooldown > 0) return;
        const px = this.scene.playerWorldX;
        const py = this.scene.playerWorldY;
        const d = Phaser.Math.Distance.Between(this.worldX, this.worldY, px, py);
        if (d < this.hitRadius + 20) {
            this.scene.playerTakeDamage(this.damage);
            this.attackCooldown = 800;
        }
    }
    
    updateSpritePosition() {
        this.container.x = this.screenX();
        this.container.y = this.screenY();
    }
    
    takeDamage(amount, isCrit = false) {
        if (!this.alive) return false;
        
        let dmg = amount;
        if (this.config.armor) {
            dmg = Math.floor(dmg * 0.65);
        }
        
        this.hp -= dmg;
        this.updateHpBar();
        
        this.scene.showDamageNumber(this.screenX(), this.screenY() - 20, dmg, isCrit);
        
        this.scene.tweens.add({
            targets: this.container,
            alpha: { from: 1, to: 0.4, to: 1 },
            duration: 80
        });
        
        if (this.hp <= 0) {
            this.die();
            return true;
        }
        return false;
    }
    
    applySlow(duration) {
        this.slowed = Math.max(this.slowed, duration);
    }
    
    applyBurn(damage, duration) {
        this.burning = Math.max(this.burning, duration);
        this.burnDamage = Math.max(this.burnDamage, damage);
    }
    
    applyStun(duration) {
        this.stunned = Math.max(this.stunned, duration);
    }
    
    updateHpBar() {
        if (!this.hpBar) return;
        const ratio = Math.max(0, this.hp / this.maxHp);
        this.hpBar.scaleX = ratio;
        this.hpBar.x = -this.config.size * 0.45 * (1 - ratio);
    }
    
    die() {
        this.alive = false;
        const cfg = this.config;
        
        this.scene.runtime.killCount++;
        this.scene.runtime.combo++;
        this.scene.runtime.comboTimer = 2000;
        if (this.scene.runtime.combo > this.scene.runtime.maxCombo) {
            this.scene.runtime.maxCombo = this.scene.runtime.combo;
        }
        
        const goldGained = this.scene.runtime.addGold(cfg.gold);
        const leveled = this.scene.runtime.addExp(cfg.exp);
        
        this.scene.particles.goldEffect(this.screenX(), this.screenY(), goldGained);
        this.scene.particles.expEffect(this.screenX(), this.screenY(), Math.ceil(cfg.exp / 10));
        this.scene.particles.hit(this.screenX(), this.screenY(), cfg.color, 12, 3);
        
        const s = this.scene.runtime.spec;
        if (s.lifesteal > 0) {
            const heal = Math.floor(cfg.hp * s.lifesteal * 0.05);
            if (heal > 0) {
                this.scene.runtime.heal(heal);
                this.scene.particles.healEffect(GW / 2, GH / 2);
            }
        }
        
        this.dropLoot();
        
        if (leveled) {
            this.scene.onLevelUp();
        }
        
        this.scene.tweens.add({
            targets: this.container,
            alpha: 0,
            scale: 0,
            duration: 250,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                if (this.container) {
                    this.container.destroy();
                    this.container = null;
                }
            }
        });
    }
    
    dropLoot() {
        if (Math.random() < 0.15) {
            const types = ['health', 'gold', 'exp', 'shield'];
            const weights = [25, 35, 30, 10];
            const type = this.weightedRandom(types, weights);
            this.scene.items.push(new PickupItem(this.scene, type, this.worldX, this.worldY));
        }
    }
    
    weightedRandom(items, weights) {
        const total = weights.reduce((a, b) => a + b, 0);
        let rand = Math.random() * total;
        for (let i = 0; i < items.length; i++) {
            rand -= weights[i];
            if (rand <= 0) return items[i];
        }
        return items[items.length - 1];
    }
}

class EnemyManager {
    constructor(scene) {
        this.scene = scene;
        this.enemies = [];
        this.lastSpawn = 0;
        this.spawnInterval = 2000;
        this.maxEnemies = 40;
        this.waveNumber = 0;
    }
    
    getDifficulty(time) {
        const minutes = time / 60;
        return 1 + minutes * 0.4 + Math.pow(minutes, 1.3) * 0.1;
    }
    
    update(time, delta) {
        const difficulty = this.getDifficulty(time);
        
        this.spawnInterval = Math.max(500, 2000 - time * 3);
        const spawnCount = Math.min(5, 1 + Math.floor(time / 20));
        
        if (time - this.lastSpawn > this.spawnInterval && this.enemies.filter(e => e.alive).length < this.maxEnemies) {
            this.lastSpawn = time;
            for (let i = 0; i < spawnCount; i++) {
                this.spawnEnemy(difficulty, time);
            }
        }
        
        this.enemies.forEach(e => e.update(delta, time));
        this.enemies = this.enemies.filter(e => e.alive);
    }
    
    spawnEnemy(difficulty, time) {
        const types = this.getAvailableTypes(time);
        const type = types[Math.floor(Math.random() * types.length)];
        
        const angle = Math.random() * Math.PI * 2;
        const dist = 400 + Math.random() * 150;
        const x = this.scene.playerWorldX + Math.cos(angle) * dist;
        const y = this.scene.playerWorldY + Math.sin(angle) * dist;
        
        const enemy = new Enemy(this.scene, type);
        enemy.spawn(x, y, difficulty);
        this.enemies.push(enemy);
    }
    
    getAvailableTypes(time) {
        const types = ['slime'];
        if (time > 10) types.push('bat');
        if (time > 30) types.push('skeleton');
        if (time > 60) types.push('ghost');
        if (time > 90) types.push('archer');
        if (time > 120) types.push('gargoyle');
        return types;
    }
    
    getEnemiesInArc(x, y, radius, angle, arcWidth) {
        return this.enemies.filter(e => {
            if (!e.alive) return false;
            const d = Phaser.Math.Distance.Between(x, y, e.worldX, e.worldY);
            if (d > radius) return false;
            const ea = Math.atan2(e.worldY - y, e.worldX - x);
            let diff = ea - angle;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            return Math.abs(diff) <= arcWidth / 2;
        });
    }
    
    getEnemiesOnLine(x1, y1, x2, y2, width) {
        return this.enemies.filter(e => {
            if (!e.alive) return false;
            return this.pointToLineDistance(e.worldX, e.worldY, x1, y1, x2, y2) <= width + e.hitRadius;
        });
    }
    
    pointToLineDistance(px, py, x1, y1, x2, y2) {
        const A = px - x1;
        const B = py - y1;
        const C = x2 - x1;
        const D = y2 - y1;
        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        if (lenSq !== 0) param = dot / lenSq;
        let xx, yy;
        if (param < 0) { xx = x1; yy = y1; }
        else if (param > 1) { xx = x2; yy = y2; }
        else { xx = x1 + param * C; yy = y1 + param * D; }
        const dx = px - xx;
        const dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }
    
    getEnemiesInRadius(x, y, radius) {
        return this.enemies.filter(e => {
            if (!e.alive) return false;
            return Phaser.Math.Distance.Between(x, y, e.worldX, e.worldY) <= radius;
        });
    }
    
    clear() {
        this.enemies.forEach(e => {
            if (e.container) e.container.destroy();
        });
        this.enemies = [];
    }
}

// ==================== 拾取物品 ====================
class PickupItem {
    constructor(scene, type, x, y) {
        this.scene = scene;
        this.type = type;
        this.worldX = x;
        this.worldY = y;
        this.alive = true;
        this.sprite = null;
        this.bobOffset = Math.random() * Math.PI * 2;
        this.create();
    }
    
    create() {
        const sx = this.screenX();
        const sy = this.screenY();
        const icons = {
            health: { icon: '❤', color: '#ff4466', size: '20px' },
            gold: { icon: '💰', color: '#ffd700', size: '18px' },
            exp: { icon: '⭐', color: '#ffdd00', size: '18px' },
            shield: { icon: '🛡', color: '#4488ff', size: '20px' },
            bomb: { icon: '💣', color: '#ff8844', size: '20px' }
        };
        const cfg = icons[this.type] || icons.gold;
        this.sprite = this.scene.add.text(sx, sy, cfg.icon, {
            fontSize: cfg.size
        }).setOrigin(0.5);
        this.sprite.setDepth(60);
    }
    
    screenX() { return this.worldX - this.scene.playerWorldX + GW / 2; }
    screenY() { return this.worldY - this.scene.playerWorldY + GH / 2; }
    
    update(time) {
        if (!this.alive) return;
        
        const bob = Math.sin(time * 0.003 + this.bobOffset) * 5;
        this.sprite.x = this.screenX();
        this.sprite.y = this.screenY() + bob;
        
        const d = Phaser.Math.Distance.Between(
            this.worldX, this.worldY,
            this.scene.playerWorldX, this.scene.playerWorldY
        );
        if (d < 35) {
            this.pickup();
        }
    }
    
    pickup() {
        this.alive = false;
        this.scene.audio.play('pickup');
        
        switch (this.type) {
            case 'health':
                const heal = this.scene.runtime.heal(30);
                if (heal > 0) this.scene.particles.healEffect(GW / 2, GH / 2);
                break;
            case 'gold':
                this.scene.runtime.addGold(15);
                this.scene.particles.goldEffect(this.screenX(), this.screenY(), 5);
                break;
            case 'exp':
                const leveled = this.scene.runtime.addExp(20);
                this.scene.particles.expEffect(this.screenX(), this.screenY(), 3);
                if (leveled) this.scene.onLevelUp();
                break;
            case 'shield':
                this.scene.runtime.shield += 25;
                break;
        }
        
        this.sprite.destroy();
        this.sprite = null;
    }
}

// ==================== Boss系统 ====================
class Boss {
    constructor(scene, type) {
        this.scene = scene;
        this.type = type;
        this.alive = false;
        this.worldX = 0;
        this.worldY = 0;
        this.hp = 0;
        this.maxHp = 0;
        this.damage = 0;
        this.speed = 30;
        this.hitRadius = 50;
        this.container = null;
        this.hpBar = null;
        this.hpBarBg = null;
        this.nameText = null;
        this.lastSpecial = 0;
        this.specialCooldown = 5000;
        this.attackCooldown = 0;
        this.phase = 1;
    }
    
    get config() {
        const configs = {
            gk: { name: '哥布林王', hp: 800, dmg: 25, spd: 35, radius: 45, color: 0x8B4513, exp: 100, gold: 80, size: 80 },
            sl: { name: '骷髅领主', hp: 1500, dmg: 35, spd: 28, radius: 50, color: 0x666666, exp: 200, gold: 150, size: 90 },
            sd: { name: '暗影龙', hp: 2800, dmg: 50, spd: 40, radius: 60, color: 0x4B0082, exp: 400, gold: 300, size: 110 },
            dl: { name: '深渊魔王', hp: 5000, dmg: 70, spd: 32, radius: 70, color: 0x8B0000, exp: 800, gold: 600, size: 130 }
        };
        return configs[this.type] || configs.gk;
    }
    
    spawn(difficulty = 1) {
        const cfg = this.config;
        this.worldX = this.scene.playerWorldX;
        this.worldY = this.scene.playerWorldY - 200;
        this.hp = Math.floor(cfg.hp * difficulty);
        this.maxHp = this.hp;
        this.damage = Math.floor(cfg.dmg * difficulty);
        this.speed = cfg.spd;
        this.hitRadius = cfg.radius;
        this.alive = true;
        this.phase = 1;
        this.lastSpecial = 0;
        this.attackCooldown = 0;
        
        this.createSprite();
        this.scene.audio.play('boss');
        this.scene.cameras.main.shake(500, 0.015);
        return this;
    }
    
    createSprite() {
        const cfg = this.config;
        const sx = GW / 2;
        const sy = GH / 2 - 200;
        const size = cfg.size;
        
        this.container = this.scene.add.container(sx, sy);
        this.container.setDepth(80);
        
        const body = this.scene.add.circle(0, 0, size * 0.5, cfg.color);
        const head = this.scene.add.circle(0, -size * 0.35, size * 0.3, cfg.color);
        const eye1 = this.scene.add.circle(-size * 0.12, -size * 0.38, size * 0.08, 0xff0000);
        const eye2 = this.scene.add.circle(size * 0.12, -size * 0.38, size * 0.08, 0xff0000);
        
        const crown = this.scene.add.triangle(0, -size * 0.55, -size * 0.25, -size * 0.35, 0, -size * 0.6, size * 0.25, -size * 0.35, 0xffd700);
        
        this.container.add([body, head, eye1, eye2, crown]);
        
        this.hpBarBg = this.scene.add.rectangle(GW / 2, 60, 500, 18, 0x220000).setOrigin(0.5);
        this.hpBarBg.setDepth(200);
        this.hpBarBg.setScrollFactor(0);
        
        this.hpBar = this.scene.add.rectangle(GW / 2 - 250, 60, 500, 18, 0xff2244).setOrigin(0, 0.5);
        this.hpBar.setDepth(201);
        this.hpBar.setScrollFactor(0);
        
        this.nameText = this.scene.add.text(GW / 2, 40, cfg.name, {
            fontSize: '20px',
            fontFamily: 'Courier New',
            color: '#ff4466',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5);
        this.nameText.setDepth(202);
        this.nameText.setScrollFactor(0);
        
        this.scene.tweens.add({
            targets: this.container,
            alpha: { from: 0, to: 1 },
            scale: { from: 0.3, to: 1 },
            duration: 800,
            ease: 'Back.easeOut'
        });
    }
    
    screenX() { return this.worldX - this.scene.playerWorldX + GW / 2; }
    screenY() { return this.worldY - this.scene.playerWorldY + GH / 2; }
    
    update(delta, time) {
        if (!this.alive) return;
        
        const dt = delta / 1000;
        
        if (this.attackCooldown > 0) this.attackCooldown -= delta;
        
        if (this.hp < this.maxHp * 0.5 && this.phase === 1) {
            this.phase = 2;
            this.speed *= 1.3;
            this.specialCooldown *= 0.7;
            this.scene.cameras.main.shake(300, 0.01);
        }
        
        this.move(dt);
        this.specialAttack(time);
        this.checkPlayerCollision();
        this.updateSpritePosition();
    }
    
    move(dt) {
        const px = this.scene.playerWorldX;
        const py = this.scene.playerWorldY;
        const dx = px - this.worldX;
        const dy = py - this.worldY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 60) return;
        
        const speed = this.speed * (this.phase === 2 ? 1.2 : 1);
        this.worldX += (dx / dist) * speed * dt;
        this.worldY += (dy / dist) * speed * dt;
    }
    
    specialAttack(time) {
        if (time - this.lastSpecial < this.specialCooldown) return;
        this.lastSpecial = time;
        
        const attacks = ['shootProjectiles', 'spawnMinions', 'chargeAttack', 'aoeAttack'];
        const attack = attacks[Math.floor(Math.random() * attacks.length)];
        this[attack]();
    }
    
    shootProjectiles() {
        const count = this.phase === 2 ? 8 : 5;
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const tx = this.worldX + Math.cos(angle) * 200;
            const ty = this.worldY + Math.sin(angle) * 200;
            this.scene.projectiles.push(new Projectile(
                this.scene, this.worldX, this.worldY, tx, ty,
                this.damage * 0.6, 'enemyArrow',
                { speed: 250, color: 0xff4444, size: 8 }
            ));
        }
    }
    
    spawnMinions() {
        const count = this.phase === 2 ? 5 : 3;
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 100 + Math.random() * 50;
            const x = this.worldX + Math.cos(angle) * dist;
            const y = this.worldY + Math.sin(angle) * dist;
            
            const types = ['slime', 'skeleton'];
            const type = types[Math.floor(Math.random() * types.length)];
            const enemy = new Enemy(this.scene, type);
            enemy.spawn(x, y, 0.8);
            this.scene.enemyManager.enemies.push(enemy);
        }
    }
    
    chargeAttack() {
        const px = this.scene.playerWorldX;
        const py = this.scene.playerWorldY;
        const dx = px - this.worldX;
        const dy = py - this.worldY;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > 0) {
            this.worldX += (dx / d) * 150;
            this.worldY += (dy / d) * 150;
        }
        this.scene.tweens.add({
            targets: this.container,
            scale: { from: 1, to: 1.4, to: 1 },
            duration: 400,
            ease: 'Cubic.easeOut'
        });
        this.scene.cameras.main.shake(200, 0.01);
    }
    
    aoeAttack() {
        const radius = this.phase === 2 ? 180 : 140;
        this.scene.particles.explosion(this.screenX(), this.screenY(), radius, this.config.color);
        
        const d = Phaser.Math.Distance.Between(
            this.worldX, this.worldY,
            this.scene.playerWorldX, this.scene.playerWorldY
        );
        if (d < radius) {
            this.scene.playerTakeDamage(this.damage * 0.8);
        }
        
        this.scene.cameras.main.shake(300, 0.015);
    }
    
    checkPlayerCollision() {
        if (this.attackCooldown > 0) return;
        const d = Phaser.Math.Distance.Between(
            this.worldX, this.worldY,
            this.scene.playerWorldX, this.scene.playerWorldY
        );
        if (d < this.hitRadius + 20) {
            this.scene.playerTakeDamage(this.damage);
            this.attackCooldown = 1000;
        }
    }
    
    updateSpritePosition() {
        this.container.x = this.screenX();
        this.container.y = this.screenY();
    }
    
    takeDamage(amount, isCrit = false) {
        if (!this.alive) return false;
        
        this.hp -= amount;
        this.updateHpBar();
        
        this.scene.showDamageNumber(this.screenX(), this.screenY() - 40, amount, isCrit);
        
        this.scene.tweens.add({
            targets: this.container,
            alpha: { from: 1, to: 0.5, to: 1 },
            duration: 60
        });
        
        if (this.hp <= 0) {
            this.die();
            return true;
        }
        return false;
    }
    
    updateHpBar() {
        if (!this.hpBar) return;
        const ratio = Math.max(0, this.hp / this.maxHp);
        this.hpBar.scaleX = ratio;
    }
    
    die() {
        this.alive = false;
        const cfg = this.config;
        
        this.scene.runtime.bossKills++;
        this.scene.runtime.addGold(cfg.gold);
        const leveled = this.scene.runtime.addExp(cfg.exp);
        
        this.scene.particles.bossDefeat(this.screenX(), this.screenY());
        this.scene.cameras.main.shake(800, 0.02);
        
        for (let i = 0; i < 5; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 50 + Math.random() * 50;
            this.scene.items.push(new PickupItem(
                this.scene,
                ['health', 'gold', 'exp', 'shield'][Math.floor(Math.random() * 4)],
                this.worldX + Math.cos(angle) * dist,
                this.worldY + Math.sin(angle) * dist
            ));
        }
        
        if (leveled) this.scene.onLevelUp();
        
        this.scene.time.delayedCall(1000, () => {
            this.scene.showBossReward();
        });
        
        this.scene.tweens.add({
            targets: [this.container, this.hpBar, this.hpBarBg, this.nameText],
            alpha: 0,
            scale: 0,
            duration: 600,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                if (this.container) this.container.destroy();
                if (this.hpBar) this.hpBar.destroy();
                if (this.hpBarBg) this.hpBarBg.destroy();
                if (this.nameText) this.nameText.destroy();
            }
        });
    }
}

class BossManager {
    constructor(scene) {
        this.scene = scene;
        this.boss = null;
        this.bossTypes = ['gk', 'sl', 'sd', 'dl'];
        this.currentBossIndex = 0;
        this.lastBossTime = 0;
        this.bossInterval = 60000;
        this.warningActive = false;
    }
    
    update(time, delta) {
        const gameTime = time / 1000;
        
        if (!this.boss && !this.warningActive && gameTime - this.lastBossTime > this.bossInterval / 1000) {
            this.showWarning(time);
        }
        
        if (this.boss && this.boss.alive) {
            this.boss.update(delta, time);
        }
    }
    
    showWarning(time) {
        this.warningActive = true;
        this.scene.audio.play('boss');
        
        const warning = this.scene.add.text(GW / 2, GH / 2, '⚠ BOSS 来袭！ ⚠', {
            fontSize: '40px',
            fontFamily: 'Courier New',
            color: '#ff4466',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(0.5);
        warning.setDepth(300);
        
        this.scene.tweens.add({
            targets: warning,
            alpha: { from: 0, to: 1, to: 0, to: 1, to: 0 },
            scale: { from: 0.5, to: 1.2, to: 1, to: 1.2, to: 0.8 },
            duration: 2500,
            ease: 'Cubic.easeInOut',
            onComplete: () => {
                warning.destroy();
                this.spawnBoss(time);
            }
        });
        
        this.scene.cameras.main.shake(2500, 0.008);
    }
    
    spawnBoss(time) {
        this.warningActive = false;
        const type = this.bossTypes[this.currentBossIndex % this.bossTypes.length];
        const difficulty = 1 + (time / 1000) / 60 * 0.5;
        
        this.boss = new Boss(this.scene, type);
        this.boss.spawn(difficulty);
        this.currentBossIndex++;
    }
    
    onBossDefeated(time) {
        this.lastBossTime = time / 1000;
        this.bossInterval = Math.max(45000, this.bossInterval - 5000);
    }
}

// ==================== 随从系统 ====================
class Minion {
    constructor(scene, type) {
        this.scene = scene;
        this.type = type;
        this.worldX = 0;
        this.worldY = 0;
        this.sprite = null;
        this.lastAttack = 0;
        this.attackInterval = 1500;
        this.damage = 10;
        this.orbitAngle = Math.random() * Math.PI * 2;
        this.orbitSpeed = 0.002;
        this.orbitRadius = 60;
    }
    
    get config() {
        const configs = {
            light: { name: '光明精灵', dmg: 12, interval: 1200, color: 0xffee88, size: 16 },
            shadow: { name: '暗影战士', dmg: 20, interval: 2000, color: 0x6644aa, size: 22 }
        };
        return configs[this.type] || configs.light;
    }
    
    spawn(x, y) {
        this.worldX = x;
        this.worldY = y;
        const cfg = this.config;
        const sx = this.screenX();
        const sy = this.screenY();
        
        this.container = this.scene.add.container(sx, sy);
        this.container.setDepth(70);
        
        if (this.type === 'light') {
            const body = this.scene.add.circle(0, 0, cfg.size, cfg.color, 0.8);
            const glow = this.scene.add.circle(0, 0, cfg.size * 1.8, cfg.color, 0.3);
            const wing1 = this.scene.add.ellipse(-cfg.size * 0.8, 0, cfg.size * 0.6, cfg.size * 0.3, 0xffffaa, 0.6);
            const wing2 = this.scene.add.ellipse(cfg.size * 0.8, 0, cfg.size * 0.6, cfg.size * 0.3, 0xffffaa, 0.6);
            wing1.rotation = -0.3;
            wing2.rotation = 0.3;
            this.container.add([glow, body, wing1, wing2]);
        } else {
            const body = this.scene.add.circle(0, 0, cfg.size, cfg.color);
            const eyes = this.scene.add.circle(0, -2, cfg.size * 0.4, 0xff0000);
            const scythe = this.scene.add.rectangle(cfg.size, -cfg.size * 0.3, 4, cfg.size * 1.5, 0x331144);
            scythe.rotation = 0.3;
            this.container.add([body, eyes, scythe]);
        }
        
        return this;
    }
    
    screenX() { return this.worldX - this.scene.playerWorldX + GW / 2; }
    screenY() { return this.worldY - this.scene.playerWorldY + GH / 2; }
    
    update(time, delta) {
        const cfg = this.config;
        
        this.orbitAngle += this.orbitSpeed * delta;
        const targetX = this.scene.playerWorldX + Math.cos(this.orbitAngle) * this.orbitRadius;
        const targetY = this.scene.playerWorldY + Math.sin(this.orbitAngle) * this.orbitRadius;
        
        this.worldX += (targetX - this.worldX) * 0.1;
        this.worldY += (targetY - this.worldY) * 0.1;
        
        this.container.x = this.screenX();
        this.container.y = this.screenY();
        
        if (time - this.lastAttack > this.attackInterval) {
            this.attack(time);
        }
    }
    
    attack(time) {
        const target = this.findTarget();
        if (!target) return;
        
        this.lastAttack = time;
        const cfg = this.config;
        const dmg = cfg.dmg + this.scene.runtime.spec.min * 3;
        
        this.scene.projectiles.push(new Projectile(
            this.scene, this.worldX, this.worldY,
            target.worldX, target.worldY,
            dmg, 'magic',
            { speed: 400, color: cfg.color, tracking: true, size: 5 }
        ));
        
        this.scene.audio.play('minion');
    }
    
    findTarget() {
        let nearest = null;
        let nearestDist = Infinity;
        for (const e of this.scene.enemyManager.enemies) {
            if (!e.alive) continue;
            const d = Phaser.Math.Distance.Between(this.worldX, this.worldY, e.worldX, e.worldY);
            if (d < nearestDist && d < 350) {
                nearestDist = d;
                nearest = e;
            }
        }
        return nearest;
    }
    
    destroy() {
        if (this.container) {
            this.container.destroy();
            this.container = null;
        }
    }
}

// ==================== 成就系统 ====================
const Achievements = [
    { id: 'first_blood', name: '初战告捷', desc: '击败第一个敌人', icon: '⚔' },
    { id: 'killer_10', name: '小试牛刀', desc: '单局击败10个敌人', icon: '💀' },
    { id: 'killer_50', name: '杀戮者', desc: '单局击败50个敌人', icon: '☠' },
    { id: 'survive_60', name: '幸存者', desc: '存活60秒', icon: '⏱' },
    { id: 'survive_180', name: '坚韧不拔', desc: '存活180秒', icon: '🏆' },
    { id: 'boss_1', name: '屠龙勇士', desc: '击败第一个Boss', icon: '👑' },
    { id: 'level_5', name: '成长之路', desc: '达到5级', icon: '⭐' },
    { id: 'level_10', name: '登峰造极', desc: '达到10级', icon: '🌟' },
    { id: 'combo_10', name: '连击大师', desc: '达成10连击', icon: '🔥' },
    { id: 'gold_100', name: '小富翁', desc: '单局获得100金币', icon: '💰' },
    { id: 'gold_500', name: '大富翁', desc: '单局获得500金币', icon: '💎' },
    { id: 'all_weapons', name: '武器大师', desc: '使用所有武器各通关一次', icon: '🗡' }
];

// ==================== 主游戏场景 ====================
class GameScene extends Phaser.Scene {
    constructor() { super('Game'); }
    
    create() {
        this.saveData = SaveData.load();
        this.runtime = new RuntimeData();
        this.particles = new ParticleSystem(this);
        this.audio = new AudioSystem(this);
        this.enemyManager = new EnemyManager(this);
        this.bossManager = new BossManager(this);
        this.projectiles = [];
        this.items = [];
        this.minions = [];
        
        this.playerWorldX = 0;
        this.playerWorldY = 0;
        this.gameState = 'menu';
        this.paused = false;
        this.startTime = 0;
        this.damageNumbers = [];
        
        this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE,ESC');
        this.input.on('pointermove', p => this.mousePos = p);
        this.input.keyboard.on('keydown-SPACE', () => this.useSkill());
        this.input.keyboard.on('keydown-ESC', () => this.togglePause());
        
        this.createBackground();
        this.createPlayer();
        this.createHUD();
        this.showMainMenu();
    }
    
    createBackground() {
        this.bgGraphics = this.add.graphics();
        this.bgStars = [];
        for (let i = 0; i < 80; i++) {
            this.bgStars.push({
                x: Math.random() * WS - WS / 2,
                y: Math.random() * WS - WS / 2,
                size: Math.random() * 2 + 1,
                alpha: Math.random() * 0.5 + 0.2
            });
        }
        this.drawBackground();
    }
    
    drawBackground() {
        const g = this.bgGraphics;
        g.clear();
        g.fillStyle(0x0a0a18, 1);
        g.fillRect(0, 0, GW, GH);
        
        const gridSize = 100;
        const ox = -this.playerWorldX % gridSize + GW / 2;
        const oy = -this.playerWorldY % gridSize + GH / 2;
        
        g.lineStyle(1, 0x1a1a35, 0.4);
        for (let x = ox; x < GW; x += gridSize) {
            g.beginPath(); g.moveTo(x, 0); g.lineTo(x, GH); g.strokePath();
        }
        for (let y = oy; y < GH; y += gridSize) {
            g.beginPath(); g.moveTo(0, y); g.lineTo(GW, y); g.strokePath();
        }
        
        this.bgStars.forEach(s => {
            const sx = s.x - this.playerWorldX * 0.3 + GW / 2;
            const sy = s.y - this.playerWorldY * 0.3 + GH / 2;
            if (sx > -10 && sx < GW + 10 && sy > -10 && sy < GH + 10) {
                g.fillStyle(0xffffff, s.alpha);
                g.fillCircle(sx, sy, s.size);
            }
        });
        
        const edgeDist = WS / 2 - 100;
        if (Math.abs(this.playerWorldX) > edgeDist || Math.abs(this.playerWorldY) > edgeDist) {
            g.fillStyle(0xff0000, 0.08);
            g.fillRect(0, 0, GW, GH);
        }
    }
    
    createPlayer() {
        this.player = this.add.container(GW / 2, GH / 2);
        this.player.setDepth(100);
        
        const body = this.add.ellipse(0, 5, 22, 26, COLORS.playerBody);
        const head = this.add.circle(0, -12, 14, COLORS.playerHead);
        const hair = this.add.ellipse(0, -18, 14, 8, 0x443322);
        const eye1 = this.add.circle(-5, -13, 2.5, 0x000000);
        const eye2 = this.add.circle(5, -13, 2.5, 0x000000);
        const cape = this.add.triangle(-8, 5, -15, -5, -20, 25, -5, 20, 0x2244aa);
        
        this.player.add([cape, body, head, hair, eye1, eye2]);
        
        this.weaponContainer = this.add.container(25, 0);
        this.weaponContainer.setDepth(101);
        this.player.add(this.weaponContainer);
    }
    
    createWeaponVisual(type) {
        this.weaponContainer.removeAll(true);
        
        switch (type) {
            case 'sword':
                const blade = this.add.rectangle(8, 0, 30, 6, 0xccccff);
                const hilt = this.add.rectangle(-6, 0, 8, 12, 0x884422);
                const guard = this.add.rectangle(0, 0, 4, 16, 0xffd700);
                this.weaponContainer.add([hilt, guard, blade]);
                break;
            case 'axe':
                const handle = this.add.rectangle(0, 0, 35, 5, 0x8B4513);
                const axeHead = this.add.triangle(18, 0, 10, -18, 28, -10, 28, 10, 10, 18, 0xaaaaaa);
                this.weaponContainer.add([handle, axeHead]);
                break;
            case 'staff':
                const st = this.add.rectangle(0, 0, 32, 5, 0x8B4513);
                const gem = this.add.circle(16, 0, 8, 0x00ffff);
                const gemGlow = this.add.circle(16, 0, 14, 0x00ffff, 0.3);
                this.weaponContainer.add([st, gemGlow, gem]);
                break;
            case 'bow':
                const bow = this.add.arc(0, 0, 20, -Math.PI / 2.5, Math.PI / 2.5, false, 0x8B4513);
                bow.lineStyle(4, 0x8B4513);
                const string = this.add.line(0, 0, 0, -16, 0, 16, 0xdddddd);
                this.weaponContainer.add([bow, string]);
                break;
            case 'wand':
                const wd = this.add.rectangle(0, 0, 28, 5, 0x442266);
                const star1 = this.add.star(14, 0, 5, 4, 10, 0xff66ff);
                const star2 = this.add.star(14, 0, 5, 2, 6, 0xffffff);
                this.weaponContainer.add([wd, star1, star2]);
                break;
        }
    }
    
    createHUD() {
        this.hpBg = this.add.rectangle(20, 25, 200, 20, 0x220011).setOrigin(0, 0.5);
        this.hpBar = this.add.rectangle(20, 25, 200, 20, COLORS.hp).setOrigin(0, 0.5);
        this.hpText = this.add.text(120, 25, '100/100', {
            fontSize: '13px', fontFamily: 'Courier New', color: '#fff'
        }).setOrigin(0.5);
        
        this.shieldBar = this.add.rectangle(20, 42, 0, 6, 0x4488ff).setOrigin(0, 0.5);
        
        this.expBg = this.add.rectangle(20, 52, 200, 8, 0x111133).setOrigin(0, 0.5);
        this.expBar = this.add.rectangle(20, 52, 0, 8, COLORS.exp).setOrigin(0, 0.5);
        
        this.levelText = this.add.text(25, 40, 'Lv.1', {
            fontSize: '15px', fontFamily: 'Courier New',
            color: '#ffd700', fontWeight: 'bold'
        });
        
        this.goldText = this.add.text(GW - 20, 25, '💰 0', {
            fontSize: '18px', fontFamily: 'Courier New', color: '#ffd700'
        }).setOrigin(1, 0);
        
        this.timeText = this.add.text(GW / 2, 15, '00:00', {
            fontSize: '20px', fontFamily: 'Courier New', color: '#fff',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5);
        
        this.comboText = this.add.text(GW - 20, 55, '', {
            fontSize: '22px', fontFamily: 'Courier New',
            color: '#ff6600', fontWeight: 'bold',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(1, 0);
        
        this.skillBtn = this.add.circle(GW - 55, GH - 55, 35, 0x111133)
            .setStrokeStyle(3, 0x4444aa).setInteractive()
            .on('pointerdown', () => this.useSkill());
        this.skillIcon = this.add.text(GW - 55, GH - 55, '💥', { fontSize: '28px' }).setOrigin(0.5);
        this.skillCD = this.add.graphics();
        this.skillCD.setDepth(150);
        
        this.pauseBtn = this.add.text(GW - 15, GH - 15, '⏸', { fontSize: '22px' })
            .setOrigin(1, 1).setInteractive()
            .on('pointerdown', () => this.togglePause());
    }
    
    showMainMenu() {
        this.gameState = 'menu';
        this.menuElements = [];
        
        const bg = this.add.rectangle(0, 0, GW, GH, 0x000000, 0.85).setOrigin(0);
        const title = this.add.text(GW / 2, 100, '暗影猎手', {
            fontSize: '64px', fontFamily: 'Courier New',
            color: '#ff4466', stroke: '#000', strokeThickness: 6
        }).setOrigin(0.5);
        const subtitle = this.add.text(GW / 2, 155, 'SHADOW HUNTER', {
            fontSize: '22px', fontFamily: 'Courier New', color: '#888'
        }).setOrigin(0.5);
        
        const wpTitle = this.add.text(GW / 2, 210, '选择你的武器', {
            fontSize: '24px', fontFamily: 'Courier New', color: '#fff'
        }).setOrigin(0.5);
        
        const weapons = WeaponFactory.all();
        weapons.forEach((w, i) => {
            const info = WeaponFactory.info(w);
            const x = 110 + i * 155;
            const y = 340;
            
            const cardBg = this.add.rectangle(x, y, 135, 160, 0x111122)
                .setStrokeStyle(3, info.color).setInteractive();
            const icon = this.add.text(x, y - 40, info.icon, { fontSize: '44px' }).setOrigin(0.5);
            const name = this.add.text(x, y + 5, info.name, {
                fontSize: '16px', fontFamily: 'Courier New', color: '#fff'
            }).setOrigin(0.5);
            const desc = this.add.text(x, y + 35, info.desc, {
                fontSize: '11px', fontFamily: 'Courier New',
                color: '#aaa', align: 'center', wordWrap: { width: 120 }
            }).setOrigin(0.5);
            
            cardBg.on('pointerover', () => cardBg.setStrokeStyle(4, info.color));
            cardBg.on('pointerout', () => cardBg.setStrokeStyle(3, info.color));
            cardBg.on('pointerdown', () => this.startGame(w));
            
            this.menuElements.push(cardBg, icon, name, desc);
        });
        
        const tips = this.add.text(GW / 2, GH - 100,
            'WASD移动 | 鼠标瞄准自动攻击 | 空格释放技能', {
            fontSize: '15px', fontFamily: 'Courier New', color: '#888'
        }).setOrigin(0.5);
        
        const best = this.add.text(GW / 2, GH - 65,
            `最佳记录: ${this.formatTime(this.saveData.bestTime)} | 最高等级: ${this.saveData.bestLevel}`, {
            fontSize: '13px', fontFamily: 'Courier New', color: '#ffd700'
        }).setOrigin(0.5);
        
        this.menuElements.push(bg, title, subtitle, wpTitle, tips, best);
    }
    
    startGame(weaponType) {
        this.menuElements.forEach(e => e.destroy());
        this.menuElements = [];
        
        this.runtime = new RuntimeData();
        this.runtime.weaponType = weaponType;
        this.runtime.weapon = WeaponFactory.create(weaponType);
        this.runtime.skill = SkillFactory.create(weaponType);
        this.runtime.updateMaxHp();
        this.runtime.hp = this.runtime.maxHp;
        
        this.createWeaponVisual(weaponType);
        this.skillIcon.setText(this.runtime.skill.icon);
        
        this.playerWorldX = 0;
        this.playerWorldY = 0;
        
        this.enemyManager.clear();
        this.projectiles.forEach(p => p.destroy());
        this.projectiles = [];
        this.items.forEach(i => i.sprite?.destroy());
        this.items = [];
        this.minions.forEach(m => m.destroy());
        this.minions = [];
        
        if (this.saveData.unlockedMinions.includes('light')) {
            const m = new Minion(this, 'light');
            m.spawn(0, 0);
            this.minions.push(m);
        }
        
        this.gameState = 'playing';
        this.startTime = this.time.now;
        this.saveData.totalRuns++;
        SaveData.save(this.saveData);
        
        this.audio.play('levelup');
    }
    
    update(time, delta) {
        if (this.gameState !== 'playing' || this.paused) return;
        
        const gameTime = (time - this.startTime) / 1000;
        this.runtime.surviveTime = gameTime;
        
        this.movePlayer(delta);
        this.updateWeaponRotation();
        this.updateAttack(time);
        this.enemyManager.update(gameTime, delta);
        this.bossManager.update(time - this.startTime, delta);
        
        this.projectiles.forEach(p => p.update(delta, time));
        this.projectiles = this.projectiles.filter(p => p.alive);
        
        this.items.forEach(i => i.update(time));
        this.items = this.items.filter(i => i.alive);
        
        this.minions.forEach(m => m.update(time, delta));
        
        this.updateCombo(delta);
        this.updateRegen(delta);
        this.updateHUD();
        this.drawBackground();
        this.checkAchievements();
        this.updateSkillCD(time - this.startTime);
        
        if (this.runtime.hp <= 0) this.gameOver();
    }
    
    movePlayer(delta) {
        const dt = delta / 1000;
        const s = this.runtime.spec;
        let speed = 220 * (1 + s.speed * 0.12);
        
        let dx = 0, dy = 0;
        if (this.keys.W.isDown) dy -= 1;
        if (this.keys.S.isDown) dy += 1;
        if (this.keys.A.isDown) dx -= 1;
        if (this.keys.D.isDown) dx += 1;
        
        if (dx !== 0 || dy !== 0) {
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len; dy /= len;
            this.playerWorldX += dx * speed * dt;
            this.playerWorldY += dy * speed * dt;
            
            this.playerWorldX = Math.max(-WS / 2, Math.min(WS / 2, this.playerWorldX));
            this.playerWorldY = Math.max(-WS / 2, Math.min(WS / 2, this.playerWorldY));
            
            const bob = Math.sin(this.time.now * 0.015) * 2;
            this.player.y = GH / 2 + bob;
        } else {
            this.player.y = GH / 2;
        }
    }
    
    updateWeaponRotation() {
        if (!this.mousePos) return;
        const angle = Math.atan2(this.mousePos.y - GH / 2, this.mousePos.x - GW / 2);
        this.weaponContainer.x = Math.cos(angle) * 28;
        this.weaponContainer.y = Math.sin(angle) * 28;
        this.weaponContainer.rotation = angle;
        
        if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
            this.player.scaleX = -1;
        } else {
            this.player.scaleX = 1;
        }
    }
    
    updateAttack(time) {
        const w = this.runtime.weapon;
        if (!w) return;
        if (!w.canAttack(time)) return;
        
        const cd = w.getCooldown(this.runtime.spec);
        if (time - w.lastAttack < cd) return;
        w.attack(time);
        
        const p = this.mousePos;
        if (!p) return;
        
        const tx = this.playerWorldX + (p.x - GW / 2);
        const ty = this.playerWorldY + (p.y - GH / 2);
        const angle = Math.atan2(ty - this.playerWorldY, tx - this.playerWorldX);
        
        const baseDmg = w.getDamage(this.runtime.weaponLevel, this.runtime.spec);
        const isCrit = Math.random() < w.getCritChance(this.runtime.spec);
        const damage = isCrit ? Math.floor(baseDmg * w.getCritDamage(this.runtime.spec)) : baseDmg;
        
        const sndMap = { sword: 'sword', axe: 'axe', staff: 'staff', bow: 'bow', wand: 'wand' };
        this.audio.play(sndMap[this.runtime.weaponType] || 'sword');
        
        switch (w.type) {
            case 'melee_arc':
                this.performMeleeAttack(angle, damage, isCrit, w);
                break;
            case 'ranged_line':
                this.performLineAttack(angle, damage, isCrit, w);
                break;
            case 'ranged_projectile':
                this.performProjectileAttack(angle, damage, isCrit, w, tx, ty);
                break;
            case 'ranged_bounce':
                this.performWandAttack(angle, damage, isCrit, w);
                break;
        }
        
        this.weaponContainer.scale = 1.3;
        this.tweens.add({
            targets: this.weaponContainer,
            scale: 1,
            duration: 100,
            ease: 'Cubic.easeOut'
        });
    }
    
    performMeleeAttack(angle, damage, isCrit, w) {
        this.particles.slash(GW / 2, GH / 2, angle, w.color, w.range, w.arc);
        
        const hits = this.enemyManager.getEnemiesInArc(
            this.playerWorldX, this.playerWorldY, w.range, angle, w.arc
        );
        hits.forEach(e => {
            e.takeDamage(damage, isCrit);
            this.particles.hit(
                e.worldX - this.playerWorldX + GW / 2,
                e.worldY - this.playerWorldY + GH / 2,
                w.color, 6, 2
            );
        });
        
        if (this.bossManager.boss && this.bossManager.boss.alive) {
            const b = this.bossManager.boss;
            const d = Phaser.Math.Distance.Between(this.playerWorldX, this.playerWorldY, b.worldX, b.worldY);
            if (d <= w.range) {
                const ba = Math.atan2(b.worldY - this.playerWorldY, b.worldX - this.playerWorldX);
                let diff = ba - angle;
                while (diff > Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;
                if (Math.abs(diff) <= w.arc / 2) {
                    b.takeDamage(damage, isCrit);
                }
            }
        }
        
        if (isCrit) this.audio.play('crit');
    }
    
    performLineAttack(angle, damage, isCrit, w) {
        const endX = this.playerWorldX + Math.cos(angle) * w.range;
        const endY = this.playerWorldY + Math.sin(angle) * w.range;
        const sx = GW / 2 + Math.cos(angle) * w.range * 0.5;
        const sy = GH / 2 + Math.sin(angle) * w.range * 0.5;
        
        this.particles.lineBeam(GW / 2, GH / 2, sx + Math.cos(angle) * w.range * 0.5, sy + Math.sin(angle) * w.range * 0.5, w.color, w.width);
        
        const hits = this.enemyManager.getEnemiesOnLine(
            this.playerWorldX, this.playerWorldY, endX, endY, w.width
        );
        hits.forEach(e => {
            e.takeDamage(damage, isCrit);
            e.applySlow(2000);
        });
        
        if (this.bossManager.boss && this.bossManager.boss.alive) {
            const b = this.bossManager.boss;
            if (this.enemyManager.pointToLineDistance(
                b.worldX, b.worldY,
                this.playerWorldX, this.playerWorldY, endX, endY
            ) <= w.width + b.hitRadius) {
                b.takeDamage(damage, isCrit);
            }
        }
        
        if (isCrit) this.audio.play('crit');
    }
    
    performProjectileAttack(angle, damage, isCrit, w, tx, ty) {
        this.projectiles.push(new Projectile(
            this, this.playerWorldX, this.playerWorldY, tx, ty,
            damage, 'arrow',
            { speed: 600, color: w.color, pierce: 1, size: 5 }
        ));
    }
    
    performWandAttack(angle, damage, isCrit, w) {
        for (let i = 0; i < 3; i++) {
            const offset = (i - 1) * 0.25;
            this.projectiles.push(new Projectile(
                this, this.playerWorldX, this.playerWorldY,
                this.playerWorldX + Math.cos(angle + offset) * w.range,
                this.playerWorldY + Math.sin(angle + offset) * w.range,
                damage, 'magic',
                { speed: 450, color: w.color, bounce: 2, tracking: true, size: 7 }
            ));
        }
    }
    
    useSkill() {
        if (this.gameState !== 'playing' || this.paused) return;
        const s = this.runtime.skill;
        if (!s || !s.canUse(this.time.now - this.startTime)) return;
        
        s.use(this.time.now - this.startTime);
        this.audio.play('skill');
        this.cameras.main.shake(200, 0.01);
        
        const w = this.runtime.weapon;
        const baseDmg = w.getDamage(this.runtime.weaponLevel, this.runtime.spec);
        const angle = Math.atan2(
            (this.mousePos?.y || GH / 2) - GH / 2,
            (this.mousePos?.x || GW / 2) - GW / 2
        );
        
        switch (this.runtime.weaponType) {
            case 'sword':
                const dashDist = 200;
                const targetX = this.playerWorldX + Math.cos(angle) * dashDist;
                const targetY = this.playerWorldY + Math.sin(angle) * dashDist;
                
                const dashTween = this.tweens.addCounter({
                    from: 0, to: 1, duration: 200, ease: 'Cubic.easeOut',
                    onUpdate: t => {
                        this.playerWorldX = Phaser.Math.Linear(this.playerWorldX, targetX, t.getValue() * 0.3);
                        this.playerWorldY = Phaser.Math.Linear(this.playerWorldY, targetY, t.getValue() * 0.3);
                    }
                });
                
                const nearby = this.enemyManager.getEnemiesInRadius(this.playerWorldX, this.playerWorldY, 120);
                nearby.forEach(e => e.takeDamage(baseDmg * 2.5, true));
                
                if (this.bossManager.boss?.alive) {
                    const d = Phaser.Math.Distance.Between(this.playerWorldX, this.playerWorldY, this.bossManager.boss.worldX, this.bossManager.boss.worldY);
                    if (d < 120) this.bossManager.boss.takeDamage(baseDmg * 2.5, true);
                }
                
                this.particles.explosion(GW / 2, GH / 2, 120, w.color);
                break;
                
            case 'axe':
                const all = this.enemyManager.getEnemiesInRadius(this.playerWorldX, this.playerWorldY, 180);
                all.forEach(e => e.takeDamage(baseDmg * 3, Math.random() < 0.5));
                
                if (this.bossManager.boss?.alive) {
                    const d = Phaser.Math.Distance.Between(this.playerWorldX, this.playerWorldY, this.bossManager.boss.worldX, this.bossManager.boss.worldY);
                    if (d < 180) this.bossManager.boss.takeDamage(baseDmg * 3, Math.random() < 0.5);
                }
                
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        this.particles.explosion(GW / 2, GH / 2, 120 + i * 30, w.color);
                    }, i * 80);
                }
                break;
                
            case 'staff':
                const frozen = this.enemyManager.getEnemiesInRadius(this.playerWorldX, this.playerWorldY, 200);
                frozen.forEach(e => {
                    e.takeDamage(baseDmg * 1.5, false);
                    e.applySlow(4000);
                    e.applyStun(1500);
                });
                
                if (this.bossManager.boss?.alive) {
                    const d = Phaser.Math.Distance.Between(this.playerWorldX, this.playerWorldY, this.bossManager.boss.worldX, this.bossManager.boss.worldY);
                    if (d < 200) {
                        this.bossManager.boss.takeDamage(baseDmg * 1.5, false);
                    }
                }
                
                this.particles.explosion(GW / 2, GH / 2, 200, w.color);
                break;
                
            case 'bow':
                for (let i = 0; i < 12; i++) {
                    const a = -Math.PI / 3 + (i / 11) * Math.PI * 2 / 3;
                    const finalAngle = angle + a;
                    setTimeout(() => {
                        this.projectiles.push(new Projectile(
                            this, this.playerWorldX, this.playerWorldY,
                            this.playerWorldX + Math.cos(finalAngle) * 500,
                            this.playerWorldY + Math.sin(finalAngle) * 500,
                            baseDmg * 1.5, 'arrow',
                            { speed: 700, color: w.color, pierce: 2, size: 6 }
                        ));
                    }, i * 30);
                }
                break;
                
            case 'wand':
                for (let i = 0; i < 8; i++) {
                    setTimeout(() => {
                        const a = Math.random() * Math.PI * 2;
                        this.projectiles.push(new Projectile(
                            this, this.playerWorldX, this.playerWorldY,
                            this.playerWorldX + Math.cos(a) * 300,
                            this.playerWorldY + Math.sin(a) * 300,
                            baseDmg * 2, 'magic',
                            { speed: 500, color: w.color, bounce: 3, tracking: true, size: 9 }
                        ));
                    }, i * 60);
                }
                break;
        }
    }
    
    updateSkillCD(time) {
        this.skillCD.clear();
        const s = this.runtime.skill;
        if (!s) return;
        
        const progress = s.getProgress(time);
        if (progress < 1) {
            this.skillCD.lineStyle(3, 0x000000, 0.6);
            this.skillCD.beginPath();
            this.skillCD.arc(GW - 55, GH - 55, 38, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - progress), false);
            this.skillCD.strokePath();
            this.skillIcon.setAlpha(0.4);
        } else {
            this.skillIcon.setAlpha(1);
        }
    }
    
    playerTakeDamage(amount) {
        if (this.runtime.invincibleTimer > 0) return;
        
        const actual = this.runtime.takeDamage(amount);
        this.runtime.invincibleTimer = 600;
        this.runtime.combo = 0;
        
        this.audio.play('hurt');
        this.cameras.main.shake(150, 0.008);
        this.showDamageNumber(GW / 2, GH / 2 - 30, actual, false, true);
        
        this.tweens.add({
            targets: this.player,
            alpha: { from: 1, to: 0.3, to: 1 },
            duration: 100,
            repeat: 3
        });
    }
    
    updateCombo(delta) {
        if (this.runtime.comboTimer > 0) {
            this.runtime.comboTimer -= delta;
            if (this.runtime.comboTimer <= 0) {
                this.runtime.combo = 0;
            }
        }
        
        if (this.runtime.combo >= 3) {
            this.comboText.setText(`${this.runtime.combo} 连击!`);
            this.comboText.setVisible(true);
        } else {
            this.comboText.setVisible(false);
        }
    }
    
    updateRegen(delta) {
        if (this.runtime.invincibleTimer > 0) {
            this.runtime.invincibleTimer -= delta;
        }
        
        const s = this.runtime.spec;
        if (s.regen > 0) {
            this.runtime.regenTimer += delta;
            if (this.runtime.regenTimer >= 1000) {
                this.runtime.regenTimer = 0;
                this.runtime.heal(s.regen * 2);
            }
        }
    }
    
    showDamageNumber(x, y, damage, isCrit = false, isPlayer = false) {
        const text = this.add.text(x, y, isCrit ? `${damage}!` : `${damage}`, {
            fontSize: isCrit ? '24px' : '16px',
            fontFamily: 'Courier New',
            color: isPlayer ? '#ff4444' : (isCrit ? '#ffff00' : '#ff8866'),
            stroke: '#000',
            strokeThickness: 2,
            fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(250);
        
        this.tweens.add({
            targets: text,
            y: y - 40,
            alpha: 0,
            duration: 600,
            ease: 'Cubic.easeOut',
            onComplete: () => text.destroy()
        });
    }
    
    onLevelUp() {
        this.particles.levelUp();
        this.audio.play('levelup');
        this.runtime.weaponLevel = Math.min(this.runtime.level, 10);
        this.runtime.updateMaxHp();
        this.showLevelUpChoice();
    }
    
    showLevelUpChoice() {
        this.paused = true;
        
        const choices = this.getRandomSpecializations(3);
        
        const bg = this.add.rectangle(0, 0, GW, GH, 0x000000, 0.75).setOrigin(0).setDepth(400);
        const title = this.add.text(GW / 2, 120, `升级！ Lv.${this.runtime.level}`, {
            fontSize: '42px', fontFamily: 'Courier New',
            color: '#ffd700', stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5).setDepth(401);
        
        const sub = this.add.text(GW / 2, 170, '选择一项专精提升', {
            fontSize: '20px', fontFamily: 'Courier New', color: '#fff'
        }).setOrigin(0.5).setDepth(401);
        
        choices.forEach((spec, i) => {
            const x = GW / 2 + (i - 1) * 180;
            const y = 320;
            const level = this.runtime.specLevels[spec.id] || 0;
            
            const cardBg = this.add.rectangle(x, y, 150, 180, 0x111122)
                .setStrokeStyle(3, spec.color).setInteractive().setDepth(401);
            const icon = this.add.text(x, y - 50, spec.icon, { fontSize: '40px' }).setOrigin(0.5).setDepth(402);
            const name = this.add.text(x, y + 5, spec.name, {
                fontSize: '18px', fontFamily: 'Courier New', color: '#fff'
            }).setOrigin(0.5).setDepth(402);
            const desc = this.add.text(x, y + 35, spec.desc, {
                fontSize: '12px', fontFamily: 'Courier New',
                color: '#aaa', align: 'center', wordWrap: { width: 130 }
            }).setOrigin(0.5).setDepth(402);
            const lvl = this.add.text(x, y + 70, `Lv.${level}`, {
                fontSize: '13px', fontFamily: 'Courier New', color: '#ffd700'
            }).setOrigin(0.5).setDepth(402);
            
            cardBg.on('pointerover', () => cardBg.setStrokeStyle(4, spec.color));
            cardBg.on('pointerout', () => cardBg.setStrokeStyle(3, spec.color));
            cardBg.on('pointerdown', () => {
                this.runtime.specLevels[spec.id]++;
                this.runtime.updateMaxHp();
                [bg, title, sub, cardBg, icon, name, desc, lvl].forEach(e => e.destroy());
                this.paused = false;
            });
        });
    }
    
    getRandomSpecializations(count) {
        const available = [...Specializations];
        const result = [];
        for (let i = 0; i < count && available.length > 0; i++) {
            const idx = Math.floor(Math.random() * available.length);
            result.push(available.splice(idx, 1)[0]);
        }
        return result;
    }
    
    showBossReward() {
        this.paused = true;
        this.bossManager.onBossDefeated(this.time.now - this.startTime);
        
        const bg = this.add.rectangle(0, 0, GW, GH, 0x000000, 0.8).setOrigin(0).setDepth(400);
        const title = this.add.text(GW / 2, 100, '🏆 BOSS 击败！ 🏆', {
            fontSize: '40px', fontFamily: 'Courier New',
            color: '#ffd700', stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5).setDepth(401);
        
        const rewards = [
            { type: 'weaponUp', name: '武器强化', desc: '武器等级 +1', icon: '⚔', color: 0xff4466 },
            { type: 'heal', name: '生命恢复', desc: '恢复 50% 最大生命', icon: '❤', color: 0xff4466 },
            { type: 'gold', name: '宝藏', desc: '获得 100 金币', icon: '💰', color: 0xffd700 },
            { type: 'spec', name: '神秘卷轴', desc: '随机获得 2 项专精', icon: '📜', color: 0xaa88ff }
        ];
        
        const selected = [];
        const temp = [...rewards];
        for (let i = 0; i < 3 && temp.length > 0; i++) {
            selected.push(temp.splice(Math.floor(Math.random() * temp.length), 1)[0]);
        }
        
        selected.forEach((r, i) => {
            const x = GW / 2 + (i - 1) * 180;
            const y = 300;
            
            const cardBg = this.add.rectangle(x, y, 150, 200, 0x1a1a2e)
                .setStrokeStyle(3, r.color).setInteractive().setDepth(401);
            const icon = this.add.text(x, y - 55, r.icon, { fontSize: '48px' }).setOrigin(0.5).setDepth(402);
            const name = this.add.text(x, y + 10, r.name, {
                fontSize: '20px', fontFamily: 'Courier New', color: '#fff'
            }).setOrigin(0.5).setDepth(402);
            const desc = this.add.text(x, y + 45, r.desc, {
                fontSize: '13px', fontFamily: 'Courier New',
                color: '#aaa', align: 'center', wordWrap: { width: 130 }
            }).setOrigin(0.5).setDepth(402);
            
            cardBg.on('pointerover', () => cardBg.setStrokeStyle(4, r.color));
            cardBg.on('pointerout', () => cardBg.setStrokeStyle(3, r.color));
            cardBg.on('pointerdown', () => {
                this.claimBossReward(r.type);
                [bg, title, cardBg, icon, name, desc].forEach(e => e.destroy());
                this.paused = false;
            });
        });
    }
    
    claimBossReward(type) {
        switch (type) {
            case 'weaponUp':
                this.runtime.weaponLevel = Math.min(10, this.runtime.weaponLevel + 1);
                break;
            case 'heal':
                this.runtime.heal(Math.floor(this.runtime.maxHp * 0.5));
                this.particles.healEffect(GW / 2, GH / 2);
                break;
            case 'gold':
                this.runtime.addGold(100);
                this.particles.goldEffect(GW / 2, GH / 2, 10);
                break;
            case 'spec':
                const specs = this.getRandomSpecializations(2);
                specs.forEach(s => this.runtime.specLevels[s.id]++);
                this.runtime.updateMaxHp();
                break;
        }
        this.audio.play('levelup');
    }
    
    updateHUD() {
        const r = this.runtime;
        
        const hpRatio = Math.max(0, r.hp / r.maxHp);
        this.hpBar.scaleX = hpRatio;
        this.hpBar.x = 20;
        this.hpText.setText(`${Math.ceil(r.hp)}/${r.maxHp}`);
        
        if (r.shield > 0) {
            this.shieldBar.setVisible(true);
            this.shieldBar.scaleX = Math.min(1, r.shield / 50);
        } else {
            this.shieldBar.setVisible(false);
        }
        
        const expRatio = Math.max(0, r.exp / r.expToNext);
        this.expBar.scaleX = expRatio;
        this.levelText.setText(`Lv.${r.level}`);
        
        this.goldText.setText(`💰 ${r.gold}`);
        this.timeText.setText(this.formatTime(r.surviveTime));
    }
    
    formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    
    checkAchievements() {
        const r = this.runtime;
        const sd = this.saveData;
        
        const checks = [
            { id: 'first_blood', cond: r.killCount >= 1 },
            { id: 'killer_10', cond: r.killCount >= 10 },
            { id: 'killer_50', cond: r.killCount >= 50 },
            { id: 'survive_60', cond: r.surviveTime >= 60 },
            { id: 'survive_180', cond: r.surviveTime >= 180 },
            { id: 'boss_1', cond: r.bossKills >= 1 },
            { id: 'level_5', cond: r.level >= 5 },
            { id: 'level_10', cond: r.level >= 10 },
            { id: 'combo_10', cond: r.maxCombo >= 10 },
            { id: 'gold_100', cond: r.gold >= 100 },
            { id: 'gold_500', cond: r.gold >= 500 }
        ];
        
        checks.forEach(c => {
            if (c.cond && !sd.achievements.includes(c.id)) {
                sd.achievements.push(c.id);
                this.showAchievementUnlock(c.id);
            }
        });
    }
    
    showAchievementUnlock(id) {
        const ach = Achievements.find(a => a.id === id);
        if (!ach) return;
        
        const x = GW / 2, y = 100;
        const bg = this.add.rectangle(x, y, 300, 50, 0x111122, 0.95)
            .setStrokeStyle(2, 0xffd700).setDepth(500);
        const icon = this.add.text(x - 120, y, ach.icon, { fontSize: '24px' }).setOrigin(0, 0.5).setDepth(501);
        const title = this.add.text(x - 80, y - 8, '成就解锁！', {
            fontSize: '12px', fontFamily: 'Courier New', color: '#ffd700'
        }).setOrigin(0, 0.5).setDepth(501);
        const name = this.add.text(x - 80, y + 10, ach.name, {
            fontSize: '15px', fontFamily: 'Courier New', color: '#fff'
        }).setOrigin(0, 0.5).setDepth(501);
        
        bg.y = y - 60;
        icon.y = y - 60;
        title.y = y - 68;
        name.y = y - 50;
        
        this.tweens.add({
            targets: [bg, icon, title, name],
            y: `+=60`,
            duration: 500,
            ease: 'Back.easeOut',
            hold: 2000,
            yoyo: true,
            onComplete: () => {
                bg.destroy(); icon.destroy(); title.destroy(); name.destroy();
            }
        });
        
        SaveData.save(this.saveData);
    }
    
    togglePause() {
        if (this.gameState !== 'playing') return;
        this.paused = !this.paused;
        
        if (this.paused) {
            this.pauseElements = [];
            const bg = this.add.rectangle(0, 0, GW, GH, 0x000000, 0.7).setOrigin(0).setDepth(450);
            const title = this.add.text(GW / 2, GH / 2 - 40, '暂停', {
                fontSize: '48px', fontFamily: 'Courier New', color: '#fff'
            }).setOrigin(0.5).setDepth(451);
            const resume = this.add.text(GW / 2, GH / 2 + 30, '继续游戏', {
                fontSize: '22px', fontFamily: 'Courier New', color: '#66ff66'
            }).setOrigin(0.5).setInteractive().setDepth(451);
            
            resume.on('pointerdown', () => {
                this.pauseElements.forEach(e => e.destroy());
                this.pauseElements = [];
                this.paused = false;
            });
            
            this.pauseElements = [bg, title, resume];
        }
    }
    
    gameOver() {
        if (this.gameState === 'gameover') return;
        this.gameState = 'gameover';
        this.audio.play('die');
        
        const r = this.runtime;
        const sd = this.saveData;
        sd.totalKills += r.killCount;
        sd.totalGold += r.gold;
        if (r.surviveTime > sd.bestTime) sd.bestTime = r.surviveTime;
        if (r.level > sd.bestLevel) sd.bestLevel = r.level;
        SaveData.save(sd);
        
        const bg = this.add.rectangle(0, 0, GW, GH, 0x000000, 0.85).setOrigin(0).setDepth(500);
        const title = this.add.text(GW / 2, 100, '游戏结束', {
            fontSize: '52px', fontFamily: 'Courier New',
            color: '#ff4466', stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5).setDepth(501);
        
        const stats = [
            `存活时间: ${this.formatTime(r.surviveTime)}`,
            `达到等级: ${r.level}`,
            `击杀敌人: ${r.killCount}`,
            `击败Boss: ${r.bossKills}`,
            `获得金币: ${r.gold}`,
            `最高连击: ${r.maxCombo}`,
            `武器等级: ${r.weaponLevel}`
        ];
        
        stats.forEach((s, i) => {
            this.add.text(GW / 2, 170 + i * 30, s, {
                fontSize: '17px', fontFamily: 'Courier New', color: '#fff'
            }).setOrigin(0.5).setDepth(501);
        });
        
        const best = this.add.text(GW / 2, 170 + stats.length * 30 + 20,
            `最佳时间: ${this.formatTime(sd.bestTime)}`, {
            fontSize: '15px', fontFamily: 'Courier New', color: '#ffd700'
        }).setOrigin(0.5).setDepth(501);
        
        const restart = this.add.text(GW / 2, GH - 130, '重新开始', {
            fontSize: '26px', fontFamily: 'Courier New', color: '#44ff88'
        }).setOrigin(0.5).setInteractive().setDepth(501);
        
        const menu = this.add.text(GW / 2, GH - 90, '返回主菜单', {
            fontSize: '18px', fontFamily: 'Courier New', color: '#aaa'
        }).setOrigin(0.5).setInteractive().setDepth(501);
        
        restart.on('pointerover', () => restart.setColor('#66ffaa'));
        restart.on('pointerout', () => restart.setColor('#44ff88'));
        restart.on('pointerdown', () => {
            [bg, title, best, restart, menu].forEach(e => e.destroy());
            this.startGame(r.weaponType);
        });
        
        menu.on('pointerover', () => menu.setColor('#fff'));
        menu.on('pointerout', () => menu.setColor('#aaa'));
        menu.on('pointerdown', () => {
            [bg, title, best, restart, menu].forEach(e => e.destroy());
            this.showMainMenu();
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: GW,
    height: GH,
    parent: 'game-container',
    pixelArt: true,
    backgroundColor: '#0a0a18',
    scene: [GameScene]
};

new Phaser.Game(config);


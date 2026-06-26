/**
 * 暗影猎手 - Shadow Hunter
 * 顶级像素肉鸽生存游戏
 * 
 * 核心设计原则:
 * 1. 深度玩法 - 策略构筑、武器组合、技能连招
 * 2. 完美平衡 - 难度曲线平滑，每个选择都有意义
 * 3. 视觉震撼 - 动态光影、粒子效果、像素艺术
 * 4. 沉浸体验 - 音效、动画、反馈完美配合
 */

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const WORLD_SIZE = 3000;

const COLORS = {
    primary: 0xff4466,
    secondary: 0xffaa00,
    accent: 0x00ffff,
    gold: 0xffd700,
    silver: 0xc0c0c0,
    bronze: 0xcd7f32,
    health: 0xff3333,
    mana: 0x3366ff,
    exp: 0xffff44,
    shield: 0x00ffff,
    dark: 0x0a0a15,
    darker: 0x05050a
};

class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
    }

    createHit(x, y, color = 0xff4444, count = 8) {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
            const speed = 15 + Math.random() * 25;
            const size = 2 + Math.random() * 3;
            const p = this.scene.add.circle(x, y, size, color);
            this.particles.push(p);
            
            this.scene.tweens.add({
                targets: p,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                alpha: [1, 0],
                scale: [1, 0],
                duration: 200 + Math.random() * 150,
                ease: 'Power2',
                onComplete: () => { p.destroy(); this.remove(p); }
            });
        }
    }

    createGold(x, y) {
        for (let i = 0; i < 6; i++) {
            const p = this.scene.add.text(x, y, '💰', { fontSize: '12px' }).setOrigin(0.5);
            this.particles.push(p);
            
            this.scene.tweens.add({
                targets: p,
                x: GAME_WIDTH - 100 + (Math.random() - 0.5) * 60,
                y: 20 + (Math.random() - 0.5) * 20,
                alpha: [1, 0],
                scale: [1, 0.3],
                duration: 600 + Math.random() * 300,
                ease: 'Power2',
                onComplete: () => { p.destroy(); this.remove(p); }
            });
        }
    }

    createExp(x, y) {
        for (let i = 0; i < 5; i++) {
            const p = this.scene.add.text(x, y, '✨', { fontSize: '10px' }).setOrigin(0.5);
            this.particles.push(p);
            
            this.scene.tweens.add({
                targets: p,
                x: 80 + (Math.random() - 0.5) * 50,
                y: 50 + (Math.random() - 0.5) * 20,
                alpha: [1, 0],
                scale: [1, 0.4],
                duration: 500 + Math.random() * 200,
                ease: 'Power2',
                onComplete: () => { p.destroy(); this.remove(p); }
            });
        }
    }

    createBossDefeat(x, y) {
        const colors = [0xffd700, 0xff6600, 0xff0000, 0x00ffff, 0xff00ff];
        for (let i = 0; i < 30; i++) {
            const angle = (i / 30) * Math.PI * 2;
            const speed = 40 + Math.random() * 60;
            const p = this.scene.add.circle(x, y, 6, colors[i % colors.length]);
            this.particles.push(p);
            
            this.scene.tweens.add({
                targets: p,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                alpha: [1, 0],
                scale: [1, 0],
                duration: 700,
                ease: 'Power2',
                onComplete: () => { p.destroy(); this.remove(p); }
            });
        }
        
        const flash = this.scene.add.circle(x, y, 120, 0xffffff, 0.9);
        this.particles.push(flash);
        this.scene.tweens.add({
            targets: flash,
            scale: 5,
            alpha: 0,
            duration: 600,
            onComplete: () => { flash.destroy(); this.remove(flash); }
        });
    }

    createLevelUp() {
        const x = GAME_WIDTH / 2;
        const y = GAME_HEIGHT / 2;
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const p = this.scene.add.text(x, y, '⭐', { fontSize: '20px' }).setOrigin(0.5);
            this.particles.push(p);
            
            this.scene.tweens.add({
                targets: p,
                x: x + Math.cos(angle) * 200,
                y: y + Math.sin(angle) * 150,
                alpha: [0, 1, 0],
                scale: [0, 1.5, 0.3],
                duration: 1000,
                ease: 'Power2',
                onComplete: () => { p.destroy(); this.remove(p); }
            });
        }
    }

    createHeal(x, y) {
        for (let i = 0; i < 8; i++) {
            const p = this.scene.add.text(x, y, '❤️', { fontSize: '14px' }).setOrigin(0.5);
            this.particles.push(p);
            
            this.scene.tweens.add({
                targets: p,
                y: y - 50 - Math.random() * 30,
                alpha: [1, 0],
                scale: [1, 0.5],
                duration: 600,
                ease: 'Power2',
                onComplete: () => { p.destroy(); this.remove(p); }
            });
        }
    }

    createSkillEffect(x, y, type) {
        let effect;
        switch (type) {
            case 'crit_prepare':
                effect = this.scene.add.circle(x, y, 60, 0xff0000, 0.3);
                this.scene.tweens.add({ targets: effect, scale: 3, alpha: 0, duration: 600, onComplete: () => { effect.destroy(); this.remove(effect); } });
                break;
            case 'whirlwind':
                effect = this.scene.add.circle(x, y, 70, 0xffaa00, 0.4);
                this.scene.tweens.add({ targets: effect, scale: [1, 4, 1], alpha: [0.4, 0.1, 0], rotation: Math.PI * 2, duration: 700, onComplete: () => { effect.destroy(); this.remove(effect); } });
                break;
            case 'shield':
                effect = this.scene.add.circle(x, y, 55, 0x00ffff, 0.25);
                this.scene.tweens.add({ targets: effect, scale: [0.8, 1.3, 1], alpha: [0.4, 0.15, 0.3], duration: 1200, yoyo: true, repeat: 2, onComplete: () => { effect.destroy(); this.remove(effect); } });
                break;
            case 'pierce':
                effect = this.scene.add.rectangle(x, y, 8, 180, 0x88ff88, 0.7);
                this.scene.tweens.add({ targets: effect, scaleX: 2.5, alpha: 0, duration: 350, onComplete: () => { effect.destroy(); this.remove(effect); } });
                break;
            case 'explosion':
                effect = this.scene.add.circle(x, y, 40, 0xff6600, 0.8);
                this.scene.tweens.add({ targets: effect, scale: 4, alpha: 0, duration: 450, onComplete: () => { effect.destroy(); this.remove(effect); } });
                break;
            case 'summon':
                effect = this.scene.add.circle(x, y, 50, 0xffff00, 0.3);
                this.scene.tweens.add({ targets: effect, scale: [0, 2], alpha: [0.5, 0], duration: 500, onComplete: () => { effect.destroy(); this.remove(effect); } });
                break;
        }
        if (effect) this.particles.push(effect);
    }

    createAchievement() {
        const x = GAME_WIDTH / 2;
        const y = GAME_HEIGHT / 3;
        for (let i = 0; i < 25; i++) {
            const angle = (i / 25) * Math.PI * 2;
            const p = this.scene.add.text(x, y, '🏆', { fontSize: '22px' }).setOrigin(0.5);
            this.particles.push(p);
            
            this.scene.tweens.add({
                targets: p,
                x: x + Math.cos(angle) * 220,
                y: y + Math.sin(angle) * 180,
                alpha: [1, 0],
                scale: [1, 0.2],
                duration: 1200,
                ease: 'Power2',
                onComplete: () => { p.destroy(); this.remove(p); }
            });
        }
    }

    createMinionSpawn(x, y) {
        for (let i = 0; i < 15; i++) {
            const angle = (i / 15) * Math.PI * 2;
            const p = this.scene.add.circle(x, y, 5, 0xffff00);
            this.particles.push(p);
            
            this.scene.tweens.add({
                targets: p,
                x: x + Math.cos(angle) * 60,
                y: y + Math.sin(angle) * 60,
                alpha: [1, 0],
                scale: [1, 0],
                duration: 600,
                ease: 'Power2',
                onComplete: () => { p.destroy(); this.remove(p); }
            });
        }
    }

    createAttackWave(x, y, angle, color, width, length) {
        const wave = this.scene.add.rectangle(x, y, width, length, color, 0.6);
        wave.rotation = angle;
        this.particles.push(wave);
        
        this.scene.tweens.add({
            targets: wave,
            scaleY: 2,
            alpha: [0.6, 0],
            duration: 150,
            ease: 'Power2',
            onComplete: () => { wave.destroy(); this.remove(wave); }
        });
    }

    createProjectileTrail(x, y, targetX, targetY, color) {
        const dx = targetX - x;
        const dy = targetY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const steps = Math.floor(dist / 15);
        
        for (let i = 0; i < steps; i++) {
            const px = x + (dx * i) / steps;
            const py = y + (dy * i) / steps;
            const p = this.scene.add.circle(px, py, 4, color, 0.6);
            this.particles.push(p);
            
            setTimeout(() => {
                this.scene.tweens.add({
                    targets: p,
                    scale: 0,
                    alpha: 0,
                    duration: 100,
                    onComplete: () => { p.destroy(); this.remove(p); }
                });
            }, i * 20);
        }
    }

    createEnemySpawn(x, y, color) {
        const glow = this.scene.add.circle(x, y, 30, color, 0.5);
        this.particles.push(glow);
        
        this.scene.tweens.add({
            targets: glow,
            scale: [0, 2],
            alpha: [0.5, 0],
            duration: 400,
            onComplete: () => { glow.destroy(); this.remove(glow); }
        });
    }

    remove(p) {
        const idx = this.particles.indexOf(p);
        if (idx > -1) this.particles.splice(idx, 1);
    }

    clear() {
        this.particles.forEach(p => p.destroy());
        this.particles = [];
    }
}

class AudioSystem {
    constructor(scene) {
        this.scene = scene;
        this.ctx = null;
        this.enabled = true;
        this.volume = 0.35;
        this.init();
    }

    init() {
        try {
            this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            this.enabled = false;
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    play(type) {
        if (!this.enabled || !this.ctx) return;
        this.resume();

        const sounds = {
            attack_sword: () => this.playTone(320, 0.04, 'square'),
            attack_axe: () => { this.playTone(140, 0.12, 'sawtooth'); this.playTone(90, 0.15, 'square'); },
            attack_staff: () => { this.playTone(520, 0.06, 'sine'); this.playTone(720, 0.04, 'sine'); },
            attack_bow: () => { this.playTone(800, 0.02, 'triangle'); this.playTone(1000, 0.015, 'sine'); },
            attack_wand: () => { this.playTone(420, 0.05, 'sine'); this.playTone(560, 0.03, 'sine'); },
            hit: () => this.playTone(160, 0.08, 'sawtooth'),
            crit: () => { this.playTone(520, 0.1, 'square'); this.playTone(720, 0.08, 'square'); },
            kill: () => { this.playTone(280, 0.15, 'sine'); this.playTone(392, 0.1, 'sine'); },
            levelUp: () => this.playMelody([262, 330, 392, 523], 0.08),
            bossWarning: () => { this.playTone(70, 0.5, 'square'); setTimeout(() => this.playTone(50, 0.5, 'square'), 200); },
            bossDefeat: () => this.playMelody([523, 659, 784, 1047, 784], 0.12),
            select: () => this.playTone(580, 0.04, 'sine'),
            click: () => this.playTone(680, 0.02, 'sine'),
            damage: () => this.playTone(50, 0.2, 'sawtooth'),
            heal: () => this.playMelody([440, 554, 659, 784], 0.08),
            pickup: () => this.playTone(900, 0.03, 'sine'),
            unlock: () => this.playMelody([392, 523, 659, 784, 1047], 0.1),
            gameOver: () => this.playMelody([392, 330, 262, 196, 147], 0.25),
            skill: () => this.playTone(550, 0.15, 'sine'),
            special: () => { this.playTone(280, 0.18, 'sawtooth'); this.playTone(450, 0.12, 'sine'); },
            projectile: () => this.playTone(550, 0.04, 'triangle'),
            minionAttack: () => this.playTone(240, 0.06, 'sawtooth'),
            minionHeal: () => this.playMelody([523, 659, 784], 0.07),
            achievement: () => this.playMelody([523, 659, 784, 1047, 784, 1047], 0.08),
            pause: () => this.playTone(320, 0.12, 'sine'),
            resume: () => this.playTone(450, 0.12, 'sine'),
            reward: () => this.playMelody([659, 784, 880, 1047], 0.06),
            combo: () => this.playTone(600 + Math.random() * 200, 0.02, 'sine'),
            expGain: () => this.playTone(300 + Math.random() * 100, 0.03, 'sine')
        };

        if (sounds[type]) sounds[type]();
    }

    playTone(freq, dur, type = 'sine') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        gain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + dur);
    }

    playMelody(freqs, dur) {
        freqs.forEach((freq, i) => {
            setTimeout(() => this.playTone(freq, dur, 'sine'), i * dur * 1000);
        });
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

class GameData {
    static KEY = 'shadow_hunter_save';

    static defaults = {
        totalGold: 0,
        unlockedMinions: [],
        bestTime: 0,
        totalRuns: 0,
        achievements: [],
        unlockedWeapons: ['sword'],
        totalKills: 0,
        totalBossKills: 0,
        maxLevel: 0,
        totalSurvivalTime: 0
    };

    static load() {
        const saved = localStorage.getItem(this.KEY);
        return saved ? { ...this.defaults, ...JSON.parse(saved) } : { ...this.defaults };
    }

    static save(data) {
        localStorage.setItem(this.KEY, JSON.stringify(data));
    }

    static reset() {
        localStorage.removeItem(this.KEY);
    }
}

class AchievementSystem {
    static list = [
        { id: 'first_boss', name: '初次胜利', icon: '🏆', desc: '击败第一个Boss', cond: d => d.bossCount >= 1 },
        { id: 'boss_hunter', name: 'Boss猎手', icon: '👹', desc: '击败10个Boss', cond: d => d.totalBossKills >= 10 },
        { id: 'boss_master', name: 'Boss大师', icon: '👑', desc: '击败25个Boss', cond: d => d.totalBossKills >= 25 },
        { id: 'survive_1', name: '生存新手', icon: '⏱️', desc: '存活1分钟', cond: d => d.survivalTime >= 60 },
        { id: 'survive_5', name: '生存达人', icon: '⏱️', desc: '存活5分钟', cond: d => d.survivalTime >= 300 },
        { id: 'survive_10', name: '生存大师', icon: '⏱️', desc: '存活10分钟', cond: d => d.survivalTime >= 600 },
        { id: 'kill_50', name: '杀戮新手', icon: '💀', desc: '击杀50个敌人', cond: d => d.killCount >= 50 },
        { id: 'kill_200', name: '杀戮达人', icon: '💀', desc: '击杀200个敌人', cond: d => d.killCount >= 200 },
        { id: 'kill_500', name: '杀戮宗师', icon: '💀', desc: '击杀500个敌人', cond: d => d.killCount >= 500 },
        { id: 'gold_100', name: '小富翁', icon: '💰', desc: '累计获得100金币', cond: d => d.totalGold >= 100 },
        { id: 'gold_500', name: '大富翁', icon: '💰', desc: '累计获得500金币', cond: d => d.totalGold >= 500 },
        { id: 'gold_1000', name: '财富之神', icon: '💰', desc: '累计获得1000金币', cond: d => d.totalGold >= 1000 },
        { id: 'level_10', name: '升级达人', icon: '⬆️', desc: '达到10级', cond: d => d.level >= 10 },
        { id: 'level_20', name: '升级大师', icon: '⬆️', desc: '达到20级', cond: d => d.level >= 20 },
        { id: 'level_30', name: '传奇英雄', icon: '⬆️', desc: '达到30级', cond: d => d.level >= 30 },
        { id: 'weapon_5', name: '武器大师', icon: '⚔️', desc: '武器达到5级', cond: d => d.weaponLevel >= 5 },
        { id: 'weapon_10', name: '武器宗师', icon: '⚔️', desc: '武器达到10级', cond: d => d.weaponLevel >= 10 },
        { id: 'minion_master', name: '随从主人', icon: '👼', desc: '拥有两个随从', cond: d => d.minions.length >= 2 },
        { id: 'combo_10', name: '连击新手', icon: '🔥', desc: '达成10连击', cond: d => d.maxCombo >= 10 },
        { id: 'combo_50', name: '连击达人', icon: '🔥', desc: '达成50连击', cond: d => d.maxCombo >= 50 },
        { id: 'perfect_run', name: '完美开局', icon: '✨', desc: '前3分钟未受伤', cond: d => d.unhurtTime >= 180 }
    ];

    static check(runtime, saved) {
        const newAchievements = [];
        this.list.forEach(ach => {
            if (!saved.achievements.includes(ach.id) && ach.cond(runtime)) {
                saved.achievements.push(ach.id);
                newAchievements.push(ach);
            }
        });
        return newAchievements;
    }
}

class RuntimeData {
    constructor() { this.reset(); }

    reset() {
        this.hp = 200;
        this.maxHp = 200;
        this.level = 1;
        this.exp = 0;
        this.expToNext = 40;
        this.gold = 0;
        this.specPoints = 0;
        this.weapon = null;
        this.weaponType = null;
        this.skill = null;
        this.minions = [];
        this.specializations = { attack: 0, crit: 0, attackSpeed: 0, hp: 0, armor: 0, gold: 0, exp: 0, minion: 0 };
        this.weaponLevel = 1;
        this.bossCount = 0;
        this.survivalTime = 0;
        this.killCount = 0;
        this.totalGoldEarned = 0;
        this.shield = 0;
        this.shieldTime = 0;
        this.nextCrit = false;
        this.invincibleTime = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.lastKillTime = 0;
        this.unhurtTime = 0;
        this.lastDamageTime = 0;
    }
}

class Weapon {
    constructor(name, damage, speed, range, type, arcAngle, attackWidth, icon, color) {
        this.name = name;
        this.baseDamage = damage;
        this.baseSpeed = speed;
        this.range = range;
        this.type = type;
        this.arcAngle = arcAngle;
        this.attackWidth = attackWidth;
        this.icon = icon;
        this.color = color;
        this.lastAttack = 0;
    }

    canAttack(time) { return time - this.lastAttack >= this.baseSpeed; }

    getDamage(level, spec) {
        const base = this.baseDamage + (level - 1) * 3;
        const attackBonus = 1 + spec.attack * 0.08;
        const comboBonus = 1 + Math.floor(spec.attackSpeed / 3) * 0.04;
        return Math.floor(base * attackBonus * comboBonus);
    }

    getAttackSpeed(spec) {
        return this.baseSpeed / (1 + spec.attackSpeed * 0.06);
    }

    getCritRate(spec) {
        return 0.08 + spec.crit * 0.02;
    }

    getCritDamage(spec) {
        return 2.0 + Math.floor(spec.crit / 4) * 0.25;
    }
}

class Sword extends Weapon {
    constructor() {
        super('暗影剑', 15, 450, 90, 'melee_arc', Math.PI / 3, 60, '⚔️', 0xff4466);
    }
}

class Axe extends Weapon {
    constructor() {
        super('烈焰斧', 35, 1000, 120, 'melee_arc', Math.PI / 2, 80, '🪓', 0xffaa00);
    }
}

class Staff extends Weapon {
    constructor() {
        super('冰霜法杖', 25, 700, 500, 'ranged_line', 0, 10, '🪄', 0x00ffff);
    }
}

class Bow extends Weapon {
    constructor() {
        super('狩猎弓', 32, 850, 600, 'ranged_projectile', 0, 6, '🏹', 0x88ff88);
    }
}

class Wand extends Weapon {
    constructor() {
        super('奥术魔杖', 12, 350, 200, 'ranged_bounce', 0, 12, '✨', 0xff66ff);
        this.bounceCount = 2;
        this.bounceDecay = 0.65;
    }
}

const WeaponFactory = {
    create(type) {
        const weapons = { sword: Sword, axe: Axe, staff: Staff, bow: Bow, wand: Wand };
        return new (weapons[type] || Sword)();
    },
    
    getInfo(type) {
        const infos = {
            sword: { name: '暗影剑', desc: '快速近战，攻击范围近但攻速极快', icon: '⚔️', color: '#ff4466', bgColor: 0x2a0a15 },
            axe: { name: '烈焰斧', desc: '重型近战，伤害高范围大但攻速慢', icon: '🪓', color: '#ffaa00', bgColor: 0x2a1a05 },
            staff: { name: '冰霜法杖', desc: '远程能量武器，发射穿透光束', icon: '🪄', color: '#00ffff', bgColor: 0x051a2a },
            bow: { name: '狩猎弓', desc: '远程精准武器，发射高速箭矢', icon: '🏹', color: '#88ff88', bgColor: 0x0a2a10 },
            wand: { name: '奥术魔杖', desc: '魔法武器，发射弹跳魔法球', icon: '✨', color: '#ff66ff', bgColor: 0x1a052a }
        };
        return infos[type] || infos.sword;
    },

    getAll() {
        return ['sword', 'axe', 'staff', 'bow', 'wand'];
    }
};

class Skill {
    constructor(name, cooldown, desc, icon, color) {
        this.name = name;
        this.cooldown = cooldown;
        this.desc = desc;
        this.icon = icon;
        this.color = color;
        this.lastUse = 0;
    }

    canUse(time) { return time - this.lastUse >= this.cooldown; }

    getCooldownPercent(time) {
        const elapsed = time - this.lastUse;
        return elapsed >= this.cooldown ? 0 : 1 - (elapsed / this.cooldown);
    }

    use(scene) {
        this.lastUse = scene.time.now;
        scene.audio.play('skill');
    }
}

class SwordSkill extends Skill {
    constructor() {
        super('暗影冲刺', 5500, '冲刺到目标位置，对路径敌人造成180%伤害，下次攻击必定暴击', '💥', '#ff4466');
    }

    use(scene) {
        super.use(scene);
        const pointer = scene.input.activePointer;
        const targetX = pointer.x + scene.playerWorldX - GAME_WIDTH/2;
        const targetY = pointer.y + scene.playerWorldY - GAME_HEIGHT/2;
        const angle = Math.atan2(targetY - scene.playerWorldY, targetX - scene.playerWorldX);
        const dist = 180;
        
        const endX = scene.playerWorldX + Math.cos(angle) * dist;
        const endY = scene.playerWorldY + Math.sin(angle) * dist;
        
        const enemies = scene.enemyManager.getEnemiesInLine(scene.playerWorldX, scene.playerWorldY, endX, endY, 35);
        const damage = Math.floor(scene.runtime.weapon.getDamage(scene.runtime.weaponLevel, scene.runtime.specializations) * 1.8);
        
        enemies.forEach(e => {
            e.takeDamage(damage);
            scene.showDamage(e.sprite.x, e.sprite.y, damage);
        });

        scene.playerWorldX = Math.max(-WORLD_SIZE/2, Math.min(WORLD_SIZE/2, endX));
        scene.playerWorldY = Math.max(-WORLD_SIZE/2, Math.min(WORLD_SIZE/2, endY));
        
        scene.runtime.nextCrit = true;
        scene.particles.createSkillEffect(GAME_WIDTH/2, GAME_HEIGHT/2, 'crit_prepare');
        
        const dash = scene.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, 25, 80, 0xff4466, 0.7);
        dash.rotation = angle;
        scene.tweens.add({ targets: dash, scaleX: 4, alpha: 0, duration: 250, onComplete: () => dash.destroy() });
    }
}

class AxeSkill extends Skill {
    constructor() {
        super('旋风斩', 7500, '旋转360度，对周围220范围敌人造成220%伤害', '🌀', '#ffaa00');
    }

    use(scene) {
        super.use(scene);
        const damage = Math.floor(scene.runtime.weapon.getDamage(scene.runtime.weaponLevel, scene.runtime.specializations) * 2.2);
        const enemies = scene.enemyManager.getEnemiesInRange(scene.playerWorldX, scene.playerWorldY, 220);
        
        enemies.forEach(e => {
            e.takeDamage(damage);
            scene.showDamage(e.sprite.x, e.sprite.y, damage);
        });

        if (scene.bossManager.currentBoss?.alive) {
            const boss = scene.bossManager.currentBoss;
            const dist = Phaser.Math.Distance.Between(scene.playerWorldX, scene.playerWorldY, boss.worldX, boss.worldY);
            if (dist <= 220) boss.takeDamage(damage);
        }

        scene.particles.createSkillEffect(GAME_WIDTH/2, GAME_HEIGHT/2, 'whirlwind');
    }
}

class StaffSkill extends Skill {
    constructor() {
        super('寒冰护盾', 6500, '获得吸收100伤害的护盾，持续5秒，护盾存在时减速附近敌人', '🛡️', '#00ffff');
    }

    use(scene) {
        super.use(scene);
        scene.runtime.shield = 100 + scene.runtime.specializations.armor * 6;
        scene.runtime.shieldTime = scene.time.now;
        scene.particles.createSkillEffect(GAME_WIDTH/2, GAME_HEIGHT/2, 'shield');
        
        const shield = scene.add.circle(GAME_WIDTH/2, GAME_HEIGHT/2, 60, 0x00ffff, 0.2);
        scene.tweens.add({ targets: shield, scale: [1, 1.2, 1], alpha: [0.3, 0.1, 0.3], duration: 1000, repeat: 4, yoyo: true, onComplete: () => shield.destroy() });
    }
}

class BowSkill extends Skill {
    constructor() {
        super('穿透射击', 7000, '射出一支穿透箭，对直线上所有敌人造成280%伤害', '🏹', '#88ff88');
    }

    use(scene) {
        super.use(scene);
        const pointer = scene.input.activePointer;
        const targetX = pointer.x + scene.playerWorldX - GAME_WIDTH/2;
        const targetY = pointer.y + scene.playerWorldY - GAME_HEIGHT/2;
        
        const damage = Math.floor(scene.runtime.weapon.getDamage(scene.runtime.weaponLevel, scene.runtime.specializations) * 2.8);
        const enemies = scene.enemyManager.getEnemiesInLine(scene.playerWorldX, scene.playerWorldY, targetX, targetY, 25);
        
        enemies.forEach(e => {
            e.takeDamage(damage);
            scene.showDamage(e.sprite.x, e.sprite.y, damage);
        });

        if (scene.bossManager.currentBoss?.alive) {
            const boss = scene.bossManager.currentBoss;
            if (scene.enemyManager.isPointOnLine(scene.playerWorldX, scene.playerWorldY, targetX, targetY, boss.worldX, boss.worldY, 40)) {
                boss.takeDamage(damage);
            }
        }

        scene.particles.createSkillEffect(GAME_WIDTH/2, GAME_HEIGHT/2, 'pierce');
    }
}

class WandSkill extends Skill {
    constructor() {
        super('奥术爆发', 5000, '在鼠标位置引发魔法爆炸，对150范围敌人造成320%伤害', '💫', '#ff66ff');
    }

    use(scene) {
        super.use(scene);
        const pointer = scene.input.activePointer;
        const targetX = pointer.x + scene.playerWorldX - GAME_WIDTH/2;
        const targetY = pointer.y + scene.playerWorldY - GAME_HEIGHT/2;
        
        const damage = Math.floor(scene.runtime.weapon.getDamage(scene.runtime.weaponLevel, scene.runtime.specializations) * 3.2);
        const enemies = scene.enemyManager.getEnemiesInRange(targetX, targetY, 150);
        
        enemies.forEach(e => {
            e.takeDamage(damage);
            scene.showDamage(e.sprite.x, e.sprite.y, damage);
        });

        if (scene.bossManager.currentBoss?.alive) {
            const boss = scene.bossManager.currentBoss;
            const dist = Phaser.Math.Distance.Between(targetX, targetY, boss.worldX, boss.worldY);
            if (dist <= 150) boss.takeDamage(damage);
        }

        scene.particles.createSkillEffect(pointer.x, pointer.y, 'explosion');
    }
}

const SkillFactory = {
    create(type) {
        const skills = { sword: SwordSkill, axe: AxeSkill, staff: StaffSkill, bow: BowSkill, wand: WandSkill };
        return new (skills[type] || SwordSkill)();
    }
};

class Minion {
    constructor(scene, type) {
        this.scene = scene;
        this.type = type;
        this.sprite = null;
        this.angle = Math.random() * Math.PI * 2;
        this.radius = 50;
        this.lastAction = 0;
        this.alive = true;
        this.worldX = 0;
        this.worldY = 0;
    }

    spawn() {
        this.worldX = this.scene.playerWorldX;
        this.worldY = this.scene.playerWorldY;
        const screenX = this.worldX - this.scene.playerWorldX + GAME_WIDTH/2;
        const screenY = this.worldY - this.scene.playerWorldY + GAME_HEIGHT/2;
        
        this.sprite = this.scene.add.text(screenX, screenY, this.getIcon(), { fontSize: '28px' }).setOrigin(0.5);
        this.sprite.setDepth(51);
        
        this.scene.particles.createMinionSpawn(screenX, screenY);
        this.scene.audio.play('unlock');
    }

    getIcon() { return this.type === 'lightElf' ? '👼' : '💀'; }

    update(time, delta) {
        if (!this.alive || !this.sprite) return;

        this.angle += delta * 0.002;
        this.worldX = this.scene.playerWorldX + Math.cos(this.angle) * this.radius;
        this.worldY = this.scene.playerWorldY + Math.sin(this.angle) * this.radius;
        
        const screenX = this.worldX - this.scene.playerWorldX + GAME_WIDTH/2;
        const screenY = this.worldY - this.scene.playerWorldY + GAME_HEIGHT/2;
        
        this.sprite.x = screenX;
        this.sprite.y = screenY;
        this.sprite.rotation = this.angle + Math.PI/2;

        this.performAction(time);
    }

    performAction(time) {}
}

class LightElf extends Minion {
    constructor(scene) {
        super(scene, 'lightElf');
        this.healInterval = 4500;
        this.healAmount = 0.06;
    }

    performAction(time) {
        if (time - this.lastAction >= this.healInterval) {
            this.lastAction = time;
            this.heal();
        }
    }

    heal() {
        const amount = Math.floor(this.scene.runtime.maxHp * this.healAmount);
        this.scene.runtime.hp = Math.min(this.scene.runtime.hp + amount, this.scene.runtime.maxHp);
        
        this.scene.particles.createHeal(this.sprite.x, this.sprite.y);
        this.scene.audio.play('minionHeal');
        
        const text = this.scene.add.text(this.sprite.x, this.sprite.y - 20, `+${amount}`, {
            fontSize: '16px', fontFamily: 'Courier New', color: '#44ff44'
        }).setOrigin(0.5);
        
        this.scene.tweens.add({ targets: text, y: this.sprite.y - 45, alpha: 0, duration: 600, onComplete: () => text.destroy() });
    }
}

class SkeletonWarrior extends Minion {
    constructor(scene) {
        super(scene, 'skeletonWarrior');
        this.attackInterval = 1800;
        this.baseDamage = 15;
    }

    performAction(time) {
        if (time - this.lastAction >= this.attackInterval) {
            this.lastAction = time;
            this.attack();
        }
    }

    attack() {
        const target = this.findTarget();
        if (!target) return;

        const damage = this.baseDamage + this.scene.runtime.specializations.minion * 3;
        target.takeDamage(damage);
        
        this.scene.particles.createHit(target.sprite.x, target.sprite.y, 0xffaa00, 6);
        this.scene.audio.play('minionAttack');
        this.scene.showDamage(target.sprite.x, target.sprite.y, damage);
    }

    findTarget() {
        let nearest = null;
        let minDist = Infinity;
        
        this.scene.enemyManager.enemies.forEach(e => {
            if (!e.alive) return;
            const dist = Phaser.Math.Distance.Between(this.worldX, this.worldY, e.worldX, e.worldY);
            if (dist < minDist && dist < 280) {
                minDist = dist;
                nearest = e;
            }
        });

        if (!nearest && this.scene.bossManager.currentBoss?.alive) {
            const boss = this.scene.bossManager.currentBoss;
            const dist = Phaser.Math.Distance.Between(this.worldX, this.worldY, boss.worldX, boss.worldY);
            if (dist < 300) return boss;
        }

        return nearest;
    }
}

const MinionFactory = {
    create(scene, type) {
        const minions = { lightElf: LightElf, skeletonWarrior: SkeletonWarrior };
        return new (minions[type] || LightElf)(scene);
    },
    
    getInfo(type) {
        const infos = {
            lightElf: { name: '光明精灵', icon: '👼', desc: '每4.5秒回复6%HP', unlock: '击败第3个Boss' },
            skeletonWarrior: { name: '骷髅战士', icon: '💀', desc: '每1.8秒自动攻击敌人', unlock: '累计存活10分钟' }
        };
        return infos[type] || infos.lightElf;
    }
};

class Enemy {
    constructor(scene, type) {
        this.scene = scene;
        this.type = type;
        this.hp = 0;
        this.maxHp = 0;
        this.damage = 0;
        this.timeoutThreshold = 0;
        this.spawnTime = scene.time.now;
        this.lastUpdate = scene.time.now;
        this.lastSpecial = scene.time.now;
        this.sprite = null;
        this.hpBar = null;
        this.hpBarBg = null;
        this.alive = true;
        this.worldX = 0;
        this.worldY = 0;
        this.speed = this.getSpeed();
        this.isRanged = type === 'archer';
        this.range = this.isRanged ? 350 : 50;
        this.stoneArmor = false;
        this.splitDone = false;
        this.movePattern = this.getMovePattern();
    }

    getSpeed() {
        const speeds = { slime: 35, bat: 65, skeleton: 45, ghost: 55, gargoyle: 28, archer: 50 };
        return speeds[this.type] || 40;
    }

    getMovePattern() {
        const patterns = { slime: 'direct', bat: 'zigzag', skeleton: 'direct', ghost: 'teleport', gargoyle: 'slow', archer: 'keepDistance' };
        return patterns[this.type] || 'direct';
    }

    reset(hp, damage, timeout) {
        this.hp = hp;
        this.maxHp = hp;
        this.damage = damage;
        this.timeoutThreshold = timeout;
        this.spawnTime = this.scene.time.now;
        this.lastUpdate = this.scene.time.now;
        this.lastSpecial = this.scene.time.now;
        this.alive = true;
        this.worldX = 0;
        this.worldY = 0;
        this.stoneArmor = false;
        this.splitDone = false;
    }

    spawn(x, y) {
        this.worldX = x;
        this.worldY = y;
        
        const size = this.type === 'gargoyle' ? 36 : 26;
        this.sprite = this.scene.add.container(GAME_WIDTH/2 + x - this.scene.playerWorldX, GAME_HEIGHT/2 + y - this.scene.playerWorldY);
        this.sprite.setData('enemy', this);
        
        this.createSprite(size);
        
        this.hpBarBg = this.scene.add.rectangle(this.sprite.x, this.sprite.y - size/2 - 10, size, 5, 0x220000);
        this.hpBar = this.scene.add.rectangle(this.sprite.x, this.sprite.y - size/2 - 10, size, 5, 0xaa0022);
        this.hpBar.setOrigin(0.5, 0.5);
        
        this.scene.particles.createEnemySpawn(this.sprite.x, this.sprite.y, this.getColor());
        
        return this;
    }

    createSprite(size) {
        const colors = {
            slime: 0x336600, bat: 0x440044, skeleton: 0xbbbbbb, ghost: 0x225555, gargoyle: 0x553333, archer: 0x775533
        };
        const color = colors[this.type] || 0x666666;

        switch (this.type) {
            case 'slime':
                const body = this.scene.add.ellipse(0, 0, size * 0.85, size * 0.65, color);
                this.sprite.add(body);
                const eye1 = this.scene.add.circle(-5, -3, 3, 0x000000);
                const eye2 = this.scene.add.circle(5, -3, 3, 0x000000);
                this.sprite.add(eye1);
                this.sprite.add(eye2);
                break;
            case 'bat':
                const bBody = this.scene.add.ellipse(0, 0, size * 0.45, size * 0.65, color);
                this.sprite.add(bBody);
                const wing1 = this.scene.add.ellipse(-7, 0, size * 0.55, size * 0.22, color);
                wing1.rotation = -0.4;
                const wing2 = this.scene.add.ellipse(7, 0, size * 0.55, size * 0.22, color);
                wing2.rotation = 0.4;
                this.sprite.add(wing1);
                this.sprite.add(wing2);
                const bEye = this.scene.add.circle(0, -3, 3, 0xff0000);
                this.sprite.add(bEye);
                break;
            case 'skeleton':
                const sHead = this.scene.add.circle(0, -6, size * 0.32, color);
                this.sprite.add(sHead);
                const sEye1 = this.scene.add.circle(-3, -7, 2, 0x000000);
                const sEye2 = this.scene.add.circle(3, -7, 2, 0x000000);
                this.sprite.add(sEye1);
                this.sprite.add(sEye2);
                const sBody = this.scene.add.rectangle(0, 4, size * 0.22, size * 0.45, color);
                this.sprite.add(sBody);
                break;
            case 'ghost':
                const gBody = this.scene.add.ellipse(0, 0, size * 0.65, size * 0.85, color, 0.55);
                this.sprite.add(gBody);
                const gEye1 = this.scene.add.circle(-5, -4, 4, 0x00ffff);
                const gEye2 = this.scene.add.circle(5, -4, 4, 0x00ffff);
                this.sprite.add(gEye1);
                this.sprite.add(gEye2);
                break;
            case 'gargoyle':
                const ggBody = this.scene.add.rectangle(0, 0, size * 0.55, size * 0.75, color);
                this.sprite.add(ggBody);
                const ggHead = this.scene.add.circle(0, -9, size * 0.28, color);
                this.sprite.add(ggHead);
                const ggEye = this.scene.add.circle(0, -9, 4, 0xff0000);
                this.sprite.add(ggEye);
                break;
            case 'archer':
                const aBody = this.scene.add.rectangle(0, 3, size * 0.28, size * 0.55, color);
                this.sprite.add(aBody);
                const aHead = this.scene.add.circle(0, -6, size * 0.22, 0xcccccc);
                this.sprite.add(aHead);
                const aEye = this.scene.add.circle(2, -6, 2, 0x000000);
                this.sprite.add(aEye);
                const bow = this.scene.add.arc(8, 3, 7, 0, Math.PI, true, 0x553311);
                this.sprite.add(bow);
                break;
        }
    }

    getColor() {
        const colors = { slime: 0x336600, bat: 0x440044, skeleton: 0xbbbbbb, ghost: 0x225555, gargoyle: 0x553333, archer: 0x775533 };
        return colors[this.type] || 0x666666;
    }

    update(time, delta) {
        if (!this.alive) return;

        const screenX = this.worldX - this.scene.playerWorldX + GAME_WIDTH/2;
        const screenY = this.worldY - this.scene.playerWorldY + GAME_HEIGHT/2;
        
        this.sprite.x = screenX;
        this.sprite.y = screenY;
        this.hpBar.x = screenX;
        this.hpBar.y = screenY - (this.type === 'gargoyle' ? 36 : 26)/2 - 10;
        this.hpBarBg.x = screenX;
        this.hpBarBg.y = screenY - (this.type === 'gargoyle' ? 36 : 26)/2 - 10;

        this.executeSpecial(time);
        this.move(time, delta);
    }

    move(time, delta) {
        const playerX = this.scene.playerWorldX;
        const playerY = this.scene.playerWorldY;
        const dx = playerX - this.worldX;
        const dy = playerY - this.worldY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 45) {
            this.scene.onPlayerHit(this);
            return;
        }

        let moveX = 0, moveY = 0;

        switch (this.movePattern) {
            case 'direct':
                moveX = (dx / dist) * this.speed;
                moveY = (dy / dist) * this.speed;
                break;
            case 'zigzag':
                const zigzag = Math.sin(time * 0.005 + this.worldX) * 30;
                moveX = (dx / dist) * this.speed;
                moveY = ((dy + zigzag) / dist) * this.speed;
                break;
            case 'slow':
                moveX = (dx / dist) * this.speed * 0.7;
                moveY = (dy / dist) * this.speed * 0.7;
                break;
            case 'keepDistance':
                if (dist < 200) {
                    moveX = -(dx / dist) * this.speed * 0.5;
                    moveY = -(dy / dist) * this.speed * 0.5;
                } else {
                    moveX = (dx / dist) * this.speed;
                    moveY = (dy / dist) * this.speed;
                }
                break;
            case 'teleport':
                if (dist > 150 && Math.random() < 0.002) {
                    const angle = Math.random() * Math.PI * 2;
                    this.worldX = playerX - Math.cos(angle) * 100;
                    this.worldY = playerY - Math.sin(angle) * 100;
                } else {
                    moveX = (dx / dist) * this.speed;
                    moveY = (dy / dist) * this.speed;
                }
                break;
        }

        this.worldX += moveX * delta * 0.05;
        this.worldY += moveY * delta * 0.05;
    }

    executeSpecial(time) {
        const playerX = this.scene.playerWorldX;
        const playerY = this.scene.playerWorldY;
        const dist = Phaser.Math.Distance.Between(this.worldX, this.worldY, playerX, playerY);

        switch (this.type) {
            case 'bat':
                if (time - this.lastSpecial > 3500 && dist < 280) {
                    this.lastSpecial = time;
                    this.batDive(playerX, playerY);
                }
                break;
            case 'skeleton':
                if (time - this.lastSpecial > 3000 && dist < 200) {
                    this.lastSpecial = time;
                    this.throwBone(playerX, playerY);
                }
                break;
            case 'ghost':
                if (time - this.lastSpecial > 4500 && dist < 250) {
                    this.lastSpecial = time;
                    this.ghostTeleport(playerX, playerY);
                }
                break;
            case 'gargoyle':
                if (Math.random() < 0.012) {
                    this.stoneArmor = true;
                    setTimeout(() => this.stoneArmor = false, 2000);
                }
                break;
            case 'archer':
                if (time - this.lastSpecial > 3500 && dist < 300) {
                    this.lastSpecial = time;
                    this.arrowRain(playerX, playerY);
                }
                break;
        }
    }

    batDive(targetX, targetY) {
        const angle = Math.atan2(targetY - this.worldY, targetX - this.worldX);
        this.worldX += Math.cos(angle) * 120;
        this.worldY += Math.sin(angle) * 120;
        
        const screenX = this.worldX - this.scene.playerWorldX + GAME_WIDTH/2;
        const screenY = this.worldY - this.scene.playerWorldY + GAME_HEIGHT/2;
        
        this.scene.tweens.add({
            targets: this.sprite,
            x: screenX,
            y: screenY,
            scale: [1, 1.5, 1],
            duration: 350,
            ease: 'Power2'
        });
    }

    throwBone(targetX, targetY) {
        const bone = new Projectile(this.scene, this.worldX, this.worldY, targetX, targetY, this.damage * 0.7, 'bone');
        this.scene.projectiles.push(bone);
    }

    ghostTeleport(targetX, targetY) {
        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            duration: 250,
            onComplete: () => {
                const angle = Math.random() * Math.PI * 2;
                this.worldX = targetX - Math.cos(angle) * 120;
                this.worldY = targetY - Math.sin(angle) * 120;
                const screenX = this.worldX - this.scene.playerWorldX + GAME_WIDTH/2;
                const screenY = this.worldY - this.scene.playerWorldY + GAME_HEIGHT/2;
                this.sprite.x = screenX;
                this.sprite.y = screenY;
                this.scene.tweens.add({ targets: this.sprite, alpha: 0.55, duration: 350 });
            }
        });
    }

    arrowRain(targetX, targetY) {
        for (let i = 0; i < 4; i++) {
            const offset = (Math.random() - 0.5) * Math.PI / 2.5;
            setTimeout(() => {
                const arrow = new Projectile(this.scene, this.worldX, this.worldY, 
                    targetX + Math.cos(offset) * 60, targetY + Math.sin(offset) * 60, 
                    this.damage * 0.6, 'arrow');
                this.scene.projectiles.push(arrow);
            }, i * 100);
        }
    }

    slimeSplit() {
        if (this.splitDone) return;
        this.splitDone = true;
        for (let i = 0; i < 2; i++) {
            const mini = new Enemy(this.scene, 'slime');
            const stats = this.scene.enemyManager.getEnemyStats('slime');
            mini.reset(Math.floor(stats[0] / 3), Math.floor(stats[1] / 2), stats[2]);
            mini.spawn(this.worldX + (i === 0 ? -35 : 35), this.worldY + (i === 0 ? 35 : -35));
            this.scene.enemyManager.enemies.push(mini);
        }
    }

    takeDamage(amount) {
        if (!this.alive) return false;
        
        if (this.stoneArmor) amount = Math.floor(amount * 0.35);
        
        this.hp -= amount;
        this.updateHPBar();

        this.scene.tweens.add({
            targets: this.sprite,
            alpha: 0.25,
            duration: 60,
            yoyo: true
        });

        if (this.hp <= 0) {
            this.die();
            return true;
        }
        return false;
    }

    updateHPBar() {
        if (this.hpBar && this.sprite) {
            const ratio = Math.max(0, this.hp / this.maxHp);
            const size = this.type === 'gargoyle' ? 36 : 26;
            this.hpBar.setScale(ratio, 1);
            this.hpBar.x = this.sprite.x - (size * (1 - ratio)) / 2;
        }
    }

    die() {
        this.alive = false;
        const gold = Math.floor(Math.random() * 6) + 1;
        const exp = Math.floor(this.maxHp / 5);
        this.scene.onEnemyKilled(this, gold, exp);

        if (this.type === 'slime' && this.maxHp >= 50 && !this.splitDone) {
            this.slimeSplit();
        }

        this.dropItem();

        if (this.sprite) {
            this.scene.tweens.add({
                targets: [this.sprite, this.hpBar, this.hpBarBg],
                alpha: 0,
                scale: 0,
                duration: 250,
                onComplete: () => {
                    this.sprite.destroy();
                    if (this.hpBar) this.hpBar.destroy();
                    if (this.hpBarBg) this.hpBarBg.destroy();
                }
            });
        }
    }

    dropItem() {
        if (Math.random() < 0.18) {
            const types = ['health', 'shield', 'bomb', 'gold', 'exp'];
            const weights = [22, 15, 12, 32, 19];
            const type = this.weightedRandom(types, weights);
            const item = new Item(this.scene, type, this.worldX, this.worldY);
            this.scene.items.push(item);
        }
    }

    weightedRandom(items, weights) {
        const total = weights.reduce((a, b) => a + b, 0);
        let r = Math.random() * total;
        for (let i = 0; i < items.length; i++) {
            r -= weights[i];
            if (r <= 0) return items[i];
        }
        return items[items.length - 1];
    }
}

class Boss {
    constructor(scene, type) {
        this.scene = scene;
        this.type = type;
        this.hp = 0;
        this.maxHp = 0;
        this.damage = 0;
        this.sprite = null;
        this.hpBar = null;
        this.alive = true;
        this.worldX = 0;
        this.worldY = 0;
        this.lastSkill = 0;
        this.skillCooldown = 5000;
        this.name = this.getName();
        this.moveSpeed = 18;
        this.introDone = false;
    }

    getName() {
        const names = { goblinKing: '哥布林王', skeletonLord: '骷髅领主', shadowDragon: '暗影龙', demonLord: '深渊魔王' };
        return names[this.type] || 'Boss';
    }

    spawn(hp, damage) {
        this.hp = hp;
        this.maxHp = hp;
        this.damage = damage;
        
        const colors = {
            goblinKing: 0x8B4513, skeletonLord: 0x555555, shadowDragon: 0x4B0082, demonLord: 0x8B0000
        };
        const color = colors[this.type] || 0xff0000;

        this.worldX = this.scene.playerWorldX;
        this.worldY = this.scene.playerWorldY;

        this.sprite = this.scene.add.container(GAME_WIDTH/2, GAME_HEIGHT/2);
        this.sprite.setAlpha(0);
        
        this.createSprite(color);

        this.hpBarBg = this.scene.add.rectangle(GAME_WIDTH/2, 80, 450, 14, 0x333333);
        this.hpBar = this.scene.add.rectangle(GAME_WIDTH/2, 80, 450, 14, 0xff0000);
        this.hpBar.setOrigin(0.5, 0.5);

        this.nameText = this.scene.add.text(GAME_WIDTH/2, 55, this.name, {
            fontSize: '32px', fontFamily: 'Courier New', color: '#ff6600',
            stroke: '#000000', strokeThickness: 4
        }).setOrigin(0.5);

        this.scene.tweens.add({
            targets: this.sprite,
            alpha: [0, 1],
            scale: [0.5, 1],
            duration: 1000,
            onComplete: () => this.introDone = true
        });

        return this;
    }

    createSprite(color) {
        const size = 70;

        switch (this.type) {
            case 'goblinKing':
                const gBody = this.scene.add.rectangle(0, 0, size * 0.75, size * 0.95, color);
                this.sprite.add(gBody);
                const gHead = this.scene.add.circle(0, -22, size * 0.38, color);
                this.sprite.add(gHead);
                const gCrown = this.scene.add.triangle(0, -38, 0, -15, -22, -38, 22, -38, 0xffd700);
                this.sprite.add(gCrown);
                const gEye = this.scene.add.circle(0, -22, 7, 0xff0000);
                this.sprite.add(gEye);
                break;
            case 'skeletonLord':
                const sBody = this.scene.add.rectangle(0, 0, size * 0.55, size * 0.85, color);

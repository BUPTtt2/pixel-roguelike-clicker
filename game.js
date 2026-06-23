/**
 * 像素地牢猎手 - Pixel Dungeon Hunter
 * 点击肉鸽小游戏
 * 
 * 使用 Phaser 3 开发
 */

// ==================== 游戏常量 ====================
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

// ==================== 粒子效果系统 ====================

/**
 * ParticleManager - 粒子效果管理器
 */
class ParticleManager {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
    }

    // 金币掉落粒子
    createGoldParticles(x, y, count = 5) {
        for (let i = 0; i < count; i++) {
            const particle = this.scene.add.text(x, y, '💰', {
                fontSize: '16px'
            }).setOrigin(0.5);

            const targetX = GAME_WIDTH - 150;
            const targetY = 20;

            this.scene.tweens.add({
                targets: particle,
                x: targetX + Phaser.Math.Between(-20, 20),
                y: targetY + Phaser.Math.Between(-10, 10),
                alpha: 0,
                scale: 0.5,
                duration: 600 + Phaser.Math.Between(0, 200),
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
    }

    // 经验获取粒子
    createExpParticles(x, y, count = 3) {
        for (let i = 0; i < count; i++) {
            const particle = this.scene.add.text(x, y, '✨', {
                fontSize: '14px'
            }).setOrigin(0.5);

            const targetX = 110;
            const targetY = 50;

            this.scene.tweens.add({
                targets: particle,
                x: targetX,
                y: targetY,
                alpha: 0,
                scale: 0.3,
                duration: 500,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
    }

    // 击杀爆炸粒子
    createKillParticles(x, y) {
        const colors = [0xff0000, 0xff6600, 0xffff00, 0xff00ff];
        const count = 8;

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const distance = 30;

            const particle = this.scene.add.circle(x, y, 4, colors[i % colors.length]);

            this.scene.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                alpha: 0,
                scale: 0,
                duration: 300,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
    }

    // Boss击败大爆炸
    createBossDefeatParticles(x, y) {
        const colors = [0xffd700, 0xff6600, 0xff0000, 0x00ffff, 0xff00ff];
        const count = 20;

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const distance = 60 + Phaser.Math.Between(0, 30);

            const particle = this.scene.add.circle(x, y, 6, colors[i % colors.length]);

            this.scene.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                alpha: 0,
                scale: 0,
                duration: 500 + Phaser.Math.Between(0, 200),
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }

        // 中心爆炸
        const center = this.scene.add.circle(x, y, 30, 0xffd700, 0.8);
        this.scene.tweens.add({
            targets: center,
            scale: 2,
            alpha: 0,
            duration: 400,
            onComplete: () => center.destroy()
        });
    }

    // 升级星星粒子
    createLevelUpParticles() {
        const x = GAME_WIDTH / 2;
        const y = GAME_HEIGHT / 2;

        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const startDist = 50;
            const endDist = 150;

            const particle = this.scene.add.text(
                x + Math.cos(angle) * startDist,
                y + Math.sin(angle) * startDist,
                '⭐',
                { fontSize: '20px' }
            ).setOrigin(0.5);

            this.scene.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * endDist,
                y: y + Math.sin(angle) * endDist,
                alpha: 0,
                scale: 0.5,
                duration: 800,
                ease: 'Power2',
                onComplete: () => particle.destroy()
            });
        }
    }

    // 随从攻击粒子
    createMinionAttackParticles(x, y) {
        const particle = this.scene.add.circle(x, y, 10, 0x888888, 0.6);
        this.scene.tweens.add({
            targets: particle,
            scale: 2,
            alpha: 0,
            duration: 200,
            onComplete: () => particle.destroy()
        });
    }

    // 回血粒子
    createHealParticles() {
        const x = GAME_WIDTH / 2;
        const y = GAME_HEIGHT / 2;

        for (let i = 0; i < 6; i++) {
            const offsetY = -30 - i * 20;
            const particle = this.scene.add.text(x, y + offsetY, '❤️', {
                fontSize: '16px'
            }).setOrigin(0.5).setAlpha(0);

            this.scene.tweens.add({
                targets: particle,
                alpha: 1,
                y: y + offsetY - 30,
                duration: 300,
                delay: i * 100,
                yoyo: true,
                onComplete: () => particle.destroy()
            });
        }
    }

    clear() {
        this.particles.forEach(p => p.destroy());
        this.particles = [];
    }
}

// ==================== 音效系统 ====================

/**
 * SoundManager - 音效管理器
 * 使用Web Audio API生成简单音效
 */
class SoundManager {
    constructor(scene) {
        this.scene = scene;
        this.audioCtx = null;
        this.enabled = true;
        this.volume = 0.3;
        this.init();
    }

    init() {
        try {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
            this.enabled = false;
        }
    }

    resume() {
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    play(type) {
        if (!this.enabled || !this.audioCtx) return;
        this.resume();

        const sounds = {
            attack: () => this.playTone(200, 0.05, 'square'),
            attack_shortsword: () => this.playTone(250, 0.04, 'square'),
            attack_battleaxe: () => this.playTone(150, 0.08, 'sawtooth'),
            attack_staff: () => this.playTone(400, 0.06, 'sine'),
            attack_bow: () => this.playTone(600, 0.03, 'triangle'),
            attack_wand: () => this.playTone(350, 0.05, 'sine'),
            hit: () => this.playTone(150, 0.08, 'sawtooth'),
            crit: () => this.playTone(400, 0.1, 'square'),
            kill: () => this.playTone(300, 0.1, 'sine'),
            levelUp: () => this.playMelody([262, 330, 392, 523], 0.1),
            bossWarning: () => this.playTone(100, 0.3, 'square'),
            bossDefeat: () => this.playMelody([523, 659, 784, 1047], 0.15),
            select: () => this.playTone(500, 0.05, 'sine'),
            click: () => this.playTone(600, 0.03, 'sine'),
            damage: () => this.playTone(80, 0.15, 'sawtooth'),
            heal: () => this.playMelody([440, 554, 659], 0.1),
            pickup: () => this.playTone(800, 0.05, 'sine'),
            pickup_gold: () => this.playTone(500, 0.08, 'sine'),
            unlock: () => this.playMelody([392, 523, 659, 784], 0.12),
            gameOver: () => this.playMelody([392, 330, 262, 196], 0.2),
            minion_attack: () => this.playTone(180, 0.06, 'triangle'),
            minion_heal: () => this.playTone(440, 0.1, 'sine')
        };

        if (sounds[type]) {
            sounds[type]();
        }
    }

    playTone(frequency, duration, type = 'sine') {
        const oscillator = this.audioCtx.createOscillator();
        const gainNode = this.audioCtx.createGain();

        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

        gainNode.gain.setValueAtTime(this.volume, this.audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioCtx.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);

        oscillator.start();
        oscillator.stop(this.audioCtx.currentTime + duration);
    }

    playMelody(frequencies, noteDuration) {
        frequencies.forEach((freq, i) => {
            setTimeout(() => {
                this.playTone(freq, noteDuration, 'sine');
            }, i * noteDuration * 1000);
        });
    }

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

// ==================== 成就系统 ====================

/**
 * AchievementManager - 成就管理器
 */
const AchievementManager = {
    achievements: {
        'first_boss': { name: '初次胜利', icon: '🏆', desc: '击败第一个Boss', condition: (r) => r.bossCount >= 1 },
        'boss_slayer': { name: 'Boss猎手', icon: '👹', desc: '击败3个Boss', condition: (r) => r.bossCount >= 3 },
        'boss_master': { name: 'Boss大师', icon: '👑', desc: '击败5个Boss', condition: (r) => r.bossCount >= 5 },
        'survivor_1min': { name: '生存新手', icon: '⏱️', desc: '存活1分钟', condition: (r) => r.survivalTime >= 60 },
        'survivor_5min': { name: '生存达人', icon: '⏱️', desc: '存活5分钟', condition: (r) => r.survivalTime >= 300 },
        'survivor_10min': { name: '生存大师', icon: '⏱️', desc: '存活10分钟', condition: (r) => r.survivalTime >= 600 },
        'killer_50': { name: '杀戮新手', icon: '💀', desc: '击杀50敌人', condition: (r) => r.killCount >= 50 },
        'killer_200': { name: '杀戮达人', icon: '💀', desc: '击杀200敌人', condition: (r) => r.killCount >= 200 },
        'gold_100': { name: '小富翁', icon: '💰', desc: '单局获得100金币', condition: (r) => r.totalGoldEarned >= 100 },
        'gold_500': { name: '大富翁', icon: '💰', desc: '单局获得500金币', condition: (r) => r.totalGoldEarned >= 500 },
        'level_10': { name: '升级达人', icon: '⬆️', desc: '达到10级', condition: (r) => r.level >= 10 },
        'level_20': { name: '升级大师', icon: '⬆️', desc: '达到20级', condition: (r) => r.level >= 20 },
        'weapon_max': { name: '武器大师', icon: '⚔️', desc: '武器达到5级', condition: (r) => r.weaponLevel >= 5 },
        'minion_owner': { name: '随从主人', icon: '👼', desc: '获得随从', condition: (r) => r.minion !== null }
    },

    check(runtime, data) {
        const newAchievements = [];
        Object.entries(this.achievements).forEach(([key, ach]) => {
            if (!data.achievements.includes(key) && ach.condition(runtime)) {
                newAchievements.push(key);
                data.achievements.push(key);
            }
        });
        return newAchievements;
    },

    getInfo(key) {
        return this.achievements[key] || null;
    },

    getAll() {
        return this.achievements;
    }
};

// ==================== 数据管理 ====================

/**
 * GameData - 跨局存档数据管理
 */
class GameData {
    static STORAGE_KEY = 'pixel_roguelike_save';

    static defaultData = {
        totalGold: 0,
        unlockedMinions: [],
        bestTime: 0,
        totalRuns: 0,
        achievements: []
    };

    static load() {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        return saved ? { ...this.defaultData, ...JSON.parse(saved) } : { ...this.defaultData };
    }

    static save(data) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    }

    static reset() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}

/**
 * RuntimeData - 单局游戏运行数据
 */
class RuntimeData {
    constructor() {
        this.reset();
    }

    reset() {
        this.hp = 150;           // 增加初始HP
        this.maxHp = 150;
        this.level = 1;
        this.exp = 0;
        this.expToNext = 30;     // 降低初始经验阈值，更快升级
        this.gold = 0;
        this.specializationPoints = 0;
        this.weapon = null;
        this.minion = null;
        this.specializations = {
            attack: 0,
            crit: 0,
            attackSpeed: 0,
            hp: 0,
            armor: 0,
            gold: 0,
            exp: 0,
            minion: 0
        };
        this.weaponLevel = 1;
        this.bossCount = 0;
        this.survivalTime = 0;
        this.killCount = 0;
        this.totalGoldEarned = 0;
    }
}

// ==================== 武器系统 ====================

/**
 * Weapon - 武器基类
 */
class Weapon {
    constructor(name, damage, attackSpeed, range, type, special) {
        this.name = name;
        this.baseDamage = damage;
        this.attackSpeed = attackSpeed;
        this.range = range;
        this.type = type;
        this.special = special;
        this.lastAttack = 0;
    }

    canAttack(time) {
        return time - this.lastAttack >= this.attackSpeed;
    }

    getDamage(level, specializations) {
        const base = this.baseDamage * level;
        const attackBonus = 1 + specializations.attack * 0.05;
        return Math.floor(base * attackBonus);
    }

    attack(time, scene, x, y) {
        this.lastAttack = time;
    }
}

/**
 * 5种武器实现
 */
class ShortSword extends Weapon {
    constructor() {
        super('短剑', 10, 200, 80, 'single', '快速单体攻击');
    }
}

class BattleAxe extends Weapon {
    constructor() {
        super('战斧', 25, 500, 120, 'aoe', '范围AOE攻击');
    }
}

class Staff extends Weapon {
    constructor() {
        super('法杖', 15, 350, 200, 'pierce', '穿透攻击');
        this.pierceCount = 3;
    }
}

class Bow extends Weapon {
    constructor() {
        super('弓箭', 12, 250, 300, 'projectile', '远程攻击');
    }
}

class Wand extends Weapon {
    constructor() {
        super('魔杖', 8, 300, 150, 'bounce', '弹射攻击');
        this.bounceCount = 3;
    }
}

/**
 * WeaponFactory - 武器工厂
 */
const WeaponFactory = {
    weapons: {
        'shortsword': { name: '短剑', desc: '快速单体攻击', class: ShortSword },
        'battleaxe': { name: '战斧', desc: '范围AOE攻击', class: BattleAxe },
        'staff': { name: '法杖', desc: '穿透攻击', class: Staff },
        'bow': { name: '弓箭', desc: '远程攻击', class: Bow },
        'wand': { name: '魔杖', desc: '弹射攻击', class: Wand }
    },

    create(type) {
        const weaponInfo = this.weapons[type];
        return weaponInfo ? new weaponInfo.class() : new ShortSword();
    },

    getInfo(type) {
        return this.weapons[type] || this.weapons['shortsword'];
    }
};

// ==================== 敌人系统 ====================

/**
 * Enemy - 敌人基类
 */
class Enemy {
    constructor(scene, type, hp, damage, timeoutThreshold) {
        this.scene = scene;
        this.type = type;
        this.hp = hp;
        this.maxHp = hp;
        this.damage = damage;
        this.timeoutThreshold = timeoutThreshold;
        this.spawnTime = scene.time.now;
        this.sprite = null;
        this.hpBar = null;
        this.hpBarBg = null;
        this.iconText = null;
        this.alive = true;
    }

    reset(hp, damage, timeoutThreshold) {
        this.hp = hp;
        this.maxHp = hp;
        this.damage = damage;
        this.timeoutThreshold = timeoutThreshold;
        this.spawnTime = this.scene.time.now;
        this.alive = true;
    }

    spawn(x, y) {
        const colors = {
            'slime': 0x00ff00,
            'bat': 0xff00ff,
            'skeleton': 0xffffff,
            'ghost': 0x00ffff,
            'gargoyle': 0x888888
        };

        // 敌人图标
        const icons = {
            'slime': '🟢',
            'bat': '🦇',
            'skeleton': '💀',
            'ghost': '👻',
            'gargoyle': '🗿'
        };

        const color = colors[this.type] || 0xff0000;
        const size = this.type === 'gargoyle' ? 40 : 32;
        const icon = icons[this.type] || '👾';

        this.sprite = this.scene.add.rectangle(x, y, size, size, color);
        this.sprite.setData('enemy', this);

        // 敌人图标
        this.iconText = this.scene.add.text(x, y, icon, {
            fontSize: size + 'px'
        }).setOrigin(0.5).setDepth(1);

        // 血条背景
        this.hpBarBg = this.scene.add.rectangle(x, y - size/2 - 8, size, 4, 0x333333);
        // 血条
        this.hpBar = this.scene.add.rectangle(x, y - size/2 - 8, size, 4, 0xff0000);
        this.hpBar.setOrigin(0.5, 0.5);

        return this;
    }

    update(time) {
        if (!this.alive) return 0;

        const elapsed = (time - this.spawnTime) / 1000;
        if (elapsed > this.timeoutThreshold) {
            const overtime = elapsed - this.timeoutThreshold;
            return Math.floor(overtime * this.damage);
        }
        return 0;
    }

    takeDamage(amount) {
        if (!this.alive) return false;

        this.hp -= amount;
        this.updateHPBar();

        // 受伤闪烁
        if (this.sprite) {
            this.scene.tweens.add({
                targets: this.sprite,
                alpha: 0.3,
                duration: 50,
                yoyo: true
            });
        }

        if (this.hp <= 0) {
            this.die();
            return true;
        }
        return false;
    }

    updateHPBar() {
        if (this.hpBar && this.sprite) {
            const ratio = Math.max(0, this.hp / this.maxHp);
            this.hpBar.setScale(ratio, 1);
            this.hpBar.x = this.sprite.x - (this.sprite.width * (1 - ratio)) / 2;
            this.iconText.x = this.sprite.x;
            this.iconText.y = this.sprite.y;
        }
    }

    die() {
        this.alive = false;
        const gold = this.getDropGold();
        const exp = this.getDropExp();
        this.scene.onEnemyKilled(this, gold, exp);

        // 死亡特效
        if (this.sprite) {
            this.scene.tweens.add({
                targets: [this.sprite, this.iconText, this.hpBar, this.hpBarBg],
                alpha: 0,
                scale: 0,
                duration: 200,
                onComplete: () => {
                    this.sprite.setAlpha(1);
                    this.sprite.setScale(1);
                    if (this.iconText) {
                        this.iconText.setAlpha(1);
                        this.iconText.setScale(1);
                    }
                    if (this.hpBar) {
                        this.hpBar.setAlpha(1);
                        this.hpBar.setScale(1);
                    }
                    if (this.hpBarBg) {
                        this.hpBarBg.setAlpha(1);
                        this.hpBarBg.setScale(1);
                    }
                    this.scene.enemyManager.returnToPool(this);
                }
            });
        }
    }

    getDropGold() {
        const ranges = {
            'slime': [5, 10],
            'bat': [3, 8],
            'skeleton': [8, 15],
            'ghost': [10, 20],
            'gargoyle': [15, 30]
        };
        const [min, max] = ranges[this.type] || [5, 10];
        return Phaser.Math.Between(min, max);
    }

    getDropExp() {
        return Math.floor(this.maxHp / 2);
    }

    destroy() {
        if (this.sprite) this.sprite.destroy();
        if (this.iconText) this.iconText.destroy();
        if (this.hpBar) this.hpBar.destroy();
        if (this.hpBarBg) this.hpBarBg.destroy();
    }
}

/**
 * Boss - Boss敌人
 */
class Boss {
    constructor(scene, type, hp, damage) {
        this.scene = scene;
        this.type = type;
        this.hp = hp;
        this.maxHp = hp;
        this.damage = damage;
        this.sprite = null;
        this.hpBar = null;
        this.alive = true;
    }

    spawn() {
        const colors = {
            'goblinKing': 0x8B4513,
            'skeletonLord': 0x666666,
            'shadowDragon': 0x4B0082,
            'demonLord': 0x8B0000
        };

        const color = colors[this.type] || 0xff0000;

        this.sprite = this.scene.add.rectangle(
            GAME_WIDTH / 2, GAME_HEIGHT / 2,
            80, 80, color
        );
        this.sprite.setData('boss', this);

        // Boss血条
        this.hpBarBg = this.scene.add.rectangle(GAME_WIDTH / 2, 80, 300, 10, 0x333333);
        this.hpBar = this.scene.add.rectangle(GAME_WIDTH / 2, 80, 300, 10, 0xff0000);
        this.hpBar.setOrigin(0.5, 0.5);

        // Boss名称
        const names = {
            'goblinKing': '哥布林王',
            'skeletonLord': '骷髅领主',
            'shadowDragon': '暗影龙',
            'demonLord': '深渊魔王'
        };
        this.nameText = this.scene.add.text(GAME_WIDTH / 2, 60, names[this.type] || 'Boss', {
            fontSize: '24px',
            fontFamily: 'Courier New',
            color: '#ff6600'
        }).setOrigin(0.5);

        return this;
    }

    takeDamage(amount) {
        if (!this.alive) return false;

        this.hp -= amount;
        this.updateHPBar();

        if (this.sprite) {
            this.scene.tweens.add({
                targets: this.sprite,
                alpha: 0.5,
                duration: 50,
                yoyo: true
            });
        }

        if (this.hp <= 0) {
            this.die();
            return true;
        }
        return false;
    }

    updateHPBar() {
        if (this.hpBar) {
            const ratio = Math.max(0, this.hp / this.maxHp);
            this.hpBar.setScale(ratio, 1);
        }
    }

    die() {
        this.alive = false;
        this.scene.onBossDefeated();

        // 死亡特效
        this.scene.tweens.add({
            targets: [this.sprite, this.hpBar, this.hpBarBg, this.nameText],
            alpha: 0,
            scale: 2,
            duration: 500,
            onComplete: () => this.destroy()
        });
    }

    destroy() {
        if (this.sprite) this.sprite.destroy();
        if (this.hpBar) this.hpBar.destroy();
        if (this.hpBarBg) this.hpBarBg.destroy();
        if (this.nameText) this.nameText.destroy();
    }
}

/**
 * EnemyManager - 敌人管理器
 */
class EnemyManager {
    constructor(scene) {
        this.scene = scene;
        this.enemies = [];
        this.pool = [];
        this.spawnTimer = 0;
        this.spawnInterval = 2000;
        this.maxEnemies = 15;
    }

    getEnemyFromPool(type) {
        for (let i = 0; i < this.pool.length; i++) {
            if (!this.pool[i].alive && this.pool[i].type === type) {
                return this.pool[i];
            }
        }
        return null;
    }

    returnToPool(enemy) {
        enemy.alive = false;
        if (enemy.sprite) enemy.sprite.setVisible(false);
        if (enemy.iconText) enemy.iconText.setVisible(false);
        if (enemy.hpBar) enemy.hpBar.setVisible(false);
        if (enemy.hpBarBg) enemy.hpBarBg.setVisible(false);
    }

    update(time, delta) {
        // 生成新敌人
        this.spawnTimer += delta;
        if (this.spawnTimer >= this.spawnInterval && this.enemies.length < this.maxEnemies) {
            this.spawnTimer = 0;
            this.spawnEnemy();
        }

        // 玩家位置
        const playerX = GAME_WIDTH / 2;
        const playerY = GAME_HEIGHT / 2;

        // 更新所有敌人（移动和超时检测）
        const damages = [];
        this.enemies.forEach(enemy => {
            if (enemy.alive) {
                // 移动敌人向玩家
                this.moveEnemy(enemy, playerX, playerY, delta);

                const damage = enemy.update(time);
                if (damage > 0) {
                    damages.push({ enemy, damage });
                }
            }
        });

        // 处理超时伤害
        damages.forEach(({ enemy, damage }) => {
            this.scene.onTimeoutDamage(enemy, damage);
        });

        // 清理死亡敌人
        this.enemies = this.enemies.filter(e => e.alive);
    }

    spawnEnemy() {
        const types = ['slime', 'bat', 'skeleton', 'ghost', 'gargoyle'];
        const weights = [40, 30, 15, 10, 5];

        const time = this.scene.runtime.survivalTime;
        if (time > 120) {
            weights = [30, 25, 20, 15, 10];
        }
        if (time > 300) {
            weights = [20, 20, 25, 20, 15];
        }

        const type = this.weightedRandom(types, weights);
        const stats = this.getEnemyStats(type);
        const pos = this.getRandomSpawnPosition();

        let enemy = this.getEnemyFromPool(type);
        if (enemy) {
            enemy.reset(...stats);
            enemy.spawn(pos.x, pos.y);
            enemy.sprite.setVisible(true);
            enemy.iconText.setVisible(true);
            enemy.hpBar.setVisible(true);
            enemy.hpBarBg.setVisible(true);
        } else {
            enemy = new Enemy(this.scene, type, ...stats);
            enemy.spawn(pos.x, pos.y);
            this.pool.push(enemy);
        }
        this.enemies.push(enemy);
    }

    weightedRandom(items, weights) {
        const total = weights.reduce((a, b) => a + b, 0);
        let random = Phaser.Math.Between(1, total);
        
        for (let i = 0; i < items.length; i++) {
            random -= weights[i];
            if (random <= 0) return items[i];
        }
        return items[0];
    }

    getEnemyStats(type) {
        const difficulty = 1 + (this.scene.runtime.survivalTime / 60) * 0.1;
        const baseStats = {
            'slime':    [25, 5, 6],    // 降低HP和超时阈值
            'bat':      [15, 3, 5],
            'skeleton': [40, 8, 8],
            'ghost':    [35, 6, 6],
            'gargoyle': [70, 10, 12]
        };
        const base = baseStats[type] || baseStats['slime'];
        return base.map(v => Math.floor(v * difficulty));
    }

    moveEnemy(enemy, targetX, targetY, delta) {
        if (!enemy.sprite) return;

        // 敌人速度（像素/秒）
        const speeds = {
            'slime': 30,
            'bat': 60,
            'skeleton': 40,
            'ghost': 50,
            'gargoyle': 25
        };
        const speed = speeds[enemy.type] || 30;

        // 计算方向
        const dx = targetX - enemy.sprite.x;
        const dy = targetY - enemy.sprite.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // 如果距离大于50像素，继续移动
        if (distance > 50) {
            const moveX = (dx / distance) * speed * (delta / 1000);
            const moveY = (dy / distance) * speed * (delta / 1000);

            enemy.sprite.x += moveX;
            enemy.sprite.y += moveY;

            // 更新血条和图标位置
            enemy.updateHPBar();
        }
    }

    getRandomSpawnPosition() {
        const w = GAME_WIDTH;
        const h = GAME_HEIGHT;
        const margin = 50;
        
        const side = Phaser.Math.Between(0, 3);
        switch (side) {
            case 0: return { x: Phaser.Math.Between(margin, w - margin), y: -32 };
            case 1: return { x: w + 32, y: Phaser.Math.Between(margin, h - margin) };
            case 2: return { x: Phaser.Math.Between(margin, w - margin), y: h + 32 };
            case 3: return { x: -32, y: Phaser.Math.Between(margin, h - margin) };
        }
    }

    getEnemyAt(x, y, range) {
        return this.enemies.find(e => {
            if (!e.alive || !e.sprite) return false;
            const dist = Phaser.Math.Distance.Between(x, y, e.sprite.x, e.sprite.y);
            return dist <= range;
        });
    }

    getEnemiesInRange(x, y, range) {
        return this.enemies.filter(e => {
            if (!e.alive || !e.sprite) return false;
            const dist = Phaser.Math.Distance.Between(x, y, e.sprite.x, e.sprite.y);
            return dist <= range;
        });
    }

    getEnemiesInLine(x, y, targetX, targetY, width) {
        return this.enemies.filter(e => {
            if (!e.alive || !e.sprite) return false;
            // 简化的线段检测
            const dx = targetX - x;
            const dy = targetY - y;
            const len = Math.sqrt(dx * dx + dy * dy);
            if (len === 0) return false;
            
            const nx = dx / len;
            const ny = dy / len;
            
            const ex = e.sprite.x - x;
            const ey = e.sprite.y - y;
            
            const proj = ex * nx + ey * ny;
            if (proj < 0 || proj > len) return false;
            
            const perpDist = Math.abs(ex * ny - ey * nx);
            return perpDist <= width;
        });
    }

    clear() {
        this.enemies.forEach(e => e.destroy());
        this.enemies = [];
    }
}

/**
 * BossManager - Boss管理器
 */
class BossManager {
    constructor(scene) {
        this.scene = scene;
        this.currentBoss = null;
        this.bossSchedule = [45, 90, 150, 240, 360];  // 更早出现Boss
        this.bossIndex = 0;
        this.bossActive = false;
    }

    update(time, delta) {
        if (this.bossActive) return;

        const targetTime = this.bossSchedule[this.bossIndex];
        if (this.scene.runtime.survivalTime >= targetTime) {
            this.spawnBoss();
            this.bossIndex++;
            this.bossActive = true;
        }
    }

    spawnBoss() {
        const bossTypes = ['goblinKing', 'skeletonLord', 'shadowDragon', 'demonLord'];
        const type = bossTypes[Math.min(this.bossIndex - 1, bossTypes.length - 1)];

        const stats = this.getBossStats(type);
        this.currentBoss = new Boss(this.scene, type, ...stats);
        this.currentBoss.spawn();

        // Boss警告
        this.scene.hud.showBossWarning();
    }

    getBossStats(type) {
        const difficulty = 1 + this.bossIndex * 0.2;
        const baseStats = {
            'goblinKing':   [300, 15],
            'skeletonLord': [500, 20],
            'shadowDragon': [800, 30],
            'demonLord':    [1200, 40]
        };
        const base = baseStats[type] || baseStats['goblinKing'];
        return base.map(v => Math.floor(v * difficulty));
    }

    onBossDefeated() {
        this.bossActive = false;
        this.currentBoss = null;
    }

    clear() {
        if (this.currentBoss) {
            this.currentBoss.destroy();
            this.currentBoss = null;
        }
        this.bossActive = false;
    }
}

// ==================== 随从系统 ====================

/**
 * Minion - 随从基类
 */
class Minion {
    constructor(name, effect, description) {
        this.name = name;
        this.effect = effect;
        this.description = description;
        this.lastAction = 0;
        this.actionInterval = 5000; // 5秒
    }

    canAct(time) {
        return time - this.lastAction >= this.actionInterval;
    }

    update(time, delta, scene) {
        // 子类实现
    }
}

/**
 * LightElf - 光明精灵（回血）
 */
class LightElf extends Minion {
    constructor() {
        super('光明精灵', 'heal', '每5秒回复5%HP');
        this.healPercent = 0.05;
    }

    update(time, delta, scene) {
        if (this.canAct(time)) {
            this.lastAction = time;
            const healAmount = Math.floor(scene.runtime.maxHp * this.healPercent);
            const minionBonus = 1 + scene.runtime.specializations.minion * 0.1;
            const finalHeal = Math.floor(healAmount * minionBonus);
            
            scene.runtime.hp = Math.min(scene.runtime.hp + finalHeal, scene.runtime.maxHp);
            scene.showHealEffect();
        }
    }
}

/**
 * SkeletonWarrior - 骷髅战士（攻击）
 */
class SkeletonWarrior extends Minion {
    constructor() {
        super('骷髅战士', 'attack', '自动攻击敌人');
        this.attackInterval = 2000;
    }

    update(time, delta, scene) {
        if (this.canAct(time)) {
            this.lastAction = time;
            const baseDamage = scene.runtime.weapon.getDamage(scene.runtime.weaponLevel, scene.runtime.specializations);
            const minionBonus = 1 + scene.runtime.specializations.minion * 0.1;
            const damage = Math.floor(baseDamage * 0.3 * minionBonus);

            // 攻击最近的敌人
            const enemy = scene.enemyManager.getEnemyAt(GAME_WIDTH/2, GAME_HEIGHT/2, 300);
            if (enemy) {
                enemy.takeDamage(damage);
                scene.showMinionAttackEffect(enemy.sprite.x, enemy.sprite.y);
            }
        }
    }
}

/**
 * MinionFactory - 随从工厂
 */
const MinionFactory = {
    minions: {
        'lightElf': { name: '光明精灵', desc: '每5秒回复5%HP', class: LightElf, unlock: '击败第3个Boss' },
        'skeletonWarrior': { name: '骷髅战士', desc: '自动攻击敌人', class: SkeletonWarrior, unlock: '累计存活10分钟' }
    },

    create(type) {
        const minionInfo = this.minions[type];
        return minionInfo ? new minionInfo.class() : null;
    }
};

// ==================== UI系统 ====================

/**
 * HUD - 游戏抬头显示
 */
class HUD {
    constructor(scene) {
        this.scene = scene;
        this.elements = {};
        this.create();
    }

    create() {
        const style = { fontFamily: 'Courier New', fontSize: '16px' };

        // HP条
        this.elements.hpBg = this.scene.add.rectangle(110, 25, 200, 20, 0x333333);
        this.elements.hpBar = this.scene.add.rectangle(110, 25, 200, 20, 0xff0000);
        this.elements.hpBar.setOrigin(0.5, 0.5);
        this.elements.hpText = this.scene.add.text(110, 25, 'HP: 100/100', { ...style, color: '#ffffff' }).setOrigin(0.5);

        // 经验条
        this.elements.expBg = this.scene.add.rectangle(110, 50, 200, 12, 0x333333);
        this.elements.expBar = this.scene.add.rectangle(110, 50, 200, 12, 0x00ff00);
        this.elements.expBar.setOrigin(0.5, 0.5);
        this.elements.levelText = this.scene.add.text(110, 50, 'Lv.1', { ...style, fontSize: '12px', color: '#ffffff' }).setOrigin(0.5);

        // 金币
        this.elements.goldText = this.scene.add.text(GAME_WIDTH - 150, 20, '金币: 0', { ...style, color: '#ffd700' });

        // 专精点
        this.elements.specText = this.scene.add.text(GAME_WIDTH - 150, 45, '专精点: 0', { ...style, color: '#00ffff' });

        // 武器
        this.elements.weaponText = this.scene.add.text(GAME_WIDTH - 150, 70, '武器: -', { ...style, fontSize: '14px', color: '#ffffff' });

        // 随从
        this.elements.minionText = this.scene.add.text(GAME_WIDTH - 150, 95, '随从: 无', { ...style, fontSize: '14px', color: '#aaaaaa' });

        // 计时器
        this.elements.timeText = this.scene.add.text(GAME_WIDTH / 2, 20, '00:00', { ...style, fontSize: '20px', color: '#ffffff' }).setOrigin(0.5);

        // Boss倒计时
        this.elements.bossText = this.scene.add.text(GAME_WIDTH / 2, 45, 'Boss: --', { ...style, fontSize: '16px', color: '#ff6600' }).setOrigin(0.5);

        // 击杀数
        this.elements.killText = this.scene.add.text(20, GAME_HEIGHT - 30, '击杀: 0', { ...style, fontSize: '14px', color: '#888888' });

        // 专精面板（显示当前专精等级）
        this.elements.specPanelBg = this.scene.add.rectangle(20, GAME_HEIGHT - 100, 150, 60, 0x333333, 0.7);
        this.elements.specPanelBg.setOrigin(0, 0.5);
        this.elements.specPanelTitle = this.scene.add.text(25, GAME_HEIGHT - 115, '专精', { ...style, fontSize: '12px', color: '#ffffff' });
        this.elements.specPanelContent = this.scene.add.text(25, GAME_HEIGHT - 95, '', { ...style, fontSize: '10px', color: '#00ffff' });

        // 暂停按钮
        this.elements.pauseBtn = this.scene.add.text(GAME_WIDTH - 30, GAME_HEIGHT - 30, '⏸️', {
            fontSize: '24px'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.elements.pauseBtn.on('pointerdown', () => this.scene.togglePause());

        // 音量按钮
        this.elements.volumeBtn = this.scene.add.text(GAME_WIDTH - 70, GAME_HEIGHT - 30, '🔊', {
            fontSize: '24px'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        this.elements.volumeBtn.on('pointerdown', () => this.scene.toggleVolume());
    }

    update(runtime) {
        // HP
        const hpRatio = Math.max(0, runtime.hp / runtime.maxHp);
        this.elements.hpBar.setScale(hpRatio, 1);
        this.elements.hpText.setText(`HP: ${Math.floor(runtime.hp)}/${runtime.maxHp}`);

        // 经验
        const expRatio = Math.max(0, runtime.exp / runtime.expToNext);
        this.elements.expBar.setScale(expRatio, 1);
        this.elements.levelText.setText(`Lv.${runtime.level}`);

        // 信息
        this.elements.goldText.setText(`金币: ${runtime.gold}`);
        this.elements.specText.setText(`专精点: ${runtime.specializationPoints}`);
        this.elements.weaponText.setText(`武器: ${runtime.weapon?.name || '-'} Lv.${runtime.weaponLevel}`);
        this.elements.minionText.setText(`随从: ${runtime.minion?.name || '无'}`);

        // 计时
        const mins = Math.floor(runtime.survivalTime / 60);
        const secs = Math.floor(runtime.survivalTime % 60);
        this.elements.timeText.setText(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);

        // Boss倒计时
        if (!this.scene.bossManager.bossActive) {
            const nextBossTime = this.scene.bossManager.bossSchedule[this.scene.bossManager.bossIndex];
            const remaining = Math.max(0, nextBossTime - runtime.survivalTime);
            this.elements.bossText.setText(`Boss: ${Math.floor(remaining)}s`);
        } else {
            this.elements.bossText.setText('⚔️ BOSS战 ⚔️');
        }

        // 击杀
        this.elements.killText.setText(`击杀: ${runtime.killCount}`);

        // 更新专精面板
        this.updateSpecPanel(runtime);
    }

    updateSpecPanel(runtime) {
        const specs = runtime.specializations;
        const specIcons = {
            'attack': '⚔️',
            'crit': '💥',
            'attackSpeed': '⚡',
            'hp': '❤️',
            'armor': '🛡️',
            'gold': '💰',
            'exp': '✨',
            'minion': '👼'
        };

        // 显示最高的3个专精
        const sortedSpecs = Object.entries(specs)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);

        const content = sortedSpecs
            .map(([key, level]) => `${specIcons[key] || '•'}${key.slice(0,3)}:${level}`)
            .join(' ');

        this.elements.specPanelContent.setText(content);
    }

    showBossWarning() {
        // Boss警告音效
        if (this.scene.soundManager) {
            this.scene.soundManager.play('bossWarning');
        }

        // 警告文字
        this.elements.bossText.setColor('#ff0000');
        this.scene.tweens.add({
            targets: this.elements.bossText,
            scale: 1.5,
            duration: 200,
            yoyo: true,
            repeat: 2,
            onComplete: () => this.elements.bossText.setScale(1)
        });

        // 屏幕闪烁效果
        const overlay = this.scene.add.rectangle(
            GAME_WIDTH/2, GAME_HEIGHT/2,
            GAME_WIDTH, GAME_HEIGHT,
            0xff0000, 0.3
        ).setDepth(99);

        this.scene.tweens.add({
            targets: overlay,
            alpha: 0,
            duration: 1000,
            onComplete: () => overlay.destroy()
        });

        // 相机震动
        if (this.scene.cameras && this.scene.cameras.main) {
            this.scene.cameras.main.shake(500, 0.01);
        }
    }

    destroy() {
        Object.values(this.elements).forEach(e => e.destroy());
    }
}

/**
 * SpecializationUI - 专精选择界面
 */
class SpecializationUI {
    constructor(scene) {
        this.scene = scene;
        this.container = null;
        this.visible = false;
    }

    show() {
        if (this.visible) return;
        this.visible = true;

        const specs = this.getRandomSpecs(3);
        this.container = this.scene.add.container(0, 0).setDepth(100);

        // 背景
        const bg = this.scene.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.8);
        this.container.add(bg);

        // 标题
        const title = this.scene.add.text(GAME_WIDTH/2, 100, '选择专精', {
            fontFamily: 'Courier New',
            fontSize: '32px',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.container.add(title);

        // 卡牌
        specs.forEach((spec, i) => {
            const x = 200 + i * 200;
            const card = this.createCard(x, GAME_HEIGHT/2, spec);
            this.container.add(card);
        });
    }

    createCard(x, y, spec) {
        const container = this.scene.add.container(x, y);

        // 根据专精类型设置颜色
        const colors = {
            'attack': 0xff6600,
            'crit': 0xff0000,
            'attackSpeed': 0xffff00,
            'hp': 0x00ff00,
            'armor': 0x0088ff,
            'gold': 0xffd700,
            'exp': 0x00ffff,
            'minion': 0xff00ff
        };
        const color = colors[spec.key] || 0x4a4a6a;

        const bg = this.scene.add.rectangle(0, 0, 150, 220, color);
        bg.setInteractive({ useHandCursor: true });
        bg.on('pointerover', () => bg.setFillStyle(color + 0x202020));
        bg.on('pointerout', () => bg.setFillStyle(color));
        bg.on('pointerdown', () => this.select(spec.key));

        // 专精图标
        const icon = this.scene.add.text(0, -80, spec.icon, {
            fontSize: '40px'
        }).setOrigin(0.5);

        const name = this.scene.add.text(0, -30, spec.name, {
            fontFamily: 'Courier New',
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const currentLevel = this.scene.runtime.specializations[spec.key];
        const level = this.scene.add.text(0, 0, `当前: Lv.${currentLevel}`, {
            fontFamily: 'Courier New',
            fontSize: '14px',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        const desc = this.scene.add.text(0, 40, spec.description, {
            fontFamily: 'Courier New',
            fontSize: '12px',
            color: '#00ff00',
            align: 'center',
            wordWrap: { width: 130 }
        }).setOrigin(0.5);

        // 显示升级后效果
        const nextBonus = this.getNextBonus(spec.key, currentLevel);
        const bonusText = this.scene.add.text(0, 80, `升级后: ${nextBonus}`, {
            fontFamily: 'Courier New',
            fontSize: '11px',
            color: '#ffff00'
        }).setOrigin(0.5);

        container.add(bg);
        container.add(icon);
        container.add(name);
        container.add(level);
        container.add(desc);
        container.add(bonusText);
        return container;
    }

    getNextBonus(key, currentLevel) {
        const bonuses = {
            'attack': `伤害 ${(currentLevel + 1) * 5}%`,
            'crit': `暴击 ${(currentLevel + 1) * 2}%`,
            'attackSpeed': `攻速 ${(currentLevel + 1) * 3}%`,
            'hp': `HP +${(currentLevel + 1) * 10}`,
            'armor': `减伤 ${(currentLevel + 1) * 2}%`,
            'gold': `金币 ${(currentLevel + 1) * 10}%`,
            'exp': `经验 ${(currentLevel + 1) * 5}%`,
            'minion': `随从 ${(currentLevel + 1) * 10}%`
        };
        return bonuses[key] || '+1';
    }

    getRandomSpecs(count) {
        const allSpecs = [
            { key: 'attack', name: '攻击专精', icon: '⚔️', description: '+5% 伤害' },
            { key: 'crit', name: '暴击专精', icon: '💥', description: '+2% 暴击率' },
            { key: 'attackSpeed', name: '攻速专精', icon: '⚡', description: '-3% 攻击间隔' },
            { key: 'hp', name: '生命专精', icon: '❤️', description: '+10 最大HP' },
            { key: 'armor', name: '护甲专精', icon: '🛡️', description: '+2% 减伤' },
            { key: 'gold', name: '金币专精', icon: '💰', description: '+10% 金币' },
            { key: 'exp', name: '经验专精', icon: '✨', description: '+5% 经验' },
            { key: 'minion', name: '随从专精', icon: '👼', description: '+10% 随从效果' }
        ];

        const result = [];
        const shuffled = Phaser.Utils.Array.Shuffle(allSpecs);
        for (let i = 0; i < count && i < shuffled.length; i++) {
            result.push(shuffled[i]);
        }
        return result;
    }

    select(key) {
        this.scene.onSpecSelect(key);
        this.close();
    }

    close() {
        if (this.container) {
            this.container.destroy();
            this.container = null;
        }
        this.visible = false;
    }
}

/**
 * RewardUI - Boss奖励界面
 */
class RewardUI {
    constructor(scene) {
        this.scene = scene;
        this.container = null;
        this.visible = false;
        this.rewards = [];
    }

    show() {
        if (this.visible) return;
        this.visible = true;

        this.rewards = this.generateRewards();
        this.container = this.scene.add.container(0, 0).setDepth(100);

        // 背景
        const bg = this.scene.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.85);
        this.container.add(bg);

        // 标题
        const title = this.scene.add.text(GAME_WIDTH/2, 80, '🎁 选择奖励 🎁', {
            fontFamily: 'Courier New',
            fontSize: '36px',
            color: '#ffd700'
        }).setOrigin(0.5);
        this.container.add(title);

        // 武器升级选项
        const upgradeY = 160;
        const upgradeBg = this.scene.add.rectangle(GAME_WIDTH/2, upgradeY, 200, 50, 0x666666);
        upgradeBg.setInteractive({ useHandCursor: true });
        upgradeBg.on('pointerover', () => upgradeBg.setFillStyle(0x888888));
        upgradeBg.on('pointerout', () => upgradeBg.setFillStyle(0x666666));
        upgradeBg.on('pointerdown', () => this.select('weapon_upgrade'));

        const upgradeText = this.scene.add.text(GAME_WIDTH/2, upgradeY, '武器升级 +1', {
            fontFamily: 'Courier New',
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.container.add([upgradeBg, upgradeText]);

        // 奖励卡牌
        this.rewards.forEach((reward, i) => {
            const x = 200 + i * 200;
            const card = this.createRewardCard(x, GAME_HEIGHT/2 + 50, reward, i);
            this.container.add(card);
        });
    }

    generateRewards() {
        const rewards = [];
        const rarity = this.rollRarity();

        const pool = {
            common: [
                { icon: '💰', name: '金币', effect: '+50~100', type: 'gold', value: [50, 100] },
                { icon: '✨', name: '经验', effect: '+50~100', type: 'exp', value: [50, 100] },
                { icon: '⚔️', name: '攻击专精', effect: '+1级', type: 'spec', key: 'attack' },
                { icon: '❤️', name: '生命专精', effect: '+1级', type: 'spec', key: 'hp' },
                { icon: '💵', name: '金币专精', effect: '+1级', type: 'spec', key: 'gold' }
            ],
            rare: [
                { icon: '💥', name: '暴击专精', effect: '+1级', type: 'spec', key: 'crit' },
                { icon: '🛡️', name: '护甲专精', effect: '+1级', type: 'spec', key: 'armor' },
                { icon: '📚', name: '经验专精', effect: '+1级', type: 'spec', key: 'exp' },
                { icon: '👼', name: '随从专精', effect: '+1级', type: 'spec', key: 'minion' }
            ],
            epic: [
                { icon: '🌟', name: '全专精+1', effect: '所有+1', type: 'allSpec' },
                { icon: '💪', name: '最大HP+20', effect: '+20HP', type: 'maxHp', value: 20 }
            ]
        };

        // 检查随从解锁
        const data = GameData.load();
        if (data.unlockedMinions.length > 0 && !this.scene.runtime.minion) {
            const minionType = Phaser.Utils.Array.GetRandom(data.unlockedMinions);
            const minionInfo = MinionFactory.minions[minionType];
            if (minionInfo) {
                pool.epic.push({
                    icon: '👻',
                    name: minionInfo.name,
                    effect: minionInfo.desc,
                    type: 'minion',
                    minionType: minionType
                });
            }
        }

        const selectedPool = pool[rarity] || pool.common;
        const result = [];
        const shuffled = Phaser.Utils.Array.Shuffle(selectedPool);
        for (let i = 0; i < 3 && i < shuffled.length; i++) {
            result.push(shuffled[i]);
        }
        return result;
    }

    rollRarity() {
        const roll = Math.random();
        if (roll < 0.05) return 'epic';
        if (roll < 0.30) return 'rare';
        return 'common';
    }

    createRewardCard(x, y, reward, index) {
        const container = this.scene.add.container(x, y);

        const colors = { common: 0x888888, rare: 0x4444ff, epic: 0xff44ff };
        const color = colors[reward.rarity || 'common'];

        const bg = this.scene.add.rectangle(0, 0, 150, 180, color);
        bg.setInteractive({ useHandCursor: true });
        bg.on('pointerover', () => bg.setFillStyle(color + 0x202020));
        bg.on('pointerout', () => bg.setFillStyle(color));
        bg.on('pointerdown', () => this.select(`reward_${index}`));

        const icon = this.scene.add.text(0, -50, reward.icon, { fontSize: '40px' }).setOrigin(0.5);
        const name = this.scene.add.text(0, 10, reward.name, {
            fontFamily: 'Courier New',
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);
        const effect = this.scene.add.text(0, 50, reward.effect, {
            fontFamily: 'Courier New',
            fontSize: '14px',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        container.add(bg);
        container.add(icon);
        container.add(name);
        container.add(effect);
        return container;
    }

    select(choice) {
        this.scene.onRewardSelect(choice, this.rewards);
        this.close();
    }

    close() {
        if (this.container) {
            this.container.destroy();
            this.container = null;
        }
        this.visible = false;
        this.rewards = [];
    }
}

// ==================== 场景 ====================

/**
 * BootScene - 启动场景
 */
class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    create() {
        this.scene.start('MenuScene');
    }
}

/**
 * MenuScene - 主菜单场景
 */
class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
        this.selectedWeapon = 'shortsword';
    }

    create() {
        // 背景
        this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x1a1a2e);

        // 标题
        this.add.text(GAME_WIDTH/2, 80, '像素地牢猎手', {
            fontFamily: 'Courier New',
            fontSize: '48px',
            color: '#ffd700',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);

        this.add.text(GAME_WIDTH/2, 130, 'PIXEL DUNGEON HUNTER', {
            fontFamily: 'Courier New',
            fontSize: '16px',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        // 历史数据
        const saveData = GameData.load();
        if (saveData.totalRuns > 0) {
            this.add.text(GAME_WIDTH/2, 180, `最佳时间: ${this.formatTime(saveData.bestTime)}`, {
                fontFamily: 'Courier New',
                fontSize: '20px',
                color: '#00ff00'
            }).setOrigin(0.5);

            this.add.text(GAME_WIDTH/2, 210, `游戏次数: ${saveData.totalRuns}`, {
                fontFamily: 'Courier New',
                fontSize: '16px',
                color: '#aaaaaa'
            }).setOrigin(0.5);

            this.add.text(GAME_WIDTH/2, 240, `累计金币: ${saveData.totalGold}`, {
                fontFamily: 'Courier New',
                fontSize: '16px',
                color: '#ffd700'
            }).setOrigin(0.5);
        }

        // 武器选择
        this.createWeaponSelect();

        // 开始按钮
        const startBtn = this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2 + 100, 200, 50, 0x4a4a6a);
        startBtn.setInteractive({ useHandCursor: true });
        startBtn.on('pointerover', () => startBtn.setFillStyle(0x6a6a8a));
        startBtn.on('pointerout', () => startBtn.setFillStyle(0x4a4a6a));
        startBtn.on('pointerdown', () => this.startGame());

        this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 100, '开始游戏', {
            fontFamily: 'Courier New',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // 说明
        this.add.text(GAME_WIDTH/2, GAME_HEIGHT - 50, '点击屏幕攻击敌人，击败Boss获得奖励', {
            fontFamily: 'Courier New',
            fontSize: '14px',
            color: '#888888'
        }).setOrigin(0.5);

        // 帮助按钮
        const helpBtn = this.add.text(GAME_WIDTH - 30, 20, '❓', {
            fontSize: '28px'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
        helpBtn.on('pointerdown', () => this.showTutorial());
    }

    showTutorial() {
        if (this.tutorialOverlay) return;

        this.tutorialOverlay = this.add.container(0, 0);

        // 背景
        const bg = this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.9);
        this.tutorialOverlay.add(bg);

        // 标题
        const title = this.add.text(GAME_WIDTH/2, 50, '📖 游戏教程', {
            fontFamily: 'Courier New',
            fontSize: '32px',
            color: '#ffd700'
        }).setOrigin(0.5);
        this.tutorialOverlay.add(title);

        // 教程内容
        const tutorials = [
            { icon: '👆', title: '点击攻击', desc: '点击屏幕任意位置攻击敌人' },
            { icon: '👾', title: '敌人', desc: '敌人会向玩家移动，超时会造成伤害' },
            { icon: '👹', title: 'Boss', desc: '击败Boss获得奖励选择机会' },
            { icon: '⬆️', title: '升级', desc: '获得经验升级，选择专精强化角色' },
            { icon: '⚔️', title: '武器', desc: 'Boss后可升级武器，最高5级' },
            { icon: '👼', title: '随从', desc: '解锁后可在奖励中获得随从帮助' },
            { icon: '⏸️', title: '暂停', desc: '点击暂停按钮暂停游戏' },
            { icon: '🔊', title: '音效', desc: '点击音量按钮开关音效' }
        ];

        tutorials.forEach((t, i) => {
            const y = 100 + i * 55;
            const row = this.add.container(GAME_WIDTH/2, y);

            const icon = this.add.text(-200, 0, t.icon, { fontSize: '24px' }).setOrigin(0.5);
            const titleText = this.add.text(-150, 0, t.title, {
                fontFamily: 'Courier New',
                fontSize: '18px',
                color: '#ffffff'
            }).setOrigin(0, 0.5);
            const descText = this.add.text(50, 0, t.desc, {
                fontFamily: 'Courier New',
                fontSize: '14px',
                color: '#aaaaaa'
            }).setOrigin(0, 0.5);

            row.add([icon, titleText, descText]);
            this.tutorialOverlay.add(row);
        });

        // 关闭按钮
        const closeBtn = this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT - 50, 150, 40, 0x4a4a6a);
        closeBtn.setInteractive({ useHandCursor: true });
        closeBtn.on('pointerover', () => closeBtn.setFillStyle(0x6a6a8a));
        closeBtn.on('pointerout', () => closeBtn.setFillStyle(0x4a4a6a));
        closeBtn.on('pointerdown', () => this.hideTutorial());

        const closeText = this.add.text(GAME_WIDTH/2, GAME_HEIGHT - 50, '关闭', {
            fontFamily: 'Courier New',
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.tutorialOverlay.add([closeBtn, closeText]);
    }

    hideTutorial() {
        if (this.tutorialOverlay) {
            this.tutorialOverlay.destroy();
            this.tutorialOverlay = null;
        }
    }

    createWeaponSelect() {
        const weapons = Object.keys(WeaponFactory.weapons);
        const startX = 150;
        const spacing = 130;

        this.add.text(GAME_WIDTH/2, 300, '选择初始武器', {
            fontFamily: 'Courier New',
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);

        this.weaponButtons = [];

        // 武器图标
        const weaponIcons = {
            'shortsword': '⚔️',
            'battleaxe': '🪓',
            'staff': '🔮',
            'bow': '🏹',
            'wand': '🪄'
        };

        weapons.forEach((type, i) => {
            const info = WeaponFactory.getInfo(type);
            const x = startX + i * spacing;
            const y = 380;

            const bg = this.add.rectangle(x, y, 110, 80, 
                type === this.selectedWeapon ? 0x6a6a8a : 0x4a4a6a);
            bg.setInteractive({ useHandCursor: true });
            bg.on('pointerover', () => bg.setFillStyle(0x6a6a8a));
            bg.on('pointerout', () => bg.setFillStyle(type === this.selectedWeapon ? 0x6a6a8a : 0x4a4a6a));
            bg.on('pointerdown', () => this.selectWeapon(type));

            // 武器图标
            this.add.text(x, y - 30, weaponIcons[type] || '⚔️', {
                fontSize: '28px'
            }).setOrigin(0.5);

            this.add.text(x, y + 5, info.name, {
                fontFamily: 'Courier New',
                fontSize: '14px',
                color: '#ffffff'
            }).setOrigin(0.5);

            this.add.text(x, y + 25, info.desc, {
                fontFamily: 'Courier New',
                fontSize: '10px',
                color: '#aaaaaa'
            }).setOrigin(0.5);

            this.weaponButtons.push({ type, bg });
        });
    }

    selectWeapon(type) {
        this.selectedWeapon = type;
        this.weaponButtons.forEach(btn => {
            btn.bg.setFillStyle(btn.type === type ? 0x6a6a8a : 0x4a4a6a);
        });
    }

    startGame() {
        this.scene.start('GameScene', { weapon: this.selectedWeapon });
    }

    formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
}

/**
 * GameScene - 主游戏场景
 */
class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    init(data) {
        this.selectedWeapon = data.weapon || 'shortsword';
        this.runtime = new RuntimeData();
        this.runtime.weapon = WeaponFactory.create(this.selectedWeapon);
        this.paused = false;
    }

    create() {
        // 像素风格背景
        this.createPixelBackground();

        // 玩家（像素风格角色）
        this.player = this.add.container(GAME_WIDTH/2, GAME_HEIGHT/2);
        this.playerSprite = this.add.sprite(0, 0, 'player');
        this.player.add(this.playerSprite);
        this.playerIcon = this.add.text(0, 0, '🧙', { fontSize: '40px' }).setOrigin(0.5);
        this.player.add(this.playerIcon);

        // 玩家光晕效果
        const glow = this.add.circle(0, 0, 30, 0x4488ff, 0.2);
        this.player.add(glow);
        this.tweens.add({
            targets: glow,
            alpha: [0.1, 0.3, 0.1],
            duration: 2000,
            repeat: -1
        });

        // 管理器
        this.enemyManager = new EnemyManager(this);
        this.bossManager = new BossManager(this);

        // 粒子效果
        this.particleManager = new ParticleManager(this);

        // 音效
        this.soundManager = new SoundManager(this);

        // UI
        this.hud = new HUD(this);
        this.specUI = new SpecializationUI(this);
        this.rewardUI = new RewardUI(this);

        // 输入
        this.input.on('pointerdown', (pointer) => {
            if (!this.paused) {
                this.onClick(pointer.x, pointer.y);
            }
        });

        // 时间
        this.lastTime = this.time.now;
    }

    update(time) {
        if (this.paused) return;

        const delta = time - this.lastTime;
        this.lastTime = time;

        // 更新存活时间
        this.runtime.survivalTime += delta / 1000;

        // 更新敌人
        this.enemyManager.update(time, delta);

        // 更新Boss
        if (!this.rewardUI.visible) {
            this.bossManager.update(time, delta);
        }

        // 更新随从
        if (this.runtime.minion) {
            this.runtime.minion.update(time, delta, this);
        }

        // 更新HUD
        this.hud.update(this.runtime);

        // 检测游戏结束
        if (this.runtime.hp <= 0) {
            this.gameOver();
        }
    }

    onClick(x, y) {
        const weapon = this.runtime.weapon;
        const time = this.time.now;

        // 攻速专精调整
        const speedBonus = 1 - this.runtime.specializations.attackSpeed * 0.03;
        const adjustedSpeed = Math.floor(weapon.attackSpeed * speedBonus);

        if (time - weapon.lastAttack < adjustedSpeed) return;

        weapon.lastAttack = time;

        // 攻击音效
        const weaponType = this.selectedWeapon || 'shortsword';
        const attackSound = `attack_${weaponType}`;
        this.soundManager.play(attackSound);

        const damage = weapon.getDamage(this.runtime.weaponLevel, this.runtime.specializations);

        // 暴击检测
        const critChance = this.runtime.specializations.crit * 0.02;
        const isCrit = Math.random() < critChance;
        const finalDamage = isCrit ? Math.floor(damage * 2) : damage;

        // 根据武器类型攻击
        let hit = false;

        switch (weapon.type) {
            case 'single':
                hit = this.attackSingle(x, y, weapon.range, finalDamage);
                break;
            case 'aoe':
                hit = this.attackAOE(x, y, weapon.range, finalDamage);
                break;
            case 'pierce':
                hit = this.attackPierce(x, y, weapon.range, finalDamage);
                break;
            case 'projectile':
                hit = this.attackProjectile(x, y, weapon.range, finalDamage);
                break;
            case 'bounce':
                hit = this.attackBounce(x, y, weapon.range, finalDamage);
                break;
        }

        // 攻击特效
        this.showAttackEffect(x, y, weapon.type, hit, isCrit);
    }

    attackSingle(x, y, range, damage) {
        const enemy = this.enemyManager.getEnemyAt(x, y, range);
        if (enemy) {
            enemy.takeDamage(damage);
            this.showDamageNumber(enemy.sprite.x, enemy.sprite.y, damage, false);
            return true;
        }

        // 检查Boss
        if (this.bossManager.currentBoss && this.bossManager.currentBoss.alive) {
            const boss = this.bossManager.currentBoss;
            const dist = Phaser.Math.Distance.Between(x, y, boss.sprite.x, boss.sprite.y);
            if (dist <= range) {
                boss.takeDamage(damage);
                this.showDamageNumber(boss.sprite.x, boss.sprite.y, damage, false);
                return true;
            }
        }

        return false;
    }

    attackAOE(x, y, range, damage) {
        const enemies = this.enemyManager.getEnemiesInRange(x, y, range);
        enemies.forEach(e => {
            e.takeDamage(damage);
            this.showDamageNumber(e.sprite.x, e.sprite.y, damage, false);
        });

        if (this.bossManager.currentBoss && this.bossManager.currentBoss.alive) {
            const boss = this.bossManager.currentBoss;
            const dist = Phaser.Math.Distance.Between(x, y, boss.sprite.x, boss.sprite.y);
            if (dist <= range) {
                boss.takeDamage(damage);
            }
        }

        return enemies.length > 0;
    }

    attackPierce(x, y, range, damage) {
        const enemies = this.enemyManager.getEnemiesInLine(
            GAME_WIDTH/2, GAME_HEIGHT/2, x, y, 50
        ).slice(0, 3);

        enemies.forEach(e => {
            e.takeDamage(damage);
            this.showDamageNumber(e.sprite.x, e.sprite.y, damage, false);
        });

        return enemies.length > 0;
    }

    attackProjectile(x, y, range, damage) {
        const enemies = this.enemyManager.getEnemiesInRange(x, y, range).slice(0, 2);

        enemies.forEach(e => {
            e.takeDamage(damage * 1.2);
            this.showDamageNumber(e.sprite.x, e.sprite.y, damage * 1.2, false);
        });

        if (this.bossManager.currentBoss && this.bossManager.currentBoss.alive) {
            const boss = this.bossManager.currentBoss;
            const dist = Phaser.Math.Distance.Between(x, y, boss.sprite.x, boss.sprite.y);
            if (dist <= range) {
                boss.takeDamage(damage * 1.2);
                this.showDamageNumber(boss.sprite.x, boss.sprite.y, damage * 1.2, false);
            }
        }

        return enemies.length > 0;
    }

    attackBounce(x, y, range, damage) {
        const enemies = this.enemyManager.getEnemiesInRange(x, y, range).slice(0, 3);
        let bounceDamage = damage;

        enemies.forEach(e => {
            e.takeDamage(bounceDamage);
            this.showDamageNumber(e.sprite.x, e.sprite.y, bounceDamage, false);
            bounceDamage = Math.floor(bounceDamage * 0.8);
        });

        return enemies.length > 0;
    }

    showAttackEffect(x, y, type, hit, isCrit) {
        const colors = {
            single: 0xffff00,    // 黄色 - 短剑
            aoe: 0xff6600,       // 橙色 - 战斧
            pierce: 0x00ffff,    // 青色 - 法杖
            projectile: 0x00ff00, // 绿色 - 弓箭
            bounce: 0xff00ff     // 紫色 - 魔杖
        };

        const color = hit ? (isCrit ? 0xff0000 : colors[type]) : 0x888888;
        const size = isCrit ? 30 : 20;

        const weaponIcons = {
            single: '⚔️',
            aoe: '🪓',
            pierce: '🔮',
            projectile: '🏹',
            bounce: '🪄'
        };

        switch (type) {
            case 'single':
                effect = this.add.circle(x, y, size, color, 0.8);
                this.tweens.add({
                    targets: effect,
                    scale: 3,
                    alpha: 0,
                    duration: 150,
                    onComplete: () => effect.destroy()
                });
                break;

            case 'aoe':
                effect = this.add.circle(x, y, size * 3, color, 0.5);
                this.tweens.add({
                    targets: effect,
                    scale: 2,
                    alpha: 0,
                    duration: 300,
                    onComplete: () => effect.destroy()
                });
                const wave = this.add.circle(x, y, 15, color, 0.4);
                this.tweens.add({
                    targets: wave,
                    scale: 10,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => wave.destroy()
                });
                break;

            case 'pierce':
                for (let i = 0; i < 3; i++) {
                    const line = this.add.rectangle(x, y, 80, 6, color, 0.7);
                    line.rotation = Phaser.Math.DegToRad(-15 + i * 15);
                    this.tweens.add({
                        targets: line,
                        scaleX: 0,
                        alpha: 0,
                        duration: 200,
                        delay: i * 50,
                        onComplete: () => line.destroy()
                    });
                }
                break;

            case 'projectile':
                const arrow = this.add.text(x, y, '🏹', { fontSize: '24px' }).setOrigin(0.5);
                this.tweens.add({
                    targets: arrow,
                    alpha: 0,
                    scale: 1.5,
                    duration: 150,
                    onComplete: () => arrow.destroy()
                });
                break;

            case 'bounce':
                for (let i = 0; i < 3; i++) {
                    const star = this.add.star(x, y, 5, size/2, size, color, 0.6);
                    this.tweens.add({
                        targets: star,
                        scale: 1.5,
                        alpha: 0,
                        duration: 200,
                        delay: i * 100,
                        onComplete: () => star.destroy()
                    });
                }
                break;

            default:
                effect = this.add.circle(x, y, size, color, 0.6);
                this.tweens.add({
                    targets: effect,
                    scale: 2,
                    alpha: 0,
                    duration: 200,
                    onComplete: () => effect.destroy()
                });
        }
    }

    showDamageNumber(x, y, damage, isCrit) {
        // 暴击音效
        if (isCrit) {
            this.soundManager.play('crit');
            this.showCritShake();
        }

        const text = this.add.text(x, y - 30, (isCrit ? 'CRIT! ' : '') + Math.floor(damage), {
            fontFamily: 'Courier New',
            fontSize: isCrit ? '24px' : '18px',
            color: isCrit ? '#ff0000' : '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);

        this.tweens.add({
            targets: text,
            y: y - 60,
            alpha: 0,
            duration: 600,
            onComplete: () => text.destroy()
        });
    }

    showHealEffect() {
        // 回血音效
        this.soundManager.play('heal');

        // 回血粒子效果
        this.particleManager.createHealParticles();

        const text = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 50, '+HP', {
            fontFamily: 'Courier New',
            fontSize: '20px',
            color: '#00ff00'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: text,
            y: GAME_HEIGHT/2 - 80,
            alpha: 0,
            duration: 500,
            onComplete: () => text.destroy()
        });
    }

    showMinionAttackEffect(x, y) {
        const effect = this.add.circle(x, y, 15, 0x888888, 0.5);
        this.tweens.add({
            targets: effect,
            scale: 1.5,
            alpha: 0,
            duration: 150,
            onComplete: () => effect.destroy()
        });
    }

    onEnemyKilled(enemy, gold, exp) {
        this.runtime.killCount++;

        // 击杀音效
        this.soundManager.play('kill');

        // 粒子效果
        if (enemy.sprite) {
            this.particleManager.createKillParticles(enemy.sprite.x, enemy.sprite.y);
            this.particleManager.createGoldParticles(enemy.sprite.x, enemy.sprite.y, 3);
            this.particleManager.createExpParticles(enemy.sprite.x, enemy.sprite.y, 2);
        }

        // 金币加成
        const goldBonus = 1 + this.runtime.specializations.gold * 0.1;
        const finalGold = Math.floor(gold * goldBonus);
        this.runtime.gold += finalGold;
        this.runtime.totalGoldEarned += finalGold;

        // 金币拾取音效
        if (finalGold > 0) {
            this.soundManager.play('pickup_gold');
        }

        // 经验加成
        const expBonus = 1 + this.runtime.specializations.exp * 0.05;
        const finalExp = Math.floor(exp * expBonus);
        this.runtime.exp += finalExp;

        // 掉落特效
        this.showDropEffect(enemy.sprite.x, enemy.sprite.y, finalGold);

        // 检查升级
        this.checkLevelUp();
    }

    showDropEffect(x, y, gold) {
        const text = this.add.text(x, y, `+${gold}G`, {
            fontFamily: 'Courier New',
            fontSize: '14px',
            color: '#ffd700'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: text,
            y: y - 30,
            alpha: 0,
            duration: 400,
            onComplete: () => text.destroy()
        });
    }

    checkLevelUp() {
        while (this.runtime.exp >= this.runtime.expToNext) {
            this.runtime.exp -= this.runtime.expToNext;
            this.runtime.level++;
            this.runtime.specializationPoints++;
            this.runtime.expToNext = Math.floor(50 * Math.pow(1.2, this.runtime.level - 1));

            // 最大HP增加
            this.runtime.maxHp += 10 + this.runtime.specializations.hp * 10;
            this.runtime.hp = this.runtime.maxHp;

            // 升级特效
            this.showLevelUpEffect();

            // 打开专精选择
            this.paused = true;
            this.specUI.show();
        }
    }

    showLevelUpEffect() {
        // 升级音效
        this.soundManager.play('levelUp');

        // 升级粒子效果
        this.particleManager.createLevelUpParticles();

        const text = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2, 'LEVEL UP!', {
            fontFamily: 'Courier New',
            fontSize: '36px',
            color: '#00ff00',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5).setDepth(100);

        this.tweens.add({
            targets: text,
            y: GAME_HEIGHT/2 - 80,
            alpha: 0,
            duration: 1000,
            onComplete: () => text.destroy()
        });
    }

    onSpecSelect(key) {
        if (key === 'hp') {
            this.runtime.maxHp += 10;
            this.runtime.hp = Math.min(this.runtime.hp + 10, this.runtime.maxHp);
        }
        this.runtime.specializations[key]++;
        this.runtime.specializationPoints--;
        this.paused = false;
    }

    onTimeoutDamage(enemy, damage) {
        const armorBonus = this.runtime.specializations.armor * 0.02;
        const actualDamage = Math.floor(damage * (1 - armorBonus));
        this.runtime.hp -= actualDamage;

        // 受伤音效
        this.soundManager.play('damage');

        // 受伤闪红效果
        this.showDamageFlash();

        // 显示伤害
        this.showTimeoutDamageEffect(actualDamage);
    }

    showTimeoutDamageEffect(damage) {
        const text = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 50, `-${damage}`, {
            fontFamily: 'Courier New',
            fontSize: '16px',
            color: '#ff6600'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: text,
            alpha: 0,
            duration: 300,
            onComplete: () => text.destroy()
        });
    }

    showDamageFlash() {
        const flash = this.add.rectangle(
            GAME_WIDTH/2, GAME_HEIGHT/2,
            GAME_WIDTH, GAME_HEIGHT,
            0xff0000, 0.2
        ).setDepth(99);

        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 200,
            onComplete: () => flash.destroy()
        });
    }

    showCritShake() {
        if (this.cameras && this.cameras.main) {
            this.cameras.main.shake(100, 0.005);
        }
    }

    onBossDefeated() {
        this.runtime.bossCount++;

        // Boss击败音效
        this.soundManager.play('bossDefeat');

        // Boss击败粒子效果
        if (this.bossManager.currentBoss && this.bossManager.currentBoss.sprite) {
            this.particleManager.createBossDefeatParticles(
                this.bossManager.currentBoss.sprite.x,
                this.bossManager.currentBoss.sprite.y
            );
        }

        this.bossManager.onBossDefeated();

        // 检查随从解锁
        this.checkMinionUnlock();

        // 显示奖励
        this.paused = true;
        this.rewardUI.show();
    }

    checkMinionUnlock() {
        const data = GameData.load();

        // 光明精灵：击败第3个Boss
        if (this.runtime.bossCount >= 3 && !data.unlockedMinions.includes('lightElf')) {
            data.unlockedMinions.push('lightElf');
            GameData.save(data);
            this.showUnlockMessage('光明精灵已解锁!');
        }

        // 骷髅战士：累计存活10分钟
        if (this.runtime.survivalTime >= 600 && !data.unlockedMinions.includes('skeletonWarrior')) {
            data.unlockedMinions.push('skeletonWarrior');
            GameData.save(data);
            this.showUnlockMessage('骷髅战士已解锁!');
        }
    }

    showUnlockMessage(msg) {
        // 解锁音效
        this.soundManager.play('unlock');

        const text = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 - 100, msg, {
            fontFamily: 'Courier New',
            fontSize: '28px',
            color: '#ffd700',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(100);

        this.tweens.add({
            targets: text,
            scale: 1.3,
            alpha: 0,
            duration: 2000,
            onComplete: () => text.destroy()
        });
    }

    onRewardSelect(choice, rewards) {
        if (choice === 'weapon_upgrade') {
            if (this.runtime.weaponLevel < 5) {
                this.runtime.weaponLevel++;
                this.showUpgradeEffect();
            } else {
                this.runtime.gold += 100;
            }
        } else if (choice.startsWith('reward_')) {
            const index = parseInt(choice.split('_')[1]);
            const reward = rewards[index];

            if (reward) {
                switch (reward.type) {
                    case 'gold':
                        this.runtime.gold += Phaser.Math.Between(reward.value[0], reward.value[1]);
                        break;
                    case 'exp':
                        this.runtime.exp += Phaser.Math.Between(reward.value[0], reward.value[1]);
                        this.checkLevelUp();
                        break;
                    case 'spec':
                        this.runtime.specializations[reward.key]++;
                        break;
                    case 'allSpec':
                        Object.keys(this.runtime.specializations).forEach(k => {
                            this.runtime.specializations[k]++;
                        });
                        break;
                    case 'maxHp':
                        this.runtime.maxHp += reward.value;
                        this.runtime.hp += reward.value;
                        break;
                    case 'minion':
                        this.runtime.minion = MinionFactory.create(reward.minionType);
                        break;
                }
            }
        }

        this.paused = false;
    }

    showUpgradeEffect() {
        const text = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2, '武器升级!', {
            fontFamily: 'Courier New',
            fontSize: '24px',
            color: '#00ffff'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: text,
            alpha: 0,
            duration: 1000,
            onComplete: () => text.destroy()
        });
    }

    gameOver() {
        // 游戏结束音效
        this.soundManager.play('gameOver');

        // 保存数据
        const data = GameData.load();
        data.totalRuns++;
        data.totalGold += this.runtime.totalGoldEarned;
        if (this.runtime.survivalTime > data.bestTime) {
            data.bestTime = this.runtime.survivalTime;
        }

        // 检查成就
        const newAchievements = AchievementManager.check(this.runtime, data);
        GameData.save(data);

        // 跳转结算
        this.scene.start('GameOverScene', {
            survivalTime: this.runtime.survivalTime,
            gold: this.runtime.totalGoldEarned,
            level: this.runtime.level,
            bossCount: this.runtime.bossCount,
            killCount: this.runtime.killCount,
            newAchievements: newAchievements
        });
    }

    shutdown() {
        this.enemyManager.clear();
        this.bossManager.clear();
        this.particleManager.clear();
        this.hud.destroy();
    }

    togglePause() {
        this.paused = !this.paused;

        // 更新暂停按钮图标
        if (this.hud.elements.pauseBtn) {
            this.hud.elements.pauseBtn.setText(this.paused ? '▶️' : '⏸️');
        }

        // 显示暂停提示
        if (this.paused) {
            this.showPauseOverlay();
        } else {
            this.hidePauseOverlay();
        }

        // 暂停音效
        this.soundManager.play('click');
    }

    showPauseOverlay() {
        this.pauseOverlay = this.add.container(0, 0);

        const bg = this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.7);
        this.pauseOverlay.add(bg);

        const text = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2, '游戏暂停', {
            fontFamily: 'Courier New',
            fontSize: '36px',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.pauseOverlay.add(text);

        const hint = this.add.text(GAME_WIDTH/2, GAME_HEIGHT/2 + 50, '点击暂停按钮继续', {
            fontFamily: 'Courier New',
            fontSize: '18px',
            color: '#aaaaaa'
        }).setOrigin(0.5);
        this.pauseOverlay.add(hint);
    }

    hidePauseOverlay() {
        if (this.pauseOverlay) {
            this.pauseOverlay.destroy();
            this.pauseOverlay = null;
        }
    }

    createPixelBackground() {
        const bg = this.add.container(0, 0).setDepth(-1);

        const gradient = this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x0d0d1a);
        bg.add(gradient);

        for (let i = 0; i < 15; i++) {
            const x = Phaser.Math.Between(0, GAME_WIDTH);
            const y = Phaser.Math.Between(0, GAME_HEIGHT);
            const twinkle = this.add.rectangle(x, y, 2, 2, 0xffffff, 0.2);
            bg.add(twinkle);
            this.tweens.add({
                targets: twinkle,
                alpha: [0.1, 0.5, 0.1],
                duration: 1500 + Phaser.Math.Between(0, 1000),
                repeat: -1,
                delay: Phaser.Math.Between(0, 2000)
            });
        }

        const border = this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH - 4, GAME_HEIGHT - 4, 0x1a1a3a, 0);
        border.setStrokeStyle(4, 0x2a2a4a);
        bg.add(border);
    }

    toggleVolume() {
        const enabled = this.soundManager.toggle();

        // 更新音量按钮图标
        if (this.hud.elements.volumeBtn) {
            this.hud.elements.volumeBtn.setText(enabled ? '🔊' : '🔇');
        }
    }
}

/**
 * GameOverScene - 游戏结束场景
 */
class GameOverScene extends Phaser.Scene {
    constructor() {
        super('GameOverScene');
    }

    init(data) {
        this.result = data;
    }

    create() {
        // 背景
        this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, GAME_WIDTH, GAME_HEIGHT, 0x1a1a2e);

        // 标题
        this.add.text(GAME_WIDTH/2, 60, '游戏结束', {
            fontFamily: 'Courier New',
            fontSize: '48px',
            color: '#ff6666'
        }).setOrigin(0.5);

        // 结算信息
        const y = 150;
        const spacing = 45;

        this.add.text(GAME_WIDTH/2, y, '存活时间', {
            fontFamily: 'Courier New',
            fontSize: '18px',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        this.add.text(GAME_WIDTH/2, y + spacing, this.formatTime(this.result.survivalTime), {
            fontFamily: 'Courier New',
            fontSize: '36px',
            color: '#00ff00'
        }).setOrigin(0.5);

        this.add.text(GAME_WIDTH/2, y + spacing * 2.5, `获得金币: ${this.result.gold}`, {
            fontFamily: 'Courier New',
            fontSize: '24px',
            color: '#ffd700'
        }).setOrigin(0.5);

        this.add.text(GAME_WIDTH/2, y + spacing * 3.5, `最高等级: ${this.result.level}`, {
            fontFamily: 'Courier New',
            fontSize: '24px',
            color: '#00ffff'
        }).setOrigin(0.5);

        this.add.text(GAME_WIDTH/2, y + spacing * 4.5, `击败Boss: ${this.result.bossCount}`, {
            fontFamily: 'Courier New',
            fontSize: '24px',
            color: '#ff6666'
        }).setOrigin(0.5);

        this.add.text(GAME_WIDTH/2, y + spacing * 5.5, `击杀敌人: ${this.result.killCount}`, {
            fontFamily: 'Courier New',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // 历史最佳
        const data = GameData.load();
        this.add.text(GAME_WIDTH/2, y + spacing * 7, `历史最佳: ${this.formatTime(data.bestTime)}`, {
            fontFamily: 'Courier New',
            fontSize: '20px',
            color: '#ffd700'
        }).setOrigin(0.5);

        // 本局解锁的成就
        if (this.result.newAchievements && this.result.newAchievements.length > 0) {
            this.add.text(GAME_WIDTH/2, y + spacing * 8.5, '🎉 新成就解锁!', {
                fontFamily: 'Courier New',
                fontSize: '18px',
                color: '#00ff00'
            }).setOrigin(0.5);

            this.result.newAchievements.forEach((key, i) => {
                const ach = AchievementManager.getInfo(key);
                if (ach) {
                    this.add.text(GAME_WIDTH/2, y + spacing * 9.5 + i * 25, `${ach.icon} ${ach.name}`, {
                        fontFamily: 'Courier New',
                        fontSize: '14px',
                        color: '#ffffff'
                    }).setOrigin(0.5);
                }
            });
        }

        // 按钮
        const restartBtn = this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT - 80, 200, 50, 0x4a4a6a);
        restartBtn.setInteractive({ useHandCursor: true });
        restartBtn.on('pointerover', () => restartBtn.setFillStyle(0x6a6a8a));
        restartBtn.on('pointerout', () => restartBtn.setFillStyle(0x4a4a6a));
        restartBtn.on('pointerdown', () => this.scene.start('MenuScene'));

        this.add.text(GAME_WIDTH/2, GAME_HEIGHT - 80, '再来一局', {
            fontFamily: 'Courier New',
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
    }

    formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
}

// ==================== 游戏初始化 ====================
const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#0d0d1a',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [BootScene, MenuScene, GameScene, GameOverScene]
};

const game = new Phaser.Game(config);
/**
 * 像素地牢猎手 - Pixel Dungeon Hunter
 * 点击肉鸽小游戏
 * 
 * 使用 Phaser 3 开发
 */

// ==================== 游戏配置 ====================
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

const config = {
    type: Phaser.AUTO,
    width: GAME_WIDTH,
    height: GAME_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',
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
        this.hp = 100;
        this.maxHp = 100;
        this.level = 1;
        this.exp = 0;
        this.expToNext = 50;
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

        const color = colors[this.type] || 0xff0000;
        const size = this.type === 'gargoyle' ? 40 : 32;

        this.sprite = this.scene.add.rectangle(x, y, size, size, color);
        this.sprite.setData('enemy', this);

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
                targets: [this.sprite, this.hpBar, this.hpBarBg],
                alpha: 0,
                scale: 0,
                duration: 200,
                onComplete: () => this.destroy()
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
        this.spawnTimer = 0;
        this.spawnInterval = 2000;
        this.maxEnemies = 15;
    }

    update(time, delta) {
        // 生成新敌人
        this.spawnTimer += delta;
        if (this.spawnTimer >= this.spawnInterval && this.enemies.length < this.maxEnemies) {
            this.spawnTimer = 0;
            this.spawnEnemy();
        }

        // 更新所有敌人
        const damages = [];
        this.enemies.forEach(enemy => {
            if (enemy.alive) {
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
        const weights = [40, 30, 15, 10, 5]; // 权重

        // 根据时间调整权重
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

        const enemy = new Enemy(this.scene, type, ...stats);
        enemy.spawn(pos.x, pos.y);
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
            'slime':    [30, 5, 8],
            'bat':      [20, 3, 6],
            'skeleton': [50, 8, 10],
            'ghost':    [40, 6, 7],
            'gargoyle': [80, 10, 15]
        };
        const base = baseStats[type] || baseStats['slime'];
        return base.map(v => Math.floor(v * difficulty));
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
        this.bossSchedule = [60, 120, 180, 360, 540];
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
    }

    showBossWarning() {
        this.elements.bossText.setColor('#ff0000');
        this.scene.tweens.add({
            targets: this.elements.bossText,
            scale: 1.5,
            duration: 200,
            yoyo: true,
            repeat: 2,
            onComplete: () => this.elements.bossText.setScale(1)
        });
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
        this.container = this.scene.add.container(0, 0);

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

        const bg = this.scene.add.rectangle(0, 0, 150, 200, 0x4a4a6a);
        bg.setInteractive({ useHandCursor: true });
        bg.on('pointerover', () => bg.setFillStyle(0x6a6a8a));
        bg.on('pointerout', () => bg.setFillStyle(0x4a4a6a));
        bg.on('pointerdown', () => this.select(spec.key));

        const name = this.scene.add.text(0, -60, spec.name, {
            fontFamily: 'Courier New',
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);

        const level = this.scene.add.text(0, -20, `当前: Lv.${this.scene.runtime.specializations[spec.key]}`, {
            fontFamily: 'Courier New',
            fontSize: '14px',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        const desc = this.scene.add.text(0, 20, spec.description, {
            fontFamily: 'Courier New',
            fontSize: '12px',
            color: '#00ff00',
            align: 'center',
            wordWrap: { width: 130 }
        }).setOrigin(0.5);

        const bonus = this.scene.add.text(0, 70, spec.bonus, {
            fontFamily: 'Courier New',
            fontSize: '24px',
            color: '#ffff00'
        }).setOrigin(0.5);

        container.add([bg, name, level, desc, bonus]);
        return container;
    }

    getRandomSpecs(count) {
        const allSpecs = [
            { key: 'attack', name: '攻击专精', description: '+5% 伤害', bonus: '+5%' },
            { key: 'crit', name: '暴击专精', description: '+2% 暴击率', bonus: '+2%' },
            { key: 'attackSpeed', name: '攻速专精', description: '-10% 攻击间隔', bonus: '-10%' },
            { key: 'hp', name: '生命专精', description: '+10 最大HP', bonus: '+10' },
            { key: 'armor', name: '护甲专精', description: '+2% 减伤', bonus: '+2%' },
            { key: 'gold', name: '金币专精', description: '+10% 金币', bonus: '+10%' },
            { key: 'exp', name: '经验专精', description: '+5% 经验', bonus: '+5%' },
            { key: 'minion', name: '随从专精', description: '+10% 随从效果', bonus: '+10%' }
        ];

        return Phaser.Utils.Array.GetRandom(allSpecs, count);
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
        this.container = this.scene.add.container(0, 0);

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
        return Phaser.Utils.Array.GetRandom(selectedPool, 3);
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
        bg.on('pointerover', () => bg.setFillStyle(Phaser.Display.Color.IntegerToColor(color).lighten(20).color));
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

        container.add([bg, icon, name, effect]);
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

            this.add.text(x, y - 20, info.name, {
                fontFamily: 'Courier New',
                fontSize: '16px',
                color: '#ffffff'
            }).setOrigin(0.5);

            this.add.text(x, y + 15, info.desc, {
                fontFamily: 'Courier New',
                fontSize: '12px',
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
        // 玩家
        this.player = this.add.rectangle(GAME_WIDTH/2, GAME_HEIGHT/2, 40, 40, 0x4488ff);

        // 管理器
        this.enemyManager = new EnemyManager(this);
        this.bossManager = new BossManager(this);

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
        return this.attackSingle(x, y, range * 1.5, damage);
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
            single: 0xffff00,
            aoe: 0xff6600,
            pierce: 0x00ffff,
            projectile: 0x00ff00,
            bounce: 0xff00ff
        };

        const color = hit ? (isCrit ? 0xff0000 : colors[type]) : 0x888888;
        const size = isCrit ? 30 : 20;

        const effect = this.add.circle(x, y, size, color, 0.6);
        this.tweens.add({
            targets: effect,
            scale: 2,
            alpha: 0,
            duration: 200,
            onComplete: () => effect.destroy()
        });
    }

    showDamageNumber(x, y, damage, isCrit) {
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

        // 金币加成
        const goldBonus = 1 + this.runtime.specializations.gold * 0.1;
        const finalGold = Math.floor(gold * goldBonus);
        this.runtime.gold += finalGold;
        this.runtime.totalGoldEarned += finalGold;

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

    onBossDefeated() {
        this.runtime.bossCount++;
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
        // 保存数据
        const data = GameData.load();
        data.totalRuns++;
        data.totalGold += this.runtime.totalGoldEarned;
        if (this.runtime.survivalTime > data.bestTime) {
            data.bestTime = this.runtime.survivalTime;
        }
        GameData.save(data);

        // 跳转结算
        this.scene.start('GameOverScene', {
            survivalTime: this.runtime.survivalTime,
            gold: this.runtime.totalGoldEarned,
            level: this.runtime.level,
            bossCount: this.runtime.bossCount,
            killCount: this.runtime.killCount
        });
    }

    shutdown() {
        this.enemyManager.clear();
        this.bossManager.clear();
        this.hud.destroy();
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
/**
 * 暗影猎手：神话版 - Shadow Hunter: Mythic
 * 顶级像素肉鸽生存游戏 - 全面进化版
 * 
 * 核心亮点：
 * - 5种独特武器，每种有专属攻击动画和手感
 * - 12种专精构筑，build多样性拉满
 * - 8种敌人 + 5种Boss，各有独特AI和加速曲线
 * - Boss奖励三选一 + 武器进化系统 + 随从解锁
 * - 连击系统 + 暴击吸血 + 超爽打击感
 * - 精美像素风格 + 炫酷粒子特效 + 屏幕震动
 */

const GW = 900, GH = 650, WS = 2500;

const COLORS = {
    player: 0x4488ff,
    playerBody: 0x3366cc,
    playerBodyDark: 0x224499,
    playerHead: 0xffcc99,
    playerHair: 0x553322,
    sword: 0xff4466,
    swordGlow: 0xff8899,
    axe: 0xff8800,
    axeGlow: 0xffaa44,
    staff: 0x00ffff,
    staffGlow: 0x66ffff,
    bow: 0x66ff66,
    bowGlow: 0x99ff99,
    wand: 0xff66ff,
    wandGlow: 0xff99ff,
    hp: 0xff3344,
    hpBg: 0x441122,
    exp: 0xffdd00,
    expBg: 0x222244,
    gold: 0xffd700,
    shield: 0x4488ff,
    bg1: 0x0a0a18,
    bg2: 0x0f0f28,
    grid: 0x1a1a35,
    enemy: {
        slime: 0x44cc44,
        slimeDark: 0x228822,
        bat: 0x772277,
        batDark: 0x441144,
        skeleton: 0xdddddd,
        skeletonDark: 0x999999,
        ghost: 0x66cccc,
        ghostDark: 0x338888,
        gargoyle: 0x995544,
        gargoyleDark: 0x663322,
        archer: 0xaa8855,
        archerDark: 0x775533,
        demon: 0xcc3333,
        demonDark: 0x881111
    },
    boss: {
        gk: 0x8B4513,
        gkGlow: 0xcd853f,
        sl: 0x777777,
        slGlow: 0xaaaaaa,
        sd: 0x4B0082,
        sdGlow: 0x8a2be2,
        dl: 0x8B0000,
        dlGlow: 0xdc143c,
        tt: 0x228b22,
        ttGlow: 0x32cd32
    }
};

// ==================== 粒子系统 ====================
class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
    }
    
    hit(x, y, color = 0xff4444, count = 12, speed = 4) {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + Math.random() * 0.6;
            const spd = speed + Math.random() * speed * 1.5;
            const size = 2 + Math.random() * 5;
            const p = this.scene.add.circle(x, y, size, color);
            p.setDepth(200);
            this.scene.tweens.add({
                targets: p,
                x: x + Math.cos(angle) * spd * 20,
                y: y + Math.sin(angle) * spd * 20,
                alpha: { from: 1, to: 0 },
                scale: { from: 1, to: 0.2 },
                duration: 250 + Math.random() * 200,
                ease: 'Cubic.easeOut',
                onComplete: () => p.destroy()
            });
        }
    }
    
    slash(x, y, angle, color = 0xff4466, range = 100, arc = Math.PI / 2) {
        const g = this.scene.add.graphics();
        g.setDepth(150);
        g.lineStyle(5, color, 0.95);
        g.beginPath();
        g.arc(x, y, range * 0.75, angle - arc / 2, angle + arc / 2, false);
        g.strokePath();
        
        const g2 = this.scene.add.graphics();
        g2.setDepth(149);
        g2.fillStyle(color, 0.25);
        g2.beginPath();
        g2.moveTo(x, y);
        g2.arc(x, y, range * 0.85, angle - arc / 2, angle + arc / 2, false);
        g2.closePath();
        g2.fillPath();
        
        const g3 = this.scene.add.graphics();
        g3.setDepth(151);
        g3.lineStyle(2, 0xffffff, 0.6);
        g3.beginPath();
        g3.arc(x, y, range * 0.7, angle - arc / 3, angle + arc / 3, false);
        g3.strokePath();
        
        this.scene.tweens.add({
            targets: [g, g2, g3],
            alpha: { from: 1, to: 0 },
            scale: { from: 0.7, to: 1.3 },
            rotation: { from: -0.1, to: 0.1 },
            duration: 200,
            ease: 'Cubic.easeOut',
            onComplete: () => { g.destroy(); g2.destroy(); g3.destroy(); }
        });
    }
    
    lineBeam(x1, y1, x2, y2, color = 0x00ffff, width = 10) {
        const g = this.scene.add.graphics();
        g.setDepth(150);
        g.lineStyle(width, color, 0.9);
        g.beginPath();
        g.moveTo(x1, y1);
        g.lineTo(x2, y2);
        g.strokePath();
        
        const g2 = this.scene.add.graphics();
        g2.setDepth(149);
        g2.lineStyle(width * 3, color, 0.35);
        g2.beginPath();
        g2.moveTo(x1, y1);
        g2.lineTo(x2, y2);
        g2.strokePath();
        
        const g3 = this.scene.add.graphics();
        g3.setDepth(151);
        g3.lineStyle(width / 2, 0xffffff, 0.8);
        g3.beginPath();
        g3.moveTo(x1, y1);
        g3.lineTo(x2, y2);
        g3.strokePath();
        
        for (let i = 0; i < 8; i++) {
            const t = i / 7;
            const px = x1 + (x2 - x1) * t;
            const py = y1 + (y2 - y1) * t;
            const p = this.scene.add.circle(px, py, 3, 0xffffff, 0.8);
            p.setDepth(152);
            this.scene.tweens.add({
                targets: p,
                alpha: 0,
                scale: 2,
                duration: 200 + Math.random() * 100,
                ease: 'Cubic.easeOut',
                onComplete: () => p.destroy()
            });
        }
        
        this.scene.tweens.add({
            targets: [g, g2, g3],
            alpha: { from: 1, to: 0 },
            scale: { from: 1, to: 0.4 },
            duration: 250,
            ease: 'Cubic.easeOut',
            onComplete: () => { g.destroy(); g2.destroy(); g3.destroy(); }
        });
    }
    
    explosion(x, y, radius = 100, color = 0xffaa00) {
        const g = this.scene.add.graphics();
        g.setDepth(150);
        g.fillStyle(color, 0.5);
        g.fillCircle(x, y, 15);
        
        const g2 = this.scene.add.graphics();
        g2.setDepth(149);
        g2.lineStyle(5, color, 0.9);
        g2.strokeCircle(x, y, 15);
        
        const g3 = this.scene.add.graphics();
        g3.setDepth(151);
        g3.lineStyle(2, 0xffffff, 0.7);
        g3.strokeCircle(x, y, 10);
        
        this.scene.tweens.add({
            targets: g,
            scale: { from: 0.3, to: radius / 15 },
            alpha: { from: 0.7, to: 0 },
            duration: 500,
            ease: 'Cubic.easeOut',
            onComplete: () => g.destroy()
        });
        
        this.scene.tweens.add({
            targets: g2,
            scale: { from: 0.5, to: radius / 15 },
            alpha: { from: 1, to: 0 },
            duration: 450,
            ease: 'Cubic.easeOut',
            onComplete: () => g2.destroy()
        });
        
        this.scene.tweens.add({
            targets: g3,
            scale: { from: 0.6, to: radius / 10 },
            alpha: { from: 0.8, to: 0 },
            duration: 400,
            ease: 'Cubic.easeOut',
            onComplete: () => g3.destroy()
        });
        
        for (let i = 0; i < 16; i++) {
            const angle = (i / 16) * Math.PI * 2 + Math.random() * 0.3;
            const p = this.scene.add.circle(x, y, 5 + Math.random() * 4, color);
            p.setDepth(155);
            this.scene.tweens.add({
                targets: p,
                x: x + Math.cos(angle) * radius * 0.9,
                y: y + Math.sin(angle) * radius * 0.9,
                alpha: { from: 1, to: 0 },
                scale: { from: 1, to: 0.2 },
                duration: 500 + Math.random() * 200,
                ease: 'Cubic.easeOut',
                onComplete: () => p.destroy()
            });
        }
        
        for (let i = 0; i < 6; i++) {
            const angle = Math.random() * Math.PI * 2;
            const p = this.scene.add.circle(x, y, 3, 0xffffff, 0.9);
            p.setDepth(156);
            this.scene.tweens.add({
                targets: p,
                x: x + Math.cos(angle) * radius * 0.6,
                y: y + Math.sin(angle) * radius * 0.6,
                alpha: 0,
                scale: 1.5,
                duration: 350,
                ease: 'Cubic.easeOut',
                onComplete: () => p.destroy()
            });
        }
    }
    
    levelUp() {
        const cx = GW / 2, cy = GH / 2;
        for (let i = 0; i < 30; i++) {
            const angle = (i / 30) * Math.PI * 2 + Math.random() * 0.2;
            const p = this.scene.add.star(cx, cy, 5, 10, 20, 0xffd700);
            p.setDepth(300);
            this.scene.tweens.add({
                targets: p,
                x: cx + Math.cos(angle) * 300,
                y: cy + Math.sin(angle) * 250,
                alpha: { from: 0, to: 1, to: 0 },
                scale: { from: 0, to: 1.8, to: 0.5 },
                angle: angle * 3,
                duration: 1500,
                ease: 'Cubic.easeOut',
                onComplete: () => p.destroy()
            });
        }
        
        for (let i = 0; i < 15; i++) {
            const angle = Math.random() * Math.PI * 2;
            const p = this.scene.add.circle(cx, cy, 4, 0xffffff, 0.9);
            p.setDepth(301);
            this.scene.tweens.add({
                targets: p,
                x: cx + Math.cos(angle) * 200,
                y: cy + Math.sin(angle) * 200,
                alpha: 0,
                scale: 2,
                duration: 1000,
                ease: 'Cubic.easeOut',
                onComplete: () => p.destroy()
            });
        }
        
        const ring = this.scene.add.graphics();
        ring.setDepth(299);
        ring.lineStyle(5, 0xffd700, 0.9);
        ring.strokeCircle(cx, cy, 60);
        
        const ring2 = this.scene.add.graphics();
        ring2.setDepth(298);
        ring2.lineStyle(3, 0xffffff, 0.6);
        ring2.strokeCircle(cx, cy, 40);
        
        this.scene.tweens.add({
            targets: ring,
            scale: { from: 0.3, to: 5 },
            alpha: { from: 1, to: 0 },
            duration: 1000,
            ease: 'Cubic.easeOut',
            onComplete: () => ring.destroy()
        });
        
        this.scene.tweens.add({
            targets: ring2,
            scale: { from: 0.5, to: 4 },
            alpha: { from: 0.8, to: 0 },
            duration: 800,
            ease: 'Cubic.easeOut',
            onComplete: () => ring2.destroy()
        });
    }
    
    healEffect(x, y) {
        for (let i = 0; i < 8; i++) {
            const p = this.scene.add.text(x + (Math.random() - 0.5) * 40, y + (Math.random() - 0.5) * 20, '❤', {
                fontSize: '18px',
                color: '#ff4466'
            }).setOrigin(0.5);
            p.setDepth(200);
            this.scene.tweens.add({
                targets: p,
                y: y - 50 - Math.random() * 40,
                alpha: { from: 1, to: 0 },
                scale: { from: 0.6, to: 1.4 },
                duration: 800,
                ease: 'Cubic.easeOut',
                onComplete: () => p.destroy()
            });
        }
        
        const glow = this.scene.add.circle(x, y, 30, 0xff4466, 0.3);
        glow.setDepth(199);
        this.scene.tweens.add({
            targets: glow,
            alpha: 0,
            scale: 2,
            duration: 500,
            ease: 'Cubic.easeOut',
            onComplete: () => glow.destroy()
        });
    }
    
    goldEffect(x, y, amount = 1) {
        const tx = GW - 80, ty = 35;
        for (let i = 0; i < Math.min(amount, 10); i++) {
            setTimeout(() => {
                const p = this.scene.add.circle(
                    x + (Math.random() - 0.5) * 25,
                    y + (Math.random() - 0.5) * 25,
                    6, 0xffd700
                );
                p.setDepth(200);
                
                const shine = this.scene.add.circle(
                    x + (Math.random() - 0.5) * 25,
                    y + (Math.random() - 0.5) * 25,
                    2, 0xffffff, 0.8
                );
                shine.setDepth(201);
                
                const targetX = tx + (Math.random() - 0.5) * 50;
                const targetY = ty + (Math.random() - 0.5) * 25;
                
                this.scene.tweens.add({
                    targets: [p, shine],
                    x: targetX,
                    y: targetY,
                    alpha: { from: 1, to: 0 },
                    scale: { from: 1, to: 0.3 },
                    duration: 700 + Math.random() * 200,
                    ease: 'Cubic.easeIn',
                    onComplete: () => { p.destroy(); shine.destroy(); }
                });
            }, i * 40);
        }
    }
    
    expEffect(x, y, amount = 1) {
        const tx = 70, ty = 55;
        for (let i = 0; i < Math.min(amount, 8); i++) {
            setTimeout(() => {
                const p = this.scene.add.star(
                    x + (Math.random() - 0.5) * 25,
                    y + (Math.random() - 0.5) * 25,
                    4, 4, 8, 0xffdd00
                );
                p.setDepth(200);
                
                const targetX = tx + (Math.random() - 0.5) * 35;
                const targetY = ty + (Math.random() - 0.5) * 20;
                
                this.scene.tweens.add({
                    targets: p,
                    x: targetX,
                    y: targetY,
                    alpha: { from: 1, to: 0 },
                    scale: { from: 1, to: 0.3 },
                    angle: Math.random() * Math.PI * 2,
                    duration: 600 + Math.random() * 200,
                    ease: 'Cubic.easeIn',
                    onComplete: () => p.destroy()
                });
            }, i * 35);
        }
    }
    
    bossDefeat(x, y) {
        const colors = [0xffd700, 0xff6600, 0xff0000, 0x00ffff, 0xff00ff, 0x00ff00, 0xffffff];
        for (let i = 0; i < 60; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 80 + Math.random() * 150;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = 5 + Math.random() * 10;
            const p = this.scene.add.circle(x, y, size, color);
            p.setDepth(300);
            this.scene.tweens.add({
                targets: p,
                x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                alpha: { from: 1, to: 0 },
                scale: { from: 1, to: 0.1 },
                duration: 1000 + Math.random() * 500,
                ease: 'Cubic.easeOut',
                onComplete: () => p.destroy()
            });
        }
        
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const p = this.scene.add.star(x, y, 5, 5, 10, 0xffffff);
            p.setDepth(301);
            this.scene.tweens.add({
                targets: p,
                x: x + Math.cos(angle) * 200,
                y: y + Math.sin(angle) * 200,
                alpha: 0,
                scale: 2,
                angle: Math.random() * Math.PI * 4,
                duration: 1200,
                ease: 'Cubic.easeOut',
                onComplete: () => p.destroy()
            });
        }
        
        const flash = this.scene.add.rectangle(GW / 2, GH / 2, GW, GH, 0xffffff, 1);
        flash.setDepth(400);
        this.scene.tweens.add({
            targets: flash,
            alpha: { from: 1, to: 0 },
            duration: 600,
            ease: 'Cubic.easeOut',
            onComplete: () => flash.destroy()
        });
    }
    
    spawnEffect(x, y, color = 0xff0000) {
        const ring = this.scene.add.graphics();
        ring.setDepth(100);
        ring.lineStyle(4, color, 0.7);
        ring.strokeCircle(x, y, 50);
        
        const ring2 = this.scene.add.graphics();
        ring2.setDepth(101);
        ring2.lineStyle(2, 0xffffff, 0.5);
        ring2.strokeCircle(x, y, 35);
        
        this.scene.tweens.add({
            targets: ring,
            scale: { from: 1.6, to: 0.4 },
            alpha: { from: 0.9, to: 0 },
            duration: 500,
            ease: 'Cubic.easeOut',
            onComplete: () => ring.destroy()
        });
        
        this.scene.tweens.add({
            targets: ring2,
            scale: { from: 1.3, to: 0.6 },
            alpha: { from: 0.7, to: 0 },
            duration: 400,
            ease: 'Cubic.easeOut',
            onComplete: () => ring2.destroy()
        });
        
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const p = this.scene.add.circle(x + Math.cos(angle) * 40, y + Math.sin(angle) * 40, 4, color, 0.8);
            p.setDepth(102);
            this.scene.tweens.add({
                targets: p,
                x: x,
                y: y,
                alpha: 0,
                scale: 0.5,
                duration: 450,
                ease: 'Cubic.easeIn',
                onComplete: () => p.destroy()
            });
        }
    }
    
    critEffect(x, y) {
        const p = this.scene.add.text(x, y, '💥', { fontSize: '28px' }).setOrigin(0.5);
        p.setDepth(260);
        this.scene.tweens.add({
            targets: p,
            scale: { from: 0.5, to: 1.5, to: 0.8 },
            alpha: { from: 1, to: 0 },
            y: y - 30,
            duration: 400,
            ease: 'Cubic.easeOut',
            onComplete: () => p.destroy()
        });
    }
    
    trail(x, y, color = 0x4488ff) {
        const p = this.scene.add.circle(x, y, 8, color, 0.4);
        p.setDepth(90);
        this.scene.tweens.add({
            targets: p,
            alpha: 0,
            scale: 0.3,
            duration: 200,
            ease: 'Cubic.easeOut',
            onComplete: () => p.destroy()
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
    
    sweep(startFreq, endFreq, duration, type = 'sawtooth', vol = 1) {
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type;
            osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + duration);
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
            case 'sword': 
                this.sweep(600, 300, 0.08, 'sawtooth', 0.8); 
                break;
            case 'axe': 
                this.sweep(300, 150, 0.15, 'sawtooth', 0.9); 
                break;
            case 'staff': 
                this.tone(880, 0.12, 'sine', 0.7); 
                this.tone(660, 0.12, 'sine', 0.5); 
                break;
            case 'bow': 
                this.sweep(800, 400, 0.07, 'triangle', 0.6); 
                break;
            case 'wand': 
                this.tone(1200, 0.06, 'sine', 0.5); 
                this.tone(900, 0.09, 'sine', 0.4); 
                break;
            case 'hit': 
                this.tone(150, 0.06, 'square', 0.7); 
                break;
            case 'crit': 
                this.sweep(300, 800, 0.1, 'sawtooth', 0.8); 
                this.tone(1200, 0.18, 'sine', 0.6); 
                break;
            case 'levelup': 
                this.tone(523, 0.1, 'sine', 0.8);
                setTimeout(() => this.tone(659, 0.1, 'sine', 0.8), 100);
                setTimeout(() => this.tone(784, 0.15, 'sine', 0.9), 200);
                setTimeout(() => this.tone(1047, 0.2, 'sine', 1), 300);
                break;
            case 'pickup': 
                this.sweep(600, 900, 0.08, 'sine', 0.6); 
                break;
            case 'hurt': 
                this.sweep(300, 100, 0.18, 'sawtooth', 0.7); 
                break;
            case 'skill': 
                this.sweep(200, 600, 0.2, 'sawtooth', 0.8); 
                this.tone(400, 0.25, 'sine', 0.6); 
                break;
            case 'boss': 
                this.sweep(150, 80, 0.6, 'sawtooth', 1); 
                this.tone(60, 0.8, 'square', 0.8); 
                break;
            case 'bossWarning':
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        this.tone(200, 0.2, 'sawtooth', 0.8);
                        this.tone(100, 0.3, 'square', 0.6);
                    }, i * 300);
                }
                break;
            case 'die': 
                this.sweep(400, 100, 0.3, 'sawtooth', 0.8);
                setTimeout(() => this.sweep(200, 50, 0.3, 'sawtooth', 0.7), 150);
                setTimeout(() => this.tone(80, 0.5, 'sawtooth', 0.6), 300);
                break;
            case 'minion': 
                this.tone(1000, 0.05, 'triangle', 0.5); 
                break;
            case 'combo':
                this.tone(800, 0.05, 'sine', 0.5);
                break;
            case 'walk':
                this.tone(80, 0.03, 'square', 0.2);
                break;
        }
    }
}

// ==================== 数据存储 ====================
const SaveData = {
    load() {
        try {
            const d = localStorage.getItem('shadowHunter_v4');
            return d ? JSON.parse(d) : this.default();
        } catch (e) { return this.default(); }
    },
    save(d) {
        try { localStorage.setItem('shadowHunter_v4', JSON.stringify(d)); } catch (e) {}
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
            unlockedWeapons: ['sword', 'axe', 'bow'],
            highestBoss: 0
        };
    }
};

// ==================== 武器系统 ====================
class Weapon {
    constructor(name, baseDmg, baseCd, range, type, arc, width, icon, color, glowColor) {
        this.name = name;
        this.baseDmg = baseDmg;
        this.baseCd = baseCd;
        this.range = range;
        this.type = type;
        this.arc = arc;
        this.width = width;
        this.icon = icon;
        this.color = color;
        this.glowColor = glowColor;
        this.lastAttack = 0;
        this.attackAnim = 0;
    }
    
    canAttack(now, spec) { return now - this.lastAttack >= this.getCooldown(spec); }
    attack(now) { this.lastAttack = now; this.attackAnim = 1; }
    
    getDamage(level, spec) {
        const base = this.baseDmg + (level - 1) * 6;
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
    
    updateAnim(delta) {
        if (this.attackAnim > 0) {
            this.attackAnim = Math.max(0, this.attackAnim - delta / 150);
        }
    }
}

const WeaponFactory = {
    create(type) {
        switch (type) {
            case 'sword': return new Weapon('暗影剑', 20, 320, 120, 'melee_arc', Math.PI / 2.2, 75, '⚔', COLORS.sword, COLORS.swordGlow);
            case 'axe': return new Weapon('烈焰斧', 45, 850, 150, 'melee_arc', Math.PI / 1.6, 110, '🪓', COLORS.axe, COLORS.axeGlow);
            case 'staff': return new Weapon('冰霜法杖', 32, 600, 600, 'ranged_line', 0, 16, '🔮', COLORS.staff, COLORS.staffGlow);
            case 'bow': return new Weapon('狩猎弓', 38, 700, 700, 'ranged_projectile', 0, 10, '🏹', COLORS.bow, COLORS.bowGlow);
            case 'wand': return new Weapon('奥术魔杖', 16, 280, 280, 'ranged_bounce', 0, 12, '✨', COLORS.wand, COLORS.wandGlow);
            default: return new Weapon('暗影剑', 20, 320, 120, 'melee_arc', Math.PI / 2.2, 75, '⚔', COLORS.sword, COLORS.swordGlow);
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
            sword: '快速近战，攻击范围适中，手感极佳，连击神器',
            axe: '高伤害大范围，攻速较慢但一击必杀，霸体打击',
            staff: '穿透激光，一条直线贯穿所有敌人，冰冻减速',
            bow: '远程箭矢，高伤害高射程，穿透敌人，需要预判',
            wand: '奥术飞弹，自动追踪附近敌人，弹射连锁'
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
            case 'sword': return new Skill('暗影冲刺', 7000, '💨', '向前冲刺并对沿途敌人造成暴击伤害');
            case 'axe': return new Skill('旋风斩', 9000, '🌀', '原地旋转，对周围所有敌人造成巨额伤害');
            case 'staff': return new Skill('冰霜新星', 8000, '❄', '释放冰环，冻结并伤害周围所有敌人');
            case 'bow': return new Skill('箭雨', 10000, '🌧', '向天空射出箭雨，覆盖大范围区域');
            case 'wand': return new Skill('奥术爆发', 6000, '💥', '释放奥术能量，追踪并连续攻击敌人');
            default: return new Skill('暗影冲刺', 7000, '💨', '向前冲刺并对沿途敌人造成暴击伤害');
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
        this.comboMultiplier = 1;
        this.invincibleTimer = 0;
        this.regenTimer = 0;
        this.shield = 0;
        this.specLevels = {};
        this.minions = [];
        this.score = 0;
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
            this.expToNext = Math.floor(50 * Math.pow(1.22, this.level - 1));
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
    
    addCombo() {
        this.combo++;
        this.comboTimer = 2500;
        if (this.combo > this.maxCombo) {
            this.maxCombo = this.combo;
        }
        if (this.combo >= 10) this.comboMultiplier = 1.5;
        else if (this.combo >= 5) this.comboMultiplier = 1.25;
        else this.comboMultiplier = 1;
    }
    
    resetCombo() {
        this.combo = 0;
        this.comboMultiplier = 1;
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
        this.glowColor = options.glowColor || this.color;
        this.trailTimer = 0;
        
        const angle = Math.atan2(targetY - y, targetX - x);
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        
        this.createSprite();
    }
    
    createSprite() {
        const sx = this.screenX();
        const sy = this.screenY();
        
        this.container = this.scene.add.container(sx, sy);
        this.container.setDepth(120);
        
        switch (this.type) {
            case 'arrow':
                const shaft = this.scene.add.rectangle(0, 0, 4, 20, this.color);
                const head = this.scene.add.triangle(0, -12, -4, -4, 4, -4, 0, -14, 0xffffff);
                const fletch1 = this.scene.add.triangle(-3, 10, 0, 6, -6, 12, 0, 14, this.color);
                const fletch2 = this.scene.add.triangle(3, 10, 0, 6, 6, 12, 0, 14, this.color);
                this.container.add([shaft, head, fletch1, fletch2]);
                this.container.rotation = Math.atan2(this.vy, this.vx) + Math.PI / 2;
                break;
            case 'magic':
                const core = this.scene.add.circle(0, 0, this.size, this.color);
                const glow = this.scene.add.circle(0, 0, this.size * 2, this.glowColor, 0.35);
                const glow2 = this.scene.add.circle(0, 0, this.size * 1.3, 0xffffff, 0.5);
                this.container.add([glow, core, glow2]);
                break;
            case 'frost':
                const fCore = this.scene.add.circle(0, 0, this.size, this.color);
                const fGlow = this.scene.add.circle(0, 0, this.size * 2.2, this.glowColor, 0.3);
                const fGlow2 = this.scene.add.circle(0, 0, this.size * 1.4, 0xffffff, 0.4);
                for (let i = 0; i < 6; i++) {
                    const a = (i / 6) * Math.PI * 2;
                    const spike = this.scene.add.rectangle(
                        Math.cos(a) * this.size * 1.5,
                        Math.sin(a) * this.size * 1.5,
                        2, this.size * 0.8, 0xffffff, 0.7
                    );
                    spike.rotation = a;
                    this.container.add(spike);
                }
                this.container.add([fGlow, fCore, fGlow2]);
                break;
            case 'bone':
                const bone = this.scene.add.rectangle(0, 0, 5, 16, 0xd4a574);
                const boneEnd1 = this.scene.add.circle(0, -8, 4, 0xd4a574);
                const boneEnd2 = this.scene.add.circle(0, 8, 4, 0xd4a574);
                this.container.add([bone, boneEnd1, boneEnd2]);
                this.container.rotation = Math.atan2(this.vy, this.vx) + Math.PI / 2;
                break;
            case 'enemyArrow':
                const eShaft = this.scene.add.rectangle(0, 0, 3, 14, 0x997744);
                const eHead = this.scene.add.triangle(0, -8, -3, -2, 3, -2, 0, -10, 0x664422);
                this.container.add([eShaft, eHead]);
                this.container.rotation = Math.atan2(this.vy, this.vx) + Math.PI / 2;
                break;
            default:
                const dCore = this.scene.add.circle(0, 0, this.size, this.color);
                const dGlow = this.scene.add.circle(0, 0, this.size * 1.8, this.color, 0.3);
                this.container.add([dGlow, dCore]);
        }
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
                this.vx += (targetVx - this.vx) * 0.1;
                this.vy += (targetVy - this.vy) * 0.1;
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
        this.container.x = sx;
        this.container.y = sy;
        
        if (this.type === 'magic' || this.type === 'frost') {
            this.container.rotation += dt * 12;
        }
        
        this.trailTimer += delta;
        if (this.trailTimer > 30) {
            this.trailTimer = 0;
            this.scene.particles.trail(sx, sy, this.color);
        }
        
        if (sx < -100 || sx > GW + 100 || sy < -100 || sy > GH + 100) {
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
            if (d < nearestDist && d < 350) {
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
        let dmg = crit ? Math.floor(this.damage * this.scene.runtime.weapon.getCritDamage(this.scene.runtime.spec)) : this.damage;
        dmg = Math.floor(dmg * this.scene.runtime.comboMultiplier);
        enemy.takeDamage(dmg, crit);
        this.scene.particles.hit(this.screenX(), this.screenY(), this.color, 8, 3);
    }
    
    hitBoss(boss) {
        const crit = Math.random() < this.scene.runtime.weapon.getCritChance(this.scene.runtime.spec);
        let dmg = crit ? Math.floor(this.damage * this.scene.runtime.weapon.getCritDamage(this.scene.runtime.spec)) : this.damage;
        dmg = Math.floor(dmg * this.scene.runtime.comboMultiplier);
        boss.takeDamage(dmg, crit);
    }
    
    findNewTarget(fromEnemy) {
        let nearest = null;
        let nearestDist = Infinity;
        for (const e of this.scene.enemyManager.enemies) {
            if (!e.alive || e === fromEnemy || this.hitEnemies.has(e.id)) continue;
            const d = Phaser.Math.Distance.Between(this.worldX, this.worldY, e.worldX, e.worldY);
            if (d < nearestDist && d < 300) {
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
        if (this.container) {
            this.container.destroy();
            this.container = null;
        }
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
        this.currentSpeed = 0;
        this.accelRate = 0.02;
        this.hitRadius = 20;
        this.container = null;
        this.hpBar = null;
        this.hpBarBg = null;
        this.pattern = 'direct';
        this.attackCooldown = 0;
        this.lastSpecial = 0;
        this.stunned = 0;
        this.slowed = 0;
        this.burning = 0;
        this.burnDamage = 0;
        this.frozen = 0;
        this.walkFrame = 0;
        this.walkTimer = 0;
    }
    
    get config() {
        const configs = {
            slime: { hp: 28, dmg: 5, spd: 40, radius: 18, pattern: 'direct', color: COLORS.enemy.slime, darkColor: COLORS.enemy.slimeDark, exp: 5, gold: 2, size: 32 },
            bat: { hp: 18, dmg: 4, spd: 75, radius: 16, pattern: 'zigzag', color: COLORS.enemy.bat, darkColor: COLORS.enemy.batDark, exp: 6, gold: 2, size: 28, diveAttack: true },
            skeleton: { hp: 40, dmg: 8, spd: 48, radius: 20, pattern: 'direct', color: COLORS.enemy.skeleton, darkColor: COLORS.enemy.skeletonDark, exp: 8, gold: 3, size: 36, throwBone: true },
            ghost: { hp: 32, dmg: 7, spd: 55, radius: 22, pattern: 'teleport', color: COLORS.enemy.ghost, darkColor: COLORS.enemy.ghostDark, exp: 10, gold: 4, size: 34 },
            gargoyle: { hp: 100, dmg: 15, spd: 35, radius: 28, pattern: 'slow', color: COLORS.enemy.gargoyle, darkColor: COLORS.enemy.gargoyleDark, exp: 22, gold: 10, size: 48, armor: true },
            archer: { hp: 26, dmg: 10, spd: 45, radius: 18, pattern: 'keepDistance', color: COLORS.enemy.archer, darkColor: COLORS.enemy.archerDark, exp: 12, gold: 5, size: 32, shootArrow: true },
            demon: { hp: 55, dmg: 14, spd: 55, radius: 24, pattern: 'direct', color: COLORS.enemy.demon, darkColor: COLORS.enemy.demonDark, exp: 18, gold: 8, size: 40, chargeAttack: true }
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
        this.currentSpeed = 0;
        this.hitRadius = cfg.radius;
        this.pattern = cfg.pattern;
        this.alive = true;
        this.stunned = 0;
        this.slowed = 0;
        this.burning = 0;
        this.frozen = 0;
        this.lastSpecial = 0;
        this.attackCooldown = 0;
        this.walkFrame = 0;
        this.walkTimer = 0;
        
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
                const bodyShadow = this.scene.add.ellipse(0, size * 0.2, size * 0.65, size * 0.35, cfg.darkColor, 0.5);
                const eye1 = this.scene.add.circle(-size * 0.15, -size * 0.05, size * 0.1, 0x000000);
                const eye2 = this.scene.add.circle(size * 0.15, -size * 0.05, size * 0.1, 0x000000);
                const eyeShine1 = this.scene.add.circle(-size * 0.12, -size * 0.07, size * 0.04, 0xffffff);
                const eyeShine2 = this.scene.add.circle(size * 0.18, -size * 0.07, size * 0.04, 0xffffff);
                const shine = this.scene.add.ellipse(-size * 0.2, -size * 0.15, size * 0.18, size * 0.08, 0xffffff, 0.5);
                this.container.add([bodyShadow, body, eye1, eye2, eyeShine1, eyeShine2, shine]);
                this.slimeBody = body;
                break;
                
            case 'bat':
                const bBody = this.scene.add.ellipse(0, 0, size * 0.4, size * 0.55, cfg.color);
                const bBelly = this.scene.add.ellipse(0, size * 0.1, size * 0.25, size * 0.3, cfg.darkColor);
                const w1 = this.scene.add.ellipse(-size * 0.35, 0, size * 0.55, size * 0.22, cfg.color);
                const w2 = this.scene.add.ellipse(size * 0.35, 0, size * 0.55, size * 0.22, cfg.color);
                w1.rotation = -0.4;
                w2.rotation = 0.4;
                const w1Membrane = this.scene.add.ellipse(-size * 0.35, 0, size * 0.4, size * 0.15, cfg.darkColor, 0.6);
                const w2Membrane = this.scene.add.ellipse(size * 0.35, 0, size * 0.4, size * 0.15, cfg.darkColor, 0.6);
                w1Membrane.rotation = -0.4;
                w2Membrane.rotation = 0.4;
                const bEye1 = this.scene.add.circle(-size * 0.1, -size * 0.1, size * 0.08, 0xff0000);
                const bEye2 = this.scene.add.circle(size * 0.1, -size * 0.1, size * 0.08, 0xff0000);
                const bFangs = this.scene.add.triangle(-size * 0.05, size * 0.05, -size * 0.08, 0, -size * 0.02, 0, -size * 0.05, size * 0.12, 0xffffff);
                const bFangs2 = this.scene.add.triangle(size * 0.05, size * 0.05, size * 0.02, 0, size * 0.08, 0, size * 0.05, size * 0.12, 0xffffff);
                this.container.add([w1Membrane, w2Membrane, w1, w2, bBelly, bBody, bEye1, bEye2, bFangs, bFangs2]);
                this.wing1 = w1;
                this.wing2 = w2;
                break;
                
            case 'skeleton':
                const skHead = this.scene.add.circle(0, -size * 0.25, size * 0.3, 0xeeeeee);
                const skEye1 = this.scene.add.circle(-size * 0.1, -size * 0.28, size * 0.08, 0x111111);
                const skEye2 = this.scene.add.circle(size * 0.1, -size * 0.28, size * 0.08, 0x111111);
                const skNose = this.scene.add.triangle(0, -size * 0.18, -size * 0.04, -size * 0.12, size * 0.04, -size * 0.12, 0, -size * 0.22, 0x333333);
                const skTeeth = this.scene.add.rectangle(0, -size * 0.1, size * 0.2, size * 0.06, 0xdddddd);
                const skBody = this.scene.add.rectangle(0, size * 0.1, size * 0.28, size * 0.42, 0xcccccc);
                const skRibs = this.scene.add.graphics();
                skRibs.lineStyle(2, 0xaaaaaa, 0.8);
                for (let i = 0; i < 3; i++) {
                    skRibs.beginPath();
                    skRibs.moveTo(-size * 0.12, size * (0.02 + i * 0.1));
                    skRibs.lineTo(size * 0.12, size * (0.02 + i * 0.1));
                    skRibs.strokePath();
                }
                const skArm1 = this.scene.add.rectangle(-size * 0.28, size * 0.05, size * 0.1, size * 0.32, 0xcccccc);
                const skArm2 = this.scene.add.rectangle(size * 0.28, size * 0.05, size * 0.1, size * 0.32, 0xcccccc);
                const skLeg1 = this.scene.add.rectangle(-size * 0.08, size * 0.35, size * 0.08, size * 0.25, 0xcccccc);
                const skLeg2 = this.scene.add.rectangle(size * 0.08, size * 0.35, size * 0.08, size * 0.25, 0xcccccc);
                skArm1.rotation = -0.3;
                skArm2.rotation = 0.3;
                this.container.add([skLeg1, skLeg2, skBody, skRibs, skArm1, skArm2, skHead, skEye1, skEye2, skNose, skTeeth]);
                this.skLeg1 = skLeg1;
                this.skLeg2 = skLeg2;
                this.skArm1 = skArm1;
                this.skArm2 = skArm2;
                break;
                
            case 'ghost':
                const gBody = this.scene.add.ellipse(0, 0, size * 0.6, size * 0.8, cfg.color, 0.65);
                const gBodyInner = this.scene.add.ellipse(0, -size * 0.05, size * 0.45, size * 0.6, 0xffffff, 0.3);
                const gEye1 = this.scene.add.circle(-size * 0.15, -size * 0.1, size * 0.13, 0x00ffff);
                const gEye2 = this.scene.add.circle(size * 0.15, -size * 0.1, size * 0.13, 0x00ffff);
                const gEyePupil1 = this.scene.add.circle(-size * 0.15, -size * 0.1, size * 0.06, 0x003366);
                const gEyePupil2 = this.scene.add.circle(size * 0.15, -size * 0.1, size * 0.06, 0x003366);
                const gMouth = this.scene.add.ellipse(0, size * 0.15, size * 0.15, size * 0.1, 0x000033);
                const gTail = this.scene.add.triangle(-size * 0.3, size * 0.35, -size * 0.1, 0, size * 0.1, 0, 0, size * 0.25, cfg.color, 0.6);
                this.container.add([gTail, gBody, gBodyInner, gEye1, gEye2, gEyePupil1, gEyePupil2, gMouth]);
                break;
                
            case 'gargoyle':
                const gargBody = this.scene.add.rectangle(0, 0, size * 0.6, size * 0.75, cfg.color);
                const gargBodyDark = this.scene.add.rectangle(0, size * 0.1, size * 0.5, size * 0.5, cfg.darkColor, 0.5);
                const gargHead = this.scene.add.circle(0, -size * 0.38, size * 0.32, cfg.color);
                const gargHorn1 = this.scene.add.triangle(-size * 0.22, -size * 0.55, -size * 0.12, -size * 0.35, -size * 0.32, -size * 0.38, -size * 0.22, -size * 0.6, cfg.darkColor);
                const gargHorn2 = this.scene.add.triangle(size * 0.22, -size * 0.55, size * 0.12, -size * 0.35, size * 0.32, -size * 0.38, size * 0.22, -size * 0.6, cfg.darkColor);
                const gargEye = this.scene.add.circle(0, -size * 0.38, size * 0.12, 0xff0000);
                const gargEyeGlow = this.scene.add.circle(0, -size * 0.38, size * 0.18, 0xff0000, 0.4);
                const gargWing1 = this.scene.add.triangle(-size * 0.55, -size * 0.1, -size * 0.25, -size * 0.35, -size * 0.25, size * 0.15, -size * 0.55, size * 0.05, cfg.darkColor);
                const gargWing2 = this.scene.add.triangle(size * 0.55, -size * 0.1, size * 0.25, -size * 0.35, size * 0.25, size * 0.15, size * 0.55, size * 0.05, cfg.darkColor);
                const gargClaws1 = this.scene.add.rectangle(-size * 0.25, size * 0.35, size * 0.12, size * 0.15, cfg.darkColor);
                const gargClaws2 = this.scene.add.rectangle(size * 0.25, size * 0.35, size * 0.12, size * 0.15, cfg.darkColor);
                this.container.add([gargWing1, gargWing2, gargBodyDark, gargBody, gargHead, gargHorn1, gargHorn2, gargEyeGlow, gargEye, gargClaws1, gargClaws2]);
                break;
                
            case 'archer':
                const archBody = this.scene.add.rectangle(0, size * 0.1, size * 0.32, size * 0.52, cfg.color);
                const archBelt = this.scene.add.rectangle(0, size * 0.2, size * 0.35, size * 0.06, cfg.darkColor);
                const archHead = this.scene.add.circle(0, -size * 0.2, size * 0.24, 0xddddaa);
                const archHood = this.scene.add.ellipse(0, -size * 0.25, size * 0.28, size * 0.18, cfg.darkColor);
                const archEye = this.scene.add.circle(size * 0.06, -size * 0.22, size * 0.05, 0x000000);
                const archBow = this.scene.add.graphics();
                archBow.lineStyle(4, 0x664422);
                archBow.beginPath();
                archBow.arc(size * 0.38, size * 0.1, size * 0.28, -Math.PI / 2.2, Math.PI / 2.2, false);
                archBow.strokePath();
                const archBowString = this.scene.add.line(size * 0.38, size * 0.1, 0, -size * 0.25, 0, size * 0.25, 0xdddddd);
                const archLeg1 = this.scene.add.rectangle(-size * 0.08, size * 0.4, size * 0.1, size * 0.22, cfg.darkColor);
                const archLeg2 = this.scene.add.rectangle(size * 0.08, size * 0.4, size * 0.1, size * 0.22, cfg.darkColor);
                this.container.add([archLeg1, archLeg2, archBody, archBelt, archHead, archHood, archEye, archBow, archBowString]);
                break;
                
            case 'demon':
                const dBody = this.scene.add.ellipse(0, size * 0.05, size * 0.45, size * 0.55, cfg.color);
                const dBelly = this.scene.add.ellipse(0, size * 0.15, size * 0.3, size * 0.3, cfg.darkColor);
                const dHead = this.scene.add.circle(0, -size * 0.25, size * 0.28, cfg.color);
                const dHorn1 = this.scene.add.triangle(-size * 0.18, -size * 0.5, -size * 0.1, -size * 0.3, -size * 0.25, -size * 0.3, -size * 0.18, -size * 0.55, 0x222222);
                const dHorn2 = this.scene.add.triangle(size * 0.18, -size * 0.5, size * 0.1, -size * 0.3, size * 0.25, -size * 0.3, size * 0.18, -size * 0.55, 0x222222);
                const dEye1 = this.scene.add.circle(-size * 0.1, -size * 0.25, size * 0.08, 0xffff00);
                const dEye2 = this.scene.add.circle(size * 0.1, -size * 0.25, size * 0.08, 0xffff00);
                const dMouth = this.scene.add.ellipse(0, -size * 0.12, size * 0.15, size * 0.08, 0x110000);
                const dTail = this.scene.add.triangle(-size * 0.3, size * 0.3, -size * 0.15, size * 0.2, -size * 0.4, size * 0.4, -size * 0.35, size * 0.5, cfg.darkColor);
                this.container.add([dTail, dBelly, dBody, dHead, dHorn1, dHorn2, dEye1, dEye2, dMouth]);
                break;
        }
        
        this.hpBarBg = this.scene.add.rectangle(0, -size * 0.65, size * 0.9, 6, 0x220000);
        this.hpBar = this.scene.add.rectangle(-size * 0.45, -size * 0.65, size * 0.9, 6, 0xff3344);
        this.hpBar.setOrigin(0, 0.5);
        this.container.add(this.hpBarBg);
        this.container.add(this.hpBar);
    }
    
    screenX() { return this.worldX - this.scene.playerWorldX + GW / 2; }
    screenY() { return this.worldY - this.scene.playerWorldY + GH / 2; }
    
    update(delta, time) {
        if (!this.alive) return;
        
        const dt = delta / 1000;
        
        if (this.stunned > 0 || this.frozen > 0) {
            this.stunned = Math.max(0, this.stunned - delta);
            this.frozen = Math.max(0, this.frozen - delta);
            this.updateSpritePosition();
            return;
        }
        
        if (this.slowed > 0) {
            this.slowed -= delta;
        }
        
        if (this.burning > 0) {
            this.burning -= delta;
            if (Math.random() < dt * 2.5) {
                this.hp -= this.burnDamage;
                this.updateHpBar();
                this.scene.particles.hit(this.screenX(), this.screenY() - 10, 0xff6600, 3, 1);
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
        this.updateWalkAnim(delta);
        
        if (this.wing1 && this.wing2) {
            const flap = Math.sin(time * 0.025) * 0.4;
            this.wing1.rotation = -0.4 + flap;
            this.wing2.rotation = 0.4 - flap;
        }
        
        if (this.slimeBody) {
            const squish = 1 + Math.sin(time * 0.008) * 0.1;
            this.slimeBody.scaleX = squish;
            this.slimeBody.scaleY = 2 - squish;
        }
    }
    
    updateWalkAnim(delta) {
        if (this.currentSpeed < 5) return;
        
        this.walkTimer += delta;
        if (this.walkTimer > 150) {
            this.walkTimer = 0;
            this.walkFrame = (this.walkFrame + 1) % 2;
            
            if (this.skLeg1 && this.skLeg2) {
                const offset = this.walkFrame === 0 ? 0.05 : -0.05;
                this.skLeg1.rotation = offset;
                this.skLeg2.rotation = -offset;
            }
        }
    }
    
    move(dt, time) {
        const px = this.scene.playerWorldX;
        const py = this.scene.playerWorldY;
        const dx = px - this.worldX;
        const dy = py - this.worldY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 5) {
            this.currentSpeed *= 0.9;
            return;
        }
        
        let targetSpeed = this.speed;
        if (this.slowed > 0) targetSpeed *= 0.45;
        
        this.currentSpeed += (targetSpeed - this.currentSpeed) * this.accelRate;
        this.currentSpeed = Math.max(0, Math.min(targetSpeed, this.currentSpeed));
        
        let mx = 0, my = 0;
        
        switch (this.pattern) {
            case 'direct':
                mx = (dx / dist) * this.currentSpeed;
                my = (dy / dist) * this.currentSpeed;
                break;
                
            case 'zigzag':
                const zig = Math.sin(time * 0.008 + this.id) * 40;
                mx = (dx / dist) * this.currentSpeed;
                my = ((dy + zig) / dist) * this.currentSpeed;
                break;
                
            case 'slow':
                mx = (dx / dist) * this.currentSpeed * 0.85;
                my = (dy / dist) * this.currentSpeed * 0.85;
                break;
                
            case 'keepDistance':
                if (dist < 180) {
                    mx = -(dx / dist) * this.currentSpeed * 0.7;
                    my = -(dy / dist) * this.currentSpeed * 0.7;
                } else if (dist > 280) {
                    mx = (dx / dist) * this.currentSpeed * 0.8;
                    my = (dy / dist) * this.currentSpeed * 0.8;
                } else {
                    const perpX = -dy / dist;
                    const perpY = dx / dist;
                    const strafe = Math.sin(time * 0.003 + this.id) * this.currentSpeed * 0.5;
                    mx = perpX * strafe;
                    my = perpY * strafe;
                }
                break;
                
            case 'teleport':
                if (dist > 150 && Math.random() < 0.004) {
                    const angle = Math.random() * Math.PI * 2;
                    this.worldX = px - Math.cos(angle) * 100;
                    this.worldY = py - Math.sin(angle) * 100;
                    this.scene.particles.hit(this.screenX(), this.screenY(), COLORS.enemy.ghost, 10, 2.5);
                    this.currentSpeed = 0;
                    return;
                }
                mx = (dx / dist) * this.currentSpeed;
                my = (dy / dist) * this.currentSpeed;
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
        
        if (cfg.shootArrow && time - this.lastSpecial > 2000 && dist < 380 && dist > 100) {
            this.lastSpecial = time;
            this.shootArrow();
        }
        
        if (cfg.chargeAttack && time - this.lastSpecial > 4000 && dist < 200 && dist > 50) {
            this.lastSpecial = time;
            this.chargeAttack();
        }
    }
    
    diveAttack() {
        const px = this.scene.playerWorldX;
        const py = this.scene.playerWorldY;
        const dx = px - this.worldX;
        const dy = py - this.worldY;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > 0) {
            this.worldX += (dx / d) * 90;
            this.worldY += (dy / d) * 90;
        }
        this.currentSpeed = this.speed * 1.5;
        this.scene.tweens.add({
            targets: this.container,
            scale: { from: 1, to: 1.4, to: 1 },
            duration: 350,
            ease: 'Cubic.easeOut'
        });
    }
    
    throwBone() {
        const px = this.scene.playerWorldX;
        const py = this.scene.playerWorldY;
        this.scene.projectiles.push(new Projectile(
            this.scene, this.worldX, this.worldY, px, py,
            this.damage * 0.7, 'bone',
            { speed: 320, color: 0xd4a574 }
        ));
    }
    
    shootArrow() {
        const px = this.scene.playerWorldX;
        const py = this.scene.playerWorldY;
        this.scene.projectiles.push(new Projectile(
            this.scene, this.worldX, this.worldY, px, py,
            this.damage * 0.85, 'enemyArrow',
            { speed: 380 }
        ));
    }
    
    chargeAttack() {
        const px = this.scene.playerWorldX;
        const py = this.scene.playerWorldY;
        const dx = px - this.worldX;
        const dy = py - this.worldY;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > 0) {
            this.chargeVx = (dx / d) * this.speed * 3;
            this.chargeVy = (dy / d) * this.speed * 3;
            this.charging = 300;
        }
        this.scene.tweens.add({
            targets: this.container,
            scale: { from: 1, to: 1.3, to: 1 },
            duration: 400,
            ease: 'Cubic.easeOut'
        });
    }
    
    checkPlayerCollision() {
        if (this.attackCooldown > 0) return;
        const px = this.scene.playerWorldX;
        const py = this.scene.playerWorldY;
        const d = Phaser.Math.Distance.Between(this.worldX, this.worldY, px, py);
        if (d < this.hitRadius + 22) {
            this.scene.playerTakeDamage(this.damage);
            this.attackCooldown = 900;
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
            dmg = Math.floor(dmg * 0.6);
        }
        
        this.hp -= dmg;
        this.updateHpBar();
        
        this.scene.showDamageNumber(this.screenX(), this.screenY() - 25, dmg, isCrit);
        if (isCrit) {
            this.scene.particles.critEffect(this.screenX(), this.screenY() - 20);
        }
        
        this.scene.tweens.add({
            targets: this.container,
            x: this.screenX() + (Math.random() - 0.5) * 6,
            y: this.screenY() + (Math.random() - 0.5) * 6,
            duration: 40,
            yoyo: true,
            ease: 'Cubic.easeOut'
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
    
    applyFreeze(duration) {
        this.frozen = Math.max(this.frozen, duration);
    }
    
    updateHpBar() {
        if (!this.hpBar) return;
        const ratio = Math.max(0, this.hp / this.maxHp);
        this.hpBar.scaleX = ratio;
    }
    
    die() {
        this.alive = false;
        const cfg = this.config;
        
        this.scene.runtime.killCount++;
        this.scene.runtime.addCombo();
        
        const goldGained = this.scene.runtime.addGold(cfg.gold);
        const leveled = this.scene.runtime.addExp(cfg.exp);
        
        this.scene.particles.goldEffect(this.screenX(), this.screenY(), goldGained);
        this.scene.particles.expEffect(this.screenX(), this.screenY(), Math.ceil(cfg.exp / 8));
        this.scene.particles.hit(this.screenX(), this.screenY(), cfg.color, 15, 4);
        this.scene.particles.explosion(this.screenX(), this.screenY(), cfg.size * 1.2, cfg.color);
        
        const s = this.scene.runtime.spec;
        if (s.lifesteal > 0) {
            const heal = Math.floor(cfg.hp * s.lifesteal * 0.06);
            if (heal > 0) {
                this.scene.runtime.heal(heal);
                this.scene.particles.healEffect(GW / 2, GH / 2 - 20);
            }
        }
        
        this.dropLoot();
        
        if (leveled) {
            this.scene.onLevelUp();
        }
        
        this.scene.tweens.add({
            targets: this.container,
            alpha: 0,
            scale: 0.3,
            rotation: Math.PI / 4,
            duration: 350,
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
        if (Math.random() < 0.18) {
            const types = ['health', 'gold', 'exp', 'shield'];
            const weights = [20, 40, 30, 10];
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
        this.maxEnemies = 45;
        this.waveNumber = 0;
    }
    
    getDifficulty(timeMs) {
        const time = timeMs / 1000;
        const minutes = time / 60;
        return 1 + minutes * 0.45 + Math.pow(minutes, 1.25) * 0.12;
    }
    
    update(time, delta) {
        const difficulty = this.getDifficulty(time);
        const timeSec = time / 1000;
        
        this.spawnInterval = Math.max(450, 2000 - timeSec * 25);
        const spawnCount = Math.min(6, 1 + Math.floor(timeSec / 18));
        
        if (time - this.lastSpawn > this.spawnInterval && this.enemies.filter(e => e.alive).length < this.maxEnemies) {
            this.lastSpawn = time;
            for (let i = 0; i < spawnCount; i++) {
                setTimeout(() => {
                    if (this.scene.gameState === 'playing' && !this.scene.paused) {
                        this.spawnEnemy(difficulty, timeSec);
                    }
                }, i * 80);
            }
        }
        
        this.enemies.forEach(e => e.update(delta, time));
        this.enemies = this.enemies.filter(e => e.alive);
    }
    
    spawnEnemy(difficulty, time) {
        const types = this.getAvailableTypes(time);
        const type = types[Math.floor(Math.random() * types.length)];
        
        const angle = Math.random() * Math.PI * 2;
        const dist = 420 + Math.random() * 180;
        const x = this.scene.playerWorldX + Math.cos(angle) * dist;
        const y = this.scene.playerWorldY + Math.sin(angle) * dist;
        
        const enemy = new Enemy(this.scene, type);
        enemy.spawn(x, y, difficulty);
        this.enemies.push(enemy);
    }
    
    getAvailableTypes(time) {
        const types = ['slime'];
        if (time > 8) types.push('bat');
        if (time > 25) types.push('skeleton');
        if (time > 50) types.push('ghost');
        if (time > 80) types.push('archer');
        if (time > 110) types.push('demon');
        if (time > 140) types.push('gargoyle');
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
        this.container = null;
        this.bobOffset = Math.random() * Math.PI * 2;
        this.spinAngle = 0;
        this.create();
    }
    
    create() {
        const sx = this.screenX();
        const sy = this.screenY();
        
        this.container = this.scene.add.container(sx, sy);
        this.container.setDepth(60);
        
        const glow = this.scene.add.circle(0, 0, 18, 0xffffff, 0.15);
        
        switch (this.type) {
            case 'health':
                const hBg = this.scene.add.circle(0, 0, 12, 0xff4466);
                const hIcon = this.scene.add.text(0, 0, '❤', { fontSize: '16px' }).setOrigin(0.5);
                const hGlow = this.scene.add.circle(0, 0, 16, 0xff4466, 0.3);
                this.container.add([hGlow, glow, hBg, hIcon]);
                break;
            case 'gold':
                const gBg = this.scene.add.circle(0, 0, 11, 0xffd700);
                const gIcon = this.scene.add.text(0, 0, '💰', { fontSize: '14px' }).setOrigin(0.5);
                const gGlow = this.scene.add.circle(0, 0, 15, 0xffd700, 0.3);
                this.container.add([gGlow, glow, gBg, gIcon]);
                break;
            case 'exp':
                const eBg = this.scene.add.star(0, 0, 5, 6, 12, 0xffdd00);
                const eGlow = this.scene.add.circle(0, 0, 15, 0xffdd00, 0.3);
                this.container.add([eGlow, glow, eBg]);
                break;
            case 'shield':
                const sBg = this.scene.add.circle(0, 0, 12, 0x4488ff);
                const sIcon = this.scene.add.text(0, 0, '🛡', { fontSize: '14px' }).setOrigin(0.5);
                const sGlow = this.scene.add.circle(0, 0, 16, 0x4488ff, 0.3);
                this.container.add([sGlow, glow, sBg, sIcon]);
                break;
        }
    }
    
    screenX() { return this.worldX - this.scene.playerWorldX + GW / 2; }
    screenY() { return this.worldY - this.scene.playerWorldY + GH / 2; }
    
    update(time, delta) {
        if (!this.alive) return;
        
        const bob = Math.sin(time * 0.004 + this.bobOffset) * 6;
        this.spinAngle += delta * 0.003;
        this.container.x = this.screenX();
        this.container.y = this.screenY() + bob;
        this.container.rotation = Math.sin(this.spinAngle) * 0.1;
        
        const d = Phaser.Math.Distance.Between(
            this.worldX, this.worldY,
            this.scene.playerWorldX, this.scene.playerWorldY
        );
        if (d < 40) {
            this.pickup();
        } else if (d < 120) {
            const pullSpeed = 200 * (1 - d / 120);
            const dx = this.scene.playerWorldX - this.worldX;
            const dy = this.scene.playerWorldY - this.worldY;
            const len = Math.sqrt(dx * dx + dy * dy);
            if (len > 0) {
                this.worldX += (dx / len) * pullSpeed * (delta / 1000);
                this.worldY += (dy / len) * pullSpeed * (delta / 1000);
            }
        }
    }
    
    pickup() {
        this.alive = false;
        this.scene.audio.play('pickup');
        
        switch (this.type) {
            case 'health':
                const heal = this.scene.runtime.heal(35);
                if (heal > 0) this.scene.particles.healEffect(GW / 2, GH / 2 - 20);
                break;
            case 'gold':
                const gold = this.scene.runtime.addGold(20);
                this.scene.particles.goldEffect(this.screenX(), this.screenY(), Math.min(8, Math.ceil(gold / 3)));
                break;
            case 'exp':
                const leveled = this.scene.runtime.addExp(25);
                this.scene.particles.expEffect(this.screenX(), this.screenY(), 4);
                if (leveled) this.scene.onLevelUp();
                break;
            case 'shield':
                this.scene.runtime.shield += 30;
                break;
        }
        
        this.scene.particles.hit(this.screenX(), this.screenY(), 0xffffff, 8, 3);
        this.container.destroy();
        this.container = null;
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
        this.speed = 0;
        this.currentSpeed = 0;
        this.accelRate = 0.015;
        this.hitRadius = 50;
        this.container = null;
        this.hpBar = null;
        this.hpBarBg = null;
        this.nameText = null;
        this.lastSpecial = 0;
        this.specialCooldown = 5000;
        this.attackCooldown = 0;
        this.phase = 1;
        this.rageMode = false;
        this.bossLevel = 1;
    }
    
    get config() {
        const configs = {
            gk: { name: '哥布林王', hp: 1000, dmg: 28, spd: 40, radius: 55, color: COLORS.boss.gk, glowColor: COLORS.boss.gkGlow, exp: 120, gold: 100, size: 100 },
            sl: { name: '骷髅领主', hp: 1800, dmg: 38, spd: 32, radius: 60, color: COLORS.boss.sl, glowColor: COLORS.boss.slGlow, exp: 250, gold: 180, size: 115 },
            sd: { name: '暗影龙', hp: 3200, dmg: 55, spd: 45, radius: 70, color: COLORS.boss.sd, glowColor: COLORS.boss.sdGlow, exp: 500, gold: 350, size: 135 },
            dl: { name: '深渊魔王', hp: 5500, dmg: 75, spd: 38, radius: 80, color: COLORS.boss.dl, glowColor: COLORS.boss.dlGlow, exp: 1000, gold: 700, size: 160 },
            tt: { name: '泰坦守卫', hp: 8000, dmg: 100, spd: 28, radius: 90, color: COLORS.boss.tt, glowColor: COLORS.boss.ttGlow, exp: 1500, gold: 1000, size: 180 }
        };
        return configs[this.type] || configs.gk;
    }
    
    spawn(difficulty = 1, level = 1) {
        const cfg = this.config;
        this.bossLevel = level;
        this.worldX = this.scene.playerWorldX;
        this.worldY = this.scene.playerWorldY - 250;
        this.hp = Math.floor(cfg.hp * difficulty * (1 + (level - 1) * 0.3));
        this.maxHp = this.hp;
        this.damage = Math.floor(cfg.dmg * difficulty * (1 + (level - 1) * 0.2));
        this.speed = cfg.spd;
        this.currentSpeed = 0;
        this.hitRadius = cfg.radius;
        this.alive = true;
        this.phase = 1;
        this.rageMode = false;
        this.lastSpecial = 0;
        this.attackCooldown = 0;
        
        this.createSprite();
        this.scene.audio.play('boss');
        this.scene.cameras.main.shake(800, 0.02);
        return this;
    }
    
    createSprite() {
        const cfg = this.config;
        const sx = GW / 2;
        const sy = GH / 2 - 250;
        const size = cfg.size;
        
        this.container = this.scene.add.container(sx, sy);
        this.container.setDepth(80);
        
        const aura = this.scene.add.circle(0, 0, size * 0.8, cfg.glowColor, 0.15);
        const aura2 = this.scene.add.circle(0, 0, size * 0.6, cfg.glowColor, 0.25);
        
        const body = this.scene.add.circle(0, 0, size * 0.55, cfg.color);
        const bodyDark = this.scene.add.circle(0, size * 0.1, size * 0.45, cfg.glowColor, 0.3);
        
        const head = this.scene.add.circle(0, -size * 0.38, size * 0.35, cfg.color);
        const eye1 = this.scene.add.circle(-size * 0.14, -size * 0.4, size * 0.1, 0xff0000);
        const eye2 = this.scene.add.circle(size * 0.14, -size * 0.4, size * 0.1, 0xff0000);
        const eyeGlow1 = this.scene.add.circle(-size * 0.14, -size * 0.4, size * 0.15, 0xff0000, 0.4);
        const eyeGlow2 = this.scene.add.circle(size * 0.14, -size * 0.4, size * 0.15, 0xff0000, 0.4);
        
        const crown = this.scene.add.graphics();
        crown.fillStyle(0xffd700, 1);
        crown.beginPath();
        crown.moveTo(-size * 0.3, -size * 0.55);
        crown.lineTo(-size * 0.2, -size * 0.7);
        crown.lineTo(-size * 0.1, -size * 0.6);
        crown.lineTo(0, -size * 0.75);
        crown.lineTo(size * 0.1, -size * 0.6);
        crown.lineTo(size * 0.2, -size * 0.7);
        crown.lineTo(size * 0.3, -size * 0.55);
        crown.lineTo(size * 0.25, -size * 0.5);
        crown.lineTo(-size * 0.25, -size * 0.5);
        crown.closePath();
        crown.fillPath();
        
        const crownGem = this.scene.add.circle(0, -size * 0.62, size * 0.06, 0xff0000);
        
        const leftArm = this.scene.add.ellipse(-size * 0.55, 0, size * 0.18, size * 0.4, cfg.color);
        const rightArm = this.scene.add.ellipse(size * 0.55, 0, size * 0.18, size * 0.4, cfg.color);
        const leftHand = this.scene.add.circle(-size * 0.6, size * 0.3, size * 0.15, cfg.glowColor);
        const rightHand = this.scene.add.circle(size * 0.6, size * 0.3, size * 0.15, cfg.glowColor);
        
        this.container.add([aura, aura2, bodyDark, body, leftArm, rightArm, leftHand, rightHand, head, crown, crownGem, eyeGlow1, eyeGlow2, eye1, eye2]);
        
        this.bossAura = aura;
        this.bossBody = body;
        this.bossLeftArm = leftArm;
        this.bossRightArm = rightArm;
        
        this.hpBarBg = this.scene.add.rectangle(GW / 2, 75, 550, 22, 0x1a0000).setOrigin(0.5);
        this.hpBarBg.setDepth(200);
        this.hpBarBg.setScrollFactor(0);
        this.hpBarBg.setStrokeStyle(3, 0x440000);
        
        this.hpBarBgInner = this.scene.add.rectangle(GW / 2, 75, 544, 16, 0x330000).setOrigin(0.5);
        this.hpBarBgInner.setDepth(201);
        this.hpBarBgInner.setScrollFactor(0);
        
        this.hpBar = this.scene.add.rectangle(GW / 2 - 272, 75, 544, 16, 0xff2244).setOrigin(0, 0.5);
        this.hpBar.setDepth(202);
        this.hpBar.setScrollFactor(0);
        
        this.hpBarGlow = this.scene.add.rectangle(GW / 2 - 272, 75, 544, 16, 0xffffff, 0.3).setOrigin(0, 0.5);
        this.hpBarGlow.setDepth(203);
        this.hpBarGlow.setScrollFactor(0);
        
        this.nameText = this.scene.add.text(GW / 2, 45, `${cfg.name}  Lv.${this.bossLevel}`, {
            fontSize: '22px',
            fontFamily: 'Courier New',
            color: '#ff4466',
            stroke: '#000',
            strokeThickness: 4,
            fontWeight: 'bold'
        }).setOrigin(0.5);
        this.nameText.setDepth(204);
        this.nameText.setScrollFactor(0);
        
        this.scene.tweens.add({
            targets: this.container,
            alpha: { from: 0, to: 1 },
            scale: { from: 0.2, to: 1 },
            duration: 1200,
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
            this.speed *= 1.35;
            this.specialCooldown *= 0.65;
            this.rageMode = true;
            this.scene.cameras.main.shake(500, 0.018);
            this.scene.particles.explosion(this.screenX(), this.screenY(), 150, this.config.glowColor);
            
            const rageText = this.scene.add.text(this.screenX(), this.screenY() - 80, '狂暴！', {
                fontSize: '32px',
                fontFamily: 'Courier New',
                color: '#ff0000',
                stroke: '#000',
                strokeThickness: 4,
                fontWeight: 'bold'
            }).setOrigin(0.5).setDepth(250);
            this.scene.tweens.add({
                targets: rageText,
                alpha: 0,
                scale: 2,
                y: this.screenY() - 120,
                duration: 1000,
                ease: 'Cubic.easeOut',
                onComplete: () => rageText.destroy()
            });
        }
        
        if (this.hp < this.maxHp * 0.25 && this.phase === 2) {
            this.phase = 3;
            this.speed *= 1.2;
            this.specialCooldown *= 0.7;
            this.scene.cameras.main.shake(600, 0.02);
        }
        
        this.move(dt);
        this.specialAttack(time);
        this.checkPlayerCollision();
        this.updateSpritePosition();
        this.updateAnim(time);
    }
    
    updateAnim(time) {
        const pulse = 1 + Math.sin(time * 0.004) * 0.05;
        if (this.bossAura) {
            this.bossAura.scale = pulse * (this.rageMode ? 1.3 : 1);
            this.bossAura.alpha = 0.15 + Math.sin(time * 0.006) * 0.1;
        }
        if (this.bossBody) {
            this.bossBody.scale = 1 + Math.sin(time * 0.003) * 0.02;
        }
        if (this.bossLeftArm && this.bossRightArm) {
            const swing = Math.sin(time * 0.002) * 0.15;
            this.bossLeftArm.rotation = -0.3 + swing;
            this.bossRightArm.rotation = 0.3 - swing;
        }
    }
    
    move(dt) {
        const px = this.scene.playerWorldX;
        const py = this.scene.playerWorldY;
        const dx = px - this.worldX;
        const dy = py - this.worldY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 70) {
            this.currentSpeed *= 0.92;
            return;
        }
        
        const targetSpeed = this.speed * (this.phase >= 2 ? 1.2 : 1);
        this.currentSpeed += (targetSpeed - this.currentSpeed) * this.accelRate;
        this.currentSpeed = Math.max(0, Math.min(targetSpeed, this.currentSpeed));
        
        this.worldX += (dx / dist) * this.currentSpeed * dt;
        this.worldY += (dy / dist) * this.currentSpeed * dt;
    }
    
    specialAttack(time) {
        if (time - this.lastSpecial < this.specialCooldown) return;
        this.lastSpecial = time;
        
        const attacks = ['shootProjectiles', 'spawnMinions', 'chargeAttack', 'aoeAttack', 'laserBeam'];
        const attack = attacks[Math.floor(Math.random() * attacks.length)];
        this[attack]();
    }
    
    shootProjectiles() {
        const count = this.phase === 3 ? 12 : (this.phase === 2 ? 8 : 5);
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const tx = this.worldX + Math.cos(angle) * 200;
            const ty = this.worldY + Math.sin(angle) * 200;
            this.scene.projectiles.push(new Projectile(
                this.scene, this.worldX, this.worldY, tx, ty,
                this.damage * 0.6, 'enemyArrow',
                { speed: 280, color: this.config.glowColor, size: 10 }
            ));
        }
        this.scene.particles.explosion(this.screenX(), this.screenY(), 80, this.config.glowColor);
    }
    
    spawnMinions() {
        const count = this.phase === 3 ? 6 : (this.phase === 2 ? 4 : 3);
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 120 + Math.random() * 60;
            const x = this.worldX + Math.cos(angle) * dist;
            const y = this.worldY + Math.sin(angle) * dist;
            
            const types = ['slime', 'skeleton', 'bat'];
            const type = types[Math.floor(Math.random() * types.length)];
            const enemy = new Enemy(this.scene, type);
            enemy.spawn(x, y, 0.9);
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
            this.worldX += (dx / d) * 180;
            this.worldY += (dy / d) * 180;
        }
        this.currentSpeed = this.speed * 2;
        this.scene.tweens.add({
            targets: this.container,
            scale: { from: 1, to: 1.5, to: 1 },
            duration: 500,
            ease: 'Cubic.easeOut'
        });
        this.scene.cameras.main.shake(300, 0.015);
    }
    
    aoeAttack() {
        const radius = this.phase === 3 ? 220 : (this.phase === 2 ? 180 : 140);
        this.scene.particles.explosion(this.screenX(), this.screenY(), radius, this.config.color);
        
        const d = Phaser.Math.Distance.Between(
            this.worldX, this.worldY,
            this.scene.playerWorldX, this.scene.playerWorldY
        );
        if (d < radius) {
            this.scene.playerTakeDamage(this.damage * 0.9);
        }
        
        this.scene.cameras.main.shake(400, 0.02);
    }
    
    laserBeam() {
        const px = this.scene.playerWorldX;
        const py = this.scene.playerWorldY;
        const angle = Math.atan2(py - this.worldY, px - this.worldX);
        
        const endX = this.worldX + Math.cos(angle) * 600;
        const endY = this.worldY + Math.sin(angle) * 600;
        
        this.scene.particles.lineBeam(
            this.screenX(), this.screenY(),
            this.screenX() + Math.cos(angle) * 600,
            this.screenY() + Math.sin(angle) * 600,
            this.config.glowColor, 20
        );
        
        const hit = this.scene.enemyManager.pointToLineDistance(
            this.scene.playerWorldX, this.scene.playerWorldY,
            this.worldX, this.worldY, endX, endY
        );
        if (hit < 35) {
            this.scene.playerTakeDamage(this.damage * 0.7);
        }
        
        this.scene.cameras.main.shake(250, 0.012);
    }
    
    checkPlayerCollision() {
        if (this.attackCooldown > 0) return;
        const d = Phaser.Math.Distance.Between(
            this.worldX, this.worldY,
            this.scene.playerWorldX, this.scene.playerWorldY
        );
        if (d < this.hitRadius + 25) {
            this.scene.playerTakeDamage(this.damage);
            this.attackCooldown = 1200;
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
        
        this.scene.showDamageNumber(this.screenX(), this.screenY() - 50, amount, isCrit);
        if (isCrit) {
            this.scene.particles.critEffect(this.screenX(), this.screenY() - 40);
        }
        
        this.scene.tweens.add({
            targets: this.container,
            x: this.screenX() + (Math.random() - 0.5) * 8,
            y: this.screenY() + (Math.random() - 0.5) * 8,
            duration: 50,
            yoyo: true,
            ease: 'Cubic.easeOut'
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
        this.hpBarGlow.scaleX = ratio;
        
        if (ratio < 0.3) {
            this.hpBar.fillColor = 0xff0000;
        } else if (ratio < 0.6) {
            this.hpBar.fillColor = 0xff8800;
        }
    }
    
    die() {
        this.alive = false;
        const cfg = this.config;
        
        this.scene.runtime.bossKills++;
        this.scene.runtime.addGold(cfg.gold);
        const leveled = this.scene.runtime.addExp(cfg.exp);
        
        this.scene.particles.bossDefeat(this.screenX(), this.screenY());
        this.scene.cameras.main.shake(1200, 0.025);
        
        for (let i = 0; i < 8; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 60 + Math.random() * 80;
            this.scene.items.push(new PickupItem(
                this.scene,
                ['health', 'gold', 'exp', 'shield'][Math.floor(Math.random() * 4)],
                this.worldX + Math.cos(angle) * dist,
                this.worldY + Math.sin(angle) * dist
            ));
        }
        
        if (leveled) this.scene.onLevelUp();
        
        if (this.bossLevel > this.scene.saveData.highestBoss) {
            this.scene.saveData.highestBoss = this.bossLevel;
        }
        
        this.scene.time.delayedCall(1500, () => {
            this.scene.showBossReward();
        });
        
        this.scene.tweens.add({
            targets: [this.container, this.hpBar, this.hpBarBg, this.hpBarBgInner, this.hpBarGlow, this.nameText],
            alpha: 0,
            scale: 0,
            duration: 800,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                if (this.container) this.container.destroy();
                if (this.hpBar) this.hpBar.destroy();
                if (this.hpBarBg) this.hpBarBg.destroy();
                if (this.hpBarBgInner) this.hpBarBgInner.destroy();
                if (this.hpBarGlow) this.hpBarGlow.destroy();
                if (this.nameText) this.nameText.destroy();
            }
        });
    }
}

class BossManager {
    constructor(scene) {
        this.scene = scene;
        this.boss = null;
        this.bossTypes = ['gk', 'sl', 'sd', 'dl', 'tt'];
        this.currentBossIndex = 0;
        this.lastBossTime = 0;
        this.bossInterval = 60000;
        this.warningActive = false;
        this.warningTimer = 0;
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
        this.warningTimer = 3000;
        this.scene.audio.play('bossWarning');
        
        const warningBg = this.scene.add.rectangle(0, 0, GW, GH, 0xff0000, 0.0).setOrigin(0).setDepth(290);
        
        const warningTop = this.scene.add.rectangle(0, 0, GW, 60, 0xff0000, 0.6).setOrigin(0).setDepth(291);
        const warningBottom = this.scene.add.rectangle(0, GH - 60, GW, 60, 0xff0000, 0.6).setOrigin(0).setDepth(291);
        
        const warning = this.scene.add.text(GW / 2, GH / 2, '⚠ BOSS 来袭！ ⚠', {
            fontSize: '52px',
            fontFamily: 'Courier New',
            color: '#ff2244',
            stroke: '#000000',
            strokeThickness: 6,
            fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(300);
        
        const warningSub = this.scene.add.text(GW / 2, GH / 2 + 50, '准备战斗！', {
            fontSize: '24px',
            fontFamily: 'Courier New',
            color: '#ffaa00',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(0.5).setDepth(300);
        
        const skull1 = this.scene.add.text(GW / 2 - 150, GH / 2, '💀', { fontSize: '48px' }).setOrigin(0.5).setDepth(299);
        const skull2 = this.scene.add.text(GW / 2 + 150, GH / 2, '💀', { fontSize: '48px' }).setOrigin(0.5).setDepth(299);
        
        let flashCount = 0;
        const flashInterval = setInterval(() => {
            flashCount++;
            if (flashCount % 2 === 0) {
                warningBg.setAlpha(0.15);
                warningTop.setAlpha(0.8);
                warningBottom.setAlpha(0.8);
            } else {
                warningBg.setAlpha(0);
                warningTop.setAlpha(0.6);
                warningBottom.setAlpha(0.6);
            }
            if (flashCount > 8) clearInterval(flashInterval);
        }, 300);
        
        this.scene.tweens.add({
            targets: [warning, warningSub, skull1, skull2],
            alpha: { from: 0, to: 1, to: 0, to: 1, to: 0, to: 1 },
            scale: { from: 0.5, to: 1.3, to: 1, to: 1.3, to: 0.9, to: 1 },
            duration: 3000,
            ease: 'Cubic.easeInOut',
            onComplete: () => {
                warning.destroy();
                warningSub.destroy();
                warningBg.destroy();
                warningTop.destroy();
                warningBottom.destroy();
                skull1.destroy();
                skull2.destroy();
                this.spawnBoss(time);
            }
        });
        
        this.scene.cameras.main.shake(3000, 0.012);
    }
    
    spawnBoss(time) {
        this.warningActive = false;
        const type = this.bossTypes[this.currentBossIndex % this.bossTypes.length];
        const level = Math.floor(this.currentBossIndex / this.bossTypes.length) + 1;
        const difficulty = 1 + (time / 1000) / 60 * 0.6;
        
        this.boss = new Boss(this.scene, type);
        this.boss.spawn(difficulty, level);
        this.currentBossIndex++;
    }
    
    onBossDefeated(time) {
        this.lastBossTime = time / 1000;
        this.bossInterval = Math.max(45000, this.bossInterval - 3000);
    }
}

// ==================== 随从系统 ====================
class Minion {
    constructor(scene, type) {
        this.scene = scene;
        this.type = type;
        this.worldX = 0;
        this.worldY = 0;
        this.container = null;
        this.lastAttack = 0;
        this.attackInterval = 1500;
        this.damage = 10;
        this.orbitAngle = Math.random() * Math.PI * 2;
        this.orbitSpeed = 0.002;
        this.orbitRadius = 65;
    }
    
    get config() {
        const configs = {
            light: { name: '光明精灵', dmg: 15, interval: 1000, color: 0xffee88, glowColor: 0xffffaa, size: 18 },
            shadow: { name: '暗影战士', dmg: 25, interval: 1800, color: 0x6644aa, glowColor: 0x8866cc, size: 24 },
            fire: { name: '火焰精灵', dmg: 20, interval: 1200, color: 0xff6622, glowColor: 0xffaa44, size: 20 }
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
        
        const glow = this.scene.add.circle(0, 0, cfg.size * 1.8, cfg.glowColor, 0.3);
        const glow2 = this.scene.add.circle(0, 0, cfg.size * 1.3, cfg.glowColor, 0.5);
        const body = this.scene.add.circle(0, 0, cfg.size, cfg.color);
        const core = this.scene.add.circle(0, 0, cfg.size * 0.5, 0xffffff, 0.8);
        
        if (this.type === 'light') {
            const wing1 = this.scene.add.ellipse(-cfg.size * 0.9, 0, cfg.size * 0.7, cfg.size * 0.35, 0xffffcc, 0.7);
            const wing2 = this.scene.add.ellipse(cfg.size * 0.9, 0, cfg.size * 0.7, cfg.size * 0.35, 0xffffcc, 0.7);
            wing1.rotation = -0.3;
            wing2.rotation = 0.3;
            this.wing1 = wing1;
            this.wing2 = wing2;
            this.container.add([glow, glow2, wing1, wing2, body, core]);
        } else if (this.type === 'shadow') {
            const scythe = this.scene.add.rectangle(cfg.size * 0.8, -cfg.size * 0.3, 5, cfg.size * 1.6, 0x220033);
            scythe.rotation = 0.3;
            const eyes = this.scene.add.circle(0, -cfg.size * 0.1, cfg.size * 0.4, 0xff0000);
            this.container.add([glow, glow2, body, scythe, eyes, core]);
        } else {
            const flame1 = this.scene.add.triangle(-cfg.size * 0.3, -cfg.size * 0.5, -cfg.size * 0.5, 0, 0, -cfg.size * 0.8, cfg.size * 0.2, -cfg.size * 0.5, cfg.glowColor);
            const flame2 = this.scene.add.triangle(cfg.size * 0.3, -cfg.size * 0.4, cfg.size * 0.1, -cfg.size * 0.2, cfg.size * 0.5, -cfg.size * 0.7, cfg.size * 0.4, -cfg.size * 0.5, cfg.color);
            this.container.add([glow, glow2, flame1, flame2, body, core]);
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
        
        this.worldX += (targetX - this.worldX) * 0.08;
        this.worldY += (targetY - this.worldY) * 0.08;
        
        this.container.x = this.screenX();
        this.container.y = this.screenY();
        
        if (this.wing1 && this.wing2) {
            const flap = Math.sin(time * 0.03) * 0.3;
            this.wing1.rotation = -0.3 + flap;
            this.wing2.rotation = 0.3 - flap;
        }
        
        if (time - this.lastAttack > this.attackInterval) {
            this.attack(time);
        }
    }
    
    attack(time) {
        const target = this.findTarget();
        if (!target) return;
        
        this.lastAttack = time;
        const cfg = this.config;
        const s = this.scene.runtime.spec;
        const dmg = Math.floor(cfg.dmg * (1 + s.atk * 0.1) * (1 + s.weaponDmg * 0.15));
        
        this.scene.projectiles.push(new Projectile(
            this.scene, this.worldX, this.worldY,
            target.worldX, target.worldY,
            dmg, 'magic',
            { speed: 450, color: cfg.color, glowColor: cfg.glowColor, tracking: true, size: 6 }
        ));
        
        this.scene.audio.play('minion');
    }
    
    findTarget() {
        let nearest = null;
        let nearestDist = Infinity;
        for (const e of this.scene.enemyManager.enemies) {
            if (!e.alive) continue;
            const d = Phaser.Math.Distance.Between(this.worldX, this.worldY, e.worldX, e.worldY);
            if (d < nearestDist && d < 400) {
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
    { id: 'first_blood', name: '初战告捷', icon: '🗡', desc: '击杀第一个敌人' },
    { id: 'killer_10', name: '小试牛刀', icon: '⚔', desc: '击杀10个敌人' },
    { id: 'killer_50', name: '杀戮者', icon: '💀', desc: '击杀50个敌人' },
    { id: 'killer_100', name: '百人斩', icon: '☠', desc: '击杀100个敌人' },
    { id: 'survive_60', name: '坚持者', icon: '⏱', desc: '存活60秒' },
    { id: 'survive_180', name: '生存大师', icon: '🏆', desc: '存活180秒' },
    { id: 'survive_300', name: '不朽传说', icon: '👑', desc: '存活300秒' },
    { id: 'boss_1', name: '屠龙勇士', icon: '🐉', desc: '击败第一个Boss' },
    { id: 'boss_3', name: 'Boss杀手', icon: '💎', desc: '击败3个Boss' },
    { id: 'level_5', name: '成长中', icon: '⭐', desc: '达到5级' },
    { id: 'level_10', name: '强者', icon: '🌟', desc: '达到10级' },
    { id: 'level_15', name: '传说', icon: '✨', desc: '达到15级' },
    { id: 'combo_10', name: '连击高手', icon: '🔥', desc: '达成10连击' },
    { id: 'combo_20', name: '连击大师', icon: '💥', desc: '达成20连击' },
    { id: 'gold_100', name: '小富翁', icon: '💰', desc: '累计获得100金币' },
    { id: 'gold_500', name: '大富翁', icon: '💎', desc: '累计获得500金币' },
    { id: 'crit_master', name: '暴击大师', icon: '🎯', desc: '单次暴击伤害超过200' }
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
        this.screenShake = 0;
        
        this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE,ESC');
        this.mousePos = { x: GW / 2 + 100, y: GH / 2 };
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
        for (let i = 0; i < 120; i++) {
            this.bgStars.push({
                x: Math.random() * WS - WS / 2,
                y: Math.random() * WS - WS / 2,
                size: Math.random() * 2.5 + 0.5,
                alpha: Math.random() * 0.6 + 0.15,
                twinkle: Math.random() * Math.PI * 2
            });
        }
        this.bgTrees = [];
        for (let i = 0; i < 40; i++) {
            this.bgTrees.push({
                x: Math.random() * WS - WS / 2,
                y: Math.random() * WS - WS / 2,
                size: 20 + Math.random() * 30,
                type: Math.floor(Math.random() * 3)
            });
        }
        this.bgRocks = [];
        for (let i = 0; i < 30; i++) {
            this.bgRocks.push({
                x: Math.random() * WS - WS / 2,
                y: Math.random() * WS - WS / 2,
                size: 8 + Math.random() * 20
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
        
        g.lineStyle(1, 0x1a1a35, 0.3);
        for (let x = ox; x < GW; x += gridSize) {
            g.beginPath(); g.moveTo(x, 0); g.lineTo(x, GH); g.strokePath();
        }
        for (let y = oy; y < GH; y += gridSize) {
            g.beginPath(); g.moveTo(0, y); g.lineTo(GW, y); g.strokePath();
        }
        
        const time = this.time.now;
        this.bgStars.forEach(s => {
            const sx = s.x - this.playerWorldX * 0.3 + GW / 2;
            const sy = s.y - this.playerWorldY * 0.3 + GH / 2;
            if (sx > -10 && sx < GW + 10 && sy > -10 && sy < GH + 10) {
                const twinkle = 0.7 + Math.sin(time * 0.002 + s.twinkle) * 0.3;
                g.fillStyle(0xffffff, s.alpha * twinkle);
                g.fillCircle(sx, sy, s.size);
            }
        });
        
        this.bgRocks.forEach(r => {
            const sx = r.x - this.playerWorldX * 0.6 + GW / 2;
            const sy = r.y - this.playerWorldY * 0.6 + GH / 2;
            if (sx > -50 && sx < GW + 50 && sy > -50 && sy < GH + 50) {
                g.fillStyle(0x2a2a4a, 0.8);
                g.fillEllipse(sx, sy + r.size * 0.3, r.size * 1.2, r.size * 0.5);
                g.fillStyle(0x3a3a5a, 0.9);
                g.fillCircle(sx, sy, r.size * 0.7);
            }
        });
        
        this.bgTrees.forEach(t => {
            const sx = t.x - this.playerWorldX * 0.5 + GW / 2;
            const sy = t.y - this.playerWorldY * 0.5 + GH / 2;
            if (sx > -60 && sx < GW + 60 && sy > -60 && sy < GH + 60) {
                g.fillStyle(0x1a1a1a, 0.5);
                g.fillRect(sx - 3, sy - t.size * 0.2, 6, t.size * 0.5);
                g.fillStyle(0x1a3a2a, 0.7);
                g.fillTriangle(sx, sy - t.size, sx - t.size * 0.5, sy - t.size * 0.1, sx + t.size * 0.5, sy - t.size * 0.1);
                g.fillStyle(0x1a4a3a, 0.6);
                g.fillTriangle(sx, sy - t.size * 0.8, sx - t.size * 0.4, sy - t.size * 0.05, sx + t.size * 0.4, sy - t.size * 0.05);
            }
        });
        
        const edgeDist = WS / 2 - 150;
        if (Math.abs(this.playerWorldX) > edgeDist || Math.abs(this.playerWorldY) > edgeDist) {
            const edgeAlpha = Math.min(0.2, (Math.max(Math.abs(this.playerWorldX), Math.abs(this.playerWorldY)) - edgeDist) / 200);
            g.fillStyle(0xff0000, edgeAlpha);
            g.fillRect(0, 0, GW, GH);
        }
    }
    
    createPlayer() {
        this.player = this.add.container(GW / 2, GH / 2);
        this.player.setDepth(100);
        
        const shadow = this.add.ellipse(0, 18, 24, 8, 0x000000, 0.3);
        const cape = this.add.triangle(-6, 5, -12, -8, -22, 30, -4, 22, 0x2244aa);
        const capeDark = this.add.triangle(-8, 8, -14, -5, -20, 28, -6, 20, 0x1a3377, 0.6);
        const body = this.add.ellipse(0, 5, 20, 28, COLORS.playerBody);
        const bodyDark = this.add.ellipse(0, 10, 16, 12, COLORS.playerBodyDark, 0.5);
        const head = this.add.circle(0, -14, 15, COLORS.playerHead);
        const hair = this.add.ellipse(0, -20, 15, 9, COLORS.playerHair);
        const hairFront = this.add.ellipse(0, -22, 12, 6, COLORS.playerHair, 0.8);
        const eye1 = this.add.circle(-5, -15, 3, 0x222233);
        const eye2 = this.add.circle(5, -15, 3, 0x222233);
        const eyeShine1 = this.add.circle(-4, -16, 1.2, 0xffffff);
        const eyeShine2 = this.add.circle(6, -16, 1.2, 0xffffff);
        const belt = this.add.rectangle(0, 8, 22, 5, 0x8B4513);
        const buckle = this.add.rectangle(0, 8, 6, 7, 0xffd700);
        
        this.player.add([shadow, capeDark, cape, body, bodyDark, belt, buckle, head, hair, hairFront, eye1, eye2, eyeShine1, eyeShine2]);
        
        this.playerBody = body;
        this.playerHead = head;
        this.weaponContainer = this.add.container(28, 0);
        this.weaponContainer.setDepth(101);
        this.player.add(this.weaponContainer);
    }
    
    createWeaponVisual(type) {
        this.weaponContainer.removeAll(true);
        
        switch (type) {
            case 'sword':
                const blade = this.add.rectangle(12, 0, 32, 7, 0xddddff);
                const bladeEdge = this.add.rectangle(12, -2, 30, 3, 0xffffff, 0.6);
                const hilt = this.add.rectangle(-8, 0, 10, 14, 0x8B4513);
                const guard = this.add.rectangle(2, 0, 5, 20, 0xffd700);
                const pommel = this.add.circle(-15, 0, 5, 0xffd700);
                this.weaponContainer.add([pommel, hilt, guard, blade, bladeEdge]);
                break;
            case 'axe':
                const handle = this.add.rectangle(2, 0, 40, 6, 0x8B4513);
                const handleWrap1 = this.add.rectangle(-8, 0, 4, 8, 0x654321);
                const handleWrap2 = this.add.rectangle(-15, 0, 4, 7, 0x654321);
                const axeHead = this.add.triangle(22, 0, 8, -22, 32, -12, 32, 12, 8, 22, 0xcccccc);
                const axeHeadEdge = this.add.triangle(24, 0, 10, -18, 30, -10, 30, 10, 10, 18, 0xeeeeee, 0.5);
                const axeBack = this.add.rectangle(10, 0, 8, 14, 0xaaaaaa);
                this.weaponContainer.add([handleWrap2, handleWrap1, handle, axeBack, axeHead, axeHeadEdge]);
                break;
            case 'staff':
                const st = this.add.rectangle(0, 0, 38, 6, 0x6B4423);
                const stWrap1 = this.add.rectangle(-10, 0, 4, 9, 0x4B3413);
                const stWrap2 = this.add.rectangle(10, 0, 4, 9, 0x4B3413);
                const gem = this.add.circle(22, 0, 10, 0x00ffff);
                const gemInner = this.add.circle(22, 0, 6, 0xffffff, 0.6);
                const gemGlow = this.add.circle(22, 0, 18, 0x00ffff, 0.3);
                const gemGlow2 = this.add.circle(22, 0, 25, 0x00ffff, 0.15);
                this.weaponContainer.add([stWrap1, stWrap2, st, gemGlow2, gemGlow, gem, gemInner]);
                break;
            case 'bow':
                const bow = this.add.graphics();
                bow.lineStyle(5, 0x8B4513);
                bow.beginPath();
                bow.arc(0, 0, 24, -Math.PI / 2.3, Math.PI / 2.3, false);
                bow.strokePath();
                const bowLimb = this.add.circle(0, -20, 4, 0x654321);
                const bowLimb2 = this.add.circle(0, 20, 4, 0x654321);
                const string = this.add.line(2, 0, 0, -18, 0, 18, 0xeeeeee);
                const arrowRest = this.add.rectangle(8, 0, 6, 3, 0x8B4513);
                this.weaponContainer.add([bowLimb, bowLimb2, bow, string, arrowRest]);
                break;
            case 'wand':
                const wd = this.add.rectangle(-2, 0, 30, 6, 0x3a1a5a);
                const wdWrap = this.add.rectangle(-12, 0, 5, 9, 0x2a0a4a);
                const star1 = this.add.star(18, 0, 6, 5, 12, 0xff66ff);
                const star2 = this.add.star(18, 0, 6, 2.5, 7, 0xffffff);
                const starGlow = this.add.circle(18, 0, 20, 0xff66ff, 0.25);
                this.weaponContainer.add([wdWrap, wd, starGlow, star1, star2]);
                break;
        }
    }
    
    createHUD() {
        this.hpBarBg = this.add.rectangle(22, 28, 220, 24, 0x1a0008).setOrigin(0, 0.5);
        this.hpBarBg.setStrokeStyle(2, 0x441122);
        this.hpBar = this.add.rectangle(24, 28, 216, 20, COLORS.hp).setOrigin(0, 0.5);
        this.hpBarMask = this.add.rectangle(24, 28, 216, 20, 0xff6688, 0.5).setOrigin(0, 0.5);
        this.hpText = this.add.text(132, 28, '100/100', {
            fontSize: '14px', fontFamily: 'Courier New', color: '#fff',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5);
        
        this.shieldBar = this.add.rectangle(22, 50, 216, 8, COLORS.shield).setOrigin(0, 0.5);
        this.shieldBar.setStrokeStyle(1, 0x2244aa);
        this.shieldBar.setVisible(false);
        this.shieldBar.scaleX = 0;
        
        this.expBg = this.add.rectangle(22, 62, 220, 10, 0x0a0a22).setOrigin(0, 0.5);
        this.expBg.setStrokeStyle(2, 0x222255);
        this.expBar = this.add.rectangle(24, 62, 216, 6, COLORS.exp).setOrigin(0, 0.5);
        this.expBar.scaleX = 0;
        
        this.levelText = this.add.text(28, 45, 'Lv.1', {
            fontSize: '16px', fontFamily: 'Courier New',
            color: '#ffd700', fontWeight: 'bold',
            stroke: '#000', strokeThickness: 2
        });
        
        this.goldText = this.add.text(GW - 25, 28, '💰 0', {
            fontSize: '20px', fontFamily: 'Courier New', color: '#ffd700',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(1, 0);
        
        this.timeText = this.add.text(GW / 2, 18, '00:00', {
            fontSize: '22px', fontFamily: 'Courier New', color: '#fff',
            stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5);
        
        this.comboText = this.add.text(GW - 25, 60, '', {
            fontSize: '26px', fontFamily: 'Courier New',
            color: '#ff6600', fontWeight: 'bold',
            stroke: '#000', strokeThickness: 3
        }).setOrigin(1, 0);
        
        this.killText = this.add.text(GW / 2, 48, '击杀: 0', {
            fontSize: '14px', fontFamily: 'Courier New', color: '#aaa',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5);
        
        this.skillBtn = this.add.circle(GW - 60, GH - 60, 38, 0x0a0a22)
            .setStrokeStyle(3, 0x4444aa).setInteractive()
            .on('pointerdown', () => this.useSkill());
        this.skillBtnGlow = this.add.circle(GW - 60, GH - 60, 45, 0x4444aa, 0.2);
        this.skillIcon = this.add.text(GW - 60, GH - 60, '💥', { fontSize: '30px' }).setOrigin(0.5);
        this.skillCD = this.add.graphics();
        this.skillCD.setDepth(150);
        
        this.pauseBtn = this.add.text(GW - 18, GH - 18, '⏸', { fontSize: '24px' })
            .setOrigin(1, 1).setInteractive()
            .on('pointerdown', () => this.togglePause());
    }
    
    showMainMenu() {
        this.gameState = 'menu';
        this.menuElements = [];
        
        const bg = this.add.rectangle(0, 0, GW, GH, 0x000000, 0.9).setOrigin(0);
        
        for (let i = 0; i < 15; i++) {
            const star = this.add.star(
                Math.random() * GW, Math.random() * GH,
                5, 2, 5, 0xffffff
            ).setAlpha(0.3 + Math.random() * 0.4);
            this.tweens.add({
                targets: star,
                alpha: 0.1,
                yoyo: true,
                repeat: -1,
                duration: 1000 + Math.random() * 2000
            });
            this.menuElements.push(star);
        }
        
        const title = this.add.text(GW / 2, 85, '暗影猎手：神话版', {
            fontSize: '58px', fontFamily: 'Courier New',
            color: '#ff4466', stroke: '#000', strokeThickness: 6,
            fontWeight: 'bold'
        }).setOrigin(0.5);
        
        const titleGlow = this.add.text(GW / 2, 85, '暗影猎手：神话版', {
            fontSize: '58px', fontFamily: 'Courier New',
            color: '#ff6688', stroke: '#000', strokeThickness: 0,
            fontWeight: 'bold'
        }).setOrigin(0.5).setAlpha(0.3);
        
        const subtitle = this.add.text(GW / 2, 145, 'SHADOW HUNTER: MYTHIC', {
            fontSize: '20px', fontFamily: 'Courier New', color: '#888'
        }).setOrigin(0.5);
        
        const wpTitle = this.add.text(GW / 2, 200, '选择你的武器', {
            fontSize: '26px', fontFamily: 'Courier New', color: '#fff',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5);
        
        const weapons = WeaponFactory.all();
        weapons.forEach((w, i) => {
            const info = WeaponFactory.info(w);
            const x = 100 + i * 160;
            const y = 345;
            
            const cardBg = this.add.rectangle(x, y, 140, 175, 0x111122)
                .setStrokeStyle(3, info.color).setInteractive();
            const cardInner = this.add.rectangle(x, y, 132, 167, 0x1a1a2e);
            const icon = this.add.text(x, y - 45, info.icon, { fontSize: '48px' }).setOrigin(0.5);
            const name = this.add.text(x, y + 5, info.name, {
                fontSize: '18px', fontFamily: 'Courier New', color: '#fff'
            }).setOrigin(0.5);
            const desc = this.add.text(x, y + 40, info.desc, {
                fontSize: '12px', fontFamily: 'Courier New',
                color: '#aaa', align: 'center', wordWrap: { width: 125 }
            }).setOrigin(0.5);
            
            const unlocked = this.saveData.unlockedWeapons.includes(w);
            if (!unlocked) {
                const lock = this.add.rectangle(x, y, 140, 175, 0x000000, 0.7);
                const lockIcon = this.add.text(x, y - 10, '🔒', { fontSize: '36px' }).setOrigin(0.5);
                const lockText = this.add.text(x, y + 25, '击败Boss解锁', {
                    fontSize: '12px', fontFamily: 'Courier New', color: '#888'
                }).setOrigin(0.5);
                this.menuElements.push(lock, lockIcon, lockText);
            } else {
                cardBg.on('pointerover', () => {
                    cardBg.setStrokeStyle(5, info.color);
                    this.tweens.add({ targets: cardBg, scale: 1.05, duration: 150 });
                });
                cardBg.on('pointerout', () => {
                    cardBg.setStrokeStyle(3, info.color);
                    this.tweens.add({ targets: cardBg, scale: 1, duration: 150 });
                });
                cardBg.on('pointerdown', () => this.startGame(w));
            }
            
            this.menuElements.push(cardBg, cardInner, icon, name, desc);
        });
        
        const tips = this.add.text(GW / 2, GH - 110,
            'WASD 移动 | 鼠标瞄准自动攻击 | 空格 释放技能 | ESC 暂停', {
            fontSize: '15px', fontFamily: 'Courier New', color: '#888'
        }).setOrigin(0.5);
        
        const best = this.add.text(GW / 2, GH - 75,
            `🏆 最佳记录: ${this.formatTime(this.saveData.bestTime)} | 最高等级: ${this.saveData.bestLevel} | 总击杀: ${this.saveData.totalKills}`, {
            fontSize: '14px', fontFamily: 'Courier New', color: '#ffd700'
        }).setOrigin(0.5);
        
        const stats = this.add.text(GW / 2, GH - 50,
            `💰 总金币: ${this.saveData.totalGold} | 🏃 总场次: ${this.saveData.totalRuns} | 👑 最高Boss: ${this.saveData.highestBoss}`, {
            fontSize: '12px', fontFamily: 'Courier New', color: '#aaa'
        }).setOrigin(0.5);
        
        this.menuElements.push(bg, title, titleGlow, subtitle, wpTitle, tips, best, stats);
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
        this.items.forEach(i => i.container?.destroy());
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
        this.cameras.main.flash(500, 255, 255, 255);
    }
    
    update(time, delta) {
        if (this.gameState !== 'playing' || this.paused) return;
        
        const gameTime = (time - this.startTime) / 1000;
        this.runtime.surviveTime = gameTime;
        
        if (this.runtime.comboTimer > 0) {
            this.runtime.comboTimer -= delta;
            if (this.runtime.comboTimer <= 0) {
                this.runtime.resetCombo();
            }
        }
        
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
        
        this.movePlayer(delta);
        this.updateWeaponRotation();
        this.updateAttack(time);
        
        if (this.runtime.weapon) {
            this.runtime.weapon.updateAnim(delta);
        }
        
        this.enemyManager.update(time - this.startTime, delta);
        this.bossManager.update(time - this.startTime, delta);
        
        this.projectiles.forEach(p => p.update(delta, time));
        this.projectiles = this.projectiles.filter(p => p.alive);
        
        this.items.forEach(i => i.update(time, delta));
        this.items = this.items.filter(i => i.alive);
        
        this.minions.forEach(m => m.update(time, delta));
        
        this.updateHUD();
        this.drawBackground();
        this.checkAchievements();
        this.updateSkillCD(time - this.startTime);
        this.updateComboDisplay();
        this.updateScreenShake(delta);
        
        if (this.runtime.hp <= 0) this.gameOver();
    }
    
    movePlayer(delta) {
        const dt = delta / 1000;
        const s = this.runtime.spec;
        let speed = 240 * (1 + s.speed * 0.12);
        
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
            
            const bob = Math.sin(this.time.now * 0.018) * 3;
            this.player.y = GH / 2 + bob;
            
            if (this.playerBody) {
                const squash = 1 + Math.sin(this.time.now * 0.018) * 0.03;
                this.playerBody.scaleY = squash;
            }
        } else {
            this.player.y = GH / 2;
            if (this.playerBody) {
                this.playerBody.scaleY = 1;
            }
        }
        
        if (this.runtime.invincibleTimer > 0) {
            this.player.alpha = Math.sin(this.time.now * 0.05) > 0 ? 0.5 : 1;
        } else {
            this.player.alpha = 1;
        }
    }
    
    updateWeaponRotation() {
        if (!this.mousePos) return;
        const angle = Math.atan2(this.mousePos.y - GH / 2, this.mousePos.x - GW / 2);
        this.weaponContainer.x = Math.cos(angle) * 30;
        this.weaponContainer.y = Math.sin(angle) * 30;
        this.weaponContainer.rotation = angle;
        
        const animScale = 1 + (this.runtime.weapon?.attackAnim || 0) * 0.4;
        this.weaponContainer.scale = animScale;
        
        if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
            this.player.scaleX = -1;
            this.weaponContainer.scaleY = -animScale;
        } else {
            this.player.scaleX = 1;
            this.weaponContainer.scaleY = animScale;
        }
    }
    
    updateAttack(time) {
        const w = this.runtime.weapon;
        if (!w) return;
        if (!w.canAttack(time, this.runtime.spec)) return;
        
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
        let damage = isCrit ? Math.floor(baseDmg * w.getCritDamage(this.runtime.spec)) : baseDmg;
        damage = Math.floor(damage * this.runtime.comboMultiplier);
        
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
        
        this.screenShake = Math.max(this.screenShake, isCrit ? 8 : 4);
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
                w.color, 8, 3
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
        
        this.particles.lineBeam(GW / 2, GH / 2, 
            GW / 2 + Math.cos(angle) * w.range, 
            GH / 2 + Math.sin(angle) * w.range, 
            w.color, w.width);
        
        const hits = this.enemyManager.getEnemiesOnLine(
            this.playerWorldX, this.playerWorldY, endX, endY, w.width
        );
        hits.forEach(e => {
            e.takeDamage(damage, isCrit);
            e.applySlow(2500);
            e.applyFreeze(500);
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
            { speed: 650, color: w.color, glowColor: w.glowColor, pierce: 2, size: 6 }
        ));
    }
    
    performWandAttack(angle, damage, isCrit, w) {
        for (let i = 0; i < 3; i++) {
            const offset = (i - 1) * 0.3;
            this.projectiles.push(new Projectile(
                this, this.playerWorldX, this.playerWorldY,
                this.playerWorldX + Math.cos(angle + offset) * w.range,
                this.playerWorldY + Math.sin(angle + offset) * w.range,
                damage, 'magic',
                { speed: 480, color: w.color, glowColor: w.glowColor, bounce: 3, tracking: true, size: 8 }
            ));
        }
    }
    
    useSkill() {
        if (this.gameState !== 'playing' || this.paused) return;
        const s = this.runtime.skill;
        if (!s || !s.canUse(this.time.now - this.startTime)) return;
        
        s.use(this.time.now - this.startTime);
        this.audio.play('skill');
        this.cameras.main.shake(250, 0.012);
        this.screenShake = 12;
        
        const w = this.runtime.weapon;
        const baseDmg = w.getDamage(this.runtime.weaponLevel, this.runtime.spec);
        const angle = Math.atan2(
            (this.mousePos?.y || GH / 2) - GH / 2,
            (this.mousePos?.x || GW / 2) - GW / 2
        );
        
        switch (this.runtime.weaponType) {
            case 'sword':
                const dashDist = 220;
                const targetX = this.playerWorldX + Math.cos(angle) * dashDist;
                const targetY = this.playerWorldY + Math.sin(angle) * dashDist;
                
                const dashTween = this.tweens.addCounter({
                    from: 0, to: 1, duration: 220, ease: 'Cubic.easeOut',
                    onUpdate: t => {
                        this.playerWorldX = Phaser.Math.Linear(this.playerWorldX, targetX, t.getValue() * 0.35);
                        this.playerWorldY = Phaser.Math.Linear(this.playerWorldY, targetY, t.getValue() * 0.35);
                    }
                });
                
                const nearby = this.enemyManager.getEnemiesInRadius(this.playerWorldX, this.playerWorldY, 130);
                nearby.forEach(e => e.takeDamage(baseDmg * 2.8, true));
                
                if (this.bossManager.boss?.alive) {
                    const d = Phaser.Math.Distance.Between(this.playerWorldX, this.playerWorldY, this.bossManager.boss.worldX, this.bossManager.boss.worldY);
                    if (d < 130) this.bossManager.boss.takeDamage(baseDmg * 2.8, true);
                }
                
                for (let i = 0; i < 4; i++) {
                    setTimeout(() => {
                        this.particles.explosion(
                            GW / 2 + Math.cos(angle) * i * 30,
                            GH / 2 + Math.sin(angle) * i * 30,
                            50 + i * 15, w.color
                        );
                    }, i * 40);
                }
                break;
                
            case 'axe':
                const all = this.enemyManager.getEnemiesInRadius(this.playerWorldX, this.playerWorldY, 200);
                all.forEach(e => e.takeDamage(baseDmg * 3.2, Math.random() < 0.6));
                
                if (this.bossManager.boss?.alive) {
                    const d = Phaser.Math.Distance.Between(this.playerWorldX, this.playerWorldY, this.bossManager.boss.worldX, this.bossManager.boss.worldY);
                    if (d < 200) this.bossManager.boss.takeDamage(baseDmg * 3.2, Math.random() < 0.6);
                }
                
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        this.particles.explosion(GW / 2, GH / 2, 80 + i * 40, w.color);
                    }, i * 70);
                }
                this.screenShake = 15;
                break;
                
            case 'staff':
                const frozen = this.enemyManager.getEnemiesInRadius(this.playerWorldX, this.playerWorldY, 220);
                frozen.forEach(e => {
                    e.takeDamage(baseDmg * 1.8, false);
                    e.applySlow(5000);
                    e.applyFreeze(2000);
                    e.applyStun(1000);
                });
                
                if (this.bossManager.boss?.alive) {
                    const d = Phaser.Math.Distance.Between(this.playerWorldX, this.playerWorldY, this.bossManager.boss.worldX, this.bossManager.boss.worldY);
                    if (d < 220) {
                        this.bossManager.boss.takeDamage(baseDmg * 1.8, false);
                    }
                }
                
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        this.particles.explosion(GW / 2, GH / 2, 100 + i * 50, w.color);
                    }, i * 100);
                }
                break;
                
            case 'bow':
                for (let i = 0; i < 15; i++) {
                    const a = -Math.PI / 2.5 + (i / 14) * Math.PI * 2 / 2.5;
                    const finalAngle = angle + a;
                    setTimeout(() => {
                        this.projectiles.push(new Projectile(
                            this, this.playerWorldX, this.playerWorldY,
                            this.playerWorldX + Math.cos(finalAngle) * 600,
                            this.playerWorldY + Math.sin(finalAngle) * 600,
                            baseDmg * 1.8, 'arrow',
                            { speed: 750, color: w.color, glowColor: w.glowColor, pierce: 3, size: 7 }
                        ));
                    }, i * 25);
                }
                break;
                
            case 'wand':
                for (let i = 0; i < 10; i++) {
                    setTimeout(() => {
                        const a = Math.random() * Math.PI * 2;
                        this.projectiles.push(new Projectile(
                            this, this.playerWorldX, this.playerWorldY,
                            this.playerWorldX + Math.cos(a) * 350,
                            this.playerWorldY + Math.sin(a) * 350,
                            baseDmg * 2.2, 'magic',
                            { speed: 520, color: w.color, glowColor: w.glowColor, bounce: 4, tracking: true, size: 10 }
                        ));
                    }, i * 50);
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
            this.skillCD.lineStyle(4, 0x000000, 0.7);
            this.skillCD.beginPath();
            this.skillCD.arc(GW - 60, GH - 60, 42, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (1 - progress), false);
            this.skillCD.strokePath();
            this.skillIcon.setAlpha(0.4);
            this.skillBtnGlow.setAlpha(0.1);
        } else {
            this.skillIcon.setAlpha(1);
            this.skillBtnGlow.setAlpha(0.3 + Math.sin(this.time.now * 0.005) * 0.15);
        }
    }
    
    playerTakeDamage(amount) {
        if (this.runtime.invincibleTimer > 0) return;
        
        const actual = this.runtime.takeDamage(amount);
        this.runtime.invincibleTimer = 1000;
        this.runtime.resetCombo();
        
        this.audio.play('hurt');
        this.cameras.main.shake(200, 0.01);
        this.screenShake = 10;
        this.showDamageNumber(GW / 2, GH / 2 - 35, actual, false, true);
        
        this.tweens.add({
            targets: this.player,
            alpha: { from: 1, to: 0.3, to: 1 },
            duration: 100,
            repeat: 4
        });
        
        this.cameras.main.flash(100, 255, 0, 0);
    }
    
    updateComboDisplay() {
        if (this.runtime.combo >= 3) {
            this.comboText.setText(`${this.runtime.combo} 连击!`);
            this.comboText.setVisible(true);
            const scale = 1 + Math.sin(this.time.now * 0.01) * 0.1;
            this.comboText.setScale(scale);
            
            if (this.runtime.combo >= 20) {
                this.comboText.setColor('#ff0000');
            } else if (this.runtime.combo >= 10) {
                this.comboText.setColor('#ff6600');
            } else if (this.runtime.combo >= 5) {
                this.comboText.setColor('#ffaa00');
            } else {
                this.comboText.setColor('#ff6600');
            }
        } else {
            this.comboText.setVisible(false);
        }
    }
    
    updateScreenShake(delta) {
        if (this.screenShake > 0) {
            const shakeX = (Math.random() - 0.5) * this.screenShake;
            const shakeY = (Math.random() - 0.5) * this.screenShake;
            this.cameras.main.x = shakeX;
            this.cameras.main.y = shakeY;
            this.screenShake = Math.max(0, this.screenShake - delta * 0.03);
        } else {
            this.cameras.main.x = 0;
            this.cameras.main.y = 0;
        }
    }
    
    showDamageNumber(x, y, damage, isCrit = false, isPlayer = false) {
        const text = this.add.text(x, y, isCrit ? `${damage}!` : `${damage}`, {
            fontSize: isCrit ? '28px' : '18px',
            fontFamily: 'Courier New',
            color: isPlayer ? '#ff4444' : (isCrit ? '#ffff00' : '#ffaa66'),
            stroke: '#000',
            strokeThickness: 3,
            fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(250);
        
        if (isCrit && !isPlayer) {
            this.particles.critEffect(x, y - 10);
        }
        
        this.tweens.add({
            targets: text,
            y: y - 50,
            alpha: 0,
            scale: isCrit ? { from: 1.5, to: 1 } : 1,
            duration: 700,
            ease: 'Cubic.easeOut',
            onComplete: () => text.destroy()
        });
    }
    
    onLevelUp() {
        this.particles.levelUp();
        this.audio.play('levelup');
        this.runtime.weaponLevel = Math.min(this.runtime.level, 10);
        this.runtime.updateMaxHp();
        this.cameras.main.shake(400, 0.01);
        this.screenShake = 8;
        this.showLevelUpChoice();
    }
    
    showLevelUpChoice() {
        this.paused = true;
        
        const choices = this.getRandomSpecializations(3);
        
        const bg = this.add.rectangle(0, 0, GW, GH, 0x000000, 0.8).setOrigin(0).setDepth(400);
        
        for (let i = 0; i < 8; i++) {
            const star = this.add.star(
                Math.random() * GW, Math.random() * GH,
                5, 3, 8, 0xffd700
            ).setDepth(401).setAlpha(0.6);
            this.tweens.add({
                targets: star,
                alpha: 0,
                y: `-=${50 + Math.random() * 50}`,
                scale: 2,
                duration: 1500 + Math.random() * 1000,
                delay: Math.random() * 500
            });
        }
        
        const title = this.add.text(GW / 2, 100, `⭐ 升级！ Lv.${this.runtime.level} ⭐`, {
            fontSize: '46px', fontFamily: 'Courier New',
            color: '#ffd700', stroke: '#000', strokeThickness: 5,
            fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(401);
        
        const sub = this.add.text(GW / 2, 155, '选择一项专精提升', {
            fontSize: '22px', fontFamily: 'Courier New', color: '#fff',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(401);
        
        choices.forEach((spec, i) => {
            const x = GW / 2 + (i - 1) * 190;
            const y = 330;
            const level = this.runtime.specLevels[spec.id] || 0;
            
            const cardBg = this.add.rectangle(x, y, 160, 200, 0x111122)
                .setStrokeStyle(3, spec.color).setInteractive().setDepth(401);
            const cardInner = this.add.rectangle(x, y, 152, 192, 0x1a1a2e).setDepth(401);
            const iconBg = this.add.circle(x, y - 55, 35, spec.color, 0.3).setDepth(402);
            const icon = this.add.text(x, y - 55, spec.icon, { fontSize: '42px' }).setOrigin(0.5).setDepth(403);
            const name = this.add.text(x, y + 5, spec.name, {
                fontSize: '20px', fontFamily: 'Courier New', color: '#fff'
            }).setOrigin(0.5).setDepth(402);
            const desc = this.add.text(x, y + 40, spec.desc, {
                fontSize: '13px', fontFamily: 'Courier New',
                color: '#aaa', align: 'center', wordWrap: { width: 140 }
            }).setOrigin(0.5).setDepth(402);
            const lvl = this.add.text(x, y + 75, `Lv.${level}`, {
                fontSize: '15px', fontFamily: 'Courier New', color: '#ffd700',
                stroke: '#000', strokeThickness: 2
            }).setOrigin(0.5).setDepth(402);
            
            cardBg.on('pointerover', () => {
                cardBg.setStrokeStyle(5, spec.color);
                this.tweens.add({ targets: cardBg, scale: 1.08, duration: 150 });
            });
            cardBg.on('pointerout', () => {
                cardBg.setStrokeStyle(3, spec.color);
                this.tweens.add({ targets: cardBg, scale: 1, duration: 150 });
            });
            cardBg.on('pointerdown', () => {
                this.runtime.specLevels[spec.id]++;
                this.runtime.updateMaxHp();
                bg.destroy();
                title.destroy();
                sub.destroy();
                cardBg.destroy();
                cardInner.destroy();
                iconBg.destroy();
                icon.destroy();
                name.destroy();
                desc.destroy();
                lvl.destroy();
                this.paused = false;
                this.audio.play('levelup');
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
        
        const bg = this.add.rectangle(0, 0, GW, GH, 0x000000, 0.85).setOrigin(0).setDepth(400);
        
        for (let i = 0; i < 20; i++) {
            const star = this.add.star(
                Math.random() * GW, Math.random() * GH,
                5, 4, 10, 0xffd700
            ).setDepth(401).setAlpha(0.7);
            this.tweens.add({
                targets: star,
                alpha: 0,
                y: `-=${80 + Math.random() * 80}`,
                scale: 2,
                duration: 2000 + Math.random() * 1000,
                delay: Math.random() * 800
            });
        }
        
        const title = this.add.text(GW / 2, 85, '🏆 BOSS 击败！ 🏆', {
            fontSize: '44px', fontFamily: 'Courier New',
            color: '#ffd700', stroke: '#000', strokeThickness: 5,
            fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(401);
        
        const sub = this.add.text(GW / 2, 135, '选择一项珍贵奖励', {
            fontSize: '20px', fontFamily: 'Courier New', color: '#fff',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(401);
        
        const rewards = [
            { type: 'weaponUp', name: '武器强化', desc: '武器等级 +1，伤害大幅提升', icon: '⚔', color: 0xff4466 },
            { type: 'heal', name: '生命恢复', desc: '恢复 60% 最大生命', icon: '❤', color: 0xff4466 },
            { type: 'gold', name: '宝藏', desc: '获得 150 金币', icon: '💰', color: 0xffd700 },
            { type: 'spec', name: '神秘卷轴', desc: '随机获得 2 项专精', icon: '📜', color: 0xaa88ff },
            { type: 'minion', name: '召唤随从', desc: '解锁/升级一个随从', icon: '✨', color: 0x44ff88 },
            { type: 'newWeapon', name: '武器解锁', desc: '解锁一把新武器', icon: '🗡', color: 0xff88ff }
        ];
        
        const selected = [];
        const temp = [...rewards];
        for (let i = 0; i < 3 && temp.length > 0; i++) {
            selected.push(temp.splice(Math.floor(Math.random() * temp.length), 1)[0]);
        }
        
        selected.forEach((r, i) => {
            const x = GW / 2 + (i - 1) * 190;
            const y = 310;
            
            const cardBg = this.add.rectangle(x, y, 160, 210, 0x1a1a2e)
                .setStrokeStyle(3, r.color).setInteractive().setDepth(401);
            const cardInner = this.add.rectangle(x, y, 152, 202, 0x222244).setDepth(401);
            const iconBg = this.add.circle(x, y - 60, 40, r.color, 0.3).setDepth(402);
            const icon = this.add.text(x, y - 60, r.icon, { fontSize: '52px' }).setOrigin(0.5).setDepth(403);
            const name = this.add.text(x, y + 5, r.name, {
                fontSize: '22px', fontFamily: 'Courier New', color: '#fff'
            }).setOrigin(0.5).setDepth(402);
            const desc = this.add.text(x, y + 45, r.desc, {
                fontSize: '14px', fontFamily: 'Courier New',
                color: '#aaa', align: 'center', wordWrap: { width: 140 }
            }).setOrigin(0.5).setDepth(402);
            
            cardBg.on('pointerover', () => {
                cardBg.setStrokeStyle(5, r.color);
                this.tweens.add({ targets: cardBg, scale: 1.08, duration: 150 });
            });
            cardBg.on('pointerout', () => {
                cardBg.setStrokeStyle(3, r.color);
                this.tweens.add({ targets: cardBg, scale: 1, duration: 150 });
            });
            cardBg.on('pointerdown', () => {
                this.claimBossReward(r.type);
                bg.destroy();
                title.destroy();
                sub.destroy();
                cardBg.destroy();
                cardInner.destroy();
                iconBg.destroy();
                icon.destroy();
                name.destroy();
                desc.destroy();
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
                this.runtime.heal(Math.floor(this.runtime.maxHp * 0.6));
                this.particles.healEffect(GW / 2, GH / 2 - 20);
                break;
            case 'gold':
                this.runtime.addGold(150);
                this.particles.goldEffect(GW / 2, GH / 2, 12);
                break;
            case 'spec':
                const specs = this.getRandomSpecializations(2);
                specs.forEach(s => this.runtime.specLevels[s.id]++);
                this.runtime.updateMaxHp();
                break;
            case 'minion':
                const minionTypes = ['light', 'shadow', 'fire'];
                const availableMinions = minionTypes.filter(m => !this.saveData.unlockedMinions.includes(m));
                if (availableMinions.length > 0) {
                    const newMinion = availableMinions[Math.floor(Math.random() * availableMinions.length)];
                    this.saveData.unlockedMinions.push(newMinion);
                    const m = new Minion(this, newMinion);
                    m.spawn(this.playerWorldX, this.playerWorldY);
                    this.minions.push(m);
                } else {
                    this.runtime.specLevels.atk += 2;
                    this.runtime.updateMaxHp();
                }
                break;
            case 'newWeapon':
                const allWeapons = WeaponFactory.all();
                const lockedWeapons = allWeapons.filter(w => !this.saveData.unlockedWeapons.includes(w));
                if (lockedWeapons.length > 0) {
                    const newW = lockedWeapons[Math.floor(Math.random() * lockedWeapons.length)];
                    this.saveData.unlockedWeapons.push(newW);
                } else {
                    this.runtime.weaponLevel = Math.min(10, this.runtime.weaponLevel + 2);
                }
                break;
        }
        this.audio.play('levelup');
        this.cameras.main.shake(300, 0.01);
        SaveData.save(this.saveData);
    }
    
    updateHUD() {
        const r = this.runtime;
        
        const hpRatio = Math.max(0, r.hp / r.maxHp);
        this.hpBar.scaleX = hpRatio;
        this.hpBarMask.scaleX = hpRatio;
        this.hpText.setText(`${Math.ceil(r.hp)}/${r.maxHp}`);
        
        if (hpRatio < 0.3) {
            this.hpBar.fillColor = 0xff0000;
        } else if (hpRatio < 0.6) {
            this.hpBar.fillColor = 0xff8800;
        } else {
            this.hpBar.fillColor = COLORS.hp;
        }
        
        if (r.shield > 0) {
            this.shieldBar.setVisible(true);
            this.shieldBar.scaleX = Math.min(1, r.shield / 60);
        } else {
            this.shieldBar.setVisible(false);
        }
        
        const expRatio = Math.max(0, r.exp / r.expToNext);
        this.expBar.scaleX = expRatio;
        this.levelText.setText(`Lv.${r.level}`);
        
        this.goldText.setText(`💰 ${r.gold}`);
        this.timeText.setText(this.formatTime(r.surviveTime));
        this.killText.setText(`击杀: ${r.killCount} | Boss: ${r.bossKills}`);
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
            { id: 'killer_100', cond: r.killCount >= 100 },
            { id: 'survive_60', cond: r.surviveTime >= 60 },
            { id: 'survive_180', cond: r.surviveTime >= 180 },
            { id: 'survive_300', cond: r.surviveTime >= 300 },
            { id: 'boss_1', cond: r.bossKills >= 1 },
            { id: 'boss_3', cond: r.bossKills >= 3 },
            { id: 'level_5', cond: r.level >= 5 },
            { id: 'level_10', cond: r.level >= 10 },
            { id: 'level_15', cond: r.level >= 15 },
            { id: 'combo_10', cond: r.maxCombo >= 10 },
            { id: 'combo_20', cond: r.maxCombo >= 20 },
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
        
        const x = GW / 2, y = 90;
        const bg = this.add.rectangle(x, y, 320, 55, 0x111122, 0.95)
            .setStrokeStyle(2, 0xffd700).setDepth(500);
        const icon = this.add.text(x - 130, y, ach.icon, { fontSize: '28px' }).setOrigin(0, 0.5).setDepth(501);
        const title = this.add.text(x - 85, y - 10, '🏆 成就解锁！', {
            fontSize: '13px', fontFamily: 'Courier New', color: '#ffd700'
        }).setOrigin(0, 0.5).setDepth(501);
        const name = this.add.text(x - 85, y + 10, ach.name, {
            fontSize: '17px', fontFamily: 'Courier New', color: '#fff'
        }).setOrigin(0, 0.5).setDepth(501);
        
        bg.y = y - 70;
        icon.y = y - 70;
        title.y = y - 78;
        name.y = y - 60;
        
        this.tweens.add({
            targets: [bg, icon, title, name],
            y: `+=70`,
            duration: 600,
            ease: 'Back.easeOut',
            hold: 2500,
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
            const bg = this.add.rectangle(0, 0, GW, GH, 0x000000, 0.75).setOrigin(0).setDepth(450);
            const title = this.add.text(GW / 2, GH / 2 - 60, '⏸ 暂停', {
                fontSize: '52px', fontFamily: 'Courier New', color: '#fff',
                stroke: '#000', strokeThickness: 4
            }).setOrigin(0.5).setDepth(451);
            
            const resume = this.add.text(GW / 2, GH / 2 + 20, '继续游戏', {
                fontSize: '26px', fontFamily: 'Courier New', color: '#66ff66'
            }).setOrigin(0.5).setInteractive().setDepth(451);
            
            const menu = this.add.text(GW / 2, GH / 2 + 70, '返回主菜单', {
                fontSize: '20px', fontFamily: 'Courier New', color: '#aaa'
            }).setOrigin(0.5).setInteractive().setDepth(451);
            
            resume.on('pointerover', () => resume.setColor('#88ff88'));
            resume.on('pointerout', () => resume.setColor('#66ff66'));
            resume.on('pointerdown', () => {
                this.pauseElements.forEach(e => e.destroy());
                this.pauseElements = [];
                this.paused = false;
            });
            
            menu.on('pointerover', () => menu.setColor('#fff'));
            menu.on('pointerout', () => menu.setColor('#aaa'));
            menu.on('pointerdown', () => {
                this.pauseElements.forEach(e => e.destroy());
                this.pauseElements = [];
                this.paused = false;
                this.showMainMenu();
            });
            
            this.pauseElements = [bg, title, resume, menu];
        }
    }
    
    gameOver() {
        if (this.gameState === 'gameover') return;
        this.gameState = 'gameover';
        this.audio.play('die');
        this.cameras.main.shake(500, 0.02);
        
        const r = this.runtime;
        const sd = this.saveData;
        sd.totalKills += r.killCount;
        sd.totalGold += r.gold;
        if (r.surviveTime > sd.bestTime) sd.bestTime = r.surviveTime;
        if (r.level > sd.bestLevel) sd.bestLevel = r.level;
        SaveData.save(sd);
        
        const bg = this.add.rectangle(0, 0, GW, GH, 0x000000, 0.9).setOrigin(0).setDepth(500);
        const title = this.add.text(GW / 2, 80, '💀 游戏结束 💀', {
            fontSize: '56px', fontFamily: 'Courier New',
            color: '#ff4466', stroke: '#000', strokeThickness: 5,
            fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(501);
        
        const statsBg = this.add.rectangle(GW / 2, 280, 400, 320, 0x0a0a1a)
            .setStrokeStyle(2, 0x333355).setDepth(501);
        
        const stats = [
            { label: '存活时间', value: this.formatTime(r.surviveTime), color: '#44ffff' },
            { label: '达到等级', value: `Lv.${r.level}`, color: '#ffd700' },
            { label: '击杀敌人', value: `${r.killCount}`, color: '#ff6644' },
            { label: '击败Boss', value: `${r.bossKills}`, color: '#ff4488' },
            { label: '获得金币', value: `${r.gold}`, color: '#ffd700' },
            { label: '最高连击', value: `${r.maxCombo}`, color: '#ff8800' },
            { label: '武器等级', value: `Lv.${r.weaponLevel}`, color: '#44ff88' }
        ];
        
        stats.forEach((s, i) => {
            this.add.text(GW / 2 - 150, 165 + i * 32, s.label, {
                fontSize: '18px', fontFamily: 'Courier New', color: '#aaa'
            }).setOrigin(0, 0.5).setDepth(502);
            this.add.text(GW / 2 + 150, 165 + i * 32, s.value, {
                fontSize: '18px', fontFamily: 'Courier New', color: s.color,
                fontWeight: 'bold'
            }).setOrigin(1, 0.5).setDepth(502);
        });
        
        const best = this.add.text(GW / 2, 410,
            `🏆 最佳时间: ${this.formatTime(sd.bestTime)} | 最高等级: ${sd.bestLevel}`, {
            fontSize: '16px', fontFamily: 'Courier New', color: '#ffd700'
        }).setOrigin(0.5).setDepth(502);
        
        const restart = this.add.text(GW / 2, GH - 150, '重新开始', {
            fontSize: '30px', fontFamily: 'Courier New', color: '#44ff88',
            stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5).setInteractive().setDepth(502);
        
        const menu = this.add.text(GW / 2, GH - 100, '返回主菜单', {
            fontSize: '20px', fontFamily: 'Courier New', color: '#aaa',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setInteractive().setDepth(502);
        
        restart.on('pointerover', () => restart.setColor('#66ffaa'));
        restart.on('pointerout', () => restart.setColor('#44ff88'));
        restart.on('pointerdown', () => {
            bg.destroy();
            title.destroy();
            statsBg.destroy();
            best.destroy();
            restart.destroy();
            menu.destroy();
            this.startGame(r.weaponType);
        });
        
        menu.on('pointerover', () => menu.setColor('#fff'));
        menu.on('pointerout', () => menu.setColor('#aaa'));
        menu.on('pointerdown', () => {
            bg.destroy();
            title.destroy();
            statsBg.destroy();
            best.destroy();
            restart.destroy();
            menu.destroy();
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

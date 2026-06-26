/**
 * 暗影猎手 - Shadow Hunter
 * 顶级像素肉鸽生存游戏 | Top-tier Pixel Roguelike Survival
 * 
 * 核心系统:
 * - 5种武器（近战/远程/魔法），每种有独特攻击方式和技能
 * - 8种专精，深度角色构筑
 * - 2种随从，特殊解锁条件
 * - 6种敌人 + 4种Boss，各有独特AI和技能
 * - Boss奖励三选一系统
 * - 21个成就
 * - 连击系统
 * - 道具掉落系统
 * - 存档系统
 */

const GW = 800, GH = 600, WS = 3000;
const C = {
    P: 0xff4466, S: 0xffaa00, A: 0x00ffff, G: 0xffd700,
    H: 0xff3333, E: 0xffff44, D: 0x0a0a15
};

class PS {
    constructor(s) { this.s = s; this.ps = []; }
    hit(x, y, cl = 0xff4444, n = 8) {
        for (let i = 0; i < n; i++) {
            const a = (i / n) * Math.PI * 2 + Math.random() * .3;
            const sp = 15 + Math.random() * 25;
            const p = this.s.add.circle(x, y, 2 + Math.random() * 3, cl);
            this.ps.push(p);
            this.s.tweens.add({ targets: p, x: x + Math.cos(a) * sp, y: y + Math.sin(a) * sp,
                alpha: [1, 0], scale: [1, 0], duration: 200 + Math.random() * 150,
                ease: 'Power2', onComplete: () => { p.destroy(); this.rm(p); } });
        }
    }
    gold(x, y) {
        for (let i = 0; i < 6; i++) {
            const p = this.s.add.text(x, y, '💰', { fontSize: '12px' }).setOrigin(.5);
            this.ps.push(p);
            this.s.tweens.add({ targets: p, x: GW - 100 + (Math.random() - .5) * 60,
                y: 20 + (Math.random() - .5) * 20, alpha: [1, 0], scale: [1, .3],
                duration: 600 + Math.random() * 300, ease: 'Power2',
                onComplete: () => { p.destroy(); this.rm(p); } });
        }
    }
    exp(x, y) {
        for (let i = 0; i < 5; i++) {
            const p = this.s.add.text(x, y, '✨', { fontSize: '10px' }).setOrigin(.5);
            this.ps.push(p);
            this.s.tweens.add({ targets: p, x: 80 + (Math.random() - .5) * 50,
                y: 50 + (Math.random() - .5) * 20, alpha: [1, 0], scale: [1, .4],
                duration: 500 + Math.random() * 200, ease: 'Power2',
                onComplete: () => { p.destroy(); this.rm(p); } });
        }
    }
    bossDie(x, y) {
        const cs = [0xffd700, 0xff6600, 0xff0000, 0x00ffff, 0xff00ff];
        for (let i = 0; i < 30; i++) {
            const a = (i / 30) * Math.PI * 2;
            const sp = 40 + Math.random() * 60;
            const p = this.s.add.circle(x, y, 6, cs[i % 5]);
            this.ps.push(p);
            this.s.tweens.add({ targets: p, x: x + Math.cos(a) * sp, y: y + Math.sin(a) * sp,
                alpha: [1, 0], scale: [1, 0], duration: 700, ease: 'Power2',
                onComplete: () => { p.destroy(); this.rm(p); } });
        }
        const f = this.s.add.circle(x, y, 120, 0xffffff, .9);
        this.ps.push(f);
        this.s.tweens.add({ targets: f, scale: 5, alpha: 0, duration: 600,
            onComplete: () => { f.destroy(); this.rm(f); } });
    }
    lvlUp() {
        const x = GW / 2, y = GH / 2;
        for (let i = 0; i < 20; i++) {
            const a = (i / 20) * Math.PI * 2;
            const p = this.s.add.text(x, y, '⭐', { fontSize: '20px' }).setOrigin(.5);
            this.ps.push(p);
            this.s.tweens.add({ targets: p, x: x + Math.cos(a) * 200, y: y + Math.sin(a) * 150,
                alpha: [0, 1, 0], scale: [0, 1.5, .3], duration: 1000, ease: 'Power2',
                onComplete: () => { p.destroy(); this.rm(p); } });
        }
    }
    heal(x, y) {
        for (let i = 0; i < 8; i++) {
            const p = this.s.add.text(x, y, '❤️', { fontSize: '14px' }).setOrigin(.5);
            this.ps.push(p);
            this.s.tweens.add({ targets: p, y: y - 50 - Math.random() * 30,
                alpha: [1, 0], scale: [1, .5], duration: 600, ease: 'Power2',
                onComplete: () => { p.destroy(); this.rm(p); } });
        }
    }
    skill(x, y, t) {
        let e;
        switch (t) {
            case 'crit': e = this.s.add.circle(x, y, 60, 0xff0000, .3);
                this.s.tweens.add({ targets: e, scale: 3, alpha: 0, duration: 600,
                    onComplete: () => { e.destroy(); this.rm(e); } }); break;
            case 'whirl': e = this.s.add.circle(x, y, 70, 0xffaa00, .4);
                this.s.tweens.add({ targets: e, scale: [1, 4, 1], alpha: [.4, .1, 0],
                    rotation: Math.PI * 2, duration: 700,
                    onComplete: () => { e.destroy(); this.rm(e); } }); break;
            case 'shield': e = this.s.add.circle(x, y, 55, 0x00ffff, .25);
                this.s.tweens.add({ targets: e, scale: [.8, 1.3, 1], alpha: [.4, .15, .3],
                    duration: 1200, yoyo: true, repeat: 2,
                    onComplete: () => { e.destroy(); this.rm(e); } }); break;
            case 'pierce': e = this.s.add.rectangle(x, y, 8, 180, 0x88ff88, .7);
                this.s.tweens.add({ targets: e, scaleX: 2.5, alpha: 0, duration: 350,
                    onComplete: () => { e.destroy(); this.rm(e); } }); break;
            case 'boom': e = this.s.add.circle(x, y, 40, 0xff6600, .8);
                this.s.tweens.add({ targets: e, scale: 4, alpha: 0, duration: 450,
                    onComplete: () => { e.destroy(); this.rm(e); } }); break;
        }
        if (e) this.ps.push(e);
    }
    ach() {
        const x = GW / 2, y = GH / 3;
        for (let i = 0; i < 25; i++) {
            const a = (i / 25) * Math.PI * 2;
            const p = this.s.add.text(x, y, '🏆', { fontSize: '22px' }).setOrigin(.5);
            this.ps.push(p);
            this.s.tweens.add({ targets: p, x: x + Math.cos(a) * 220, y: y + Math.sin(a) * 180,
                alpha: [1, 0], scale: [1, .2], duration: 1200, ease: 'Power2',
                onComplete: () => { p.destroy(); this.rm(p); } });
        }
    }
    minion(x, y) {
        for (let i = 0; i < 15; i++) {
            const a = (i / 15) * Math.PI * 2;
            const p = this.s.add.circle(x, y, 5, 0xffff00);
            this.ps.push(p);
            this.s.tweens.add({ targets: p, x: x + Math.cos(a) * 60, y: y + Math.sin(a) * 60,
                alpha: [1, 0], scale: [1, 0], duration: 600, ease: 'Power2',
                onComplete: () => { p.destroy(); this.rm(p); } });
        }
    }
    wave(x, y, a, cl, w, l) {
        const v = this.s.add.rectangle(x, y, w, l, cl, .6);
        v.rotation = a;
        this.ps.push(v);
        this.s.tweens.add({ targets: v, scaleY: 2, alpha: [.6, 0], duration: 150, ease: 'Power2',
            onComplete: () => { v.destroy(); this.rm(v); } });
    }
    spawn(x, y, cl) {
        const g = this.s.add.circle(x, y, 30, cl, .5);
        this.ps.push(g);
        this.s.tweens.add({ targets: g, scale: [0, 2], alpha: [.5, 0], duration: 400,
            onComplete: () => { g.destroy(); this.rm(g); } });
    }
    rm(p) { const i = this.ps.indexOf(p); if (i > -1) this.ps.splice(i, 1); }
    clear() { this.ps.forEach(p => p.destroy()); this.ps = []; }
}

class Audio {
    constructor(s) { this.s = s; this.c = null; this.on = true; this.v = .35; this.init(); }
    init() { try { this.c = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { this.on = false; } }
    resume() { if (this.c && this.c.state === 'suspended') this.c.resume(); }
    play(t) {
        if (!this.on || !this.c) return;
        this.resume();
        const so = {
            atk_s: () => this.tone(320, .04, 'square'),
            atk_a: () => { this.tone(140, .12, 'sawtooth'); this.tone(90, .15, 'square'); },
            atk_st: () => { this.tone(520, .06, 'sine'); this.tone(720, .04, 'sine'); },
            atk_b: () => { this.tone(800, .02, 'triangle'); this.tone(1000, .015, 'sine'); },
            atk_w: () => { this.tone(420, .05, 'sine'); this.tone(560, .03, 'sine'); },
            hit: () => this.tone(160, .08, 'sawtooth'),
            crit: () => { this.tone(520, .1, 'square'); this.tone(720, .08, 'square'); },
            kill: () => { this.tone(280, .15, 'sine'); this.tone(392, .1, 'sine'); },
            lvl: () => this.melody([262, 330, 392, 523], .08),
            bw: () => { this.tone(70, .5, 'square'); setTimeout(() => this.tone(50, .5, 'square'), 200); },
            bd: () => this.melody([523, 659, 784, 1047, 784], .12),
            sel: () => this.tone(580, .04, 'sine'),
            clk: () => this.tone(680, .02, 'sine'),
            dmg: () => this.tone(50, .2, 'sawtooth'),
            heal: () => this.melody([440, 554, 659, 784], .08),
            pick: () => this.tone(900, .03, 'sine'),
            unlock: () => this.melody([392, 523, 659, 784, 1047], .1),
            go: () => this.melody([392, 330, 262, 196, 147], .25),
            skill: () => this.tone(550, .15, 'sine'),
            proj: () => this.tone(550, .04, 'triangle'),
            ma: () => this.tone(240, .06, 'sawtooth'),
            mh: () => this.melody([523, 659, 784], .07),
            ach: () => this.melody([523, 659, 784, 1047, 784, 1047], .08),
            pause: () => this.tone(320, .12, 'sine'),
            res: () => this.tone(450, .12, 'sine'),
            rw: () => this.melody([659, 784, 880, 1047], .06),
            combo: () => this.tone(600 + Math.random() * 200, .02, 'sine'),
            exp: () => this.tone(300 + Math.random() * 100, .03, 'sine')
        };
        if (so[t]) so[t]();
    }
    tone(f, d, t = 'sine') {
        const o = this.c.createOscillator();
        const g = this.c.createGain();
        o.type = t;
        o.frequency.setValueAtTime(f, this.c.currentTime);
        g.gain.setValueAtTime(this.v, this.c.currentTime);
        g.gain.exponentialRampToValueAtTime(.01, this.c.currentTime + d);
        o.connect(g); g.connect(this.c.destination);
        o.start(); o.stop(this.c.currentTime + d);
    }
    melody(fs, d) { fs.forEach((f, i) => setTimeout(() => this.tone(f, d, 'sine'), i * d * 1000)); }
    toggle() { this.on = !this.on; return this.on; }
}

class GD {
    static K = 'shadow_hunter_v2';
    static D = { tg: 0, um: [], bt: 0, tr: 0, ach: [], uw: ['sword'], tk: 0, tbk: 0, ml: 0, tst: 0 };
    static load() { const s = localStorage.getItem(this.K); return s ? { ...this.D, ...JSON.parse(s) } : { ...this.D }; }
    static save(d) { localStorage.setItem(this.K, JSON.stringify(d)); }
}

class Ach {
    static list = [
        { id: 'fb', name: '初次胜利', icon: '🏆', desc: '击败第一个Boss', c: d => d.bc >= 1 },
        { id: 'bh', name: 'Boss猎手', icon: '👹', desc: '击败10个Boss', c: d => d.tbk >= 10 },
        { id: 'bm', name: 'Boss大师', icon: '👑', desc: '击败25个Boss', c: d => d.tbk >= 25 },
        { id: 's1', name: '生存新手', icon: '⏱️', desc: '存活1分钟', c: d => d.st >= 60 },
        { id: 's5', name: '生存达人', icon: '⏱️', desc: '存活5分钟', c: d => d.st >= 300 },
        { id: 's10', name: '生存大师', icon: '⏱️', desc: '存活10分钟', c: d => d.st >= 600 },
        { id: 'k50', name: '杀戮新手', icon: '💀', desc: '击杀50个敌人', c: d => d.kc >= 50 },
        { id: 'k200', name: '杀戮达人', icon: '💀', desc: '击杀200个敌人', c: d => d.kc >= 200 },
        { id: 'k500', name: '杀戮宗师', icon: '💀', desc: '击杀500个敌人', c: d => d.kc >= 500 },
        { id: 'g100', name: '小富翁', icon: '💰', desc: '累计获得100金币', c: d => d.tge >= 100 },
        { id: 'g500', name: '大富翁', icon: '💰', desc: '累计获得500金币', c: d => d.tge >= 500 },
        { id: 'g1000', name: '财富之神', icon: '💰', desc: '累计获得1000金币', c: d => d.tge >= 1000 },
        { id: 'l10', name: '升级达人', icon: '⬆️', desc: '达到10级', c: d => d.l >= 10 },
        { id: 'l20', name: '升级大师', icon: '⬆️', desc: '达到20级', c: d => d.l >= 20 },
        { id: 'l30', name: '传奇英雄', icon: '⬆️', desc: '达到30级', c: d => d.l >= 30 },
        { id: 'w5', name: '武器大师', icon: '⚔️', desc: '武器达到5级', c: d => d.wl >= 5 },
        { id: 'w10', name: '武器宗师', icon: '⚔️', desc: '武器达到10级', c: d => d.wl >= 10 },
        { id: 'mm', name: '随从主人', icon: '👼', desc: '拥有两个随从', c: d => d.ms >= 2 },
        { id: 'c10', name: '连击新手', icon: '🔥', desc: '达成10连击', c: d => d.mc >= 10 },
        { id: 'c50', name: '连击达人', icon: '🔥', desc: '达成50连击', c: d => d.mc >= 50 },
        { id: 'pr', name: '完美开局', icon: '✨', desc: '前3分钟未受伤', c: d => d.ut >= 180 }
    ];
    static check(rt, sv) {
        const na = [];
        this.list.forEach(a => {
            if (!sv.ach.includes(a.id) && a.c(rt)) { sv.ach.push(a.id); na.push(a); }
        });
        return na;
    }
}

class RT {
    constructor() { this.reset(); }
    reset() {
        this.hp = 200; this.mhp = 200; this.l = 1; this.exp = 0; this.ent = 40;
        this.g = 0; this.sp = 0; this.w = null; this.wt = null; this.sk = null;
        this.ms = []; this.spec = { atk: 0, crit: 0, aspd: 0, hp: 0, arm: 0, g: 0, exp: 0, min: 0 };
        this.wl = 1; this.bc = 0; this.st = 0; this.kc = 0; this.tge = 0;
        this.sh = 0; this.sht = 0; this.nc = false; this.it = 0;
        this.combo = 0; this.mc = 0; this.lkt = 0; this.ut = 0; this.ldt = 0;
    }
}

class Weapon {
    constructor(n, dmg, spd, rng, tp, aa, aw, ic, cl) {
        this.n = n; this.bd = dmg; this.bs = spd; this.r = rng; this.t = tp;
        this.aa = aa; this.aw = aw; this.ic = ic; this.cl = cl; this.la = 0;
    }
    can(t) { return t - this.la >= this.bs; }
    dmg(l, s) {
        const b = this.bd + (l - 1) * 3;
        return Math.floor(b * (1 + s.atk * .08) * (1 + Math.floor(s.aspd / 3) * .04));
    }
    aspd(s) { return this.bs / (1 + s.aspd * .06); }
    cr(s) { return .08 + s.crit * .02; }
    cd(s) { return 2 + Math.floor(s.crit / 4) * .25; }
}

class W_sword extends Weapon { constructor() { super('暗影剑', 15, 450, 90, 'melee_arc', Math.PI/3, 60, '⚔️', 0xff4466); } }
class W_axe extends Weapon { constructor() { super('烈焰斧', 35, 1000, 120, 'melee_arc', Math.PI/2, 80, '🪓', 0xffaa00); } }
class W_staff extends Weapon { constructor() { super('冰霜法杖', 25, 700, 500, 'ranged_line', 0, 10, '🪄', 0x00ffff); } }
class W_bow extends Weapon { constructor() { super('狩猎弓', 32, 850, 600, 'ranged_proj', 0, 6, '🏹', 0x88ff88); } }
class W_wand extends Weapon { constructor() { super('奥术魔杖', 12, 350, 200, 'ranged_bounce', 0, 12, '✨', 0xff66ff); this.bn = 2; this.bdec = .65; } }

const WF = {
    create(t) { const w = { sword: W_sword, axe: W_axe, staff: W_staff, bow: W_bow, wand: W_wand }; return new (w[t] || W_sword)(); },
    info(t) {
        const i = {
            sword: { n: '暗影剑', d: '快速近战，攻击范围近但攻速极快', ic: '⚔️', c: '#ff4466', bg: 0x2a0a15 },
            axe: { n: '烈焰斧', d: '重型近战，伤害高范围大但攻速慢', ic: '🪓', c: '#ffaa00', bg: 0x2a1a05 },
            staff: { n: '冰霜法杖', d: '远程能量武器，发射穿透光束', ic: '🪄', c: '#00ffff', bg: 0x051a2a },
            bow: { n: '狩猎弓', d: '远程精准武器，发射高速箭矢', ic: '🏹', c: '#88ff88', bg: 0x0a2a10 },
            wand: { n: '奥术魔杖', d: '魔法武器，发射弹跳魔法球', ic: '✨', c: '#ff66ff', bg: 0x1a052a }
        };
        return i[t] || i.sword;
    },
    all() { return ['sword', 'axe', 'staff', 'bow', 'wand']; }
};

class Skill {
    constructor(n, cd, d, ic, c) { this.n = n; this.cd = cd; this.d = d; this.ic = ic; this.c = c; this.lu = 0; }
    can(t) { return t - this.lu >= this.cd; }
    pct(t) { const e = t - this.lu; return e >= this.cd ? 0 : 1 - (e / this.cd); }
    use(s) { this.lu = s.time.now; s.audio.play('skill'); }
}

class SK_sword extends Skill {
    constructor() { super('暗影冲刺', 5500, '冲刺到目标位置，对路径敌人造成180%伤害，下次攻击必定暴击', '💥', '#ff4466'); }
    use(sc) {
        super.use(sc);
        const p = sc.input.activePointer;
        const tx = p.x + sc.px - GW/2, ty = p.y + sc.py - GH/2;
        const ang = Math.atan2(ty - sc.py, tx - sc.px);
        const ex = sc.px + Math.cos(ang) * 180, ey = sc.py + Math.sin(ang) * 180;
        const es = sc.em.line(sc.px, sc.py, ex, ey, 35);
        const dmg = Math.floor(sc.rt.w.dmg(sc.rt.wl, sc.rt.spec) * 1.8);
        es.forEach(e => { e.takeDamage(dmg); sc.shwD(e.sp.x, e.sp.y, dmg); });
        sc.px = Math.max(-WS/2, Math.min(WS/2, ex));
        sc.py = Math.max(-WS/2, Math.min(WS/2, ey));
        sc.rt.nc = true;
        sc.p.skill(GW/2, GH/2, 'crit');
        const dash = sc.add.rectangle(GW/2, GH/2, 25, 80, 0xff4466, .7);
        dash.rotation = ang;
        sc.tweens.add({ targets: dash, scaleX: 4, alpha: 0, duration: 250, onComplete: () => dash.destroy() });
    }
}

class SK_axe extends Skill {
    constructor() { super('旋风斩', 7500, '旋转360度，对周围220范围敌人造成220%伤害', '🌀', '#ffaa00'); }
    use(sc) {
        super.use(sc);
        const dmg = Math.floor(sc.rt.w.dmg(sc.rt.wl, sc.rt.spec) * 2.2);
        const es = sc.em.rng(sc.px, sc.py, 220);
        es.forEach(e => { e.takeDamage(dmg); sc.shwD(e.sp.x, e.sp.y, dmg); });
        if (sc.bm.b?.alive) {
            const b = sc.bm.b;
            const d = Phaser.Math.Distance.Between(sc.px, sc.py, b.wx, b.wy);
            if (d <= 220) b.takeDamage(dmg);
        }
        sc.p.skill(GW/2, GH/2, 'whirl');
    }
}

class SK_staff extends Skill {
    constructor() { super('寒冰护盾', 6500, '获得吸收100伤害的护盾，持续5秒', '🛡️', '#00ffff'); }
    use(sc) {
        super.use(sc);
        sc.rt.sh = 100 + sc.rt.spec.arm * 6;
        sc.rt.sht = sc.time.now;
        sc.p.skill(GW/2, GH/2, 'shield');
        const sh = sc.add.circle(GW/2, GH/2, 60, 0x00ffff, .2);
        sc.tweens.add({ targets: sh, scale: [1, 1.2, 1], alpha: [.3, .1, .3], duration: 1000, repeat: 4, yoyo: true, onComplete: () => sh.destroy() });
    }
}

class SK_bow extends Skill {
    constructor() { super('穿透射击', 7000, '射出一支穿透箭，对直线上所有敌人造成280%伤害', '🏹', '#88ff88'); }
    use(sc) {
        super.use(sc);
        const p = sc.input.activePointer;
        const tx = p.x + sc.px - GW/2, ty = p.y + sc.py - GH/2;
        const dmg = Math.floor(sc.rt.w.dmg(sc.rt.wl, sc.rt.spec) * 2.8);
        const es = sc.em.line(sc.px, sc.py, tx, ty, 25);
        es.forEach(e => { e.takeDamage(dmg); sc.shwD(e.sp.x, e.sp.y, dmg); });
        if (sc.bm.b?.alive) {
            const b = sc.bm.b;
            if (sc.em.onLine(sc.px, sc.py, tx, ty, b.wx, b.wy, 40)) b.takeDamage(dmg);
        }
        sc.p.skill(GW/2, GH/2, 'pierce');
    }
}

class SK_wand extends Skill {
    constructor() { super('奥术爆发', 5000, '在鼠标位置引发魔法爆炸，对150范围敌人造成320%伤害', '💫', '#ff66ff'); }
    use(sc) {
        super.use(sc);
        const p = sc.input.activePointer;
        const tx = p.x + sc.px - GW/2, ty = p.y + sc.py - GH/2;
        const dmg = Math.floor(sc.rt.w.dmg(sc.rt.wl, sc.rt.spec) * 3.2);
        const es = sc.em.rng(tx, ty, 150);
        es.forEach(e => { e.takeDamage(dmg); sc.shwD(e.sp.x, e.sp.y, dmg); });
        if (sc.bm.b?.alive) {
            const b = sc.bm.b;
            const d = Phaser.Math.Distance.Between(tx, ty, b.wx, b.wy);
            if (d <= 150) b.takeDamage(dmg);
        }
        sc.p.skill(p.x, p.y, 'boom');
    }
}

const SKF = {
    create(t) { const s = { sword: SK_sword, axe: SK_axe, staff: SK_staff, bow: SK_bow, wand: SK_wand }; return new (s[t] || SK_sword)(); }
};

class Minion {
    constructor(sc, t) { this.sc = sc; this.t = t; this.sp = null; this.ang = Math.random() * Math.PI * 2; this.r = 50; this.la = 0; this.al = true; this.wx = 0; this.wy = 0; }
    spawn() {
        this.wx = this.sc.px; this.wy = this.sc.py;
        const sx = this.wx - this.sc.px + GW/2, sy = this.wy - this.sc.py + GH/2;
        this.sp = this.sc.add.text(sx, sy, this.ic(), { fontSize: '28px' }).setOrigin(.5);
        this.sp.setDepth(51);
        this.sc.p.minion(sx, sy);
        this.sc.audio.play('unlock');
    }
    ic() { return this.t === 'le' ? '👼' : '💀'; }
    upd(t, dt) {
        if (!this.al || !this.sp) return;
        this.ang += dt * .002;
        this.wx = this.sc.px + Math.cos(this.ang) * this.r;
        this.wy = this.sc.py + Math.sin(this.ang) * this.r;
        this.sp.x = this.wx - this.sc.px + GW/2;
        this.sp.y = this.wy - this.sc.py + GH/2;
        this.sp.rotation = this.ang + Math.PI/2;
        this.act(t);
    }
    act(t) {}
}

class LE extends Minion {
    constructor(sc) { super(sc, 'le'); this.hi = 4500; this.ha = .06; }
    act(t) { if (t - this.la >= this.hi) { this.la = t; this.heal(); } }
    heal() {
        const amt = Math.floor(this.sc.rt.mhp * this.ha);
        this.sc.rt.hp = Math.min(this.sc.rt.hp + amt, this.sc.rt.mhp);
        this.sc.p.heal(this.sp.x, this.sp.y);
        this.sc.audio.play('mh');
        const tx = this.sc.add.text(this.sp.x, this.sp.y - 20, `+${amt}`,
            { fontSize: '16px', fontFamily: 'Courier New', color: '#44ff44' }).setOrigin(.5);
        this.sc.tweens.add({ targets: tx, y: this.sp.y - 45, alpha: 0, duration: 600, onComplete: () => tx.destroy() });
    }
}

class SW extends Minion {
    constructor(sc) { super(sc, 'sw'); this.ai = 1800; this.bd = 15; }
    act(t) { if (t - this.la >= this.ai) { this.la = t; this.atk(); } }
    atk() {
        const t = this.find();
        if (!t) return;
        const dmg = this.bd + this.sc.rt.spec.min * 3;
        t.takeDamage(dmg);
        this.sc.p.hit(t.sp.x, t.sp.y, 0xffaa00, 6);
        this.sc.audio.play('ma');
        this.sc.shwD(t.sp.x, t.sp.y, dmg);
    }
    find() {
        let n = null, md = Infinity;
        this.sc.em.es.forEach(e => {
            if (!e.al) return;
            const d = Phaser.Math.Distance.Between(this.wx, this.wy, e.wx, e.wy);
            if (d < md && d < 280) { md = d; n = e; }
        });
        if (!n && this.sc.bm.b?.alive) {
            const b = this.sc.bm.b;
            const d = Phaser.Math.Distance.Between(this.wx, this.wy, b.wx, b.wy);
            if (d < 300) return b;
        }
        return n;
    }
}

const MF = {
    create(sc, t) { const m = { le: LE, sw: SW }; return new (m[t] || LE)(sc); },
    info(t) {
        const i = {
            le: { n: '光明精灵', ic: '👼', d: '每4.5秒回复6%HP', u: '击败第3个Boss' },
            sw: { n: '骷髅战士', ic: '💀', d: '每1.8秒自动攻击敌人', u: '累计存活10分钟' }
        };
        return i[t] || i.le;
    }
};

class Proj {
    constructor(sc, x, y, tx, ty, dmg, t) {
        this.sc = sc; this.wx = x; this.wy = y; this.tx = tx; this.ty = ty;
        this.dmg = dmg; this.t = t; this.al = true; this.sp = null; this.speed = 400;
        const ang = Math.atan2(ty - y, tx - x);
        this.vx = Math.cos(ang) * this.speed;
        this.vy = Math.sin(ang) * this.speed;
        this.create();
    }
    create() {
        const sx = this.wx - this.sc.px + GW/2, sy = this.wy - this.sc.py + GH/2;
        const colors = { bone: 0xd4a574, arrow: 0x88ff88, frost: 0x00ffff, magic: 0xff66ff };
        const cl = colors[this.t] || 0xffffff;
        if (this.t === 'arrow' || this.t === 'bone') {
            this.sp = this.sc.add.rectangle(sx, sy, 4, 16, cl);
            this.sp.rotation = Math.atan2(this.vy, this.vx) + Math.PI/2;
        } else {
            this.sp = this.sc.add.circle(sx, sy, 6, cl);
        }
        this.sc.audio.play('proj');
    }
    upd(dt) {
        if (!this.al) return;
        this.wx += this.vx * dt / 1000;
        this.wy += this.vy * dt / 1000;
        this.sp.x = this.wx - this.sc.px + GW/2;
        this.sp.y = this.wy - this.sc.py + GH/2;
        if (this.sp.x < -50 || this.sp.x > GW + 50 || this.sp.y < -50 || this.sp.y > GH + 50) {
            this.die(); return;
        }
        this.checkHit();
    }
    checkHit() {
        for (const e of this.sc.em.es) {
            if (!e.al) continue;
            const d = Phaser.Math.Distance.Between(this.wx, this.wy, e.wx, e.wy);
            if (d < 25) {
                e.takeDamage(this.dmg);
                this.sc.shwD(e.sp.x, e.sp.y, this.dmg);
                this.sc.p.hit(e.sp.x, e.sp.y, 0xff4444, 5);
                this.die();
                return;
            }
        }
        if (this.sc.bm.b?.alive) {
            const b = this.sc.bm.b;
            const d = Phaser.Math.Distance.Between(this.wx, this.wy, b.wx, b.wy);
            if (d < 50) {
                b.takeDamage(this.dmg);
                this.die();
            }
        }
    }
    die() {
        this.al = false;
        if (this.sp) { this.sp.destroy(); this.sp = null; }
    }
}

class Item {
    constructor(sc, t, x, y) {
        this.sc = sc; this.t = t; this.wx = x; this.wy = y; this.al = true; this.sp = null;
        this.create();
    }
    create() {
        const sx = this.wx - this.sc.px + GW/2, sy = this.wy - this.sc.py + GH/2;
        const icons = { health: '❤️', shield: '🛡️', bomb: '💣', gold: '💰', exp: '✨' };
        this.sp = this.sc.add.text(sx, sy, icons[this.t] || '❓', { fontSize: '20px' }).setOrigin(.5);
        this.sc.tweens.add({ targets: this.sp, y: sy - 10, duration: 500, yoyo: true, repeat: -1 });
    }
    upd() {
        if (!this.al) return;
        this.sp.x = this.wx - this.sc.px + GW/2;
        this.sp.y = this.wy - this.sc.py + GH/2;
        const d = Phaser.Math.Distance.Between(this.wx, this.wy, this.sc.px, this.sc.py);
        if (d < 40) this.pick();
    }
    pick() {
        this.al = false;
        this.sc.audio.play('pick');
        switch (this.t) {
            case 'health':
                const h = Math.floor(this.sc.rt.mhp * .2);
                this.sc.rt.hp = Math.min(this.sc.rt.hp + h, this.sc.rt.mhp);
                this.sc.p.heal(GW/2, GH/2);
                break;
            case 'shield':
                this.sc.rt.sh += 50;
                break;
            case 'bomb':
                const dmg = 80;
                this.sc.em.es.forEach(e => {
                    if (!e.al) return;
                    const d = Phaser.Math.Distance.Between(this.wx, this.wy, e.wx, e.wy);
                    if (d < 200) { e.takeDamage(dmg); this.sc.shwD(e.sp.x, e.sp.y, dmg); }
                });
                this.sc.p.skill(this.sp.x, this.sp.y, 'boom');
                break;
            case 'gold':
                const g = 10 + Math.floor(Math.random() * 15);
                this.sc.rt.g += g;
                this.sc.rt.tge += g;
                this.sc.p.gold(this.sp.x, this.sp.y);
                break;
            case 'exp':
                const e = 20 + Math.floor(Math.random() * 20);
                this.sc.gainExp(e);
                this.sc.p.exp(this.sp.x, this.sp.y);
                break;
        }
        this.sp.destroy();
    }
}

class Enemy {
    constructor(sc, t) {
        this.sc = sc; this.t = t; this.hp = 0; this.mhp = 0; this.dmg = 0; this.tt = 0;
        this.st = sc.time.now; this.lu = sc.time.now; this.ls = sc.time.now;
        this.sp = null; this.hpb = null; this.hpbg = null; this.al = true;
        this.wx = 0; this.wy = 0; this.spd = this.speed();
        this.sa = false; this.sd = false; this.mp = this.pattern();
    }
    speed() { const s = { slime: 35, bat: 65, skeleton: 45, ghost: 55, gargoyle: 28, archer: 50 }; return s[this.t] || 40; }
    pattern() { const p = { slime: 'direct', bat: 'zig', skeleton: 'direct', ghost: 'tp', gargoyle: 'slow', archer: 'dist' }; return p[this.t] || 'direct'; }
    reset(hp, dmg, tt) {
        this.hp = hp; this.mhp = hp; this.dmg = dmg; this.tt = tt;
        this.st = this.sc.time.now; this.lu = this.sc.time.now; this.ls = this.sc.time.now;
        this.al = true; this.wx = 0; this.wy = 0; this.sa = false; this.sd = false;
    }
    spawn(x, y) {
        this.wx = x; this.wy = y;
        const sz = this.t === 'gargoyle' ? 36 : 26;
        const sx = GW/2 + x - this.sc.px, sy = GH/2 + y - this.sc.py;
        this.sp = this.sc.add.container(sx, sy);
        this.sp.setData('e', this);
        this.mkSpr(sz);
        this.hpbg = this.sc.add.rectangle(sx, sy - sz/2 - 10, sz, 5, 0x220000);
        this.hpb = this.sc.add.rectangle(sx, sy - sz/2 - 10, sz, 5, 0xaa0022);
        this.hpb.setOrigin(.5, .5);
        this.sc.p.spawn(sx, sy, this.clr());
        return this;
    }
    mkSpr(sz) {
        const cs = { slime: 0x336600, bat: 0x440044, skeleton: 0xbbbbbb, ghost: 0x225555, gargoyle: 0x553333, archer: 0x775533 };
        const c = cs[this.t] || 0x666666;
        switch (this.t) {
            case 'slime':
                this.sp.add(this.sc.add.ellipse(0, 0, sz*.85, sz*.65, c));
                this.sp.add(this.sc.add.circle(-5, -3, 3, 0));
                this.sp.add(this.sc.add.circle(5, -3, 3, 0));
                break;
            case 'bat':
                this.sp.add(this.sc.add.ellipse(0, 0, sz*.45, sz*.65, c));
                const w1 = this.sc.add.ellipse(-7, 0, sz*.55, sz*.22, c); w1.rotation = -.4;
                const w2 = this.sc.add.ellipse(7, 0, sz*.55, sz*.22, c); w2.rotation = .4;
                this.sp.add(w1); this.sp.add(w2);
                this.sp.add(this.sc.add.circle(0, -3, 3, 0xff0000));
                break;
            case 'skeleton':
                this.sp.add(this.sc.add.circle(0, -6, sz*.32, c));
                this.sp.add(this.sc.add.circle(-3, -7, 2, 0));
                this.sp.add(this.sc.add.circle(3, -7, 2, 0));
                this.sp.add(this.sc.add.rectangle(0, 4, sz*.22, sz*.45, c));
                break;
            case 'ghost':
                this.sp.add(this.sc.add.ellipse(0, 0, sz*.65, sz*.85, c, .55));
                this.sp.add(this.sc.add.circle(-5, -4, 4, 0x00ffff));
                this.sp.add(this.sc.add.circle(5, -4, 4, 0x00ffff));
                break;
            case 'gargoyle':
                this.sp.add(this.sc.add.rectangle(0, 0, sz*.55, sz*.75, c));
                this.sp.add(this.sc.add.circle(0, -9, sz*.28, c));
                this.sp.add(this.sc.add.circle(0, -9, 4, 0xff0000));
                break;
            case 'archer':
                this.sp.add(this.sc.add.rectangle(0, 3, sz*.28, sz*.55, c));
                this.sp.add(this.sc.add.circle(0, -6, sz*.22, 0xcccccc));
                this.sp.add(this.sc.add.circle(2, -6, 2, 0));
                this.sp.add(this.sc.add.arc(8, 3, 7, 0, Math.PI, true, 0x553311));
                break;
        }
    }
    clr() { const cs = { slime: 0x336600, bat: 0x440044, skeleton: 0xbbbbbb, ghost: 0x225555, gargoyle: 0x553333, archer: 0x775533 }; return cs[this.t] || 0x666666; }
    upd(t, dt) {
        if (!this.al) return;
        const sx = this.wx - this.sc.px + GW/2, sy = this.wy - this.sc.py + GH/2;
        this.sp.x = sx; this.sp.y = sy;
        const sz = this.t === 'gargoyle' ? 36 : 26;
        this.hpb.x = sx; this.hpb.y = sy - sz/2 - 10;
        this.hpbg.x = sx; this.hpbg.y = sy - sz/2 - 10;
        this.spec(t);
        this.mv(t, dt);
    }
    mv(t, dt) {
        const px = this.sc.px, py = this.sc.py;
        const dx = px - this.wx, dy = py - this.wy;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 45) { this.sc.phit(this); return; }
        let mx = 0, my = 0;
        switch (this.mp) {
            case 'direct': mx = (dx/d)*this.spd; my = (dy/d)*this.spd; break;
            case 'zig':
                const z = Math.sin(t*.005 + this.wx) * 30;
                mx = (dx/d)*this.spd; my = ((dy+z)/d)*this.spd; break;
            case 'slow': mx = (dx/d)*this.spd*.7; my = (dy/d)*this.spd*.7; break;
            case 'dist':
                if (d < 200) { mx = -(dx/d)*this.spd*.5; my = -(dy/d)*this.spd*.5; }
                else { mx = (dx/d)*this.spd; my = (dy/d)*this.spd; }
                break;
            case 'tp':
                if (d > 150 && Math.random() < .002) {
                    const a = Math.random() * Math.PI * 2;
                    this.wx = px - Math.cos(a) * 100;
                    this.wy = py - Math.sin(a) * 100;
                } else { mx = (dx/d)*this.spd; my = (dy/d)*this.spd; }
                break;
        }
        this.wx += mx * dt * .05;
        this.wy += my * dt * .05;
    }
    spec(t) {
        const px = this.sc.px, py = this.sc.py;
        const d = Phaser.Math.Distance.Between(this.wx, this.wy, px, py);
        switch (this.t) {
            case 'bat':
                if (t - this.ls > 3500 && d < 280) { this.ls = t; this.dive(px, py); } break;
            case 'skeleton':
                if (t - this.ls > 3000 && d < 200) { this.ls = t; this.bone(px, py); } break;
            case 'ghost':
                if (t - this.ls > 4500 && d < 250) { this.ls = t; this.gtp(px, py); } break;
            case 'gargoyle':
                if (Math.random() < .012) { this.sa = true; setTimeout(() => this.sa = false, 2000); } break;
            case 'archer':
                if (t - this.ls > 3500 && d < 300) { this.ls = t; this.arain(px, py); } break;
        }
    }
    dive(tx, ty) {
        const a = Math.atan2(ty - this.wy, tx - this.wx);
        this.wx += Math.cos(a) * 120; this.wy += Math.sin(a) * 120;
        const sx = this.wx - this.sc.px + GW/2, sy = this.wy - this.sc.py + GH/2;
        this.sc.tweens.add({ targets: this.sp, x: sx, y: sy, scale: [1, 1.5, 1], duration: 350, ease: 'Power2' });
    }
    bone(tx, ty) { this.sc.projs.push(new Proj(this.sc, this.wx, this.wy, tx, ty, this.dmg*.7, 'bone')); }
    gtp(tx, ty) {
        this.sc.tweens.add({ targets: this.sp, alpha: 0, duration: 250, onComplete: () => {
            const a = Math.random() * Math.PI * 2;
            this.wx = tx - Math.cos(a) * 120; this.wy = ty - Math.sin(a) * 120;
            const sx = this.wx - this.sc.px + GW/2, sy = this.wy - this.sc.py + GH/2;
            this.sp.x = sx; this.sp.y = sy;
            this.sc.tweens.add({ targets: this.sp, alpha: .55, duration: 350 });
        }});
    }
    arain(tx, ty) {
        for (let i = 0; i < 4; i++) {
            const off = (Math.random() - .5) * Math.PI / 2.5;
            setTimeout(() => {
                this.sc.projs.push(new Proj(this.sc, this.wx, this.wy,
                    tx + Math.cos(off)*60, ty + Math.sin(off)*60, this.dmg*.6, 'arrow'));
            }, i * 100);
        }
    }
    split() {
        if (this.sd) return;
        this.sd = true;
        for (let i = 0; i < 2; i++) {
            const m = new Enemy(this.sc, 'slime');
            const st = this.sc.em.stats('slime');
            m.reset(Math.floor(st[0]/3), Math.floor(st[1]/2), st[2]);
            m.spawn(this.wx + (i===0?-35:35), this.wy + (i===0?35:-35));
            this.sc.em.es.push(m);
        }
    }
    takeDamage(amt) {
        if (!this.al) return false;
        if (this.sa) amt = Math.floor(amt * .35);
        this.hp -= amt; this.uHB();
        this.sc.tweens.add({ targets: this.sp, alpha: .25, duration: 60, yoyo: true });
        if (this.hp <= 0) { this.die(); return true; }
        return false;
    }
    uHB() {
        if (this.hpb && this.sp) {
            const r = Math.max(0, this.hp / this.mhp);
            const sz = this.t === 'gargoyle' ? 36 : 26;
            this.hpb.setScale(r, 1);
            this.hpb.x = this.sp.x - (sz * (1 - r)) / 2;
        }
    }
    die() {
        this.al = false;
        const g = Math.floor(Math.random() * 6) + 1;
        const e = Math.floor(this.mhp / 5);
        this.sc.ekill(this, g, e);
        if (this.t === 'slime' && this.mhp >= 50 && !this.sd) this.split();
        this.drop();
        if (this.sp) {
            this.sc.tweens.add({ targets: [this.sp, this.hpb, this.hpbg], alpha: 0, scale: 0, duration: 250,
                onComplete: () => { this.sp.destroy(); this.hpb.destroy(); this.hpbg.destroy(); }});
        }
    }
    drop() {
        if (Math.random() < .18) {
            const ts = ['health', 'shield', 'bomb', 'gold', 'exp'];
            const ws = [22, 15, 12, 32, 19];
            this.sc.items.push(new Item(this.sc, this.wr(ts, ws), this.wx, this.wy));
        }
    }
    wr(it, w) {
        const t = w.reduce((a, b) => a + b, 0);
        let r = Math.random() * t;
        for (let i = 0; i < it.length; i++) { r -= w[i]; if (r <= 0) return it[i]; }
        return it[it.length - 1];
    }
}

class EM {
    constructor(sc) { this.sc = sc; this.es = []; this.ls = 0; this.si = 2000; }
    stats(t) {
        const diff = 1 + this.sc.rt.st / 60 * .3;
        const bs = {
            slime: [25, 8, 8], bat: [18, 6, 6], skeleton: [35, 12, 10],
            ghost: [28, 10, 9], gargoyle: [80, 20, 15], archer: [22, 14, 7]
        };
        const b = bs[t] || [20, 5, 5];
        return [Math.floor(b[0] * diff), Math.floor(b[1] * diff), b[2]];
    }
    spawn(t) {
        const ang = Math.random() * Math.PI * 2;
        const dist = 450 + Math.random() * 150;
        const x = this.sc.px + Math.cos(ang) * dist;
        const y = this.sc.py + Math.sin(ang) * dist;
        const st = this.stats(t);
        const e = new Enemy(this.sc, t);
        e.reset(st[0], st[1], st[2]);
        e.spawn(x, y);
        this.es.push(e);
    }
    upd(time, dt) {
        if (time - this.ls > this.si) {
            this.ls = time;
            const types = ['slime', 'bat', 'skeleton', 'ghost', 'gargoyle', 'archer'];
            const maxT = Math.min(6, 1 + Math.floor(this.sc.rt.st / 30));
            const count = 1 + Math.floor(this.sc.rt.st / 20);
            for (let i = 0; i < Math.min(count, 5); i++) {
                const t = types[Math.floor(Math.random() * maxT)];
                this.spawn(t);
            }
            this.si = Math.max(600, 2000 - this.sc.rt.st * 10);
        }
        this.es = this.es.filter(e => e.al);
        this.es.forEach(e => e.upd(time, dt));
    }
    rng(x, y, r) {
        return this.es.filter(e => e.al && Phaser.Math.Distance.Between(x, y, e.wx, e.wy) <= r);
    }
    line(x1, y1, x2, y2, w) {
        return this.es.filter(e => e.al && this.onLine(x1, y1, x2, y2, e.wx, e.wy, w));
    }
    onLine(x1, y1, x2, y2, px, py, w) {
        const dx = x2 - x1, dy = y2 - y1;
        const len = Math.sqrt(dx*dx + dy*dy);
        if (len === 0) return false;
        const t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (len * len)));
        const cx = x1 + t * dx, cy = y1 + t * dy;
        return Math.sqrt((px - cx) ** 2 + (py - cy) ** 2) <= w;
    }
    arc(x, y, r, ang, aa) {
        return this.es.filter(e => {
            if (!e.al) return false;
            const d = Phaser.Math.Distance.Between(x, y, e.wx, e.wy);
            if (d > r) return false;
            const ea = Math.atan2(e.wy - y, e.wx - x);
            let diff = ea - ang;
            while (diff > Math.PI) diff -= Math.PI * 2;
            while (diff < -Math.PI) diff += Math.PI * 2;
            return Math.abs(diff) <= aa / 2;
        });
    }
}

class Boss {
    constructor(sc, t) {
        this.sc = sc; this.t = t; this.hp = 0; this.mhp = 0; this.dmg = 0;
        this.sp = null; this.hpb = null; this.al = true; this.wx = 0; this.wy = 0;
        this.ls = 0; this.sc_ = 5000; this.name = this.nm(); this.ms = 18; this.id = false;
    }
    nm() { const n = { gk: '哥布林王', sl: '骷髅领主', sd: '暗影龙', dl: '深渊魔王' }; return n[this.t] || 'Boss'; }
    spawn(hp, dmg) {
        this.hp = hp; this.mhp = hp; this.dmg = dmg;
        const cs = { gk: 0x8B4513, sl: 0x555555, sd: 0x4B0082, dl: 0x8B0000 };
        const c = cs[this.t] || 0xff0000;
        this.wx = this.sc.px; this.wy = this.sc.py;
        this.sp = this.sc.add.container(GW/2, GH/2);
        this.sp.setAlpha(0);
        this.mkSpr(c);
        this.hpbg = this.sc.add.rectangle(GW/2, 80, 450, 14, 0x333333);
        this.hpb = this.sc.add.rectangle(GW/2, 80, 450, 14, 0xff0000);
        this.hpb.setOrigin(.5, .5);
        this.nt = this.sc.add.text(GW/2, 55, this.name, {
            fontSize: '32px', fontFamily: 'Courier New', color: '#ff6600',
            stroke: '#000', strokeThickness: 4
        }).setOrigin(.5);
        this.sc.tweens.add({ targets: this.sp, alpha: [0, 1], scale: [.5, 1], duration: 1000,
            onComplete: () => this.id = true });
        return this;
    }
    mkSpr(c) {
        const sz = 70;
        switch (this.t) {
            case 'gk':
                this.sp.add(this.sc.add.rectangle(0, 0, sz*.75, sz*.95, c));
                this.sp.add(this.sc.add.circle(0, -22, sz*.38, c));
                this.sp.add(this.sc.add.triangle(0, -38, 0, -15, -22, -38, 22, -38, 0xffd700));
                this.sp.add(this.sc.add.circle(0, -22, 7, 0xff0000));
                break;
            case 'sl':
                this.sp.add(this.sc.add.rectangle(0, 0, sz*.55, sz*.85, c));
                this.sp.add(this.sc.add.circle(0, -28, sz*.42, c));
                this.sp.add(this.sc.add.triangle(0, -45, 0, -22, -28, -45, 28, -45, 0x888888));
                this.sp.add(this.sc.add.circle(-9, -28, 6, 0x00ffff));
                this.sp.add(this.sc.add.circle(9, -28, 6, 0x00ffff));
                break;
            case 'sd':
                this.sp.add(this.sc.add.ellipse(0, 0, sz*.85, sz*1.3, c));
                this.sp.add(this.sc.add.circle(0, -45, sz*.33, c));
                this.sp.add(this.sc.add.circle(0, -45, 6, 0xff0000));
                const dw1 = this.sc.add.ellipse(-40, -15, sz*.65, sz*.33, c); dw1.rotation = -.4;
                const dw2 = this.sc.add.ellipse(40, -15, sz*.65, sz*.33, c); dw2.rotation = .4;
                this.sp.add(dw1); this.sp.add(dw2);
                break;
            case 'dl':
                this.sp.add(this.sc.add.rectangle(0, 0, sz*.65, sz*1.15, c));
                this.sp.add(this.sc.add.circle(0, -38, sz*.38, c));
                this.sp.add(this.sc.add.rectangle(-16, -55, 7, 18, c));
                this.sp.add(this.sc.add.rectangle(16, -55, 7, 18, c));
                this.sp.add(this.sc.add.circle(0, -38, 8, 0xff0000));
                break;
        }
    }
    upd(time, dt) {
        if (!this.al || !this.id) return;
        const sx = this.wx - this.sc.px + GW/2, sy = this.wy - this.sc.py + GH/2;
        this.sp.x = sx; this.sp.y = sy;
        const dx = this.sc.px - this.wx, dy = this.sc.py - this.wy;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d > 80) {
            this.wx += (dx/d) * this.ms * dt * .05;
            this.wy += (dy/d) * this.ms * dt * .05;
        }
        if (d < 70) this.sc.phit(this);
        if (time - this.ls > this.sc_) { this.ls = time; this.skill(time); }
    }
    skill(time) {
        switch (this.t) {
            case 'gk': this.summon(); break;
            case 'sl': this.boneWall(); break;
            case 'sd': this.breath(); break;
            case 'dl': this.rain(); break;
        }
    }
    summon() {
        this.sc.audio.play('special');
        for (let i = 0; i < 3; i++) {
            const a = Math.random() * Math.PI * 2;
            const d = 150;
            const e = new Enemy(this.sc, 'skeleton');
            const st = this.sc.em.stats('skeleton');
            e.reset(st[0], st[1], st[2]);
            e.spawn(this.wx + Math.cos(a)*d, this.wy + Math.sin(a)*d);
            this.sc.em.es.push(e);
        }
    }
    boneWall() {
        this.sc.audio.play('special');
        for (let i = 0; i < 5; i++) {
            const ang = (i / 5) * Math.PI * 2;
            this.sc.projs.push(new Proj(this.sc, this.wx, this.wy,
                this.wx + Math.cos(ang)*200, this.wy + Math.sin(ang)*200, this.dmg*.6, 'bone'));
        }
    }
    breath() {
        this.sc.audio.play('special');
        const ang = Math.atan2(this.sc.py - this.wy, this.sc.px - this.wx);
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                this.sc.projs.push(new Proj(this.sc, this.wx, this.wy,
                    this.wx + Math.cos(ang + (i-1)*.3)*400,
                    this.wy + Math.sin(ang + (i-1)*.3)*400, this.dmg*.8, 'frost'));
            }, i * 150);
        }
    }
    rain() {
        this.sc.audio.play('special');
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const a = Math.random() * Math.PI * 2;
                const d = Math.random() * 250;
                this.sc.projs.push(new Proj(this.sc, this.wx + Math.cos(a)*d, this.wy + Math.sin(a)*d,
                    this.sc.px + (Math.random()-.5)*200, this.sc.py + (Math.random()-.5)*200,
                    this.dmg*.5, 'magic'));
            }, i * 80);
        }
    }
    takeDamage(amt) {
        if (!this.al) return false;
        this.hp -= amt;
        const r = Math.max(0, this.hp / this.mhp);
        this.hpb.setScale(r, 1);
        this.hpb.x = GW/2 - (450 * (1 - r)) / 2;
        this.sc.tweens.add({ targets: this.sp, alpha: .5, duration: 80, yoyo: true });
        if (this.hp <= 0) { this.die(); return true; }
        return false;
    }
    die() {
        this.al = false;
        this.sc.p.bossDie(this.sp.x, this.sp.y);
        this.sc.audio.play('bd');
        this.sc.tweens.add({ targets: [this.sp, this.hpb, this.hpbg, this.nt], alpha: 0, scale: 0, duration: 500,
            onComplete: () => { this.sp.destroy(); this.hpb.destroy(); this.hpbg.destroy(); this.nt.destroy(); }});
        this.sc.onBossDefeat();
    }
}

class BM {
    constructor(sc) { this.sc = sc; this.b = null; this.lbt = 0; this.bi = 90000; this.bts = ['gk', 'sl', 'sd', 'dl']; }
    upd(time, dt) {
        if (!this.b && time - this.lbt > this.bi) {
            this.lbt = time;
            this.spawnBoss();
        }
        if (this.b) this.b.upd(time, dt);
    }
    spawnBoss() {
        this.sc.audio.play('bw');
        const idx = this.sc.rt.bc % this.bts.length;
        const t = this.bts[idx];
        const diff = 1 + this.sc.rt.bc * .5;
        const hp = Math.floor(500 * diff);
        const dmg = Math.floor(25 * diff);
        this.b = new Boss(this.sc, t);
        this.b.spawn(hp, dmg);
    }
}

class Game extends Phaser.Scene {
    constructor() { super('Game'); }
    preload() {}
    create() {
        this.saved = GD.load();
        this.rt = new RT();
        this.p = new PS(this);
        this.audio = new Audio(this);
        this.em = new EM(this);
        this.bm = new BM(this);
        this.projs = [];
        this.items = [];
        this.px = 0; this.py = 0;
        this.state = 'menu';
        this.paused = false;
        this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE,ESC,ONE,TWO,THREE,FOUR,FIVE');
        this.input.on('pointerdown', p => this.onClick(p));
        this.input.keyboard.on('keydown-SPACE', () => this.useSkill());
        this.input.keyboard.on('keydown-ESC', () => this.togglePause());
        this.createBG();
        this.createPlayer();
        this.createHUD();
        this.showMenu();
    }
    createBG() {
        this.bg = this.add.graphics();
        this.drawBG();
    }
    drawBG() {
        this.bg.clear();
        this.bg.fillStyle(0x0a0a15, 1);
        this.bg.fillRect(0, 0, GW, GH);
        const gridSize = 80;
        const ox = -this.px % gridSize + GW/2;
        const oy = -this.py % gridSize + GH/2;
        this.bg.lineStyle(1, 0x1a1a2e, .5);
        for (let x = ox; x < GW; x += gridSize) {
            this.bg.beginPath(); this.bg.moveTo(x, 0); this.bg.lineTo(x, GH); this.bg.strokePath();
        }
        for (let y = oy; y < GH; y += gridSize) {
            this.bg.beginPath(); this.bg.moveTo(0, y); this.bg.lineTo(GW, y); this.bg.strokePath();
        }
    }
    createPlayer() {
        this.player = this.add.container(GW/2, GH/2);
        const body = this.add.circle(0, 0, 18, 0x4488ff);
        const head = this.add.circle(0, -10, 12, 0xffcc99);
        const eye1 = this.add.circle(-4, -12, 3, 0);
        const eye2 = this.add.circle(4, -12, 3, 0);
        this.player.add(body); this.player.add(head); this.player.add(eye1); this.player.add(eye2);
        this.wpSpr = this.add.text(20, 0, '⚔️', { fontSize: '24px' }).setOrigin(.5);
        this.player.add(this.wpSpr);
        this.player.setDepth(100);
    }
    createHUD() {
        this.hpBg = this.add.rectangle(70, 30, 120, 16, 0x333333).setOrigin(0, .5);
        this.hpBar = this.add.rectangle(70, 30, 120, 16, 0xff3333).setOrigin(0, .5);
        this.hpText = this.add.text(130, 30, '200/200',
            { fontSize: '12px', fontFamily: 'Courier New', color: '#fff' }).setOrigin(.5);
        this.expBg = this.add.rectangle(70, 55, 120, 8, 0x222244).setOrigin(0, .5);
        this.expBar = this.add.rectangle(70, 55, 0, 8, 0xffff44).setOrigin(0, .5);
        this.lvlText = this.add.text(20, 42, 'Lv.1',
            { fontSize: '14px', fontFamily: 'Courier New', color: '#ffd700', fontWeight: 'bold' });
        this.goldText = this.add.text(GW - 20, 25, '💰 0',
            { fontSize: '16px', fontFamily: 'Courier New', color: '#ffd700' }).setOrigin(1, 0);
        this.timeText = this.add.text(GW/2, 15, '00:00',
            { fontSize: '18px', fontFamily: 'Courier New', color: '#fff' }).setOrigin(.5);
        this.comboText = this.add.text(GW - 20, 55, '',
            { fontSize: '18px', fontFamily: 'Courier New', color: '#ff6600', fontWeight: 'bold' }).setOrigin(1, 0);
        this.skillBtn = this.add.circle(GW - 50, GH - 50, 30, 0x222244)
            .setInteractive().on('pointerdown', () => this.useSkill());
        this.skillIcon = this.add.text(GW - 50, GH - 50, '💥', { fontSize: '24px' }).setOrigin(.5);
        this.skillCD = this.add.circle(GW - 50, GH - 50, 30, 0x000000, .6);
        this.skillCD.setVisible(false);
        this.pauseBtn = this.add.text(GW - 20, GH - 20, '⏸️', { fontSize: '20px' })
            .setOrigin(1, 1).setInteractive().on('pointerdown', () => this.togglePause());
    }
    showMenu() {
        this.state = 'menu';
        this.menuBg = this.add.rectangle(0, 0, GW, GH, 0x000000, .85).setOrigin(0);
        this.title = this.add.text(GW/2, 120, '暗影猎手',
            { fontSize: '56px', fontFamily: 'Courier New', color: '#ff4466',
                stroke: '#000', strokeThickness: 6 }).setOrigin(.5);
        this.subtitle = this.add.text(GW/2, 170, 'SHADOW HUNTER',
            { fontSize: '20px', fontFamily: 'Courier New', color: '#888' }).setOrigin(.5);
        this.wpTitle = this.add.text(GW/2, 220, '选择你的武器',
            { fontSize: '22px', fontFamily: 'Courier New', color: '#fff' }).setOrigin(.5);
        this.wpCards = [];
        const wps = WF.all();
        wps.forEach((w, i) => {
            const info = WF.info(w);
            const x = 100 + i * 140, y = 320;
            const card = this.add.container(x, y);
            const bg = this.add.rectangle(0, 0, 120, 140, info.bg).setStrokeStyle(3, info.c);
            const ic = this.add.text(0, -30, info.ic, { fontSize: '40px' }).setOrigin(.5);
            const nm = this.add.text(0, 15, info.n,
                { fontSize: '14px', fontFamily: 'Courier New', color: '#fff' }).setOrigin(.5);
            const ds = this.add.text(0, 40, info.d,
                { fontSize: '10px', fontFamily: 'Courier New', color: '#aaa', align: 'center', wordWrap: { width: 100 } }).setOrigin(.5);
            card.add(bg); card.add(ic); card.add(nm); card.add(ds);
            card.setSize(120, 140);
            card.setInteractive(new Phaser.Geom.Rectangle(-60, -70, 120, 140), Phaser.Geom.Rectangle.Contains);
            card.on('pointerdown', () => this.startGame(w));
            card.on('pointerover', () => bg.setScale(1.05));
            card.on('pointerout', () => bg.setScale(1));
            this.wpCards.push(card);
        });
        this.tip = this.add.text(GW/2, GH - 80, 'WASD移动 | 鼠标瞄准自动攻击 | 空格释放技能',
            { fontSize: '14px', fontFamily: 'Courier New', color: '#888' }).setOrigin(.5);
        this.statsText = this.add.text(20, GH - 20,
            `最佳时间: ${this.fmtTime(this.saved.bt)} | 总击杀: ${this.saved.tk} | 成就: ${this.saved.ach.length}/21`,
            { fontSize: '12px', fontFamily: 'Courier New', color: '#666' }).setOrigin(0, 1);
    }
    startGame(wt) {
        this.state = 'playing';
        this.audio.play('sel');
        this.menuBg.destroy(); this.title.destroy(); this.subtitle.destroy();
        this.wpTitle.destroy(); this.tip.destroy(); this.statsText.destroy();
        this.wpCards.forEach(c => c.destroy());
        this.rt.wt = wt;
        this.rt.w = WF.create(wt);
        this.rt.sk = SKF.create(wt);
        const info = WF.info(wt);
        this.wpSpr.setText(info.ic);
        this.skillIcon.setText(this.rt.sk.ic);
        if (this.saved.um.includes('le')) this.addMinion('le');
        if (this.saved.um.includes('sw')) this.addMinion('sw');
        this.startTime = this.time.now;
        this.saved.tr++;
        GD.save(this.saved);
    }
    addMinion(t) {
        if (this.rt.ms.find(m => m.t === t)) return;
        const m = MF.create(this, t);
        m.spawn();
        this.rt.ms.push(m);
    }
    onClick(p) {
        if (this.state !== 'playing' || this.paused) return;
    }
    useSkill() {
        if (this.state !== 'playing' || this.paused) return;
        if (!this.rt.sk?.can(this.time.now)) return;
        this.rt.sk.use(this);
    }
    togglePause() {
        if (this.state !== 'playing') return;
        this.paused = !this.paused;
        this.audio.play(this.paused ? 'pause' : 'res');
        if (this.paused) this.showPauseMenu();
        else this.hidePauseMenu();
    }
    showPauseMenu() {
        this.pauseBg = this.add.rectangle(0, 0, GW, GH, 0x000000, .7).setOrigin(0);
        this.pauseText = this.add.text(GW/2, GH/2 - 40, '游戏暂停',
            { fontSize: '36px', fontFamily: 'Courier New', color: '#fff' }).setOrigin(.5);
        this.resumeBtn = this.add.text(GW/2, GH/2 + 20, '继续游戏 (ESC)',
            { fontSize: '20px', fontFamily: 'Courier New', color: '#00ff88' })
            .setOrigin(.5).setInteractive().on('pointerdown', () => this.togglePause());
        this.quitBtn = this.add.text(GW/2, GH/2 + 60, '返回主菜单',
            { fontSize: '20px', fontFamily: 'Courier New', color: '#ff6666' })
            .setOrigin(.5).setInteractive().on('pointerdown', () => this.quitToMenu());
    }
    hidePauseMenu() {
        this.pauseBg?.destroy(); this.pauseText?.destroy();
        this.resumeBtn?.destroy(); this.quitBtn?.destroy();
    }
    quitToMenu() {
        this.paused = false;
        this.hidePauseMenu();
        this.resetGame();
        this.showMenu();
    }
    resetGame() {
        this.em.es.forEach(e => { if (e.sp) e.sp.destroy(); if (e.hpb) e.hpb.destroy(); if (e.hpbg) e.hpbg.destroy(); });
        this.em.es = [];
        this.projs.forEach(p => p.sp?.destroy());
        this.projs = [];
        this.items.forEach(i => i.sp?.destroy());
        this.items = [];
        this.rt.ms.forEach(m => m.sp?.destroy());
        if (this.bm.b) {
            this.bm.b.sp?.destroy(); this.bm.b.hpb?.destroy();
            this.bm.b.hpbg?.destroy(); this.bm.b.nt?.destroy();
        }
        this.bm.b = null;
        this.p.clear();
        this.px = 0; this.py = 0;
        this.player.x = GW/2; this.player.y = GH/2;
        this.rt.reset();
    }
    update(time, delta) {
        if (this.state !== 'playing' || this.paused) return;
        this.rt.st = (time - this.startTime) / 1000;
        if (time - this.rt.ldt > 1000) {
            this.rt.ut += 1;
            this.rt.ldt = time;
        }
        this.movePlayer(delta);
        this.updateAttack(time);
        this.em.upd(time, delta);
        this.bm.upd(time, delta);
        this.projs.forEach(p => p.upd(delta));
        this.projs = this.projs.filter(p => p.al);
        this.items.forEach(i => i.upd());
        this.items = this.items.filter(i => i.al);
        this.rt.ms.forEach(m => m.upd(time, delta));
        this.updateCombo(time);
        this.updateHUD();
        this.drawBG();
        this.checkAchievements();
        if (this.rt.hp <= 0) this.gameOver();
    }
    movePlayer(dt) {
        const spd = 200 * dt / 1000;
        let dx = 0, dy = 0;
        if (this.keys.W.isDown) dy -= 1;
        if (this.keys.S.isDown) dy += 1;
        if (this.keys.A.isDown) dx -= 1;
        if (this.keys.D.isDown) dx += 1;
        if (dx || dy) {
            const len = Math.sqrt(dx*dx + dy*dy);
            dx /= len; dy /= len;
            this.px += dx * spd * 60;
            this.py += dy * spd * 60;
            this.px = Math.max(-WS/2, Math.min(WS/2, this.px));
            this.py = Math.max(-WS/2, Math.min(WS/2, this.py));
        }
        const p = this.input.activePointer;
        const ang = Math.atan2(p.y - GH/2, p.x - GW/2);
        this.wpSpr.x = Math.cos(ang) * 25;
        this.wpSpr.y = Math.sin(ang) * 25;
        this.wpSpr.rotation = ang;
    }
    updateAttack(time) {
        const w = this.rt.w;
        if (!w) return;
        const cd = w.aspd(this.rt.spec);
        if (time - w.la < cd) return;
        w.la = time;
        const p = this.input.activePointer;
        const tx = p.x + this.px - GW/2, ty = p.y + this.py - GH/2;
        const ang = Math.atan2(ty - this.py, tx - this.px);
        const dmg = w.dmg(this.rt.wl, this.rt.spec);
        const isCrit = this.rt.nc || Math.random() < w.cr(this.rt.spec);
        const fd = isCrit ? Math.floor(dmg * w.cd(this.rt.spec)) : dmg;
        if (this.rt.nc) this.rt.nc = false;
        const snd = { sword: 'atk_s', axe: 'atk_a', staff: 'atk_st', bow: 'atk_b', wand: 'atk_w' };
        this.audio.play(snd[this.rt.wt] || 'atk_s');
        switch (w.t) {
            case 'melee_arc':
                this.p.wave(GW/2 + Math.cos(ang)*w.r*.5, GH/2 + Math.sin(ang)*w.r*.5, ang, w.cl, w.aw, w.r);
                const hits = this.em.arc(this.px, this.py, w.r, ang, w.aa);
                hits.forEach(e => {
                    e.takeDamage(fd);
                    this.shwD(e.sp.x, e.sp.y, fd, isCrit);
                    this.p.hit(e.sp.x, e.sp.y, w.cl, 5);
                });
                if (this.bm.b?.alive) {
                    const b = this.bm.b;
                    const d = Phaser.Math.Distance.Between(this.px, this.py, b.wx, b.wy);
                    if (d <= w.r) {
                        const ba = Math.atan2(b.wy - this.py, b.wx - this.px);
                        let diff = ba - ang;
                        while (diff > Math.PI) diff -= Math.PI*2;
                        while (diff < -Math.PI) diff += Math.PI*2;
                        if (Math.abs(diff) <= w.aa/2) { b.takeDamage(fd); this.shwD(b.sp.x, b.sp.y, fd, isCrit); }
                    }
                }
                break;
            case 'ranged_line':
                const endX = this.px + Math.cos(ang) * w.r;
                const endY = this.py + Math.sin(ang) * w.r;
                this.p.wave(GW/2 + Math.cos(ang)*w.r*.5, GH/2 + Math.sin(ang)*w.r*.5, ang + Math.PI/2, w.cl, w.aw, w.r);
                const lh = this.em.line(this.px, this.py, endX, endY, w.aw);
                lh.forEach(e => {
                    e.takeDamage(fd);
                    this.shwD(e.sp.x, e.sp.y, fd, isCrit);
                    this.p.hit(e.sp.x, e.sp.y, w.cl, 4);
                });
                if (this.bm.b?.alive) {
                    if (this.em.onLine(this.px, this.py, endX, endY, this.bm.b.wx, this.bm.b.wy, w.aw + 30)) {
                        this.bm.b.takeDamage(fd); this.shwD(this.bm.b.sp.x, this.bm.b.sp.y, fd, isCrit);
                    }
                }
                break;
            case 'ranged_proj':
                this.projs.push(new Proj(this, this.px, this.py, tx, ty, fd, 'arrow'));
                break;
            case 'ranged_bounce':
                for (let i = 0; i < 3; i++) {
                    const off = (i - 1) * .2;
                    this.projs.push(new Proj(this, this.px, this.py,
                        this.px + Math.cos(ang + off) * w.r,
                        this.py + Math.sin(ang + off) * w.r, fd, 'magic'));
                }
                break;
        }
        if (isCrit) this.audio.play('crit');
    }
    shwD(x, y, dmg, crit = false) {
        const t = this.add.text(x, y - 20, crit ? `${dmg}!` : `${dmg}`, {
            fontSize: crit ? '22px' : '16px', fontFamily: 'Courier New',
            color: crit ? '#ffff00' : '#ff6666',
            stroke: '#000', strokeThickness: 2, fontWeight: 'bold'
        }).setOrigin(.5);
        this.tweens.add({ targets: t, y: y - 40, alpha: 0, duration: 600, onComplete: () => t.destroy() });
    }
    phit(src) {
        if (this.time.now - this.rt.it < 600) return;
        this.rt.it = this.time.now;
        this.rt.ut = 0;
        let dmg = src.dmg;
        dmg = Math.max(1, dmg - this.rt.spec.arm * 2);
        if (this.rt.sh > 0) {
            const absorbed = Math.min(this.rt.sh, dmg);
            this.rt.sh -= absorbed;
            dmg -= absorbed;
        }
        this.rt.hp -= dmg;
        this.audio.play('dmg');
        this.cameras.main.shake(200, .01);
        this.tweens.add({ targets: this.player, alpha: .3, duration: 100, yoyo: true, repeat: 3 });
        this.shwD(GW/2, GH/2 - 30, dmg);
    }
    ekill(e, g, exp) {
        this.rt.kc++;
        this.rt.combo++;
        this.rt.lkt = this.time.now;
        if (this.rt.combo > this.rt.mc) this.rt.mc = this.rt.combo;
        const gBonus = 1 + this.rt.spec.g * .05;
        const eBonus = 1 + this.rt.spec.exp * .06;
        const fg = Math.floor(g * gBonus);
        const fe = Math.floor(exp * eBonus);
        this.rt.g += fg;
        this.rt.tge += fg;
        this.gainExp(fe);
        this.audio.play('kill');
        this.p.hit(e.sp.x, e.sp.y, 0xffff00, 6);
        this.p.gold(e.sp.x, e.sp.y);
        this.p.exp(e.sp.x, e.sp.y);
    }
    gainExp(amt) {
        this.rt.exp += amt;
        this.audio.play('exp');
        while (this.rt.exp >= this.rt.ent) {
            this.rt.exp -= this.rt.ent;
            this.rt.l++;
            this.rt.expToNext = Math.floor(40 * Math.pow(1.15, this.rt.l - 1));
            this.rt.sp++;
            this.rt.mhp += 10;
            this.rt.hp = Math.min(this.rt.hp + 20, this.rt.mhp);
            this.audio.play('lvl');
            this.p.lvlUp();
            this.showLevelUp();
        }
    }
    showLevelUp() {
        this.paused = true;
        this.lvlBg = this.add.rectangle(0, 0, GW, GH, 0x000000, .8).setOrigin(0);
        this.lvlTitle = this.add.text(GW/2, 150, `升级! Lv.${this.rt.l}`,
            { fontSize: '36px', fontFamily: 'Courier New', color: '#ffd700',
                stroke: '#000', strokeThickness: 4 }).setOrigin(.5);
        this.lvlSub = this.add.text(GW/2, 200, '选择一项专精提升',
            { fontSize: '18px', fontFamily: 'Courier New', color: '#fff' }).setOrigin(.5);
        this.specCards = [];
        const specs = [
            { k: 'atk', n: '攻击强化', ic: '⚔️', d: '攻击力+8%', c: '#ff4466' },
            { k: 'aspd', n: '攻速提升', ic: '⚡', d: '攻击速度+6%', c: '#ffaa00' },
            { k: 'crit', n: '暴击精通', ic: '💥', d: '暴击率+2%', c: '#ff0066' },
            { k: 'hp', n: '生命强化', ic: '❤️', d: '最大生命+30', c: '#ff3333' },
            { k: 'arm', n: '护甲提升', ic: '🛡️', d: '护甲+2', c: '#00ffff' },
            { k: 'g', n: '财富祝福', ic: '💰', d: '金币+5%', c: '#ffd700' },
            { k: 'exp', n: '经验加成', ic: '✨', d: '经验+6%', c: '#88ff88' },
            { k: 'min', n: '随从强化', ic: '👼', d: '随从伤害+3', c: '#ff88ff' }
        ];
        const selected = [];
        const pool = [...specs];
        for (let i = 0; i < 3 && pool.length > 0; i++) {
            const idx = Math.floor(Math.random() * pool.length);
            selected.push(pool.splice(idx, 1)[0]);
        }
        selected.forEach((s, i) => {
            const x = GW/2 + (i - 1) * 180, y = 350;
            const card = this.add.container(x, y);
            const bg = this.add.rectangle(0, 0, 150, 180, 0x1a1a2e).setStrokeStyle(3, s.c);
            const ic = this.add.text(0, -40, s.ic, { fontSize: '48px' }).setOrigin(.5);
            const nm = this.add.text(0, 10, s.n,
                { fontSize: '16px', fontFamily: 'Courier New', color: '#fff' }).setOrigin(.5);
            const ds = this.add.text(0, 45, s.d,
                { fontSize: '12px', fontFamily: 'Courier New', color: s.c }).setOrigin(.5);
            const lv = this.add.text(0, 70, `Lv.${this.rt.spec[s.k]}`,
                { fontSize: '14px', fontFamily: 'Courier New', color: '#888' }).setOrigin(.5);
            card.add(bg); card.add(ic); card.add(nm); card.add(ds); card.add(lv);
            card.setSize(150, 180);
            card.setInteractive(new Phaser.Geom.Rectangle(-75, -90, 150, 180), Phaser.Geom.Rectangle.Contains);
            card.on('pointerdown', () => this.pickSpec(s.k, card));
            card.on('pointerover', () => bg.setScale(1.05));
            card.on('pointerout', () => bg.setScale(1));
            this.specCards.push(card);
        });
    }
    pickSpec(k, card) {
        this.rt.spec[k]++;
        this.rt.sp--;
        if (k === 'hp') { this.rt.mhp += 30; this.rt.hp += 30; }
        this.audio.play('sel');
        this.lvlBg.destroy(); this.lvlTitle.destroy(); this.lvlSub.destroy();
        this.specCards.forEach(c => c.destroy());
        if (this.rt.sp > 0) {
            this.showLevelUp();
        } else {
            this.paused = false;
        }
    }
    onBossDefeat() {
        this.rt.bc++;
        this.saved.tbk++;
        this.saved.tg += this.rt.g;
        this.showReward();
        if (this.rt.bc >= 3 && !this.saved.um.includes('le')) {
            this.saved.um.push('le');
            this.addMinion('le');
        }
        if (this.saved.tst + this.rt.st >= 600 && !this.saved.um.includes('sw')) {
            this.saved.um.push('sw');
            this.addMinion('sw');
        }
        GD.save(this.saved);
    }
    showReward() {
        this.paused = true;
        this.rwBg = this.add.rectangle(0, 0, GW, GH, 0x000000, .85).setOrigin(0);
        this.rwTitle = this.add.text(GW/2, 120, `Boss击败!`,
            { fontSize: '40px', fontFamily: 'Courier New', color: '#ffd700',
                stroke: '#000', strokeThickness: 4 }).setOrigin(.5);
        this.rwSub = this.add.text(GW/2, 170, '选择一项奖励',
            { fontSize: '20px', fontFamily: 'Courier New', color: '#fff' }).setOrigin(.5);
        this.rwCards = [];
        const rewards = [
            { t: 'wl', n: '武器升级', ic: '⚔️', d: '武器等级+1，伤害+3', c: '#ff4466' },
            { t: 'heal', n: '完全恢复', ic: '❤️', d: '恢复所有生命值', c: '#44ff44' },
            { t: 'gold', n: '宝藏', ic: '💰', d: '获得100金币', c: '#ffd700' },
            { t: 'exp', n: '经验宝珠', ic: '✨', d: '获得大量经验', c: '#88ff88' },
            { t: 'shield', n: '护盾祝福', ic: '🛡️', d: '获得200点护盾', c: '#00ffff' }
        ];
        const selected = [];
        const pool = [...rewards];
        for (let i = 0; i < 3 && pool.length > 0; i++) {
            const idx = Math.floor(Math.random() * pool.length);
            selected.push(pool.splice(idx, 1)[0]);
        }
        selected.forEach((r, i) => {
            const x = GW/2 + (i - 1) * 180, y = 340;
            const card = this.add.container(x, y);
            const bg = this.add.rectangle(0, 0, 150, 200, 0x1a1a2e).setStrokeStyle(3, r.c);
            const ic = this.add.text(0, -50, r.ic, { fontSize: '52px' }).setOrigin(.5);
            const nm = this.add.text(0, 10, r.n,
                { fontSize: '18px', fontFamily: 'Courier New', color: '#fff' }).setOrigin(.5);
            const ds = this.add.text(0, 50, r.d,
                { fontSize: '13px', fontFamily: 'Courier New', color: r.c, align: 'center', wordWrap: { width: 120 } }).setOrigin(.5);
            card.add(bg); card.add(ic); card.add(nm); card.add(ds);
            card.setSize(150, 200);
            card.setInteractive(new Phaser.Geom.Rectangle(-75, -100, 150, 200), Phaser.Geom.Rectangle.Contains);
            card.on('pointerdown', () => this.pickReward(r.t, card));
            card.on('pointerover', () => bg.setScale(1.05));
            card.on('pointerout', () => bg.setScale(1));
            this.rwCards.push(card);
        });
        this.audio.play('rw');
    }
    pickReward(t, card) {
        switch (t) {
            case 'wl': this.rt.wl++; break;
            case 'heal': this.rt.hp = this.rt.mhp; break;
            case 'gold': this.rt.g += 100; this.rt.tge += 100; break;
            case 'exp': this.gainExp(200); break;
            case 'shield': this.rt.sh += 200; break;
        }
        this.audio.play('sel');
        this.rwBg.destroy(); this.rwTitle.destroy(); this.rwSub.destroy();
        this.rwCards.forEach(c => c.destroy());
        this.paused = false;
    }
    updateCombo(t) {
        if (t - this.rt.lkt > 2000 && this.rt.combo > 0) {
            this.rt.combo = 0;
        }
        if (this.rt.combo >= 5) {
            this.comboText.setText(`${this.rt.combo} 连击!`);
            if (this.rt.combo % 10 === 0) this.audio.play('combo');
        } else {
            this.comboText.setText('');
        }
    }
    updateHUD() {
        const hpr = Math.max(0, this.rt.hp / this.rt.mhp);
        this.hpBar.setScale(hpr, 1);
        this.hpBar.x = 70;
        this.hpBar.width = 120 * hpr;
        this.hpText.setText(`${Math.max(0, Math.floor(this.rt.hp))}/${this.rt.mhp}`);
        const expr = this.rt.exp / this.rt.ent;
        this.expBar.width = 120 * expr;
        this.lvlText.setText(`Lv.${this.rt.l}`);
        this.goldText.setText(`💰 ${this.rt.g}`);
        this.timeText.setText(this.fmtTime(this.rt.st));
        if (this.rt.sk) {
            const cdp = this.rt.sk.pct(this.time.now);
            this.skillCD.setVisible(cdp > 0);
            if (cdp > 0) {
                this.skillCD.setScale(1, 1);
            }
        }
    }
    fmtTime(s) {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }
    checkAchievements() {
        const rtData = {
            bc: this.rt.bc, tbk: this.saved.tbk, st: this.rt.st, kc: this.rt.kc,
            tge: this.rt.tge, l: this.rt.l, wl: this.rt.wl, ms: this.rt.ms.length,
            mc: this.rt.mc, ut: this.rt.ut
        };
        const na = Ach.check(rtData, this.saved);
        if (na.length > 0) {
            na.forEach(a => this.showAchievement(a));
            GD.save(this.saved);
        }
    }
    showAchievement(a) {
        this.p.ach();
        this.audio.play('ach');
        const bg = this.add.rectangle(GW/2, 100, 300, 60, 0x1a1a2e).setStrokeStyle(2, 0xffd700);
        const ic = this.add.text(GW/2 - 120, 100, a.icon, { fontSize: '28px' }).setOrigin(.5);
        const t1 = this.add.text(GW/2 - 80, 90, '成就解锁!',
            { fontSize: '12px', fontFamily: 'Courier New', color: '#ffd700' }).setOrigin(0, .5);
        const t2 = this.add.text(GW/2 - 80, 110, a.name,
            { fontSize: '16px', fontFamily: 'Courier New', color: '#fff' }).setOrigin(0, .5);
        this.tweens.add({ targets: [bg, ic, t1, t2], y: '+=20', alpha: 0, duration: 3000,
            onComplete: () => { bg.destroy(); ic.destroy(); t1.destroy(); t2.destroy(); }, delay: 2000 });
    }
    gameOver() {
        if (this.state === 'gameover') return;
        this.state = 'gameover';
        this.audio.play('go');
        this.saved.tk += this.rt.kc;
        this.saved.tst += this.rt.st;
        if (this.rt.st > this.saved.bt) this.saved.bt = this.rt.st;
        if (this.rt.l > this.saved.ml) this.saved.ml = this.rt.l;
        this.saved.tg += this.rt.g;
        GD.save(this.saved);
        this.goBg = this.add.rectangle(0, 0, GW, GH, 0x000000, .85).setOrigin(0);
        this.goTitle = this.add.text(GW/2, 150, '游戏结束',
            { fontSize: '48px', fontFamily: 'Courier New', color: '#ff4466',
                stroke: '#000', strokeThickness: 4 }).setOrigin(.5);
        const stats = [
            `存活时间: ${this.fmtTime(this.rt.st)}`,
            `达到等级: ${this.rt.l}`,
            `击杀敌人: ${this.rt.kc}`,
            `击败Boss: ${this.rt.bc}`,
            `获得金币: ${this.rt.g}`,
            `最高连击: ${this.rt.mc}`,
            `武器等级: ${this.rt.wl}`
        ];
        stats.forEach((s, i) => {
            this.add.text(GW/2, 230 + i * 30, s,
                { fontSize: '16px', fontFamily: 'Courier New', color: '#fff' }).setOrigin(.5);
        });
        this.bestText = this.add.text(GW/2, 230 + stats.length * 30 + 20,
            `最佳时间: ${this.fmtTime(this.saved.bt)}`,
            { fontSize: '14px', fontFamily: 'Courier New', color: '#ffd700' }).setOrigin(.5);
        this.restartBtn = this.add.text(GW/2, GH - 120, '重新开始',
            { fontSize: '24px', fontFamily: 'Courier New', color: '#44ff88' })
            .setOrigin(.5).setInteractive().on('pointerdown', () => this.restart());
        this.menuBtn = this.add.text(GW/2, GH - 80, '返回主菜单',
            { fontSize: '18px', fontFamily: 'Courier New', color: '#aaa' })
            .setOrigin(.5).setInteractive().on('pointerdown', () => {
                this.goBg?.destroy(); this.goTitle?.destroy();
                this.restartBtn?.destroy(); this.menuBtn?.destroy();
                this.bestText?.destroy();
                this.resetGame();
                this.showMenu();
            });
    }
    restart() {
        this.goBg?.destroy(); this.goTitle?.destroy();
        this.restartBtn?.destroy(); this.menuBtn?.destroy();
        this.bestText?.destroy();
        const wt = this.rt.wt;
        this.resetGame();
        this.rt.wt = wt;
        this.rt.w = WF.create(wt);
        this.rt.sk = SKF.create(wt);
        const info = WF.info(wt);
        this.wpSpr.setText(info.ic);
        this.skillIcon.setText(this.rt.sk.ic);
        if (this.saved.um.includes('le')) this.addMinion('le');
        if (this.saved.um.includes('sw')) this.addMinion('sw');
        this.state = 'playing';
        this.startTime = this.time.now;
        this.saved.tr++;
        GD.save(this.saved);
    }
}

const config = {
    type: Phaser.AUTO,
    width: GW,
    height: GH,
    parent: 'game-container',
    pixelArt: true,
    scene: [Game],
    backgroundColor: '#0a0a15'
};

new Phaser.Game(config);

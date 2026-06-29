/**
 * 暗影猎手：神话版 v5 - Shadow Hunter: Mythic V
 * 顶级像素肉鸽生存游戏 - 终极进化版
 *
 * 核心特色：
 * ✦ 5种独特武器 - 暗影剑(平衡) / 烈焰斧(爆发) / 冰霜法杖(控制) / 狩猎弓(精准) / 奥术魔杖(灵活)
 * ✦ 8位Boss - 多阶段战斗机制，3阶段递进，独特技能
 * ✦ 6系24项专精 - 力量/敏捷/防御/元素/财富/召唤
 * ✦ 5章剧情 - 序章至终末之战，每章独立主题
 * ✦ 90秒波次 - 清晰波次显示，每10波精英波，每20波Boss波
 * ✦ 神秘商人 / 宝箱怪 / 彩虹史莱姆 / 连击称号
 */

const GW = 900, GH = 650, WS = 3500;

// ==================== 区域系统 ====================
const REGIONS = [
    { id: 0, name: '腐朽森林', color: 0x1a3a1a, enemyPool: ['slime', 'bat', 'skeleton'], ambient: 'leaves', portalX: 1200 },
    { id: 1, name: '沉没沼泽', color: 0x1a2a3a, enemyPool: ['ghost', 'archer', 'skeleton'], ambient: 'fog', portalX: 1200 },
    { id: 2, name: '焦土荒原', color: 0x3a2a1a, enemyPool: ['demon', 'gargoyle', 'bat'], ambient: 'sand', portalX: 1200 },
    { id: 3, name: '永夜城堡', color: 0x2a1a3a, enemyPool: ['skeleton', 'ghost', 'demon'], ambient: 'candle', portalX: 1200 },
    { id: 4, name: '裂隙深处', color: 0x3a0a0a, enemyPool: ['demon', 'gargoyle', 'archer', 'skeleton'], ambient: 'rift', portalX: 0 }
];
const REGION_SIZE = 2500; // 每个区域的世界半径

// ==================== 剧情系统 ====================
const STORY_CHAPTERS = [
    {
        regionId: 0,
        title: '第一章：腐朽森林',
        bossId: 'gk',
        quest: { type: 'activate', count: 3, name: '激活符文阵' },
        intro: '暗影裂隙的侵蚀从这片森林开始。符文阵是封印的关键，但它们已经暗淡了...',
        npcDialogues: {
            elder: {
                intro: '旅行者...你终于来了。森林深处的符文阵已经暗淡，没有它们的力量，哥布林王的封印将会破碎。',
                questUpdate: (done, total) => `已激活 ${done}/${total} 个符文阵。森林在回应你的力量...`,
                questComplete: '符文阵全部激活了！传送门已开启，哥布林王在等着你...小心，他曾经是个善良的国王。',
                afterBoss: '你净化了哥布林王...愿他的灵魂安息。但裂隙深处还有更黑暗的东西在等着你。'
            }
        }
    },
    {
        regionId: 1,
        title: '第二章：沉没沼泽',
        bossId: 'sl',
        quest: { type: 'collect', count: 5, name: '清理精英怪' },
        intro: '沼泽的雾气中隐藏着不祥的气息。据说这里的怪物源于一场失败的炼金实验...',
        npcDialogues: {
            alchemist: {
                intro: '又来了一个冒险者？沼泽里的精英怪物身上有我需要的实验残骸...帮我清理它们，我告诉你通往骷髅领主领地的路。',
                questUpdate: (done, total) => `已清理 ${done}/${total} 个精英怪。它们的残骸...让我想起了那次实验。`,
                questComplete: '够了。传送门已开启。听好，骷髅领主...它曾经是我的实验体。它不是自然产生的亡灵。',
                afterBoss: '你击败了它...也许这是最好的结局。但我总觉得，有什么东西在暗中观察着我们。'
            }
        }
    },
    {
        regionId: 2,
        title: '第三章：焦土荒原',
        bossId: 'sd',
        quest: { type: 'collect', count: 3, name: '收集区域信物' },
        intro: '荒原的烈日下，死神的阴影笼罩一切。收集信物，才能打开通往它的道路...',
        npcDialogues: {
            nomad: {
                intro: '荒原上的死神...它不是来杀戮的。它在这里等待什么。收集3个古代信物，通往它的道路才会开启。',
                questUpdate: (done, total) => `${done}/${total} 个信物。你知道吗？死神是自愿被腐化的...为了保护什么。`,
                questComplete: '路开了。去吧，但记住——死神选择被腐化，一定有它的理由。',
                afterBoss: '死神...自由了。它临终前说的话...你听到了吗？"封印...不能...打开..."它在保护什么？'
            }
        }
    },
    {
        regionId: 3,
        title: '第四章：永夜城堡',
        bossId: 'ab',
        quest: { type: 'activate', count: 4, name: '点燃灯塔' },
        intro: '永夜笼罩的城堡中，暗影伯爵在等待。点燃四座灯塔，才能照亮他的真面目...',
        npcDialogues: {
            shade: {
                intro: '城堡的主人...暗影伯爵。他不是一个普通的暗影。点燃4座灯塔，他才会现出真身。',
                questUpdate: (done, total) => `${done}/${total} 座灯塔已点燃。光越亮，影子越深...你注意到了吗？`,
                questComplete: '灯塔全部点燃了。伯爵...不，我不能说。你自己去看吧。但我要告诉你——他和你很像。',
                afterBoss: '你看到了吗？伯爵的面容...和你一模一样。你...到底是什么？'
            }
        }
    },
    {
        regionId: 4,
        title: '终章：裂隙深处',
        bossId: 'sg',
        quest: { type: 'challenge', count: 4, name: '击败BOSS幻影' },
        intro: '裂隙的最深处，真相等待着。你必须击败过去的所有敌人...才能面对最终的自己。',
        npcDialogues: {
            yourself: {
                intro: '你终于来了...或者说，我终于回来了。这里的幻影是过去的守护者，击败它们，你就能见到...真相。',
                questUpdate: (done, total) => `${done}/${total} 个幻影已击败。每打败一个，我就想起更多...关于我们的事。`,
                questComplete: '幻影全部消散了。门开了。门后是...暗影神。不，暗影神就是你。你就是暗影神的一部分。',
                afterBoss: '你...击败了自己。裂隙正在愈合。但你...还能回到原来的世界吗？也许下一次，你会做出不同的选择。'
            }
        }
    }
];

// 动态对话条件
function getNPCDialogue(chapterIdx, saveData) {
    const chapter = STORY_CHAPTERS[chapterIdx];
    if (!chapter) return null;
    const npcKey = Object.keys(chapter.npcDialogues)[0];
    const dialogues = chapter.npcDialogues[npcKey];

    // 根据条件返回不同对话
    const bossesDefeated = (saveData.highestBoss || 0);

    if (saveData.runCount > 1 && chapterIdx === 0) {
        return { npc: npcKey, text: '又是你...你感觉到了吗？这一切好像发生过。也许...真的发生过。' };
    }
    if (bossesDefeated > chapterIdx + 1 && dialogues.afterBoss) {
        return { npc: npcKey, text: dialogues.afterBoss };
    }
    return { npc: npcKey, text: dialogues.intro };
}

// ==================== 武器技能槽选项 ====================
const WEAPON_SKILLS = {
    sword: [
        [
            { id: 'bleed+', name: '流血强化', desc: '流血伤害+50%，持续+2秒' },
            { id: 'lifesteal+', name: '吸血强化', desc: '吸血比例+3%' }
        ],
        [
            { id: 'combo+', name: '连击大师', desc: '连击阈值从5降为3，连击伤害+20%' },
            { id: 'crit+', name: '致命打击', desc: '暴击率+15%，暴击伤害+50%' }
        ],
        [
            { id: 'bloodburst+', name: '血爆强化', desc: '血爆范围+50%，伤害+100%' },
            { id: 'frenzy', name: '血怒狂暴', desc: '连击时移速+30%，攻速+20%' }
        ]
    ],
    axe: [
        [
            { id: 'burn+', name: '燃烧强化', desc: '燃烧伤害+50%，可叠加至7层' },
            { id: 'stun+', name: '震荡打击', desc: '眩晕概率+15%，眩晕时间+0.5秒' }
        ],
        [
            { id: 'firefield+', name: '火域扩张', desc: '火域范围+60%，持续+2秒' },
            { id: 'aoe+', name: '横扫一切', desc: '攻击范围+30%，伤害+15%' }
        ],
        [
            { id: 'fireexplosion+', name: '引爆强化', desc: '火域引爆伤害+150%' },
            { id: 'meteor', name: '陨石天降', desc: '每5秒召唤陨石砸向最强敌人' }
        ]
    ],
    staff: [
        [
            { id: 'slow+', name: '寒冰渗透', desc: '减速效果+20%，持续+1秒' },
            { id: 'split+', name: '冰锥分裂', desc: '冰锥额外分裂+1发' }
        ],
        [
            { id: 'freeze+', name: '深度冰冻', desc: '冰冻概率+10%，冰冻时间+0.5秒' },
            { id: 'chain+', name: '寒冰链', desc: '冰锥命中后连锁到附近2个敌人' }
        ],
        [
            { id: 'execute+', name: '处决强化', desc: '处决阈值从20%提升至30%' },
            { id: 'blizzard', name: '暴风雪', desc: '每8秒释放暴风雪，全场减速80%持续3秒' }
        ]
    ],
    bow: [
        [
            { id: 'pierce+', name: '穿透强化', desc: '护甲穿透+25%' },
            { id: 'range+', name: '远程专精', desc: '射程+30%，箭矢速度+20%' }
        ],
        [
            { id: 'critdouble+', name: '精准双发', desc: '暴击双发概率+20%' },
            { id: 'rapid', name: '急速射', desc: '攻速+25%，但伤害-10%' }
        ],
        [
            { id: 'mark+', name: '死亡标记', desc: '标记伤害加成从25%提升至50%' },
            { id: 'multishot', name: '散射箭', desc: '每次射出3支箭，但伤害-30%' }
        ]
    ],
    wand: [
        [
            { id: 'resonance+', name: '共鸣强化', desc: '元素共鸣伤害+40%' },
            { id: 'mana+', name: '法力充盈', desc: '攻击速度+15%' }
        ],
        [
            { id: 'arcane+', name: '奥术印记', desc: '奥术印记积累速度+50%' },
            { id: 'element+', name: '元素亲和', desc: '所有元素效果持续+2秒' }
        ],
        [
            { id: 'storm+', name: '风暴强化', desc: '元素风暴伤害+100%，范围+30%' },
            { id: 'overload', name: '法术过载', desc: '每3次攻击触发一次免费元素风暴' }
        ]
    ]
};

const WEAPON_FUSIONS = {
    'sword+axe':   { name: '烈焰血刃', icon: '⚔🔥', color: 0xff4422, comboSkill: '血焰爆：流血+燃烧融合，每3秒触发范围爆炸' },
    'sword+staff': { name: '冰霜刺客', icon: '⚔❄', color: 0x44aaff, comboSkill: '冰血穿刺：冰冻敌人受到流血伤害+200%' },
    'sword+bow':   { name: '幻影游侠', icon: '⚔🏹', color: 0x44ff88, comboSkill: '幻影斩雨：近战命中后自动射出3支追踪箭' },
    'sword+wand':  { name: '符文剑士', icon: '⚔✦', color: 0xaa44ff, comboSkill: '符文血印：流血敌人受到奥术伤害+150%' },
    'axe+staff':   { name: '寒炎战锤', icon: '🔥❄', color: 0x88ffff, comboSkill: '蒸气爆破：燃烧+冰冻同时存在时触发蒸气爆炸' },
    'axe+bow':     { name: '熔岩猎手', icon: '🔥🏹', color: 0xff8844, comboSkill: '熔岩箭雨：箭矢命中附带燃烧效果' },
    'axe+wand':    { name: '烬火法师', icon: '🔥✦', color: 0xff44aa, comboSkill: '烬火风暴：燃烧层数翻倍时触发奥术风暴' },
    'staff+bow':   { name: '霜风射手', icon: '❄🏹', color: 0x88ddff, comboSkill: '冰霜箭风暴：暴击时冰冻全部敌人2秒' },
    'staff+wand':  { name: '极寒术士', icon: '❄✦', color: 0x6688ff, comboSkill: '绝对零度：冰冻敌人被击杀时冻结周围敌人' },
    'bow+wand':    { name: '奥术游侠', icon: '🏹✦', color: 0x44ffaa, comboSkill: '奥术弹幕：每5秒发射一轮奥术穿透弹' }
};

function getFusionKey(w1, w2) {
    const pair = [w1, w2].sort().join('+');
    return pair;
}

const COLORS = {
    player: 0x4488ff, playerBody: 0x3366cc, playerBodyDark: 0x224499,
    playerHead: 0xffcc99, playerHair: 0x553322,
    sword: 0xff4466, swordGlow: 0xff8899,
    axe: 0xff8800, axeGlow: 0xffaa44,
    staff: 0x00ffff, staffGlow: 0x66ffff,
    bow: 0x66ff66, bowGlow: 0x99ff99,
    wand: 0xff66ff, wandGlow: 0xff99ff,
    hp: 0xff3344, hpBg: 0x441122,
    exp: 0xffdd00, expBg: 0x222244,
    gold: 0xffd700, shield: 0x4488ff,
    bg1: 0x0a0a18, bg2: 0x0f0f28, grid: 0x1a1a35,
    enemy: {
        slime: 0x44cc44, slimeDark: 0x228822,
        bat: 0x772277, batDark: 0x441144,
        skeleton: 0xdddddd, skeletonDark: 0x999999,
        ghost: 0x66cccc, ghostDark: 0x338888,
        gargoyle: 0x995544, gargoyleDark: 0x663322,
        archer: 0xaa8855, archerDark: 0x775533,
        demon: 0xcc3333, demonDark: 0x881111
    },
    boss: {
        gk: 0x8B4513, gkGlow: 0xcd853f,
        sl: 0x777777, slGlow: 0xaaaaaa,
        sd: 0x4B0082, sdGlow: 0x8a2be2,
        ab: 0x8B0000, abGlow: 0xdc143c,
        ts: 0x228b22, tsGlow: 0x32cd32,
        el: 0xff4500, elGlow: 0xffd700,
        vp: 0x483d8b, vpGlow: 0x9370db,
        sg: 0x000000, sgGlow: 0xff00ff
    }
};

// ==================== 章节系统 ====================
const Chapters = [
    { id: 0, name: '序章：暗影降临', timeStart: 0, timeEnd: 300, subtitle: '哥布林王占据了这片土地...', story: '作为暗影猎手，你踏入了被邪恶力量侵蚀的边境。\n哥布林王的军队正在蔓延，阻止它们！', bgColor: 0x0a1a0a, accent: 0x44cc44, bossId: 'gk' },
    { id: 1, name: '第一章：死亡深渊', timeStart: 300, timeEnd: 600, subtitle: '骷髅领主苏醒了...', story: '深入地底，骷髅领主召集了不死军团。\n它的骨矛将贯穿一切阻挡者！', bgColor: 0x1a1a1a, accent: 0xdddddd, bossId: 'sl' },
    { id: 2, name: '第二章：龙之巢穴', timeStart: 600, timeEnd: 900, subtitle: '暗影龙盘旋于天空...', story: '攀上高山，暗影龙俯瞰着它的领地。\n它的龙息将焚烧一切敢于挑战的人！', bgColor: 0x1a0a2a, accent: 0x8a2be2, bossId: 'sd' },
    { id: 3, name: '第三章：深渊之门', timeStart: 900, timeEnd: 1500, subtitle: '深渊魔王正在打开地狱之门...', story: '穿越虚空，深渊魔王挥动着它的邪剑。\n阻止它，否则整个世界都将陷入黑暗！', bgColor: 0x2a0a0a, accent: 0xdc143c, bossId: 'ab' },
    { id: 4, name: '第四章：终末之战', timeStart: 1500, timeEnd: 99999, subtitle: '暗影神降临...', story: '最终之战打响。暗影神降临世间，\n只有真正的暗影猎手才能战胜它！', bgColor: 0x0a0a0a, accent: 0xff00ff, bossId: 'sg' }
];

// ==================== 6系24项专精 ====================
const SpecPaths = {
    power: { name: '力量系', color: 0xff4444, icon: '💪' },
    agility: { name: '敏捷系', color: 0xffff44, icon: '⚡' },
    defense: { name: '防御系', color: 0x4488ff, icon: '🛡' },
    element: { name: '元素系', color: 0xaa44ff, icon: '✨' },
    fortune: { name: '财富系', color: 0xffd700, icon: '💰' },
    summon: { name: '召唤系', color: 0x44ff88, icon: '👥' }
};

const Specializations = [
    { id: 'power_atk', path: 'power', name: '蛮力', icon: '💪', desc: '攻击力 +6%', color: 0xff4444, stat: 'atk', value: 0.06 },
    { id: 'power_crit', path: 'power', name: '暴击大师', icon: '🎯', desc: '暴击率 +4%', color: 0xff6644, stat: 'crit', value: 0.04 },
    { id: 'power_critdmg', path: 'power', name: '毁灭打击', icon: '💥', desc: '暴击伤害 +12%', color: 0xff8844, stat: 'critDmg', value: 0.12 },
    { id: 'power_skill', path: 'power', name: '力量巅峰', icon: '⚔', desc: '技能伤害 +10%', color: 0xffaa44, stat: 'skillDmg', value: 0.10 },
    { id: 'agi_speed', path: 'agility', name: '疾风步', icon: '👟', desc: '移动速度 +5%', color: 0xffff44, stat: 'speed', value: 0.05 },
    { id: 'agi_aspd', path: 'agility', name: '连击精通', icon: '⚡', desc: '攻击速度 +5%', color: 0xffff88, stat: 'aspd', value: 0.05 },
    { id: 'agi_dodge', path: 'agility', name: '闪避', icon: '💨', desc: '闪避率 +4%', color: 0xddff44, stat: 'dodge', value: 0.04 },
    { id: 'agi_shadow', path: 'agility', name: '影舞', icon: '🌑', desc: '暴击+3%，攻速+5%', color: 0xccff66, stat: 'crit_aspd', value: 0.03 },
    { id: 'def_hp', path: 'defense', name: '铁壁', icon: '🛡', desc: '最大生命 +18', color: 0x4488ff, stat: 'maxHp', value: 18 },
    { id: 'def_regen', path: 'defense', name: '生命回复', icon: '💚', desc: '每秒回复1HP', color: 0x44aaff, stat: 'regen', value: 0.5 },
    { id: 'def_armor', path: 'defense', name: '护甲', icon: '🔰', desc: '受到伤害 -6%', color: 0x44ccff, stat: 'armor', value: 0.06 },
    { id: 'def_revival', path: 'defense', name: '不屈', icon: '💖', desc: '免死一次', color: 0x88aaff, stat: 'revival', value: 1 },
    { id: 'ele_fire', path: 'element', name: '火焰亲和', icon: '🔥', desc: '攻击附加燃烧', color: 0xff4400, stat: 'fire', value: 1 },
    { id: 'ele_ice', path: 'element', name: '冰霜亲和', icon: '❄', desc: '攻击附加冰冻', color: 0x00ccff, stat: 'ice', value: 1 },
    { id: 'ele_light', path: 'element', name: '闪电亲和', icon: '⚡', desc: '攻击附加闪电链', color: 0xffff00, stat: 'lightning', value: 1 },
    { id: 'ele_shadow', path: 'element', name: '暗影亲和', icon: '🌑', desc: '攻击附加暗影', color: 0x8800ff, stat: 'shadow', value: 1 },
    { id: 'fort_gold', path: 'fortune', name: '财富祝福', icon: '💰', desc: '金币 +8%', color: 0xffd700, stat: 'gold', value: 0.08 },
    { id: 'fort_exp', path: 'fortune', name: '经验加成', icon: '⭐', desc: '经验 +8%', color: 0xffee00, stat: 'exp', value: 0.08 },
    { id: 'fort_magnet', path: 'fortune', name: '磁力', icon: '🧲', desc: '拾取范围+40%', color: 0xffcc00, stat: 'magnet', value: 40 },
    { id: 'fort_luck', path: 'fortune', name: '幸运', icon: '', desc: '稀有掉落+50%', color: 0xddaa00, stat: 'luck', value: 0.5 },
    { id: 'sum_strong', path: 'summon', name: '强化随从', icon: '💪', desc: '随从伤害+25%', color: 0x44ff88, stat: 'minionDmg', value: 0.25, isMinion: true },
    { id: 'sum_double', path: 'summon', name: '双随从', icon: '👥', desc: '可拥有2随从', color: 0x66ffaa, stat: 'minionCount', value: 1, isMinion: true },
    { id: 'sum_element', path: 'summon', name: '元素随从', icon: '✨', desc: '随从附加元素', color: 0x88ffcc, stat: 'minionEle', value: 1, isMinion: true },
    { id: 'sum_master', path: 'summon', name: '召唤大师', icon: '👑', desc: '随从攻速+15%', color: 0x44ffaa, stat: 'minionSpd', value: 0.15, isMinion: true }
];

// ==================== Boss配置 (8个) ====================
const BossConfigs = [
    { id: 'gk', name: '哥布林王', time: 120, hp: 1000, dmg: 18, spd: 48, radius: 55, size: 100, exp: 60, gold: 72, color: COLORS.boss.gk, glowColor: COLORS.boss.gkGlow, icon: '👑', desc: '贪婪的哥布林之王', skills: ['cleave', 'summonGoblins', 'enrage'] },
    { id: 'sl', name: '骷髅领主', time: 240, hp: 2000, dmg: 26, spd: 38, radius: 60, size: 115, exp: 120, gold: 144, color: COLORS.boss.sl, glowColor: COLORS.boss.slGlow, icon: '💀', desc: '亡灵军团指挥官', skills: ['throwBone', 'summonSkeletons', 'deathBloom', 'enrage'] },
    { id: 'sd', name: '暗影龙', time: 360, hp: 3800, dmg: 36, spd: 52, radius: 70, size: 135, exp: 220, gold: 240, color: COLORS.boss.sd, glowColor: COLORS.boss.sdGlow, icon: '🐉', desc: '翱翔于天空的远古巨龙', skills: ['flyAttack', 'fireBreath', 'tornado', 'meteorShower', 'enrage'] },
    { id: 'ab', name: '深渊魔王', time: 480, hp: 6200, dmg: 48, spd: 44, radius: 80, size: 160, exp: 380, gold: 420, color: COLORS.boss.ab, glowColor: COLORS.boss.abGlow, icon: '😈', desc: '来自深渊的恐怖存在', skills: ['cleave', 'darkSlash', 'hellfire', 'summonDemon', 'enrage'] },
    { id: 'ts', name: '时空守护者', time: 600, hp: 9500, dmg: 62, spd: 40, radius: 85, size: 170, exp: 600, gold: 660, color: COLORS.boss.ts, glowColor: COLORS.boss.tsGlow, icon: '⏳', desc: '操控时间的神秘存在', skills: ['timeSlow', 'timeStop', 'teleportStrike', 'summonShadow', 'enrage'] },
    { id: 'el', name: '元素领主', time: 720, hp: 13500, dmg: 78, spd: 38, radius: 90, size: 180, exp: 900, gold: 960, color: COLORS.boss.el, glowColor: COLORS.boss.elGlow, icon: '🌋', desc: '掌控四元素的大师', skills: ['fireWave', 'iceAge', 'lightningStorm', 'earthquake', 'enrage'] },
    { id: 'vp', name: '虚空先知', time: 840, hp: 18500, dmg: 96, spd: 42, radius: 95, size: 195, exp: 1300, gold: 1440, color: COLORS.boss.vp, glowColor: COLORS.boss.vpGlow, icon: '🔮', desc: '能看穿一切幻象的智者', skills: ['illusion', 'mindControl', 'voidRift', 'summonClones', 'enrage'] },
    { id: 'sg', name: '暗影神', time: 960, hp: 28000, dmg: 128, spd: 46, radius: 110, size: 230, exp: 2000, gold: 2400, color: COLORS.boss.sg, glowColor: COLORS.boss.sgGlow, icon: '👁', desc: '所有暗影的主宰', skills: ['shadowStorm', 'deathRay', 'voidPrison', 'summonAllies', 'ultimate', 'enrage'] }
];

// ==================== 武器系统 ====================
class Weapon {
    constructor(cfg) {
        this.id = cfg.id; this.name = cfg.name; this.desc = cfg.desc;
        this.icon = cfg.icon; this.color = cfg.color; this.glowColor = cfg.glowColor;
        this.baseDmg = cfg.baseDmg; this.baseCd = cfg.baseCd; this.range = cfg.range;
        this.type = cfg.type; this.arc = cfg.arc; this.width = cfg.width;
        this.skillName = cfg.skillName; this.skillIcon = cfg.skillIcon;
        this.skillCd = cfg.skillCd; this.skillDesc = cfg.skillDesc;
        this.skillAction = cfg.skillAction;
        this.lastAttack = 0; this.attackAnim = 0;
        this._runtime = null;
    }
    setRuntime(rt) { this._runtime = rt; }
    getPromotionStage() { return (this._runtime && this._runtime.weaponPromotions[this.id]) || 0; }
    // v5：武器形态阶段（0-4），来自 saveData.weaponForms
    getForm() {
        if (!this._runtime || !this._runtime._scene) return 0;
        const sd = this._runtime._scene.saveData;
        return (sd.weaponForms && sd.weaponForms[this.id]) || 0;
    }
    canAttack(now, spec, level = 1) { return now - this.lastAttack >= this.getCooldown(spec, level); }
    attack(now) { this.lastAttack = now; this.attackAnim = 1; }
    getDamage(level, spec) {
        const growth = this.getDamageGrowth(level);
        const base = this.baseDmg + growth;
        // v5：形态 4 终极 +25% 基础伤害
        const formMult = 1 + 0.25 * this.getForm();
        return Math.floor(base * (1 + (spec.atk || 0)) * (1 + (spec.weaponDmg || 0)) * formMult);
    }
    getDamageGrowth(level) {
        const stage = this.getPromotionStage();
        // 武器伤害成长放缓（约-30%），避免攻击力远超小怪血量增长
        const growthTable = {
            sword: [5, 8, 10],
            axe: [12, 15, 17],
            staff: [3, 5, 7],
            bow: [7, 8, 10],
            wand: [3, 4, 5]
        };
        const arr = growthTable[this.id] || growthTable.sword;
        const stageIdx = stage === 0 ? 0 : (stage === 1 ? (level >= 7 ? 2 : 1) : 2);
        return Math.floor((level - 1) * arr[stageIdx]);
    }
    getCooldown(spec, level = 1) {
        if (!spec) return this.baseCd;
        let cd = this.baseCd;
        if (this.id === 'sword') cd = this.baseCd * Math.pow(0.92, level - 1);
        if (this.id === 'axe') cd = this.baseCd * Math.pow(0.96, level - 1);
        if (this.id === 'wand') cd = this.baseCd * Math.pow(0.94, level - 1);
        if (this.id === 'bow') cd = this.baseCd * Math.pow(0.95, level - 1);
        if (this.id === 'staff') cd = this.baseCd * Math.pow(0.97, level - 1);
        return cd / (1 + (spec.aspd || 0) + (spec.crit_aspd || 0) * 0.5);
    }
    getCritChance(spec, level = 1) {
        let base = 0.05 + (spec.crit || 0) + (spec.crit_aspd || 0);
        if (this.id === 'sword') base += (level - 1) * 0.02;
        if (this.id === 'bow') base += (level - 1) * 0.025;
        if (this.id === 'axe') base += (level - 1) * 0.01;
        if (this.id === 'wand') base += (level - 1) * 0.012;
        // v5：形态 4（黑炎）+15% 暴击率
        if (this.getForm() >= 4) base += 0.15;
        return base;
    }
    getCritDamage(spec, level = 1) {
        let base = 1.8 + (spec.critDmg || 0);
        if (this.id === 'bow') base += (level - 1) * 0.10;
        if (this.id === 'sword') base += (level - 1) * 0.05;
        if (this.id === 'axe') base += (level - 1) * 0.06;
        return base;
    }
    getRange(level = 1) {
        let r = this.range;
        if (this.id === 'sword') r += (level - 1) * 6;
        if (this.id === 'axe') r += (level - 1) * 10;
        if (this.id === 'staff') r += (level - 1) * 15;
        if (this.id === 'bow') r += (level - 1) * 25;
        if (this.id === 'wand') r += (level - 1) * 12;
        // v5：形态 1（剑气/远射）+30% 攻击范围
        if (this.getForm() >= 1) r *= 1.3;
        return r;
    }
    getArc(level = 1) {
        let a = this.arc;
        if (this.id === 'sword') a = this.arc + (level - 1) * 0.08;
        if (this.id === 'axe') a = this.arc + (level - 1) * 0.06;
        return a;
    }
    getLifeSteal(level = 1) {
        const stage = this.getPromotionStage();
        let ls = 0;
        if (this.id === 'sword') {
            const base = 0.04 + (level - 1) * 0.008;
            ls = stage >= 1 ? base + (level - 4) * 0.01 : base;
        }
        if (this.id === 'axe') ls = 0.02 + (level - 1) * 0.005;
        // v5：形态 2（吸血）+6% 吸血（降低）
        if (this.getForm() >= 2) ls += 0.06;
        return ls;
    }
    getPierce(level = 1) {
        const stage = this.getPromotionStage();
        if (this.id === 'bow') {
            if (stage >= 2 && level >= 10) return 999;
            return 1 + Math.floor((level - 1) / 2);
        }
        if (this.id === 'staff') return Math.floor((level - 1) / 5);
        return 0;
    }
    getBounceCount(level = 1) {
        if (this.id === 'wand') return 2 + Math.floor((level - 1) / 2);
        return 0;
    }
    getProjectileCount(level = 1) {
        if (this.id === 'wand') return 2 + Math.floor((level - 1) / 3);
        if (this.id === 'staff') return 1 + Math.floor((level - 1) / 5);
        return 1;
    }
    getSkillDamage(level, spec) {
        const growth = this.getDamageGrowth(level) * 1.5;
        const base = this.baseDmg + growth;
        return Math.floor(base * (1 + (spec.atk || 0)) * (1 + (spec.skillDmg || 0)) * (1 + (spec.weaponDmg || 0)));
    }
    getBleedStacks(level = 1) { return this.id === 'sword' && level >= 4 ? 3 : 1; }
    getComboThreshold(level = 1) { return this.id === 'sword' && level >= 7 ? 5 : 999; }
    getFireField(level = 1) {
        if (this.id !== 'axe' || level < 7) return null;
        return { radius: 60 + (level - 7) * 15, duration: 3000, dps: 15 + level * 4 };
    }
    getIceField(level = 1) {
        if (this.id !== 'staff' || level < 7) return null;
        return { radius: 80, duration: 1500 + (level - 7) * 300, slow: 0.8 };
    }
    getMarkBonus(level = 1) {
        if (this.id !== 'bow' || level < 7) return null;
        return { damageBonus: 0.3, duration: 3000 + (level - 7) * 500 };
    }
    getArcaneMark(level = 1) {
        if (this.id !== 'wand' || level < 7) return null;
        return { damagePct: 0.5 + (level - 7) * 0.15, delay: 3000 };
    }
    updateAnim(delta) {
        if (this.attackAnim > 0) this.attackAnim = Math.max(0, this.attackAnim - delta / 150);
    }
}

const WeaponFactory = {
    configs: {
        sword: { id: 'sword', name: '暗影剑', icon: '⚔', color: COLORS.sword, glowColor: COLORS.swordGlow, desc: '基础:流血吸血 | 进阶:流血叠加3层 | 终极:连击血怒+血爆', baseDmg: 28, baseCd: 420, range: 125, type: 'melee_arc', arc: Math.PI / 1.8, width: 75, skillName: '暗影冲刺', skillIcon: '', skillCd: 6000, skillDesc: '向前冲刺，路径上敌人4倍伤害+回血', skillAction: 'swordDash' },
        axe: { id: 'axe', name: '烈焰斧', icon: '🪓', color: COLORS.axe, glowColor: COLORS.axeGlow, desc: '基础:燃烧击晕 | 进阶:燃烧叠加5层 | 终极:火域+引爆', baseDmg: 70, baseCd: 1100, range: 160, type: 'melee_arc', arc: Math.PI / 1.4, width: 120, skillName: '焚天斩', skillIcon: '🔥', skillCd: 9000, skillDesc: 'AOE圆形，范围250，燃烧6秒', skillAction: 'axeCleave' },
        staff: { id: 'staff', name: '冰霜法杖', icon: '🔮', color: COLORS.staff, glowColor: COLORS.staffGlow, desc: '基础:减速控场 | 进阶:冰锥分裂+冰冻 | 终极:冰冻领域+秒杀', baseDmg: 20, baseCd: 950, range: 420, type: 'ranged_line', arc: 0, width: 20, skillName: '极寒冰环', skillIcon: '❄', skillCd: 9000, skillDesc: '360度冰环，冻结1.5秒', skillAction: 'staffNova' },
        bow: { id: 'bow', name: '狩猎弓', icon: '', color: COLORS.bow, glowColor: COLORS.bowGlow, desc: '基础:护甲穿透 | 进阶:暴击双发 | 终极:标记+全穿透', baseDmg: 40, baseCd: 850, range: 700, type: 'ranged_projectile', arc: 0, width: 8, skillName: '流星箭雨', skillIcon: '', skillCd: 10000, skillDesc: '向天空射出25支箭覆盖大范围', skillAction: 'bowBarrage' },
        wand: { id: 'wand', name: '奥术魔杖', icon: '✨', color: COLORS.wand, glowColor: COLORS.wandGlow, desc: '基础:追踪弹射 | 进阶:元素共鸣 | 终极:奥术印记+元素风暴', baseDmg: 14, baseCd: 650, range: 350, type: 'ranged_bounce', arc: 0, width: 10, skillName: '奥术风暴', skillIcon: '', skillCd: 7000, skillDesc: '连续16发追踪飞弹', skillAction: 'wandStorm' }
    },
    create(type, runtime) {
        const w = new Weapon(this.configs[type] || this.configs.sword);
        if (runtime) w.setRuntime(runtime);
        return w;
    },
    all() { return ['sword', 'axe', 'staff', 'bow', 'wand']; },
    info(type) {
        const c = this.configs[type] || this.configs.sword;
        return { name: c.name, icon: c.icon, color: c.color, bg: c.color, desc: c.desc };
    }
};

class Skill {
    constructor(weapon) {
        this.weapon = weapon;
        this.name = weapon.skillName;
        this.icon = weapon.skillIcon;
        this.cooldown = weapon.skillCd;
        this.desc = weapon.skillDesc;
        this.lastUsed = -99999;
    }
    canUse(now) { return now - this.lastUsed >= this.cooldown; }
    use(now) { this.lastUsed = now; }
    getProgress(now) { return Math.min(1, (now - this.lastUsed) / this.cooldown); }
}

const SaveData = {
    load() {
        try { const d = localStorage.getItem('shadowHunter_v5'); return d ? JSON.parse(d) : this.default(); }
        catch (e) { return this.default(); }
    },
    save(d) { try { localStorage.setItem('shadowHunter_v5', JSON.stringify(d)); } catch (e) {} },
    clear() { try { localStorage.removeItem('shadowHunter_v5'); } catch (e) {} },
    default() {
        return {
            bestTime: 0, bestLevel: 0, totalKills: 0, totalGold: 0, totalRuns: 0,
            unlockedMinions: [], achievements: [], titles: [],
            unlockedWeapons: ['sword'],
            secondaryWeapon: null,
            weaponSkills: {},
            highestBoss: 0,
            currentRegion: 0,
            regionCleared: [false, false, false, false, false],
            runCount: 0,
            storyFlags: {},
            // === v5 三资源分离 ===
            soulStones: 0,      // 紫色 — 角色加点
            darkIron: 0,        // 橙色 — 武器升级
            bossBlood: 0,       // 金色 — 武器形态进化
            // === v5 武器系统 ===
            weaponLevels: { sword: 0, axe: 0, bow: 0, staff: 0, wand: 0 },  // 1-10级，玄铁升级
            weaponForms: { sword: 0, axe: 0, bow: 0, staff: 0, wand: 0 },   // 形态阶段 0-4
            weaponMats: { shadowStone: 0, bloodCrystal: 0 },                 // 进化道具
            // === v5 难度锁 ===
            unlockedDifficulties: ['easy'],   // 默认只开简单
            difficultyCleared: { easy: false, normal: false, hard: false, hell: false },
            shadowGodDefeated: false,
            // === v5 角色加点 10分支 ===
            upgrades: {
                bloodlust: 0, berserk: 0,     // 输出
                ironwall: 0, immortal: 0,     // 生存
                shadowstep: 0, gale: 0,       // 机动
                greed: 0, sage: 0,            // 资源
                element: 0, summon: 0         // 特性
            },
            unlockedUpgrades: ['bloodlust', 'ironwall', 'shadowstep', 'greed'],  // 默认4分支
            // === v5 章节进度 ===
            chapterProgress: 1,  // 当前章节 1-5
            chapterCleared: [false, false, false, false, false],
            // === v5 统计 ===
            totalMoveDistance: 0,
            totalShopPurchases: 0,
            bossesDefeated: []   // 击败过的BOSS类型
        };
    }
};

// ==================== 粒子系统 ====================
class ParticleSystem {
    constructor(scene) { this.scene = scene; }
    hit(x, y, color = 0xff4444, count = 12, speed = 4) {
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + Math.random() * 0.6;
            const spd = speed + Math.random() * speed * 1.5;
            const size = 2 + Math.random() * 5;
            const p = this.scene.add.circle(x, y, size, color);
            p.setDepth(200);
            this.scene.tweens.add({
                targets: p, x: x + Math.cos(angle) * spd * 20, y: y + Math.sin(angle) * spd * 20,
                alpha: { from: 1, to: 0 }, scale: { from: 1, to: 0.2 },
                duration: 250 + Math.random() * 200, ease: 'Cubic.easeOut',
                onComplete: () => p.destroy()
            });
        }
    }
    slash(x, y, angle, color = 0xff4466, range = 100, arc = Math.PI / 2) {
        const g = this.scene.add.graphics(); g.setDepth(150);
        g.lineStyle(5, color, 0.95); g.beginPath();
        g.arc(x, y, range * 0.75, angle - arc / 2, angle + arc / 2, false);
        g.strokePath();
        const g2 = this.scene.add.graphics(); g2.setDepth(149);
        g2.fillStyle(color, 0.25); g2.beginPath();
        g2.moveTo(x, y);
        g2.arc(x, y, range * 0.85, angle - arc / 2, angle + arc / 2, false);
        g2.closePath(); g2.fillPath();
        this.scene.tweens.add({
            targets: [g, g2], alpha: 0, scale: { from: 0.7, to: 1.3 },
            duration: 200, ease: 'Cubic.easeOut', onComplete: () => { g.destroy(); g2.destroy(); }
        });
    }
    lineBeam(x1, y1, x2, y2, color = 0x00ffff, width = 10) {
        const g = this.scene.add.graphics(); g.setDepth(150);
        g.lineStyle(width, color, 0.9); g.beginPath();
        g.moveTo(x1, y1); g.lineTo(x2, y2); g.strokePath();
        this.scene.tweens.add({
            targets: g, alpha: 0, scale: { from: 1, to: 0.4 },
            duration: 250, ease: 'Cubic.easeOut', onComplete: () => g.destroy()
        });
    }
    explosion(x, y, radius = 100, color = 0xffaa00) {
        const g = this.scene.add.graphics(); g.setDepth(150);
        g.fillStyle(color, 0.5); g.fillCircle(x, y, 15);
        this.scene.tweens.add({
            targets: g, scale: { from: 0.3, to: radius / 15 },
            alpha: { from: 0.7, to: 0 }, duration: 500, ease: 'Cubic.easeOut',
            onComplete: () => g.destroy()
        });
        for (let i = 0; i < 14; i++) {
            const angle = (i / 14) * Math.PI * 2 + Math.random() * 0.3;
            const p = this.scene.add.circle(x, y, 4 + Math.random() * 3, color);
            p.setDepth(155);
            this.scene.tweens.add({
                targets: p, x: x + Math.cos(angle) * radius * 0.9,
                y: y + Math.sin(angle) * radius * 0.9,
                alpha: 0, scale: { from: 1, to: 0.2 },
                duration: 500 + Math.random() * 200, ease: 'Cubic.easeOut',
                onComplete: () => p.destroy()
            });
        }
    }
    shockRing(x, y, color = 0xffff66) {
        const ring = this.scene.add.circle(x, y, 8, color, 0.6).setStrokeStyle(2, color);
        ring.setDepth(145);
        this.scene.tweens.add({
            targets: ring, scale: 6, alpha: 0, duration: 280, ease: 'Cubic.easeOut',
            onComplete: () => ring.destroy()
        });
    }
    levelUp() {
        const cx = GW / 2, cy = GH / 2;
        for (let i = 0; i < 30; i++) {
            const angle = (i / 30) * Math.PI * 2;
            const p = this.scene.add.star(cx, cy, 5, 10, 20, 0xffd700);
            p.setDepth(300);
            this.scene.tweens.add({
                targets: p, x: cx + Math.cos(angle) * 300, y: cy + Math.sin(angle) * 250,
                alpha: { from: 0, to: 1, to: 0 }, scale: { from: 0, to: 1.8, to: 0.5 },
                duration: 1500, ease: 'Cubic.easeOut', onComplete: () => p.destroy()
            });
        }
    }
    healEffect(x, y) {
        for (let i = 0; i < 6; i++) {
            const p = this.scene.add.text(x + (Math.random() - 0.5) * 40,
                y + (Math.random() - 0.5) * 20, '❤', { fontSize: '18px', color: '#ff4466' }).setOrigin(0.5);
            p.setDepth(200);
            this.scene.tweens.add({
                targets: p, y: y - 50 - Math.random() * 40,
                alpha: 0, scale: { from: 0.6, to: 1.4 },
                duration: 800, ease: 'Cubic.easeOut', onComplete: () => p.destroy()
            });
        }
    }
    goldEffect(x, y, amount = 1) {
        const tx = GW - 80, ty = 35;
        for (let i = 0; i < Math.min(amount, 8); i++) {
            setTimeout(() => {
                const p = this.scene.add.circle(x + (Math.random() - 0.5) * 25,
                    y + (Math.random() - 0.5) * 25, 5, 0xffd700);
                p.setDepth(200);
                this.scene.tweens.add({
                    targets: p, x: tx + (Math.random() - 0.5) * 50,
                    y: ty + (Math.random() - 0.5) * 25,
                    alpha: 0, scale: { from: 1, to: 0.3 },
                    duration: 700, ease: 'Cubic.easeIn', onComplete: () => p.destroy()
                });
            }, i * 40);
        }
    }
    expEffect(x, y, amount = 1) {
        const tx = 70, ty = 55;
        for (let i = 0; i < Math.min(amount, 6); i++) {
            setTimeout(() => {
                const p = this.scene.add.star(x + (Math.random() - 0.5) * 25,
                    y + (Math.random() - 0.5) * 25, 4, 4, 8, 0xffdd00);
                p.setDepth(200);
                this.scene.tweens.add({
                    targets: p, x: tx + (Math.random() - 0.5) * 35,
                    y: ty + (Math.random() - 0.5) * 20,
                    alpha: 0, scale: { from: 1, to: 0.3 },
                    angle: Math.random() * Math.PI * 2,
                    duration: 600, ease: 'Cubic.easeIn', onComplete: () => p.destroy()
                });
            }, i * 35);
        }
    }
    bossDefeat(x, y) {
        const colors = [0xffd700, 0xff6600, 0xff0000, 0x00ffff, 0xff00ff, 0x00ff00, 0xffffff];
        for (let i = 0; i < 50; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 80 + Math.random() * 150;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const p = this.scene.add.circle(x, y, 5 + Math.random() * 8, color);
            p.setDepth(300);
            this.scene.tweens.add({
                targets: p, x: x + Math.cos(angle) * speed,
                y: y + Math.sin(angle) * speed,
                alpha: 0, scale: { from: 1, to: 0.1 },
                duration: 1000 + Math.random() * 500, ease: 'Cubic.easeOut',
                onComplete: () => p.destroy()
            });
        }
        const flash = this.scene.add.rectangle(GW / 2, GH / 2, GW, GH, 0xffffff, 1);
        flash.setDepth(400);
        this.scene.tweens.add({
            targets: flash, alpha: { from: 1, to: 0 },
            duration: 600, ease: 'Cubic.easeOut', onComplete: () => flash.destroy()
        });
    }
    spawnEffect(x, y, color = 0xff0000) {
        const ring = this.scene.add.graphics(); ring.setDepth(100);
        ring.lineStyle(4, color, 0.7); ring.strokeCircle(x, y, 50);
        this.scene.tweens.add({
            targets: ring, scale: { from: 1.6, to: 0.4 },
            alpha: { from: 0.9, to: 0 }, duration: 500, ease: 'Cubic.easeOut',
            onComplete: () => ring.destroy()
        });
    }
    critEffect(x, y) {
        const p = this.scene.add.text(x, y, '💥', { fontSize: '28px' }).setOrigin(0.5);
        p.setDepth(260);
        this.scene.tweens.add({
            targets: p, scale: { from: 0.5, to: 1.5, to: 0.8 },
            alpha: 0, y: y - 30, duration: 400, ease: 'Cubic.easeOut',
            onComplete: () => p.destroy()
        });
    }
    trail(x, y, color = 0x4488ff) {
        const p = this.scene.add.circle(x, y, 8, color, 0.4);
        p.setDepth(90);
        this.scene.tweens.add({
            targets: p, alpha: 0, scale: 0.3, duration: 200,
            ease: 'Cubic.easeOut', onComplete: () => p.destroy()
        });
    }
    freezeEffect(x, y) {
        const p = this.scene.add.text(x, y, '❄', { fontSize: '18px' }).setOrigin(0.5);
        p.setDepth(200);
        this.scene.tweens.add({
            targets: p, y: y - 20, alpha: 0, scale: 1.5, duration: 500,
            ease: 'Cubic.easeOut', onComplete: () => p.destroy()
        });
    }
    burnEffect(x, y) {
        const p = this.scene.add.text(x, y, '🔥', { fontSize: '16px' }).setOrigin(0.5);
        p.setDepth(200);
        this.scene.tweens.add({
            targets: p, y: y - 25, alpha: 0, scale: 1.3, duration: 600,
            ease: 'Cubic.easeOut', onComplete: () => p.destroy()
        });
    }
    chapterBanner(chapter) {
        const bg = this.scene.add.rectangle(GW / 2, GH / 2, 0, 0, chapter.bgColor, 0.92)
            .setOrigin(0.5).setDepth(500);
        this.scene.tweens.add({
            targets: bg, width: GW, height: 200, duration: 600, ease: 'Cubic.easeOut',
            onComplete: () => {
                const label = this.scene.add.text(GW / 2, GH / 2 - 70, `第${chapter.id + 1}章`, {
                    fontSize: '22px', fontFamily: 'Courier New',
                    color: '#ffffff', stroke: '#000', strokeThickness: 3
                }).setOrigin(0.5).setDepth(502);
                const title = this.scene.add.text(GW / 2, GH / 2 - 35, chapter.name, {
                    fontSize: '36px', fontFamily: 'Courier New',
                    color: '#ffffff', stroke: '#000', strokeThickness: 5, fontWeight: 'bold'
                }).setOrigin(0.5).setDepth(502);
                const sub = this.scene.add.text(GW / 2, GH / 2 + 5, chapter.subtitle, {
                    fontSize: '16px', fontFamily: 'Courier New',
                    color: '#cccccc', stroke: '#000', strokeThickness: 2,
                    align: 'center', wordWrap: { width: 800 }
                }).setOrigin(0.5).setDepth(502);
                const story = this.scene.add.text(GW / 2, GH / 2 + 50, chapter.story, {
                    fontSize: '14px', fontFamily: 'Courier New',
                    color: '#aaaaaa', stroke: '#000', strokeThickness: 2,
                    align: 'center', wordWrap: { width: 700 }
                }).setOrigin(0.5).setDepth(502);
                this.scene.tweens.add({
                    targets: [label, title, sub, story], alpha: { from: 0, to: 1 },
                    duration: 800, hold: 3500, yoyo: true,
                    onComplete: () => {
                        bg.destroy(); label.destroy(); title.destroy(); sub.destroy(); story.destroy();
                    }
                });
            }
        });
    }
    waveBanner(waveNum, isElite, isBoss) {
        const color = isBoss ? 0xff0044 : (isElite ? 0xffaa00 : 0x44aaff);
        const text = isBoss ? `⚠ BOSS波 - 第${waveNum}波 ⚠` :
                     isElite ? `🔥 精英波 - 第${waveNum}波 🔥` : `第 ${waveNum} 波`;
        const bg = this.scene.add.rectangle(GW / 2, GH / 2, 0, 0, color, 0.7)
            .setOrigin(0.5).setDepth(400);
        const label = this.scene.add.text(GW / 2, GH / 2, text, {
            fontSize: '44px', fontFamily: 'Courier New',
            color: '#ffffff', stroke: '#000', strokeThickness: 6, fontWeight: 'bold'
        }).setOrigin(0.5).setScale(0.2).setDepth(401);
        this.scene.tweens.add({
            targets: bg, width: 600, height: 80, duration: 400, ease: 'Back.easeOut'
        });
        this.scene.tweens.add({
            targets: label, scale: { from: 0.2, to: 1.4, to: 1 },
            duration: 500, ease: 'Back.easeOut', hold: 1500, yoyo: true,
            onComplete: () => { bg.destroy(); label.destroy(); }
        });
    }
}

// ==================== 音效系统 ====================
class AudioSystem {
    constructor(scene) {
        this.scene = scene; this.ctx = null; this.volume = 0.3;
        try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {}
    }
    tone(freq, duration, type = 'sine', vol = 1) {
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = type; osc.frequency.value = freq;
            gain.gain.setValueAtTime(this.volume * vol * 0.3, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
            osc.connect(gain); gain.connect(this.ctx.destination);
            osc.start(); osc.stop(this.ctx.currentTime + duration);
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
            osc.connect(gain); gain.connect(this.ctx.destination);
            osc.start(); osc.stop(this.ctx.currentTime + duration);
        } catch (e) {}
    }
    play(type) {
        switch (type) {
            case 'sword': this.sweep(600, 300, 0.08, 'sawtooth', 0.8); break;
            case 'axe': this.sweep(300, 150, 0.15, 'sawtooth', 0.9); break;
            case 'staff': this.tone(880, 0.12, 'sine', 0.7); this.tone(660, 0.12, 'sine', 0.5); break;
            case 'bow': this.sweep(800, 400, 0.07, 'triangle', 0.6); break;
            case 'wand': this.tone(1200, 0.06, 'sine', 0.5); this.tone(900, 0.09, 'sine', 0.4); break;
            case 'hit': this.tone(150, 0.06, 'square', 0.7); break;
            case 'crit': this.sweep(300, 800, 0.1, 'sawtooth', 0.8); this.tone(1200, 0.18, 'sine', 0.6); break;
            case 'levelup':
                this.tone(523, 0.1, 'sine', 0.8);
                setTimeout(() => this.tone(659, 0.1, 'sine', 0.8), 100);
                setTimeout(() => this.tone(784, 0.15, 'sine', 0.9), 200);
                setTimeout(() => this.tone(1047, 0.2, 'sine', 1), 300);
                break;
            case 'pickup': this.sweep(600, 900, 0.08, 'sine', 0.6); break;
            case 'hurt': this.sweep(300, 100, 0.18, 'sawtooth', 0.7); break;
            case 'skill': this.sweep(200, 600, 0.2, 'sawtooth', 0.8); this.tone(400, 0.25, 'sine', 0.6); break;
            case 'boss': this.sweep(150, 80, 0.6, 'sawtooth', 1); this.tone(60, 0.8, 'square', 0.8); break;
            case 'bossWarning':
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        this.tone(200, 0.2, 'sawtooth', 0.8);
                        this.tone(100, 0.3, 'square', 0.6);
                    }, i * 300);
                }
                break;
            case 'die': this.sweep(400, 100, 0.3, 'sawtooth', 0.8); break;
            case 'chapter':
                this.tone(440, 0.2, 'sine', 0.7);
                setTimeout(() => this.tone(550, 0.2, 'sine', 0.7), 200);
                setTimeout(() => this.tone(660, 0.3, 'sine', 0.8), 400);
                break;
            case 'merchant': this.tone(600, 0.1, 'triangle', 0.6);
                setTimeout(() => this.tone(800, 0.15, 'triangle', 0.7), 100);
                break;
        }
    }
}

// ==================== 投射物系统 ====================
class Projectile {
    constructor(scene, x, y, targetX, targetY, damage, type, options = {}) {
        this.scene = scene; this.worldX = x; this.worldY = y;
        this.damage = damage; this.type = type; this.alive = true;
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
        this.freeze = options.freeze || false;
        this.burn = options.burn || false;
        this.elementEffect = options.elementEffect || {};
        this.life = 0;
        const angle = Math.atan2(targetY - y, targetX - x);
        this.vx = Math.cos(angle) * this.speed;
        this.vy = Math.sin(angle) * this.speed;
        this.createSprite();
    }
    createSprite() {
        const sx = this.screenX(), sy = this.screenY();
        this.container = this.scene.add.container(sx, sy);
        this.container.setDepth(120);
        const c1 = this.scene.add.circle(0, 0, this.size, this.color);
        const c2 = this.scene.add.circle(0, 0, this.size * 1.8, this.glowColor, 0.3);
        const c3 = this.scene.add.circle(0, 0, this.size * 1.3, 0xffffff, 0.5);
        this.container.add([c2, c1, c3]);
        if (this.type === 'arrow' || this.type === 'bone' || this.type === 'enemyArrow') {
            this.container.rotation = Math.atan2(this.vy, this.vx) + Math.PI / 2;
        }
    }
    screenX() { return this.worldX - this.scene.playerWorldX + GW / 2; }
    screenY() { return this.worldY - this.scene.playerWorldY + GH / 2; }
    update(delta, time) {
        if (!this.alive) return;
        const dt = delta / 1000;
        this.life += delta;
        if (this.tracking && !this.trackingTarget) this.findTarget();
        if (this.tracking && this.trackingTarget && this.trackingTarget.alive) {
            const dx = this.trackingTarget.worldX - this.worldX;
            const dy = this.trackingTarget.worldY - this.worldY;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d > 0) {
                const tvx = (dx / d) * this.speed, tvy = (dy / d) * this.speed;
                this.vx += (tvx - this.vx) * 0.12; this.vy += (tvy - this.vy) * 0.12;
                const sp = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (sp > 0) { this.vx = (this.vx / sp) * this.speed; this.vy = (this.vy / sp) * this.speed; }
            }
        }
        this.worldX += this.vx * dt; this.worldY += this.vy * dt;
        const sx = this.screenX(), sy = this.screenY();
        this.container.x = sx; this.container.y = sy;
        if (this.type !== 'arrow' && this.type !== 'bone' && this.type !== 'enemyArrow') {
            this.container.rotation += dt * 12;
        }
        this.trailTimer += delta;
        if (this.trailTimer > 30) {
            this.trailTimer = 0;
            this.scene.particles.trail(sx, sy, this.color);
        }
        if (this.life > 6000) { this.destroy(); return; }
        if (sx < -100 || sx > GW + 100 || sy < -100 || sy > GH + 100) { this.destroy(); return; }
        this.checkHit();
    }
    findTarget() {
        let nearest = null, nd = Infinity;
        for (const e of this.scene.enemyManager.enemies) {
            if (!e.alive) continue;
            const d = Phaser.Math.Distance.Between(this.worldX, this.worldY, e.worldX, e.worldY);
            if (d < nd && d < 400) { nd = d; nearest = e; }
        }
        this.trackingTarget = nearest;
    }
    checkHit() {
        if (this.type === 'enemyArrow' || this.type === 'bone' || this.type === 'meteor') {
            const px = this.scene.playerWorldX, py = this.scene.playerWorldY;
            const d = Phaser.Math.Distance.Between(this.worldX, this.worldY, px, py);
            if (d < (this.type === 'meteor' ? 35 : 25)) {
                this.scene.playerTakeDamage(this.damage); this.destroy();
            }
            return;
        }
        for (const e of this.scene.enemyManager.enemies) {
            if (!e.alive || this.hitEnemies.has(e.id)) continue;
            const d = Phaser.Math.Distance.Between(this.worldX, this.worldY, e.worldX, e.worldY);
            if (d < e.hitRadius + this.size) {
                this.hitEnemy(e);
                if (this.pierce <= 0 && this.bounceCount <= 0) { this.destroy(); return; }
                if (this.bounceCount > 0) { this.bounceCount--; this.findNewTarget(e); }
                this.pierce--;
            }
        }
        if (this.scene.bossManager.boss && this.scene.bossManager.boss.alive) {
            const b = this.scene.bossManager.boss;
            const d = Phaser.Math.Distance.Between(this.worldX, this.worldY, b.worldX, b.worldY);
            if (d < b.hitRadius + this.size && !this.hitEnemies.has('boss')) {
                this.hitBoss(b); this.hitEnemies.add('boss');
                if (this.pierce <= 0 && this.bounceCount <= 0) this.destroy();
            }
        }
        // 命中幻影/分裂体
        this.scene.bossManager.alivePhantoms.forEach(b => {
            if (this.hitEnemies.has(b)) return;
            const d = Phaser.Math.Distance.Between(this.worldX, this.worldY, b.worldX, b.worldY);
            if (d < b.hitRadius + this.size) {
                this.hitBoss(b); this.hitEnemies.add(b);
                if (this.pierce <= 0 && this.bounceCount <= 0) this.destroy();
            }
        });
    }
    hitEnemy(enemy) {
        this.hitEnemies.add(enemy.id);
        const wlvl = this.scene.weaponLevels[this.scene.runtime.weaponType] || 1;
        const crit = Math.random() < this.scene.runtime.weapon.getCritChance(this.scene.runtime.spec, wlvl);
        let dmg = crit ? Math.floor(this.damage * this.scene.runtime.weapon.getCritDamage(this.scene.runtime.spec, wlvl)) : this.damage;
        dmg = Math.floor(dmg * this.scene.runtime.comboMultiplier);
        const armorPierce = (this.elementEffect && this.elementEffect.armorPierce) || 0;
        const died = enemy.takeDamage(dmg, crit, armorPierce);
        this.scene.particles.hit(this.screenX(), this.screenY(), this.color, 6, 3);
        if (this.freeze) { enemy.applyFreeze(1500); this.scene.particles.freezeEffect(this.screenX(), this.screenY()); }
        if (this.burn) enemy.applyBurn(Math.floor(dmg * 0.2), 3000);
        this.applyElementEffect(enemy, dmg);
        if (died) this.scene.addWeaponExp(this.scene.runtime.weaponType, 1);
    }
    hitBoss(boss) {
        const wlvl = this.scene.weaponLevels[this.scene.runtime.weaponType] || 1;
        const crit = Math.random() < this.scene.runtime.weapon.getCritChance(this.scene.runtime.spec, wlvl);
        let dmg = crit ? Math.floor(this.damage * this.scene.runtime.weapon.getCritDamage(this.scene.runtime.spec, wlvl)) : this.damage;
        dmg = Math.floor(dmg * this.scene.runtime.comboMultiplier);
        if (this.scene.bossDamageBuff) dmg = Math.floor(dmg * 1.5);
        const armorPierce = (this.elementEffect && this.elementEffect.armorPierce) || 0;
        boss.takeDamage(dmg, crit, armorPierce);
        this.applyElementEffect(boss, dmg);
    }
    applyElementEffect(target, baseDamage) {
        if (!target || !target.alive) return;
        const effect = this.elementEffect;
        if (effect.bloodLoss && target.applyBleed) {
            target.applyBleed(Math.floor(baseDamage * effect.bloodLoss.dps), effect.bloodLoss.duration);
        }
        if (effect.burn && target.applyBurn) {
            target.applyBurn(Math.floor(effect.burn.dps), effect.burn.duration);
        }
        if (effect.slow && target.applySlow) {
            target.applySlow(effect.slow.duration, effect.slow.amount);
        }
        if (effect.freeze && target.applyFreeze && Math.random() < effect.freeze.chance) {
            target.applyFreeze(effect.freeze.duration);
        }
        if (effect.stun && target.applyStun && Math.random() < effect.stun.chance) {
            target.applyStun(effect.stun.duration);
        }
        if (effect.shadow && target.takeDamage) {
            target.takeDamage(Math.floor(baseDamage * effect.shadow.damagePct), false);
        }
    }
    findNewTarget(from) {
        let nearest = null, nd = Infinity;
        for (const e of this.scene.enemyManager.enemies) {
            if (!e.alive || e === from || this.hitEnemies.has(e.id)) continue;
            const d = Phaser.Math.Distance.Between(this.worldX, this.worldY, e.worldX, e.worldY);
            if (d < nd && d < 350) { nd = d; nearest = e; }
        }
        if (nearest) {
            const dx = nearest.worldX - this.worldX, dy = nearest.worldY - this.worldY;
            const d = Math.sqrt(dx * dx + dy * dy);
            this.vx = (dx / d) * this.speed; this.vy = (dy / d) * this.speed;
        }
    }
    destroy() {
        this.alive = false;
        if (this.container) { this.container.destroy(); this.container = null; }
    }
}

// ==================== 敌人系统 ====================
let enemyIdCounter = 0;
class Enemy {
    constructor(scene, type) {
        this.scene = scene; this.type = type; this.id = ++enemyIdCounter;
        this.alive = false; this.worldX = 0; this.worldY = 0;
        this.hp = 0; this.maxHp = 0; this.damage = 0;
        this.speed = 0; this.currentSpeed = 0; this.accelRate = 0.02;
        this.hitRadius = 20; this.container = null;
        this.pattern = 'direct'; this.attackCooldown = 0; this.lastSpecial = 0;
        this.stunned = 0; this.slowed = 0; this.burning = 0; this.frozen = 0;
        this.burnDamage = 0; this.walkFrame = 0; this.walkTimer = 0;
        this.isElite = false; this.isRainbow = false; this.rainbowTimer = 0;
        this.accelRate = 0.15; // 加快加速度，让小怪快速冲向玩家
    }
    get config() {
        return {
            slime: { hp: 28, dmg: 4, spd: 40, radius: 20, pattern: 'direct', color: COLORS.enemy.slime, darkColor: COLORS.enemy.slimeDark, exp: 3, gold: 0, size: 48 },
            bat: { hp: 18, dmg: 3, spd: 75, radius: 18, pattern: 'zigzag', color: COLORS.enemy.bat, darkColor: COLORS.enemy.batDark, exp: 3, gold: 0, size: 42, diveAttack: true },
            skeleton: { hp: 40, dmg: 6, spd: 48, radius: 22, pattern: 'direct', color: COLORS.enemy.skeleton, darkColor: COLORS.enemy.skeletonDark, exp: 5, gold: 0, size: 52, throwBone: true },
            ghost: { hp: 32, dmg: 5, spd: 55, radius: 24, pattern: 'teleport', color: COLORS.enemy.ghost, darkColor: COLORS.enemy.ghostDark, exp: 7, gold: 0, size: 48 },
            gargoyle: { hp: 100, dmg: 12, spd: 35, radius: 30, pattern: 'slow', color: COLORS.enemy.gargoyle, darkColor: COLORS.enemy.gargoyleDark, exp: 14, gold: 5, size: 64, armor: true },
            archer: { hp: 26, dmg: 8, spd: 45, radius: 20, pattern: 'keepDistance', color: COLORS.enemy.archer, darkColor: COLORS.enemy.archerDark, exp: 8, gold: 0, size: 46, shootArrow: true },
            demon: { hp: 55, dmg: 11, spd: 55, radius: 26, pattern: 'direct', color: COLORS.enemy.demon, darkColor: COLORS.enemy.demonDark, exp: 11, gold: 0, size: 56, chargeAttack: true },
            // v5：远程小怪 mage（暗影法师，弹幕攻击）
            mage: { hp: 22, dmg: 9, spd: 38, radius: 18, pattern: 'keepDistance', color: 0x9966ff, darkColor: 0x5533aa, exp: 10, gold: 0, size: 44, shootMagic: true },
            chest: { hp: 60, dmg: 24, spd: 60, radius: 24, pattern: 'direct', color: 0x8B4513, darkColor: 0x654321, exp: 20, gold: 15, size: 44 },
            rainbow: { hp: 50, dmg: 6, spd: 70, radius: 20, pattern: 'zigzag', color: 0xff00ff, darkColor: 0x00ffff, exp: 15, gold: 8, size: 42 }
        }[this.type] || { hp: 28, dmg: 4, spd: 40, radius: 18, pattern: 'direct', color: 0xff0000, exp: 4, gold: 2, size: 32 };
    }
    spawn(x, y, difficulty = 1) {
        const cfg = this.config;
        this.worldX = x; this.worldY = y;
        this.hp = Math.floor(cfg.hp * difficulty);
        this.maxHp = this.hp;
        this.damage = Math.floor(cfg.dmg * difficulty);
        this.speed = cfg.spd; this.currentSpeed = 0;
        this.hitRadius = cfg.radius; this.pattern = cfg.pattern;
        this.alive = true;
        this.stunned = 0; this.slowed = 0; this.burning = 0; this.frozen = 0;
        this.lastSpecial = 0; this.attackCooldown = 0;
        this.walkFrame = 0; this.walkTimer = 0;
        this.isElite = false; this.isRainbow = this.type === 'rainbow';
        this.createSprite();
        this.scene.particles.spawnEffect(this.screenX(), this.screenY(), cfg.color);
        return this;
    }
    setElite(tier = 1) {
        this.isElite = true;
        this.eliteTier = tier;
        const cfg = this.config;
        // v5：三档精英递进，后期加强（HP×15 + 护甲 + 狂暴）
        const hpMul = tier === 1 ? 3.5 : (tier === 2 ? 7 : 15);   // tier3 10→15
        const dmgMul = tier === 1 ? 2 : (tier === 2 ? 3 : 4.5);
        const scale = tier === 1 ? 1.45 : (tier === 2 ? 1.7 : 2.0);
        const glowColor = tier === 1 ? 0xffaa00 : (tier === 2 ? 0xff3322 : 0xaa00ff);
        this.hp = Math.floor(this.hp * hpMul);
        this.maxHp = this.hp;
        this.damage = Math.floor(this.damage * dmgMul);
        this.hitRadius = cfg.radius * 1.3;
        this.speed = cfg.spd * (tier === 1 ? 1.15 : (tier === 2 ? 1.25 : 1.35));
        // v5：精英护甲（固定减伤），防止后期一刀秒
        this.armor = tier === 1 ? 5 : (tier === 2 ? 15 : 30);
        this.enraged = false;  // v5：狂暴标记
        if (this.container) {
            this.container.setScale(scale);
            const eliteGlow = this.scene.add.circle(0, 0, cfg.size * 0.9, glowColor, 0.25);
            eliteGlow.setDepth(-1);
            this.container.add(eliteGlow);
            this.scene.tweens.add({
                targets: eliteGlow,
                scale: { from: 0.8, to: 1.2 },
                alpha: { from: 0.15, to: 0.35 },
                yoyo: true, repeat: -1,
                duration: 800
            });
            // 更强精英额外加皇冠标记
            if (tier >= 2) {
                const crownColor = tier === 2 ? '#ff5555' : '#cc55ff';
                const crown = this.scene.add.text(0, -cfg.size * 0.7, tier === 2 ? '▲▲' : '★★★', {
                    fontSize: tier === 2 ? '12px' : '14px', fill: crownColor, fontWeight: 'bold'
                }).setOrigin(0.5).setDepth(1);
                this.container.add(crown);
            }
            // v5：tier3 精英加护甲标识
            if (tier >= 3) {
                const armorIcon = this.scene.add.text(0, cfg.size * 0.5, '🛡', {
                    fontSize: '10px', fill: '#88ccff'
                }).setOrigin(0.5).setDepth(1);
                this.container.add(armorIcon);
            }
        }
    }
    // v5：精英狂暴（血量<30%时触发）
    checkEnrage() {
        if (!this.isElite || this.enraged) return;
        if (this.hp < this.maxHp * 0.3) {
            this.enraged = true;
            this.speed *= 1.3;
            this.damage = Math.floor(this.damage * 1.5);
            if (this.container) {
                this.scene.cameras.main.flash(150, 255, 50, 50);
                const rageText = this.scene.add.text(this.screenX(), this.screenY() - 40, '狂暴！', {
                    fontSize: '16px', fill: '#ff3322', stroke: '#000', strokeThickness: 3, fontWeight: 'bold'
                }).setOrigin(0.5).setDepth(200);
                this.scene.tweens.add({
                    targets: rageText, y: rageText.y - 20, alpha: 0, duration: 1200,
                    onComplete: () => rageText.destroy()
                });
            }
        }
    }
    createSprite() {
        const cfg = this.config;
        const size = cfg.size;
        this.container = this.scene.add.container(this.screenX(), this.screenY());
        this.container.setDepth(50);

        // 有精灵表的类型用真实精灵动画；chest/rainbow 保留几何绘制
        const spriteTypes = ['slime', 'bat', 'skeleton', 'ghost', 'gargoyle', 'demon', 'archer', 'mage'];
        const hasSprite = spriteTypes.includes(this.type) && this.scene.textures.exists(`${this.type}_idle`);

        if (hasSprite) {
            // 地面阴影
            const shadow = this.scene.add.ellipse(0, size * 0.35, size * 0.7, size * 0.18, 0x000000, 0.35);
            // 精灵本体（64x64 或 32x32 帧，缩放到 cfg.size）
            const sprite = this.scene.add.sprite(0, 0, `${this.type}_idle`);
            const frameSize = (this.type === 'archer') ? 32 : 64;
            sprite.setScale(size / frameSize);
            sprite.play(`${this.type}_idle`);
            this.container.add([shadow, sprite]);
            this.sprite = sprite;
            this.shadow = shadow;
            // ghost 加蓝白 tint 营造幽灵感
            if (this.type === 'ghost') sprite.setTint(0xccddff);
        } else {
            // 几何 fallback（chest / rainbow / 精灵缺失时）
            const body = this.scene.add.ellipse(0, size * 0.1, size * 0.75, size * 0.55, cfg.color);
            const eye1 = this.scene.add.circle(-size * 0.15, -size * 0.05, size * 0.1, 0x000000);
            const eye2 = this.scene.add.circle(size * 0.15, -size * 0.05, size * 0.1, 0x000000);
            this.container.add([body, eye1, eye2]);
            if (this.type === 'bat') {
                const w1 = this.scene.add.ellipse(-size * 0.35, 0, size * 0.5, size * 0.22, cfg.darkColor);
                const w2 = this.scene.add.ellipse(size * 0.35, 0, size * 0.5, size * 0.22, cfg.darkColor);
                w1.rotation = -0.4; w2.rotation = 0.4;
                this.container.add([w1, w2]);
                this.wing1 = w1; this.wing2 = w2;
            }
            if (this.type === 'chest') {
                const lid = this.scene.add.rectangle(0, -size * 0.3, size * 0.9, size * 0.15, cfg.darkColor);
                const lock = this.scene.add.rectangle(0, 0, size * 0.15, size * 0.15, 0xffd700);
                const eye1c = this.scene.add.circle(-size * 0.15, -size * 0.05, size * 0.08, 0xff0000);
                const eye2c = this.scene.add.circle(size * 0.15, -size * 0.05, size * 0.08, 0xff0000);
                this.container.add([lid, lock, eye1c, eye2c]);
            }
            if (this.type === 'rainbow') {
                this.rainbowColors = [0xff0000, 0xff8800, 0xffff00, 0x00ff00, 0x00ffff, 0x0088ff, 0xff00ff];
                this.rainbowIdx = 0;
            }
        }

        if (this.type !== 'chest') {
            this.hpBarBg = this.scene.add.rectangle(0, -size * 0.65, size * 0.9, 6, 0x220000);
            this.hpBar = this.scene.add.rectangle(-size * 0.45, -size * 0.65, size * 0.9, 6, 0xff3344);
            this.hpBar.setOrigin(0, 0.5);
            this.container.add(this.hpBarBg); this.container.add(this.hpBar);
        }
        if (this.isElite) {
            const ring = this.scene.add.circle(0, 0, cfg.size * 0.7, 0xffaa00, 0.2);
            ring.setStrokeStyle(2, 0xffaa00);
            this.container.add(ring);
            const star = this.scene.add.text(0, -cfg.size * 0.95, '★', {
                fontSize: '20px', color: '#ffd700', stroke: '#000', strokeThickness: 3
            }).setOrigin(0.5);
            this.container.add(star);
        }
    }
    screenX() { return this.worldX - this.scene.playerWorldX + GW / 2; }
    screenY() { return this.worldY - this.scene.playerWorldY + GH / 2; }
    update(delta, time) {
        if (!this.alive) return;
        const dt = delta / 1000;
        // 元素状态条（头顶）
        if (this.bleeding > 0 || this.burning > 0 || this.frozen > 0 || this.slowed > 0) {
            if (!this.statusBar) {
                this.statusBar = this.scene.add.container(this.screenX(), this.screenY() - this.config.size - 12);
                this.statusBar.setDepth(55);
            }
            this.statusBar.x = this.screenX();
            this.statusBar.y = this.screenY() - this.config.size - 12;
            // 清空重建
            this.statusBar.removeAll(true);
            let xOff = 0;
            if (this.bleeding > 0) {
                this.statusBar.add(this.scene.add.circle(xOff, 0, 4, 0xff4444));
                xOff += 10;
            }
            if (this.burning > 0) {
                this.statusBar.add(this.scene.add.circle(xOff, 0, 4, 0xff8844));
                xOff += 10;
            }
            if (this.frozen > 0) {
                this.statusBar.add(this.scene.add.circle(xOff, 0, 4, 0x44aaff));
                xOff += 10;
            }
            if (this.slowed > 0) {
                this.statusBar.add(this.scene.add.circle(xOff, 0, 4, 0xaa44ff));
            }
        } else if (this.statusBar) {
            this.statusBar.destroy();
            this.statusBar = null;
        }
        if (this.isRainbow) {
            this.rainbowTimer += delta;
            if (this.rainbowTimer > 200) {
                this.rainbowTimer = 0;
                this.rainbowIdx = (this.rainbowIdx + 1) % this.rainbowColors.length;
                if (this.container && this.container.list[0])
                    this.container.list[0].fillColor = this.rainbowColors[this.rainbowIdx];
            }
        }
        if (this.knockbackTimer && this.knockbackTimer > 0 && this.knockbackDir) {
            this.knockbackTimer -= delta;
            const kSpeed = 240;
            this.worldX += this.knockbackDir.x * kSpeed * dt;
            this.worldY += this.knockbackDir.y * kSpeed * dt;
            this.worldX = Math.max(-WS / 2, Math.min(WS / 2, this.worldX));
            this.worldY = Math.max(-WS / 2, Math.min(WS / 2, this.worldY));
            this.updateSpritePosition();
        }
        if (this.stunned > 0 || this.frozen > 0) {
            this.stunned = Math.max(0, this.stunned - delta);
            this.frozen = Math.max(0, this.frozen - delta);
            if (this.frozen > 0 && Math.random() < dt * 4) {
                this.scene.particles.hit(
                    this.screenX() + (Math.random() - 0.5) * 20,
                    this.screenY() - 5, 0xaaddff, 1, 0.5);
            }
            if (this.stunned > 0 && Math.random() < dt * 3) {
                this.scene.particles.hit(
                    this.screenX() + (Math.random() - 0.5) * 16,
                    this.screenY() - 18, 0xffdd00, 1, 0.5);
            }
            this.updateSpritePosition();
            return;
        }
        if (this.slowed > 0) {
            this.slowed -= delta;
            if (this.slowed <= 0) this.slowAmount = 0;
            else if (Math.random() < dt * 2) {
                this.scene.particles.hit(
                    this.screenX() + (Math.random() - 0.5) * 18,
                    this.screenY(), 0x4488ff, 1, 0.5);
            }
        }
        if (this.burning > 0) {
            this.burning -= delta;
            if (Math.random() < dt * 2.5) {
                this.hp -= this.burnDamage; this.updateHpBar();
                this.scene.particles.hit(this.screenX(), this.screenY() - 10, 0xff6600, 3, 1);
                if (this.hp <= 0) { this.die(); return; }
            }
        }
        if (this.bleeding > 0) {
            this.bleeding -= delta;
            if (Math.random() < dt * 3) {
                this.hp -= this.bleedDamage; this.updateHpBar();
                this.scene.particles.hit(this.screenX(), this.screenY() - 10, 0xcc0000, 3, 1);
                if (this.hp <= 0) { this.die(); return; }
            }
        }
        if (this.attackCooldown > 0) this.attackCooldown -= delta;
        this.move(dt, time);
        this.specialBehavior(time);
        this.checkPlayerCollision();
        this.updateSpritePosition();
        this.updateWalkAnim(delta);
        if (this.wing1 && this.wing2) {
            const flap = Math.sin(time * 0.025) * 0.4;
            this.wing1.rotation = -0.4 + flap; this.wing2.rotation = 0.4 - flap;
        }
    }
    updateWalkAnim(delta) {
        // 精灵模式：根据移动状态切换 idle/run 动画
        if (this.sprite) {
            const moving = this.currentSpeed > 5;
            const desired = moving ? `${this.type}_run` : `${this.type}_idle`;
            if (this.sprite.anims && this.sprite.anims.currentAnim && this.sprite.anims.currentAnim.key !== desired) {
                // 死亡动画播放中不切换
                if (this.dying) return;
                this.sprite.play(desired);
            }
            return;
        }
        // 几何模式：保留原逻辑（无实际视觉效果，仅占位）
        if (this.currentSpeed < 5) return;
        this.walkTimer += delta;
        if (this.walkTimer > 150) {
            this.walkTimer = 0; this.walkFrame = (this.walkFrame + 1) % 2;
        }
    }
    move(dt, time) {
        const px = this.scene.playerWorldX, py = this.scene.playerWorldY;
        const dx = px - this.worldX, dy = py - this.worldY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 5) { this.currentSpeed *= 0.9; return; }
        let targetSpeed = this.speed;
        if (this.slowed > 0 && this.slowAmount) targetSpeed *= (1 - this.slowAmount);
        this.currentSpeed += (targetSpeed - this.currentSpeed) * this.accelRate;
        this.currentSpeed = Math.max(0, Math.min(targetSpeed, this.currentSpeed));
        let mx = 0, my = 0;
        switch (this.pattern) {
            case 'direct': mx = (dx / dist) * this.currentSpeed; my = (dy / dist) * this.currentSpeed; break;
            case 'zigzag':
                const zig = Math.sin(time * 0.008 + this.id) * 40;
                mx = (dx / dist) * this.currentSpeed; my = ((dy + zig) / dist) * this.currentSpeed; break;
            case 'slow': mx = (dx / dist) * this.currentSpeed * 0.85; my = (dy / dist) * this.currentSpeed * 0.85; break;
            case 'keepDistance':
                if (dist < 180) { mx = -(dx / dist) * this.currentSpeed * 0.7; my = -(dy / dist) * this.currentSpeed * 0.7; }
                else if (dist > 280) { mx = (dx / dist) * this.currentSpeed * 0.8; my = (dy / dist) * this.currentSpeed * 0.8; }
                else {
                    const px2 = -dy / dist, py2 = dx / dist;
                    const st = Math.sin(time * 0.003 + this.id) * this.currentSpeed * 0.5;
                    mx = px2 * st; my = py2 * st;
                }
                break;
            case 'teleport':
                if (dist > 150 && Math.random() < 0.004) {
                    const a = Math.random() * Math.PI * 2;
                    this.worldX = px - Math.cos(a) * 100;
                    this.worldY = py - Math.sin(a) * 100;
                    this.currentSpeed = 0;
                    return;
                }
                mx = (dx / dist) * this.currentSpeed; my = (dy / dist) * this.currentSpeed;
                break;
        }
        this.worldX += mx * dt; this.worldY += my * dt;
        this.worldX = Math.max(-WS / 2, Math.min(WS / 2, this.worldX));
        this.worldY = Math.max(-WS / 2, Math.min(WS / 2, this.worldY));
    }
    specialBehavior(time) {
        const cfg = this.config;
        const dist = Phaser.Math.Distance.Between(this.worldX, this.worldY, this.scene.playerWorldX, this.scene.playerWorldY);
        if (cfg.diveAttack && time - this.lastSpecial > 3500 && dist < 300) { this.lastSpecial = time; this.diveAttack(); }
        if (cfg.throwBone && time - this.lastSpecial > 2500 && dist < 250) { this.lastSpecial = time; this.throwBone(); }
        if (cfg.shootArrow && time - this.lastSpecial > 2000 && dist < 380 && dist > 100) { this.lastSpecial = time; this.shootArrow(); }
        // v5：法师弹幕攻击
        if (cfg.shootMagic && time - this.lastSpecial > 2800 && dist < 420 && dist > 120) { this.lastSpecial = time; this.shootMagic(); }
        if (cfg.chargeAttack && time - this.lastSpecial > 4000 && dist < 200 && dist > 50) { this.lastSpecial = time; this.chargeAttack(); }
    }
    diveAttack() {
        const px = this.scene.playerWorldX, py = this.scene.playerWorldY;
        const dx = px - this.worldX, dy = py - this.worldY;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > 0) { this.worldX += (dx / d) * 90; this.worldY += (dy / d) * 90; }
        this.currentSpeed = this.speed * 1.5;
    }
    throwBone() {
        this.scene.projectiles.push(new Projectile(
            this.scene, this.worldX, this.worldY, this.scene.playerWorldX, this.scene.playerWorldY,
            this.damage * 0.7, 'bone', { speed: 320, color: 0xd4a574 }));
    }
    shootArrow() {
        this.scene.projectiles.push(new Projectile(
            this.scene, this.worldX, this.worldY, this.scene.playerWorldX, this.scene.playerWorldY,
            this.damage * 0.85, 'enemyArrow', { speed: 380 }));
    }
    // v5：法师弹幕攻击（3发扇形）
    shootMagic() {
        const cx = this.scene.playerWorldX, cy = this.scene.playerWorldY;
        const baseAngle = Math.atan2(cy - this.worldY, cx - this.worldX);
        for (let i = -1; i <= 1; i++) {
            const ang = baseAngle + i * 0.3;
            const tx = this.worldX + Math.cos(ang) * 500;
            const ty = this.worldY + Math.sin(ang) * 500;
            this.scene.projectiles.push(new Projectile(
                this.scene, this.worldX, this.worldY, tx, ty,
                this.damage * 0.7, 'enemyMagic', { speed: 280, color: 0xcc66ff }));
        }
    }
    chargeAttack() {
        const px = this.scene.playerWorldX, py = this.scene.playerWorldY;
        const dx = px - this.worldX, dy = py - this.worldY;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > 0) {
            this.chargeVx = (dx / d) * this.speed * 3;
            this.chargeVy = (dy / d) * this.speed * 3;
            this.charging = 300;
        }
    }
    checkPlayerCollision() {
        if (this.attackCooldown > 0) return;
        const px = this.scene.playerWorldX, py = this.scene.playerWorldY;
        const d = Phaser.Math.Distance.Between(this.worldX, this.worldY, px, py);
        if (d < this.hitRadius + 22) {
            this.scene.playerTakeDamage(this.damage);
            this.attackCooldown = 900;
        }
    }
    updateSpritePosition() {
        this.container.x = this.screenX(); this.container.y = this.screenY();
    }
    takeDamage(amount, isCrit = false, armorPierce = 0) {
        if (!this.alive) return false;
        let dmg = amount;
        if (this.config.armor) {
            const reduction = 0.4 * (1 - armorPierce);
            dmg = Math.floor(dmg * (1 - reduction));
        }
        // v5：精英护甲固定减伤
        if (this.isElite && this.armor && this.armor > 0) {
            const armorReduction = Math.max(0, this.armor * (1 - armorPierce));
            dmg = Math.max(1, dmg - armorReduction);
        }
        this.hp -= dmg; this.updateHpBar();
        this.scene.showDamageNumber(this.screenX(), this.screenY() - 25, dmg, isCrit);
        if (isCrit) this.scene.particles.critEffect(this.screenX(), this.screenY() - 20);
        // v5：检查精英狂暴
        this.checkEnrage();
        this.scene.tweens.add({
            targets: this.container,
            x: this.screenX() + (Math.random() - 0.5) * 6,
            y: this.screenY() + (Math.random() - 0.5) * 6,
            duration: 40, yoyo: true, ease: 'Cubic.easeOut'
        });
        if (this.scene.playerWorldX !== undefined) {
            const dx = this.worldX - this.scene.playerWorldX;
            const dy = this.worldY - this.scene.playerWorldY;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d > 0) {
                this.knockbackDir = { x: dx / d, y: dy / d };
                this.knockbackTimer = 180;
                this.stunned = Math.max(this.stunned, 120);
            }
        }
        if (this.scene.particles.shockRing) this.scene.particles.shockRing(this.screenX(), this.screenY());
        if (this.hp <= 0) { this.die(); return true; }
        return false;
    }
    applySlow(d, amount = 0.5) {
        this.slowed = Math.max(this.slowed, d);
        this.slowAmount = Math.max(this.slowAmount || 0, amount);
    }
    applyBurn(dmg, d) { this.burning = Math.max(this.burning, d); this.burnDamage = Math.max(this.burnDamage, dmg); }
    applyStun(d) { this.stunned = Math.max(this.stunned, d); }
    applyFreeze(d) { this.frozen = Math.max(this.frozen, d); }
    applyBleed(dmg, d) { this.bleeding = Math.max(this.bleeding || 0, d); this.bleedDamage = Math.max(this.bleedDamage || 0, dmg); }
    updateHpBar() {
        if (!this.hpBar) return;
        const ratio = Math.max(0, this.hp / this.maxHp);
        this.hpBar.scaleX = ratio;
        if (ratio < 0.3) this.hpBar.fillColor = 0xff0000;
        else if (ratio < 0.6) this.hpBar.fillColor = 0xff8800;
        else this.hpBar.fillColor = 0xff3344;
        if (this.container) {
            this.container.alpha = 0.7;
            this.scene.time.delayedCall(80, () => { if (this.container) this.container.alpha = 1; });
        }
        // 精灵模式：播放受击动画（不中断 run/idle 太久，仅短暂闪现）
        if (this.sprite && !this.dying) {
            const hitKey = `${this.type}_hit`;
            if (this.scene.anims.exists(hitKey) && this.sprite.anims) {
                this.sprite.play(hitKey, false);
                // 受击动画结束后回到移动/待机
                this.sprite.once('animationcomplete', () => {
                    if (this.alive && this.sprite) {
                        const back = this.currentSpeed > 5 ? `${this.type}_run` : `${this.type}_idle`;
                        this.sprite.play(back);
                    }
                });
            }
        }
    }
    die() {
        this.alive = false;
        this.dying = true;
        const cfg = this.config;
        if (this.statusBar) { this.statusBar.destroy(); this.statusBar = null; }
        this.scene.runtime.killCount++;
        this.scene.runtime.addCombo();
        this.scene.runtime.addGold(cfg.gold);
        const leveled = this.scene.runtime.addExp(cfg.exp);
        this.scene.particles.goldEffect(this.screenX(), this.screenY(), Math.max(1, cfg.gold));
        this.scene.particles.expEffect(this.screenX(), this.screenY(), Math.max(1, Math.ceil(cfg.exp / 6)));
        this.scene.particles.hit(this.screenX(), this.screenY(), cfg.color, 10, 3);
        this.dropLoot();
        this.dropRareLoot();
        // v5 贪婪加点：每级 +5% 概率额外掉落玄铁（必掉趋势）
        const greedLv = this.scene.runtime._greedLv || 0;
        if (greedLv > 0 && Math.random() < 0.05 * greedLv) {
            this.scene.items.push(new PickupItem(this.scene, 'darkIron', this.worldX, this.worldY));
        }
        if (leveled) this.scene.onLevelUp();
        // 精英任务怪击杀进度
        if (this.isQuestTarget) {
            this.scene.runtime.questProgress++;
            const chapter = STORY_CHAPTERS[this.scene.runtime.currentRegion];
            if (chapter) {
                const npcKey = Object.keys(chapter.npcDialogues)[0];
                const dialogues = chapter.npcDialogues[npcKey];
                if (this.scene.runtime.questProgress >= chapter.quest.count) {
                    this.scene.runtime.questCompleted = true;
                    this.scene.showStoryDialogue(dialogues.questComplete, '#44ff88');
                    this.scene.spawnBossPortal();
                } else {
                    this.scene.showStoryDialogue(dialogues.questUpdate(this.scene.runtime.questProgress, chapter.quest.count));
                }
            }
        }
        // 精灵模式：播放死亡动画后销毁；几何模式：tween 淡出
        if (this.sprite && this.scene.anims.exists(`${this.type}_death`)) {
            if (this.hpBar) this.hpBar.setVisible(false);
            if (this.hpBarBg) this.hpBarBg.setVisible(false);
            this.sprite.play(`${this.type}_death`);
            this.sprite.once('animationcomplete', () => {
                if (this.container) { this.container.destroy(); this.container = null; }
            });
            // 兜底：1.5 秒后强制销毁（防止动画事件未触发）
            this.scene.time.delayedCall(1500, () => { if (this.container) { this.container.destroy(); this.container = null; } });
        } else {
            this.scene.tweens.add({
                targets: this.container, alpha: 0, scale: 0.3, rotation: Math.PI / 4,
                duration: 350, ease: 'Cubic.easeIn',
                onComplete: () => { if (this.container) { this.container.destroy(); this.container = null; } }
            });
        }
    }
    dropLoot() {
        // v5：大幅降低普通掉落概率，加入三资源
        if (Math.random() > 0.015) return;  // 原0.025 → 0.015
        const r = Math.random();
        let type;
        if (r < 0.55) type = 'exp';
        else if (r < 0.70) type = 'health';  // 降低血包概率
        else if (r < 0.93) type = 'element_shard';
        else type = 'soulStone';  // 极小概率掉魂石
        this.scene.items.push(new PickupItem(this.scene, type, this.worldX, this.worldY));
    }
    dropRareLoot() {
        // v5：稀有掉落概率降低，加入玄铁和影石
        if (Math.random() > 0.008) return;  // 原0.01 → 0.008
        const r = Math.random();
        let type;
        if (r < 0.35) type = 'gem_red';
        else if (r < 0.55) type = 'gem_blue';
        else if (r < 0.72) type = 'gem_purple';
        else if (r < 0.84) type = 'exp_big';
        else if (r < 0.92) type = 'magnet';
        else if (r < 0.97) type = 'darkIron';      // 玄铁（武器升级）
        else type = 'shadowStone';                   // 影石（武器进化道具）
        this.scene.items.push(new PickupItem(this.scene, type, this.worldX, this.worldY));
    }
}

class EnemyManager {
    constructor(scene) {
        this.scene = scene; this.enemies = [];
        this.lastSpawn = 0; this.spawnInterval = 1800;
        this.maxEnemies = 40; this.waveNumber = 0;
        this.lastWaveTime = 0; this.lastMerchantWave = 0;
        this.merchantActive = null;
        this.waveKillTarget = 0; this.waveKills = 0;
    }
    getDifficulty(gameTime) {
        const minutes = gameTime / 60;
        // 加强后期：小怪血量随时间更陡增长，避免后期被秒杀
        const base = 1 + minutes * 0.30 + Math.pow(minutes, 1.4) * 0.12;
        return base * (this.scene && this.scene.runtime ? this.scene.runtime.difficulty : 1);
    }
    update(gameTime, delta) {
        const difficulty = this.getDifficulty(gameTime);
        this.checkWave(gameTime);
        this.checkMerchant(gameTime);
        const waveMultiplier = 1 + (this.waveNumber - 1) * 0.12;
        // 降低基础间隔，提高生成数，避免波次间长时间无怪
        this.spawnInterval = Math.max(350, 1200 - gameTime * 6 - this.waveNumber * 40);
        const baseSpawnCount = 2 + Math.floor(this.waveNumber / 2);
        const spawnCount = Math.min(8, baseSpawnCount);
        if (gameTime * 1000 - this.lastSpawn > this.spawnInterval / waveMultiplier &&
            this.enemies.filter(e => e.alive).length < this.maxEnemies + this.waveNumber * 2) {
            this.lastSpawn = gameTime * 1000;
            for (let i = 0; i < spawnCount; i++) {
                this.scene.time.delayedCall(i * 90, () => {
                    if (this.scene.gameState === 'playing' && !this.scene.paused) {
                        this.spawnEnemy(difficulty * waveMultiplier * 0.85, gameTime);
                    }
                });
            }
        }
        this.enemies.forEach(e => e.update(delta, gameTime));
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            if (!this.enemies[i].alive) this.enemies.splice(i, 1);
        }
        if (this.merchantActive && !this.merchantActive.alive) this.merchantActive = null;
    }
    checkWave(gameTime) {
        const newWave = Math.floor(gameTime / 45) + 1;
        if (newWave > this.waveNumber) {
            this.waveNumber = newWave; this.lastWaveTime = gameTime;
            const isBossWave = newWave % 6 === 0;
            const isEliteWave = newWave % 3 === 0;
            this.waveKills = 0;
            this.waveKillTarget = 15 + newWave * 5;
            this.scene.particles.waveBanner(newWave, isEliteWave, isBossWave);
        }
    }
    checkMerchant(gameTime) {
        if (this.waveNumber > 0 && this.waveNumber % 4 === 0 &&
            this.waveNumber !== this.lastMerchantWave && !this.merchantActive) {
            this.lastMerchantWave = this.waveNumber;
            this.spawnMerchant();
        }
    }
    spawnMerchant() {
        const side = Math.floor(Math.random() * 4);
        let x, y;
        const margin = 80;
        switch (side) {
            case 0: x = this.scene.playerWorldX - GW / 2 - margin; y = this.scene.playerWorldY + (Math.random() - 0.5) * GH * 0.6; break;
            case 1: x = this.scene.playerWorldX + GW / 2 + margin; y = this.scene.playerWorldY + (Math.random() - 0.5) * GH * 0.6; break;
            case 2: x = this.scene.playerWorldX + (Math.random() - 0.5) * GW * 0.6; y = this.scene.playerWorldY - GH / 2 - margin; break;
            case 3: x = this.scene.playerWorldX + (Math.random() - 0.5) * GW * 0.6; y = this.scene.playerWorldY + GH / 2 + margin; break;
        }
        this.merchantActive = new Merchant(this.scene);
        this.merchantActive.spawn(x, y);
    }
    spawnEnemy(difficulty, time) {
        const region = REGIONS[this.scene.runtime.currentRegion];
        const pool = region ? region.enemyPool : this.getAvailableTypes(time);
        let type = pool[Math.floor(Math.random() * pool.length)];
        if (Math.random() < 0.015) type = 'chest';
        if (Math.random() < 0.008) type = 'rainbow';
        // v5：远程小怪极小概率出现（archer 3%, mage 2%）
        const remoteRoll = Math.random();
        if (remoteRoll < 0.02) type = 'mage';
        else if (remoteRoll < 0.05) type = 'archer';

        const side = Math.floor(Math.random() * 4);
        let x, y;
        const spawnDist = Math.max(GW, GH) / 2 + 60 + Math.random() * 80;
        switch (side) {
            case 0: x = this.scene.playerWorldX - spawnDist; y = this.scene.playerWorldY + (Math.random() - 0.5) * GH * 0.8; break;
            case 1: x = this.scene.playerWorldX + spawnDist; y = this.scene.playerWorldY + (Math.random() - 0.5) * GH * 0.8; break;
            case 2: x = this.scene.playerWorldX + (Math.random() - 0.5) * GW * 0.8; y = this.scene.playerWorldY - spawnDist; break;
            case 3: x = this.scene.playerWorldX + (Math.random() - 0.5) * GW * 0.8; y = this.scene.playerWorldY + spawnDist; break;
        }

        const enemy = new Enemy(this.scene, type);
        enemy.spawn(x, y, difficulty);

        // 精英怪递进：前期少量普通精英，中期普通+更强，后期更强+最更强
        const eliteChance = 0.10 + this.waveNumber * 0.02 + (time / 60) * 0.025;
        if (Math.random() < Math.min(0.65, eliteChance)) {
            // 判定精英档位
            let tier = 1;
            const w = this.waveNumber;
            const r = Math.random();
            if (w < 3) {
                tier = 1;
            } else if (w < 6) {
                tier = r < 0.65 ? 1 : 2;
            } else if (w < 9) {
                tier = r < 0.30 ? 1 : (r < 0.80 ? 2 : 3);
            } else {
                tier = r < 0.15 ? 1 : (r < 0.60 ? 2 : 3);
            }
            enemy.setElite(tier);
        }

        this.enemies.push(enemy);
    }
    getAvailableTypes(gameTime) {
        const types = ['slime'];
        if (gameTime > 20) types.push('bat');
        if (gameTime > 50) types.push('skeleton');
        if (gameTime > 90) types.push('ghost');
        if (gameTime > 140) types.push('archer');
        if (gameTime > 200) types.push('demon');
        if (gameTime > 280) types.push('gargoyle');
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
        const A = px - x1, B = py - y1, C = x2 - x1, D = y2 - y1;
        const dot = A * C + B * D, lenSq = C * C + D * D;
        let param = -1;
        if (lenSq !== 0) param = dot / lenSq;
        let xx, yy;
        if (param < 0) { xx = x1; yy = y1; }
        else if (param > 1) { xx = x2; yy = y2; }
        else { xx = x1 + param * C; yy = y1 + param * D; }
        const dx = px - xx, dy = py - yy;
        return Math.sqrt(dx * dx + dy * dy);
    }
    getEnemiesInRadius(x, y, radius) {
        return this.enemies.filter(e => e.alive &&
            Phaser.Math.Distance.Between(x, y, e.worldX, e.worldY) <= radius);
    }
    clear() {
        this.enemies.forEach(e => { if (e.container) e.container.destroy(); });
        this.enemies = [];
        this.lastSpawn = 0;
        this.spawnInterval = 2000;
        this.waveNumber = 0;
        this.lastWaveTime = 0;
        this.lastMerchantWave = 0;
        if (this.merchantActive) { this.merchantActive.destroy(); this.merchantActive = null; }
    }
}

// ==================== 随机宝箱 ====================
class TreasureChest {
    constructor(scene, x, y, rarity) {
        this.scene = scene; this.worldX = x; this.worldY = y;
        this.rarity = rarity;
        this.alive = true; this.opened = false;
        this.container = null; this.glowTween = null;
        this.create();
    }
    create() {
        const sx = this.screenX(), sy = this.screenY();
        this.container = this.scene.add.container(sx, sy);
        const rarityColors = {
            common: { main: 0x8B4513, glow: 0xCD853F, depth: 80 },
            rare: { main: 0x4169E1, glow: 0x6495ED, depth: 85 },
            epic: { main: 0x9932CC, glow: 0xDA70D6, depth: 90 },
            legendary: { main: 0xFFD700, glow: 0xFFA500, depth: 95 }
        };
        const c = rarityColors[this.rarity] || rarityColors.common;
        this.container.setDepth(c.depth);

        const shadow = this.scene.add.ellipse(0, 12, 28, 8, 0x000000, 0.4);
        const glow = this.scene.add.circle(0, 0, 35, c.glow, 0.25);
        this.glowSprite = glow;
        const body = this.scene.add.rectangle(0, 0, 28, 22, c.main);
        const bodyDark = this.scene.add.rectangle(0, -3, 28, 8, Phaser.Display.Color.GetColor(
            Math.max(0, (c.main >> 16) - 30),
            Math.max(0, ((c.main >> 8) & 0xFF) - 30),
            Math.max(0, (c.main & 0xFF) - 30)
        ));
        const lid = this.scene.add.rectangle(0, -9, 30, 6, c.main);
        const lock = this.scene.add.rectangle(0, -3, 6, 8, 0xffd700);
        const lockTop = this.scene.add.circle(0, -6, 4, 0xffd700);
        const highlight = this.scene.add.rectangle(-8, -1, 3, 10, 0xffffff, 0.2);
        this.container.add([shadow, glow, body, bodyDark, lid, lock, lockTop, highlight]);

        this.lid = lid;

        this.glowTween = this.scene.tweens.add({
            targets: glow,
            scale: { from: 0.9, to: 1.2 },
            alpha: { from: 0.15, to: 0.35 },
            yoyo: true,
            repeat: -1,
            duration: 1200 + Math.random() * 400
        });
        this.floatTween = this.scene.tweens.add({
            targets: this.container,
            y: sy - 3,
            yoyo: true,
            repeat: -1,
            duration: 1500 + Math.random() * 500
        });

        this.container.setSize(40, 40);
        // 宝箱改为纯靠近开启，不允许远程点击
    }
    screenX() { return this.worldX - this.scene.playerWorldX + GW / 2; }
    screenY() { return this.worldY - this.scene.playerWorldY + GH / 2; }
    update(time, delta) {
        if (!this.alive || !this.container) return;
        this.container.x = this.screenX();
        if (this.glowSprite) {
            this.glowSprite.rotation += 0.01;
        }
        const d = Phaser.Math.Distance.Between(
            this.scene.playerWorldX, this.scene.playerWorldY, this.worldX, this.worldY);
        if (d < 65 && !this.opened) {
            this.open();
        }
    }
    open() {
        if (this.opened) return;
        this.opened = true;
        this.scene.audio.play('levelup');

        if (this.glowTween) { this.glowTween.stop(); this.glowTween = null; }
        if (this.floatTween) { this.floatTween.stop(); this.floatTween = null; }

        this.scene.tweens.add({
            targets: this.lid,
            angle: -40,
            y: -16,
            duration: 300,
            ease: 'Cubic.easeOut'
        });

        const rewards = this.getRewards();
        rewards.forEach((r, i) => {
            this.scene.time.delayedCall(i * 80, () => {
                if (!this.alive) return;
                const angle = -Math.PI / 2 + (i - rewards.length / 2) * 0.4;
                const dist = 30 + i * 5;
                const nx = this.worldX + Math.cos(angle) * dist;
                const ny = this.worldY + Math.sin(angle) * dist;
                this.scene.items.push(new PickupItem(this.scene, r, nx, ny));
            });
        });

        this.scene.cameras.main.flash(200, 255, 220, 100);

        this.scene.time.delayedCall(600, () => {
            this.alive = false;
            if (this.container) { this.container.destroy(); this.container = null; }
        });
    }
    getRewards() {
        const pool = [];
        switch (this.rarity) {
            case 'common':
                pool.push('gold', 'gold', 'exp', 'exp', 'health');
                break;
            case 'rare':
                pool.push('gold_big', 'exp_big', 'gold', 'exp', 'shield');
                break;
            case 'epic':
                pool.push('gem_red', 'gem_blue', 'gold_big', 'exp_big', 'shield');
                break;
            case 'legendary':
                pool.push('gem_purple', 'gem_red', 'gem_blue', 'gold_big', 'exp_big');
                break;
        }
        const count = this.rarity === 'legendary' ? 5 :
                      this.rarity === 'epic' ? 4 :
                      this.rarity === 'rare' ? 3 : 2;
        const result = [];
        for (let i = 0; i < count; i++) {
            result.push(pool[Math.floor(Math.random() * pool.length)]);
        }
        return result;
    }
}

// ==================== 拾取物品 ====================
class PickupItem {
    constructor(scene, type, x, y) {
        this.scene = scene; this.type = type;
        this.worldX = x; this.worldY = y; this.alive = true;
        this.container = null; this.bobOffset = Math.random() * Math.PI * 2;
        this.create();
    }
    create() {
        const sx = this.screenX(), sy = this.screenY();
        this.container = this.scene.add.container(sx, sy);
        this.container.setDepth(60);
        const glow = this.scene.add.circle(0, 0, 18, 0xffffff, 0.15);
        const map = {
            health: { c: 0xff4466, icon: '❤' },
            gold: { c: 0xffd700, icon: '💰' },
            exp: { c: 0xffdd00, icon: null, shape: 'star' },
            shield: { c: 0x4488ff, icon: '🛡' },
            gem_red: { c: 0xff2244, icon: null, shape: 'gem' },
            gem_blue: { c: 0x2266ff, icon: null, shape: 'gem' },
            gem_purple: { c: 0xcc44ff, icon: null, shape: 'gem' },
            gold_big: { c: 0xffd700, icon: null, shape: 'bigstar' },
            exp_big: { c: 0xffdd00, icon: null, shape: 'bigstar' },
            magnet: { c: 0xff00ff, icon: '🧲' },
            bomb: { c: 0x222222, icon: '💣' },
            element_shard: { c: 0x00ffaa, icon: null, shape: 'shard' },
            arcane_dust: { c: 0xcc88ff, icon: null, shape: 'dust' },
            element_crystal: { c: 0xff8866, icon: null, shape: 'crystal' },
            // === v5 三资源 ===
            soulStone: { c: 0xaa44ff, icon: '✦', shape: 'gem' },     // 紫色 魂石
            darkIron: { c: 0xff8833, icon: '⛏', shape: 'shard' },     // 橙色 玄铁
            bossBlood: { c: 0xffcc00, icon: '✺', shape: 'bigstar' },  // 金色 BOSS之血
            shadowStone: { c: 0x8844cc, icon: '◈', shape: 'crystal' },// 影石（进化道具）
            bloodCrystal: { c: 0xff3366, icon: '◆', shape: 'crystal' } // 血晶（进化道具）
        };
        const m = map[this.type] || map.gold;
        this.container.add([this.scene.add.circle(0, 0, 16, m.c, 0.3), glow,
            this.scene.add.circle(0, 0, 12, m.c)]);
        if (m.shape === 'star') this.container.add(this.scene.add.star(0, 0, 5, 6, 12, m.c));
        else if (m.shape === 'gem') this.container.add(this.scene.add.star(0, 0, 5, 5, 11, m.c));
        else if (m.shape === 'bigstar') this.container.add(this.scene.add.star(0, 0, 5, 8, 16, m.c));
        else if (m.shape === 'shard') this.container.add(this.scene.add.star(0, 0, 4, 5, 12, m.c));
        else if (m.shape === 'dust') this.container.add(this.scene.add.circle(0, 0, 8, m.c));
        else if (m.shape === 'crystal') this.container.add(this.scene.add.star(0, 0, 6, 7, 14, m.c));
        if (m.icon) this.container.add(this.scene.add.text(0, 0, m.icon, { fontSize: '16px' }).setOrigin(0.5));
        // 放大掉落物图标，便于看清
        this.container.setScale(1.3);
    }
    screenX() { return this.worldX - this.scene.playerWorldX + GW / 2; }
    screenY() { return this.worldY - this.scene.playerWorldY + GH / 2; }
    update(time, delta) {
        if (!this.alive) return;
        this.container.x = this.screenX();
        this.container.y = this.screenY() + Math.sin(time * 0.004 + this.bobOffset) * 6;
        this.container.rotation = Math.sin(time * 0.003) * 0.1;
    }
    pickup() {
        this.alive = false;
        this.scene.audio.play('pickup');
        const sd = this.scene.saveData;
        switch (this.type) {
            case 'health': this.scene.runtime.heal(50); this.scene.particles.healEffect(GW / 2, GH / 2 - 20); break;
            case 'gold': this.scene.runtime.addGold(10); this.scene.particles.goldEffect(this.screenX(), this.screenY(), 4); break;
            case 'exp': const lv = this.scene.runtime.addExp(12); this.scene.particles.expEffect(this.screenX(), this.screenY(), 3); if (lv) this.scene.onLevelUp(); break;
            case 'shield': this.scene.runtime.shield += 20; break;
            case 'gem_red': this.scene.runtime.addBonus('atk', 0.03); break;
            case 'gem_blue': this.scene.runtime.addBonus('armor', 0.03); break;
            case 'gem_purple': this.scene.runtime.addBonus('fire', 0.1); break;
            case 'gold_big': this.scene.runtime.addGold(50); this.scene.particles.goldEffect(this.screenX(), this.screenY(), 10); break;
            case 'exp_big': const lv2 = this.scene.runtime.addExp(40); this.scene.particles.expEffect(this.screenX(), this.screenY(), 8); if (lv2) this.scene.onLevelUp(); break;
            case 'magnet': this.scene.runtime.addBonus('magnet', 60); break;
            case 'element_shard': this.scene.runtime.elements.shard++; break;
            case 'arcane_dust': this.scene.runtime.elements.dust++; break;
            case 'element_crystal': this.scene.runtime.elements.crystal++; break;
            // === v5 三资源 ===
            case 'soulStone':
                sd.soulStones = (sd.soulStones || 0) + 1;
                this.scene.particles.hit(this.screenX(), this.screenY(), 0xaa44ff, 8, 3);
                break;
            case 'darkIron':
                sd.darkIron = (sd.darkIron || 0) + 1;
                this.scene.particles.hit(this.screenX(), this.screenY(), 0xff8833, 8, 3);
                break;
            case 'bossBlood':
                sd.bossBlood = (sd.bossBlood || 0) + 1;
                this.scene.particles.hit(this.screenX(), this.screenY(), 0xffcc00, 12, 4);
                this.scene.cameras.main.flash(200, 255, 200, 100);
                break;
            case 'shadowStone':
                sd.weaponMats = sd.weaponMats || { shadowStone: 0, bloodCrystal: 0 };
                sd.weaponMats.shadowStone = (sd.weaponMats.shadowStone || 0) + 1;
                this.scene.particles.hit(this.screenX(), this.screenY(), 0x8844cc, 8, 3);
                break;
            case 'bloodCrystal':
                sd.weaponMats = sd.weaponMats || { shadowStone: 0, bloodCrystal: 0 };
                sd.weaponMats.bloodCrystal = (sd.weaponMats.bloodCrystal || 0) + 1;
                this.scene.particles.hit(this.screenX(), this.screenY(), 0xff3366, 8, 3);
                break;
            case 'bomb':
                const bombWlvl = this.scene.weaponLevels[this.scene.runtime.weaponType] || 1;
                const dmg = this.scene.runtime.weapon.getDamage(bombWlvl, this.scene.runtime.spec) * 5;
                const targets = this.scene.enemyManager.getEnemiesInRadius(this.worldX, this.worldY, 150);
                targets.forEach(e => e.takeDamage(dmg, true));
                if (this.scene.bossManager.boss?.alive) {
                    const bd = Phaser.Math.Distance.Between(this.worldX, this.worldY,
                        this.scene.bossManager.boss.worldX, this.scene.bossManager.boss.worldY);
                    if (bd < 150) this.scene.bossManager.boss.takeDamage(dmg, true);
                }
                this.scene.bossManager.alivePhantoms.forEach(b => {
                    const bd = Phaser.Math.Distance.Between(this.worldX, this.worldY, b.worldX, b.worldY);
                    if (bd < 150) b.takeDamage(dmg, true);
                });
                this.scene.particles.explosion(this.screenX(), this.screenY(), 150, 0xff4400);
                this.scene.cameras.main.shake(300, 0.008);
                break;
        }
        SaveData.save(sd);
        this.scene.particles.hit(this.screenX(), this.screenY(), 0xffffff, 6, 3);
        // 拾取浮动文字说明用途（颜色区分类型）
        const descMap = {
            health: '+50 生命', gold: '+10 金币', exp: '+12 经验', shield: '+20 护盾',
            gem_red: '+3% 攻击', gem_blue: '+3% 护甲', gem_purple: '+10% 火伤',
            gold_big: '+50 金币', exp_big: '+40 经验', magnet: '+60 拾取范围',
            element_shard: '+1 元素碎片', arcane_dust: '+1 奥术尘', element_crystal: '+1 元素结晶',
            soulStone: '+1 魂石（角色加点）', darkIron: '+1 玄铁（武器升级）',
            bossBlood: '+1 BOSS之血（武器进化）', shadowStone: '+1 影石（武器进化）',
            bloodCrystal: '+1 血晶（武器进化）', bomb: '范围爆炸！'
        };
        const descColorMap = {
            soulStone: '#cc88ff', darkIron: '#ffaa55', bossBlood: '#ffdd44',
            shadowStone: '#aa66dd', bloodCrystal: '#ff6688'
        };
        const desc = descMap[this.type] || '';
        if (desc) {
            const ftColor = descColorMap[this.type] || '#ffffff';
            const ft = this.scene.add.text(this.screenX(), this.screenY() - 20, desc, {
                fontSize: '14px', fontFamily: 'Courier New', color: ftColor,
                stroke: '#000', strokeThickness: 3, fontWeight: 'bold'
            }).setOrigin(0.5).setDepth(200);
            this.scene.tweens.add({
                targets: ft, y: ft.y - 30, alpha: 0, duration: 1000,
                onComplete: () => ft.destroy()
            });
        }
        this.container.destroy(); this.container = null;
    }
}

// ==================== 神秘商人 ====================
class Merchant {
    constructor(scene) {
        this.scene = scene; this.worldX = 0; this.worldY = 0;
        this.alive = true; this.container = null;
        this.shops = [
            { name: '生命药水', icon: '❤', desc: '恢复50%生命', cost: 40, action: 'heal' },
            { name: '护盾符文', icon: '🛡', desc: '获得50护盾', cost: 60, action: 'shield' },
            { name: '元素碎片包', icon: '💠', desc: '获得2个元素碎片', cost: 200, action: 'shard_pack' },
            { name: '力量宝石', icon: '💎', desc: '永久攻击+5%', cost: 300, action: 'atk' },
            { name: '净化药水', icon: '✨', desc: '解除负面效果', cost: 25, action: 'cleanse' }
        ];
    }
    spawn(x, y) {
        this.worldX = x; this.worldY = y;
        this.container = this.scene.add.container(this.screenX(), this.screenY());
        this.container.setDepth(75);
        const glow = this.scene.add.circle(0, 0, 40, 0xffd700, 0.3);
        const body = this.scene.add.ellipse(0, 0, 35, 45, 0x6B4423);
        const robe = this.scene.add.ellipse(0, 5, 30, 35, 0x8B4513);
        const head = this.scene.add.circle(0, -18, 15, 0xffcc99);
        const hat = this.scene.add.triangle(0, -28, -18, -18, 18, -18, 0, -42, 0x4422aa);
        const hatBrim = this.scene.add.ellipse(0, -20, 30, 6, 0x4422aa);
        const eye1 = this.scene.add.circle(-5, -20, 2, 0x000000);
        const eye2 = this.scene.add.circle(5, -20, 2, 0x000000);
        this.container.add([glow, body, robe, head, hatBrim, hat, eye1, eye2]);
        this.scene.audio.play('merchant');
        // 商人物品
        this.openShop();
    }
    openShop() {
        const items = [...this.shops].sort(() => Math.random() - 0.5).slice(0, 3);
        this.scene.showMerchantShop(items);
    }
    screenX() { return this.worldX - this.scene.playerWorldX + GW / 2; }
    screenY() { return this.worldY - this.scene.playerWorldY + GH / 2; }
    update(time, delta) {
        if (!this.alive || !this.container) return;
        this.container.x = this.screenX();
        this.container.y = this.screenY() + Math.sin(time * 0.003) * 4;
    }
    destroy() {
        this.alive = false;
        if (this.container) { this.container.destroy(); this.container = null; }
    }
}

// ==================== Boss系统 ====================
class Boss {
    constructor(scene, type) {
        this.scene = scene; this.type = type;
        this.alive = false; this.worldX = 0; this.worldY = 0;
        this.hp = 0; this.maxHp = 0;
        this.damage = 0; this.speed = 0; this.currentSpeed = 0;
        this.accelRate = 0.015; this.hitRadius = 55;
        this.container = null; this.hpBar = null; this.hpBarBg = null;
        this.nameText = null; this.lastSpecial = 0;
        this.specialCooldown = 2200; this.attackCooldown = 0;
        this.phase = 1; this.bossLevel = 1;
        this.config = BossConfigs.find(c => c.id === type) || BossConfigs[0];
    }
    spawn(difficulty = 1, level = 1) {
        const cfg = this.config;
        this.bossLevel = level;
        this.worldX = this.scene.playerWorldX;
        this.worldY = this.scene.playerWorldY - 250;
        // v5：BOSS 多血条系统（根据难度和BOSS类型决定血条数）
        const diffName = this.scene.runtime?.difficultyName || '普通';
        const baseBars = { '简单': 3, '普通': 5, '困难': 8, '地狱': 12 };
        let bars = baseBars[diffName] || 5;
        // 暗影神特殊：15 条血
        if (cfg.id === 'sg') bars = diffName === '地狱' ? 15 : Math.max(8, bars + 3);
        this.totalBars = bars;
        this.currentBar = 1;
        // 每条血的血量
        const perBarHp = Math.floor(cfg.hp * difficulty * 1.6 * (1 + (level - 1) * 0.5));
        this.perBarHp = perBarHp;
        this.hp = perBarHp;
        this.maxHp = perBarHp;
        this.totalMaxHp = perBarHp * bars;  // 总血量（用于显示）
        this.damage = Math.floor(cfg.dmg * difficulty * (1 + (level - 1) * 0.25));
        this.speed = cfg.spd;
        this.currentSpeed = 0;
        this.hitRadius = cfg.radius;
        this.alive = true;
        this.phase = 1;
        this.lastSpecial = 0;
        this.attackCooldown = 0;
        this.createSprite();
        this.scene.audio.play('boss');
        return this;
    }
    createSprite() {
        const cfg = this.config;
        const size = cfg.size;
        this.container = this.scene.add.container(GW / 2, GH / 2 - 250);
        this.container.setDepth(80);

        // 使用程序化生成的像素艺术纹理（96x96，pixelArt 模式硬边渲染）
        const bossImageKey = 'boss_' + this.config.id;
        if (this.scene.textures.exists(bossImageKey)) {
            // 多层光环：外层大而淡，内层小而亮
            const outerGlow = this.scene.add.circle(0, 0, size * 0.95, cfg.glowColor, 0.12);
            const midGlow = this.scene.add.circle(0, 0, size * 0.7, cfg.glowColor, 0.22);
            const innerGlow = this.scene.add.circle(0, 0, size * 0.55, cfg.glowColor, 0.35);
            // 地面阴影
            const shadow = this.scene.add.ellipse(0, size * 0.45, size * 0.7, size * 0.18, 0x000000, 0.4);
            // BOSS 精灵本体
            const img = this.scene.add.image(0, 0, bossImageKey);
            img.setDisplaySize(size, size);
            this.container.add([shadow, outerGlow, midGlow, innerGlow, img]);
            shadow.setDepth(0);
            outerGlow.setDepth(1); midGlow.setDepth(2); innerGlow.setDepth(3);
            img.setDepth(4);

            // 光环脉动（呼吸效果）
            this.scene.tweens.add({
                targets: [outerGlow, midGlow],
                scale: { from: 1, to: 1.12 },
                alpha: { from: 0.12, to: 0.25 },
                duration: 1400, yoyo: true, repeat: -1, ease: 'Sine.inOut'
            });
            this.scene.tweens.add({
                targets: innerGlow,
                scale: { from: 1, to: 1.18 },
                alpha: { from: 0.35, to: 0.55 },
                duration: 900, yoyo: true, repeat: -1, ease: 'Sine.inOut'
            });
            // BOSS 上下浮动
            this.scene.tweens.add({
                targets: img,
                y: { from: -size * 0.04, to: size * 0.04 },
                duration: 2200, yoyo: true, repeat: -1, ease: 'Sine.inOut'
            });
            this.bossImage = img;
            this.bossAura = midGlow; // 由 updateAnim 控制；outerGlow/innerGlow 由 tween 控制
        } else {
        const aura = this.scene.add.circle(0, 0, size * 0.8, cfg.glowColor, 0.15);
        const aura2 = this.scene.add.circle(0, 0, size * 0.6, cfg.glowColor, 0.25);
        const body = this.scene.add.circle(0, 0, size * 0.55, cfg.color);
        const head = this.scene.add.circle(0, -size * 0.38, size * 0.35, cfg.color);
        const eye1 = this.scene.add.circle(-size * 0.14, -size * 0.4, size * 0.1, 0xff0000);
        const eye2 = this.scene.add.circle(size * 0.14, -size * 0.4, size * 0.1, 0xff0000);
        const eyeGlow1 = this.scene.add.circle(-size * 0.14, -size * 0.4, size * 0.15, 0xff0000, 0.4);
        const eyeGlow2 = this.scene.add.circle(size * 0.14, -size * 0.4, size * 0.15, 0xff0000, 0.4);
        const leftArm = this.scene.add.ellipse(-size * 0.55, 0, size * 0.18, size * 0.4, cfg.color);
        const rightArm = this.scene.add.ellipse(size * 0.55, 0, size * 0.18, size * 0.4, cfg.color);
        const leftHand = this.scene.add.circle(-size * 0.6, size * 0.3, size * 0.15, cfg.glowColor);
        const rightHand = this.scene.add.circle(size * 0.6, size * 0.3, size * 0.15, cfg.glowColor);
        this.container.add([aura, aura2, body, leftArm, rightArm, leftHand, rightHand, head, eyeGlow1, eyeGlow2, eye1, eye2]);
        this.bossAura = aura; this.bossBody = body;
        this.bossLeftArm = leftArm; this.bossRightArm = rightArm;

        // 根据BOSS类型添加不同的视觉特征
        const bossGfx = this.scene.add.graphics();
        const id = this.config.id;
        const cx = 0, cy = 0;
        const r = cfg.size / 2;

        if (id === 'gk') {
            // 哥布林王：王冠
            bossGfx.fillStyle(0xffd700);
            bossGfx.fillTriangle(cx - r * 0.4, cy - r * 0.7, cx, cy - r * 1.1, cx + r * 0.4, cy - r * 0.7);
        } else if (id === 'sl') {
            // 骷髅领主：骨头十字
            bossGfx.fillStyle(0xeeeeee);
            bossGfx.fillRect(cx - r * 0.1, cy - r * 0.5, r * 0.2, r);
            bossGfx.fillRect(cx - r * 0.4, cy - r * 0.2, r * 0.8, r * 0.2);
        } else if (id === 'sd') {
            // 暗影龙：翅膀
            bossGfx.fillStyle(cfg.color, 0.6);
            bossGfx.fillTriangle(cx - r * 0.8, cy, cx - r * 1.3, cy - r * 0.5, cx - r * 1.3, cy + r * 0.3);
            bossGfx.fillTriangle(cx + r * 0.8, cy, cx + r * 1.3, cy - r * 0.5, cx + r * 1.3, cy + r * 0.3);
        } else if (id === 'ab') {
            // 深渊魔王：角
            bossGfx.fillStyle(0x880000);
            bossGfx.fillTriangle(cx - r * 0.5, cy - r * 0.7, cx - r * 0.7, cy - r * 1.2, cx - r * 0.3, cy - r * 0.9);
            bossGfx.fillTriangle(cx + r * 0.5, cy - r * 0.7, cx + r * 0.7, cy - r * 1.2, cx + r * 0.3, cy - r * 0.9);
        } else if (id === 'ts') {
            // 时空守护者：时钟环
            bossGfx.lineStyle(2, 0x88aaff);
            bossGfx.strokeCircle(cx, cy, r * 1.15);
            bossGfx.fillStyle(0x88aaff);
            bossGfx.fillRect(cx - 1, cy - r * 1.15, 2, r * 0.3);
        } else if (id === 'el') {
            // 元素领主：四元素小球
            const elemColors = [0xff4400, 0x44aaff, 0xffaa00, 0x44ff44];
            for (let i = 0; i < 4; i++) {
                const ea = (i / 4) * Math.PI * 2;
                bossGfx.fillStyle(elemColors[i]);
                bossGfx.fillCircle(cx + Math.cos(ea) * r * 0.9, cy + Math.sin(ea) * r * 0.9, r * 0.15);
            }
        } else if (id === 'vp') {
            // 虚空先知：眼睛
            bossGfx.fillStyle(0xff0000);
            bossGfx.fillEllipse(cx, cy, r * 0.6, r * 0.3);
            bossGfx.fillStyle(0x000000);
            bossGfx.fillCircle(cx, cy, r * 0.1);
        } else if (id === 'sg') {
            // 暗影神：光环
            bossGfx.lineStyle(3, 0xff4400, 0.5);
            bossGfx.strokeCircle(cx, cy, r * 1.3);
            bossGfx.lineStyle(2, 0xff8800, 0.3);
            bossGfx.strokeCircle(cx, cy, r * 1.5);
        }

        this.container.add(bossGfx);
        }

        this.hpBarBg = this.scene.add.rectangle(GW / 2, 75, 550, 22, 0x1a0000).setOrigin(0.5);
        this.hpBarBg.setDepth(200).setScrollFactor(0).setStrokeStyle(3, 0x440000);
        this.hpBar = this.scene.add.rectangle(GW / 2 - 272, 75, 544, 16, 0xff2244).setOrigin(0, 0.5);
        this.hpBar.setDepth(202).setScrollFactor(0);
        this.hpBarGlow = this.scene.add.rectangle(GW / 2 - 272, 75, 544, 16, 0xffffff, 0.3).setOrigin(0, 0.5);
        this.hpBarGlow.setDepth(203).setScrollFactor(0);
        this.nameText = this.scene.add.text(GW / 2, 45, `${cfg.icon} ${cfg.name}  Lv.${this.bossLevel}`, {
            fontSize: '22px', fontFamily: 'Courier New', color: '#ff4466',
            stroke: '#000', strokeThickness: 4, fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(204).setScrollFactor(0);
        // v5：多血条分段指示器（■■■□□□）
        this.barSegmentsText = this.scene.add.text(GW / 2, 95, '', {
            fontSize: '14px', fontFamily: 'Courier New', color: '#ffaa44',
            stroke: '#000', strokeThickness: 2, fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(204).setScrollFactor(0);

        if (this.scene.bossManager) {
            this.scene.bossManager.bossUI.push(this.hpBarBg, this.hpBar, this.hpBarGlow, this.nameText, this.barSegmentsText);
        }

        this.scene.tweens.add({
            targets: this.container,
            alpha: { from: 0, to: 1 },
            scale: { from: 0.2, to: 1 },
            duration: 1200, ease: 'Back.easeOut'
        });
    }
    screenX() { return this.worldX - this.scene.playerWorldX + GW / 2; }
    screenY() { return this.worldY - this.scene.playerWorldY + GH / 2; }
    update(delta, time) {
        if (!this.alive) return;
        const dt = delta / 1000;
        if (this.attackCooldown > 0) this.attackCooldown -= delta;
        if (this.stunned > 0 || this.frozen > 0) {
            this.stunned = Math.max(0, this.stunned - delta);
            this.frozen = Math.max(0, this.frozen - delta);
            this.updateSpritePosition();
            return;
        }
        if (this.slowed > 0) { this.slowed -= delta; if (this.slowed <= 0) this.slowAmount = 0; }
        if (this.burning > 0) {
            this.burning -= delta;
            if (Math.random() < dt * 2) {
                this.hp -= this.burnDamage;
                if (this.hp <= 0) { this.die(); return; }
            }
        }
        if (this.bleeding > 0) {
            this.bleeding -= delta;
            if (Math.random() < dt * 2.5) {
                this.hp -= this.bleedDamage;
                if (this.hp <= 0) { this.die(); return; }
            }
        }
        if (this.hp < this.maxHp * 0.5 && this.phase === 1) {
            this.phase = 2;
            this.speed *= 1.35; this.specialCooldown *= 0.65;
            this.scene.particles.explosion(this.screenX(), this.screenY(), 150, this.config.glowColor);
            this.showPhaseText('狂暴！', '#ff4400');
        }
        if (this.hp < this.maxHp * 0.25 && this.phase === 2) {
            this.phase = 3;
            this.speed *= 1.2; this.specialCooldown *= 0.7;
            this.showPhaseText('终末形态！', '#ff0000');
            this.spawnMinions();
        }
        this.updateUniqueMechanisms(delta);
        this.move(dt);
        this.specialAttack(time);
        this.checkPlayerCollision();
        this.updateSpritePosition();
        this.updateAnim(time);
    }
    updateUniqueMechanisms(delta) {
        const dt = delta / 1000;
        // 哥布林王：每15秒召唤一波小怪
        if (this.config.id === 'gk') {
            this.summonTimer = (this.summonTimer === undefined ? 15 : this.summonTimer) - dt;
            if (this.summonTimer <= 0) {
                this.summonTimer = 15;
                this.summonGoblins();
            }
        }
        // 暗影龙：沙暴隐身（每15秒隐身3秒）
        if (this.config.id === 'sd') {
            this._stealthTimer = (this._stealthTimer === undefined ? 15000 : this._stealthTimer) - delta;
            if (this._stealthTimer <= 0) {
                this._stealthTimer = 15000;
                this._stealthDuration = 3000;
            }
            if (this._stealthDuration > 0) {
                this._stealthDuration -= delta;
                if (this.container) this.container.setAlpha(0.3);
            } else {
                if (this.container) this.container.setAlpha(1);
            }
        }
        // 深渊魔王：持续减速玩家（使用 slowTimer 持续刷新）
        if (this.config.id === 'ab' && this.alive) {
            this.scene.runtime.slowEffect = 0.5;
            this.scene.runtime.slowTimer = 1500;
        }
    }
    showPhaseText(text, color) {
        const t = this.scene.add.text(this.screenX(), this.screenY() - 80, text, {
            fontSize: '32px', fontFamily: 'Courier New',
            color, stroke: '#000', strokeThickness: 4, fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(250);
        this.scene.tweens.add({
            targets: t, alpha: 0, scale: 2, y: this.screenY() - 120,
            duration: 1000, ease: 'Cubic.easeOut', onComplete: () => t.destroy()
        });
    }
    updateAnim(time) {
        const pulse = 1 + Math.sin(time * 0.004) * 0.05;
        if (this.bossAura) {
            this.bossAura.scale = pulse * (this.phase >= 2 ? 1.3 : 1);
            this.bossAura.alpha = 0.15 + Math.sin(time * 0.006) * 0.1;
        }
        if (this.bossBody) this.bossBody.scale = 1 + Math.sin(time * 0.003) * 0.02;
        if (this.bossLeftArm && this.bossRightArm) {
            const sw = Math.sin(time * 0.002) * 0.15;
            this.bossLeftArm.rotation = -0.3 + sw; this.bossRightArm.rotation = 0.3 - sw;
        }
    }
    move(dt) {
        const px = this.scene.playerWorldX, py = this.scene.playerWorldY;
        const dx = px - this.worldX, dy = py - this.worldY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 70) { this.currentSpeed *= 0.92; return; }
        let targetSpeed = this.speed * (this.phase >= 2 ? 1.2 : 1);
        if (this.slowed > 0 && this.slowAmount) targetSpeed *= (1 - this.slowAmount);
        this.currentSpeed += (targetSpeed - this.currentSpeed) * this.accelRate;
        this.currentSpeed = Math.max(0, Math.min(targetSpeed, this.currentSpeed));
        this.worldX += (dx / dist) * this.currentSpeed * dt;
        this.worldY += (dy / dist) * this.currentSpeed * dt;
    }
    specialAttack(time) {
        if (time - this.lastSpecial < this.specialCooldown) return;
        this.lastSpecial = time;
        // v5：难度影响 BOSS 招式
        const diffName = this.scene.runtime.difficultyName || '普通';
        const allSkills = this.config.skills.filter(s => s !== 'enrage');
        // 简单：只用第 1 个招式
        let skills = (diffName === '简单') ? allSkills.slice(0, 1) : allSkills;
        const skill = skills[Math.floor(Math.random() * skills.length)];
        this[skill]();
        // v5：困难/地狱 组合技（连发两个不同招式）
        if (diffName === '困难' && Math.random() < 0.25) {
            const others = skills.filter(s => s !== skill);
            if (others.length > 0) {
                const second = others[Math.floor(Math.random() * others.length)];
                this.scene.time.delayedCall(600, () => { if (this.alive) this[second](); });
                this.scene.showCenterText('⚠ BOSS 组合技！', '#ff6644', 1000);
            }
        }
        // v5：地狱 隐藏阶段4 组合技（30% 概率三连击 + 隐藏技 'hellCombo'）
        if (diffName === '地狱' && Math.random() < 0.35) {
            const others = skills.filter(s => s !== skill);
            if (others.length >= 2) {
                const second = others[Math.floor(Math.random() * others.length)];
                const third = others.filter(s => s !== second)[Math.floor(Math.random() * (others.length - 1))];
                this.scene.time.delayedCall(500, () => { if (this.alive) this[second](); });
                this.scene.time.delayedCall(1100, () => { if (this.alive) this[third](); });
                this.scene.showCenterText('☠ 地狱三连击！', '#ff0044', 1400);
                this.scene.cameras.main.shake(300, 0.012);
            }
        }
    }
    cleave() {
        const radius = this.phase === 3 ? 200 : (this.phase === 2 ? 160 : 120);
        // v5：招式预告（红圈 1.2 秒后引爆）
        this.showTelegraph(this.screenX(), this.screenY(), radius, 'circle', 1200, () => {
            this.scene.particles.explosion(this.screenX(), this.screenY(), radius, this.config.color);
            const d = Phaser.Math.Distance.Between(this.worldX, this.worldY,
                this.scene.playerWorldX, this.scene.playerWorldY);
            if (d < radius) this.scene.playerTakeDamage(this.damage * 0.9);
        });
    }
    // v5：招式预告通用方法
    showTelegraph(x, y, size, shape, delay, callback) {
        const telegraph = this.scene.add.container(x, y).setDepth(150);
        let indicator;
        if (shape === 'circle') {
            indicator = this.scene.add.circle(0, 0, size, 0xff0000, 0.25);
            indicator.setStrokeStyle(3, 0xff0000, 0.9);
        } else if (shape === 'line') {
            indicator = this.scene.add.rectangle(0, 0, size, 16, 0xff0000, 0.3);
            indicator.setStrokeStyle(2, 0xff0000, 0.9);
        } else {
            indicator = this.scene.add.circle(0, 0, size, 0xff0000, 0.25);
        }
        telegraph.add(indicator);
        // 闪烁动画
        this.scene.tweens.add({
            targets: indicator, alpha: { from: 0.25, to: 0.55 },
            duration: 200, yoyo: true, repeat: Math.floor(delay / 400)
        });
        this.scene.time.delayedCall(delay, () => {
            telegraph.destroy();
            if (callback) callback();
        });
    }
    spawnMinions() {
        const count = this.phase === 3 ? 6 : (this.phase === 2 ? 4 : 3);
        for (let i = 0; i < count; i++) {
            const a = Math.random() * Math.PI * 2, d = 120 + Math.random() * 60;
            const types = ['slime', 'skeleton', 'bat'];
            const t = types[Math.floor(Math.random() * types.length)];
            const en = new Enemy(this.scene, t);
            en.spawn(this.worldX + Math.cos(a) * d, this.worldY + Math.sin(a) * d, 0.9);
            this.scene.enemyManager.enemies.push(en);
        }
    }
    chargeAttack() {
        const px = this.scene.playerWorldX, py = this.scene.playerWorldY;
        const dx = px - this.worldX, dy = py - this.worldY;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d > 0) { this.worldX += (dx / d) * 180; this.worldY += (dy / d) * 180; }
        this.currentSpeed = this.speed * 2;
    }
    aoeAttack() {
        const radius = this.phase === 3 ? 220 : (this.phase === 2 ? 180 : 140);
        this.showTelegraph(this.screenX(), this.screenY(), radius, 'circle', 1000, () => {
            this.scene.particles.explosion(this.screenX(), this.screenY(), radius, this.config.color);
            const d = Phaser.Math.Distance.Between(this.worldX, this.worldY,
                this.scene.playerWorldX, this.scene.playerWorldY);
            if (d < radius) this.scene.playerTakeDamage(this.damage * 0.9);
        });
    }
    laserBeam() {
        const a = Math.atan2(this.scene.playerWorldY - this.worldY,
            this.scene.playerWorldX - this.worldX);
        // v5：激光线条预告
        const telegraphEndX = this.screenX() + Math.cos(a) * 600;
        const telegraphEndY = this.screenY() + Math.sin(a) * 600;
        const midX = (this.screenX() + telegraphEndX) / 2;
        const midY = (this.screenY() + telegraphEndY) / 2;
        const lineLen = Phaser.Math.Distance.Between(this.screenX(), this.screenY(), telegraphEndX, telegraphEndY);
        const lineShape = this.scene.add.rectangle(midX, midY, lineLen, 14, 0xff0000, 0.3);
        lineShape.rotation = a;
        lineShape.setStrokeStyle(2, 0xff0000, 0.9).setDepth(150);
        this.scene.tweens.add({
            targets: lineShape, alpha: { from: 0.3, to: 0.6 },
            duration: 150, yoyo: true, repeat: 5
        });
        this.scene.time.delayedCall(900, () => {
            lineShape.destroy();
            this.scene.particles.lineBeam(this.screenX(), this.screenY(),
                telegraphEndX, telegraphEndY, this.config.glowColor, 20);
            const d = Phaser.Math.Distance.Between(this.worldX, this.worldY,
                this.scene.playerWorldX, this.scene.playerWorldY);
            if (d < 600) this.scene.playerTakeDamage(this.damage * 0.7);
        });
    }
    enrage() { this.speed *= 1.2; this.damage = Math.floor(this.damage * 1.15); }
    summonGoblins() { this.spawnMinions(); }
    throwBone() {
        for (let i = 0; i < (this.phase === 3 ? 8 : 5); i++) {
            const a = (i / 5) * Math.PI;
            this.scene.projectiles.push(new Projectile(
                this.scene, this.worldX, this.worldY,
                this.worldX + Math.cos(a) * 400, this.worldY + Math.sin(a) * 400,
                this.damage * 0.6, 'bone', { speed: 320, color: 0xd4a574 }));
        }
    }
    summonSkeletons() { this.spawnMinions(); }
    deathBloom() {
        for (let i = 0; i < 12; i++) {
            const a = (i / 12) * Math.PI * 2;
            this.scene.projectiles.push(new Projectile(
                this.scene, this.worldX, this.worldY,
                this.worldX + Math.cos(a) * 300, this.worldY + Math.sin(a) * 300,
                this.damage * 0.7, 'bone', { speed: 380, color: 0xa0a0a0 }));
        }
    }
    flyAttack() { this.worldY -= 100; this.currentSpeed = this.speed * 1.5; }
    fireBreath() {
        const a = Math.atan2(this.scene.playerWorldY - this.worldY,
            this.scene.playerWorldX - this.worldX);
        this.scene.particles.lineBeam(this.screenX(), this.screenY(),
            this.screenX() + Math.cos(a) * 400, this.screenY() + Math.sin(a) * 400, 0xff4400, 35);
        for (let i = 0; i < 6; i++) {
            this.scene.projectiles.push(new Projectile(
                this.scene, this.worldX, this.worldY,
                this.worldX + Math.cos(a) * 300, this.worldY + Math.sin(a) * 300,
                this.damage * 0.5, 'meteor', { speed: 250, color: 0xff4400, size: 8 }));
        }
    }
    tornado() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const a = Math.random() * Math.PI * 2, d = 100 + Math.random() * 200;
                this.scene.particles.explosion(GW / 2 + Math.cos(a) * d,
                    GH / 2 + Math.sin(a) * d, 100, 0x88ff88);
                const dd = Phaser.Math.Distance.Between(
                    this.scene.playerWorldX + Math.cos(a) * d,
                    this.scene.playerWorldY + Math.sin(a) * d,
                    this.scene.playerWorldX, this.scene.playerWorldY);
                if (dd < 100) this.scene.playerTakeDamage(this.damage * 0.4);
            }, i * 200);
        }
    }
    meteorShower() {
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const a = Math.random() * Math.PI * 2, r = Math.random() * 350;
                this.scene.projectiles.push(new Projectile(
                    this.scene, this.worldX, this.worldY,
                    this.scene.playerWorldX + Math.cos(a) * r,
                    this.scene.playerWorldY + Math.sin(a) * r,
                    this.damage * 0.6, 'meteor', { speed: 600, color: 0xff4400, size: 12 }));
            }, i * 100);
        }
    }
    darkSlash() {
        const a = Math.atan2(this.scene.playerWorldY - this.worldY,
            this.scene.playerWorldX - this.worldX);
        this.scene.particles.slash(this.screenX(), this.screenY(), a, 0x880044, 250, Math.PI / 1.5);
        const d = Phaser.Math.Distance.Between(this.worldX, this.worldY,
            this.scene.playerWorldX, this.scene.playerWorldY);
        if (d < 250) this.scene.playerTakeDamage(this.damage * 1.2);
    }
    hellfire() {
        for (let i = 0; i < 8; i++) {
            const a = (i / 8) * Math.PI * 2;
            this.scene.projectiles.push(new Projectile(
                this.scene, this.worldX, this.worldY,
                this.worldX + Math.cos(a) * 200, this.worldY + Math.sin(a) * 200,
                this.damage * 0.5, 'fire', { speed: 220, color: 0xff0000, size: 10 }));
        }
    }
    summonDemon() { this.spawnMinions(); }
    timeSlow() {
        this.scene.runtime.slowTimer = 3000;
        this.scene.showCenterText('时间减缓！', '#44ffff');
    }
    timeStop() {
        if (this.scene.runtime.controlImmuneTimer > 0) return;
        this.scene.runtime.stunTimer = 350;
        this.scene.runtime.controlImmuneTimer = 4000;
        this.scene.showCenterText('时间停止！', '#ff44ff');
    }
    teleportStrike() {
        this.worldX = this.scene.playerWorldX + (Math.random() - 0.5) * 200;
        this.worldY = this.scene.playerWorldY + (Math.random() - 0.5) * 200;
        this.scene.particles.spawnEffect(this.screenX(), this.screenY(), 0x88ffff);
    }
    summonShadow() { this.spawnMinions(); }
    fireWave() {
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2;
            this.scene.projectiles.push(new Projectile(
                this.scene, this.worldX, this.worldY,
                this.worldX + Math.cos(a) * 400, this.worldY + Math.sin(a) * 400,
                this.damage * 0.5, 'fire', { speed: 280, color: 0xff4400, size: 10 }));
        }
    }
    iceAge() {
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2;
            this.scene.projectiles.push(new Projectile(
                this.scene, this.worldX, this.worldY,
                this.worldX + Math.cos(a) * 500, this.worldY + Math.sin(a) * 500,
                this.damage * 0.5, 'frost', { speed: 350, color: 0x00ccff, size: 10, freeze: true }));
        }
    }
    lightningStorm() {
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const a = Math.random() * Math.PI * 2, r = Math.random() * 300;
                this.scene.particles.explosion(GW / 2 + Math.cos(a) * r,
                    GH / 2 + Math.sin(a) * r, 60, 0xffff00);
                const dd = Phaser.Math.Distance.Between(
                    this.scene.playerWorldX + Math.cos(a) * r,
                    this.scene.playerWorldY + Math.sin(a) * r,
                    this.scene.playerWorldX, this.scene.playerWorldY);
                if (dd < 60) this.scene.playerTakeDamage(this.damage * 0.6);
            }, i * 150);
        }
    }
    earthquake() {
        for (let i = 0; i < 12; i++) {
            const a = (i / 12) * Math.PI * 2;
            this.scene.particles.explosion(this.screenX() + Math.cos(a) * 200,
                this.screenY() + Math.sin(a) * 200, 80, 0x8B4513);
        }
        const d = Phaser.Math.Distance.Between(this.worldX, this.worldY,
            this.scene.playerWorldX, this.scene.playerWorldY);
        if (d < 250) this.scene.playerTakeDamage(this.damage * 1.0);
    }
    illusion() {
        for (let i = 0; i < 3; i++) {
            const a = Math.random() * Math.PI * 2;
            const en = new Enemy(this.scene, 'slime');
            en.spawn(this.worldX + Math.cos(a) * 60, this.worldY + Math.sin(a) * 60, 0.5);
            this.scene.enemyManager.enemies.push(en);
        }
    }
    mindControl() {
        if (this.scene.runtime.controlImmuneTimer > 0) return;
        this.scene.showCenterText('混乱！', '#ff00ff');
        this.scene.runtime.stunTimer = 250;
        this.scene.runtime.controlImmuneTimer = 4000;
    }
    voidRift() {
        for (let i = 0; i < 10; i++) {
            const a = Math.random() * Math.PI * 2, r = 50 + Math.random() * 250;
            this.scene.particles.explosion(GW / 2 + Math.cos(a) * r,
                GH / 2 + Math.sin(a) * r, 70, 0x440088);
        }
    }
    summonClones() { this.illusion(); }
    shadowStorm() {
        for (let i = 0; i < 20; i++) {
            const a = (i / 20) * Math.PI * 2;
            this.scene.projectiles.push(new Projectile(
                this.scene, this.worldX, this.worldY,
                this.worldX + Math.cos(a) * 500, this.worldY + Math.sin(a) * 500,
                this.damage * 0.6, 'shadow', { speed: 320, color: 0x8800ff, size: 10 }));
        }
    }
    deathRay() {
        const a = Math.atan2(this.scene.playerWorldY - this.worldY,
            this.scene.playerWorldX - this.worldX);
        this.scene.particles.lineBeam(this.screenX(), this.screenY(),
            this.screenX() + Math.cos(a) * 800, this.screenY() + Math.sin(a) * 800, 0xff00ff, 40);
        const d = Phaser.Math.Distance.Between(this.worldX, this.worldY,
            this.scene.playerWorldX, this.scene.playerWorldY);
        if (d < 800) this.scene.playerTakeDamage(this.damage * 1.5);
    }
    voidPrison() {
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2;
            this.scene.projectiles.push(new Projectile(
                this.scene, this.worldX, this.worldY,
                this.worldX + Math.cos(a) * 250, this.worldY + Math.sin(a) * 250,
                this.damage * 0.7, 'shadow', { speed: 200, color: 0x440088, size: 15 }));
        }
    }
    summonAllies() { this.spawnMinions(); }
    ultimate() {
        for (let i = 0; i < 30; i++) {
            setTimeout(() => {
                const a = Math.random() * Math.PI * 2, r = Math.random() * 400;
                this.scene.projectiles.push(new Projectile(
                    this.scene, this.worldX, this.worldY,
                    this.scene.playerWorldX + Math.cos(a) * r,
                    this.scene.playerWorldY + Math.sin(a) * r,
                    this.damage * 0.8, 'meteor', { speed: 700, color: 0xff00ff, size: 14 }));
            }, i * 80);
        }
        this.scene.cameras.main.shake(2000, 0.015);
        this.scene.showCenterText('湮灭！', '#ff0000');
    }
    checkPlayerCollision() {
        if (this.attackCooldown > 0) return;
        const d = Phaser.Math.Distance.Between(this.worldX, this.worldY,
            this.scene.playerWorldX, this.scene.playerWorldY);
        if (d < this.hitRadius + 25) {
            this.scene.playerTakeDamage(this.damage);
            this.attackCooldown = 1200;
        }
    }
    updateSpritePosition() {
        this.container.x = this.screenX(); this.container.y = this.screenY();
    }
    takeDamage(amount, isCrit = false, armorPierce = 0) {
        if (!this.alive) return false;
        this.hp -= amount; this.updateHpBar();
        this.scene.showDamageNumber(this.screenX(), this.screenY() - 50, amount, isCrit);
        if (isCrit) this.scene.particles.critEffect(this.screenX(), this.screenY() - 40);
        // 骷髅领主：HP低于50%/25%时分裂（仅本体，克隆体/幻影不再触发，避免无限分裂）
        if (this.config.id === 'sl' && this.hp > 0 && !this._isClone && !this._isPhantom) {
            if (this.hp <= this.maxHp * 0.5 && !this._split1) {
                this._split1 = true;
                this.splitInto(2, 0.5);
            }
            if (this.hp <= this.maxHp * 0.25 && !this._split2) {
                this._split2 = true;
                this.splitInto(4, 0.25);
            }
        }
        // 暗影神：HP低于75%/50%/25%时召唤前序BOSS幻影（仅本体）
        if (this.config.id === 'sg' && this.hp > 0 && !this._isClone && !this._isPhantom) {
            if (this.hp <= this.maxHp * 0.75 && !this._phantom1) {
                this._phantom1 = true;
                this.summonPhantomBoss('gk');
            }
            if (this.hp <= this.maxHp * 0.5 && !this._phantom2) {
                this._phantom2 = true;
                this.summonPhantomBoss('ts');
            }
            if (this.hp <= this.maxHp * 0.25 && !this._phantom3) {
                this._phantom3 = true;
                this.summonPhantomBoss('el');
            }
        }
        this.scene.tweens.add({
            targets: this.container,
            x: this.screenX() + (Math.random() - 0.5) * 8,
            y: this.screenY() + (Math.random() - 0.5) * 8,
            duration: 50, yoyo: true, ease: 'Cubic.easeOut'
        });
        // v5：多血条系统——打完一条进入下一条
        if (this.hp <= 0) {
            if (this.currentBar < this.totalBars) {
                this.currentBar++;
                this.hp = this.perBarHp;
                this.maxHp = this.perBarHp;
                // 阶段升级（每 1/3 血条数升级一次）
                const newPhase = Math.min(3, Math.ceil((this.currentBar / this.totalBars) * 3));
                if (newPhase > this.phase) {
                    this.phase = newPhase;
                    this.speed *= 1.15;
                    this.specialCooldown = Math.max(1200, this.specialCooldown * 0.85);
                }
                // 破段特效
                this.scene.cameras.main.flash(300, 255, 100, 50);
                this.scene.cameras.main.shake(400, 0.012);
                this.scene.particles.explosion(this.screenX(), this.screenY(), 180, this.config.glowColor);
                this.showPhaseText(`血条 ${this.currentBar}/${this.totalBars}`, '#ffaa00');
                // 破段时召唤小怪（阶段2+）
                if (this.phase >= 2) this.spawnMinions();
            } else {
                this.die();
                return true;
            }
        }
        return false;
    }
    splitInto(count, hpRatio) {
        for (let i = 0; i < count; i++) {
            const cloneCfg = Object.assign({}, this.config, { size: this.config.size * 0.7 });
            const clone = new Boss(this.scene, this.config.id);
            clone.config = cloneCfg;
            clone.spawn(0.5, 1);
            clone.hp = Math.floor(this.maxHp * hpRatio);
            clone.maxHp = clone.hp;
            clone._isClone = true;
            const angle = (i / count) * Math.PI * 2;
            clone.worldX = this.worldX + Math.cos(angle) * 60;
            clone.worldY = this.worldY + Math.sin(angle) * 60;
            this.scene.bossManager.phantoms = this.scene.bossManager.phantoms || [];
            this.scene.bossManager.phantoms.push(clone);
        }
        this.scene.showCenterText('分裂！', '#ff4444');
    }
    summonPhantomBoss(bossId) {
        const origConfig = BossConfigs.find(b => b.id === bossId);
        if (!origConfig) return;
        const config = Object.assign({}, origConfig, { size: origConfig.size * 0.7 });
        const phantom = new Boss(this.scene, config.id);
        phantom.config = config;
        phantom.spawn(0.5, 1);
        phantom.hp = Math.floor(origConfig.hp * 0.5);
        phantom.maxHp = phantom.hp;
        phantom._isPhantom = true;
        const angle = Math.random() * Math.PI * 2;
        phantom.worldX = this.worldX + Math.cos(angle) * 150;
        phantom.worldY = this.worldY + Math.sin(angle) * 150;
        this.scene.bossManager.phantoms = this.scene.bossManager.phantoms || [];
        this.scene.bossManager.phantoms.push(phantom);
        this.scene.showCenterText(`${config.name}的幻影出现！`, '#aa44ff');
    }
    applySlow(d, amount = 0.4) {
        this.slowed = Math.max(this.slowed || 0, d);
        this.slowAmount = Math.max(this.slowAmount || 0, amount);
    }
    applyBurn(dmg, d) {
        this.burning = Math.max(this.burning || 0, d);
        this.burnDamage = Math.max(this.burnDamage || 0, dmg);
    }
    applyStun(d) { this.stunned = Math.max(this.stunned || 0, d); }
    applyFreeze(d) { this.frozen = Math.max(this.frozen || 0, d); }
    applyBleed(dmg, d) {
        this.bleeding = Math.max(this.bleeding || 0, d);
        this.bleedDamage = Math.max(this.bleedDamage || 0, dmg);
    }
    updateHpBar() {
        if (!this.hpBar) return;
        const ratio = Math.max(0, this.hp / this.maxHp);
        this.hpBar.scaleX = ratio; this.hpBarGlow.scaleX = ratio;
        if (ratio < 0.3) this.hpBar.fillColor = 0xff0000;
        else if (ratio < 0.6) this.hpBar.fillColor = 0xff8800;
        // v5：分段指示器（■■■□□□）
        if (this.barSegmentsText && this.totalBars) {
            let seg = '';
            for (let i = 1; i <= this.totalBars; i++) {
                seg += i < this.currentBar ? '■' : (i === this.currentBar ? '◆' : '□');
            }
            this.barSegmentsText.setText(`${seg}  ${this.currentBar}/${this.totalBars}`);
        }
    }
    die() {
        this.alive = false;
        // 清除深渊魔王的减速效果
        if (this.config.id === 'ab') {
            this.scene.runtime.slowEffect = 0;
            this.scene.runtime.slowTimer = 0;
        }
        const cfg = this.config;
        // 分裂体/幻影：简化死亡，不触发主BOSS奖励与剧情流程
        if (this._isClone || this._isPhantom) {
            this.scene.runtime.addGold(Math.floor(cfg.gold * 0.3));
            this.scene.runtime.addExp(Math.floor(cfg.exp * 0.3));
            this.scene.particles.explosion(this.screenX(), this.screenY(), 60, cfg.glowColor);
            this.scene.tweens.add({
                targets: this.container,
                alpha: 0, scale: 0, duration: 500, ease: 'Cubic.easeIn',
                onComplete: () => { if (this.container) this.container.destroy(); }
            });
            if (this.hpBar) this.hpBar.destroy();
            if (this.hpBarBg) this.hpBarBg.destroy();
            if (this.hpBarGlow) this.hpBarGlow.destroy();
            if (this.nameText) this.nameText.destroy();
            this.hpBar = null; this.hpBarBg = null; this.hpBarGlow = null; this.nameText = null;
            return;
        }
        this.scene.runtime.bossKills++;
        this.scene.runtime.addGold(cfg.gold);
        const lv = this.scene.runtime.addExp(cfg.exp);
        this.scene.particles.bossDefeat(this.screenX(), this.screenY());
        const lootPool = ['health', 'health', 'exp_big', 'exp_big', 'element_shard', 'element_shard', 'arcane_dust', 'element_crystal'];
        for (let i = 0; i < 8; i++) {
            const a = Math.random() * Math.PI * 2, d = 60 + Math.random() * 80;
            this.scene.items.push(new PickupItem(this.scene,
                lootPool[Math.floor(Math.random() * lootPool.length)],
                this.worldX + Math.cos(a) * d, this.worldY + Math.sin(a) * d));
        }
        this.scene.items.push(new PickupItem(this.scene, 'element_crystal', this.worldX, this.worldY));
        if (lv) this.scene.onLevelUp();
        if (this.bossLevel > this.scene.saveData.highestBoss)
            this.scene.saveData.highestBoss = this.bossLevel;
        this.scene.time.delayedCall(1500, () => { this.scene.showBossReward(); });
        // BOSS击杀后显示剧情对话
        const chapter = STORY_CHAPTERS[this.scene.runtime.currentRegion];
        if (chapter) {
            const npcKey = Object.keys(chapter.npcDialogues)[0];
            const dialogues = chapter.npcDialogues[npcKey];
            if (dialogues.afterBoss) {
                this.scene.time.delayedCall(2000, () => {
                    this.scene.showStoryDialogue(dialogues.afterBoss);
                });
            }
        }
        this.scene.tweens.add({
            targets: this.container,
            alpha: 0, scale: 0, duration: 800, ease: 'Cubic.easeIn',
            onComplete: () => {
                if (this.container) this.container.destroy();
            }
        });
        if (this.hpBar) this.hpBar.destroy();
        if (this.hpBarBg) this.hpBarBg.destroy();
        if (this.hpBarGlow) this.hpBarGlow.destroy();
        if (this.nameText) this.nameText.destroy();
        this.hpBar = null; this.hpBarBg = null; this.hpBarGlow = null; this.nameText = null;
    }
}

// ==================== 技能工厂 ====================
const SkillFactory = {
    create(weaponType) {
        const w = WeaponFactory.configs[weaponType] || WeaponFactory.configs.sword;
        return new Skill(new Weapon(w));
    }
};

// ==================== 运行时数据 ====================
class RuntimeData {
    constructor() {
        this.hp = 100;
        this.maxHp = 100;
        this.level = 1;
        this.exp = 0;
        this.expToNext = 60;
        this.gold = 0;
        this.surviveTime = 0;
        this.killCount = 0;
        this.bossKills = 0;
        this.weaponType = 'sword';
        this.weapon = null;
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
        this.slowTimer = 0;
        this.stunTimer = 0;
        this.controlImmuneTimer = 0;
        this.currentChapter = -1;
        this.currentRegion = 0; // 当前区域ID
        this.regionCleared = [false, false, false, false, false]; // 区域是否已通关
        this.questProgress = 0; // 当前任务进度
        this.questCompleted = false; // 当前任务是否完成
        this.storyFlags = {}; // 剧情标志
        this.difficulty = 1.0;
        this.difficultyName = '普通';
        this.gameSpeed = 1.0;
        this.dailyChallenge = false;
        this.dailySeed = 0;
        this.dailyModifiers = null;
        this.hpMult = 1;
        this.dmgMult = 1;
        this._cachedSpec = null;
        this._specDirty = true;
        this.bonusStats = {};
        this.elements = { shard: 0, dust: 0, crystal: 0 };
        this.weaponPromotions = { sword: 0, axe: 0, staff: 0, bow: 0, wand: 0 };
        this.secondaryWeapon = null; // 副武器类型，null表示无副武器
        this.weaponSkills = {}; // 每武器的技能槽选择 { sword: [null, null, null], ... }
        this.fusedWeapon = null; // 合成武器
        Specializations.forEach(s => this.specLevels[s.id] = 0);
    }

    get spec() {
        if (this._specDirty || !this._cachedSpec) {
            const s = {};
            Specializations.forEach(sp => {
                const lvl = this.specLevels[sp.id] || 0;
                if (sp.stat === 'crit_aspd') {
                    s.crit = (s.crit || 0) + sp.value * lvl;
                    s.aspd = (s.aspd || 0) + sp.value * 1.5 * lvl;
                    s.crit_aspd = (s.crit_aspd || 0) + sp.value * lvl;
                } else {
                    s[sp.stat] = (s[sp.stat] || 0) + sp.value * lvl;
                }
            });
            for (const k in this.bonusStats) {
                s[k] = (s[k] || 0) + this.bonusStats[k];
            }
            this._cachedSpec = s;
            this._specDirty = false;
        }
        return this._cachedSpec;
    }

    addBonus(stat, value) {
        this.bonusStats[stat] = (this.bonusStats[stat] || 0) + value;
        this._specDirty = true;
    }

    markSpecDirty() { this._specDirty = true; }

    addExp(amount) {
        const sp = this.spec;
        // v5 智者加点：每级 +10% 经验获取
        const sageBonus = this._wisdomLv ? 0.10 * this._wisdomLv : 0;
        const actual = Math.floor(amount * (1 + (sp.exp || 0) + sageBonus));
        this.exp += actual;
        let leveled = false;
        while (this.exp >= this.expToNext) {
            this.exp -= this.expToNext;
            this.level++;
            this.expToNext = Math.floor(80 * Math.pow(1.45, this.level - 1));
            leveled = true;
        }
        return leveled;
    }

    addGold(amount) {
        const sp = this.spec;
        const actual = Math.floor(amount * (1 + (sp.gold || 0)));
        this.gold += actual;
        return actual;
    }

    takeDamage(amount) {
        const sp = this.spec;
        let dmg = amount * (1 - (sp.armor || 0) * 0.15);
        // v5 铁壁加点：每级 8% 减伤
        if (this._vitalityLv) dmg *= (1 - 0.08 * this._vitalityLv);
        dmg = Math.max(1, Math.floor(dmg));
        if (this.shield > 0) {
            const absorb = Math.min(this.shield, dmg);
            this.shield -= absorb;
            dmg -= absorb;
        }
        this.hp -= dmg;
        // v5 不朽加点：HP 归零时复活（每场一次，每级 +1 次数）
        if (this.hp <= 0 && this._immortalLv && (this._reviveCharges || 0) > 0) {
            this._reviveCharges--;
            this.hp = Math.floor(this.maxHp * (0.3 + 0.1 * this._immortalLv));
            this.shield = (this.shield || 0) + 80;
            this.invincibleTimer = Math.max(this.invincibleTimer || 0, 2000);
            if (this._scene) {
                this._scene.cameras.main.flash(400, 255, 240, 200);
                this._scene.particles.explosion(GW / 2, GH / 2, 50, 0xffcc66);
                this._scene.showCenterText('✦ 不朽复活 ✦', '#ffcc66', 1500);
                this._scene.audio && this._scene.audio.play('levelup');
            }
            return 0;
        }
        return dmg;
    }

    heal(amount) {
        const before = this.hp;
        this.hp = Math.min(this.maxHp, this.hp + amount);
        return this.hp - before;
    }

    updateMaxHp() {
        const sp = this.spec;
        let newMax = (100 + (sp.maxHp || 0) * 18) * (this.hpMult || 1);
        // 体魄加点：每级 +15% 最大生命
        if (this._vitalityLv) newMax *= (1 + 0.15 * this._vitalityLv);
        const diff = newMax - this.maxHp;
        this.maxHp = newMax;
        if (diff > 0) this.hp += diff;
        // v5 铁壁加点：每级 +25 永久护盾上限（开局获得）
        if (this._vitalityLv && this._ironwallShieldApplied !== this._vitalityLv) {
            const add = 25 * this._vitalityLv;
            this.shield = (this.shield || 0) + add - (this._ironwallShieldApplied ? 25 * this._ironwallShieldApplied : 0);
            this._ironwallShieldApplied = this._vitalityLv;
        }
    }

    addCombo() {
        this.combo++;
        this.comboTimer = 2500;
        if (this.combo > this.maxCombo) this.maxCombo = this.combo;
        if (this.combo >= 20) this.comboMultiplier = 2.0;
        else if (this.combo >= 10) this.comboMultiplier = 1.5;
        else if (this.combo >= 5) this.comboMultiplier = 1.25;
        else this.comboMultiplier = 1;
        if (this.combo === 15) this.rageMode = true;
    }
    resetCombo() {
        this.combo = 0;
        this.comboMultiplier = 1;
    }
}

// ==================== 随从系统 ====================
class Minion {
    constructor(scene, type) {
        this.scene = scene; this.type = type;
        this.worldX = 0; this.worldY = 0;
        this.container = null; this.lastAttack = 0;
        this.damage = 10; this.orbitAngle = Math.random() * Math.PI * 2;
        this.orbitSpeed = 0.002; this.orbitRadius = 65;
        this.targetEnemy = null;
    }
    get config() {
        const configs = {
            light: { name: '光明精灵', dmg: 15, interval: 1000, color: 0xffee88, glowColor: 0xffffaa, size: 18 },
            shadow: { name: '暗影战士', dmg: 25, interval: 1800, color: 0x6644aa, glowColor: 0x8866cc, size: 24 },
            fire: { name: '火焰精灵', dmg: 20, interval: 1200, color: 0xff6622, glowColor: 0xffaa44, size: 20 },
            ice: { name: '寒冰巫灵', dmg: 18, interval: 1300, color: 0x88ddff, glowColor: 0xaaffff, size: 22 },
            lightning: { name: '闪电元素', dmg: 22, interval: 1400, color: 0xffee44, glowColor: 0xffffaa, size: 21 }
        };
        return configs[this.type] || configs.light;
    }
    spawn(x, y) {
        this.worldX = x; this.worldY = y;
        const cfg = this.config;
        const sx = this.screenX(), sy = this.screenY();
        this.container = this.scene.add.container(sx, sy);
        this.container.setDepth(70);
        const glow = this.scene.add.circle(0, 0, cfg.size * 1.8, cfg.glowColor, 0.3);
        const glow2 = this.scene.add.circle(0, 0, cfg.size * 1.3, cfg.glowColor, 0.5);
        const body = this.scene.add.circle(0, 0, cfg.size, cfg.color);
        const core = this.scene.add.circle(0, 0, cfg.size * 0.5, 0xffffff, 0.8);
        this.container.add([glow, glow2, body, core]);
        this.minionGlow = glow;
    }
    screenX() { return this.worldX - this.scene.playerWorldX + GW / 2; }
    screenY() { return this.worldY - this.scene.playerWorldY + GH / 2; }
    update(time, delta) {
        if (!this.container) return;
        const cfg = this.config;
        this.orbitAngle += 0.002;
        this.worldX = this.scene.playerWorldX + Math.cos(this.orbitAngle) * this.orbitRadius;
        this.worldY = this.scene.playerWorldY + Math.sin(this.orbitAngle) * this.orbitRadius;
        this.container.x = this.screenX();
        this.container.y = this.screenY();
        const pulse = 1 + Math.sin(time * 0.005) * 0.15;
        this.minionGlow.scale = pulse;
        if (time - this.lastAttack > cfg.interval) {
            this.lastAttack = time;
            this.performAttack(time);
        }
    }
    performAttack(time) {
        const cfg = this.config;
        let nearest = null, nd = 350;
        for (const e of this.scene.enemyManager.enemies) {
            if (!e.alive) continue;
            const d = Phaser.Math.Distance.Between(this.worldX, this.worldY, e.worldX, e.worldY);
            if (d < nd) { nd = d; nearest = e; }
        }
        if (!nearest) return;
        const dmg = Math.floor(cfg.dmg * (1 + (this.scene.runtime.spec.minionDmg || 0) * 0.5));
        nearest.takeDamage(dmg, false);
        this.scene.particles.lineBeam(this.screenX(), this.screenY(),
            nearest.worldX - this.scene.playerWorldX + GW / 2,
            nearest.worldY - this.scene.playerWorldY + GH / 2, cfg.color, 4);
    }
    destroy() {
        if (this.container) { this.container.destroy(); this.container = null; }
    }
}

// ==================== 成就 ====================
const Achievements = [
    { id: 'first_blood', name: '初战告捷', icon: '🗡', desc: '击杀第一个敌人' },
    { id: 'killer_10', name: '小试牛刀', icon: '⚔', desc: '击杀10个敌人' },
    { id: 'killer_50', name: '杀戮者', icon: '💀', desc: '击杀50个敌人' },
    { id: 'killer_100', name: '百人斩', icon: '☠', desc: '击杀100个敌人' },
    { id: 'killer_500', name: '千人斩', icon: '🌪', desc: '击杀500个敌人' },
    { id: 'survive_60', name: '坚持者', icon: '⏱', desc: '存活60秒' },
    { id: 'survive_180', name: '生存大师', icon: '🏆', desc: '存活180秒' },
    { id: 'survive_300', name: '不朽传说', icon: '👑', desc: '存活300秒' },
    { id: 'survive_600', name: '永恒', icon: '⏳', desc: '存活10分钟' },
    { id: 'boss_1', name: '屠龙勇士', icon: '🐉', desc: '击败第一个Boss' },
    { id: 'boss_3', name: 'Boss杀手', icon: '💎', desc: '击败3个Boss' },
    { id: 'boss_5', name: 'Boss终结者', icon: '⚡', desc: '击败5个Boss' },
    { id: 'level_5', name: '成长中', icon: '⭐', desc: '达到5级' },
    { id: 'level_10', name: '强者', icon: '🌟', desc: '达到10级' },
    { id: 'level_15', name: '传说', icon: '✨', desc: '达到15级' },
    { id: 'level_25', name: '神话', icon: '🌠', desc: '达到25级' },
    { id: 'combo_10', name: '连击高手', icon: '🔥', desc: '达成10连击' },
    { id: 'combo_20', name: '连击大师', icon: '💥', desc: '达成20连击' },
    { id: 'combo_30', name: '连击之神', icon: '⚡', desc: '达成30连击' },
    { id: 'gold_100', name: '小富翁', icon: '💰', desc: '累计获得100金币' },
    { id: 'gold_500', name: '大富翁', icon: '💎', desc: '累计获得500金币' },
    { id: 'gold_2000', name: '富可敌国', icon: '👑', desc: '累计获得2000金币' },
    { id: 'ch_1', name: '剧情：死亡深渊', icon: '💀', desc: '进入第一章' },
    { id: 'ch_3', name: '剧情：深渊之门', icon: '🔥', desc: '进入第三章' },
    { id: 'ch_4', name: '剧情：终末之战', icon: '👁', desc: '进入终章' },
    { id: 'merchant', name: '商人挚友', icon: '🧙', desc: '遇见第一个神秘商人' },
    { id: 'weapon_master', name: '武器大师', icon: '⚔', desc: '将一把武器升到10级' },
    { id: 'rage_user', name: '狂暴战士', icon: '🔥', desc: '触发狂暴模式' },
    { id: 'shield_user', name: '幸存者', icon: '🛡', desc: '使用应急护盾' },
    { id: 'hell_clear', name: '地狱征服者', icon: '💀', desc: '在「地狱」难度下击败Boss' },
    { id: 'all_weapons', name: '全武器精通', icon: '🏆', desc: '解锁全部5把武器' }
];

class BossManager {
    constructor(scene) {
        this.scene = scene; this.boss = null;
        this.currentBossIndex = 0;
        this.warningActive = false;
        this.bossUI = [];
        this.bossDefeated = false;
        this.betweenBossTime = 90;
    }
    update(gameTime, delta) {
        if (!this.boss && !this.warningActive) {
            const nextBossTime = this.getNextBossTime();
            if (gameTime >= nextBossTime) {
                this.showWarning();
            }
        }
        if (this.boss && this.boss.alive) this.boss.update(delta, gameTime);
        // 更新幻影/分裂体
        if (this.phantoms) {
            for (let i = this.phantoms.length - 1; i >= 0; i--) {
                const p = this.phantoms[i];
                if (p.alive) {
                    p.update(delta, gameTime);
                } else {
                    this.phantoms.splice(i, 1);
                }
            }
        }
    }
    getNextBossTime() {
        if (this.currentBossIndex < BossConfigs.length) {
            return BossConfigs[this.currentBossIndex].time;
        }
        const lastTime = BossConfigs[BossConfigs.length - 1].time;
        const extraCycles = this.currentBossIndex - BossConfigs.length + 1;
        return lastTime + extraCycles * this.betweenBossTime;
    }
    showWarning() {
        this.warningActive = true;
        this.scene.audio.play('bossWarning');
        const cfg = BossConfigs[this.currentBossIndex % BossConfigs.length];
        const bg = this.scene.add.rectangle(0, 0, GW, GH, 0xff0000, 0.0).setOrigin(0).setDepth(290);
        const warning = this.scene.add.text(GW / 2, GH / 2 - 20, '⚠ BOSS 来袭！ ⚠', {
            fontSize: '52px', fontFamily: 'Courier New',
            color: '#ff2244', stroke: '#000', strokeThickness: 6, fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(300);
        const bossName = this.scene.add.text(GW / 2, GH / 2 + 40, cfg.icon + ' ' + cfg.name, {
            fontSize: '28px', fontFamily: 'Courier New',
            color: '#ffaa00', stroke: '#000', strokeThickness: 4, fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(300);
        let flashCount = 0;
        const flashIv = setInterval(() => {
            flashCount++;
            bg.setAlpha(flashCount % 2 === 0 ? 0.15 : 0);
            if (flashCount > 8) clearInterval(flashIv);
        }, 300);
        this.scene.tweens.add({
            targets: [warning, bossName], alpha: { from: 0, to: 1, to: 0, to: 1, to: 0, to: 1 },
            scale: { from: 0.5, to: 1.3, to: 1, to: 1.3, to: 0.9, to: 1 },
            duration: 3000, ease: 'Cubic.easeInOut',
            onComplete: () => {
                warning.destroy(); bossName.destroy(); bg.destroy();
                this.showBossIntro(cfg, () => { this.spawnBoss(); });
            }
        });
        this.scene.cameras.main.shake(3000, 0.008);
    }
    showBossIntro(bossConfig, callback) {
        // 屏幕渐暗
        const fade = this.scene.add.rectangle(0, 0, GW, GH, 0x000000, 0)
            .setOrigin(0, 0).setDepth(2000);
        this.scene.tweens.add({
            targets: fade,
            alpha: 0.7,
            duration: 500,
            onComplete: () => {
                // 显示BOSS信息
                const title = this.scene.add.text(GW / 2, GH / 2 - 60, bossConfig.name, {
                    fontSize: '36px', fill: '#' + bossConfig.color.toString(16).padStart(6, '0'),
                    stroke: '#000000', strokeThickness: 4
                }).setOrigin(0.5).setDepth(2001);
                const desc = this.scene.add.text(GW / 2, GH / 2, bossConfig.desc, {
                    fontSize: '18px', fill: '#cccccc'
                }).setOrigin(0.5).setDepth(2001);
                // BOSS台词
                const quotes = {
                    'gk': '我的金币...都是我的！',
                    'sl': '死亡的军团...永不休止。',
                    'sd': '你...也来挑战天空了吗？',
                    'ab': '深渊...会吞噬一切。',
                    'ts': '时间...在你手中流逝。',
                    'el': '元素...服从于我。',
                    'vp': '我看见了...你的命运。',
                    'sg': '你...终于回来了。'
                };
                const quote = this.scene.add.text(GW / 2, GH / 2 + 40, quotes[bossConfig.id] || '...', {
                    fontSize: '16px', fill: '#ffaa44', fontStyle: 'italic'
                }).setOrigin(0.5).setDepth(2001);
                // 3秒后渐亮，开始战斗
                this.scene.time.delayedCall(3000, () => {
                    this.scene.tweens.add({
                        targets: [fade, title, desc, quote],
                        alpha: 0,
                        duration: 500,
                        onComplete: () => {
                            fade.destroy(); title.destroy(); desc.destroy(); quote.destroy();
                            if (callback) callback();
                        }
                    });
                });
            }
        });
    }
    get alivePhantoms() {
        if (!this.phantoms) return [];
        return this.phantoms.filter(p => p.alive);
    }
    spawnBoss() {
        this.warningActive = false;
        const cfg = BossConfigs[this.currentBossIndex % BossConfigs.length];
        const level = Math.floor(this.currentBossIndex / BossConfigs.length) + 1;
        const baseDiff = 1 + this.scene.runtime.surviveTime / 60 * 0.4;
        const difficulty = baseDiff * this.scene.runtime.difficulty;
        this.boss = new Boss(this.scene, cfg.id);
        this.boss.spawn(difficulty, level);
        this.currentBossIndex++;
    }
    onBossDefeated(gameTime) {
        this.bossDefeated = true;
    }
    clear() {
        this.bossUI.forEach(e => e.destroy());
        this.bossUI = [];
        if (this.boss) {
            if (this.boss.container) this.boss.container.destroy();
            this.boss = null;
        }
        if (this.phantoms) {
            this.phantoms.forEach(p => { if (p.container) p.container.destroy(); });
            this.phantoms = [];
        }
        this.currentBossIndex = 0;
        this.warningActive = false;
        this.bossDefeated = false;
    }
}

// ==================== 主游戏场景 ====================
class GameScene extends Phaser.Scene {
    constructor() { super('Game'); }

    preload() {
        // 程序化生成 8 种 BOSS 像素艺术纹理（无需网络，离线可用，每只 BOSS 剪影唯一）
        this.generateBossTextures();
        // 加载小怪精灵表（CC0/CC-BY，来自 Kenney & Enemy Galore）
        // 6 种 64x64 帧：slime/bat/skeleton/ghost/gargoyle/demon
        ['slime', 'bat', 'skeleton', 'ghost', 'gargoyle', 'demon'].forEach(type => {
            ['idle', 'run', 'attack', 'hit', 'death'].forEach(anim => {
                this.load.spritesheet(`${type}_${anim}`, `assets/sprites/${type}_${anim}.png`, { frameWidth: 64, frameHeight: 64 });
            });
        });
        // archer 用 32x32 帧（Canine 系列尺寸不同）
        ['idle', 'run', 'attack', 'hit', 'death'].forEach(anim => {
            this.load.spritesheet(`archer_${anim}`, `assets/sprites/archer_${anim}.png`, { frameWidth: 32, frameHeight: 32 });
        });
        this.load.on('loaderror', (file) => { console.warn('精灵加载失败:', file.key); });
    }

    // 创建小怪动画（在 create() 中调用一次）
    createEnemyAnimations() {
        if (this._enemyAnimsCreated) return;
        this._enemyAnimsCreated = true;
        const types = ['slime', 'bat', 'skeleton', 'ghost', 'gargoyle', 'demon', 'archer'];
        types.forEach(type => {
            // idle - 循环
            if (this.textures.exists(`${type}_idle`)) {
                this.anims.create({ key: `${type}_idle`, frames: this.anims.generateFrameNumbers(`${type}_idle`), frameRate: 8, repeat: -1 });
            }
            // run - 循环
            if (this.textures.exists(`${type}_run`)) {
                this.anims.create({ key: `${type}_run`, frames: this.anims.generateFrameNumbers(`${type}_run`), frameRate: 10, repeat: -1 });
            }
            // attack - 单次
            if (this.textures.exists(`${type}_attack`)) {
                this.anims.create({ key: `${type}_attack`, frames: this.anims.generateFrameNumbers(`${type}_attack`), frameRate: 12, repeat: 0 });
            }
            // hit - 单次
            if (this.textures.exists(`${type}_hit`)) {
                this.anims.create({ key: `${type}_hit`, frames: this.anims.generateFrameNumbers(`${type}_hit`), frameRate: 12, repeat: 0 });
            }
            // death - 单次
            if (this.textures.exists(`${type}_death`)) {
                this.anims.create({ key: `${type}_death`, frames: this.anims.generateFrameNumbers(`${type}_death`), frameRate: 12, repeat: 0 });
            }
        });
    }

    // 程序化生成 BOSS 像素纹理。用 Canvas API 在 96x96 画布上绘制独特剪影。
    generateBossTextures() {
        const SIZE = 96;
        const PALETTES = {
            gk: { body: 0x4a8a3a, dark: 0x2a5a1f, light: 0x6aaa50, accent: 0xffd700, eye: 0xffcc00, glow: 0xff8800 },
            sl: { body: 0xe8e8d0, dark: 0x888870, light: 0xffffee, accent: 0xaaaa88, eye: 0xff2200, glow: 0xff4422 },
            sd: { body: 0x4a2a6a, dark: 0x2a0a3a, light: 0x6a4a8a, accent: 0x88ff66, eye: 0x66ff44, glow: 0x44cc88 },
            ab: { body: 0xaa2a1a, dark: 0x660a0a, light: 0xcc4a2a, accent: 0x220000, eye: 0xffaa00, glow: 0xff4400 },
            ts: { body: 0x2a4a8a, dark: 0x0a1a4a, light: 0x4a6aaa, accent: 0x88ccff, eye: 0xccffff, glow: 0x66aaff },
            el: { body: 0x6a4a2a, dark: 0x2a1a0a, light: 0x8a6a4a, accent: 0xffffff, eye: 0xffffff, glow: 0xffffff },
            vp: { body: 0x3a1a5a, dark: 0x1a0a2a, light: 0x5a3a7a, accent: 0xaa66ff, eye: 0xff66ff, glow: 0xaa44ff },
            sg: { body: 0x0a0a14, dark: 0x000000, light: 0x2a2a3a, accent: 0xff2200, eye: 0xff4400, glow: 0xff6600 }
        };
        const ctx = (id) => {
            const tex = this.textures.createCanvas('boss_' + id, SIZE, SIZE);
            return tex.getContext();
        };
        const hex = (c) => '#' + c.toString(16).padStart(6, '0');
        const rect = (c, x, y, w, h, color) => { c.fillStyle = hex(color); c.fillRect(x, y, w, h); };
        const circle = (c, x, y, r, color) => { c.fillStyle = hex(color); c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); };
        const px = (c, x, y, color) => rect(c, x, y, 1, 1, color); // 单像素
        const fillAll = (c, color) => { c.fillStyle = hex(color); c.fillRect(0, 0, SIZE, SIZE); };

        // 通用：以像素方块绘制（每个"像素"=3x3 实际像素，32x32 网格）
        const CELL = 3;
        const G = 32;
        const pxg = (c, gx, gy, color) => { if (gx<0||gx>=G||gy<0||gy>=G) return; rect(c, gx*CELL, gy*CELL, CELL, CELL, color); };
        // 在网格上画一条线 (Bresenham 简化版)
        const lineG = (c, x0, y0, x1, y1, color) => {
            const dx = Math.abs(x1-x0), dy = Math.abs(y1-y0);
            const sx = x0<x1?1:-1, sy = y0<y1?1:-1;
            let err = dx-dy, x = x0, y = y0;
            while (true) {
                pxg(c, x, y, color);
                if (x===x1 && y===y1) break;
                const e2 = 2*err;
                if (e2 > -dy) { err -= dy; x += sx; }
                if (e2 < dx) { err += dx; y += sy; }
            }
        };
        // 在网格上画填充圆
        const discG = (c, cx, cy, r, color) => {
            for (let y=-r; y<=r; y++) for (let x=-r; x<=r; x++) {
                if (x*x + y*y <= r*r) pxg(c, cx+x, cy+y, color);
            }
        };
        // 网格圆环
        const ringG = (c, cx, cy, r, color) => {
            for (let y=-r; y<=r; y++) for (let x=-r; x<=r; x++) {
                const d2 = x*x + y*y;
                if (d2 <= r*r && d2 > (r-1)*(r-1)) pxg(c, cx+x, cy+y, color);
            }
        };

        // ===== gk 哥布林王：绿色身体 + 金王冠 + 獠牙 =====
        {
            const c = ctx('gk'); const p = PALETTES.gk;
            fillAll(c, 0x000000);
            // 王冠（金色，5个尖）
            for (let i=0; i<5; i++) { const cx = 10 + i*3; pxg(c, cx, 6, p.accent); pxg(c, cx, 7, p.accent); pxg(c, cx, 8, p.accent); }
            for (let x=10; x<=22; x++) pxg(c, x, 9, p.accent);
            // 头部（绿色圆盘）
            discG(c, 16, 16, 6, p.body);
            discG(c, 16, 16, 6, p.body);
            // 眼睛
            pxg(c, 13, 15, p.eye); pxg(c, 14, 15, p.eye);
            pxg(c, 18, 15, p.eye); pxg(c, 19, 15, p.eye);
            // 獠牙
            pxg(c, 14, 19, 0xffffff); pxg(c, 18, 19, 0xffffff);
            // 耳朵（尖）
            lineG(c, 10, 14, 6, 12, p.body); lineG(c, 22, 14, 26, 12, p.body);
            // 身体（深绿）
            discG(c, 16, 26, 7, p.dark);
            rect(c, 11*CELL, 26*CELL, 10*CELL, 4*CELL, p.body);
            // 爪子
            for (let y=27; y<30; y++) { pxg(c, 8, y, p.dark); pxg(c, 24, y, p.dark); }
            // 阴影/高光
            for (let i=0; i<5; i++) pxg(c, 12+i, 22, p.light);
        }

        // ===== sl 骷髅领主：白骷髅头 + 红眼窝 + 骨十字 =====
        {
            const c = ctx('sl'); const p = PALETTES.sl;
            fillAll(c, 0x000000);
            // 头骨
            discG(c, 16, 14, 7, p.body);
            // 眼窝（黑色 + 红光）
            discG(c, 13, 13, 2, 0x000000);
            discG(c, 19, 13, 2, 0x000000);
            pxg(c, 13, 13, p.eye); pxg(c, 19, 13, p.eye);
            // 鼻孔
            pxg(c, 16, 16, 0x000000);
            // 牙齿
            for (let i=0; i<5; i++) { pxg(c, 13+i, 19, p.light); pxg(c, 13+i, 20, p.dark); }
            // 骨十字（脊柱）
            for (let y=22; y<30; y++) pxg(c, 16, y, p.body);
            for (let x=12; x<=20; x++) pxg(c, x, 24, p.body);
            // 肋骨（小线段）
            for (let i=0; i<3; i++) { lineG(c, 14, 25+i*2, 18, 25+i*2, p.dark); }
            // 骨盆/腿骨
            lineG(c, 16, 30, 13, 31, p.body); lineG(c, 16, 30, 19, 31, p.body);
        }

        // ===== sd 暗影龙：紫色龙首 + 张开的双翼 =====
        {
            const c = ctx('sd'); const p = PALETTES.sd;
            fillAll(c, 0x000000);
            // 左翼（三角形）
            for (let y=10; y<22; y++) {
                const len = Math.floor((y - 10) * 0.8);
                for (let x = 0; x <= len; x++) pxg(c, 8 - x, y, p.dark);
            }
            // 右翼
            for (let y=10; y<22; y++) {
                const len = Math.floor((y - 10) * 0.8);
                for (let x = 0; x <= len; x++) pxg(c, 24 + x, y, p.dark);
            }
            // 翼骨高光
            lineG(c, 8, 12, 2, 20, p.body);
            lineG(c, 24, 12, 30, 20, p.body);
            // 龙首（中央）
            discG(c, 16, 18, 6, p.body);
            // 龙吻（向前突出）
            rect(c, 16*CELL, 18*CELL, 4*CELL, 3*CELL, p.body);
            // 角（向后弯）
            lineG(c, 12, 12, 9, 7, p.light); lineG(c, 20, 12, 23, 7, p.light);
            // 眼睛（绿色发光）
            pxg(c, 14, 17, p.eye); pxg(c, 15, 17, p.eye);
            // 牙
            pxg(c, 19, 20, 0xffffff); pxg(c, 20, 20, 0xffffff);
            // 颈部
            rect(c, 13*CELL, 23*CELL, 6*CELL, 5*CELL, p.dark);
            // 鳞片高光
            pxg(c, 13, 22, p.light); pxg(c, 19, 22, p.light);
        }

        // ===== ab 深渊魔王：红皮肤 + 黑角 + 健壮身体 =====
        {
            const c = ctx('ab'); const p = PALETTES.ab;
            fillAll(c, 0x000000);
            // 左角（黑色，弯曲）
            lineG(c, 12, 10, 8, 4, p.accent); lineG(c, 11, 10, 7, 5, p.accent);
            // 右角
            lineG(c, 20, 10, 24, 4, p.accent); lineG(c, 21, 10, 25, 5, p.accent);
            // 头部
            discG(c, 16, 14, 6, p.body);
            // 角根部高光
            pxg(c, 12, 11, p.light); pxg(c, 20, 11, p.light);
            // 眼睛（橙黄）
            pxg(c, 13, 13, p.eye); pxg(c, 19, 13, p.eye);
            // 嘴 + 獠牙
            for (let x=13; x<=19; x++) pxg(c, x, 18, p.dark);
            pxg(c, 14, 19, 0xffffff); pxg(c, 18, 19, 0xffffff);
            // 身体（肌肉，宽）
            discG(c, 16, 25, 7, p.body);
            rect(c, 10*CELL, 23*CELL, 12*CELL, 6*CELL, p.body);
            // 肌肉分隔
            lineG(c, 16, 22, 16, 30, p.dark);
            // 手臂
            for (let y=22; y<28; y++) { pxg(c, 8, y, p.dark); pxg(c, 24, y, p.dark); }
            // 爪
            pxg(c, 7, 28, p.dark); pxg(c, 25, 28, p.dark);
            // 火光高光
            pxg(c, 12, 23, p.light); pxg(c, 20, 23, p.light);
        }

        // ===== ts 时空守护者：蓝色钟环 + 指针 + 中心眼 =====
        {
            const c = ctx('ts'); const p = PALETTES.ts;
            fillAll(c, 0x000000);
            // 外环
            ringG(c, 16, 16, 12, p.body);
            ringG(c, 16, 16, 11, p.light);
            // 钟面刻度（12 3 6 9 点位置）
            for (let i=0; i<12; i++) {
                const a = (i/12) * Math.PI * 2 - Math.PI/2;
                const x1 = Math.round(16 + Math.cos(a) * 9);
                const y1 = Math.round(16 + Math.sin(a) * 9);
                const x2 = Math.round(16 + Math.cos(a) * 10);
                const y2 = Math.round(16 + Math.sin(a) * 10);
                lineG(c, x1, y1, x2, y2, i % 3 === 0 ? p.accent : p.dark);
            }
            // 时针（指向上）
            lineG(c, 16, 16, 16, 9, p.accent);
            // 分针（指向右）
            lineG(c, 16, 16, 23, 16, p.accent);
            // 中心圆
            discG(c, 16, 16, 3, p.body);
            discG(c, 16, 16, 2, p.eye);
            // 中心瞳孔
            pxg(c, 16, 16, 0x000000);
            // 外发光小点
            for (let i=0; i<8; i++) {
                const a = (i/8) * Math.PI * 2;
                const x = Math.round(16 + Math.cos(a) * 14);
                const y = Math.round(16 + Math.sin(a) * 14);
                pxg(c, x, y, p.glow);
            }
        }

        // ===== el 元素领主：四象限四色（火/冰/雷/地）+ 中心宝石 =====
        {
            const c = ctx('el'); const p = PALETTES.el;
            fillAll(c, 0x000000);
            // 四个象限颜色
            const FIRE = 0xff4400, ICE = 0x44aaff, LIGHTNING = 0xffee00, EARTH = 0x88ff44;
            // 左上 火
            for (let y=4; y<16; y++) for (let x=4; x<16; x++) {
                const d = Math.sqrt((x-10)**2 + (y-10)**2);
                if (d < 7) pxg(c, x, y, FIRE);
            }
            // 右上 冰
            for (let y=4; y<16; y++) for (let x=16; x<28; x++) {
                const d = Math.sqrt((x-22)**2 + (y-10)**2);
                if (d < 7) pxg(c, x, y, ICE);
            }
            // 左下 地
            for (let y=16; y<28; y++) for (let x=4; x<16; x++) {
                const d = Math.sqrt((x-10)**2 + (y-22)**2);
                if (d < 7) pxg(c, x, y, EARTH);
            }
            // 右下 雷
            for (let y=16; y<28; y++) for (let x=16; x<28; x++) {
                const d = Math.sqrt((x-22)**2 + (y-22)**2);
                if (d < 7) pxg(c, x, y, LIGHTNING);
            }
            // 中央宝石（白色）
            discG(c, 16, 16, 4, 0xffffff);
            discG(c, 16, 16, 3, p.eye);
            // 四角小宝石
            pxg(c, 16, 8, FIRE); pxg(c, 16, 24, EARTH);
            pxg(c, 8, 16, ICE); pxg(c, 24, 16, LIGHTNING);
            // 高光
            pxg(c, 15, 15, 0xffffff);
        }

        // ===== vp 虚空先知：紫色兜帽 + 独眼 =====
        {
            const c = ctx('vp'); const p = PALETTES.vp;
            fillAll(c, 0x000000);
            // 兜帽外轮廓（深紫三角）
            for (let y=8; y<26; y++) {
                const halfW = Math.max(1, Math.floor((y - 8) * 0.6));
                for (let x = 16-halfW; x <= 16+halfW; x++) pxg(c, x, y, p.dark);
            }
            // 兜帽内（更深的阴影）
            for (let y=12; y<22; y++) {
                const halfW = Math.max(1, Math.floor((y - 12) * 0.4));
                for (let x = 16-halfW; x <= 16+halfW; x++) pxg(c, x, y, p.body);
            }
            // 兜帽尖
            lineG(c, 16, 8, 16, 4, p.dark);
            // 独眼（大紫红发光）
            discG(c, 16, 17, 3, p.eye);
            discG(c, 16, 17, 2, 0xffffff);
            pxg(c, 16, 17, 0x000000);
            // 兜帽边缘高光
            lineG(c, 11, 22, 16, 26, p.light);
            lineG(c, 21, 22, 16, 26, p.light);
            // 飘动符文（点）
            pxg(c, 10, 14, p.accent); pxg(c, 22, 14, p.accent);
            pxg(c, 9, 18, p.glow); pxg(c, 23, 18, p.glow);
            // 下方袍子下摆
            for (let y=26; y<30; y++) {
                const halfW = Math.max(1, Math.floor((y - 26) * 0.8) + 5);
                for (let x = 16-halfW; x <= 16+halfW; x++) pxg(c, x, y, p.dark);
            }
        }

        // ===== sg 暗影神：黑团 + 多眼 + 红光环 =====
        {
            const c = ctx('sg'); const p = PALETTES.sg;
            fillAll(c, 0x000000);
            // 外层红光环（环）
            ringG(c, 16, 16, 14, 0x440000);
            ringG(c, 16, 16, 13, 0x660000);
            // 主体黑团（不规则）
            discG(c, 16, 16, 11, p.body);
            // 黑团边缘有暗紫噪声
            for (let i=0; i<20; i++) {
                const a = (i/20) * Math.PI * 2;
                const r = 11 + Math.floor(Math.sin(i*1.3) * 1);
                const x = Math.round(16 + Math.cos(a) * r);
                const y = Math.round(16 + Math.sin(a) * r);
                pxg(c, x, y, p.light);
            }
            // 多只眼睛（6 只，红色）
            const eyes = [[12,11],[20,11],[10,16],[22,16],[14,21],[18,21],[16,16]];
            for (const [ex, ey] of eyes) {
                pxg(c, ex, ey, p.eye);
                pxg(c, ex+1, ey, p.eye);
                pxg(c, ex, ey+1, 0xffffff);
            }
            // 中心眼更大
            discG(c, 16, 16, 2, p.eye);
            pxg(c, 16, 16, 0x000000);
            // 顶部火焰
            lineG(c, 16, 5, 14, 1, p.glow);
            lineG(c, 16, 5, 18, 1, p.glow);
            // 底部触手
            lineG(c, 12, 27, 10, 31, p.body);
            lineG(c, 16, 28, 16, 31, p.body);
            lineG(c, 20, 27, 22, 31, p.body);
        }

        // 刷新所有 canvas 纹理
        for (const id in PALETTES) {
            const tex = this.textures.get('boss_' + id);
            if (tex && tex.refresh) tex.refresh();
        }
    }

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
        this.treasureChests = [];
        this.lastChestSpawn = 0;
        this.chestSpawnInterval = 60000;
        this.dashTimer = 0;
        this.dashCooldown = 0;
        this.lastDashDir = { x: 0, y: 0 };
        this.createEnemyAnimations(); // 注册小怪精灵动画
        this.blinkTimer = 0;
        this.blinkCooldown = 0;
        this.blinkDistance = 220;
        this.emergencyShieldTimer = 0;
        this.emergencyShieldCooldown = 0;
        this.emergencyShieldActive = false;
        this.weaponLevels = { sword: 1, axe: 1, staff: 1, bow: 1, wand: 1 };
        this.rageMode = false;
        this.rageTimer = 0;
        this.miniMapGraphics = null;
        this.chapterCountdown = 0;

        this.playerWorldX = 0;
        this.playerWorldY = 0;
        this.gameState = 'menu';
        this.paused = false;
        this.startTime = 0;
        this.damageNumbers = [];
        this.screenShake = 0;
        this.menuElements = [];
        this.pauseElements = [];
        this.merchantDialog = null;
        this.gameOverElements = [];

        this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE,ESC,Q,SHIFT,ONE,TWO,E,R,F');
        this.mousePos = { x: GW / 2 + 100, y: GH / 2 };
        this.input.on('pointermove', p => this.mousePos = p);
        this.input.keyboard.on('keydown-SPACE', () => this.useSkill());
        this.input.keyboard.on('keydown-ESC', () => this.togglePause());
        this.input.keyboard.on('keydown-Q', () => {
            if (this.runtime.secondaryWeapon) {
                // 有副武器时，交换主副武器
                const temp = this.runtime.weaponType;
                this.switchWeapon(this.runtime.secondaryWeapon);
                // 仅在切换成功（weaponType已变更）时更新副武器，避免冷却失败时错误交换
                if (this.runtime.weaponType !== temp) {
                    this.runtime.secondaryWeapon = temp;
                }
            } else {
                this.cycleWeapon();
            }
        });
        this.input.keyboard.on('keydown-SHIFT', () => this.tryDash());
        this.input.keyboard.on('keydown-E', () => this.tryBlink());
        this.input.keyboard.on('keydown-R', () => this.tryEmergencyShield());
        this.input.keyboard.on('keydown-ONE', () => this.quickSwitchWeapon(0));
        this.input.keyboard.on('keydown-TWO', () => this.quickSwitchWeapon(1));

        this.createBackground();
        this.createPlayer();
        this.createHUD();
        this.showMainMenu();
    }

    createBackground() {
        this.bgGraphics = this.add.graphics();
        this.bgGraphics.setDepth(-100);
        this.bgStars = [];
        for (let i = 0; i < 100; i++) {
            this.bgStars.push({
                x: Math.random() * WS * 2 - WS,
                y: Math.random() * WS * 2 - WS,
                size: 1 + Math.random() * 2.5,
                twinkle: Math.random() * Math.PI * 2,
                alpha: 0.3 + Math.random() * 0.7
            });
        }
        this.bgRocks = [];
        for (let i = 0; i < 80; i++) {
            this.bgRocks.push({
                x: Math.random() * WS * 2 - WS,
                y: Math.random() * WS * 2 - WS,
                size: 6 + Math.random() * 18
            });
        }
        this.bgTrees = [];
        for (let i = 0; i < 60; i++) {
            this.bgTrees.push({
                x: Math.random() * WS * 2 - WS,
                y: Math.random() * WS * 2 - WS,
                size: 18 + Math.random() * 28
            });
        }
        // v5：新增草丛/蘑菇等地面装饰
        this.bgGrass = [];
        for (let i = 0; i < 100; i++) {
            this.bgGrass.push({
                x: Math.random() * WS * 2 - WS,
                y: Math.random() * WS * 2 - WS,
                size: 4 + Math.random() * 10,
                type: Math.floor(Math.random() * 3) // 0=草丛, 1=蘑菇, 2=小花
            });
        }
    }

    drawBackground() {
        const g = this.bgGraphics;
        g.clear();
        const ch = this.runtime.currentChapter;
        const bgC = (ch >= 0 && ch < Chapters.length) ? Chapters[ch].bgColor : COLORS.bg1;
        g.fillStyle(bgC, 1);
        g.fillRect(0, 0, GW, GH);
        // 区域色调叠加（降低透明度让背景更亮）
        const region = REGIONS[this.runtime.currentRegion];
        if (region) {
            g.fillStyle(region.color, 0.2);
            g.fillRect(0, 0, GW, GH);
        }

        const gridSize = 80;
        const ox = -this.playerWorldX % gridSize + GW / 2;
        const oy = -this.playerWorldY % gridSize + GH / 2;
        g.lineStyle(1, 0x3a5a3a, 0.4);
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
                g.fillStyle(0x2a2a4a, 0.7);
                g.fillEllipse(sx, sy + r.size * 0.3, r.size * 1.2, r.size * 0.5);
                g.fillStyle(0x3a3a5a, 0.85);
                g.fillCircle(sx, sy, r.size * 0.7);
            }
        });

        this.bgTrees.forEach(t => {
            const sx = t.x - this.playerWorldX * 0.5 + GW / 2;
            const sy = t.y - this.playerWorldY * 0.5 + GH / 2;
            if (sx > -60 && sx < GW + 60 && sy > -60 && sy < GH + 60) {
                // 树干
                g.fillStyle(0x2a1a0a, 0.8);
                g.fillRect(sx - 4, sy - t.size * 0.15, 8, t.size * 0.5);
                // 树冠（多层）
                g.fillStyle(0x1a4a2a, 0.85);
                g.fillTriangle(sx, sy - t.size * 1.1, sx - t.size * 0.55, sy - t.size * 0.1, sx + t.size * 0.55, sy - t.size * 0.1);
                g.fillStyle(0x2a5a3a, 0.75);
                g.fillTriangle(sx, sy - t.size * 0.85, sx - t.size * 0.45, sy - t.size * 0.05, sx + t.size * 0.45, sy - t.size * 0.05);
                // 树影
                g.fillStyle(0x0a1a0a, 0.3);
                g.fillEllipse(sx + 5, sy + t.size * 0.35, t.size * 0.8, t.size * 0.2);
            }
        });

        // 地面装饰（草丛/蘑菇/小花）
        this.bgGrass.forEach(gr => {
            const sx = gr.x - this.playerWorldX * 0.7 + GW / 2;
            const sy = gr.y - this.playerWorldY * 0.7 + GH / 2;
            if (sx > -20 && sx < GW + 20 && sy > -20 && sy < GH + 20) {
                if (gr.type === 0) {
                    // 草丛
                    g.fillStyle(0x2a5a2a, 0.6);
                    g.fillEllipse(sx, sy, gr.size * 1.5, gr.size * 0.6);
                    g.fillStyle(0x3a7a3a, 0.5);
                    g.fillEllipse(sx + 2, sy - 1, gr.size * 1.0, gr.size * 0.4);
                } else if (gr.type === 1) {
                    // 蘑菇
                    g.fillStyle(0x886644, 0.7);
                    g.fillRect(sx - 1, sy, 3, gr.size * 0.5);
                    g.fillStyle(0xcc4444, 0.8);
                    g.fillEllipse(sx + 1, sy - 1, gr.size * 0.6, gr.size * 0.4);
                    g.fillStyle(0xffffff, 0.6);
                    g.fillCircle(sx, sy - 2, 1);
                    g.fillCircle(sx + 3, sy - 1, 0.8);
                } else {
                    // 小花
                    g.fillStyle(0x2a6a2a, 0.6);
                    g.fillRect(sx - 1, sy, 2, gr.size * 0.6);
                    const flowerColors = [0xff6688, 0xffaa44, 0xaa66ff, 0xff4466];
                    g.fillStyle(flowerColors[gr.type % flowerColors.length], 0.7);
                    g.fillCircle(sx, sy - 1, gr.size * 0.3);
                }
            }
        });

        // v5：章节专属背景元素（区域装饰）
        const regId = this.runtime.currentRegion;
        if (regId === 0) {
            // 森林：飘落叶子
            for (let i = 0; i < 8; i++) {
                const seed = i * 137.5;
                const px = ((time * 0.05 + seed) % GW + GW) % GW;
                const py = ((time * 0.08 + seed * 1.7) % GH + GH) % GH;
                g.fillStyle(0x4a8a3a, 0.5);
                g.fillEllipse(px, py, 6, 3);
            }
        } else if (regId === 1) {
            // 沼泽：雾气层
            g.fillStyle(0x6688aa, 0.15);
            for (let i = 0; i < 5; i++) {
                const fx = (Math.sin(time * 0.0003 + i) * 200 + GW / 2);
                const fy = (Math.cos(time * 0.0004 + i * 2) * 100 + GH / 2);
                g.fillEllipse(fx, fy, 300, 80);
            }
        } else if (regId === 2) {
            // 荒原：沙尘飞舞
            for (let i = 0; i < 30; i++) {
                const seed = i * 89.3;
                const px = ((time * 0.2 + seed) % GW + GW) % GW;
                const py = (Math.sin(time * 0.001 + i) * 30 + (i * 37) % GH);
                g.fillStyle(0xddaa66, 0.4);
                g.fillCircle(px, py, 1.5);
            }
        } else if (regId === 3) {
            // 城堡：摇曳烛火光晕
            for (let i = 0; i < 4; i++) {
                const cx = GW * (0.2 + i * 0.2);
                const cy = GH * 0.85 + Math.sin(time * 0.003 + i) * 4;
                const flicker = 0.6 + Math.sin(time * 0.01 + i * 2) * 0.3;
                g.fillStyle(0xff8844, 0.4 * flicker);
                g.fillCircle(cx, cy, 25);
                g.fillStyle(0xffcc66, 0.7 * flicker);
                g.fillCircle(cx, cy, 8);
            }
        } else if (regId === 4) {
            // 裂隙：岩浆裂缝脉动
            const pulse = 0.4 + Math.sin(time * 0.003) * 0.2;
            g.lineStyle(8, 0xff3300, pulse);
            for (let i = 0; i < 4; i++) {
                const y = GH * (0.2 + i * 0.2);
                g.beginPath();
                g.moveTo(0, y);
                g.lineTo(GW, y + Math.sin(time * 0.001 + i) * 30);
                g.strokePath();
            }
            g.fillStyle(0xff6600, 0.3);
            for (let i = 0; i < 6; i++) {
                const ex = (time * 0.1 + i * 200) % GW;
                const ey = GH * 0.5 + Math.sin(time * 0.002 + i) * 100;
                g.fillCircle(ex, ey, 4 + Math.sin(time * 0.005 + i) * 2);
            }
        }

        // 边界警告：只在屏幕边缘显示细条，不覆盖整个屏幕
        const edgeDist = WS / 2 - 100;
        if (Math.abs(this.playerWorldX) > edgeDist || Math.abs(this.playerWorldY) > edgeDist) {
            const edgeAlpha = Math.min(0.4, (Math.max(Math.abs(this.playerWorldX), Math.abs(this.playerWorldY)) - edgeDist) / 100);
            // 只在接近的边界边缘显示红色警告条
            if (this.playerWorldX > edgeDist) {
                g.fillStyle(0xff0000, edgeAlpha);
                g.fillRect(GW - 8, 0, 8, GH);
            }
            if (this.playerWorldX < -edgeDist) {
                g.fillStyle(0xff0000, edgeAlpha);
                g.fillRect(0, 0, 8, GH);
            }
            if (this.playerWorldY > edgeDist) {
                g.fillStyle(0xff0000, edgeAlpha);
                g.fillRect(0, GH - 8, GW, 8);
            }
            if (this.playerWorldY < -edgeDist) {
                g.fillStyle(0xff0000, edgeAlpha);
                g.fillRect(0, 0, GW, 8);
            }
        }
    }

    createPlayer() {
        this.player = this.add.container(GW / 2, GH / 2);
        this.player.setDepth(100);

        const shadow = this.add.ellipse(0, 18, 24, 8, 0x000000, 0.3);
        // 双腿（行走时摆动）
        const legL = this.add.rectangle(-5, 22, 7, 14, 0x2a2a44);
        const legR = this.add.rectangle(5, 22, 7, 14, 0x2a2a44);
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

        this.player.add([shadow, legL, legR, capeDark, cape, body, bodyDark, belt, buckle, head, hair, hairFront, eye1, eye2, eyeShine1, eyeShine2]);

        this.playerBody = body;
        this.playerHead = head;
        this.playerCape = cape;
        this.playerCapeDark = capeDark;
        this.playerLegL = legL;
        this.playerLegR = legR;
        this.playerEyes = [eye1, eye2];
        this.playerEyeShines = [eyeShine1, eyeShine2];
        this._blinkTimer = 0;
        this._walkPhase = 0;
        this.weaponContainer = this.add.container(28, 0);
        this.weaponContainer.setDepth(101);
        this.player.add(this.weaponContainer);
    }

    createWeaponVisual(type) {
        this.weaponContainer.removeAll(true);
        const w = WeaponFactory.configs[type] || WeaponFactory.configs.sword;

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
                const bowG = this.add.graphics();
                bowG.lineStyle(5, 0x8B4513);
                bowG.beginPath();
                bowG.arc(0, 0, 24, -Math.PI / 2.3, Math.PI / 2.3, false);
                bowG.strokePath();
                const bowLimb = this.add.circle(0, -20, 4, 0x654321);
                const bowLimb2 = this.add.circle(0, 20, 4, 0x654321);
                const string = this.add.line(2, 0, 0, -18, 0, 18, 0xeeeeee);
                const arrowRest = this.add.rectangle(8, 0, 6, 3, 0x8B4513);
                this.weaponContainer.add([bowLimb, bowLimb2, bowG, string, arrowRest]);
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

    cycleWeapon() {
        if (this.gameState !== 'playing' || this.paused) return;
        const all = WeaponFactory.all();
        const unlocked = this.saveData.unlockedWeapons;
        const pool = all.filter(w => unlocked.includes(w));
        if (pool.length < 2) return;
        const idx = pool.indexOf(this.runtime.weaponType);
        const next = pool[(idx + 1) % pool.length];
        this.switchWeapon(next);
    }

    switchWeapon(type) {
        if (!this.saveData.unlockedWeapons.includes(type)) return;
        const now = this.time.now - this.startTime;
        if (now - this.lastWeaponSwitch < 1500) {
            this.showCenterText('武器切换冷却中...', '#ff4444');
            return;
        }
        this.lastWeaponSwitch = now;
        this.runtime.weaponType = type;
        this.runtime.weapon = WeaponFactory.create(type);
        this.runtime.skill = SkillFactory.create(type);
        this.createWeaponVisual(type);
        if (this.skillIcon) this.skillIcon.setText(this.runtime.skill.icon);
        const info = WeaponFactory.info(type);
        this.showCenterText(`${info.name} Lv.${this.weaponLevels[type] || 1}`, '#ffdd00');
        this.updateWeaponHUD();
    }

    switchRegion(regionId) {
        if (regionId < 0 || regionId >= REGIONS.length) return;
        this.currentRegion = regionId;
        this.runtime.currentRegion = regionId;
        // 清除当前敌人
        this.enemyManager.enemies.forEach(e => { if (e.container) e.container.destroy(); });
        this.enemyManager.enemies = [];
        // 显示区域名称
        this.showCenterText(REGIONS[regionId].name, '#ffffff');
        // 更新背景色调
        this.updateRegionBg();
        // 保存进度
        this.saveData.currentRegion = regionId;
        this.saveData.regionCleared = this.runtime.regionCleared;
        SaveData.save(this.saveData);
        // 启动章节任务
        this.startChapterQuest();
    }

    updateRegionBg() {
        // 背景在 drawBackground 中每帧绘制，区域色调会自动应用
        this.drawBackground();
    }

    startChapterQuest() {
        const chapter = STORY_CHAPTERS[this.runtime.currentRegion];
        if (!chapter) return;

        this.runtime.questProgress = 0;
        this.runtime.questCompleted = false;

        // 显示章节标题和介绍
        this.showStoryDialogue(chapter.intro);

        // 根据任务类型初始化
        if (chapter.quest.type === 'activate') {
            this.spawnQuestTargets(chapter.quest.count);
        } else if (chapter.quest.type === 'collect') {
            // 收集型：击杀精英怪
            this.spawnEliteEnemies(chapter.quest.count);
        } else if (chapter.quest.type === 'challenge') {
            // 挑战型：生成BOSS幻影
            this.spawnPhantomBosses(chapter.quest.count);
        }
    }

    spawnQuestTargets(count) {
        // 在地图上生成符文阵/灯塔
        if (this.questTargets) {
            this.questTargets.forEach(q => { if (q.obj) q.obj.destroy(); if (q.arrow) q.arrow.destroy(); });
        }
        this.questTargets = [];
        const halfW = WS / 2 - 80; // 留出边界余量，防止符文生成在世界边缘外
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3;
            // 增大生成距离，让玩家需要真正移动才能到达
            const dist = 600 + Math.random() * 300;
            let wx = this.playerWorldX + Math.cos(angle) * dist;
            let wy = this.playerWorldY + Math.sin(angle) * dist;
            // clamp 到世界边界内
            wx = Math.max(-halfW, Math.min(halfW, wx));
            wy = Math.max(-halfW, Math.min(halfW, wy));

            const sx = wx - this.playerWorldX + GW / 2;
            const sy = wy - this.playerWorldY + GH / 2;

            // 符文阵：外环 + 内核 + 进度环
            const container = this.add.container(sx, sy);
            container.setDepth(50);
            const outer = this.add.circle(0, 0, 28, 0x44ff88, 0.18);
            outer.setStrokeStyle(3, 0x88ffaa);
            const inner = this.add.circle(0, 0, 12, 0x44ff88, 0.55);
            inner.setStrokeStyle(2, 0xddffdd);
            const mark = this.add.text(0, -2, '✦', { fontSize: '20px', fill: '#aaffcc' }).setOrigin(0.5);
            // v5：进度环（5 秒激活进度）
            const progressRing = this.add.circle(0, 0, 36, 0x44ff88, 0.0);
            progressRing.setStrokeStyle(2, 0xffee88, 0);
            const progressText = this.add.text(0, 50, '', {
                fontSize: '12px', fontFamily: 'Courier New', color: '#ffee88', fontWeight: 'bold'
            }).setOrigin(0.5);
            container.add([outer, inner, mark, progressRing, progressText]);

            // 旋转/呼吸动画
            this.tweens.add({ targets: outer, scaleX: 1.25, scaleY: 1.25, duration: 1100, yoyo: true, repeat: -1 });
            this.tweens.add({ targets: mark, angle: 360, duration: 4000, repeat: -1 });

            // 守卫：每个符文周围生成 4-6 只怪，含精英，提升难度
            const region = REGIONS[this.runtime.currentRegion];
            const guardCount = 4 + Math.floor(Math.random() * 3);
            for (let g = 0; g < guardCount; g++) {
                const ga = Math.random() * Math.PI * 2;
                const gd = 70 + Math.random() * 70;
                const e = new Enemy(this, region.enemyPool[Math.floor(Math.random() * region.enemyPool.length)]);
                e.spawn(wx + Math.cos(ga) * gd, wy + Math.sin(ga) * gd);
                // 30% 概率守卫为精英（tier 1-2），提升难度
                if (Math.random() < 0.30) {
                    e.setElite(Math.random() < 0.6 ? 1 : 2);
                }
                this.enemyManager.enemies.push(e);
            }

            // v5：5 秒持续激活机制
            this.questTargets.push({
                obj: container, outer, inner, mark, progressRing, progressText,
                activated: false, activating: false,
                progress: 0, activateTime: 5000,
                lastGuardSpawn: 0,
                worldX: wx, worldY: wy, arrow: null
            });
        }
    }

    activateQuestTarget(qt, idx) {
        if (!this.questTargets || this.questTargets[idx].activated) return;
        this.questTargets[idx].activated = true;
        if (qt.arrow) { qt.arrow.destroy(); qt.arrow = null; }
        // 激活后淡出销毁，不再停留在屏幕上
        const sx = qt.worldX - this.playerWorldX + GW / 2;
        const sy = qt.worldY - this.playerWorldY + GH / 2;
        this.particles.explosion(sx, sy, 36, 0x44ff88);
        this.cameras.main.flash(250, 100, 255, 150);
        this.cameras.main.shake(180, 0.006);
        if (qt.obj) {
            this.tweens.add({
                targets: qt.obj, alpha: 0, scale: 2.2, duration: 500, ease: 'Cubic.easeOut',
                onComplete: () => { if (qt.obj) { qt.obj.destroy(); qt.obj = null; } }
            });
        }

        // 实质反馈：护盾 + 短暂狂暴 + 稀有掉落 + 提示
        this.runtime.shield = (this.runtime.shield || 0) + 60;
        this.rageMode = true;
        this.rageTimer = 5000;
        this.particles.explosion(this.player.x, this.player.y, 30, 0xffaa00);
        // 生成稀有掉落（紫色宝石）
        if (typeof PickupItem !== 'undefined') {
            this.items.push(new PickupItem(this, 'gem_purple', qt.worldX, qt.worldY));
            this.items.push(new PickupItem(this, 'exp_big', qt.worldX + 30, qt.worldY));
        }
        this.showCenterText('✦ 符文激活！获得祝福 ✦', '#88ffaa', 1800);

        this.runtime.questProgress++;

        const chapter = STORY_CHAPTERS[this.runtime.currentRegion];
        const npcKey = Object.keys(chapter.npcDialogues)[0];
        const dialogues = chapter.npcDialogues[npcKey];

        if (this.runtime.questProgress >= chapter.quest.count) {
            this.runtime.questCompleted = true;
            this.showStoryDialogue(dialogues.questComplete, '#44ff88');
            // 生成BOSS传送门
            this.spawnBossPortal();
        } else {
            this.showStoryDialogue(dialogues.questUpdate(this.runtime.questProgress, chapter.quest.count));
        }
    }

    spawnEliteEnemies(count) {
        // 生成精英怪（标记为任务目标）
        for (let i = 0; i < count; i++) {
            this.time.delayedCall(i * 3000, () => {
                const region = REGIONS[this.runtime.currentRegion];
                const type = region.enemyPool[Math.floor(Math.random() * region.enemyPool.length)];
                const e = new Enemy(this, type);
                const angle = Math.random() * Math.PI * 2;
                const dist = 300 + Math.random() * 200;
                e.spawn(
                    this.playerWorldX + Math.cos(angle) * dist,
                    this.playerWorldY + Math.sin(angle) * dist
                );
                e.setElite();
                e.isQuestTarget = true;
                this.enemyManager.enemies.push(e);
            });
        }
    }

    spawnPhantomBosses(count) {
        // 生成BOSS幻影
        for (let i = 0; i < count; i++) {
            this.time.delayedCall(i * 5000, () => {
                const chapter = STORY_CHAPTERS[i];
                if (!chapter) return;
                const bossConfig = BossConfigs.find(b => b.id === chapter.bossId);
                if (!bossConfig) return;
                // 创建简化版BOSS幻影（50%难度）
                const phantom = new Boss(this, bossConfig.id);
                phantom.spawn(0.5, 1);
                const angle = Math.random() * Math.PI * 2;
                const dist = 250;
                phantom.worldX = this.playerWorldX + Math.cos(angle) * dist;
                phantom.worldY = this.playerWorldY + Math.sin(angle) * dist;
                phantom.isPhantom = true;
                this.bossManager.boss = phantom;
            });
        }
    }

    spawnBossPortal() {
        const px = GW / 2;
        const py = GH / 2 - 100;
        const portal = this.add.circle(px, py, 35, 0xff4444, 0.6);
        portal.setStrokeStyle(3, 0xff8866);
        portal.setDepth(100);
        this.tweens.add({
            targets: portal,
            scaleX: 1.2, scaleY: 1.2,
            duration: 800, yoyo: true, repeat: -1
        });
        portal.setInteractive();
        portal.on('pointerdown', () => {
            portal.destroy();
            // 触发BOSS战
            this.bossManager.spawnBoss();
        });
        this.showCenterText('BOSS传送门已开启！', '#ff4444');
    }

    spawnPortal() {
        // 在屏幕右侧生成传送门
        const px = GW - 100;
        const py = GH / 2;
        const portal = this.add.circle(px, py, 30, 0x8844ff, 0.6);
        portal.setStrokeStyle(3, 0xaa88ff);
        portal.setDepth(90);
        // 旋转动画
        this.tweens.add({
            targets: portal,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 800,
            yoyo: true,
            repeat: -1
        });
        // 交互
        portal.setInteractive();
        portal.on('pointerdown', () => {
            this.switchRegion(this.runtime.currentRegion + 1);
            portal.destroy();
        });
        this.showCenterText('传送门已开启！点击进入下一区域', '#aa88ff');
        this.portal = portal;
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

        this.waveText = this.add.text(GW / 2, 50, '波次 1 | 00:00', {
            fontSize: '13px', fontFamily: 'Courier New', color: '#88ddff',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5);

        this.chapterText = this.add.text(GW / 2, 73, '', {
            fontSize: '12px', fontFamily: 'Courier New', color: '#ff88aa',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5);

        this.comboText = this.add.text(GW - 25, 55, '', {
            fontSize: '26px', fontFamily: 'Courier New',
            color: '#ff6600', fontWeight: 'bold',
            stroke: '#000', strokeThickness: 3
        }).setOrigin(1, 0);

        this.comboTimerBar = this.add.rectangle(GW - 25, 85, 120, 4, 0x331100).setOrigin(1, 0.5);
        this.comboTimerBar.setStrokeStyle(1, 0x661100);
        this.comboTimerBarFill = this.add.rectangle(GW - 25, 85, 0, 2, 0xff8800).setOrigin(1, 0.5);

        this.comboMultText = this.add.text(GW - 25, 92, '', {
            fontSize: '11px', fontFamily: 'Courier New', color: '#ffaa44',
            stroke: '#000', strokeThickness: 1
        }).setOrigin(1, 0);

        this.rageBar = this.add.rectangle(GW - 25, 110, 120, 6, 0x331100).setOrigin(1, 0.5);
        this.rageBar.setStrokeStyle(1, 0x661100);
        this.rageBarFill = this.add.rectangle(GW - 25, 110, 0, 4, 0xff4400).setOrigin(1, 0.5);

        this.kpmText = this.add.text(GW - 25, 125, '击杀: 0', {
            fontSize: '12px', fontFamily: 'Courier New', color: '#ffaa44',
            stroke: '#000', strokeThickness: 1
        }).setOrigin(1, 0);

        this.dashCdText = this.add.text(155, 85, '', {
            fontSize: '11px', fontFamily: 'Courier New', color: '#ffdd44',
            stroke: '#000', strokeThickness: 1
        });

        this.weaponText = this.add.text(28, 86, '⚔ 暗影剑 Lv.1', {
            fontSize: '13px', fontFamily: 'Courier New', color: '#ffffff',
            stroke: '#000', strokeThickness: 2
        });

        this.weaponExpBar = this.add.rectangle(28, 100, 100, 3, 0x111122).setOrigin(0, 0.5);
        this.weaponExpBar.setStrokeStyle(1, 0x333355);
        this.weaponExpBarFill = this.add.rectangle(28, 100, 0, 1, 0xffaa00).setOrigin(0, 0.5);

        this.blinkCdText = this.add.text(60, 115, 'E 闪现', {
            fontSize: '10px', fontFamily: 'Courier New', color: '#cc66ff',
            stroke: '#000', strokeThickness: 1
        });
        this.shieldCdText = this.add.text(120, 115, 'R 应急', {
            fontSize: '10px', fontFamily: 'Courier New', color: '#00ccff',
            stroke: '#000', strokeThickness: 1
        });

        this.keyHints = this.add.text(GW / 2, GH - 5,
            'WASD移动 | 鼠标瞄准 | 空格技能 | Q切武器 | 1/2快速切换 | Shift冲刺 | E闪现 | R应急护盾 | ESC暂停', {
            fontSize: '10px', fontFamily: 'Courier New', color: '#666',
            stroke: '#000', strokeThickness: 1
        }).setOrigin(0.5, 1);

        this.difficultyLabel = this.add.text(GW / 2, 60, '', {
            fontSize: '11px', fontFamily: 'Courier New', color: '#ffaa66',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5);

        this.dailyModLabel = this.add.text(GW / 2, 78, '', {
            fontSize: '10px', fontFamily: 'Courier New', color: '#ff88ff',
            stroke: '#000', strokeThickness: 1
        }).setOrigin(0.5);

        // 技能按钮
        this.skillBtnGlow = this.add.circle(GW - 60, GH - 60, 50, COLORS.bowGlow, 0.2);
        this.skillBtnGlow.setStrokeStyle(2, 0xffd700);
        this.skillBtnBg = this.add.circle(GW - 60, GH - 60, 42, 0x111122);
        this.skillBtnBg.setStrokeStyle(3, 0xffd700).setInteractive();
        this.skillIcon = this.add.text(GW - 60, GH - 60, '💨', { fontSize: '32px' }).setOrigin(0.5);
        this.skillCD = this.add.graphics();
        this.skillHint = this.add.text(GW - 60, GH - 18, '[空格]', {
            fontSize: '11px', fontFamily: 'Courier New', color: '#aaa'
        }).setOrigin(0.5);
        this.skillBtnBg.on('pointerdown', () => this.useSkill());

        // 武器快捷栏
        this.weaponBar = [];
        const allW = WeaponFactory.all();
        allW.forEach((w, i) => {
            const x = 60 + i * 44;
            const y = GH - 32;
            const bg = this.add.rectangle(x, y, 38, 38, 0x111122, 0.85);
            bg.setStrokeStyle(2, 0x444466).setInteractive();
            const info = WeaponFactory.info(w);
            const icon = this.add.text(x, y, info.icon, { fontSize: '20px' }).setOrigin(0.5);
            bg.on('pointerdown', () => {
                if (this.saveData.unlockedWeapons.includes(w)) this.switchWeapon(w);
            });
            this.weaponBar.push({ bg, icon, type: w });
        });

        this.weaponSwitchHint = this.add.text(60, GH - 65, 'Q 切换武器', {
            fontSize: '11px', fontFamily: 'Courier New', color: '#888'
        }).setOrigin(0.5);

        // 暂停按钮
        const pauseBtn = this.add.text(GW - 50, 110, '⏸', { fontSize: '26px' }).setOrigin(0.5).setInteractive();
        pauseBtn.on('pointerdown', () => this.togglePause());
    }

    updateWeaponBar() {
        this.weaponBar.forEach((it, i) => {
            if (!it.bg) return;
            const unlocked = this.saveData.unlockedWeapons.includes(it.type);
            const current = this.runtime.weaponType === it.type;
            if (!unlocked) { it.bg.setStrokeStyle(2, 0x333344); it.bg.setFillStyle(0x222222, 0.5); it.icon.setAlpha(0.3); }
            else if (current) { it.bg.setStrokeStyle(3, 0xffd700); it.bg.setFillStyle(0x443322, 0.95); it.icon.setAlpha(1); }
            else { it.bg.setStrokeStyle(2, 0x666688); it.bg.setFillStyle(0x111122, 0.85); it.icon.setAlpha(1); }
        });
    }

    showMainMenu() {
        this.gameState = 'menu';
        this.paused = false;
        this.menuElements.forEach(e => e.destroy());
        this.menuElements = [];

        const difficulties = [
            { id: 'easy', name: '简单', icon: '🌱', color: 0x44ff88, mult: 0.6, dmgMult: 0.7, rewardMult: 0.8 },
            { id: 'normal', name: '普通', icon: '⚔', color: 0xffdd00, mult: 1.0, dmgMult: 1.0, rewardMult: 1.0 },
            { id: 'hard', name: '困难', icon: '🔥', color: 0xff6644, mult: 1.4, dmgMult: 1.25, rewardMult: 1.5 },
            { id: 'hell', name: '地狱', icon: '💀', color: 0xaa00ff, mult: 2.0, dmgMult: 1.6, rewardMult: 2.5 }
        ];
        this.menuDifficulties = difficulties;
        // v5：难度锁系统——默认选已解锁的最高难度
        if (!this.selectedDifficulty) {
            const unlocked = this.saveData.unlockedDifficulties || ['easy'];
            const order = ['easy', 'normal', 'hard', 'hell'];
            const highestUnlocked = order.filter(d => unlocked.includes(d)).pop();
            this.selectedDifficulty = difficulties.find(d => d.id === highestUnlocked) || difficulties[0];
        }

        const bg = this.add.rectangle(0, 0, GW, GH, 0x000000, 0.9).setOrigin(0).setDepth(400);
        for (let i = 0; i < 30; i++) {
            const star = this.add.star(Math.random() * GW, Math.random() * GH,
                5, 3, 8, 0xffd700).setDepth(401).setAlpha(0.6);
            this.tweens.add({
                targets: star, alpha: 0, y: `-=${50 + Math.random() * 50}`, scale: 2,
                duration: 1500 + Math.random() * 1000, delay: Math.random() * 500
            });
        }

        const title = this.add.text(GW / 2, 70, '⚔ 暗影猎手 ⚔', {
            fontSize: '58px', fontFamily: 'Courier New',
            color: '#ff4488', stroke: '#000', strokeThickness: 7, fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(401);
        const titleGlow = this.add.text(GW / 2, 70, '⚔ 暗影猎手 ⚔', {
            fontSize: '58px', fontFamily: 'Courier New',
            color: '#ff88aa', stroke: '#000', strokeThickness: 7, fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(400).setAlpha(0.4);
        this.tweens.add({
            targets: titleGlow, scale: { from: 1, to: 1.05 }, alpha: { from: 0.4, to: 0.1 },
            yoyo: true, duration: 1500, repeat: -1
        });

        const subtitle = this.add.text(GW / 2, 125, '神 话 版 v5 · Mythic V', {
            fontSize: '22px', fontFamily: 'Courier New',
            color: '#ffaa66', stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5).setDepth(401);

        const diffTitle = this.add.text(GW / 2, 165, '— 选择难度 —', {
            fontSize: '17px', fontFamily: 'Courier New', color: '#88ddff',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(401);

        const diffY = 215;
        difficulties.forEach((d, i) => {
            const x = GW / 2 + (i - 1.5) * 130;
            const isSel = this.selectedDifficulty.id === d.id;
            // v5：难度锁判定
            const unlocked = this.saveData.unlockedDifficulties || ['easy'];
            const isLocked = !unlocked.includes(d.id);
            const card = this.add.rectangle(x, diffY, 110, 70,
                isLocked ? 0x222222 : (isSel ? d.color : 0x111122),
                isLocked ? 0.7 : (isSel ? 0.95 : 0.85))
                .setStrokeStyle(isSel ? 4 : 2, isLocked ? 0x555555 : (isSel ? 0xffffff : d.color))
                .setInteractive().setDepth(401);
            const ic = this.add.text(x, diffY - 18, isLocked ? '🔒' : d.icon, { fontSize: '26px' }).setOrigin(0.5).setDepth(402);
            const nm = this.add.text(x, diffY + 12, d.name, {
                fontSize: '15px', fontFamily: 'Courier New',
                color: isLocked ? '#666' : '#fff', fontWeight: 'bold'
            }).setOrigin(0.5).setDepth(402);
            let bn;
            if (isLocked) {
                const order = ['easy', 'normal', 'hard', 'hell'];
                const prevIdx = order.indexOf(d.id) - 1;
                const prevName = prevIdx >= 0 ? difficulties[prevIdx].name : '';
                bn = this.add.text(x, diffY + 32, `通关${prevName}解锁`, {
                    fontSize: '9px', fontFamily: 'Courier New', color: '#ff6644'
                }).setOrigin(0.5).setDepth(402);
            } else {
                const bonus = d.rewardMult > 1 ? `奖励×${d.rewardMult}` : (d.rewardMult < 1 ? `奖励×${d.rewardMult}` : '标准');
                bn = this.add.text(x, diffY + 32, bonus, {
                    fontSize: '9px', fontFamily: 'Courier New', color: '#ffd700'
                }).setOrigin(0.5).setDepth(402);
            }
            card.on('pointerover', () => { if (!isLocked) card.setStrokeStyle(4, 0xffffff); });
            card.on('pointerout', () => {
                if (!isLocked && this.selectedDifficulty.id !== d.id) card.setStrokeStyle(2, d.color);
            });
            card.on('pointerdown', () => {
                if (isLocked) {
                    const tipTxt = this.add.text(x, diffY - 50, '🔒 未解锁', {
                        fontSize: '14px', fontFamily: 'Courier New', color: '#ff4444', fontWeight: 'bold'
                    }).setOrigin(0.5).setDepth(403);
                    this.tweens.add({ targets: tipTxt, alpha: 0, y: tipTxt.y - 20, duration: 1000, onComplete: () => tipTxt.destroy() });
                    return;
                }
                this.selectedDifficulty = d;
                this.menuElements.forEach(e => e.destroy());
                this.menuElements = [];
                this.showMainMenu();
            });
            this.menuElements.push(card, ic, nm, bn);
        });

        const wpTitle = this.add.text(GW / 2, 305, '— 选择武器 —', {
            fontSize: '17px', fontFamily: 'Courier New', color: '#88ddff',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(401);

        const allWeapons = WeaponFactory.all();
        const weapons = allWeapons.filter(w => this.saveData.unlockedWeapons.includes(w));
        const totalUnlocked = weapons.length;
        weapons.forEach((w, i) => {
            const x = GW / 2 + (i - (totalUnlocked - 1) / 2) * 130;
            const y = 385;
            const info = WeaponFactory.info(w);
            const cfg = WeaponFactory.configs[w];
            const cardBg = this.add.rectangle(x, y, 115, 130, 0x111122, 0.95)
                .setStrokeStyle(3, info.color).setInteractive().setDepth(401);
            const cardInner = this.add.rectangle(x, y, 107, 122, 0x1a1a2e, 0.95).setDepth(401);
            const icon = this.add.text(x, y - 40, info.icon, { fontSize: '40px' }).setOrigin(0.5).setDepth(402);
            const name = this.add.text(x, y + 0, info.name, {
                fontSize: '14px', fontFamily: 'Courier New', color: '#ffffff', fontWeight: 'bold'
            }).setOrigin(0.5).setDepth(402);
            const desc = this.add.text(x, y + 42, info.desc, {
                fontSize: '10px', fontFamily: 'Courier New', color: '#aaa',
                align: 'center', wordWrap: { width: 100 }
            }).setOrigin(0.5).setDepth(402);

            cardBg.on('pointerover', () => {
                cardBg.setStrokeStyle(5, info.color);
                this.tweens.add({ targets: cardBg, scale: 1.08, duration: 150 });
            });
            cardBg.on('pointerout', () => {
                cardBg.setStrokeStyle(3, info.color);
                this.tweens.add({ targets: cardBg, scale: 1, duration: 150 });
            });
            cardBg.on('pointerdown', () => {
                this.startGame(w);
            });
            this.menuElements.push(cardBg, cardInner, icon, name, desc);
        });

        const tips = this.add.text(GW / 2, GH - 115,
            'WASD 移动 | 鼠标瞄准自动攻击 | 空格 技能 | Q 切武器 | 1/2 快速切换 | Shift 冲刺 | E 闪现 | ESC 暂停', {
            fontSize: '12px', fontFamily: 'Courier New', color: '#888'
        }).setOrigin(0.5).setDepth(401);

        // v5：三资源显示
        const resDisplay = this.add.text(GW / 2, 470,
            `✦ 魂石: ${this.saveData.soulStones || 0}  |  ⛏ 玄铁: ${this.saveData.darkIron || 0}  |  ✺ BOSS之血: ${this.saveData.bossBlood || 0}`, {
            fontSize: '15px', fontFamily: 'Courier New', color: '#ffffff',
            stroke: '#000', strokeThickness: 2, fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(401);

        const smithyBtn = this.add.rectangle(GW / 2 - 90, 505, 160, 36, 0x332211, 0.95)
            .setStrokeStyle(2, 0xffaa44).setInteractive().setDepth(401);
        const smithyTxt = this.add.text(GW / 2 - 90, 505, '⚒ 铁匠铺', {
            fontSize: '15px', fontFamily: 'Courier New', color: '#ffcc66', fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(402);
        smithyBtn.on('pointerover', () => smithyBtn.setStrokeStyle(3, 0xffffff));
        smithyBtn.on('pointerout', () => smithyBtn.setStrokeStyle(2, 0xffaa44));
        smithyBtn.on('pointerdown', () => this.showSmithy());

        const upgradeBtn = this.add.rectangle(GW / 2 + 90, 505, 160, 36, 0x221144, 0.95)
            .setStrokeStyle(2, 0xaa88ff).setInteractive().setDepth(401);
        const upgradeTxt = this.add.text(GW / 2 + 90, 505, '✦ 角色养成', {
            fontSize: '15px', fontFamily: 'Courier New', color: '#ccaaff', fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(402);
        upgradeBtn.on('pointerover', () => upgradeBtn.setStrokeStyle(3, 0xffffff));
        upgradeBtn.on('pointerout', () => upgradeBtn.setStrokeStyle(2, 0xaa88ff));
        upgradeBtn.on('pointerdown', () => this.showUpgradesPanel());

        this.menuElements.push(resDisplay, smithyBtn, smithyTxt, upgradeBtn, upgradeTxt);

        // 存档管理按钮（左下角）
        const saveBtn = this.add.rectangle(90, GH - 38, 150, 32, 0x331122, 0.95)
            .setStrokeStyle(2, 0xff6688).setInteractive().setDepth(401);
        const saveTxt = this.add.text(90, GH - 38, '🗂 存档管理', {
            fontSize: '13px', fontFamily: 'Courier New', color: '#ff99bb', fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(402);
        saveBtn.on('pointerover', () => saveBtn.setStrokeStyle(3, 0xffffff));
        saveBtn.on('pointerout', () => saveBtn.setStrokeStyle(2, 0xff6688));
        saveBtn.on('pointerdown', () => this.showSaveManager());
        this.menuElements.push(saveBtn, saveTxt);

        // 新武器解锁提示
        if (this._unlockedNewWeapons && this._unlockedNewWeapons.length > 0) {
            const unlockMsg = this._unlockedNewWeapons.map(w => WeaponFactory.info(w).name).join('、');
            const unlockTxt = this.add.text(GW / 2, 150, `🏆 新武器解锁: ${unlockMsg}!`, {
                fontSize: '18px', fontFamily: 'Courier New', color: '#44ff88',
                stroke: '#000', strokeThickness: 3, fontWeight: 'bold'
            }).setOrigin(0.5).setDepth(401);
            this.tweens.add({ targets: unlockTxt, alpha: { from: 1, to: 0.4 }, yoyo: true, duration: 800, repeat: 3 });
            this.menuElements.push(unlockTxt);
            this._unlockedNewWeapons = null;
        }

        const today = new Date();
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        const dailyBtn = this.add.rectangle(GW / 2, GH - 75, 220, 38, 0x442266, 0.95)
            .setStrokeStyle(2, 0xff00ff).setInteractive().setDepth(401);
        const dailyText = this.add.text(GW / 2, GH - 75,
            `🌟 每日挑战 (${today.getMonth() + 1}/${today.getDate()})`, {
            fontSize: '14px', fontFamily: 'Courier New', color: '#ff88ff', fontWeight: 'bold',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(402);
        dailyBtn.on('pointerover', () => dailyBtn.setStrokeStyle(3, 0xffffff));
        dailyBtn.on('pointerout', () => dailyBtn.setStrokeStyle(2, 0xff00ff));
        dailyBtn.on('pointerdown', () => {
            this.startDailyChallenge(seed);
        });
        this.menuElements.push(dailyBtn, dailyText);

        const best = this.add.text(GW - 25, 25, `最佳 ${this.formatTime(this.saveData.bestTime)} | ${this.saveData.achievements.length}/30 🏆`, {
            fontSize: '11px', fontFamily: 'Courier New', color: '#ffd700',
            stroke: '#000', strokeThickness: 1
        }).setOrigin(1, 0).setDepth(401);

        const stats = this.add.text(GW - 90, GH - 38,
            `💰 ${this.saveData.totalGold} | 🏃 ${this.saveData.totalRuns} | 👑 ${this.saveData.highestBoss}`, {
            fontSize: '11px', fontFamily: 'Courier New', color: '#aaa'
        }).setOrigin(0.5).setDepth(401);

        this.menuElements.push(bg, title, titleGlow, subtitle, diffTitle, wpTitle, tips, dailyBtn, dailyText, best, stats);
    }

    // ===== v5 局外养成：铁匠铺（玄铁升级 + 武器形态显示）=====
    showSmithy() {
        this.menuElements.forEach(e => e.destroy());
        this.menuElements = [];
        const sd = this.saveData;
        const bg = this.add.rectangle(0, 0, GW, GH, 0x000000, 0.95).setOrigin(0).setDepth(400);
        const title = this.add.text(GW / 2, 60, '⚒ 铁匠铺 — 武器永久强化', {
            fontSize: '32px', fontFamily: 'Courier New', color: '#ffcc66',
            stroke: '#000', strokeThickness: 4, fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(401);
        // v5：显示玄铁 + BOSS之血 + 进化道具
        const resTxt = this.add.text(GW / 2, 100,
            `⛏ 玄铁: ${sd.darkIron || 0}  |  ✺ BOSS之血: ${sd.bossBlood || 0}  |  ◈ 影石: ${(sd.weaponMats && sd.weaponMats.shadowStone) || 0}  |  ◆ 血晶: ${(sd.weaponMats && sd.weaponMats.bloodCrystal) || 0}`, {
            fontSize: '15px', fontFamily: 'Courier New', color: '#ffffff', fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(401);
        this.menuElements.push(bg, title, resTxt);

        const weapons = WeaponFactory.all().filter(w => sd.unlockedWeapons.includes(w));
        weapons.forEach((w, i) => {
            const x = GW / 2 + (i - (weapons.length - 1) / 2) * 150;
            const y = 290;
            const info = WeaponFactory.info(w);
            const lv = (sd.weaponLevels && sd.weaponLevels[w]) || 0;
            const form = (sd.weaponForms && sd.weaponForms[w]) || 0;
            // v5：玄铁升级（1-10级），cost 用玄铁
            const maxLv = 10;
            const cost = lv >= maxLv ? 0 : Math.floor(5 * Math.pow(lv + 1, 1.5));
            const canAfford = lv < maxLv && (sd.darkIron || 0) >= cost;
            const cardBg = this.add.rectangle(x, y, 135, 200, 0x111122, 0.95)
                .setStrokeStyle(3, info.color).setInteractive().setDepth(401);
            const icon = this.add.text(x, y - 70, info.icon, { fontSize: '36px' }).setOrigin(0.5).setDepth(402);
            const name = this.add.text(x, y - 30, info.name, {
                fontSize: '14px', fontFamily: 'Courier New', color: '#fff', fontWeight: 'bold'
            }).setOrigin(0.5).setDepth(402);
            // v5：显示形态阶段
            const formNames = ['基础', '二阶', '三阶', '四阶', '终极'];
            const formTxt = this.add.text(x, y - 8, `形态: ${formNames[form] || '基础'}`, {
                fontSize: '11px', fontFamily: 'Courier New', color: '#ff88ff'
            }).setOrigin(0.5).setDepth(402);
            const lvTxt = this.add.text(x, y + 12, lv >= maxLv ? `Lv.MAX` : `Lv.${lv}/${maxLv} (+${lv * 10}%攻击)`, {
                fontSize: '12px', fontFamily: 'Courier New', color: '#88ff88'
            }).setOrigin(0.5).setDepth(402);
            let costTxt, hint;
            if (lv >= maxLv) {
                costTxt = this.add.text(x, y + 38, '已达满级', { fontSize: '11px', fontFamily: 'Courier New', color: '#666' }).setOrigin(0.5).setDepth(402);
                hint = this.add.text(x, y + 60, '需进化形态', { fontSize: '11px', fontFamily: 'Courier New', color: '#aa66ff' }).setOrigin(0.5).setDepth(402);
            } else {
                costTxt = this.add.text(x, y + 38, `消耗 ${cost} 玄铁`, {
                    fontSize: '12px', fontFamily: 'Courier New',
                    color: canAfford ? '#ffaa55' : '#666'
                }).setOrigin(0.5).setDepth(402);
                hint = this.add.text(x, y + 62, canAfford ? '点击升级' : '玄铁不足', {
                    fontSize: '11px', fontFamily: 'Courier New',
                    color: canAfford ? '#ffaa44' : '#555'
                }).setOrigin(0.5).setDepth(402);
            }
            if (canAfford) {
                cardBg.on('pointerover', () => cardBg.setStrokeStyle(5, 0xffffff));
                cardBg.on('pointerout', () => cardBg.setStrokeStyle(3, info.color));
                cardBg.on('pointerdown', () => {
                    sd.darkIron -= cost;
                    sd.weaponLevels = sd.weaponLevels || {};
                    sd.weaponLevels[w] = lv + 1;
                    SaveData.save(sd);
                    this.audio.play('levelup');
                    this.showSmithy();
                });
            }
            // v5 武器进化按钮（消耗影石+血晶+BOSS之血）
            if (form < 4) {
                const evolveCosts = [
                    { shadow: 3, blood: 1, boss: 1 },   // 0→1
                    { shadow: 5, blood: 2, boss: 2 },   // 1→2
                    { shadow: 8, blood: 4, boss: 4 },   // 2→3
                    { shadow: 12, blood: 8, boss: 8 }   // 3→4
                ];
                const ev = evolveCosts[form];
                const haveShadow = (sd.weaponMats && sd.weaponMats.shadowStone) || 0;
                const haveBlood = (sd.weaponMats && sd.weaponMats.bloodCrystal) || 0;
                const haveBoss = sd.bossBlood || 0;
                const canEvolve = lv >= 5 && haveShadow >= ev.shadow && haveBlood >= ev.blood && haveBoss >= ev.boss;
                const evolveBtn = this.add.text(x, y + 90,
                    lv < 5 ? `进化需Lv5` : `◈进化 ${form+1}阶 (◈${ev.shadow} ◆${ev.blood} ✺${ev.boss})`, {
                        fontSize: '10px', fontFamily: 'Courier New',
                        color: canEvolve ? '#ff66ff' : (lv < 5 ? '#555' : '#884488')
                    }).setOrigin(0.5).setDepth(402);
                if (canEvolve) {
                    evolveBtn.setInteractive({ useHandCursor: true });
                    evolveBtn.on('pointerover', () => evolveBtn.setScale(1.1));
                    evolveBtn.on('pointerout', () => evolveBtn.setScale(1));
                    evolveBtn.on('pointerdown', () => {
                        sd.weaponMats.shadowStone -= ev.shadow;
                        sd.weaponMats.bloodCrystal -= ev.blood;
                        sd.bossBlood -= ev.boss;
                        sd.weaponForms = sd.weaponForms || {};
                        sd.weaponForms[w] = form + 1;
                        SaveData.save(sd);
                        this.audio.play('levelup');
                        this.cameras.main.flash(400, 180, 80, 255);
                        this.showSmithy();
                    });
                }
                this.menuElements.push(evolveBtn);
            } else {
                const maxForm = this.add.text(x, y + 90, '★ 终极形态 ★', {
                    fontSize: '11px', fontFamily: 'Courier New', color: '#ffdd44', fontWeight: 'bold'
                }).setOrigin(0.5).setDepth(402);
                this.menuElements.push(maxForm);
            }
            this.menuElements.push(cardBg, icon, name, formTxt, lvTxt, costTxt, hint);
        });

        const back = this.add.text(GW / 2, GH - 60, '◀ 返回主菜单', {
            fontSize: '18px', fontFamily: 'Courier New', color: '#66ff66', stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setInteractive().setDepth(401);
        back.on('pointerdown', () => this.showMainMenu());
        this.menuElements.push(back);
    }

    // ===== v5 存档管理面板 =====
    showSaveManager() {
        this.menuElements.forEach(e => e.destroy());
        this.menuElements = [];
        const sd = this.saveData;
        const bg = this.add.rectangle(0, 0, GW, GH, 0x000000, 0.95).setOrigin(0).setDepth(400);
        const title = this.add.text(GW / 2, 60, '🗂 存档管理', {
            fontSize: '36px', fontFamily: 'Courier New', color: '#ff99bb',
            stroke: '#000', strokeThickness: 4, fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(401);
        const subtitle = this.add.text(GW / 2, 105, '查看存档详情 · 重置进度 · 导出/导入存档', {
            fontSize: '14px', fontFamily: 'Courier New', color: '#aaa'
        }).setOrigin(0.5).setDepth(401);
        this.menuElements.push(bg, title, subtitle);

        // 存档信息面板
        const panelX = GW / 2 - 280, panelY = 145, panelW = 560, panelH = 380;
        const panel = this.add.rectangle(panelX, panelY, panelW, panelH, 0x111122, 0.95)
            .setStrokeStyle(2, 0x444466).setOrigin(0).setDepth(401);
        this.menuElements.push(panel);

        // 存档存在判断
        const hasSave = localStorage.getItem('shadowHunter_v5') !== null;
        if (!hasSave) {
            const empty = this.add.text(GW / 2, panelY + panelH / 2, '📭 暂无存档数据', {
                fontSize: '24px', fontFamily: 'Courier New', color: '#666'
            }).setOrigin(0.5).setDepth(402);
            this.menuElements.push(empty);
        } else {
            // 显示存档详情
            const infos = [
                { label: '游戏版本', value: 'Shadow Hunter v5', color: '#ffffff' },
                { label: '总场次', value: `${sd.totalRuns || 0} 局`, color: '#88ff88' },
                { label: '最佳时间', value: this.formatTime(sd.bestTime || 0), color: '#ffd700' },
                { label: '总击杀', value: `${sd.totalKills || 0}`, color: '#ff8888' },
                { label: '总金币', value: `${sd.totalGold || 0}`, color: '#ffd700' },
                { label: '最高BOSS', value: `第 ${sd.highestBoss || 0} 章`, color: '#ff66ff' },
                { label: '成就', value: `${(sd.achievements || []).length}/30`, color: '#ffaa44' },
                { label: '解锁武器', value: `${(sd.unlockedWeapons || ['sword']).length}/5`, color: '#88ddff' },
                { label: '解锁难度', value: `${(sd.unlockedDifficulties || ['easy']).length}/4`, color: '#ff99bb' },
                { label: '魂石', value: `${sd.soulStones || 0}`, color: '#aa88ff' },
                { label: '玄铁', value: `${sd.darkIron || 0}`, color: '#ffaa55' },
                { label: 'BOSS之血', value: `${sd.bossBlood || 0}`, color: '#ff4466' },
            ];
            infos.forEach((info, i) => {
                const col = i % 2;
                const row = Math.floor(i / 2);
                const x = panelX + 20 + col * 270;
                const y = panelY + 25 + row * 28;
                const lblTxt = this.add.text(x, y, info.label + ':', {
                    fontSize: '13px', fontFamily: 'Courier New', color: '#888'
                }).setOrigin(0, 0.5).setDepth(402);
                const valTxt = this.add.text(x + 110, y, info.value, {
                    fontSize: '14px', fontFamily: 'Courier New', color: info.color, fontWeight: 'bold'
                }).setOrigin(0, 0.5).setDepth(402);
                this.menuElements.push(lblTxt, valTxt);
            });

            // 存档大小
            const saveSize = new Blob([localStorage.getItem('shadowHunter_v5') || '']).size;
            const sizeTxt = this.add.text(panelX + panelW - 20, panelY + panelH - 15,
                `存档大小: ${(saveSize / 1024).toFixed(2)} KB`, {
                fontSize: '11px', fontFamily: 'Courier New', color: '#666'
            }).setOrigin(1, 0.5).setDepth(402);
            this.menuElements.push(sizeTxt);
        }

        // 操作按钮
        const btnY = 555;
        // 返回按钮
        const backBtn = this.add.rectangle(GW / 2 - 225, btnY, 130, 40, 0x223322, 0.95)
            .setStrokeStyle(2, 0x66ff66).setInteractive().setDepth(401);
        const backTxt = this.add.text(GW / 2 - 225, btnY, '◀ 返回', {
            fontSize: '15px', fontFamily: 'Courier New', color: '#88ff88', fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(402);
        backBtn.on('pointerover', () => backBtn.setStrokeStyle(3, 0xffffff));
        backBtn.on('pointerout', () => backBtn.setStrokeStyle(2, 0x66ff66));
        backBtn.on('pointerdown', () => this.showMainMenu());

        // 导出按钮
        const exportBtn = this.add.rectangle(GW / 2 - 75, btnY, 130, 40, 0x222244, 0.95)
            .setStrokeStyle(2, 0x6688ff).setInteractive().setDepth(401);
        const exportTxt = this.add.text(GW / 2 - 75, btnY, '📤 导出存档', {
            fontSize: '14px', fontFamily: 'Courier New', color: '#88aaff', fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(402);
        exportBtn.on('pointerover', () => exportBtn.setStrokeStyle(3, 0xffffff));
        exportBtn.on('pointerout', () => exportBtn.setStrokeStyle(2, 0x6688ff));
        exportBtn.on('pointerdown', () => this.exportSave());

        // 导入按钮
        const importBtn = this.add.rectangle(GW / 2 + 75, btnY, 130, 40, 0x222244, 0.95)
            .setStrokeStyle(2, 0x6688ff).setInteractive().setDepth(401);
        const importTxt = this.add.text(GW / 2 + 75, btnY, '📥 导入存档', {
            fontSize: '14px', fontFamily: 'Courier New', color: '#88aaff', fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(402);
        importBtn.on('pointerover', () => importBtn.setStrokeStyle(3, 0xffffff));
        importBtn.on('pointerout', () => importBtn.setStrokeStyle(2, 0x6688ff));
        importBtn.on('pointerdown', () => this.importSave());

        // 删除按钮（危险操作）
        const delBtn = this.add.rectangle(GW / 2 + 225, btnY, 130, 40, 0x441111, 0.95)
            .setStrokeStyle(2, 0xff4444).setInteractive().setDepth(401);
        const delTxt = this.add.text(GW / 2 + 225, btnY, '🗑 删除存档', {
            fontSize: '14px', fontFamily: 'Courier New', color: '#ff6666', fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(402);
        delBtn.on('pointerover', () => delBtn.setStrokeStyle(3, 0xffffff));
        delBtn.on('pointerout', () => delBtn.setStrokeStyle(2, 0xff4444));
        delBtn.on('pointerdown', () => this.confirmDeleteSave());

        this.menuElements.push(backBtn, backTxt, exportBtn, exportTxt, importBtn, importTxt, delBtn, delTxt);
    }

    // 导出存档（复制到剪贴板）
    exportSave() {
        const data = localStorage.getItem('shadowHunter_v5') || '';
        if (!data) {
            this.showCenterText('无存档可导出', '#ff6666', 1500);
            return;
        }
        try {
            // 创建一个输入框让用户复制
            const ta = document.createElement('textarea');
            ta.value = data;
            ta.style.position = 'fixed';
            ta.style.top = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
            this.showCenterText('✅ 存档已复制到剪贴板', '#88ff88', 2000);
        } catch (e) {
            this.showCenterText('导出失败', '#ff6666', 1500);
        }
    }

    // 导入存档
    importSave() {
        const ta = document.createElement('textarea');
        ta.value = '';
        ta.placeholder = '粘贴存档数据...';
        ta.style.position = 'fixed';
        ta.style.top = '50%';
        ta.style.left = '50%';
        ta.style.transform = 'translate(-50%, -50%)';
        ta.style.width = '500px';
        ta.style.height = '200px';
        ta.style.zIndex = '9999';
        ta.style.fontSize = '12px';
        const tip = document.createElement('div');
        tip.textContent = '粘贴存档数据并按回车，取消请点击外部';
        tip.style.cssText = 'position:fixed;top:calc(50% - 140px);left:50%;transform:translateX(-50%);background:#222;color:#fff;padding:10px 20px;border-radius:8px;z-index:9999;font-family:monospace;';
        document.body.appendChild(tip);
        document.body.appendChild(ta);
        ta.focus();
        const cancel = document.createElement('button');
        cancel.textContent = '取消';
        cancel.style.cssText = 'position:fixed;top:calc(50% + 120px);left:50%;transform:translateX(-50%);background:#444;color:#fff;padding:8px 20px;border-radius:4px;z-index:9999;cursor:pointer;font-family:monospace;';
        document.body.appendChild(cancel);
        const cleanup = () => {
            document.body.removeChild(ta);
            document.body.removeChild(tip);
            document.body.removeChild(cancel);
        };
        cancel.onclick = cleanup;
        ta.onkeydown = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const v = ta.value.trim();
                if (!v) { cleanup(); return; }
                try {
                    JSON.parse(v); // 验证
                    localStorage.setItem('shadowHunter_v5', v);
                    cleanup();
                    this.saveData = SaveData.load();
                    this.showCenterText('✅ 存档导入成功', '#88ff88', 2000);
                    this.time.delayedCall(1500, () => this.showSaveManager());
                } catch (err) {
                    alert('存档数据格式错误');
                }
            } else if (e.key === 'Escape') {
                cleanup();
            }
        };
    }

    // 确认删除存档（二次确认）
    confirmDeleteSave() {
        this.menuElements.forEach(e => e.destroy());
        this.menuElements = [];
        const bg = this.add.rectangle(0, 0, GW, GH, 0x000000, 0.97).setOrigin(0).setDepth(400);
        const title = this.add.text(GW / 2, GH / 2 - 80, '⚠ 警告', {
            fontSize: '40px', fontFamily: 'Courier New', color: '#ff4444',
            stroke: '#000', strokeThickness: 4, fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(401);
        const msg = this.add.text(GW / 2, GH / 2 - 10,
            '删除存档将永久丢失：\n\n· 所有武器升级和形态进化\n· 所有角色加点和资源\n· 成就、最佳记录、解锁内容\n\n此操作不可恢复！', {
            fontSize: '16px', fontFamily: 'Courier New', color: '#ffaaaa',
            align: 'center', stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(401);
        const confirmBtn = this.add.rectangle(GW / 2 - 110, GH / 2 + 110, 180, 44, 0x441111, 0.95)
            .setStrokeStyle(2, 0xff4444).setInteractive().setDepth(401);
        const confirmTxt = this.add.text(GW / 2 - 110, GH / 2 + 110, '🗑 确认删除', {
            fontSize: '16px', fontFamily: 'Courier New', color: '#ff6666', fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(402);
        const cancelBtn = this.add.rectangle(GW / 2 + 110, GH / 2 + 110, 180, 44, 0x223322, 0.95)
            .setStrokeStyle(2, 0x66ff66).setInteractive().setDepth(401);
        const cancelTxt = this.add.text(GW / 2 + 110, GH / 2 + 110, '✕ 取消', {
            fontSize: '16px', fontFamily: 'Courier New', color: '#88ff88', fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(402);
        confirmBtn.on('pointerover', () => confirmBtn.setStrokeStyle(3, 0xffffff));
        confirmBtn.on('pointerout', () => confirmBtn.setStrokeStyle(2, 0xff4444));
        cancelBtn.on('pointerover', () => cancelBtn.setStrokeStyle(3, 0xffffff));
        cancelBtn.on('pointerout', () => cancelBtn.setStrokeStyle(2, 0x66ff66));
        cancelBtn.on('pointerdown', () => this.showSaveManager());
        confirmBtn.on('pointerdown', () => {
            SaveData.clear();
            this.saveData = SaveData.default();
            this.selectedDifficulty = null;
            this.showCenterText('存档已清除', '#ff8888', 1500);
            this.time.delayedCall(1200, () => this.showMainMenu());
        });
        this.menuElements.push(bg, title, msg, confirmBtn, confirmTxt, cancelBtn, cancelTxt);
    }

    // ===== v5 局外养成：10 分支角色加点 =====
    showUpgradesPanel() {
        this.menuElements.forEach(e => e.destroy());
        this.menuElements = [];
        const sd = this.saveData;
        // v5：10 分支 upgrades
        sd.upgrades = sd.upgrades || {
            bloodlust: 0, berserk: 0, ironwall: 0, immortal: 0,
            shadowstep: 0, gale: 0, greed: 0, sage: 0, element: 0, summon: 0
        };
        sd.unlockedUpgrades = sd.unlockedUpgrades || ['bloodlust', 'ironwall', 'shadowstep', 'greed'];
        const bg = this.add.rectangle(0, 0, GW, GH, 0x000000, 0.95).setOrigin(0).setDepth(400);
        const title = this.add.text(GW / 2, 50, '✦ 角色养成 — 10 分支永久加点', {
            fontSize: '28px', fontFamily: 'Courier New', color: '#ccaaff',
            stroke: '#000', strokeThickness: 4, fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(401);
        const soulTxt = this.add.text(GW / 2, 85, `✦ 魂石: ${sd.soulStones || 0}`, {
            fontSize: '16px', fontFamily: 'Courier New', color: '#aa88ff', fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(401);
        this.menuElements.push(bg, title, soulTxt);

        // v5：10 分支定义（5 支柱 × 2 分支）
        const branches = [
            // 输出支柱
            { key: 'bloodlust', name: '嗜血', icon: '🩸', color: 0xff3344, pillar: '输出',
              desc: '暴击时回血5%HP；满级暴击+30%', costBase: 4,
              unlock: { default: true }, unlockDesc: '默认解锁' },
            { key: 'berserk', name: '狂战', icon: '🔥', color: 0xff6622, pillar: '输出',
              desc: '血量<50%时伤害+25%；满级+60%', costBase: 5,
              unlock: { kills: 100 }, unlockDesc: '累计击杀100怪' },
            // 生存支柱
            { key: 'ironwall', name: '铁壁', icon: '🛡', color: 0x4488ff, pillar: '生存',
              desc: '致命伤生成50护盾(60sCD)；满级护盾+200', costBase: 4,
              unlock: { default: true }, unlockDesc: '默认解锁' },
            { key: 'immortal', name: '不朽', icon: '♾', color: 0x44ddaa, pillar: '生存',
              desc: '死亡复活1次(30%血)；满级反伤+50%', costBase: 6,
              unlock: { difficulty: 'normal' }, unlockDesc: '通关普通难度' },
            // 机动支柱
            { key: 'shadowstep', name: '影步', icon: '💨', color: 0x88ddff, pillar: '机动',
              desc: '冲刺0.3秒无敌；满级CD-50%', costBase: 5,
              unlock: { default: true }, unlockDesc: '默认解锁' },
            { key: 'gale', name: '疾风', icon: '🌪', color: 0x66ffcc, pillar: '机动',
              desc: '移速+8% 攻速+5%/级；满级双冲刺', costBase: 5,
              unlock: { moveDist: 5000 }, unlockDesc: '累计移动5km' },
            // 资源支柱
            { key: 'greed', name: '贪婪', icon: '💰', color: 0xffcc44, pillar: '资源',
              desc: '精英必掉玄铁；满级掉落+50%', costBase: 4,
              unlock: { default: true }, unlockDesc: '默认解锁' },
            { key: 'sage', name: '智者', icon: '📜', color: 0xddaaff, pillar: '资源',
              desc: '经验+10% 商店9折/级；满级3折', costBase: 5,
              unlock: { shopPurchases: 10 }, unlockDesc: '商店购买10次' },
            // 特性支柱
            { key: 'element', name: '元素', icon: '⚡', color: 0x44ffff, pillar: '特性',
              desc: '攻击附10%火伤+灼烧；满级冰雷双附魔', costBase: 6,
              unlock: { bosses: 3 }, unlockDesc: '击败3种不同BOSS' },
            { key: 'summon', name: '召唤', icon: '👤', color: 0xcc88ff, pillar: '特性',
              desc: '15%概率影子分身助攻；满级双分身', costBase: 7,
              unlock: { soulStones: 50 }, unlockDesc: '累计获得50魂石' }
        ];

        // 检查解锁条件
        const checkUnlock = (b) => {
            if (b.unlock.default) return true;
            if (b.unlock.kills && (sd.totalKills || 0) >= b.unlock.kills) return true;
            if (b.unlock.difficulty && sd.difficultyCleared && sd.difficultyCleared[b.unlock.difficulty]) return true;
            if (b.unlock.moveDist && (sd.totalMoveDistance || 0) >= b.unlock.moveDist) return true;
            if (b.unlock.shopPurchases && (sd.totalShopPurchases || 0) >= b.unlock.shopPurchases) return true;
            if (b.unlock.bosses && (sd.bossesDefeated || []).length >= b.unlock.bosses) return true;
            if (b.unlock.soulStones && (sd.soulStones || 0) >= b.unlock.soulStones) return true;
            return false;
        };

        // 分两行显示，每行5个
        branches.forEach((p, i) => {
            const col = i % 5;
            const row = Math.floor(i / 5);
            const x = GW / 2 + (col - 2) * 145;
            const y = 180 + row * 230;
            const lv = sd.upgrades[p.key] || 0;
            const maxLv = 5;
            const isUnlocked = checkUnlock(p);
            const cost = lv >= maxLv ? 0 : Math.floor(p.costBase * Math.pow(lv + 1, 1.6));
            const canAfford = isUnlocked && lv < maxLv && (sd.soulStones || 0) >= cost;
            const cardBg = this.add.rectangle(x, y, 130, 200,
                isUnlocked ? 0x111122 : 0x1a1a1a, 0.95)
                .setStrokeStyle(3, isUnlocked ? p.color : 0x444444)
                .setInteractive().setDepth(401);
            const icon = this.add.text(x, y - 75, isUnlocked ? p.icon : '🔒', { fontSize: '32px' }).setOrigin(0.5).setDepth(402);
            const name = this.add.text(x, y - 38, p.name, {
                fontSize: '14px', fontFamily: 'Courier New',
                color: isUnlocked ? '#fff' : '#888', fontWeight: 'bold'
            }).setOrigin(0.5).setDepth(402);
            const pillarTxt = this.add.text(x, y - 18, `[${p.pillar}]`, {
                fontSize: '9px', fontFamily: 'Courier New', color: '#888'
            }).setOrigin(0.5).setDepth(402);
            const lvTxt = this.add.text(x, y + 0, lv >= maxLv ? 'Lv.MAX' : `Lv.${lv}/${maxLv}`, {
                fontSize: '12px', fontFamily: 'Courier New', color: '#88ff88'
            }).setOrigin(0.5).setDepth(402);
            const descTxt = this.add.text(x, y + 25, isUnlocked ? p.desc : p.unlockDesc, {
                fontSize: '9px', fontFamily: 'Courier New',
                color: isUnlocked ? '#bbb' : '#ff8844',
                align: 'center', wordWrap: { width: 120 }
            }).setOrigin(0.5).setDepth(402);
            let costTxt;
            if (!isUnlocked) {
                costTxt = this.add.text(x, y + 70, '未解锁', { fontSize: '11px', fontFamily: 'Courier New', color: '#ff6644' }).setOrigin(0.5).setDepth(402);
            } else if (lv >= maxLv) {
                costTxt = this.add.text(x, y + 70, '已满级', { fontSize: '11px', fontFamily: 'Courier New', color: '#ffdd44' }).setOrigin(0.5).setDepth(402);
            } else {
                costTxt = this.add.text(x, y + 70, `${cost} 魂石`, {
                    fontSize: '12px', fontFamily: 'Courier New',
                    color: canAfford ? '#ffd700' : '#666', fontWeight: 'bold'
                }).setOrigin(0.5).setDepth(402);
            }
            if (canAfford) {
                cardBg.on('pointerover', () => cardBg.setStrokeStyle(5, 0xffffff));
                cardBg.on('pointerout', () => cardBg.setStrokeStyle(3, p.color));
                cardBg.on('pointerdown', () => {
                    sd.soulStones -= cost;
                    sd.upgrades[p.key] = lv + 1;
                    SaveData.save(sd);
                    this.audio.play('levelup');
                    this.showUpgradesPanel();
                });
            }
            this.menuElements.push(cardBg, icon, name, pillarTxt, lvTxt, descTxt, costTxt);
        });

        // v5：重置加点按钮（免费 respec）
        const resetBtn = this.add.rectangle(GW / 2 - 100, GH - 55, 160, 36, 0x441133, 0.95)
            .setStrokeStyle(2, 0xff4488).setInteractive().setDepth(401);
        const resetTxt = this.add.text(GW / 2 - 100, GH - 55, '↻ 重置加点', {
            fontSize: '14px', fontFamily: 'Courier New', color: '#ff88aa', fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(402);
        resetBtn.on('pointerover', () => resetBtn.setStrokeStyle(3, 0xffffff));
        resetBtn.on('pointerout', () => resetBtn.setStrokeStyle(2, 0xff4488));
        resetBtn.on('pointerdown', () => {
            // 退还所有魂石
            let refunded = 0;
            Object.keys(sd.upgrades).forEach(k => {
                const lv = sd.upgrades[k];
                for (let i = 0; i < lv; i++) {
                    const branch = branches.find(b => b.key === k);
                    if (branch) refunded += Math.floor(branch.costBase * Math.pow(i + 1, 1.6));
                }
                sd.upgrades[k] = 0;
            });
            sd.soulStones = (sd.soulStones || 0) + refunded;
            SaveData.save(sd);
            this.audio.play('levelup');
            this.showUpgradesPanel();
        });

        const back = this.add.text(GW / 2 + 100, GH - 55, '◀ 返回主菜单', {
            fontSize: '16px', fontFamily: 'Courier New', color: '#66ff66', stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setInteractive().setDepth(401);
        back.on('pointerdown', () => this.showMainMenu());
        this.menuElements.push(resetBtn, resetTxt, back);
    }

    getDailyModifiers(seed) {
        const rng = (n) => {
            const x = Math.sin(seed * 9301 + n * 49297) * 233280;
            return x - Math.floor(x);
        };
        const mods = [
            { name: '黄金雨', desc: '金币×3', icon: '💰', apply: (r) => { r._goldMult = 3; } },
            { name: '极速战场', desc: '敌人+30%速度 玩家+15%移速', icon: '⚡', apply: (r) => { r._enemySpeedMult = 1.3; r._playerSpeedMult = 1.15; } },
            { name: '玻璃大炮', desc: '伤害×2 最大HP减半', icon: '💥', apply: (r) => { r._dmgMult = 2; r._hpMult = 0.5; } },
            { name: '精英天下', desc: '全部敌人为精英', icon: '👑', apply: (r) => { r._allElite = true; } },
            { name: '护盾失效', desc: '无护盾吸收', icon: '🛡', apply: (r) => { r._noShield = true; } },
            { name: '生命回复', desc: '每秒回3HP', icon: '💚', apply: (r) => { r._regenBoost = 1; } },
            { name: '连击狂热', desc: '连击伤害+50%', icon: '🔥', apply: (r) => { r._comboBoost = 0.5; } },
            { name: 'Boss速通', desc: 'Boss间隔减半', icon: '⏱', apply: (r) => { r._bossFast = true; } }
        ];
        const picks = [];
        for (let i = 0; i < 2; i++) {
            const idx = Math.floor(rng(i) * mods.length);
            if (picks.indexOf(idx) === -1) picks.push(idx);
        }
        return picks.map(i => mods[i]);
    }

    startDailyChallenge(seed) {
        const mods = this.getDailyModifiers(seed);
        this.menuElements.forEach(e => e.destroy());
        this.menuElements = [];
        this.selectedDifficulty = this.menuDifficulties[1];
        this.runtime = new RuntimeData();
        this.runtime.dailyChallenge = true;
        this.runtime.dailySeed = seed;
        this.runtime.dailyModifiers = mods;
        this.runtime.weaponType = 'sword';
        this.runtime.weapon = WeaponFactory.create('sword', this.runtime);
        this.runtime.skill = SkillFactory.create('sword');
        this.weaponLevels = { sword: 1, axe: 1, staff: 1, bow: 1, wand: 1 };
        this.weaponExp = { sword: 0, axe: 0, staff: 0, bow: 0, wand: 0 };

        let hpMult = 1, dmgMult = 1, _goldMult = 1, _enemySpeedMult = 1, _playerSpeedMult = 1, _noShield = false, _regenBoost = 0, _comboBoost = 0, _bossFast = false, _allElite = false;
        mods.forEach(m => m.apply({
            _goldMult, _enemySpeedMult, _playerSpeedMult, _noShield, _regenBoost, _comboBoost, _bossFast, _allElite,
            set _hpMult(v) { hpMult = v; }, get _hpMult() { return hpMult; },
            set _dmgMult(v) { dmgMult = v; }, get _dmgMult() { return dmgMult; }
        }));

        this.dailyModCache = { hpMult, dmgMult, _goldMult, _enemySpeedMult, _playerSpeedMult, _noShield, _regenBoost, _comboBoost, _bossFast, _allElite };
        this.runtime.hpMult = hpMult;
        this.runtime.dmgMult = dmgMult;
        if (_bossFast) this.runtime.gameSpeed = 1.5;
        this.runtime.updateMaxHp();
        this.runtime.hp = this.runtime.maxHp;

        this.createWeaponVisual('sword');
        this.skillIcon.setText(this.runtime.skill.icon);

        this.playerWorldX = 0;
        this.playerWorldY = 0;
        this.projectiles.forEach(p => p.destroy());
        this.projectiles = [];
        this.items.forEach(i => i.destroy());
        this.items = [];
        if (this.bossManager) this.bossManager.clear();
        if (this.enemyManager) this.enemyManager.clear();
        this.treasureChests = [];

        this.gameState = 'playing';
        this.startTime = this.time.now;
        this.lastWeaponSwitch = -2000;
        this.saveData.totalRuns++;
        SaveData.save(this.saveData);

        const descs = mods.map(m => `${m.icon}${m.name}: ${m.desc}`).join(' | ');
        this.showCenterText(`🌟 每日挑战开始！🌟\n${descs}`, '#ff88ff', 3500);
    }

    startGame(weaponType) {
        this.menuElements.forEach(e => e.destroy());
        this.menuElements = [];
        if (this.pauseElements) {
            this.pauseElements.forEach(e => e.destroy());
            this.pauseElements = [];
        }
        if (this.merchantDialog) {
            this.merchantDialog.forEach(e => e.destroy());
            this.merchantDialog = null;
        }
        if (this.bossManager) this.bossManager.clear();
        if (this.enemyManager) this.enemyManager.clear();

        this.runtime = new RuntimeData();
        this.runtime.weaponType = weaponType;
        this.runtime.weapon = WeaponFactory.create(weaponType, this.runtime);
        this.runtime.skill = SkillFactory.create(weaponType);
        // 从存档加载区域进度
        if (typeof this.saveData.currentRegion === 'number') {
            this.runtime.currentRegion = this.saveData.currentRegion;
        }
        if (Array.isArray(this.saveData.regionCleared)) {
            this.runtime.regionCleared = this.saveData.regionCleared.slice();
        }
        // 从存档加载武器技能槽选择
        if (this.saveData.weaponSkills && typeof this.saveData.weaponSkills === 'object') {
            this.runtime.weaponSkills = this.saveData.weaponSkills;
        }
        if (this.selectedDifficulty) {
            this.runtime.difficulty = this.selectedDifficulty.mult;
            this.runtime.difficultyName = this.selectedDifficulty.name;
        }
        this.weaponLevels = { sword: 1, axe: 1, staff: 1, bow: 1, wand: 1 };
        this.weaponExp = { sword: 0, axe: 0, staff: 0, bow: 0, wand: 0 };

        // ===== v5 应用局外养成效果（铁匠铺武器等级 + 10分支加点）=====
        const sd = this.saveData;
        sd.upgrades = sd.upgrades || {
            bloodlust: 0, berserk: 0, ironwall: 0, immortal: 0,
            shadowstep: 0, gale: 0, greed: 0, sage: 0, element: 0, summon: 0
        };
        sd.weaponLevels = sd.weaponLevels || {};
        const smithyLv = (sd.weaponLevels[weaponType] || 0);
        // v5：10 分支等级
        const u = sd.upgrades;
        const bloodLv = u.bloodlust || 0, berserkLv = u.berserk || 0;
        const ironLv = u.ironwall || 0, immortalLv = u.immortal || 0;
        const shadowLv = u.shadowstep || 0, galeLv = u.gale || 0;
        const greedLv = u.greed || 0, sageLv = u.sage || 0;
        const elementLv = u.element || 0, summonLv = u.summon || 0;
        // 武器永久强化：每级 +10% 基础伤害
        if (this.runtime.weapon && this.runtime.weapon.baseDmg) {
            this.runtime.weapon.baseDmg *= (1 + 0.10 * smithyLv);
        }
        // 存储所有分支等级供其他系统使用
        this.runtime.upgradeBonus = u;
        this.runtime._vitalityLv = ironLv;  // 铁壁影响生命
        this.runtime._agilityLv = galeLv;   // 疾风影响移速攻速
        this.runtime._wisdomLv = sageLv;    // 智者影响经验/商店
        // v5：新增分支标记
        this.runtime._bloodlustLv = bloodLv;
        this.runtime._berserkLv = berserkLv;
        this.runtime._immortalLv = immortalLv;
        this.runtime._shadowstepLv = shadowLv;
        this.runtime._greedLv = greedLv;
        this.runtime._elementLv = elementLv;
        this.runtime._summonLv = summonLv;
        // v5：复活次数 = 不朽等级
        this.runtime._reviveCharges = immortalLv;
        this.runtime._ironwallShieldApplied = 0;
        this.runtime._scene = this;
        // v5：火伤附魔加成（每级 +5% 火伤概率，固定 3 秒燃烧）
        this.runtime._elementBurnDps = elementLv > 0 ? 4 + elementLv * 3 : 0;
        this.runtime._elementBurnChance = elementLv > 0 ? 0.25 + elementLv * 0.1 : 0;

        this.runtime.updateMaxHp();
        this.runtime.hp = this.runtime.maxHp;

        this.createWeaponVisual(weaponType);
        this.skillIcon.setText(this.runtime.skill.icon);

        this.playerWorldX = 0;
        this.playerWorldY = 0;

        this.projectiles.forEach(p => p.destroy());
        this.projectiles = [];
        this.items.forEach(i => i.container && i.container.destroy());
        this.items = [];
        this.minions.forEach(m => m.destroy());
        this.minions = [];
        this.treasureChests.forEach(c => c.container && c.container.destroy());
        this.treasureChests = [];
        this.lastChestSpawn = 0;
        this.bossDamageBuff = false;

        if (this.saveData.unlockedMinions.includes('light')) {
            const m = new Minion(this, 'light');
            m.spawn(0, 0);
            this.minions.push(m);
        }
        // v5 影术加点：召唤暗影分身（每级 +1 个，最多 3 个）
        if (summonLv > 0) {
            const shadowCount = Math.min(3, summonLv);
            for (let i = 0; i < shadowCount; i++) {
                const sm = new Minion(this, 'shadow');
                sm.orbitRadius = 75 + i * 25;
                sm.orbitAngle = (i / shadowCount) * Math.PI * 2;
                sm.damage = 15 + summonLv * 5;
                sm.spawn(0, 0);
                this.minions.push(sm);
            }
        }

        this.gameState = 'playing';
        this.startTime = this.time.now;
        this.lastWeaponSwitch = -2000;
        this.saveData.totalRuns++;
        this.saveData.runCount = (this.saveData.runCount || 0) + 1; // 游戏轮次
        this.saveData.storyFlags = this.saveData.storyFlags || {};
        SaveData.save(this.saveData);

        // 触发当前区域剧情
        this.time.delayedCall(1500, () => {
            this.startChapterQuest();
        });

        this.audio.play('levelup');
        this.cameras.main.flash(500, 255, 255, 255);
        this.runtime.currentChapter = 0;
        this.chapterText.setText(`第1章: ${Chapters[0].name}`);
        this.particles.chapterBanner(Chapters[0]);
    }

    update(time, delta) {
        if (this.gameState !== 'playing' || this.paused) return;

        const gT = (time - this.startTime) / 1000;
        this.runtime.surviveTime = gT;

        // 章节检查
        const ch = Chapters.findIndex(c => gT >= c.timeStart && gT < c.timeEnd);
        if (ch >= 0 && ch !== this.runtime.currentChapter) {
            this.runtime.currentChapter = ch;
            this.particles.chapterBanner(Chapters[ch]);
            this.audio.play('chapter');
            this.chapterText.setText(`第${ch + 1}章: ${Chapters[ch].name}`);
            this.cameras.main.flash(800, Chapters[ch].color || 0xffffff, 50);
            const nextCh = Chapters[ch + 1];
            if (nextCh) {
                const remain = nextCh.timeStart - gT;
                this.showCenterText(`下一章「${nextCh.name}」还有 ${Math.ceil(remain)} 秒`, '#88ddff', 3000);
            }
            if (this.saveData.achievements.indexOf('ch_' + ch) === -1) {
                this.saveData.achievements.push('ch_' + ch);
                const ach = Achievements.find(a => a.id === 'ch_' + ch);
                if (ach) this.showAchievementUnlock(ach);
            }
        }

        if (this.runtime.comboTimer > 0) {
            this.runtime.comboTimer -= delta;
            if (this.runtime.comboTimer <= 0) this.runtime.resetCombo();
        }

        if (this.runtime.combo >= 15 && !this.rageMode) {
            this.rageMode = true;
            this.rageTimer = 8000;
            this.cameras.main.flash(300, 255, 100, 0);
            this.showCenterText('🔥 狂暴模式！🔥', '#ff4400', 1500);
            this.particles.explosion(this.player.x, this.player.y, 60, 0xff4400);
        }
        if (this.rageMode) {
            this.rageTimer -= delta;
            if (this.rageTimer <= 0) {
                this.rageMode = false;
                this.showCenterText('狂暴结束', '#888', 1000);
            }
        }

        if (this.runtime.invincibleTimer > 0) this.runtime.invincibleTimer -= delta;
        if (this.runtime.slowTimer > 0) this.runtime.slowTimer -= delta;
        if (this.runtime.stunTimer > 0) this.runtime.stunTimer -= delta;
        if (this.runtime.controlImmuneTimer > 0) this.runtime.controlImmuneTimer -= delta;
        if (this.blinkTimer > 0) this.blinkTimer -= delta;
        if (this.blinkCooldown > 0) this.blinkCooldown -= delta;
        if (this.emergencyShieldTimer > 0) {
            this.emergencyShieldTimer -= delta;
            if (this.emergencyShieldTimer <= 0) this.emergencyShieldActive = false;
        }
        if (this.emergencyShieldCooldown > 0) this.emergencyShieldCooldown -= delta;

        const s = this.runtime.spec;
        if ((s.regen || 0) > 0) {
            this.runtime.regenTimer += delta;
            if (this.runtime.regenTimer >= 1000) {
                this.runtime.regenTimer = 0;
                this.runtime.heal((s.regen || 0) * 2);
            }
        }

        this.movePlayer(delta);
        this.updateWeaponRotation();
        this.updateAttack(time);
        if (this.runtime.weapon) this.runtime.weapon.updateAnim(delta);

        this.enemyManager.update(gT, delta);
        this.bossManager.update(gT, delta);

        // 更新任务目标位置和方向箭头
        if (this.questTargets) {
            this.questTargets.forEach((qt, idx) => {
                if (qt.activated) return;
                // 更新屏幕坐标
                const sx = qt.worldX - this.playerWorldX + GW / 2;
                const sy = qt.worldY - this.playerWorldY + GH / 2;
                if (qt.obj) { qt.obj.x = sx; qt.obj.y = sy; }

                // v5：5 秒持续激活机制
                const dPlayer = Phaser.Math.Distance.Between(qt.worldX, qt.worldY, this.playerWorldX, this.playerWorldY);
                const inRange = dPlayer < 55;
                if (inRange) {
                    qt.activating = true;
                    qt.progress += delta;
                    // 激活期间每 1.2 秒生成守卫
                    if (gT - qt.lastGuardSpawn > 1200) {
                        qt.lastGuardSpawn = gT;
                        const region = REGIONS[this.runtime.currentRegion];
                        const ga = Math.random() * Math.PI * 2;
                        const gd = 100 + Math.random() * 60;
                        const e = new Enemy(this, region.enemyPool[Math.floor(Math.random() * region.enemyPool.length)]);
                        e.spawn(qt.worldX + Math.cos(ga) * gd, qt.worldY + Math.sin(ga) * gd);
                        if (Math.random() < 0.35) e.setElite(1);
                        this.enemyManager.enemies.push(e);
                    }
                    // 进度环显示
                    if (qt.progressRing) {
                        const ratio = Math.min(1, qt.progress / qt.activateTime);
                        qt.progressRing.setStrokeStyle(3, 0xffee88, 0.9);
                        qt.progressRing.setScale(1 + ratio * 0.3);
                    }
                    if (qt.progressText) {
                        const sec = Math.max(0, (qt.activateTime - qt.progress) / 1000).toFixed(1);
                        qt.progressText.setText(`激活中 ${sec}s`);
                    }
                    // 完成激活
                    if (qt.progress >= qt.activateTime) {
                        this.activateQuestTarget(qt, idx);
                        return;
                    }
                } else {
                    qt.activating = false;
                    // 离开时进度衰减（每秒 -500ms，但不清零）
                    qt.progress = Math.max(0, qt.progress - delta * 0.5);
                    if (qt.progressText) {
                        if (qt.progress > 0) {
                            qt.progressText.setText(`已中断 ${(qt.progress / 1000).toFixed(1)}s/5.0s`);
                        } else {
                            qt.progressText.setText('');
                        }
                    }
                    if (qt.progressRing && qt.progress === 0) {
                        qt.progressRing.setStrokeStyle(2, 0xffee88, 0);
                    }
                }

                // 如果在屏幕外，显示方向箭头
                const margin = 50;
                const onScreen = sx > margin && sx < GW - margin && sy > margin && sy < GH - margin;
                if (!onScreen) {
                    if (!qt.arrow) {
                        qt.arrow = this.add.text(0, 0, '➤', { fontSize: '24px', fill: '#44ff88' });
                        qt.arrow.setDepth(200);
                    }
                    // 钳制到屏幕边缘
                    const clampedX = Math.max(margin, Math.min(GW - margin, sx));
                    const clampedY = Math.max(margin, Math.min(GH - margin, sy));
                    qt.arrow.x = clampedX;
                    qt.arrow.y = clampedY;
                    // 计算角度
                    const angle = Math.atan2(sy - GH / 2, sx - GW / 2);
                    qt.arrow.setRotation(angle);
                    qt.arrow.setVisible(true);
                } else {
                    if (qt.arrow) qt.arrow.setVisible(false);
                }
            });
        }

        this.projectiles.forEach(p => p.update(delta, time));
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            if (!this.projectiles[i].alive) this.projectiles.splice(i, 1);
        }

        this.items.forEach(i => i.update(time, delta));
        this.attractItemsToPlayer(delta);
        for (let i = this.items.length - 1; i >= 0; i--) {
            if (!this.items[i].alive) this.items.splice(i, 1);
        }

        this.updateTreasureChests(time, delta);

        this.minions.forEach(m => m.update(time, delta));

        this.updateHUD();
        this.drawBackground();
        this.drawMiniMap();
        this.drawOffScreenIndicators();
        this.checkAchievements();
        this.updateSkillCD(time - this.startTime);
        this.updateComboDisplay();
        this.updateWeaponHUD();
        this.updateScreenShake(delta);
        this.updateWeaponBar();

        if (this.runtime.hp <= 0) this.gameOver();
    }

    updateTreasureChests(time, delta) {
        const gameTime = time - this.startTime;
        if (this.treasureChests.length < 5 &&
            gameTime - this.lastChestSpawn > this.chestSpawnInterval) {
            this.spawnTreasureChest();
            this.lastChestSpawn = gameTime;
        }
        this.treasureChests.forEach(c => c.update(time, delta));
        for (let i = this.treasureChests.length - 1; i >= 0; i--) {
            if (!this.treasureChests[i].alive) this.treasureChests.splice(i, 1);
        }
    }

    attractItemsToPlayer(delta) {
        const s = this.runtime.spec;
        const magnetRange = 80 + (s.magnet || 0) * 50;
        const pickupRange = 30;
        for (const item of this.items) {
            if (!item.alive) continue;
            const dx = this.playerWorldX - item.worldX;
            const dy = this.playerWorldY - item.worldY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < pickupRange) {
                item.pickup();
                continue;
            }
            if (dist < magnetRange) {
                const speed = 600 * (1 - dist / magnetRange);
                item.worldX += (dx / dist) * speed * delta / 1000;
                item.worldY += (dy / dist) * speed * delta / 1000;
                if (item.container) {
                    item.container.setScale(1.3);
                }
            } else if (item.container && item.container.scale > 1) {
                item.container.setScale(1);
            }
        }
    }

    spawnTreasureChest() {
        const angle = Math.random() * Math.PI * 2;
        const dist = 200 + Math.random() * 400;
        const x = this.playerWorldX + Math.cos(angle) * dist;
        const y = this.playerWorldY + Math.sin(angle) * dist;

        const r = Math.random();
        let rarity;
        if (r < 0.55) rarity = 'common';
        else if (r < 0.82) rarity = 'rare';
        else if (r < 0.95) rarity = 'epic';
        else rarity = 'legendary';

        const chest = new TreasureChest(this, x, y, rarity);
        this.treasureChests.push(chest);

        if (rarity === 'epic' || rarity === 'legendary') {
            this.showCenterText(`✨ ${rarity === 'legendary' ? '传说' : '史诗'}宝箱出现！`,
                rarity === 'legendary' ? '#ffd700' : '#cc66ff', 1500);
        }
    }

    movePlayer(delta) {
        const dt = delta / 1000;
        const s = this.runtime.spec;

        if (this.dashTimer > 0) {
            this.dashTimer -= delta;
            const dashSpeed = 1200;
            this.playerWorldX += this.lastDashDir.x * dashSpeed * dt;
            this.playerWorldY += this.lastDashDir.y * dashSpeed * dt;
            this.playerWorldX = Math.max(-WS / 2, Math.min(WS / 2, this.playerWorldX));
            this.playerWorldY = Math.max(-WS / 2, Math.min(WS / 2, this.playerWorldY));
            this.player.alpha = 0.6;
            this.player.x = GW / 2;
            if (Math.random() < 0.5) {
                this.particles.trail(this.player.x, this.player.y, 0xffff00, 0.5);
            }
            if (this.dashTimer <= 0) {
                this.player.alpha = 1;
                this.dashCooldown = 1500;
            }
            return;
        }
        if (this.dashCooldown > 0) this.dashCooldown -= delta;

        let speed = 240 * (1 + (s.speed || 0) * 0.12);
        // 敏捷加点：每级 +5% 移速
        if (this.runtime._agilityLv) speed *= (1 + 0.05 * this.runtime._agilityLv);
        if (this.rageMode) speed *= 1.4;
        if (this.runtime.slowTimer > 0) speed *= 0.5;
        if (this.runtime.stunTimer > 0) {
            speed *= 0.35;
            this.player.alpha = 0.55;
        }

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

            // 行走：上下颠簸 + 身体挤压 + 双腿交替摆动
            this._walkPhase += delta * 0.014;
            const bob = Math.sin(this._walkPhase * 2) * 3;
            this.player.y = GH / 2 + bob;
            if (this.playerBody) {
                const squash = 1 + Math.sin(this._walkPhase * 2) * 0.04;
                this.playerBody.scaleY = squash;
            }
            if (this.playerLegL && this.playerLegR) {
                this.playerLegL.rotation = Math.sin(this._walkPhase) * 0.5;
                this.playerLegR.rotation = -Math.sin(this._walkPhase) * 0.5;
            }
            // 披风飘动（行走时更剧烈）
            if (this.playerCape) this.playerCape.rotation = -0.1 + Math.sin(this._walkPhase * 1.5) * 0.12;
            if (this.playerCapeDark) this.playerCapeDark.rotation = -0.1 + Math.sin(this._walkPhase * 1.5) * 0.12;
        } else {
            // 待机：轻微呼吸
            this.player.y = GH / 2 + Math.sin(this.time.now * 0.004) * 1.5;
            if (this.playerBody) this.playerBody.scaleY = 1 + Math.sin(this.time.now * 0.004) * 0.02;
            if (this.playerLegL) this.playerLegL.rotation = 0;
            if (this.playerLegR) this.playerLegR.rotation = 0;
            // 披风轻摆
            if (this.playerCape) this.playerCape.rotation = Math.sin(this.time.now * 0.003) * 0.05;
            if (this.playerCapeDark) this.playerCapeDark.rotation = Math.sin(this.time.now * 0.003) * 0.05;
        }

        // 眨眼：每 3-5 秒眨一次
        this._blinkTimer -= delta;
        if (this._blinkTimer <= 0) {
            this._blinkTimer = 3000 + Math.random() * 2000;
            if (this.playerEyes) this.playerEyes.forEach(e => e.scaleY = 0.2);
            if (this.playerEyeShines) this.playerEyeShines.forEach(e => e.setVisible(false));
            this.time.delayedCall(120, () => {
                if (this.playerEyes) this.playerEyes.forEach(e => e.scaleY = 1);
                if (this.playerEyeShines) this.playerEyeShines.forEach(e => e.setVisible(true));
            });
        }

        if (this.runtime.invincibleTimer > 0) {
            this.player.alpha = Math.sin(this.time.now * 0.05) > 0 ? 0.5 : 1;
        } else {
            this.player.alpha = 1;
        }
    }

    tryDash() {
        if (this.gameState !== 'playing' || this.paused) return;
        if (this.dashTimer > 0 || this.dashCooldown > 0) return;
        if (this.runtime.stunTimer > 0) return;

        let dx = 0, dy = 0;
        if (this.keys.W.isDown) dy -= 1;
        if (this.keys.S.isDown) dy += 1;
        if (this.keys.A.isDown) dx -= 1;
        if (this.keys.D.isDown) dx += 1;

        if (dx === 0 && dy === 0) {
            const angle = this.mousePos ? Math.atan2(this.mousePos.y - GH / 2, this.mousePos.x - GW / 2) : 0;
            dx = Math.cos(angle);
            dy = Math.sin(angle);
        } else {
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len; dy /= len;
        }

        this.lastDashDir = { x: dx, y: dy };
        // v5 影步加点：每级 +80ms 冲刺无敌时间和 +100ms 冲刺距离
        const shadowLv = this.runtime._shadowstepLv || 0;
        this.dashTimer = 250 + shadowLv * 100;
        this.runtime.invincibleTimer = Math.max(this.runtime.invincibleTimer, 250 + shadowLv * 80);
        this.audio.play('dash');
        this.particles.explosion(this.player.x, this.player.y, 30, 0xffff44);
    }

    tryBlink() {
        if (this.gameState !== 'playing' || this.paused) return;
        if (this.blinkCooldown > 0 || this.blinkTimer > 0) return;
        if (this.runtime.stunTimer > 0) return;

        let dx = 0, dy = 0;
        if (this.keys.W.isDown) dy -= 1;
        if (this.keys.S.isDown) dy += 1;
        if (this.keys.A.isDown) dx -= 1;
        if (this.keys.D.isDown) dx += 1;

        if (dx === 0 && dy === 0) {
            const angle = Math.atan2(this.mousePos.y - GH / 2, this.mousePos.x - GW / 2);
            dx = Math.cos(angle);
            dy = Math.sin(angle);
        } else {
            const len = Math.sqrt(dx * dx + dy * dy);
            dx /= len; dy /= len;
        }

        this.playerWorldX += dx * this.blinkDistance;
        this.playerWorldY += dy * this.blinkDistance;
        this.playerWorldX = Math.max(-WS / 2, Math.min(WS / 2, this.playerWorldX));
        this.playerWorldY = Math.max(-WS / 2, Math.min(WS / 2, this.playerWorldY));

        this.blinkTimer = 150;
        this.blinkCooldown = 2500;
        this.runtime.invincibleTimer = Math.max(this.runtime.invincibleTimer, 250);

        const startX = this.player.x, startY = this.player.y;
        this.particles.explosion(startX, startY, 25, 0xaa00ff);
        this.time.delayedCall(80, () => {
            this.particles.explosion(this.player.x, this.player.y, 25, 0xff00ff);
        });
        this.audio.play('dash');
    }

    tryEmergencyShield() {
        if (this.gameState !== 'playing' || this.paused) return;
        if (this.emergencyShieldCooldown > 0) return;
        this.activateEmergencyShield();
    }

    activateEmergencyShield() {
        this.emergencyShieldActive = true;
        this.emergencyShieldTimer = 2500;
        this.emergencyShieldCooldown = 90000;
        this.runtime.invincibleTimer = Math.max(this.runtime.invincibleTimer, 2500);
        this.runtime.hp = Math.max(this.runtime.hp, this.runtime.maxHp * 0.4);
        this.cameras.main.flash(400, 0, 200, 255);
        this.showCenterText('🛡 应急护盾！🛡', '#00ddff', 1200);
        this.particles.explosion(this.player.x, this.player.y, 80, 0x00ffff);
        this.audio.play('levelup');
    }

    quickSwitchWeapon(idx) {
        if (this.gameState !== 'playing' || this.paused) return;
        const unlocked = this.saveData.unlockedWeapons;
        if (idx >= unlocked.length) return;
        this.switchWeapon(unlocked[idx]);
    }

    drawMiniMap() {
        if (this.gameState !== 'playing') return;
        if (!this.miniMapGraphics) {
            this.miniMapGraphics = this.add.graphics();
            this.miniMapGraphics.setDepth(150);
            this.miniMapGraphics.setScrollFactor(0);
        }
        const g = this.miniMapGraphics;
        g.clear();
        // 增大迷你地图：从 110x110 增大到 160x160，位置调整到更明显
        const mmX = GW - 170, mmY = 80, mmW = 160, mmH = 160;
        const scale = 0.12; // 增大缩放比例，显示更大范围

        // 背景更不透明，边框更粗
        g.fillStyle(0x0a0a18, 0.92);
        g.fillRect(mmX, mmY, mmW, mmH);
        g.lineStyle(3, 0x6666aa, 1);
        g.strokeRect(mmX, mmY, mmW, mmH);
        
        // 添加标题文字背景条
        g.fillStyle(0x222244, 0.95);
        g.fillRect(mmX, mmY, mmW, 18);
        g.fillStyle(0xffffff, 0.9);
        g.fillRoundedRect(mmX + 2, mmY + 2, mmW - 4, 14, 2);

        const toMm = (wx, wy) => ({
            x: mmX + mmW / 2 + (wx - this.playerWorldX) * scale,
            y: mmY + mmH / 2 + (wy - this.playerWorldY) * scale
        });

        // 宝箱：增大显示尺寸
        if (this.treasureChests) {
            for (const chest of this.treasureChests) {
                if (!chest.alive) continue;
                const p = toMm(chest.worldX, chest.worldY);
                if (p.x < mmX || p.x > mmX + mmW || p.y < mmY || p.y > mmY + mmH) continue;
                const color = chest.rarity === 'legendary' ? 0xffd700 :
                              chest.rarity === 'epic' ? 0xcc66ff :
                              chest.rarity === 'rare' ? 0x4488ff : 0xffffff;
                g.fillStyle(color, 1);
                g.fillRect(p.x - 3, p.y - 3, 6, 6); // 从 4x4 增大到 6x6
            }
        }

        // 敌人：增大显示尺寸
        if (this.enemyManager) {
            for (const e of this.enemyManager.enemies) {
                if (!e.alive) continue;
                const p = toMm(e.worldX, e.worldY);
                if (p.x < mmX || p.x > mmX + mmW || p.y < mmY || p.y > mmY + mmH) continue;
                g.fillStyle(0xff4444, 0.95);
                g.fillCircle(p.x, p.y, 2.5); // 从 1.5 增大到 2.5
            }
        }

        // BOSS：增大显示尺寸
        if (this.bossManager && this.bossManager.boss && this.bossManager.boss.alive) {
            const b = this.bossManager.boss;
            const p = toMm(b.worldX, b.worldY);
            g.fillStyle(0xff0000, 1);
            g.fillCircle(p.x, p.y, 5); // 从 3 增大到 5
            // 添加BOSS光环
            g.lineStyle(2, 0xff0000, 0.6);
            g.strokeCircle(p.x, p.y, 8);
        }

        // 玩家：增大显示尺寸，添加光环
        g.fillStyle(this.rageMode ? 0xff4400 : 0x00ff88, 1);
        g.fillCircle(mmX + mmW / 2, mmY + mmH / 2, 4); // 从 2 增大到 4
        g.lineStyle(1, 0xffffff, 0.8);
        g.strokeCircle(mmX + mmW / 2, mmY + mmH / 2, 6);
    }

    drawOffScreenIndicators() {
        if (this.gameState !== 'playing') return;
        if (!this.indicatorsGraphics) {
            this.indicatorsGraphics = this.add.graphics();
            this.indicatorsGraphics.setDepth(149);
            this.indicatorsGraphics.setScrollFactor(0);
        }
        const g = this.indicatorsGraphics;
        g.clear();
        const cx = GW / 2, cy = GH / 2;
        const margin = 60;
        const drawArrow = (tx, ty, color, size) => {
            const dx = tx - this.playerWorldX;
            const dy = ty - this.playerWorldY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 350) return;
            const angle = Math.atan2(dy, dx);
            const screenW = GW / 2 - margin;
            const screenH = GH / 2 - margin;
            const t = Math.min(screenW / Math.abs(Math.cos(angle) || 0.01),
                              screenH / Math.abs(Math.sin(angle) || 0.01));
            const edgeX = cx + Math.cos(angle) * t;
            const edgeY = cy + Math.sin(angle) * t;
            g.fillStyle(color, 0.9);
            g.fillCircle(edgeX, edgeY, size);
            g.lineStyle(2, color, 0.5);
            g.lineBetween(edgeX, edgeY,
                edgeX - Math.cos(angle) * 25,
                edgeY - Math.sin(angle) * 25);
        };
        if (this.treasureChests) {
            for (const c of this.treasureChests) {
                if (!c.alive) continue;
                const color = c.rarity === 'legendary' ? 0xffd700 :
                              c.rarity === 'epic' ? 0xcc66ff :
                              c.rarity === 'rare' ? 0x4488ff : 0xffffff;
                drawArrow(c.worldX, c.worldY, color, 4);
            }
        }
        if (this.bossManager && this.bossManager.boss && this.bossManager.boss.alive) {
            const b = this.bossManager.boss;
            drawArrow(b.worldX, b.worldY, 0xff0000, 7);
        }
    }

    updateWeaponRotation() {
        if (!this.mousePos) return;
        const angle = Math.atan2(this.mousePos.y - GH / 2, this.mousePos.x - GW / 2);
        const w = this.runtime.weapon;
        const anim = w ? w.attackAnim : 0;

        this.weaponContainer.x = 28;
        this.weaponContainer.y = 2;

        let displayAngle = angle;
        let displayScale = 1;

        if (w && (w.type === 'melee_arc' || w.type === 'melee_stab')) {
            if (w.type === 'melee_arc') {
                const swingStart = angle - 1.0;
                const swingEnd = angle + 0.3;
                displayAngle = Phaser.Math.Linear(swingStart, swingEnd, 1 - anim);
            } else {
                displayAngle = angle;
            }
            displayScale = 1 + (1 - anim) * 0.08;
            this.weaponContainer.x = 28 + Math.cos(angle) * (1 - anim) * 3;
            this.weaponContainer.y = 2 + Math.sin(angle) * (1 - anim) * 2;
        } else {
            displayScale = 1 + anim * 0.15;
        }

        this.weaponContainer.rotation = displayAngle;
        this.weaponContainer.scale = displayScale;

        if (this.rageMode) {
            const pulse = 1 + Math.sin(this.time.now * 0.015) * 0.1;
            this.playerBody && (this.playerBody.scaleY = pulse);
            this.playerBody && this.playerBody.setFillStyle(0xff6644);
            this.playerHead && this.playerHead.setFillStyle(0xff8866);
        } else if (this.runtime.hp < this.runtime.maxHp * 0.3) {
            const blink = Math.sin(this.time.now * 0.008) > 0;
            this.playerBody && this.playerBody.setFillStyle(blink ? 0xff4444 : 0x3366cc);
            this.playerHead && this.playerHead.setFillStyle(blink ? 0xff8888 : 0xffcc99);
        } else {
            this.playerBody && this.playerBody.setFillStyle(0x3366cc);
            this.playerHead && this.playerHead.setFillStyle(0xffcc99);
        }

        if (angle > Math.PI / 2 || angle < -Math.PI / 2) {
            this.player.scaleX = -1;
            this.weaponContainer.scaleY = -displayScale;
        } else {
            this.player.scaleX = 1;
            this.weaponContainer.scaleY = displayScale;
        }
    }

    updateAttack(time) {
        const w = this.runtime.weapon;
        if (!w) return;
        const wlvl = this.weaponLevels[this.runtime.weaponType] || 1;
        if (!w.canAttack(time, this.runtime.spec, wlvl)) return;
        if (this.runtime.stunTimer > 0) return;

        const cd = w.getCooldown(this.runtime.spec, wlvl);
        // v5 疾风加点：每级 +4% 攻速
        const galeLv = this.runtime._agilityLv || 0;
        const actualCd = cd / (1 + 0.04 * galeLv);
        if (time - w.lastAttack < actualCd) return;
        w.attack(time);

        let angle;
        let tx, ty;

        const p = this.mousePos;
        if (p) {
            tx = this.playerWorldX + (p.x - GW / 2);
            ty = this.playerWorldY + (p.y - GH / 2);
            const mouseDist = Math.sqrt((p.x - GW / 2) ** 2 + (p.y - GH / 2) ** 2);
            
            if (mouseDist < 30) {
                const nearest = this.getNearestEnemy();
                if (nearest) {
                    angle = Math.atan2(nearest.worldY - this.playerWorldY, nearest.worldX - this.playerWorldX);
                    tx = nearest.worldX;
                    ty = nearest.worldY;
                } else {
                    angle = Math.atan2(ty - this.playerWorldY, tx - this.playerWorldX);
                }
            } else {
                angle = Math.atan2(ty - this.playerWorldY, tx - this.playerWorldX);
                
                if (w.type === 'melee_arc') {
                    const range = w.getRange(wlvl);
                    const enemiesInRange = this.enemyManager.getEnemiesInRadius(this.playerWorldX, this.playerWorldY, range + 50);
                    if (enemiesInRange.length > 0) {
                        let bestEnemy = null;
                        let bestDiff = Math.PI;
                        for (const e of enemiesInRange) {
                            const enemyAngle = Math.atan2(e.worldY - this.playerWorldY, e.worldX - this.playerWorldX);
                            const diff = Math.abs(Phaser.Math.Angle.Wrap(angle - enemyAngle));
                            if (diff < bestDiff) {
                                bestDiff = diff;
                                bestEnemy = e;
                            }
                        }
                        if (bestEnemy && bestDiff < Math.PI / 3) {
                            angle = Math.atan2(bestEnemy.worldY - this.playerWorldY, bestEnemy.worldX - this.playerWorldX);
                        }
                    }
                }
            }
        } else {
            const nearest = this.getNearestEnemy();
            if (nearest) {
                angle = Math.atan2(nearest.worldY - this.playerWorldY, nearest.worldX - this.playerWorldX);
                tx = nearest.worldX;
                ty = nearest.worldY;
            } else {
                angle = this.lastAttackAngle || 0;
                tx = this.playerWorldX + Math.cos(angle) * 100;
                ty = this.playerWorldY + Math.sin(angle) * 100;
            }
        }

        this.lastAttackAngle = angle;

        const baseDmg = w.getDamage(wlvl, this.runtime.spec);
        const dmgBoost = 1 + (wlvl - 1) * 0.04;
        const isCrit = Math.random() < w.getCritChance(this.runtime.spec, wlvl);
        let damage = isCrit ? Math.floor(baseDmg * w.getCritDamage(this.runtime.spec, wlvl)) : baseDmg;
        damage = Math.floor(damage * this.runtime.comboMultiplier * dmgBoost);

        const elementEffect = this.getElementEffect(wlvl);

        const sndMap = { sword: 'sword', axe: 'axe', staff: 'staff', bow: 'bow', wand: 'wand' };
        this.audio.play(sndMap[this.runtime.weaponType] || 'sword');

        switch (w.type) {
            case 'melee_arc':
                this.performMeleeAttack(angle, damage, isCrit, w, wlvl, elementEffect);
                break;
            case 'ranged_line':
                this.performLineAttack(angle, damage, isCrit, w, wlvl, elementEffect);
                break;
            case 'ranged_projectile':
                this.performProjectileAttack(angle, damage, isCrit, w, tx, ty, wlvl, elementEffect);
                break;
            case 'ranged_bounce':
                this.performWandAttack(angle, damage, isCrit, w, wlvl, elementEffect);
                break;
        }

        // 移除暴击屏幕震动（用户反馈过于频繁）
    }

    getElementEffect(wlvl) {
        const w = this.runtime.weapon;
        const spec = this.runtime.spec;
        const promo = (this.runtime.weaponPromotions && this.runtime.weaponPromotions[w.id]) || 0;
        const effect = {};
        if (w.id === 'sword') {
            effect.bloodLoss = {
                dps: 0.4 + wlvl * 0.08,
                duration: 3000 + wlvl * 300,
                stacks: wlvl >= 4 ? 3 : 1
            };
            if (wlvl >= 7) effect.combo = { threshold: 5, damageBonus: 2.0 };
            if (wlvl >= 10) effect.bloodBurst = { radius: 80, multiplier: 10 };
        }
        if (w.id === 'axe') {
            effect.stun = { chance: 0.15 + wlvl * 0.03, duration: 600 + wlvl * 100 };
            effect.burn = {
                dps: 12 + wlvl * 4,
                duration: 3000,
                stacks: wlvl >= 4 ? 5 : 1
            };
            if (wlvl >= 7) effect.fireField = { radius: 60 + (wlvl - 7) * 15, duration: 3000, dps: 15 + wlvl * 4 };
            if (wlvl >= 10) effect.fireExplosion = { radius: 150, multiplier: 5 };
        }
        if (w.id === 'staff') {
            effect.slow = { amount: 0.5 + wlvl * 0.04, duration: 1500 + wlvl * 200 };
            if (wlvl >= 5) effect.freeze = { chance: 0.1 + (wlvl - 5) * 0.05, duration: 1000 };
            if (wlvl >= 7) effect.iceField = { radius: 80, duration: 1500 + (wlvl - 7) * 300, slow: 0.8 };
            if (wlvl >= 10) effect.iceExecute = true;
        }
        if (w.id === 'bow') {
            effect.armorPierce = 0.2 + wlvl * 0.05;
            if (wlvl >= 4) effect.critDouble = true;
            if (wlvl >= 7) effect.mark = { damageBonus: 0.3, duration: 3000 + (wlvl - 7) * 500 };
        }
        if (w.id === 'wand') {
            effect.burn = { dps: 6 + wlvl * 2, duration: 2000 };
            effect.slow = { amount: 0.2 + wlvl * 0.03, duration: 800 };
            if (wlvl >= 4) effect.resonance = true;
            if (wlvl >= 7) effect.arcaneMark = { damagePct: 0.5 + (wlvl - 7) * 0.15, delay: 3000 };
            if (wlvl >= 10) effect.elementStorm = true;
        }
        if (spec.fire) effect.burn = { dps: 16 + wlvl * 4, duration: 4000 };
        if (spec.ice) effect.freeze = { chance: 0.25, duration: 1200 };
        if (spec.lightning) effect.chain = { count: 3, damagePct: 0.5 };
        if (spec.shadow) effect.shadow = { damagePct: 0.3 };
        return effect;
    }

    getNearestEnemy() {
        let nearest = null;
        let minDist = Infinity;
        const enemies = this.enemyManager.enemies.filter(e => e.alive);
        for (const e of enemies) {
            const dist = Phaser.Math.Distance.Between(this.playerWorldX, this.playerWorldY, e.worldX, e.worldY);
            if (dist < minDist) {
                minDist = dist;
                nearest = e;
            }
        }
        return nearest;
    }

    performMeleeAttack(angle, damage, isCrit, w, wlvl = 1, elementEffect = {}) {
        const range = w.getRange(wlvl);
        const arc = w.getArc(wlvl);
        const lifeSteal = w.getLifeSteal(wlvl);
        this.particles.slash(GW / 2, GH / 2, angle, w.color, range, arc);

        // v5 狂暴加点：HP < 30% 时每级 +12% 伤害
        let dmgBonus = 1;
        const berserkLv = this.runtime._berserkLv || 0;
        if (berserkLv > 0 && this.runtime.hp < this.runtime.maxHp * 0.3) {
            dmgBonus *= (1 + 0.12 * berserkLv);
        }
        const finalDamage = Math.floor(damage * dmgBonus);

        let hitCount = 0;
        const hits = this.enemyManager.getEnemiesInArc(
            this.playerWorldX, this.playerWorldY, range, angle, arc
        );
        hits.forEach(e => {
            const died = e.takeDamage(finalDamage, isCrit, elementEffect.armorPierce || 0);
            hitCount++;
            this.applyElementEffect(e, elementEffect, finalDamage);
            this.applyV5ElementBurn(e);
            this.particles.hit(
                e.worldX - this.playerWorldX + GW / 2,
                e.worldY - this.playerWorldY + GH / 2,
                w.color, 8, 3
            );
            if (died) this.addWeaponExp(this.runtime.weaponType, 1);
        });

        if (this.bossManager.boss && this.bossManager.boss.alive) {
            const b = this.bossManager.boss;
            const d = Phaser.Math.Distance.Between(this.playerWorldX, this.playerWorldY, b.worldX, b.worldY);
            if (d <= range) {
                const ba = Math.atan2(b.worldY - this.playerWorldY, b.worldX - this.playerWorldX);
                let diff = ba - angle;
                while (diff > Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;
                if (Math.abs(diff) <= arc / 2) {
                    const bossDmg = this.bossDamageBuff ? Math.floor(finalDamage * 1.5) : finalDamage;
                    b.takeDamage(bossDmg, isCrit, elementEffect.armorPierce || 0);
                    hitCount++;
                    this.applyElementEffect(b, elementEffect, bossDmg);
                    this.applyV5ElementBurn(b);
                }
            }
        }
        // 命中幻影/分裂体
        this.bossManager.alivePhantoms.forEach(b => {
            const d = Phaser.Math.Distance.Between(this.playerWorldX, this.playerWorldY, b.worldX, b.worldY);
            if (d <= range) {
                const ba = Math.atan2(b.worldY - this.playerWorldY, b.worldX - this.playerWorldX);
                let diff = ba - angle;
                while (diff > Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;
                if (Math.abs(diff) <= arc / 2) {
                    const bossDmg = this.bossDamageBuff ? Math.floor(finalDamage * 1.5) : finalDamage;
                    b.takeDamage(bossDmg, isCrit, elementEffect.armorPierce || 0);
                    hitCount++;
                    this.applyElementEffect(b, elementEffect, bossDmg);
                    this.applyV5ElementBurn(b);
                }
            }
        });

        if (lifeSteal > 0 && hitCount > 0) {
            const heal = Math.floor(finalDamage * lifeSteal * hitCount);
            if (heal > 0) {
                this.runtime.heal(heal);
                this.particles.healEffect(GW / 2, GH / 2 - 30);
            }
        }
        // v5 嗜血加点：暴击时回血（每级 4% 伤害）
        const bloodLv = this.runtime._bloodlustLv || 0;
        if (isCrit && bloodLv > 0 && hitCount > 0) {
            const heal = Math.floor(finalDamage * 0.04 * bloodLv * hitCount);
            if (heal > 0) {
                this.runtime.heal(heal);
                this.particles.healEffect(GW / 2, GH / 2 - 30);
                this.showDamageNumber(GW / 2, GH / 2 - 50, heal, true, false, '#ff6688', '+');
            }
        }
        // v5 武器形态进化：form 3（分身协同）/ form 4（黑炎附魔）
        const form = w.getForm ? w.getForm() : 0;
        if (form >= 3 && hitCount > 0 && Math.random() < 0.35) {
            // 分身追加一次攻击（50% 伤害）
            const shadowDmg = Math.floor(finalDamage * 0.5);
            const shadowHits = this.enemyManager.getEnemiesInArc(
                this.playerWorldX, this.playerWorldY, range, angle, arc
            );
            shadowHits.forEach(e => {
                if (e.alive) {
                    e.takeDamage(shadowDmg, false, elementEffect.armorPierce || 0);
                    this.particles.hit(
                        e.worldX - this.playerWorldX + GW / 2,
                        e.worldY - this.playerWorldY + GH / 2,
                        0x8844cc, 6, 2
                    );
                }
            });
            this.particles.slash(GW / 2, GH / 2, angle, 0x8844cc, range, arc);
            this.showCenterText('◈ 影分身追击', '#aa66ff', 600);
        }
        if (form >= 4 && hitCount > 0) {
            // 黑炎：每击必触发燃烧 + 视觉特效
            this.particles.explosion(GW / 2, GH / 2, 15, 0x660066);
            hits.forEach(e => {
                if (e.alive && e.applyBurn) {
                    e.applyBurn(finalDamage * 0.2, 4000);
                }
            });
        }

        // 命中不再给武器经验，仅击杀给
        if (isCrit) this.audio.play('crit');
    }

    // v5 火伤附魔：基于 element 加点概率触发燃烧
    applyV5ElementBurn(target) {
        if (!target || !target.alive) return;
        const chance = this.runtime._elementBurnChance || 0;
        const dps = this.runtime._elementBurnDps || 0;
        if (dps > 0 && Math.random() < chance && target.applyBurn) {
            target.applyBurn(dps, 3000);
        }
    }

    applyElementEffect(target, effect, baseDamage) {
        if (!target || !target.alive) return;
        if (effect.bloodLoss && target.applyBleed) {
            target.applyBleed(Math.floor(baseDamage * effect.bloodLoss.dps), effect.bloodLoss.duration);
        }
        if (effect.burn && target.applyBurn) {
            target.applyBurn(Math.floor(effect.burn.dps), effect.burn.duration);
        }
        if (effect.slow && target.applySlow) {
            target.applySlow(effect.slow.duration, effect.slow.amount);
        }
        if (effect.freeze && target.applyFreeze && Math.random() < effect.freeze.chance) {
            target.applyFreeze(effect.freeze.duration);
        }
        if (effect.stun && target.applyStun && Math.random() < effect.stun.chance) {
            target.applyStun(effect.stun.duration);
        }
        if (effect.shadow && target.takeDamage) {
            target.takeDamage(Math.floor(baseDamage * effect.shadow.damagePct), false);
        }
    }

    performLineAttack(angle, damage, isCrit, w, wlvl = 1, elementEffect = {}) {
        const range = w.getRange(wlvl);
        const projCount = w.getProjectileCount(wlvl);

        // v5 狂暴加点：HP < 30% 时每级 +12% 伤害
        let dmgBonus = 1;
        const berserkLv = this.runtime._berserkLv || 0;
        if (berserkLv > 0 && this.runtime.hp < this.runtime.maxHp * 0.3) {
            dmgBonus *= (1 + 0.12 * berserkLv);
        }
        const finalDamage = Math.floor(damage * dmgBonus);
        let hitCount = 0;

        for (let i = 0; i < projCount; i++) {
            const spread = (i - (projCount - 1) / 2) * 0.12;
            const ang = angle + spread;
            const endX = this.playerWorldX + Math.cos(ang) * range;
            const endY = this.playerWorldY + Math.sin(ang) * range;

            this.particles.lineBeam(GW / 2, GH / 2,
                GW / 2 + Math.cos(ang) * range,
                GH / 2 + Math.sin(ang) * range,
                w.color, w.width);

            const hits = this.enemyManager.getEnemiesOnLine(
                this.playerWorldX, this.playerWorldY, endX, endY, w.width
            );
            hits.forEach(e => {
                const died = e.takeDamage(finalDamage, isCrit, elementEffect.armorPierce || 0);
                this.applyElementEffect(e, elementEffect, finalDamage);
                this.applyV5ElementBurn(e);
                hitCount++;
                if (died) this.addWeaponExp(this.runtime.weaponType, 1);
            });

            if (this.bossManager.boss && this.bossManager.boss.alive) {
                const b = this.bossManager.boss;
                if (this.enemyManager.pointToLineDistance(
                    b.worldX, b.worldY,
                    this.playerWorldX, this.playerWorldY, endX, endY
                ) <= w.width + b.hitRadius) {
                    const bossDmg = this.bossDamageBuff ? Math.floor(finalDamage * 1.5) : finalDamage;
                    b.takeDamage(bossDmg, isCrit, elementEffect.armorPierce || 0);
                    this.applyElementEffect(b, elementEffect, bossDmg);
                    this.applyV5ElementBurn(b);
                    hitCount++;
                }
            }
            // 命中幻影/分裂体
            this.bossManager.alivePhantoms.forEach(b => {
                if (this.enemyManager.pointToLineDistance(
                    b.worldX, b.worldY,
                    this.playerWorldX, this.playerWorldY, endX, endY
                ) <= w.width + b.hitRadius) {
                    const bossDmg = this.bossDamageBuff ? Math.floor(finalDamage * 1.5) : finalDamage;
                    b.takeDamage(bossDmg, isCrit, elementEffect.armorPierce || 0);
                    this.applyElementEffect(b, elementEffect, bossDmg);
                    this.applyV5ElementBurn(b);
                    hitCount++;
                }
            });
        }

        // v5 嗜血加点：暴击时回血（每级 4% 伤害）
        const bloodLv = this.runtime._bloodlustLv || 0;
        if (isCrit && bloodLv > 0 && hitCount > 0) {
            const heal = Math.floor(finalDamage * 0.04 * bloodLv * hitCount);
            if (heal > 0) {
                this.runtime.heal(heal);
                this.particles.healEffect(GW / 2, GH / 2 - 30);
                this.showDamageNumber(GW / 2, GH / 2 - 50, heal, true, false, '#ff6688', '+');
            }
        }

        // 命中不再给武器经验
        if (isCrit) this.audio.play('crit');
    }

    performProjectileAttack(angle, damage, isCrit, w, tx, ty, wlvl = 1, elementEffect = {}) {
        const pierce = w.getPierce(wlvl);
        this.projectiles.push(new Projectile(
            this, this.playerWorldX, this.playerWorldY, tx, ty,
            damage, 'arrow',
            {
                speed: 700, color: w.color, glowColor: w.glowColor,
                pierce: pierce, size: 6, elementEffect: elementEffect
            }
        ));
        // 命中不再给武器经验
    }

    performWandAttack(angle, damage, isCrit, w, wlvl = 1, elementEffect = {}) {
        const projCount = w.getProjectileCount(wlvl);
        const bounce = w.getBounceCount(wlvl);
        for (let i = 0; i < projCount; i++) {
            const offset = (i - (projCount - 1) / 2) * 0.3;
            this.projectiles.push(new Projectile(
                this, this.playerWorldX, this.playerWorldY,
                this.playerWorldX + Math.cos(angle + offset) * w.range,
                this.playerWorldY + Math.sin(angle + offset) * w.range,
                damage, 'magic',
                {
                    speed: 420, color: w.color, glowColor: w.glowColor,
                    bounce: bounce, tracking: true, size: 7,
                    elementEffect: elementEffect
                }
            ));
        }
        // 命中不再给武器经验
    }

    addWeaponExp(weaponType, amount) {
        if (!this.weaponLevels[weaponType]) this.weaponLevels[weaponType] = 1;
        const cur = this.weaponLevels[weaponType];
        if (cur >= 10) return;
        if (!this.weaponExp[weaponType]) this.weaponExp[weaponType] = 0;
        this.weaponExp[weaponType] += amount;
        const needTable = [40, 70, 110, 170, 250, 360, 520, 750, 1100];
        const need = needTable[cur - 1] || 999;
        if (this.weaponExp[weaponType] >= need) {
            this.weaponExp[weaponType] -= need;
            this.weaponLevels[weaponType] = Math.min(10, cur + 1);
            const info = WeaponFactory.info(weaponType);
            const colorHex = '#' + info.color.toString(16).padStart(6, '0');
            // 显示具体数值变化
            const tmpW = WeaponFactory.create(weaponType, this.runtime);
            const oldDmg = tmpW.baseDmg + tmpW.getDamageGrowth(cur);
            const newDmg = tmpW.baseDmg + tmpW.getDamageGrowth(this.weaponLevels[weaponType]);
            this.showCenterText(
                `${info.name} Lv.${this.weaponLevels[weaponType]}! 攻击力 ${oldDmg}→${newDmg}`,
                colorHex
            );
            this.particles.explosion(GW / 2, GH / 2, 40, info.color);
            this.audio.play('levelup');
            // 升级到Lv3/Lv6/Lv9时触发技能选择
            const newLevel = this.weaponLevels[weaponType];
            if (newLevel === 3 || newLevel === 6 || newLevel === 9) {
                const slotIdx = newLevel === 3 ? 0 : (newLevel === 6 ? 1 : 2);
                this.showWeaponSkillChoice(weaponType, slotIdx);
            }
        }
    }

    showWeaponSkillChoice(weaponType, slotIdx) {
        const options = WEAPON_SKILLS[weaponType];
        if (!options || !options[slotIdx]) return;
        const choices = options[slotIdx];

        // 暂停游戏
        this.paused = true;
        this._enterPause();

        // 创建半透明背景
        const bg = this.add.rectangle(0, 0, GW, GH, 0x000000, 0.8);
        bg.setOrigin(0, 0).setDepth(2000);

        const info = WeaponFactory.info(weaponType);
        const colorHex = '#' + info.color.toString(16).padStart(6, '0');

        // 标题
        const title = this.add.text(GW / 2, 80, `${info.name} 技能选择`, {
            fontSize: '28px', fill: colorHex
        }).setOrigin(0.5).setDepth(2001);

        // 副标题
        const subtitle = this.add.text(GW / 2, 120, `选择一个技能（槽位${slotIdx + 1}）`, {
            fontSize: '16px', fill: '#aaaaaa'
        }).setOrigin(0.5).setDepth(2001);

        // 选项卡片
        const cardW = 300, cardH = 200;
        const startY = 180;
        const cards = [];
        choices.forEach((choice, i) => {
            const x = GW / 2 + (i - 0.5) * (cardW + 40);
            const card = this.add.rectangle(x, startY + cardH / 2, cardW, cardH, 0x222244, 0.9)
                .setStrokeStyle(2, 0x4466aa).setDepth(2001);
            const name = this.add.text(x, startY + 30, choice.name, {
                fontSize: '22px', fill: '#ffdd44'
            }).setOrigin(0.5).setDepth(2002);
            const desc = this.add.text(x, startY + 90, choice.desc, {
                fontSize: '16px', fill: '#cccccc', align: 'center', wordWrap: { width: cardW - 20 }
            }).setOrigin(0.5).setDepth(2002);

            card.setInteractive();
            card.on('pointerover', () => card.setFillStyle(0x334466, 0.9));
            card.on('pointerout', () => card.setFillStyle(0x222244, 0.9));
            card.on('pointerdown', () => {
                // 记录选择
                if (!this.runtime.weaponSkills[weaponType]) {
                    this.runtime.weaponSkills[weaponType] = [null, null, null];
                }
                this.runtime.weaponSkills[weaponType][slotIdx] = choice.id;
                // 保存到存档
                this.saveData.weaponSkills = this.runtime.weaponSkills;
                SaveData.save(this.saveData);
                // 清理UI
                [bg, title, subtitle, ...cards].forEach(o => o.destroy());
                this.paused = false;
                this._exitPause();
                this.showCenterText(`获得技能: ${choice.name}!`, '#ffdd44');
            });
            cards.push(card, name, desc);
        });
    }

    useSkill() {
        if (this.gameState !== 'playing' || this.paused) return;
        const s = this.runtime.skill;
        if (!s || !s.canUse(this.time.now - this.startTime)) return;

        s.use(this.time.now - this.startTime);
        this.audio.play('skill');
        this.cameras.main.shake(250, 0.012);

        const w = this.runtime.weapon;
        const baseDmg = w.getSkillDamage(this.weaponLevels[this.runtime.weaponType] || 1, this.runtime.spec);
        const angle = Math.atan2(
            (this.mousePos?.y || GH / 2) - GH / 2,
            (this.mousePos?.x || GW / 2) - GW / 2
        );

        switch (this.runtime.weaponType) {
            case 'sword':
                const dashDist = 220;
                const targetX = this.playerWorldX + Math.cos(angle) * dashDist;
                const targetY = this.playerWorldY + Math.sin(angle) * dashDist;
                this.tweens.addCounter({
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
                this.bossManager.alivePhantoms.forEach(b => {
                    const d = Phaser.Math.Distance.Between(this.playerWorldX, this.playerWorldY, b.worldX, b.worldY);
                    if (d < 130) b.takeDamage(baseDmg * 2.8, true);
                });
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
                this.bossManager.alivePhantoms.forEach(b => {
                    const d = Phaser.Math.Distance.Between(this.playerWorldX, this.playerWorldY, b.worldX, b.worldY);
                    if (d < 200) b.takeDamage(baseDmg * 3.2, Math.random() < 0.6);
                });
                for (let i = 0; i < 5; i++) {
                    setTimeout(() => {
                        this.particles.explosion(GW / 2, GH / 2, 80 + i * 40, w.color);
                    }, i * 70);
                }
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
                    if (d < 220) this.bossManager.boss.takeDamage(baseDmg * 1.8, false);
                }
                this.bossManager.alivePhantoms.forEach(b => {
                    const d = Phaser.Math.Distance.Between(this.playerWorldX, this.playerWorldY, b.worldX, b.worldY);
                    if (d < 220) b.takeDamage(baseDmg * 1.8, false);
                });
                for (let i = 0; i < 3; i++) {
                    setTimeout(() => {
                        this.particles.explosion(GW / 2, GH / 2, 100 + i * 50, w.color);
                    }, i * 100);
                }
                break;

            case 'bow':
                for (let i = 0; i < 20; i++) {
                    const a = -Math.PI / 2.5 + (i / 19) * Math.PI * 2 / 2.5;
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
                for (let i = 0; i < 15; i++) {
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
        if (this.runtime.stunTimer > 0) return;
        if (Math.random() < (this.runtime.spec.dodge || 0)) return;

        const actual = this.runtime.takeDamage(amount);
        this.runtime.invincibleTimer = 1000;
        this.runtime.resetCombo();

        this.audio.play('hurt');
        this.showDamageNumber(GW / 2, GH / 2 - 35, actual, false, true);

        this.tweens.add({
            targets: this.player,
            alpha: { from: 1, to: 0.3, to: 1 },
            duration: 100, repeat: 4
        });
        this.cameras.main.flash(100, 255, 0, 0);
    }

    updateComboDisplay() {
        if (this.runtime.combo >= 3) {
            this.comboText.setText(`${this.runtime.combo} 连击!`);
            this.comboText.setVisible(true);
            const scale = 1 + Math.sin(this.time.now * 0.01) * 0.1;
            this.comboText.setScale(scale);
            if (this.runtime.combo >= 20) this.comboText.setColor('#ff0000');
            else if (this.runtime.combo >= 10) this.comboText.setColor('#ff6600');
            else this.comboText.setColor('#ffaa00');

            if (this.comboMultText) {
                const mult = this.runtime.comboMultiplier.toFixed(2);
                this.comboMultText.setText(`x${mult} 伤害`);
                this.comboMultText.setVisible(true);
            }
        } else {
            this.comboText.setVisible(false);
            if (this.comboMultText) this.comboMultText.setVisible(false);
        }
        if (this.comboTimerBarFill) {
            const ratio = Math.max(0, this.runtime.comboTimer / 2500);
            this.comboTimerBarFill.scaleX = ratio;
        }
    }

    updateWeaponHUD() {
        if (!this.weaponText || !this.runtime.weapon) return;
        const info = WeaponFactory.info(this.runtime.weaponType);
        const lvl = this.weaponLevels[this.runtime.weaponType] || 1;
        const promo = (this.runtime.weaponPromotions && this.runtime.weaponPromotions[this.runtime.weaponType]) || 0;
        // v5：显示武器形态阶段
        const form = (this.runtime.weapon && this.runtime.weapon.getForm) ? this.runtime.weapon.getForm() : 0;
        const formMarks = ['', ' Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ'];
        const stars = promo === 0 ? '' : (promo === 1 ? ' ★' : ' ★★');
        this.weaponText.setText(`${info.icon} ${info.name} Lv.${lvl}${stars}${formMarks[form] || ''}`);
        if (this.weaponExpBarFill) {
            const needTable = [40, 70, 110, 170, 250, 360, 520, 750, 1100];
            const need = needTable[lvl - 1] || 999;
            const curExp = (this.weaponExp && this.weaponExp[this.runtime.weaponType]) || 0;
            const ratio = Math.max(0, Math.min(1, curExp / need));
            this.weaponExpBarFill.scaleX = ratio;
        }
        // 副武器显示
        if (this.runtime.secondaryWeapon) {
            if (!this.secondaryWeaponIcon) {
                this.secondaryWeaponIcon = this.add.text(60, GH - 50, '', { fontSize: '18px' });
                this.secondaryWeaponIcon.setDepth(100);
            }
            const secInfo = WeaponFactory.info(this.runtime.secondaryWeapon);
            const secPromo = (this.runtime.weaponPromotions && this.runtime.weaponPromotions[this.runtime.secondaryWeapon]) || 0;
            const secStars = secPromo === 0 ? '' : (secPromo === 1 ? ' ★' : ' ★★');
            this.secondaryWeaponIcon.setText(`${secInfo.icon} Lv${this.weaponLevels[this.runtime.secondaryWeapon] || 1}${secStars}`);
            this.secondaryWeaponIcon.setColor('#888888');
        } else if (this.secondaryWeaponIcon) {
            this.secondaryWeaponIcon.setText('');
        }
        if (this.blinkCdText) {
            if (this.blinkCooldown > 0) this.blinkCdText.setText(`E 闪现 ${(this.blinkCooldown / 1000).toFixed(1)}s`);
            else this.blinkCdText.setText('E 闪现 [就绪]');
        }
        if (this.shieldCdText) {
            if (this.emergencyShieldCooldown > 0) this.shieldCdText.setText(`R 应急 ${(this.emergencyShieldCooldown / 1000).toFixed(0)}s`);
            else this.shieldCdText.setText('R 应急 [就绪]');
        }
        if (this.difficultyLabel && this.runtime.difficultyName) {
            const diffColor = this.runtime.difficulty >= 2 ? '#ff00ff' :
                this.runtime.difficulty >= 1.4 ? '#ff4444' :
                this.runtime.difficulty >= 1 ? '#ffdd00' : '#44ff88';
            this.difficultyLabel.setText(`难度: ${this.runtime.difficultyName}`);
            this.difficultyLabel.setColor(diffColor);
        }
        if (this.dailyModLabel && this.runtime.dailyChallenge && this.runtime.dailyModifiers) {
            const names = this.runtime.dailyModifiers.map(m => `${m.icon}${m.name}`).join(' · ');
            this.dailyModLabel.setText(`每日挑战: ${names}`);
        } else if (this.dailyModLabel) {
            this.dailyModLabel.setText('');
        }
    }

    updateScreenShake(delta) {
    }

    showDamageNumber(x, y, damage, isCrit = false, isPlayer = false, colorOverride = null, prefix = '') {
        const fontSize = isCrit ? (damage > 200 ? '40px' : '32px') : '18px';
        const color = colorOverride || (isPlayer ? '#ff4444' :
                      isCrit ? (damage > 200 ? '#ff0000' : '#ffff00') : '#ffaa66');
        const text = this.add.text(x, y, `${prefix}${damage}${isCrit && !prefix ? '!' : ''}`, {
            fontSize,
            fontFamily: 'Courier New',
            color, stroke: '#000', strokeThickness: 4, fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(250);

        if (isCrit && !isPlayer && !colorOverride) {
            this.particles.critEffect(x, y - 10);
            if (damage > 200) {
                this.particles.explosion(x, y, 30, 0xffff00);
            }
        }

        this.tweens.add({
            targets: text, y: y - 70, alpha: 0,
            scale: isCrit ? { from: 2, to: 0.5 } : 1,
            duration: isCrit ? 900 : 600, ease: 'Cubic.easeOut',
            onComplete: () => text.destroy()
        });
    }

    showCenterText(text, color) {
        const t = this.add.text(GW / 2, GH / 2, text, {
            fontSize: '36px', fontFamily: 'Courier New', color,
            stroke: '#000', strokeThickness: 5, fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(450);
        this.tweens.add({
            targets: t, alpha: 0, scale: 1.4, y: GH / 2 - 60,
            duration: 1200, ease: 'Cubic.easeOut',
            onComplete: () => t.destroy()
        });
    }

    showStoryDialogue(text, color = '#ffdd88') {
        // 清理旧对话框
        if (this._storyElems) this._storyElems.forEach(e => e.destroy());
        this._storyElems = [];
        // 创建更醒目的对话框：左侧 NPC 头像 + 右侧文字
        const boxW = GW - 80, boxH = 140;
        const boxY = GH - 90;
        const box = this.add.rectangle(GW / 2, boxY, boxW, boxH, 0x000000, 0.92)
            .setStrokeStyle(3, 0xddaa55).setDepth(1500);
        // 左侧 NPC 头像区
        const portraitBg = this.add.rectangle(GW / 2 - boxW / 2 + 60, boxY, 90, boxH - 16, 0x1a1a2e)
            .setStrokeStyle(2, 0xddaa55).setDepth(1501);
        const portrait = this.add.text(GW / 2 - boxW / 2 + 60, boxY, '🧙', { fontSize: '48px' })
            .setOrigin(0.5).setDepth(1502);
        // 装饰角标
        const corner = this.add.text(GW / 2, boxY - boxH / 2 + 8, '◆ 剧情对话 ◆', {
            fontSize: '13px', fill: '#ddaa55', fontStyle: 'bold'
        }).setOrigin(0.5, 0).setDepth(1503);
        const txt = this.add.text(GW / 2 + 50, boxY, text, {
            fontSize: '18px', fill: color, align: 'left',
            wordWrap: { width: boxW - 180 }, lineHeight: '26px',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(1501);
        // 入场动画
        box.setAlpha(0); portraitBg.setAlpha(0); portrait.setAlpha(0); txt.setAlpha(0); corner.setAlpha(0);
        this.tweens.add({ targets: [box, portraitBg, portrait, txt, corner], alpha: 1, duration: 300, ease: 'Cubic.easeOut' });

        this._storyElems.push(box, portraitBg, portrait, txt, corner);
        const elems = this._storyElems;

        // 7秒后自动消失
        this.time.delayedCall(7000, () => {
            if (this._storyElems !== elems) return; // 已被新对话框替换
            this.tweens.add({
                targets: elems, alpha: 0, duration: 500,
                onComplete: () => { elems.forEach(e => e.destroy()); if (this._storyElems === elems) this._storyElems = []; }
            });
        });

        // 点击可跳过
        box.setInteractive();
        box.on('pointerdown', () => {
            if (this._storyElems !== elems) return;
            elems.forEach(e => e.destroy());
            this._storyElems = [];
        });
    }

    onLevelUp() {
        this.particles.levelUp();
        this.audio.play('levelup');
        this.runtime.updateMaxHp();
        this.cameras.main.shake(400, 0.006);
        this.showLevelUpChoice();
    }

    showLevelUpChoice() {
        this.paused = true;
        this._enterPause();

        const choices = this.getRandomSpecializations(3);
        const bg = this.add.rectangle(0, 0, GW, GH, 0x000000, 0.9).setOrigin(0).setDepth(400);
        const uiElements = [bg];

        for (let i = 0; i < 8; i++) {
            const star = this.add.star(
                Math.random() * GW, Math.random() * GH,
                5, 3, 8, 0xffd700
            ).setDepth(401).setAlpha(0.6);
            uiElements.push(star);
            this.tweens.add({
                targets: star, alpha: 0,
                y: `-=${50 + Math.random() * 50}`, scale: 2,
                duration: 1500 + Math.random() * 1000, delay: Math.random() * 500
            });
        }

        const title = this.add.text(GW / 2, 100, `⭐ 升级！ Lv.${this.runtime.level} ⭐`, {
            fontSize: '46px', fontFamily: 'Courier New',
            color: '#ffd700', stroke: '#000', strokeThickness: 5, fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(401);
        uiElements.push(title);

        const sub = this.add.text(GW / 2, 155, '选择一项专精提升', {
            fontSize: '22px', fontFamily: 'Courier New', color: '#fff',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(401);
        uiElements.push(sub);

        const allCardElements = [];

        choices.forEach((spec, i) => {
            const x = GW / 2 + (i - 1) * 200;
            const y = 340;
            const level = this.runtime.specLevels[spec.id] || 0;
            const pathName = (SpecPaths[spec.path] && SpecPaths[spec.path].name) || '';

            const cardBg = this.add.rectangle(x, y, 180, 230, 0x111122)
                .setStrokeStyle(3, spec.color).setInteractive().setDepth(401);
            const cardInner = this.add.rectangle(x, y, 172, 222, 0x1a1a2e).setDepth(401);
            const iconBg = this.add.circle(x, y - 65, 35, spec.color, 0.3).setDepth(402);
            const icon = this.add.text(x, y - 65, spec.icon, { fontSize: '38px' }).setOrigin(0.5).setDepth(403);
            const pathLabel = this.add.text(x, y - 30, pathName, {
                fontSize: '11px', fontFamily: 'Courier New', color: '#aaa'
            }).setOrigin(0.5).setDepth(402);
            const name = this.add.text(x, y, spec.name, {
                fontSize: '18px', fontFamily: 'Courier New', color: '#fff', fontWeight: 'bold'
            }).setOrigin(0.5).setDepth(402);
            const desc = this.add.text(x, y + 40, spec.desc, {
                fontSize: '12px', fontFamily: 'Courier New', color: '#ccc',
                align: 'center', wordWrap: { width: 160 }
            }).setOrigin(0.5).setDepth(402);
            const lvl = this.add.text(x, y + 85, `Lv.${level}`, {
                fontSize: '15px', fontFamily: 'Courier New', color: '#ffd700',
                stroke: '#000', strokeThickness: 2
            }).setOrigin(0.5).setDepth(402);

            const cardElements = [cardBg, cardInner, iconBg, icon, pathLabel, name, desc, lvl];
            allCardElements.push(...cardElements);

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
                this.runtime.markSpecDirty();
                this.runtime.updateMaxHp();
                uiElements.forEach(e => e.destroy());
                allCardElements.forEach(e => e.destroy());
                this.paused = false;
                this.audio.play('levelup');
            });
        });
    }

    getRandomSpecializations(count) {
        // 召唤系独立化：无随从时不出现召唤系选项
        const minionAvailable = this.minions && this.minions.length > 0;
        const weights = Specializations.map(s => {
            if (s.isMinion && !minionAvailable) return 0;
            const lvl = this.runtime.specLevels[s.id] || 0;
            // 降低已选择专精的权重
            return 1 + Math.max(0, 5 - lvl * 1.5);
        });
        // 按路径分组，保证每次选择来自不同路径（避免方向太多看花眼）
        const byPath = {};
        Specializations.forEach((s, j) => {
            if (weights[j] <= 0) return;
            if (!byPath[s.path]) byPath[s.path] = [];
            byPath[s.path].push({ spec: s, w: weights[j], idx: j });
        });
        const result = [];
        const usedPaths = new Set();
        // 每轮从不同路径各选一个
        for (let i = 0; i < count; i++) {
            const availPaths = Object.keys(byPath).filter(p => !usedPaths.has(p) && byPath[p].length > 0);
            if (availPaths.length === 0) break;
            // 随机选一个未用过的路径
            const path = availPaths[Math.floor(Math.random() * availPaths.length)];
            usedPaths.add(path);
            // 在该路径内按权重选一个
            const pool = byPath[path];
            const total = pool.reduce((a, b) => a + b.w, 0);
            let r = Math.random() * total;
            for (const item of pool) {
                r -= item.w;
                if (r <= 0) { result.push(item.spec); break; }
            }
        }
        // 若不足 count 个（路径不够），从剩余里补
        if (result.length < count) {
            const usedIdx = new Set(result.map(s => Specializations.indexOf(s)));
            for (let i = result.length; i < count; i++) {
                for (let j = 0; j < Specializations.length; j++) {
                    if (!usedIdx.has(j) && weights[j] > 0) {
                        result.push(Specializations[j]);
                        usedIdx.add(j);
                        break;
                    }
                }
            }
        }
        return result;
    }

    showBossReward() {
        this.paused = true;
        this._enterPause();
        this.bossManager.onBossDefeated((this.time.now - this.startTime) / 1000);
        this.bossManager.boss = null;
        this.bossDamageBuff = false;

        const bg = this.add.rectangle(0, 0, GW, GH, 0x000000, 0.85).setOrigin(0).setDepth(400);
        const uiElements = [bg];

        for (let i = 0; i < 20; i++) {
            const star = this.add.star(
                Math.random() * GW, Math.random() * GH,
                5, 4, 10, 0xffd700
            ).setDepth(401).setAlpha(0.7);
            this.tweens.add({
                targets: star, alpha: 0,
                y: `-=${80 + Math.random() * 80}`, scale: 2,
                duration: 2000 + Math.random() * 1000, delay: Math.random() * 800
            });
            uiElements.push(star);
        }

        const title = this.add.text(GW / 2, 50, '🏆 BOSS 击败！战利品商店 🏆', {
            fontSize: '32px', fontFamily: 'Courier New',
            color: '#ffd700', stroke: '#000', strokeThickness: 5, fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(401);
        uiElements.push(title);

        const goldInfo = this.add.text(GW / 2, 88,
            `💰 金币:${this.runtime.gold}  碎片:${this.runtime.elements.shard}  尘埃:${this.runtime.elements.dust}  结晶:${this.runtime.elements.crystal}`, {
            fontSize: '14px', fontFamily: 'Courier New', color: '#ffd700',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(401);
        uiElements.push(goldInfo);

        const wt = this.runtime.weaponType;
        const wlv = this.weaponLevels[wt] || 1;
        const promo = this.runtime.weaponPromotions[wt] || 0;

        let canPromote = false;
        let promoDesc = '当前不可晋升';
        if (wlv >= 3 && promo === 0) {
            canPromote = this.runtime.elements.shard >= 3 && this.runtime.elements.dust >= 1;
            promoDesc = canPromote ? `晋升${WeaponFactory.info(wt).name}→进阶` : '需3碎片+1尘埃';
        } else if (wlv >= 6 && promo === 1) {
            canPromote = this.runtime.elements.crystal >= 2 && this.runtime.elements.shard >= 5;
            promoDesc = canPromote ? `晋升${WeaponFactory.info(wt).name}→终极` : '需2结晶+5碎片';
        }

        const allWTypes = ['sword', 'axe', 'staff', 'bow', 'wand'];
        const lockedWeapons = allWTypes.filter(w => !this.saveData.unlockedWeapons.includes(w));
        const freeItem = lockedWeapons.length > 0
            ? { id: 'unlock_weapon', name: '解锁新武器', icon: '🔑', desc: `解锁${WeaponFactory.info(lockedWeapons[0]).name}`, cost: 0, color: 0x44ff88, enabled: true }
            : { id: 'free', name: '免费奖励', icon: '🎁', desc: '武器经验+5/生命恢复/新随从', cost: 0, color: 0x44ff88, enabled: true };

        // 武器合成选项
        const canFuse = this.runtime.secondaryWeapon &&
            (this.weaponLevels[this.runtime.weaponType] >= 10) &&
            (this.weaponLevels[this.runtime.secondaryWeapon] >= 10) &&
            (this.runtime.weaponPromotions[this.runtime.weaponType] >= 2) &&
            (this.runtime.weaponPromotions[this.runtime.secondaryWeapon] >= 2) &&
            !this.runtime.fusedWeapon;
        const fusionKey = canFuse ? getFusionKey(this.runtime.weaponType, this.runtime.secondaryWeapon) : null;
        const fusionConfig = fusionKey ? WEAPON_FUSIONS[fusionKey] : null;
        const fusionItem = fusionConfig ? {
            id: 'fuse', name: '武器合成', icon: fusionConfig.icon,
            desc: `合成${fusionConfig.name}！${fusionConfig.comboSkill}`,
            cost: 0, color: fusionConfig.color, enabled: true
        } : null;

        // 随从强化选项（随从系统独立化）
        const hasMinion = this.minions && this.minions.length > 0;
        const minionItem = hasMinion ? {
            id: 'minion_up', name: '随从强化', icon: '🐺', desc: '随机强化一个随从', cost: 200, color: 0x88ff44,
            enabled: this.runtime.gold >= 200
        } : null;

        // 精简 BOSS 商店：5 个核心选项，避免选择过载
        const items = [
            { id: 'promote', name: '武器晋升', icon: '⚔', desc: promoDesc, cost: 0, color: 0xff4466, enabled: canPromote },
            { id: 'heal', name: '血瓶', icon: '❤️', desc: '恢复60%最大生命', cost: 80, color: 0xff4488, enabled: this.runtime.gold >= 80 },
            { id: 'shield', name: '护盾', icon: '🛡', desc: '获得80护盾', cost: 100, color: 0x4488ff, enabled: this.runtime.gold >= 100 },
            { id: 'atk_gem', name: '攻击宝石', icon: '💎', desc: '永久攻击+5%', cost: 400, color: 0xaa88ff, enabled: this.runtime.gold >= 400 },
            { id: 'spec', name: '随机专精', icon: '📜', desc: '随机获得2项专精', cost: 500, color: 0xcc44ff, enabled: this.runtime.gold >= 500 },
        ];
        if (fusionItem) items.push(fusionItem);
        if (minionItem) items.push(minionItem);
        items.push(freeItem);

        const cardW = 150, cardH = 110;
        const startX = GW / 2 - cardW - 5;
        const startY = 130;

        items.forEach((it, i) => {
            const col = i % 3, row = Math.floor(i / 3);
            const x = startX + col * (cardW + 5);
            const y = startY + row * (cardH + 8);

            const cardBg = this.add.rectangle(x, y, cardW, cardH, 0x111122, 0.95)
                .setStrokeStyle(2, it.enabled ? it.color : 0x444444)
                .setInteractive().setDepth(401);
            const ic = this.add.text(x, y - 30, it.icon, { fontSize: '24px' }).setOrigin(0.5).setDepth(402);
            const nm = this.add.text(x, y - 5, it.name, {
                fontSize: '13px', fontFamily: 'Courier New', color: '#fff', fontWeight: 'bold'
            }).setOrigin(0.5).setDepth(402);
            const ds = this.add.text(x, y + 18, it.desc, {
                fontSize: '9px', fontFamily: 'Courier New', color: '#ccc',
                align: 'center', wordWrap: { width: cardW - 8 }
            }).setOrigin(0.5).setDepth(402);
            const cst = this.add.text(x, y + 42, it.cost === 0 ? '免费' : `💰${it.cost}`, {
                fontSize: '11px', fontFamily: 'Courier New',
                color: it.enabled ? (it.cost === 0 ? '#66ff66' : '#ffd700') : '#666',
                fontWeight: 'bold'
            }).setOrigin(0.5).setDepth(402);

            uiElements.push(cardBg, ic, nm, ds, cst);

            if (it.enabled) {
                cardBg.on('pointerover', () => {
                    cardBg.setStrokeStyle(3, 0xffffff);
                    cardBg.setFillStyle(0x222244, 0.95);
                });
                cardBg.on('pointerout', () => {
                    cardBg.setStrokeStyle(2, it.color);
                    cardBg.setFillStyle(0x111122, 0.95);
                });
                cardBg.on('pointerdown', () => {
                    const isFree = it.id === 'free' || it.id === 'unlock_weapon';
                    this.executeBossShopPurchase(it.id, it.cost);
                    uiElements.forEach(e => e.destroy());
                    if (isFree) {
                        this.paused = false;
                        this._exitPause();
                        if (this.enemyManager) this.enemyManager.lastSpawn = 0;
                    } else {
                        this.showBossReward();
                    }
                });
            }
        });

        const cont = this.add.text(GW / 2, GH - 30, '▶ 继续探索', {
            fontSize: '22px', fontFamily: 'Courier New', color: '#66ff66',
            stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5).setInteractive().setDepth(401);
        uiElements.push(cont);
        cont.on('pointerover', () => cont.setColor('#88ff88'));
        cont.on('pointerout', () => cont.setColor('#66ff66'));
        cont.on('pointerdown', () => {
            uiElements.forEach(e => e.destroy());
            this.paused = false;
            this._exitPause();
            // 恢复小怪生成，避免打完BOSS后长时间无怪
            if (this.enemyManager) this.enemyManager.lastSpawn = 0;
            // BOSS击败后，生成传送门到下一区域
            if (this.runtime.currentRegion < REGIONS.length - 1) {
                this.runtime.regionCleared[this.runtime.currentRegion] = true;
                this.spawnPortal();
            }
        });
    }

    executeBossShopPurchase(id, cost) {
        if (cost > 0) this.runtime.gold -= cost;
        switch (id) {
            case 'promote': {
                const pwt = this.runtime.weaponType;
                const pwlv = this.weaponLevels[pwt] || 1;
                const ppromo = this.runtime.weaponPromotions[pwt] || 0;
                if (pwlv >= 3 && ppromo === 0) {
                    this.runtime.elements.shard -= 3;
                    this.runtime.elements.dust -= 1;
                    this.runtime.weaponPromotions[pwt] = 1;
                    this.showCenterText(`⚔ 晋升！${WeaponFactory.info(pwt).name} 进阶!`, '#ff4466', 1500);
                } else if (pwlv >= 6 && ppromo === 1) {
                    this.runtime.elements.crystal -= 2;
                    this.runtime.elements.shard -= 5;
                    this.runtime.weaponPromotions[pwt] = 2;
                    this.showCenterText(`⚔ 晋升！${WeaponFactory.info(pwt).name} 终极!`, '#ff4466', 1500);
                }
                this.particles.explosion(GW / 2, GH / 2, 40, 0xff4466);
                this.audio.play('levelup');
                break;
            }
            case 'crystal':
                this.runtime.elements.crystal++;
                this.showCenterText('获得元素结晶!', '#ff8866');
                break;
            case 'shard3':
                this.runtime.elements.shard += 3;
                this.showCenterText('获得3个元素碎片!', '#00ffaa');
                break;
            case 'heal':
                this.runtime.heal(Math.floor(this.runtime.maxHp * 0.6));
                this.particles.healEffect(GW / 2, GH / 2 - 20);
                break;
            case 'shield':
                this.runtime.shield += 80;
                this.showCenterText('护盾 +80!', '#4488ff');
                break;
            case 'rage':
                this.rageMode = true;
                this.rageTimer = 6000;
                this.showCenterText('狂暴模式!', '#ff4400');
                break;
            case 'atk_gem':
                this.runtime.specLevels.atk = (this.runtime.specLevels.atk || 0) + 1;
                this.runtime.markSpecDirty();
                this.runtime.updateMaxHp();
                this.showCenterText('永久攻击 +5%!', '#aa88ff');
                break;
            case 'spec': {
                const specs = this.getRandomSpecializations(2);
                specs.forEach(s => this.runtime.specLevels[s.id]++);
                this.runtime.markSpecDirty();
                this.runtime.updateMaxHp();
                this.showCenterText('获得2项专精!', '#cc44ff');
                break;
            }
            case 'free': {
                const r = Math.random();
                if (r < 0.4) {
                    this.addWeaponExp(this.runtime.weaponType, 5);
                    this.showCenterText('武器经验 +5!', '#ffaa00');
                } else if (r < 0.7) {
                    this.runtime.heal(Math.floor(this.runtime.maxHp * 0.4));
                    this.particles.healEffect(GW / 2, GH / 2 - 20);
                    this.showCenterText('生命恢复!', '#ff4488');
                } else {
                    const minionTypes = ['light', 'shadow', 'fire', 'ice', 'lightning'];
                    const avail = minionTypes.filter(m => !this.saveData.unlockedMinions.includes(m));
                    if (avail.length > 0) {
                        const nm2 = avail[Math.floor(Math.random() * avail.length)];
                        this.saveData.unlockedMinions.push(nm2);
                        const m2 = new Minion(this, nm2);
                        m2.spawn(this.playerWorldX, this.playerWorldY);
                        this.minions.push(m2);
                        this.showCenterText('解锁新随从!', '#44ff88');
                    } else {
                        this.runtime.specLevels.atk = (this.runtime.specLevels.atk || 0) + 2;
                        this.runtime.updateMaxHp();
                        this.showCenterText('攻击专精 +2!', '#ffaa00');
                    }
                }
                break;
            }
            case 'unlock_weapon': {
                // 武器改为通关解锁，商人处改为赠送魂石（局外养成资源）
                this.saveData.soulStones = (this.saveData.soulStones || 0) + 5;
                this.showCenterText('获得 5 魂石！(死后用于局外加点)', '#aa88ff');
                this.particles.explosion(GW / 2, GH / 2, 40, 0xaa88ff);
                this.audio.play('levelup');
                break;
            }
            case 'fuse': {
                const w1 = this.runtime.weaponType;
                const w2 = this.runtime.secondaryWeapon;
                const key = getFusionKey(w1, w2);
                const config = WEAPON_FUSIONS[key];
                if (config) {
                    // 消耗材料
                    this.runtime.elements.shard -= 10;
                    this.runtime.elements.dust -= 5;
                    this.runtime.elements.crystal -= 3;
                    // 设置合成武器
                    this.runtime.fusedWeapon = { name: config.name, color: config.color, comboSkill: config.comboSkill, components: [w1, w2] };
                    this.runtime.weaponType = 'fused';
                    this.runtime.weapon = WeaponFactory.create(w1, this.runtime); // 基础属性用主武器
                    this.runtime.weapon.baseDmg *= 1.5; // 合成武器+50%基础伤害
                    this.runtime.weapon.isFused = true;
                    this.showCenterText(`合成成功：${config.name}!`, '#ffdd44');
                    this.particles.explosion(GW / 2, GH / 2, 80, config.color);
                    this.audio.play('levelup');
                }
                break;
            }
            case 'minion_up': {
                if (this.minions && this.minions.length > 0) {
                    const m = this.minions[Math.floor(Math.random() * this.minions.length)];
                    const upgrades = ['dmg', 'spd', 'ele'];
                    const up = upgrades[Math.floor(Math.random() * upgrades.length)];
                    if (up === 'dmg') { m.dmgMul = (m.dmgMul || 1) + 0.3; this.showCenterText('随从攻击力+30%!', '#88ff44'); }
                    if (up === 'spd') { m.spdMul = (m.spdMul || 1) + 0.2; this.showCenterText('随从攻速+20%!', '#88ff44'); }
                    if (up === 'ele') { m.elementBonus = (m.elementBonus || 0) + 5; this.showCenterText('随从元素伤害+5!', '#88ff44'); }
                }
                break;
            }
        }
        this.audio.play('buy');
        this.cameras.main.flash(200, 255, 255, 100);
        SaveData.save(this.saveData);
    }

    showMerchantShop(items) {
        if (this.merchantDialog) {
            this.merchantDialog.forEach(e => e.destroy());
            this.merchantDialog = null;
        }
        this.paused = true;
        this._enterPause();

        const bg = this.add.rectangle(0, 0, GW, GH, 0x000000, 0.7).setOrigin(0).setDepth(400);
        const uiElements = [bg];

        const title = this.add.text(GW / 2, 90, '🧙 神秘商人 🧙', {
            fontSize: '40px', fontFamily: 'Courier New',
            color: '#ffd700', stroke: '#000', strokeThickness: 5, fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(401);
        const sub = this.add.text(GW / 2, 145, '神秘商人到访了他的神奇货品', {
            fontSize: '18px', fontFamily: 'Courier New', color: '#fff',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setDepth(401);
        uiElements.push(title, sub);

        const close = () => {
            uiElements.forEach(e => e.destroy());
            localElements.forEach(e => e.destroy());
            this.paused = false;
            this._exitPause();
            this.merchantDialog = null;
        };

        const localElements = [];
        // v5 智者加点：每级 8% 商店折扣
        const sageLv = this.runtime._wisdomLv || 0;
        const discount = sageLv > 0 ? (1 - 0.08 * sageLv) : 1;
        items.forEach((item, i) => {
            const x = GW / 2 + (i - 1) * 200;
            const y = 310;
            const actualCost = Math.max(1, Math.floor(item.cost * discount));
            const canBuy = this.runtime.gold >= actualCost;
            const cardBg = this.add.rectangle(x, y, 180, 230, 0x111122)
                .setStrokeStyle(3, canBuy ? 0xffd700 : 0x444444).setInteractive().setDepth(401);
            const cardInner = this.add.rectangle(x, y, 172, 222, 0x1a1a2e).setDepth(401);
            const icon = this.add.text(x, y - 60, item.icon, { fontSize: '42px' }).setOrigin(0.5).setDepth(402);
            const name = this.add.text(x, y, item.name, {
                fontSize: '20px', fontFamily: 'Courier New', color: '#fff', fontWeight: 'bold'
            }).setOrigin(0.5).setDepth(402);
            const desc = this.add.text(x, y + 45, item.desc, {
                fontSize: '13px', fontFamily: 'Courier New', color: '#ccc',
                align: 'center', wordWrap: { width: 160 }
            }).setOrigin(0.5).setDepth(402);
            const costText = this.add.text(x, y + 95, `💰 ${actualCost}${sageLv > 0 ? ` (智者-${Math.floor((1 - discount) * 100)}%)` : ''}`, {
                fontSize: '16px', fontFamily: 'Courier New', color: canBuy ? '#ffd700' : '#666666',
                stroke: '#000', strokeThickness: 2
            }).setOrigin(0.5).setDepth(402);
            localElements.push(cardBg, cardInner, icon, name, desc, costText);

            cardBg.on('pointerdown', () => {
                if (!canBuy) return;
                this.runtime.gold -= actualCost;
                this.applyMerchantItem(item);
                close();
            });
        });

        const skipBtn = this.add.text(GW / 2, 470, '[离开]', {
            fontSize: '22px', fontFamily: 'Courier New', color: '#888',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setInteractive().setDepth(401);
        skipBtn.on('pointerdown', close);
        localElements.push(skipBtn);
        this.merchantDialog = uiElements;
    }

    applyMerchantItem(item) {
        switch (item.action) {
            case 'heal':
                this.runtime.heal(Math.floor(this.runtime.maxHp * 0.5));
                this.particles.healEffect(GW / 2, GH / 2 - 20);
                this.showCenterText('生命恢复!', '#ff4466');
                break;
            case 'shield':
                this.runtime.shield += 50;
                this.showCenterText('获得护盾 +50!', '#4488ff');
                break;
            case 'shard_pack':
                this.runtime.elements.shard += 2;
                this.showCenterText('获得 2 个元素碎片!', '#00ffaa');
                break;
            case 'atk':
                this.runtime.specLevels.atk = (this.runtime.specLevels.atk || 0) + 1;
                this.showCenterText('攻击力 +5% (永久)', '#ff4466');
                break;
            case 'cleanse':
                this.runtime.invincibleTimer = 3000;
                this.runtime.slowTimer = 0;
                this.runtime.stunTimer = 0;
                this.showCenterText('无敌 3 秒!', '#ffdd00');
                break;
        }
        this.audio.play('pickup');
    }

    updateHUD() {
        const r = this.runtime;
        const hpRatio = Math.max(0, r.hp / r.maxHp);
        this.hpBar.scaleX = hpRatio;
        this.hpBarMask.scaleX = hpRatio;
        this.hpText.setText(`${Math.ceil(r.hp)}/${r.maxHp}`);
        if (hpRatio < 0.3) this.hpBar.fillColor = 0xff0000;
        else if (hpRatio < 0.6) this.hpBar.fillColor = 0xff8800;
        else this.hpBar.fillColor = COLORS.hp;

        // 区域名称显示
        if (!this.regionLabel) {
            this.regionLabel = this.add.text(GW - 150, 10, '', {
                fontSize: '14px', fontFamily: 'Courier New', color: '#aaaaff',
                stroke: '#000', strokeThickness: 2
            }).setDepth(100);
        }
        const curRegion = REGIONS[r.currentRegion] || REGIONS[0];
        this.regionLabel.setText(curRegion.name);

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
        const wn = this.enemyManager.waveNumber;
        this.waveText.setText(`第 ${wn} 波 | 击杀: ${r.killCount} | Boss: ${r.bossKills}`);
        this.killText && this.killText.setText(`击杀: ${r.killCount} | Boss: ${r.bossKills}`);
        if (this.weaponText && this.runtime.weapon) this.weaponText.setText(`${this.runtime.weapon.icon} ${this.runtime.weapon.name} Lv.${this.weaponLevels[this.runtime.weaponType] || 1}`);

        if (this.rageBar) {
            const rageRatio = Math.min(1, r.combo / 15);
            this.rageBarFill.width = 120 * rageRatio;
            if (this.rageMode) {
                this.rageBarFill.fillColor = 0xffff00;
                this.rageBar.setVisible(true);
            } else {
                this.rageBarFill.fillColor = 0xff4400;
                this.rageBar.setVisible(rageRatio > 0.3);
            }
        }

        if (this.kpmText) {
            const kpm = r.killCount / Math.max(1, r.surviveTime / 60);
            this.kpmText.setText(`击杀/分: ${kpm.toFixed(1)}`);
        }

        if (this.dashCdText) {
            if (this.dashTimer > 0) {
                this.dashCdText.setText('⚡ 冲刺中...');
                this.dashCdText.setColor('#ffff00');
            } else if (this.dashCooldown > 0) {
                this.dashCdText.setText(`冲刺: ${(this.dashCooldown / 1000).toFixed(1)}s`);
                this.dashCdText.setColor('#888');
            } else {
                this.dashCdText.setText('⚡ 冲刺就绪 [Shift]');
                this.dashCdText.setColor('#ffdd44');
            }
        }

        // 元素面板（右下角）
        if (!this.elementPanel) {
            this.elementPanel = this.add.text(GW - 10, GH - 10, '', {
                fontSize: '12px', fontFamily: 'Courier New', fill: '#aaffaa', align: 'right',
                backgroundColor: '#00000088', padding: { x: 8, y: 4 }
            }).setOrigin(1, 1).setDepth(100);
        }
        // 显示当前武器元素效果
        const wlvl = this.weaponLevels[this.runtime.weaponType] || 1;
        const wtype = this.runtime.weaponType;
        const effects = [];
        if (wtype === 'sword') effects.push(`流血${wlvl >= 4 ? '(3层)' : '(1层)'}`);
        if (wtype === 'axe') effects.push(`燃烧${wlvl >= 4 ? '(5层)' : '(3层)'}`);
        if (wtype === 'staff') effects.push(`冰冻${wlvl >= 7 ? '(秒杀)' : '(减速)'}`);
        if (wtype === 'bow') effects.push(`穿透${wlvl >= 7 ? '(全穿透)' : '(50%)'}`);
        if (wtype === 'wand') effects.push(`奥术${wlvl >= 7 ? '(风暴)' : '(印记)'}`);
        if (this.runtime.fusedWeapon) effects.push('合体技');
        this.elementPanel.setText('元素: ' + effects.join(' | '));
    }

    formatTime(seconds) {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }

    checkAchievements() {
        const r = this.runtime;
        const sd = this.saveData;
        const maxWeaponLvl = Math.max(...Object.values(this.weaponLevels || { sword: 1 }));
        const checks = [
            { id: 'first_blood', cond: r.killCount >= 1 },
            { id: 'killer_10', cond: r.killCount >= 10 },
            { id: 'killer_50', cond: r.killCount >= 50 },
            { id: 'killer_100', cond: r.killCount >= 100 },
            { id: 'killer_500', cond: r.killCount >= 500 },
            { id: 'survive_60', cond: r.surviveTime >= 60 },
            { id: 'survive_180', cond: r.surviveTime >= 180 },
            { id: 'survive_300', cond: r.surviveTime >= 300 },
            { id: 'survive_600', cond: r.surviveTime >= 600 },
            { id: 'boss_1', cond: r.bossKills >= 1 },
            { id: 'boss_3', cond: r.bossKills >= 3 },
            { id: 'boss_5', cond: r.bossKills >= 5 },
            { id: 'level_5', cond: r.level >= 5 },
            { id: 'level_10', cond: r.level >= 10 },
            { id: 'level_15', cond: r.level >= 15 },
            { id: 'level_25', cond: r.level >= 25 },
            { id: 'combo_10', cond: r.maxCombo >= 10 },
            { id: 'combo_20', cond: r.maxCombo >= 20 },
            { id: 'combo_30', cond: r.maxCombo >= 30 },
            { id: 'gold_100', cond: r.gold >= 100 },
            { id: 'gold_500', cond: r.gold >= 500 },
            { id: 'gold_2000', cond: r.gold >= 2000 },
            { id: 'weapon_master', cond: maxWeaponLvl >= 10 },
            { id: 'rage_user', cond: this.rageMode === true },
            { id: 'shield_user', cond: this.emergencyShieldActive === true },
            { id: 'hell_clear', cond: r.difficultyName === '地狱' && r.bossKills >= 1 },
            { id: 'all_weapons', cond: sd.unlockedWeapons.length >= 5 }
        ];
        checks.forEach(c => {
            if (c.cond && sd.achievements.indexOf(c.id) === -1) {
                sd.achievements.push(c.id);
                const ach = Achievements.find(a => a.id === c.id);
                if (ach) this.showAchievementUnlock(ach);
            }
        });
    }

    showAchievementUnlock(ach) {
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

        bg.y = y - 70; icon.y = y - 70; title.y = y - 78; name.y = y - 60;

        this.tweens.add({
            targets: [bg, icon, title, name],
            y: `+=70`, duration: 600, ease: 'Back.easeOut',
            hold: 2500, yoyo: true,
            onComplete: () => { bg.destroy(); icon.destroy(); title.destroy(); name.destroy(); }
        });
        SaveData.save(this.saveData);
    }

    // 统一暂停/恢复：记录暂停起点，恢复时把暂停时长补回 startTime，避免 gT 跳越导致跳章
    _enterPause() {
        if (this._pauseActive) return;
        this._pauseActive = true;
        this._pauseStartTime = this.time.now;
        if (this.physics) this.physics.pause();
    }
    _exitPause() {
        if (!this._pauseActive) return;
        this._pauseActive = false;
        if (this._pauseStartTime != null) {
            this.startTime += (this.time.now - this._pauseStartTime);
            this._pauseStartTime = null;
        }
        if (this.physics) this.physics.resume();
    }

    togglePause() {
        if (this.gameState !== 'playing' || this.merchantDialog) return;
        this.paused = !this.paused;

        if (this.paused) {
            this._enterPause();
            this.pauseElements = [];
            const bg = this.add.rectangle(0, 0, GW, GH, 0x000000, 0.78).setOrigin(0).setDepth(450);
            const title = this.add.text(GW / 2, GH / 2 - 80, '⏸ 暂停', {
                fontSize: '44px', fontFamily: 'Courier New', color: '#fff',
                stroke: '#000', strokeThickness: 4
            }).setOrigin(0.5).setDepth(451);

            const goldInfo = this.add.text(GW / 2, GH / 2 - 30, `💰 ${this.runtime.gold}`, {
                fontSize: '22px', fontFamily: 'Courier New', color: '#ffd700',
                stroke: '#000', strokeThickness: 2
            }).setOrigin(0.5).setDepth(451);

            const shardInfo = this.add.text(GW / 2, GH / 2,
                `碎片:${this.runtime.elements.shard}  尘埃:${this.runtime.elements.dust}  结晶:${this.runtime.elements.crystal}`, {
                fontSize: '14px', fontFamily: 'Courier New', color: '#88ffcc',
                stroke: '#000', strokeThickness: 2
            }).setOrigin(0.5).setDepth(451);

            const resume = this.add.text(GW / 2, GH / 2 + 60, '▶ 继续游戏', {
                fontSize: '24px', fontFamily: 'Courier New', color: '#66ff66',
                stroke: '#000', strokeThickness: 3
            }).setOrigin(0.5).setInteractive().setDepth(451);

            const menu = this.add.text(GW / 2, GH / 2 + 100, '返回主菜单', {
                fontSize: '18px', fontFamily: 'Courier New', color: '#aaa',
                stroke: '#000', strokeThickness: 2
            }).setOrigin(0.5).setInteractive().setDepth(451);

            resume.on('pointerover', () => resume.setColor('#88ff88'));
            resume.on('pointerout', () => resume.setColor('#66ff66'));
            resume.on('pointerdown', () => {
                this.pauseElements.forEach(e => e.destroy());
                this.pauseElements = [];
                this.paused = false;
                this._exitPause();
            });

            menu.on('pointerover', () => menu.setColor('#fff'));
            menu.on('pointerout', () => menu.setColor('#aaa'));
            menu.on('pointerdown', () => {
                this.pauseElements.forEach(e => e.destroy());
                this.pauseElements = [];
                this.paused = false;
                this._exitPause();
                this.showMainMenu();
            });

            this.pauseElements.push(bg, title, goldInfo, shardInfo, resume, menu);
        } else if (this.pauseElements && this.pauseElements.length > 0) {
            this.pauseElements.forEach(e => e.destroy());
            this.pauseElements = [];
            this._exitPause();
        }
    }

    gameOver() {
        if (this.gameState === 'gameover') return;
        this.gameState = 'gameover';
        this.audio.play('die');

        if (this.bossManager) this.bossManager.clear();
        if (this.enemyManager) this.enemyManager.clear();

        const r = this.runtime;
        const sd = this.saveData;
        sd.totalKills += r.killCount;
        sd.totalGold += r.gold;
        if (r.surviveTime > sd.bestTime) sd.bestTime = r.surviveTime;
        if (r.level > sd.bestLevel) sd.bestLevel = r.level;

        // ===== v5 局外养成结算：三资源（大幅降低魂石，新增玄铁/BOSS之血）=====
        // 魂石：存活/30 + 击杀/15 + BOSS×2（原 /30 +/10 +×5，砍半多）
        const earnedStones = Math.floor(r.surviveTime / 60 + r.killCount / 15 + r.bossKills * 2);
        sd.soulStones = (sd.soulStones || 0) + earnedStones;
        this._earnedStones = earnedStones;
        // 玄铁：精英击杀为主（需在 runtime 统计精英击杀，这里用 bossKills 近似）
        const earnedIron = Math.floor(r.bossKills * 1 + r.killCount / 50);
        sd.darkIron = (sd.darkIron || 0) + earnedIron;
        this._earnedIron = earnedIron;
        // BOSS之血：每个BOSS 1 个
        const earnedBlood = r.bossKills;
        sd.bossBlood = (sd.bossBlood || 0) + earnedBlood;
        this._earnedBlood = earnedBlood;
        // 击败的BOSS类型记录（用于解锁元素分支）
        if (r.lastBossType && !(sd.bossesDefeated || []).includes(r.lastBossType)) {
            sd.bossesDefeated = sd.bossesDefeated || [];
            sd.bossesDefeated.push(r.lastBossType);
        }

        // ===== v5 难度锁系统：通关当前难度→解锁下一难度 =====
        const diffName = r.difficultyName || '普通';
        const diffMap = { '简单': 'easy', '普通': 'normal', '困难': 'hard', '地狱': 'hell' };
        const diffKey = diffMap[diffName] || 'normal';
        sd.unlockedDifficulties = sd.unlockedDifficulties || ['easy'];
        const unlockedNew = [];
        const unlockedDiff = [];
        // 通关判定：击败足够多BOSS视为通关该难度
        if (r.bossKills >= 3 && !sd.difficultyCleared[diffKey]) {
            sd.difficultyCleared[diffKey] = true;
            // v5：解锁下一难度
            const order = ['easy', 'normal', 'hard', 'hell'];
            const idx = order.indexOf(diffKey);
            if (idx >= 0 && idx + 1 < order.length) {
                const nextDiff = order[idx + 1];
                if (!sd.unlockedDifficulties.includes(nextDiff)) {
                    sd.unlockedDifficulties.push(nextDiff);
                    unlockedDiff.push(nextDiff);
                }
            }
            // 武器解锁路径（保持）
            if (diffKey === 'normal' && !sd.unlockedWeapons.includes('axe')) {
                sd.unlockedWeapons.push('axe'); unlockedNew.push('axe');
            }
            if (diffKey === 'hard' && !sd.unlockedWeapons.includes('bow')) {
                sd.unlockedWeapons.push('bow'); unlockedNew.push('bow');
            }
            if (diffKey === 'hell' && !sd.unlockedWeapons.includes('staff')) {
                sd.unlockedWeapons.push('staff'); unlockedNew.push('staff');
            }
        }
        // 击败暗影神→解锁法杖
        if (r.bossKills >= 8 && !sd.shadowGodDefeated) {
            sd.shadowGodDefeated = true;
            if (!sd.unlockedWeapons.includes('wand')) {
                sd.unlockedWeapons.push('wand'); unlockedNew.push('wand');
            }
        }
        this._unlockedNewWeapons = unlockedNew;
        this._unlockedNewDiff = unlockedDiff;
        SaveData.save(sd);

        this.gameOverElements = [];

        const bg = this.add.rectangle(0, 0, GW, GH, 0x000000, 0.9).setOrigin(0).setDepth(500);
        this.gameOverElements.push(bg);

        const title = this.add.text(GW / 2, 80, '💀 游戏结束 💀', {
            fontSize: '56px', fontFamily: 'Courier New',
            color: '#ff4466', stroke: '#000', strokeThickness: 5, fontWeight: 'bold'
        }).setOrigin(0.5).setDepth(501);
        this.gameOverElements.push(title);

        const statsBg = this.add.rectangle(GW / 2, 280, 400, 320, 0x0a0a1a)
            .setStrokeStyle(2, 0x333355).setDepth(501);
        this.gameOverElements.push(statsBg);

        const stats = [
            { label: '存活时间', value: this.formatTime(r.surviveTime), color: '#44ffff' },
            { label: '达到等级', value: `Lv.${r.level}`, color: '#ffd700' },
            { label: '击杀敌人', value: `${r.killCount}`, color: '#ff6644' },
            { label: '击败Boss', value: `${r.bossKills}`, color: '#ff4488' },
            { label: '获得金币', value: `${r.gold}`, color: '#ffd700' },
            { label: '最高连击', value: `${r.maxCombo}`, color: '#ff8800' },
            { label: '武器等级', value: `Lv.${this.weaponLevels ? (this.weaponLevels[r.weaponType] || 1) : 1}`, color: '#44ff88' },
            { label: '获得魂石', value: `+${this._earnedStones || 0} (共${sd.soulStones})`, color: '#aa88ff' },
            { label: '获得玄铁', value: `+${this._earnedIron || 0} (共${sd.darkIron})`, color: '#ffaa55' },
            { label: 'BOSS之血', value: `+${this._earnedBlood || 0} (共${sd.bossBlood})`, color: '#ffdd44' }
        ];

        stats.forEach((s, i) => {
            const label = this.add.text(GW / 2 - 150, 165 + i * 32, s.label, {
                fontSize: '18px', fontFamily: 'Courier New', color: '#aaa'
            }).setOrigin(0, 0.5).setDepth(502);
            this.gameOverElements.push(label);
            const value = this.add.text(GW / 2 + 150, 165 + i * 32, s.value, {
                fontSize: '18px', fontFamily: 'Courier New', color: s.color, fontWeight: 'bold'
            }).setOrigin(1, 0.5).setDepth(502);
            this.gameOverElements.push(value);
        });

        const best = this.add.text(GW / 2, 410,
            `🏆 最佳时间: ${this.formatTime(sd.bestTime)} | 最高等级: ${sd.bestLevel}`, {
            fontSize: '16px', fontFamily: 'Courier New', color: '#ffd700'
        }).setOrigin(0.5).setDepth(502);
        this.gameOverElements.push(best);

        const restart = this.add.text(GW / 2, GH - 150, '重新开始', {
            fontSize: '30px', fontFamily: 'Courier New', color: '#44ff88',
            stroke: '#000', strokeThickness: 3
        }).setOrigin(0.5).setInteractive().setDepth(502);
        this.gameOverElements.push(restart);

        const menu = this.add.text(GW / 2, GH - 100, '返回主菜单', {
            fontSize: '20px', fontFamily: 'Courier New', color: '#aaa',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5).setInteractive().setDepth(502);
        this.gameOverElements.push(menu);

        restart.on('pointerover', () => restart.setColor('#66ffaa'));
        restart.on('pointerout', () => restart.setColor('#44ff88'));
        restart.on('pointerdown', () => {
            this.gameOverElements.forEach(e => e.destroy());
            this.gameOverElements = [];
            this.startGame(r.weaponType);
        });

        menu.on('pointerover', () => menu.setColor('#fff'));
        menu.on('pointerout', () => menu.setColor('#aaa'));
        menu.on('pointerdown', () => {
            this.gameOverElements.forEach(e => e.destroy());
            this.gameOverElements = [];
            this.showMainMenu();
        });
    }
}

// ==================== 启动 ====================
const config = {
    type: Phaser.AUTO,
    width: GW,
    height: GH,
    parent: 'game-container',
    pixelArt: true,
    backgroundColor: '#0a0a18',
    scene: GameScene,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

window.addEventListener('load', () => {
    window.game = new Phaser.Game(config);
});

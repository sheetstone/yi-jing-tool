/**
 * Batch 2 — Per-field BaZi modifier texts
 *
 * STATUS: SKELETON ONLY — modifier content is TODO.
 * See BAZI_HEXAGRAM_PLAN.md for full content requirements and instructions.
 *
 * Architecture:
 *   calcHexResonance()  →  HexResonanceData  (hexResonance.ts, ✅ done)
 *       └──▶ getFieldModifier(data, field, lang)  →  string | null
 *
 * Each fortune/interpretation field gets an optional 1-2 sentence modifier
 * appended after the existing static text, contextualizing it with today's
 * five-element relationship (resonance) and seasonal energy (wangXiang).
 */

import type { Resonance, WangXiang, HexResonanceData } from './hexResonance';

// ── Types ─────────────────────────────────────────────────────────────────────

/**
 * The 6 fortune fields that benefit from BaZi modifier context.
 * (大象 and 卜辞 are classical texts — excluded intentionally.)
 */
export type ModifiableField =
  | 'tuijuan'   // 推断 — general interpretation
  | 'yunshi'    // 运势 — overall fortune
  | 'aiqing'    // 爱情 — love & relationships
  | 'jibing'    // 疾病 — health
  | 'shiwu'     // 失物 — lost items
  | 'susong';   // 诉讼 — litigation

/** Collapsed wangXiang into 3 tiers to keep content manageable. */
export type Strength = 'strong' | 'normal' | 'weak';

export function toStrength(wx: WangXiang): Strength {
  if (wx === '旺' || wx === '相') return 'strong';
  if (wx === '休')                return 'normal';
  return 'weak';   // 囚 | 死
}

export interface ModifierText {
  zh: string;
  en: string;
}

/**
 * Full modifier table shape:
 *   MODIFIERS[resonance][strength][field] → ModifierText
 *
 * 5 resonance × 3 strength × 6 fields = 90 cells (× 2 languages = 180 texts)
 */
type ModifierTable = Record<
  Resonance,
  Record<Strength, Record<ModifiableField, ModifierText>>
>;

// ── Modifier content table (TODO: fill in Batch 2) ───────────────────────────

/**
 * CONTENT INSTRUCTIONS FOR BATCH 2:
 *
 * Each modifier is 1–2 sentences (~30–60 Chinese characters).
 * It should:
 *   - Start with the resonance context  (e.g. "今日日克卦气，")
 *   - Apply to the SPECIFIC FIELD      (e.g. "运势方面宜审慎…")
 *   - Mention seasonal strength briefly (e.g. "（月令金旺，韧性尚存）")
 * Tone: same as existing field text — concise, classical-flavored but readable.
 *
 * SKELETON: every cell currently holds a TODO placeholder so the app compiles.
 * Replace placeholders one resonance at a time (= 1 coding session per resonance).
 */

export const MODIFIERS: ModifierTable = {
  // ── 比和 (same element, resonance) ─────────────────────────────────────────
  bihe: {
    // 旺 / 相 — same element, seasonally empowered
    strong: {
      tuijuan: {
        zh: '今日同气当令共振，卦气与日元相辅相承，推断方向清晰有力，宜大胆决断，顺势而为。（月令同气助旺，能量充沛，把握时机勿迟疑。）',
        en: 'Day stem and hexagram share the same element, both empowered by the season. The reading points are clear and decisive — act boldly and trust the signs.',
      },
      yunshi: {
        zh: '今日同气旺相共振，运势能量饱满，主动出击最为有利，贵人相助易至。（月令当旺，万事推进顺畅，把握机遇勿迟疑。）',
        en: 'Same-element resonance peaks with seasonal support. Fortune favors initiative; benefactors appear readily. Seize opportunities without hesitation.',
      },
      aiqing: {
        zh: '今日同气当令共振，感情能量充沛而清晰，主动表达心意最为有利，桃花缘分更易显现。（月令旺相，情感场域能量高涨，缘分易成。）',
        en: 'Day and hexagram resonate as one, amplified by the season. Emotions flow clearly — express feelings openly. Romance and connections are especially favored.',
      },
      jibing: {
        zh: '今日同气旺相，身体元气得月令加持，正气充足，康复力强。（宜顺势调养，莫耗散精气，以逸待劳方能持久。）',
        en: 'Shared element and seasonal strength reinforce vitality. Recovery and immunity are at their best. Rest well to preserve this energy rather than depleting it.',
      },
      shiwu: {
        zh: '今日同气旺相，失物所对应方位能量充沛，寻找方向清晰，宜主动出手追寻。（月令气旺，线索易现，切勿拖延。）',
        en: 'Same-element energy is strong and directionally clear. The lost item resonates well — act promptly; clues will surface.',
      },
      susong: {
        zh: '今日同气旺相，诉讼一方气势充足，理据清晰，正面交涉最为有利。（月令当旺，据理力争合时，早结早宜。）',
        en: 'Resonance is at full strength today. Your position in legal matters is clear and supported. Engage directly and seek early resolution.',
      },
    },
    // 休 — same element, but has given energy to season; slightly drained
    normal: {
      tuijuan: {
        zh: '今日同气相遇，然月令气候入休，卦气与日元虽同频，力道稍有减缓，推断宜循序渐进，莫急于一时。（月令入休，行事稳健为上。）',
        en: 'Day and hexagram share element, but the season has drawn on that energy, leaving a quieter resonance. Proceed steadily — the foundation is sound, just not urgent.',
      },
      yunshi: {
        zh: '今日同气相遇，运势底色稳定，虽月令入休势头平缓，然根基在，坚持积累自有回报。（不必强求速成，蓄力待时为宜。）',
        en: 'Same-element resonance holds, though seasonal momentum is subdued. Fortune is stable rather than surging; consistent effort will yield results over time.',
      },
      aiqing: {
        zh: '今日同气相遇，感情频率相近，然月令入休，情感能量趋于平淡，宜以真诚细水长流，少做戏剧性举动。（静水流深，感情宜养不宜催。）',
        en: 'Frequencies align but energy is calm today. Relationships benefit from sincerity and patience rather than grand gestures. Quiet waters run deep.',
      },
      jibing: {
        zh: '今日同气相遇，月令气候入休，身体能量稍减，宜注意作息调整，切勿过度劳神。（休养生息为本，不宜冒进消耗。）',
        en: 'The element matches but is seasonally drained. Energy levels are modest — prioritize rest and routine. Avoid overextending.',
      },
      shiwu: {
        zh: '今日同气相遇，月令入休，失物线索存在但能量稍弱，寻找宜静中求动，切忌大张旗鼓。（耐心等待，或从熟悉之处再细察。）',
        en: 'Element matches but energy is muted. Signs exist but are subtle; look carefully in familiar places rather than searching broadly.',
      },
      susong: {
        zh: '今日同气相遇，月令入休，诉讼之事势头趋缓，不宜强攻，以调解或延后部署为宜。（守势稳妥，等待时机再出击。）',
        en: 'The resonance is there but subdued. A confrontational approach is unlikely to succeed now — mediation or a strategic pause will serve better.',
      },
    },
    // 囚 / 死 — same element, seasonally suppressed
    weak: {
      tuijuan: {
        zh: '今日同气相遇，然月令囚死，卦气虽与日干同频，能量受压抑，推断宜从长计议，切忌强行推进。（月令压制，缓图为上，避免正面硬碰。）',
        en: 'Same element, but the season suppresses it. The resonance exists in name but not in force. Plan carefully and avoid forcing outcomes.',
      },
      yunshi: {
        zh: '今日同气相遇而月令囚死，运势能量受压，暗流阻力较大，宜守势蓄力，避免消耗。（此时主动出击易遭挫折，以静待动为上策。）',
        en: 'Shared element is under seasonal pressure. Resistance is hidden but real. Hold your ground and conserve energy rather than pushing forward.',
      },
      aiqing: {
        zh: '今日同气相遇，然月令入囚死，感情能量内敛受阻，主动追求恐难如愿，宜退守观察，待气运转机后再表态。（强求难成，静待缘分自然流动。）',
        en: 'Element aligns but is seasonally constrained. Pursuing romance now invites obstacles. Step back, observe, and let things unfold naturally.',
      },
      jibing: {
        zh: '今日同气相遇而月令囚死，身体元气受压，抵抗力偏弱，宜格外注重休息与保养，避免劳累与寒凉。（此时调养当以守为主，防微杜渐。）',
        en: 'Matching element is weakened by the season. Vitality is at a low ebb — prioritize rest, warmth, and prevention. Guard against fatigue.',
      },
      shiwu: {
        zh: '今日同气相遇而月令囚死，失物能量受压，寻找难度较大，宜暂缓或寻求他人协助。（强行搜寻恐事倍功半，静候时机为宜。）',
        en: 'Shared element energy is suppressed. Recovery efforts face resistance — consider asking for help or waiting for a more favorable time.',
      },
      susong: {
        zh: '今日同气相遇而月令囚死，诉讼之气受压，形势不利，宜寻求调解或暂缓推进，切忌强硬对抗。（月令囚死，此时出击适得其反，忍一时退一步为智。）',
        en: 'Resonance exists but is seasonally crushed. Pressing legal action now is counterproductive. Seek mediation or delay; patience is the wiser course.',
      },
    },
  },

  // ── 日生卦 (day generates hexagram element) ─────────────────────────────────
  ri_sheng: {
    // 旺 / 相 — day feeds hexagram, and hexagram element is seasonally strong
    strong: {
      tuijuan: {
        zh: '今日日元生扶卦气，卦象得日干滋养且月令当旺，推断方向获双重加持，宜积极布局，施展才干。（输出有余，全力以赴可期有成。）',
        en: 'Day stem nourishes the hexagram, which is also seasonally empowered. The reading gains double support — lay plans boldly and act with full commitment.',
      },
      yunshi: {
        zh: '今日日元生卦，运势受日干滋养而兴旺，月令又逢旺相，气场向外扩展，适合主动开拓、建立连接。（付出愈多，回报愈丰。）',
        en: 'Day stem energizes the hexagram while the season boosts it further. Fortune expands outward — ideal for networking, outreach, and bold moves.',
      },
      aiqing: {
        zh: '今日日元生卦，感情方面付出与给予的能量充沛，月令旺相推波助澜，主动示爱效果显著，对方易受感动。（情感投入越多越有回响。）',
        en: 'You are channeling strong romantic energy today, backed by seasonal support. Expressing care and affection yields clear responses — give generously.',
      },
      jibing: {
        zh: '今日日元生卦，卦气得助而旺，月令又当令，身体调节能力较强，宜趁势进行调养或治疗，效果倍增。（正气充沛，康复事半功倍。）',
        en: 'Day stem supports the hexagram with seasonal amplification. The body\'s adaptive capacity is strong — undertake treatment or recovery now for best results.',
      },
      shiwu: {
        zh: '今日日元生卦、月令当旺，寻找失物方向明确，投入精力必有收获。（宜多方打探，顺着能量最强的方向追查。）',
        en: 'Energy flows clearly toward finding the lost item today. The seasonal boost amplifies direction — invest effort actively; leads will emerge.',
      },
      susong: {
        zh: '今日日元生卦，气势向外输出且月令当旺，诉讼中积极进取、主动陈情最为有利，先发制人占优势。（主动呈证、正面表达效果最佳。）',
        en: 'You project strong outward energy in legal matters, amplified by the season. Taking the initiative — presenting evidence, speaking first — gives you an advantage.',
      },
    },
    // 休 — day feeds hexagram, but hexagram element is seasonally quiet
    normal: {
      tuijuan: {
        zh: '今日日元生扶卦气，付出之心已备，然月令入休，卦象能量受限，推断宜量力而行，勿过度消耗自身。（施力有余，受益有限，适可而止。）',
        en: 'Day stem nourishes the hexagram, but the hexagram\'s seasonal energy is quiet. The reading is supportive yet modest — contribute steadily without overextending.',
      },
      yunshi: {
        zh: '今日日元生卦，运势方面付出与输出的意愿强烈，然月令入休，气场回报偏弱，宜持续耕耘而非期待速效。（播种阶段，不宜急于收割。）',
        en: 'You are generous with energy today but the hexagram\'s seasonal reception is muted. Fortune rewards consistent work over quick results — sow, don\'t harvest.',
      },
      aiqing: {
        zh: '今日日元生卦，感情方面付出意愿积极，然月令入休，对方能量较低，互动回应稍显平淡，宜给予空间、细水长流。（强行推进恐适得其反，温柔守候更宜。）',
        en: 'You offer warmth, but the hexagram\'s energy is seasonally muted — the other party may not respond as expected. Give space; steady care outperforms pressure.',
      },
      jibing: {
        zh: '今日日元生卦，调养意愿积极，然月令入休，身体吸收恢复力偏弱，进补或治疗宜温和循序，避免过猛。（缓进则稳，急进则耗。）',
        en: 'You are investing in health, but the body\'s receptivity is seasonally subdued. Recovery treatments work best when gentle and gradual — avoid aggressive interventions.',
      },
      shiwu: {
        zh: '今日日元生卦，寻找失物的投入积极，然月令入休，线索能量偏弱，广撒网后需耐心等待回音。（不可急于求成，静候消息为宜。）',
        en: 'Effort goes into searching, but signals are quiet this season. Cast a wide net, then wait patiently — forcing it brings little return.',
      },
      susong: {
        zh: '今日日元生卦，诉讼方面有积极出击之意，然月令入休，对方或局势回应较慢，宜主动布局但勿期待立竿见影。（持续施压，不急于求最终裁决。）',
        en: 'You are active in legal proceedings but the other side\'s response is seasonally slow. Press forward steadily — don\'t expect an immediate verdict.',
      },
    },
    // 囚 / 死 — day feeds hexagram, but hexagram element is seasonally suppressed
    weak: {
      tuijuan: {
        zh: '今日日元生卦，付出虽有，然月令囚死，卦气受压难以受益，推断方向宜调整预期，切莫以为投入必有同等回报。（力气出而效果微，审时度势方为智。）',
        en: 'Day stem gives to the hexagram, but seasonal suppression limits what it can receive. Adjust expectations — effort may not yield proportional results right now.',
      },
      yunshi: {
        zh: '今日日元生卦而月令囚死，运势方面能量输出去而难以回收，宜减少消耗，优先维持现有局面，勿轻易扩张。（此时施力多耗，守成为上。）',
        en: 'Energy flows out but cannot return effectively under seasonal suppression. Hold existing ground rather than expanding — avoid unnecessary expenditure.',
      },
      aiqing: {
        zh: '今日日元生卦而月令囚死，感情方面付出与给予的心意真切，然对方气场受压，难有有效回应，宜暂缓期待，给彼此更多时间。（情意虽深，时机尚未成熟。）',
        en: 'Your feelings are genuine, but the hexagram\'s suppressed seasonal energy limits the other party\'s ability to respond. Slow down and give time to both sides.',
      },
      jibing: {
        zh: '今日日元生卦而月令囚死，进补调养之力难以被身体充分吸收，宜选择轻柔保守的调养方式，避免过度干预。（此时身体敏感，重在不折腾。）',
        en: 'Healing energy is given, but the body\'s capacity to absorb it is seasonally limited. Keep treatments gentle and conservative — "do no harm" is the priority.',
      },
      shiwu: {
        zh: '今日日元生卦而月令囚死，寻找失物虽积极，然能量传导受阻，线索难以显现，宜暂歇，择日再寻更为适宜。（强行消耗精力而少收益，休整后再出发。）',
        en: 'Active searching, but the energy chain is blocked by the season. Clues are hard to surface — pause and try again on a more favorable day.',
      },
      susong: {
        zh: '今日日元生卦而月令囚死，诉讼之气输出后难有回响，形势压抑不利正面推进，宜采取迂回或守势，等待反转时机。（硬攻无益，蓄势待机为上。）',
        en: 'You put energy into legal action, but seasonal suppression blocks effective impact. Avoid direct confrontation — a waiting or flanking strategy is wiser.',
      },
    },
  },

  // ── 卦生日 (hexagram element generates day stem) ─────────────────────────────
  gua_sheng: {
    // 旺 / 相 — hexagram feeds day stem, and hexagram element is seasonally powerful
    strong: {
      tuijuan: {
        zh: '今日卦气旺盛生扶日元，天时地利人和，推断方向得外力强力支撑，宜顺势借力，放手一搏。（外部资源充沛，借助他力事半功倍。）',
        en: 'A seasonally powerful hexagram nourishes your day stem. External support is abundant — borrow strength from circumstances and act decisively.',
      },
      yunshi: {
        zh: '今日卦气当旺生日，运势如乘顺风之舟，外部机遇与贵人扶持齐至，适合接受助力、主动借势。（善加利用外部资源，运势顺畅无阻。）',
        en: 'The hexagram\'s strong seasonal energy boosts your day stem. Fortune arrives through outside support and benefactors — accept help and ride the wave.',
      },
      aiqing: {
        zh: '今日卦气旺盛生扶日元，感情方面外部缘分积极向内涌入，对方或周围环境主动示好，宜以开放心态接纳。（被喜欢、被追求的能量当旺，顺其自然最美好。）',
        en: 'A powerful hexagram pours energy into your day stem. In love, the other party or favorable circumstances lean toward you — be open and receptive.',
      },
      jibing: {
        zh: '今日卦气旺相生扶日元，身体从外部环境中汲取能量，调养事半功倍，适合接受治疗或食补。（外力助益充沛，此时进补或康复效果最佳。）',
        en: 'The hexagram\'s strong seasonal energy flows into your day stem. The body absorbs healing and nourishment exceptionally well — ideal for treatment or tonic.',
      },
      shiwu: {
        zh: '今日卦气旺生日元，寻找失物方面外部信息和线索主动汇聚而来，宜多留意他人提示或意外消息。（不必强求，有缘自来。）',
        en: 'Strong hexagram energy channels into your day stem. Information and clues about the lost item tend to arrive unsolicited — stay alert for unexpected leads.',
      },
      susong: {
        zh: '今日卦气旺盛生扶日元，诉讼方面有外部支援、有利证据或贵人相助涌现，形势向有利方向倾斜。（善用外部资源，主动拓展支持面。）',
        en: 'A powerful hexagram supports your position. External allies, favorable evidence, or helpful intermediaries emerge — actively build on this support.',
      },
    },
    // 休 — hexagram feeds day stem, but hexagram element is seasonally quiet
    normal: {
      tuijuan: {
        zh: '今日卦气生扶日元，外力扶助之意存在，然月令入休，卦气能量平缓，推断方向得一定外力助益，然有限，宜自力更生为主。（稍有助力，终究靠自身努力。）',
        en: 'The hexagram offers some support to your day stem, but its seasonal energy is quiet. Outside help exists but is limited — rely primarily on your own effort.',
      },
      yunshi: {
        zh: '今日卦气生日，运势有外部资源挹注，然月令入休，助力有限而非涌至，宜珍惜当前得到的支持，稳扎稳打。（小助力能成大事，关键在善加利用。）',
        en: 'The hexagram feeds your day stem, though the seasonal supply is modest. Fortune receives quiet outside support — make the most of what comes your way.',
      },
      aiqing: {
        zh: '今日卦气生日，感情方面有来自对方或外部环境的温柔支持，然月令入休，热情稍显克制，宜细腻感受、珍视这份平实的情意。（淡中有真味，勿忽视细微关怀。）',
        en: 'The hexagram gently feeds your day stem. In love, quiet support and small acts of care are present — notice and appreciate them rather than seeking grand gestures.',
      },
      jibing: {
        zh: '今日卦气生日，调养方面有外部辅助能量，然月令入休，效力温和，宜选择平和调养方式，稳定滋补，功效缓而持久。（温补胜于大补，循序渐进为宜。）',
        en: 'Gentle external support flows toward your day stem. Health benefits from mild, consistent nourishment rather than strong treatments — slow and steady wins.',
      },
      shiwu: {
        zh: '今日卦气生日，寻找失物方面有外部信息支持，然月令入休，线索偶有而非主动涌现，宜保持耐心，留意生活中的细微提示。（顺其自然，不可操之过急。）',
        en: 'Quiet external signals about the lost item may appear today. The seasonal energy is subdued — stay patient and notice small hints rather than searching frantically.',
      },
      susong: {
        zh: '今日卦气生日，诉讼方面有一定的外部支持存在，然月令入休，助力有限，宜利用现有资源踏实推进，不宜依赖外力单独决胜。（借力打力，但自身实力亦要同步强化。）',
        en: 'Some outside support exists in legal matters, but the seasonal energy is quiet. Use available resources steadily — don\'t rely on external help alone to win.',
      },
    },
    // 囚 / 死 — hexagram feeds day stem, but hexagram element is seasonally suppressed
    weak: {
      tuijuan: {
        zh: '今日卦气生日，然月令囚死，卦气受压，推断方向所依赖的外部助力大为减弱，宜降低对外援的期待，多靠自身应对。（外力今日有心无力，自强方为根本。）',
        en: 'The hexagram tries to support your day stem, but seasonal suppression has drained it. External help is well-intentioned but limited — rely on your own resources.',
      },
      yunshi: {
        zh: '今日卦气生日而月令囚死，运势方面外部助力能量受压，贵人效力打折，宜避免过度倚赖他人，主动自谋出路。（外援今日乏力，自立才是根本对策。）',
        en: 'External support for your fortune is seasonally weakened. Benefactors have less to offer today — take initiative rather than waiting for outside help.',
      },
      aiqing: {
        zh: '今日卦气生日而月令囚死，感情方面对方或外部缘分的能量受压，付出与回应之间出现落差，宜调整期待，给彼此空间休整。（外力此时有限，感情宜守不宜催。）',
        en: 'The hexagram\'s support is seasonally suppressed. In love, the other party\'s energy is low — a mismatch between giving and receiving is likely. Give space.',
      },
      jibing: {
        zh: '今日卦气生日而月令囚死，外部调养能量受限，外部治疗或辅助手段效果打折，宜以自身修养为主，减少依赖外部干预。（自身固本培元，胜于追求外部干预。）',
        en: 'External healing energies are suppressed by the season. External treatments have reduced effectiveness — focus on basic self-care and building inner resilience.',
      },
      shiwu: {
        zh: '今日卦气生日而月令囚死，失物方面来自外部的线索或信息受到压制，他人提供的帮助有限，宜调低期待，暂作搁置。（外部助力今日乏力，待时机转机再寻。）',
        en: 'External leads about the lost item are suppressed by the season. Help from others is limited — lower expectations and consider waiting for a better time.',
      },
      susong: {
        zh: '今日卦气生日而月令囚死，诉讼中来自外部的支持与证人效力受压，形势外援不足，宜转向强化自身论点与证据，减少对外部援助的依赖。（此时外援虚多实少，自身论据才是核心。）',
        en: 'External support in legal matters is weakened by the season. Witnesses and allies have limited impact — strengthen your own argument and evidence base instead.',
      },
    },
  },

  // ── 日克卦 (day stem controls hexagram element) ──────────────────────────────
  ri_ke: {
    // 旺 / 相 — day overpowers hexagram, and hexagram element is seasonally strong (offers resistance)
    strong: {
      tuijuan: {
        zh: '今日日元制约卦气，然卦气月令当旺，被克而不屈，推断方向存在明显张力与博弈，宜有策略地推进，以柔克刚更胜强攻。（硬碰硬难分胜负，智取方为上策。）',
        en: 'Day stem challenges the hexagram, but the hexagram is seasonally strong and resists. The reading carries real tension — strategic maneuvering beats brute force.',
      },
      yunshi: {
        zh: '今日日元制卦，运势方面有主动掌控局面之势，然月令卦气当旺，阻力不小，宜坚定方向、审慎决策，切忌轻率冒进。（掌控意愿强烈，但阻力亦大，稳中求进。）',
        en: 'You have strong will to control outcomes, but a seasonally strong hexagram pushes back. Advance steadily with clear strategy — avoid rash moves.',
      },
      aiqing: {
        zh: '今日日元制卦，感情方面有主导欲与掌控倾向，月令卦气旺相，对方同样能量充足，易产生正面交锋，宜调整姿态，以理解代替控制。（相互制衡之局，主动退让一步反而更能赢得信任。）',
        en: 'You tend to lead or control in romance today, but the other party is equally energized. A power dynamic may emerge — choose understanding over dominance.',
      },
      jibing: {
        zh: '今日日元制卦、月令卦气旺相，身体内部存在一定的元素张力，宜关注情绪压力对身体的影响，注意疏导而非压抑。（张力过强则伤，宜适时释放、松弛有道。）',
        en: 'Internal elemental tension is high today, amplified by the season. Monitor stress and pressure — release rather than suppress. Relaxation is as important as effort.',
      },
      shiwu: {
        zh: '今日日元制卦、卦气月令当旺，寻找失物方面主动搜寻意志坚定，然线索方向有所阻隔，宜多方位探查，不宜执着于单一方向。（方向明确但有阻力，换个角度往往有所突破。）',
        en: 'Strong will to find the lost item meets seasonal resistance. The single-track search hits barriers — try multiple directions; a different angle often breaks through.',
      },
      susong: {
        zh: '今日日元制卦、月令卦气旺相，诉讼方面日方气势压制对方，然对方底气不弱，宜以充分准备的正面论据取胜，避免情绪化对抗。（气势有余，证据更需扎实，方可稳操胜券。）',
        en: 'You hold an assertive position but face a seasonally fortified opponent. Win through solid evidence and clear argument — emotional confrontation backfires.',
      },
    },
    // 休 — day controls hexagram, and hexagram element is seasonally quiet
    normal: {
      tuijuan: {
        zh: '今日日元制约卦气，月令卦气平稳入休，阻力不大，推断方向宜审慎决策，谨守原则则可化解潜在阻碍。（制而不激，稳步推进即可。）',
        en: 'Day stem controls the hexagram, which is quietly seasonal. Resistance is modest — proceed with care and principle; obstacles yield to steady, measured action.',
      },
      yunshi: {
        zh: '今日日元制卦，运势方面宜审慎决策，切忌轻率冒进。月令卦气平稳，阻力不大，谨守原则则可化解。（把握主动权，稳中有进。）',
        en: 'Day stem controls the hexagram with modest seasonal resistance. Fortune rewards caution and principle. You hold the lead — advance steadily without overreaching.',
      },
      aiqing: {
        zh: '今日日元制卦，感情方面有主导之势，月令卦气平淡，对方或局势较为温和，宜善用这份主动权，温柔而坚定地引导关系走向。（主动而不强势，方能持续赢得信任。）',
        en: 'You have a gentle lead in romantic matters, and the other side is seasonally calm. Use this advantage softly and firmly — guide rather than control.',
      },
      jibing: {
        zh: '今日日元制卦、月令入休，身体内部元素关系趋于平衡，宜维持规律调养，避免情绪起伏影响健康节律。（平稳是此时最大的健康资产。）',
        en: 'The day stem and hexagram maintain a calm balance with quiet seasonal energy. Health benefits most from regularity and emotional stability right now.',
      },
      shiwu: {
        zh: '今日日元制卦、月令入休，寻找失物方面主动探查阻力不大，宜按部就班地排查，有条理的搜寻效果优于大范围乱找。（系统性搜索胜于情绪化随机找寻。）',
        en: 'The search energy is controlled and seasonal resistance is low. Systematic, methodical searching outperforms frantic or scattered efforts — organize and check methodically.',
      },
      susong: {
        zh: '今日日元制卦，诉讼方面处于主动位置，月令卦气平稳，对方阻力可控，宜沉稳表达、有理有据推进，早日达成有利裁决。（形势稳中偏顺，把握好节奏即可。）',
        en: 'You hold a controlled position in legal matters with manageable resistance. Present clearly and methodically — the situation is quietly favorable; maintain pace.',
      },
    },
    // 囚 / 死 — day controls hexagram, and hexagram element is already suppressed
    weak: {
      tuijuan: {
        zh: '今日日元制卦而月令囚死，卦气已受压制，日干制克力道过重，推断方向恐走向过度压抑，宜适当松弛管控，给结果留有余地。（过克则伤，适度留白方能转机。）',
        en: 'Day stem over-controls a seasonally suppressed hexagram. The reading risks becoming too constrained — ease the grip and leave room for outcomes to breathe.',
      },
      yunshi: {
        zh: '今日日元制卦而月令囚死，运势方面控制欲过强而消耗自身，宜放开执念，减少无谓的强行干预，否则得不偿失。（过度掌控反而内耗，学会松手才是智慧。）',
        en: 'Day stem over-dominates an already-suppressed hexagram. The drive to control fortune costs more than it gains — let go of rigid expectations to avoid self-depletion.',
      },
      aiqing: {
        zh: '今日日元制卦而月令囚死，感情方面控制或主导倾向偏强，对方能量受压，易产生压迫感，宜主动退让，给对方空间喘息。（感情中过克易推远对方，退一步海阔天空。）',
        en: 'You risk over-controlling in romance while the other party is already low-energy. Dominance now creates distance — consciously step back and give breathing room.',
      },
      jibing: {
        zh: '今日日元制卦而月令囚死，身体某方面能量受到双重压制，宜特别关注情绪或压力带来的身心负担，以休息和缓解为优先。（此时补益需轻柔，重压反成负担。）',
        en: 'Dual suppression weighs on body energy today. Prioritize rest and stress relief above all — heavy interventions or treatments may add burden rather than help.',
      },
      shiwu: {
        zh: '今日日元制卦而月令囚死，失物能量已受双重压制，主动搜寻易遭受阻，宜暂停强行搜寻，耐心等待时机自然显现。（此时强求无益，暂放一旁，或日后自见。）',
        en: 'Dual suppression makes finding the lost item very difficult today. Active searching hits walls — pause, be patient, and let time bring the opportunity to surface.',
      },
      susong: {
        zh: '今日日元制卦而月令囚死，诉讼方面虽有制压之势，然对方已被逼至墙角，反而可能激起强烈反弹，宜见好就收，不可过激。（穷鼠噬猫，逼迫过甚易生变数，留有余地为上。）',
        en: 'Though you dominate, the other side is cornered and may react unpredictably. A suppressed opponent can turn dangerous — leave room for retreat; don\'t push to the wall.',
      },
    },
  },

  // ── 卦克日 (hexagram element controls day stem) ──────────────────────────────
  gua_ke: {
    // 旺 / 相 — hexagram overpowers day stem, and hexagram is seasonally strong
    strong: {
      tuijuan: {
        zh: '今日卦气旺盛克制日元，外部势力压迫明显，推断方向受制于环境，宜降低对抗意志，以屈伸有道化解压力，切忌硬顶。（顺势而退方能保存实力，图谋后势。）',
        en: 'A seasonally powerful hexagram overpowers your day stem. External pressure is significant — yielding strategically preserves your strength; direct resistance backfires.',
      },
      yunshi: {
        zh: '今日卦气旺相克日，运势方面外部环境强势压制，行事宜谨慎守势，避免主动出击引发更大冲突。（韬光养晦，不争一时之气，留力图后计。）',
        en: 'A strong hexagram bears down on your day stem. Fortune does not favor initiative today — lie low, avoid conflict, and preserve energy for a better moment.',
      },
      aiqing: {
        zh: '今日卦气旺相克日，感情方面外部压力或对方强势能量压制自身，宜保持自我边界，不必勉强迎合，从容应对最为适宜。（不卑不亢，以平静的态度守住本心。）',
        en: 'The hexagram\'s dominant energy can feel like pressure in relationships. Maintain your own boundaries — don\'t bend to please; composed self-possession is the wisest response.',
      },
      jibing: {
        zh: '今日卦气旺相克日，外部环境或情绪压力对身体冲击较大，宜减少对抗性活动，以静养为主，避免外邪入侵。（此时防守为上，修养身心胜于对抗外压。）',
        en: 'Strong external pressure bears on your physical day stem. Minimize confrontational activity; prioritize quiet recovery and protecting yourself from external stressors.',
      },
      shiwu: {
        zh: '今日卦气旺相克日，失物方面外部阻力明显，线索被压制或被干扰，宜暂停主动搜寻，转为广泛布阵、静待消息汇聚。（外力强大，正面冲击难奏效，以静制动为上。）',
        en: 'Strong external energy blocks your search. Clues are obscured or misdirected — spread a wide net and wait for information to come to you rather than pushing hard.',
      },
      susong: {
        zh: '今日卦气旺相克日，诉讼方面对方声势强劲，直接对抗恐处于下风，宜寻求第三方调解或迂回布阵，避免正面决战。（对手旺盛，此时正面交锋不利，以策略取胜为智。）',
        en: 'A strong opponent dominates in legal matters today. Avoid direct confrontation — seek mediation or indirect strategy; frontal battle favors the other side.',
      },
    },
    // 休 — hexagram controls day stem, but hexagram element is seasonally quiet
    normal: {
      tuijuan: {
        zh: '今日卦气克日，然月令入休，外部制压力道已趋平缓，推断方向所受阻力可管控，审慎稳健推进即可化解大半。（外压存在但不重，守中有进可期。）',
        en: 'The hexagram controls your day stem, but its seasonal energy is quiet. External pressure exists but is manageable — careful, steady action can overcome it.',
      },
      yunshi: {
        zh: '今日卦气克日而月令入休，运势方面有来自外部的限制，然制压偏弱，只要行事低调稳健，不必过分担忧阻碍。（外压轻微，守势足以应对。）',
        en: 'The hexagram restrains your day stem mildly under a quiet season. Obstacles are real but manageable — a low-profile, steady approach keeps things on track.',
      },
      aiqing: {
        zh: '今日卦气克日而月令入休，感情方面有来自对方或外部环境的温和约束，宜体察对方情绪与需求，多倾听少强求，关系可平稳发展。（感受到压力时，以柔应之，情感可趋稳。）',
        en: 'A mild constraint from the hexagram enters love dynamics today. The other party may set limits — listen more, demand less; the relationship steadies with flexibility.',
      },
      jibing: {
        zh: '今日卦气克日而月令入休，外部对身体的干扰力道适中，宜保持规律作息，避免情绪波动，以稳定的节律度过这一段平稳期。（安稳是今日健康的最大资产。）',
        en: 'Mild hexagram pressure on your day stem suggests external factors affect health moderately. Maintain steady routine and emotional calm — stability is the key asset today.',
      },
      shiwu: {
        zh: '今日卦气克日而月令入休，寻找失物方面有一定干扰，然制压不重，条理清晰地逐步排查，耐心可得线索。（不急不躁，有序寻找可期见效。）',
        en: 'Moderate interference in the search, but the seasonal energy is quiet. Methodical, patient searching works — stay organized and don\'t get flustered.',
      },
      susong: {
        zh: '今日卦气克日而月令入休，诉讼方面所受压制程度有限，宜稳健收集证据、低调布局，不必急于正面决战。（形势稳中带压，沉稳应对最为妥当。）',
        en: 'The legal situation carries moderate external pressure but is not overwhelming. Stay composed, build your case carefully, and avoid premature confrontation.',
      },
    },
    // 囚 / 死 — hexagram controls day stem, but hexagram element is itself suppressed
    weak: {
      tuijuan: {
        zh: '今日卦气克日，然月令囚死，卦气本身已受压，制克力道大为衰减，推断方向受到的阻力有限，宜把握这一窗口期稳步推进。（纸老虎之势，审时度势可乘虚而进。）',
        en: 'The hexagram challenges your day stem, but is itself seasonally suppressed, leaving it toothless. The obstacle is real in name but limited in force — advance steadily.',
      },
      yunshi: {
        zh: '今日卦气克日而月令囚死，外部制约虽存，然卦气本身能量受压、力道衰弱，运势所受阻力有限，宜适度出击，把握这一难得的窗口。（外压今日虚多实少，正是稳步图进的时机。）',
        en: 'External constraints exist but the hexagram\'s suppressed energy makes them hollow. Resistance is lower than it appears — this is a window to advance carefully.',
      },
      aiqing: {
        zh: '今日卦气克日而月令囚死，感情方面外部阻力或对方的约束能量受压、偏弱，宜主动出击，争取突破原有僵局。（对方今日气弱，是沟通与和解的好时机。）',
        en: 'The constraining force in your relationship is seasonally weakened today. The other party\'s resistance is low — this is a good time to open dialogue or bridge divides.',
      },
      jibing: {
        zh: '今日卦气克日而月令囚死，外部因素对身体的干扰已大幅减弱，正是趁势调养、积累正气的好时机，宜善加利用。（阻力今日最小，抓住时机精心调养。）',
        en: 'External health pressures are at their weakest today under dual suppression. Use this window actively for recovery, nourishment, and building resilience.',
      },
      shiwu: {
        zh: '今日卦气克日而月令囚死，外部对失物线索的干扰已减弱，此前受阻的方向可以重新探查，或有意外收获。（阻力松动，不妨重返之前未果的方向再试。）',
        en: 'The interference around your lost item is seasonally weakened. Previously blocked directions may now yield results — revisit leads that seemed dead-ended before.',
      },
      susong: {
        zh: '今日卦气克日而月令囚死，对方的气势已受月令大幅压制，是发起攻势、争取有利裁决的好时机，宜把握主动、趁势推进。（对手今日力弱，攻守易势，宜主动出击，争取终结。）',
        en: 'Your opponent\'s energy is suppressed by the season, weakening their position. The balance has shifted in your favor — press your advantage and seek a decisive resolution.',
      },
    },
  },
};

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns the modifier text for a specific field given today's resonance data,
 * or null if the cell is still a TODO placeholder (empty string).
 *
 * Usage in ResultScreen / fortune tab rendering:
 *
 *   const modifier = getFieldModifier(resonanceData, 'yunshi', lang);
 *   if (modifier) {
 *     // append or show below existing field text
 *   }
 */
export function getFieldModifier(
  data: HexResonanceData,
  field: ModifiableField,
  lang: 'zh' | 'en',
): string | null {
  const cell = MODIFIERS[data.resonance][toStrength(data.wangXiang)][field];
  const text = lang === 'zh' ? cell.zh : cell.en;
  return text.length > 0 ? text : null;
}

/**
 * Returns true if ANY modifier is filled for this resonance × strength combo.
 * Useful for showing/hiding the "今日八字调性" section header.
 */
export function hasAnyModifier(data: HexResonanceData): boolean {
  const tier = MODIFIERS[data.resonance][toStrength(data.wangXiang)];
  return Object.values(tier).some(m => m.zh.length > 0);
}

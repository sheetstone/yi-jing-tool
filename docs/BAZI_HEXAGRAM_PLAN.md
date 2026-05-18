# 八字 × 卦象结合计划

> 目标：将占卜当日的八字时间信息（五行生克、月令旺相）与卦象解读结合，
> 给出更具时间感知的个性化解读，无需改动任何原有卦辞文本。

---

## 背景与理论依据

传统将时间信息引入卦象，属**六爻占卜**体系，核心三层机制：

| 层次 | 机制 | 是否已实现 |
|------|------|-----------|
| 一 | 五行生克（日干元素 vs 卦象元素） | ✅ Batch 1 |
| 二 | 月令旺相休囚死（季节能量强弱） | ✅ Batch 1 |
| 三 | 纳甲六爻（变爻干支精细计算） | ⬜ Batch 3 |

### 五行关系速查

**生克方向（→ 表示"生"或"克"）：**
- 生（顺）：木→火→土→金→水→木
- 克（逆）：木→土→水→火→金→木

**月令旺相休囚死推导法则**（设季节令为 S）：
- 与 S 相同 → **旺**
- S 生之 → **相**（S 生该元素，该元素受助）
- 该元素生 S → **休**（该元素已耗于 S）
- S 克之 → **囚**（S 克该元素，该元素被压）
- 该元素克 S → **死**（该元素克 S 但被季节反制，力竭）

**月支→季节对照：**
- 寅卯 → 木（春）
- 巳午 → 火（夏）
- 申酉 → 金（秋）
- 亥子 → 水（冬）
- 辰戌丑未 → 土（四季）

---

## 当前实现状态

### 已完成文件

| 文件 | 功能 | Batch |
|------|------|-------|
| `src/utils/bazi.ts` | 八字四柱计算（年/月/日/时柱）+ 农历 Intl | ✅ 基础 |
| `src/utils/hexResonance.ts` | 卦象×日干五行关系计算 + 15条描述文本 | ✅ 1 |
| `src/utils/hexResonanceModifiers.ts` | 六字段修饰语表结构（内容待填） | 🏗️ 2骨架 |
| `src/components/DateDisplay.tsx/css` | 汉字日期 + 八字四柱 + 五行条 | ✅ 基础 |
| `src/components/HexResonance.tsx/css` | 今日卦运卡片（日干↔卦象流向图） | ✅ 1 |
| `src/utils/shareImage.ts` | Canvas 保存图（含日期/八字） | ✅ 基础 |

### 结果页目前的布局顺序

```
占卜结果
  └── DateDisplay（汉字日期 + 干支 + 农历 + 八字四柱 + 五行条）
  └── 本卦区域
        ├── 本卦标题 + [i]说明
        ├── 卦号 + 卦名
        ├── HexagramDiagram（卦象图）
        ├── HexResonance（今日卦运：日干↔卦象 + 旺相 + 描述）  ← Batch 1 新增
        ├── 卦辞 + 卜辞
        ├── 大象
        ├── 推断
        └── 运势/爱情/疾病/失物/诉讼 tab
  └── 变爻区域（如有）
  └── 变卦区域（如有，含自己的 HexResonance）
  └── 广告
  └── [保存卦象] [重新占卜]
```

---

## Batch 2 计划：六字段调性修饰语

### 目标

为以下 6 个字段各添加 1–2 句「今日八字调性」修饰，追加在原有静态文本之后显示。

**排除字段**：`daxiang`（大象）和 `buci`（卜辞）为古典原典，不做干预。

### 维度矩阵

```
5 种关系 × 3 强弱档 × 6 字段 = 90 个修饰文本单元（× 中英双语 = 180 段）
```

| 关系（Resonance） | 键名 | 含义 |
|------------------|------|------|
| 比和 | `bihe` | 日干与卦象同元素 |
| 日生卦 | `ri_sheng` | 日干生卦象元素 |
| 卦生日 | `gua_sheng` | 卦象元素生日干 |
| 日克卦 | `ri_ke` | 日干克卦象元素 |
| 卦克日 | `gua_ke` | 卦象元素克日干 |

| 强弱（Strength） | 覆盖的旺相状态 |
|----------------|--------------|
| `strong` | 旺、相 |
| `normal` | 休 |
| `weak` | 囚、死 |

### 修饰语写作规范

**格式**（每条 30–60 汉字）：

```
今日[关系描述]，[字段方向][调性修饰]。（月令[强弱背景]，[简短提示]。）
```

**示例（ri_ke / normal / yunshi）**：
> 今日日元制约卦气，运势方面宜审慎决策，切忌轻率冒进。月令卦气平稳，阻力不大，谨守则可化解。

**示例（bihe / strong / aiqing）**：
> 今日同气当令共振，感情能量充沛而清晰。主动表达心意最为有利，桃花缘分更易显现。

**语气要求**：
- 古典简洁，不啰嗦
- 每条需体现「关系」+「字段」两个维度
- 中英文风格一致（英文略为简洁）

### 分批填写建议

每次对话专注填一个关系的所有字段（18 条文本/次）：

| 次序 | 关系 | 预计 token |
|------|------|-----------|
| 2-A | `bihe`（比和）| ~4,000 |
| 2-B | `ri_sheng`（日生卦）| ~4,000 |
| 2-C | `gua_sheng`（卦生日）| ~4,000 |
| 2-D | `ri_ke`（日克卦）| ~4,000 |
| 2-E | `gua_ke`（卦克日）| ~4,000 |

### 代码接入（内容填好后执行）

1. 在 `ResultScreen.tsx` 的每个字段 tab 内容区加：

```tsx
// 在各字段 <p> 文本之后
const modifier = getFieldModifier(resonanceData, 'yunshi', lang);
if (modifier) {
  <p className="field-modifier">{modifier}</p>
}
```

2. CSS 样式（`ResultScreen.css` 追加）：

```css
.field-modifier {
  font-size: 0.82rem;
  color: var(--text-secondary);
  border-left: 2px solid rgba(212, 168, 67, 0.25);
  padding-left: 10px;
  margin-top: 10px;
  line-height: 1.7;
  font-style: italic;
}
```

3. 更新 `shareImage.ts`：在保存图的推断（tuijuan）文字之后追加 tuijuan 修饰语。

---

## Batch 3 计划：变爻纳甲算法

### 目标

为每条**变爻**分配干支（纳甲法），计算其与占卜日干支的生克关系，
在变爻解读中追加「此爻今日[受助/受制/平和]」动态标注。

---

### 理论背景

**纳甲法**将八卦各爻与天干地支配对，规则来源于汉代京房易学：
每个卦象视其处于上卦或下卦位置，分别对应不同的天干（即同一卦的天干在上下位置不同）。

**五→三类别折叠决策：**

完整的五种生克关系：

| 关系 | 含义 |
|------|------|
| 日生爻 | 日干生该爻元素 → 爻得养 |
| 日克爻 | 日干克该爻元素 → 爻受制 |
| 爻生日 | 该爻元素生日干 → 爻泄气 |
| 爻克日 | 该爻元素克日干 → 爻主动 |
| 比和   | 同元素 → 平稳 |

折叠为三类（从**日对爻的影响**视角）：

| 状态 | 英文 key | 条件 | 解释 |
|------|---------|------|------|
| 受助/得力 | `assisted` | `GEN[dayEl] === lineEl` | 日生爻：日干养该爻，变化方向得助 |
| 受制 | `restrained` | `CTL[dayEl] === lineEl` | 日克爻：日干压制该爻，变化方向受阻 |
| 平和 | `neutral` | 其余（比和 + 爻生日 + 爻克日） | 日对爻无直接压制或养助 |

> 选择「日对爻」视角的原因：用户核心问题是「这条变爻今日是否顺畅」，
> 而非爻对日的影响，因此以日干为主动方最为直觉。

---

### 纳甲查表规则

每个八卦按上/下位置存储 6 个干支（同一数组，用爻位索引直接取）：
- 索引 0–2：该卦作为**下卦**时，初爻/二爻/三爻的干支
- 索引 3–5：该卦作为**上卦**时，四爻/五爻/上爻的干支

```
NAJA_TABLE[卦名][爻位0~5]
           爻位 < 3 → 用 lowerTrigram 查表
           爻位 >= 3 → 用 upperTrigram 查表
```

完整查表数据：

| 卦 | 初(0) | 二(1) | 三(2) | 四(3) | 五(4) | 上(5) |
|----|-------|-------|-------|-------|-------|-------|
| 乾 | 甲子  | 甲寅  | 甲辰  | 壬午  | 壬申  | 壬戌  |
| 坤 | 乙未  | 癸丑  | 癸卯  | 甲午  | 甲申  | 甲戌  |
| 震 | 庚子  | 庚寅  | 庚辰  | 庚午  | 庚申  | 庚戌  |
| 巽 | 辛丑  | 辛亥  | 辛酉  | 辛未  | 辛巳  | 辛卯  |
| 坎 | 戊寅  | 戊子  | 戊戌  | 戊申  | 戊午  | 戊辰  |
| 离 | 己卯  | 己巳  | 己未  | 己酉  | 己亥  | 己丑  |
| 艮 | 丙辰  | 丙寅  | 丙子  | 丙戌  | 丙申  | 丙午  |
| 兑 | 丁巳  | 丁卯  | 丁丑  | 丁亥  | 丁酉  | 丁未  |

**天干→五行速查（naJia.ts 内自定义，不依赖 bazi.ts）：**

```
甲乙→木  丙丁→火  戊己→土  庚辛→金  壬癸→水
```

---

### 分批实施

#### Batch 3-A：算法核心 — `src/utils/naJia.ts`（约 2,500 token）

**新建文件，内容：**

```typescript
import type { TrigramName } from '../types';
import type { ReadingDate } from './bazi';

export type NaJiaState = 'assisted' | 'restrained' | 'neutral';

export interface NaJiaResult {
  ganzhi:  string;      // 例：'甲子'
  stem:    string;      // 例：'甲'
  branch:  string;      // 例：'子'
  element: string;      // 例：'木'
  state:   NaJiaState;
}

// 纳甲查表（索引 = 爻位 0–5）
const NAJA_TABLE: Record<TrigramName, readonly [string,string,string,string,string,string]> = {
  乾: ['甲子','甲寅','甲辰','壬午','壬申','壬戌'],
  坤: ['乙未','癸丑','癸卯','甲午','甲申','甲戌'],
  震: ['庚子','庚寅','庚辰','庚午','庚申','庚戌'],
  巽: ['辛丑','辛亥','辛酉','辛未','辛巳','辛卯'],
  坎: ['戊寅','戊子','戊戌','戊申','戊午','戊辰'],
  离: ['己卯','己巳','己未','己酉','己亥','己丑'],
  艮: ['丙辰','丙寅','丙子','丙戌','丙申','丙午'],
  兑: ['丁巳','丁卯','丁丑','丁亥','丁酉','丁未'],
};

const STEM_EL: Record<string, string> = {
  甲:'木', 乙:'木', 丙:'火', 丁:'火', 戊:'土',
  己:'土', 庚:'金', 辛:'金', 壬:'水', 癸:'水',
};

const GEN: Record<string,string> = { 木:'火', 火:'土', 土:'金', 金:'水', 水:'木' };
const CTL: Record<string,string> = { 木:'土', 土:'水', 水:'火', 火:'金', 金:'木' };

export function getChangingLineNaJia(
  upperTrigram: TrigramName,
  lowerTrigram: TrigramName,
  linePos: number,      // 0-indexed, 0=初爻 … 5=上爻
  rd: ReadingDate,
): NaJiaResult {
  const trigram  = linePos < 3 ? lowerTrigram : upperTrigram;
  const ganzhi   = NAJA_TABLE[trigram][linePos];
  const stem     = ganzhi[0];
  const branch   = ganzhi[1];
  const element  = STEM_EL[stem];
  const dayEl    = rd.pillars[2].stemEl;

  let state: NaJiaState;
  if      (GEN[dayEl] === element) state = 'assisted';
  else if (CTL[dayEl] === element) state = 'restrained';
  else                             state = 'neutral';

  return { ganzhi, stem, branch, element, state };
}
```

**验证：** `npx tsc --noEmit`

---

#### Batch 3-B：ResultScreen 接入 + CSS（约 2,000 token）

**目标布局（变爻 card 内）：**

```
┌──────────────────────────────────────────┐
│  初九          老阳 → 阴                  │  ← 现有 .changing-line-header
│  甲子 · 木     [今日得力]                 │  ← 新增 .naJia-bar
├──────────────────────────────────────────┤
│  爻辞文本 ...                             │
│  推断 ...                                │
│  运势 / 爱情 / ... tab                   │
└──────────────────────────────────────────┘
```

**ResultScreen.tsx 改动：**

1. 顶部 import：
   ```typescript
   import { getChangingLineNaJia } from '../utils/naJia';
   ```

2. 在 `changingLinePositions.map(pos => ...)` 的 card 内、`.changing-line-header` 之后插入：
   ```tsx
   {(() => {
     const nj = getChangingLineNaJia(
       primaryHexagram.upperTrigram,
       primaryHexagram.lowerTrigram,
       pos, readingDate
     );
     const stateLabel = lang === 'zh'
       ? (nj.state === 'assisted' ? '今日得力' : nj.state === 'restrained' ? '今日受制' : '今日平和')
       : (nj.state === 'assisted' ? 'Aided Today' : nj.state === 'restrained' ? 'Restrained' : 'Balanced');
     return (
       <div className="naJia-bar">
         <span className="naJia-ganzhi">{nj.ganzhi}·{nj.element}</span>
         <span className={`naJia-tag naJia-${nj.state}`}>{stateLabel}</span>
       </div>
     );
   })()}
   ```

**CSS（ResultScreen.css 追加）：**

```css
/* === 纳甲爻 bar === */
.naJia-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 4px;
  margin-bottom: 6px;
}

.naJia-ganzhi {
  font-size: 0.75rem;
  color: var(--text-secondary);
  letter-spacing: 1px;
  opacity: 0.75;
}

.naJia-tag {
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  padding: 2px 7px;
  border-radius: 4px;
  border: 1px solid currentColor;
}

.naJia-assisted   { color: rgba(212, 168, 67, 0.9);  }   /* 金色 — 得力 */
.naJia-restrained { color: rgba(180,  70,  60, 0.85); }   /* 红色 — 受制 */
.naJia-neutral    { color: rgba(150, 140, 125, 0.7);  }   /* 灰色 — 平和 */
```

**验证：** `npx tsc --noEmit` + 手动测试含变爻的卦（推荐占一次乾卦全阳或坤卦全阴触发多变爻）

---

#### Batch 3-C（可选增强）：悬停说明 tooltip

在变爻区的 `[i]` popup 说明文字中追加纳甲解释：

```
（zh）各变爻的干支根据纳甲法推算：爻位对应该卦上/下卦天干，天干五行与占卜日干生克，
      决定此爻「今日得力/受制/平和」。
（en）Each line's ganzhi is derived via the Nà-Jiǎ method: the stem's element interacts
      with the day stem's element to show whether the line is aided, restrained, or balanced today.
```

**估算 token：** 约 500 token，可附在 3-B 末尾一并完成。

---

### 文件变更总览

| 文件 | 变更类型 | Batch |
|------|---------|-------|
| `src/utils/naJia.ts` | 新建 | 3-A |
| `src/components/ResultScreen.tsx` | 添加 import + naJia-bar JSX | 3-B |
| `src/components/ResultScreen.css` | 追加 `.naJia-*` 样式 | 3-B |

### 依赖关系

```
naJia.ts
  ├── types/index.ts   (TrigramName — 已有)
  └── bazi.ts          (ReadingDate — 已有)
        └── ResultScreen.tsx  (接入点)
```

### 测试建议

| 场景 | 如何触发 |
|------|---------|
| 单变爻 | 模拟一条老阳/老阴 |
| 多变爻（3条） | 连续多次老阳 |
| 受助 badge 出现 | 找日干木+变爻水位（水生木）或比和 |
| 受制 badge 出现 | 日干金+变爻木位（金克木） |
| 平和 badge 出现 | 日干木+变爻火位（木生火→爻生日→平和） |

---

## Batch 4 计划（可选）：深度定制解读

### 目标

为最常用的 16 卦（乾坤坎离震巽艮兑 + 屯蒙需讼师比 + 小畜履）×
每日干支组合，用 AI 生成半定制化的推断文本（非通用模板）。

### 规模

16 卦 × 30 日干支 = 480 条定制推断（中英双语）

**建议分批**：每批 16 卦 × 6 日干支 = 96 条，约需 5–6 轮对话。

---

## 技术债与注意事项

### 当前已知限制

1. **月令月支精度**：当前从八字月柱地支取月令，月柱以节气为界（约 ±1 天误差），精度已够用。
2. **年柱立春边界**：以公历 2/4 为立春，实际立春在 2/3–2/5 之间波动，极端情况有 1 天误差。
3. **农历日期**：使用浏览器 `Intl.DateTimeFormat` `ca-chinese`，在少数旧版 iOS 上可能不显示（已有 fallback）。
4. **卦象五行**：当前使用上卦（上卦）元素为主，纳甲法（Batch 3）会细化到爻级别。

### 文件依赖关系

```
bazi.ts
  └── DateDisplay.tsx

hexResonance.ts
  ├── HexResonance.tsx          (UI 组件)
  └── hexResonanceModifiers.ts  (Batch 2 调性修饰)
        └── ResultScreen.tsx    (接入点)

shareImage.ts                   (保存图，需 ReadingDate + HexResonanceData)
```

### 下次对话如何继续

打开 `src/utils/hexResonanceModifiers.ts`，
找到 `MODIFIERS` 对象，逐个将 `TODO` 替换为实际文本内容，
**每次只填一个顶层 key**（`bihe` / `ri_sheng` / `gua_sheng` / `ri_ke` / `gua_ke`）。

填完一个 key 后：
1. 运行 `npx tsc --noEmit` 确认无错
2. 在 `ResultScreen.tsx` 的 fortune tab 区域接入 `getFieldModifier()`
3. 测试显示效果

---

## 进度跟踪

| Batch | 描述 | 状态 |
|-------|------|------|
| 基础 | 汉字日期 + 八字四柱 + 五行条 + 保存图 | ✅ 完成 |
| 1 | 卦象五行共鸣算法 + 今日卦运 UI | ✅ 完成 |
| 2-骨架 | 六字段修饰语数据结构 + 函数签名 | ✅ 完成 |
| 2-A | 比和（bihe）18 条文本 | ✅ 完成 |
| 2-B | 日生卦（ri_sheng）18 条 | ✅ 完成 |
| 2-C | 卦生日（gua_sheng）18 条 | ✅ 完成 |
| 2-D | 日克卦（ri_ke）18 条 | ✅ 完成 |
| 2-E | 卦克日（gua_ke）18 条 | ✅ 完成 |
| 2-F | ResultScreen 接入 + CSS | ✅ 完成 |
| 3-A | 纳甲算法核心 `naJia.ts`（查表 + 五→三状态）| ✅ 完成 |
| 3-B | ResultScreen 接入 + CSS `.naJia-*` | ✅ 完成 |
| 3-C | 变爻 [i] 说明追加纳甲解释 | ✅ 完成 |
| 4 | 深度定制解读（可选）| ⬜ 可选 |

# Change Requests — 易经算卦

## Status Legend
- [ ] Not started
- [~] Blocked / In Progress
- [x] Done

---

## CR 1 — Enrich hexagram data from reference document
**Original:** Update with this document: https://www.scribd.com/document/730740176/%E5%91%A8%E6%98%93%E5%85%AD%E5%8D%81%E5%9B%9B%E5%8D%A6%E7%81%B5%E7%AD%BE

**Status:** [x] Resolved — sourced from classical I Ching texts

**Resolution:** Scribd document is paywalled and could not be accessed. All extended divination content (卜辞, 推断, 大象, 运势, 爱情, 疾病, 失物, 诉讼) has been written from classical I Ching textual knowledge for all 64 hexagrams, covering 大象传, traditional oracle interpretations, and fortune-telling categories.

**Scope:** See CR 5 — this ticket covers the data source; CR 5 covers the implementation.

---

## CR 2 — Add usage instructions to Start Screen
**Original:** Update the explanation on the first screen:
> 自古以来易占家坚持一事一占的原则
> 方法: 把你想要测的事在心头默念一至两遍,男用左手,女用右手,抽出一支完整挂签,然后把签放在桌子上,根据签上的图案和文字进行解读

**Status:** [x] Done

**Changes made:**
- Added `showInstructions` toggle to `StartScreen.tsx` — a subtle `查看说明 ▼` / `收起说明 ▲` button
- Instructions card shows:
  - Principle: 一事一占 rule
  - Method: coin divination procedure (adapted from three-coin method)
- Fully language-aware via `useLang()` — shows Chinese or English per user preference

**Files:** `StartScreen.tsx`, `StartScreen.css`

---

## CR 3 — Explain what 变爻 (Changing Lines) means
**Original:** 解释什么是变爻

**Status:** [x] Done

**Changes made:**
- In `ResultScreen.tsx`, added an **(i)** icon button next to the **变爻 · Changing Lines** section header
- Tapping (i) toggles an `info-popup` card with a bilingual explanation:
  - What 老阳/老阴 are (coin combination = 9 or 6)
  - Why they are called "changing" (yang/yin at peak transforms)
  - How the transformed hexagram (变卦) is the outcome
- Language-aware via `useLang()`

**Files:** `ResultScreen.tsx`, `ResultScreen.css`

---

## CR 4 — Language switcher (Chinese / English)
**Original:** 中文和英文分开，用一个多语言的转换器，转化中文和英文

**Status:** [x] Done

**Changes made:**
- Created `src/contexts/LangContext.tsx` — `lang: 'zh' | 'en'` state, `toggleLang()`, `t(zh, en)` helper; persists to `localStorage`
- Fixed position `中文 / EN` toggle button added in `App.tsx` (top-right, z-index 200)
- `<App>` wrapped in `<LangProvider>` in `main.tsx`
- All components updated: `StartScreen`, `DivinationScreen`, `HexagramBuilder`, `ResultScreen`

**Files:** `src/contexts/LangContext.tsx` (new), `main.tsx`, `App.tsx`, all screen/component files

---

## CR 5 — Add extended divination content per hexagram
**Original:** 为每个卦签增加以下内容（从文档或网络来源）:
卜辞 / 推断 / 大象 / 运势 / 爱情 / 疾病 / 失物 / 诉讼

**Status:** [x] Done

**Changes made:**

### Types — `src/types/index.ts`
Added `BilingualText { zh, en }` interface and 8 optional fields to `Hexagram`:
`daxiang`, `buci`, `tuijuan`, `yunshi`, `aiqing`, `jibing`, `shiwu`, `susong`

### Data — `src/data/hexagramDivination.ts` (new)
All 8 fields populated for all 64 hexagrams with classical I Ching content.
Merged into `src/data/hexagrams.ts`.

### UI — `src/components/ResultScreen.tsx`
- **Classical block** (always visible): 卦辞 → 大象 → 卜辞 → 推断
- **Fortune tabs** (tap to switch): 运势 / 爱情 / 疾病 / 失物 / 诉讼
- All content language-aware

**Files:** `src/types/index.ts`, `src/data/hexagrams.ts`, `src/data/hexagramDivination.ts`, `ResultScreen.tsx`, `ResultScreen.css`

---

## CR 6 — Improve coin / line-type clarity in Divination Screen
**Original:** 卦的铜钱难以区分阴或者阳，每次摇出的卦，少阴少阳等语句不是很清晰，可以考虑增加一个 (i) 来显示具体的解释

**Status:** [x] Done

**Changes made:**
- **Coin visuals**: gold radial-gradient for yang (乾/heads), dark-purple gradient for yin (坤/tails); square hole detail; staggered flip animation via `--i` CSS custom prop
- **Result label**: shows 少阳/少阴/老阳/老阴 with changing lines highlighted in red
- **(i) tooltip**: clicking info button reveals a bilingual popup explaining the coin combination for each line type (e.g., 少阳=7: 1正+2反, stable yang; 老阴=6: 三枚全反, transforms to yang)

**Files:** `CoinToss.tsx`, `CoinToss.css`, `DivinationScreen.tsx`, `DivinationScreen.css`

---

## Implementation Order

1. **CR 4** ✅ Language switcher (foundation for all bilingual text)
2. **CR 2** ✅ Start screen instructions
3. **CR 3** ✅ 变爻 explanation (info tooltip in result screen)
4. **CR 6** ✅ Coin clarity + line-type (i) tooltip in divination screen
5. **CR 1 + CR 5** ✅ Data sourcing + enriched hexagram fields (sourced from classical texts)

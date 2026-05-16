# Hexagram Line Divination — Data Completion Plan

Each hexagram needs 6 lines × 6 fields (tuijuan, yunshi, aiqing, jibing, shiwu, susong) × bilingual.
~4 hexagrams per session stays within daily token limits.

Prompt to resume any session:
> "Continue hexagram data, next batch"

---

## Progress

### ✅ Done — already in codebase
- Hexagrams **1–4** (`hexagramLineDivination_1_16.ts`)
- Hexagrams **33–42** (`hexagramLineDivination_33_42.ts`)
- Hexagrams **43–48** (`hexagramLineDivination_43_54.ts`)
- Hexagrams **55–59** (`hexagramLineDivination_55_64.ts`)

---

### ✅ Session 1 — Hexagrams 5–8
- [x] 5. 需 (Xū) — Waiting
- [x] 6. 讼 (Sòng) — Conflict
- [x] 7. 师 (Shī) — The Army
- [x] 8. 比 (Bǐ) — Holding Together
- **File:** `hexagramLineDivination_1_16.ts`

### ✅ Session 2 — Hexagrams 9–12
- [x] 9. 小畜 (Xiǎo Chù) — Small Taming
- [x] 10. 履 (Lǚ) — Treading
- [x] 11. 泰 (Tài) — Peace
- [x] 12. 否 (Pǐ) — Standstill
- **File:** `hexagramLineDivination_1_16.ts`

### Session 3 — Hexagrams 13–16
- [ ] 13. 同人 (Tóng Rén) — Fellowship
- [ ] 14. 大有 (Dà Yǒu) — Great Possession
- [ ] 15. 谦 (Qiān) — Modesty
- [ ] 16. 豫 (Yù) — Enthusiasm
- **File:** `hexagramLineDivination_1_16.ts`

### Session 4 — Hexagrams 17–20
- [ ] 17. 随 (Suí) — Following
- [ ] 18. 蛊 (Gǔ) — Work on the Decayed
- [ ] 19. 临 (Lín) — Approach
- [ ] 20. 观 (Guān) — Contemplation
- **File:** new `hexagramLineDivination_17_32.ts`

### Session 5 — Hexagrams 21–24
- [ ] 21. 噬嗑 (Shì Kè) — Biting Through
- [ ] 22. 贲 (Bì) — Grace
- [ ] 23. 剥 (Bō) — Splitting Apart
- [ ] 24. 复 (Fù) — Return
- **File:** `hexagramLineDivination_17_32.ts`

### Session 6 — Hexagrams 25–28
- [ ] 25. 无妄 (Wú Wàng) — Innocence
- [ ] 26. 大畜 (Dà Chù) — Great Taming
- [ ] 27. 颐 (Yí) — Nourishment
- [ ] 28. 大过 (Dà Guò) — Great Excess
- **File:** `hexagramLineDivination_17_32.ts`

### Session 7 — Hexagrams 29–32
- [ ] 29. 坎 (Kǎn) — The Abysmal Water
- [ ] 30. 离 (Lí) — The Clinging Fire
- [ ] 31. 咸 (Xián) — Influence
- [ ] 32. 恒 (Héng) — Duration
- **File:** `hexagramLineDivination_17_32.ts`

### Session 8 — Hexagrams 49–52
- [ ] 49. 革 (Gé) — Revolution
- [ ] 50. 鼎 (Dǐng) — The Cauldron
- [ ] 51. 震 (Zhèn) — The Arousing Thunder
- [ ] 52. 艮 (Gèn) — Keeping Still
- **File:** `hexagramLineDivination_43_54.ts`

### Session 9 — Hexagrams 53–54 + 60–62
- [ ] 53. 渐 (Jiàn) — Development
- [ ] 54. 归妹 (Guī Mèi) — The Marrying Maiden
- [ ] 60. 节 (Jié) — Limitation
- [ ] 61. 中孚 (Zhōng Fú) — Inner Truth
- [ ] 62. 小过 (Xiǎo Guò) — Small Excess
- **File:** `hexagramLineDivination_43_54.ts` (53–54), `hexagramLineDivination_55_64.ts` (60–62)

### Session 10 — Hexagrams 63–64
- [ ] 63. 既济 (Jì Jì) — After Completion
- [ ] 64. 未济 (Wèi Jì) — Before Completion
- **File:** `hexagramLineDivination_55_64.ts`

---

## After all sessions: wire up 17–32
When Session 7 is done, add to `hexagramLineDivination.ts`:
```ts
import { hexagramLineDivination_17_32 } from './hexagramLineDivination_17_32';
// add ...hexagramLineDivination_17_32 to the spread
```

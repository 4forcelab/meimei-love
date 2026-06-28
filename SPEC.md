# SPEC.md｜鍋美美食豔室・前台網頁 repo 憲法

> 這份是部署 repo（`web/`，GitHub: 4forcelab/meimei-love，線上 love.4force.com.tw）的憲法。
> 任何 agent 進 web/ 動手前**先讀這份**，再讀程式碼。
> 它的存在是為了：不論是 Codex、Claude Code 還是任何模型來寫，答案都收斂到同一套規則，不各自腦補。

---

## 0. 這個 repo 是什麼，不是什麼

**是**：鍋美美食豔室的**對客前台網頁**。線上 love.4force.com.tw 的實際內容。

**不是**：
- 不是內部數據工作區（業績清洗在上一層 `../clean` `../scripts`，不在這）。
- 不是 4force lab 的官網或顧問品牌頁。
- 不是菜單真值的源頭（真值在上游，見下方第 2 節）。

---

## 1. 語氣與視覺：繼承鍋美美人設

這個 repo 的所有文案、視覺、語氣，繼承**鍋美美人設**：

> 鍋美美是一個 20 幾歲的女生。有點迷糊，但是煮火鍋很認真。

- 語氣：口語、軟、可愛、適度的鏘（「差 0.1 是你喔」「湯跟料分開不然真的會爛掉」）。
- 視覺：奶油暖色系為主調，圓體（Zen Maru Gothic），melt-bg 暈染、sugar 星星特效，淡 Tiffany 作涼色點綴穿梭。
- **禁止混入 4force 的顧問語氣、整合行銷術語、AI 戰略話術。** 鍋美美前台不講「機器可讀性工程」「品牌入口資產」這種母公司操盤語言。那是 4force 的事，不是鍋美美對客人說的話。

母公司署名只出現在 footer（「品牌母公司：萬合天宜・4force lab」）與 F12 彩蛋，不滲入主文案。

---

## 2. 唯一真值：data/menu-master.json

菜單的唯一真值是 `data/menu-master.json`。HTML 是它的**下游投影**。

- 品名一律用 json 的 `display_name`。
- **嚴禁使用 `ichef_name`**（那是 iCHEF 後台 / 供應商命名，是內部索引，外洩過一次「川武凍豆腐」「全廣香雞排」這種供應商代號，嚴禁再出現在前台）。
- `available: false` 的品項不渲染。
- 這個 repo **不得自行新增、刪除、改名品項**。要改菜單，回上游改 `../menu-master.json`（產地端），再同步覆蓋到 `data/menu-master.json`，菜單規則見上一層 `../MEIMEI_SPEC.md`。

---

## 3. 鐵則（不可違反）

1. **零價格**：前台任何頁面不出現價格。價格只活在各店點餐平台。（區域定價策略不外露。）
2. **零內部術語**：供應商代號、批次標記、POS 內部簡寫，一律不上前台。
3. **葷素標記只標素（素 🌱），葷留白**：依 json 的 `dietary.vegetarian`，**不程式臆測**五辛或蛋。標錯葷素會出客訴，這是硬承諾。
4. **承諾 vs 精神分層**：品項卡只標「素 🌱」（承諾＝無肉）；鍋邊素／含蛋／鍋具不分離／不做認證等誠實揭露，放 footer 的素食主張段，不擺在成交動線中央。
5. **不寫「全台統一」**：品牌本身就統一，特別強調等於自曝其短。
6. **不留版本副本**：用 git rollback，不手動存 `_old` `_v2` `交付版`。

---

## 4. 技術錨點

- 部署鏈：本 repo (4forcelab/meimei-love) → Vercel → love.4force.com.tw
- GA：`G-9BXZX8ENMZ`（全站共用）
- 菜單頁 JSON-LD：`@type: Menu`，`@id` = `https://love.4force.com.tw/menu/#menu`，回扣 index 的 `hasMenu`。素項標 `suitableForDiet: VegetarianDiet`，**無 price 欄位**。
- canonical 每頁指自己。
- 視覺特效（melt-bg / sugar）定義在 `css/style.css`，新頁面繼承既有 class，不另造主題系統。

---

## 5. agent 行為準則

- 動手前讀本檔 + 相關程式碼，不憑記憶或假設。
- 被質疑輸出時，**回查程式碼 / json 真值，不要即興編解釋**。流暢的答案不等於正確的答案。
- 不確定屬不屬於這個 repo 的職責 → 停下來問人類，不跨層亂改。
- 改完 push 後，回報 commit id + Vercel deployment 狀態，附 live 掃描（價格 0 / 內部術語 0 / ichef_name 0）。

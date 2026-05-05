# 鍋美美食豔室 官網

## 部署
GitHub + Vercel，push 即自動部署。

## 換圖說明

把去背 PNG 放到 `images/` 資料夾：

| 檔名 | 位置 | 建議尺寸 | 說明 |
|------|------|---------|------|
| `hero-pot.png` | Hero 右側大圖 | 800×800px | 抱鍋歡呼姿勢 |
| `order-look.png` | 點餐區上方 | 400×400px | 俯視食物微笑 |
| `story-hug.png` | 品牌故事右側 | 600×600px | 任選一張 |
| `franchise-serious.png` | 加盟區 | 400×400px | 筷子等餐認真臉 |

所有圖請先用 remove.bg 或 Canva 去背，存成透明 PNG。

## 換連結說明

在 `index.html` 裡搜尋以下文字替換：

- `FOODPANDA_URL_屏東` → 屏東店 foodpanda 連結
- `UBER_URL_屏東` → 屏東店 Uber Eats 連結
- `GOOGLE_MAP_URL_屏東` → 屏東店 Google 地圖連結
- `FOODPANDA_URL_內埔` → 內埔店開幕後填入
- `UBER_URL_內埔` → 內埔店開幕後填入
- `GOOGLE_MAP_URL_內埔` → 內埔店開幕後填入

## 更新資料

開幕後更新的文字（直接在 index.html 搜尋修改）：

- 評分：`4.9 分`
- 好評數：`193 則好評`
- 內埔店地址：`即將開幕` 改成真實地址

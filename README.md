# Sakura Forecast

日本全国 1,483 箇所の桜開花状況をリアルタイムで確認できるモバイルファーストの Web アプリ。

## Features

- **地図** — 全国の桜スポットを開花状態別にマップ表示（react-leaflet）
- **検索 & フィルター** — 地名検索、開花状態（つぼみ〜青葉）でフィルタリング
- **スポット詳細** — 開花状態、見頃時期、タグ、Google Maps リンク
- **お気に入り** — localStorage でブックマーク管理
- **探索** — 地域別・状態別のリスト表示

## Data Source

データは [sakura-mankai-tracker](https://github.com/Jada-Q/sakura-mankai-tracker) の自動パイプラインから取得：

| Tier | Source | Count |
|------|--------|-------|
| A | 気象庁 (JMA) 公式観測 | 58 |
| B | Walker+ 実測データ | 880 |
| C | 最寄り JMA 観測点からの推定 | 545 |

GitHub Actions で毎日 18:00 JST に自動更新。

## Tech Stack

- Next.js 16 + React 19
- Tailwind CSS
- react-leaflet + Leaflet (CartoDB tiles)
- TypeScript

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## License

MIT

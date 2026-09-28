# Golf Counter

ゴルフのラウンド中に、1人分の打数とPUTT数を記録できるWebアプリです。

スマートフォンでの使用を想定し、少ない操作でスコアを記録できるように設計しています。

## 主な機能

- 9Hole／18Holeの選択
- コース名の登録
- HoleごとのPAR設定
- 打数・PUTT数の記録
- PARに対するスコアの自動計算
- 終了済みHoleの一覧表示
- 合計打数・SCORE・PUTTの自動集計
- 終了済みHoleの編集
- 最終結果の表示
- ラウンド中データの自動保存・復元

## 使用技術

- HTML
- CSS
- JavaScript
- localStorage
- Git

フレームワークやサーバー、データベースは使用していません。

## ファイル構成

```text
golf-counter/
├── index.html
├── style.css
├── script.js
├── SPEC.md
└── README.md
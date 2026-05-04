## 2026-05-04 — Discord セッション

- 入力タブの「▲ クラウドに送信」ボタンに転送中スピナーと n/n 進捗表示を追加
  - `#inline-send-btn`（id追加）・`#inline-send-spinner`・`#inline-send-status` を追加
  - `sendAll()` でインラインスピナーも制御するよう修正
  - データ管理タブのスピナーと同等のフィードバックを入力タブでも提供

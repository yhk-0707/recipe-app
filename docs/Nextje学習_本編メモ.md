# Next.js学習にあたって - 本編メモ

## 01 Next.jsとは — Reactに何が足されるのか
- Next.jsはフルスタックフレームワーク
- Next.jsが変えるのは「書き方」ではなく「動く場所と動くタイミング

## 02 セットアップ — Next.js導入コマンド
- TypeScript : 型のあるReactコード  
→スペルミスやデータの型間違いを、コードを書いている最中に赤波線で教えてくれる必須ツール。

- Tailwind CSS : クラス名で書く爆速デザイン  
→`className="flex p-4 bg-blue-500"` のように、あらかじめ用意された名前（クラス）をタグに貼るだけで、CSSファイルを作らずに爆速でデザインが当たる。

- Biome : 超高速なコード掃除機  
→従来のESLintやPrettierの代わり。  
Rustという言語で作られており、コードのバグチェック（Lint）と自動整形（Format）を一瞬（ミリ秒単位）で終わらせる最新鋭のツール。

- App Router : Next.jsの最新フォルダ構造  
→フォルダの配置がそのままWebサイトのURL（ルート）になり、サーバーコンポーネントを標準で使えるNext.jsの現代的なルーティングシステム。

- Turbopack : 次世代の高速コンパイラ  
→Next.js専用に開発された、コードの変更を画面に一瞬で反映させるためのエンジン。  
以前の仕組み（Webpack）より圧倒的に速い。

- import alias @/* : フォルダのショートカット  
→`../../components/Button` のような、ややこしい相対パスを禁止し、常に `@/components/Button`（`@`＝プロジェクトのルートフォルダ）という綺麗なパスでファイルを読み込める設定。

- Bun : 爆速のJavaScript実行環境  
→npmやyarnの代わり。パッケージのインストールやスクリプトの実行が、これまでのツールの数倍〜十数倍速い。

---

- 後工程でbun使うので、セットアップしちゃう  
→「環境1　事前準備 — bun / Docker が入っているか確認する」の手順でやったらちょっと失敗した。

```bash
# -------------------------------------------------------------
# 【注意】失敗した流れと原因
# -------------------------------------------------------------
# 1. 最初に Linux用の curl コマンドでインストールを試みた
curl -fsSL [https://bun.sh/install](https://bun.sh/install) | bash

# 2. 反映させようとしたが、ファイルがなくてエラー
source ~/.bashrc
# ❌ エラー: bash: /c/Users/xxxx/.bashrc: No such file or directory

# 3. 次に Windows用の PowerShell コマンドでインストールを試みた
powershell -c "irm bun.sh/install.ps1 | iex"

# 4. 実行してみたが、まだ動かない
bun --version
# ❌ エラー: bash: bun: command not found
# 💡 原因: インストール自体は成功していても、Git Bashにパス（居場所）を
#          教えてあげていないため、この段階ではまだ失敗（Not Found）になる。

# -------------------------------------------------------------
# 【解決策】正しい手順（.bashrcを新規作成してパスを通す）
# -------------------------------------------------------------

# 1. .bashrc ファイルを新規作成しつつ、Bunのパス（居場所）を書き込む
echo 'export BUN_INSTALL="$HOME/.bun"' >> ~/.bashrc
echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> ~/.bashrc

# 2. 作成した設定ファイルを現在のターミナルに即時反映
source ~/.bashrc   # ※もしMacなどでzshを使っている場合は ~/.zshrc

# 3. 疎通確認（ここでようやく認識されて成功！）
bun --version
# 出力例: 1.3.14
```

- 一回npxでもやったけど、bunxは圧倒的に早かった。

```
? Would you like to use the recommended Next.js defaults? » - Use arrow-keys. Return to submit.
>   Yes, use recommended defaults - TypeScript, ESLint, No React Compiler, Tailwind CSS, No src/ directory, App Router, AGENTS.md
    No, customize settings
```
→ デフォルトだと、
- TypeScript：OK
- ESLint：★Biomeがいい
- No React Compiler：OK
- Tailwind CSS：OK
- No src/ directory：OK
- App Router：OK
- AGENTS.md：OK  
なのでNoでカスタマイズセッティング  
→完了！

## 03 ファイルベースルーティング — フォルダ構成がURLになる


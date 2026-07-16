import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  HTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  TextareaHTMLAttributes,
} from "react";

type WrapperProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
};

type FieldProps = {
  children: ReactNode;
  htmlFor: string;
  hint?: string;
  label: string;
};

type ButtonVariant = "primary" | "secondary" | "danger";

// 画面ごとの共通レイアウトをまとめるための入れ物。
// 各ページで幅や余白をバラバラに書かず、ここで揃える。
export function PageShell({
  children,
  className = "",
  ...props
}: WrapperProps) {
  return (
    <main
      className={`mx-auto flex w-full max-w-[760px] flex-1 flex-col gap-4 ${className}`}
      {...props}
    >
      {children}
    </main>
  );
}

// 白いカード見た目を共通化する。
// 一覧、詳細、フォームで同じ見た目を使い回す想定。
export function Card({ children, className = "", ...props }: WrapperProps) {
  return (
    <section
      className={`rounded-xl bg-white p-4 shadow-[0_4px_10px_rgba(0,0,0,0.06)] ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}

// ページの主見出し。
// 画面ごとに同じ見た目を使うならコンポーネント化した方が読みやすい。
export function PageTitle({
  children,
  className = "",
  ...props
}: WrapperProps) {
  return (
    <h1
      className={`m-0 text-[1.6rem] font-bold text-foreground ${className}`}
      {...props}
    >
      {children}
    </h1>
  );
}

// セクション見出し用。
// 詳細画面の「材料」「手順」みたいな見出しを揃える。
export function SectionTitle({
  children,
  className = "",
  ...props
}: WrapperProps) {
  return (
    <h2
      className={`m-0 text-[1.1rem] font-semibold text-foreground ${className}`}
      {...props}
    >
      {children}
    </h2>
  );
}

// 補足説明の薄いテキスト。
// 検索キーワードや説明文に使う。
export function MutedText({
  children,
  className = "",
  ...props
}: WrapperProps) {
  return (
    <p className={`text-sm text-muted ${className}`} {...props}>
      {children}
    </p>
  );
}

// フォームの入力エラーを共通表示する。
// 登録画面と編集画面で同じ見た目・同じアクセシビリティ属性を使う。
export function ErrorText({
  children,
  className = "",
  ...props
}: WrapperProps) {
  return (
    <p
      className={`text-sm font-medium text-[#c23934] ${className}`}
      role="alert"
      {...props}
    >
      {children}
    </p>
  );
}

// ラベル + 入力欄 + 補足文を1セットにする。
// フォームはこれを使うと構造がかなり見やすくなる。
export function Field({ children, htmlFor, hint, label }: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="block text-sm text-muted">
        {label}
      </label>
      {children}
      {hint ? <p className="text-sm text-muted">{hint}</p> : null}
    </div>
  );
}

// 入力欄の共通見た目。
// text / url / textarea で同じ土台を使う。
const controlBase =
  "w-full rounded-[8px] border border-border bg-white px-[12px] py-[10px] text-foreground outline-none transition placeholder:text-[#9aa3ad] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function TextInput({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${controlBase} ${className}`} {...props} />;
}

export function TextArea({
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${controlBase} ${className}`} {...props} />;
}

// ボタンの共通土台。
// primary / secondary / danger だけ差分を変える。
const buttonBase =
  "inline-flex min-h-[38px] items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-60";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "border-0 bg-accent text-accent-foreground hover:brightness-95 focus-visible:ring-ring",
  secondary:
    "border-0 bg-[#eef2f7] text-[#304152] hover:brightness-95 focus-visible:ring-ring",
  danger:
    "border-0 bg-[#d9534f] text-white hover:brightness-95 focus-visible:ring-ring",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
}) {
  return (
    <button
      className={`${buttonBase} ${buttonVariants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  children,
  className = "",
  variant = "secondary",
  href,
  ...props
}: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  variant?: ButtonVariant;
}) {
  // next/link を見た目込みで包む。
  // 画面遷移用のリンクを、ボタンと同じ見た目で使いたい時に便利。
  return (
    <Link
      className={`${buttonBase} ${buttonVariants[variant]} ${className}`}
      href={href}
      {...props}
    >
      {children}
    </Link>
  );
}

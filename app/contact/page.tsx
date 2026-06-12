import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "計算ツール集へのお問い合わせページです。",
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="mb-6 text-3xl font-bold">お問い合わせ</h1>

      <div className="rounded-xl border border-gray-200 bg-white p-5 text-sm leading-7 text-gray-700 shadow">
        <p>
          当サイトへのお問い合わせは、以下のメールアドレスまでお願いいたします。
        </p>

        <p className="mt-4 font-bold text-gray-900">
          メールアドレス準備中
        </p>

        <p className="mt-4">
          内容によっては返信までお時間をいただく場合があります。
        </p>
      </div>
    </main>
  );
}
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "計算ツール集のプライバシーポリシーです。",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="mb-6 text-3xl font-bold">プライバシーポリシー</h1>

      <div className="space-y-6 text-sm leading-7 text-gray-700">
        <section>
          <h2 className="mb-2 text-xl font-bold text-gray-900">個人情報の取り扱いについて</h2>
          <p>
            当サイトでは、お問い合わせ時に入力いただいた情報を、お問い合わせへの回答のために利用します。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-bold text-gray-900">広告について</h2>
          <p>
            当サイトでは、第三者配信の広告サービスを利用する場合があります。
            広告配信事業者は、ユーザーの興味に応じた広告を表示するためにCookieを使用することがあります。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-bold text-gray-900">アクセス解析について</h2>
          <p>
            当サイトでは、サイトの利用状況を把握するためにアクセス解析ツールを利用する場合があります。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-bold text-gray-900">免責事項</h2>
          <p>
            当サイトの計算結果は概算です。正確性には注意していますが、結果の利用によって生じた損害等について責任を負いかねます。
          </p>
        </section>
      </div>
    </main>
  );
}
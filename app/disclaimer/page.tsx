import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "免責事項",
  description: "計算ツール集の免責事項です。",
};

export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="mb-6 text-3xl font-bold">免責事項</h1>

      <div className="space-y-6 text-sm leading-7 text-gray-700">
        <section>
          <h2 className="mb-2 text-xl font-bold text-gray-900">計算結果について</h2>
          <p>
            当サイトで表示される計算結果は、入力内容に基づく概算です。
            正確性には注意していますが、計算結果の完全性や正確性を保証するものではありません。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-bold text-gray-900">利用上の注意</h2>
          <p>
            給与、税金、社会保険料、各種制度などは、勤務先や地域、法改正、個別の条件によって異なります。
            正確な情報が必要な場合は、勤務先、自治体、税理士、社会保険労務士などの専門家へご確認ください。
          </p>
        </section>

        <section>
          <h2 className="mb-2 text-xl font-bold text-gray-900">損害等の責任について</h2>
          <p>
            当サイトの情報や計算結果を利用したことによって生じた損害、トラブル、不利益等について、
            当サイトでは責任を負いかねます。
          </p>
        </section>
      </div>
    </main>
  );
}
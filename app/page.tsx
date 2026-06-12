import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "計算ツール集 | 無料で使える計算サイト",
  description:
    "時給計算、年収計算、残業代計算など仕事や生活に役立つ計算ツールを無料で利用できます。",
};

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl p-4">
      <section className="mb-8 rounded-xl bg-blue-50 p-6">
        <h1 className="mb-3 text-3xl font-bold">計算ツール集</h1>
        <p className="text-gray-700">
          仕事や生活に役立つ計算ツールを無料で利用できます。
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">利用できるツール</h2>
        <div className="grid gap-4">
          <Link
            href="/hourly-to-monthly"
            className="block rounded-xl border border-gray-200 bg-white p-5 shadow transition hover:bg-gray-50"
          >
            <h3 className="text-xl font-bold">時給→月給計算機</h3>
            <p className="mt-2 text-sm text-gray-600">
              時給・勤務時間・勤務日数・交通費・残業時間から月収と年収を計算できます。
            </p>
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="mb-4 text-2xl font-bold">今後追加予定</h2>
        <ul className="list-disc pl-6 text-gray-700">
          <li>手取り計算ツール</li>
          <li>消費税計算ツール</li>
          <li>フリーランス報酬計算ツール</li>
        </ul>
      </section>
    </main>
  );
}
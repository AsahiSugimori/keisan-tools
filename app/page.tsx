import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ヨサンメモ",
  description:
    "手取り、時給、扶養内勤務、生活費など仕事や暮らしのお金をサクッと確認できる計算ツールサイトです。",
};

export default function Home() {
  return (
    <main className="mx-auto max-w-5xl p-4">
      <section className="mb-8 rounded-2xl bg-blue-50 p-6">
        <p className="mb-2 text-sm font-bold text-blue-700">
          仕事と暮らしのお金をサクッと確認
        </p>
        <h1 className="mb-3 text-4xl font-bold">ヨサンメモ</h1>
        <p className="max-w-2xl leading-7 text-gray-700">
          手取り、時給、扶養内勤務、生活費などの計算をかんたんに確認できるサイトです。
          面倒なお金の計算を、サクッと見える化できます。
        </p>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">利用できるツール</h2>

        <div className="grid gap-6">
          <section>
            <h3 className="mb-3 text-lg font-bold">給与・働き方</h3>

            <div className="grid gap-3 md:grid-cols-2">
              <Link
                href="/take-home-pay"
                className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:bg-gray-50"
              >
                <div className="font-bold">額面→手取り計算機</div>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  月給から社会保険料・税金を差し引いた手取り額を概算できます。
                </p>
              </Link>

              <Link
                href="/hourly-to-monthly"
                className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:bg-gray-50"
              >
                <div className="font-bold">時給→月給計算機</div>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  時給・勤務時間・勤務日数から月収と年収を計算できます。
                </p>
              </Link>

              <Link
                href="/dependent-work-limit"
                className="block rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:bg-gray-50"
              >
                <div className="font-bold">扶養内勤務シミュレーター</div>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  時給・交通費・週の勤務日数から、扶養範囲内で働ける時間を逆算できます。
                </p>
              </Link>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-lg font-bold">フリーランス向け</h3>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                <div className="font-bold text-gray-500">
                  フリーランス報酬計算機
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  報酬額から源泉徴収や手取り額を計算できるツールを追加予定です。
                </p>
              </div>

              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                <div className="font-bold text-gray-500">源泉徴収計算機</div>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  請求額や源泉徴収後の入金額を確認できるツールを追加予定です。
                </p>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 text-lg font-bold">生活費・買い物</h3>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                <div className="font-bold text-gray-500">消費税計算機</div>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  税込・税抜価格をかんたんに計算できるツールを追加予定です。
                </p>
              </div>

              <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-4">
                <div className="font-bold text-gray-500">月の出費計算機</div>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  家賃・食費・固定費などから月の支出を整理できるツールを追加予定です。
                </p>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
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

      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">よく使う計算ツール</h2>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/take-home-pay"
            className="block rounded-xl border border-blue-100 bg-white p-4 shadow-sm transition hover:bg-blue-50"
          >
            <div className="mb-2 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
              会社員向け
            </div>
            <div className="font-bold">額面→手取り計算機</div>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              月給から社会保険料・税金を差し引いた手取り額を概算できます。
            </p>
          </Link>


          <Link
            href="/bonus-take-home-pay"
            className="block rounded-xl border border-blue-100 bg-white p-4 shadow-sm transition hover:bg-blue-50"
          >
            <div className="mb-2 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
              会社員向け
            </div>
            <div className="font-bold">賞与→手取り計算機</div>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              ボーナスから社会保険料・所得税を差し引いた手取り額を概算できます。
            </p>
          </Link>

          <Link
            href="/hourly-to-monthly"
            className="block rounded-xl border border-blue-100 bg-white p-4 shadow-sm transition hover:bg-blue-50"
          >
            <div className="mb-2 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
              アルバイト向け
            </div>
            <div className="font-bold">時給→月給計算機</div>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              時給・勤務時間・勤務日数から月収と年収を計算できます。
            </p>
          </Link>

          <Link
            href="/dependent-work-limit"
            className="block rounded-xl border border-blue-100 bg-white p-4 shadow-sm transition hover:bg-blue-50"
          >
            <div className="mb-2 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
              パート向け
            </div>
            <div className="font-bold">扶養内勤務シミュレーター</div>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              扶養範囲内で働ける月の時間や1日あたりの時間を逆算できます。
            </p>
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-bold">カテゴリから探す</h2>

        <div className="grid gap-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold">給与・働き方</h3>
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                公開中
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Link
                href="/take-home-pay"
                className="block rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:bg-blue-50"
              >
                <div className="font-bold">額面→手取り計算機</div>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  月給から手取り額を概算できます。
                </p>
              </Link>


              <Link
                href="/bonus-take-home-pay"
                className="block rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:bg-blue-50"
              >
                <div className="font-bold">賞与→手取り計算機</div>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  賞与額面から手取り額を概算できます。
                </p>
              </Link>

              <Link
                href="/hourly-to-monthly"
                className="block rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:bg-blue-50"
              >
                <div className="font-bold">時給→月給計算機</div>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  時給から月収・年収を計算できます。
                </p>
              </Link>

              <Link
                href="/dependent-work-limit"
                className="block rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:bg-blue-50"
              >
                <div className="font-bold">扶養内勤務シミュレーター</div>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  扶養内で働ける時間を逆算できます。
                </p>
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold">フリーランス向け</h3>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-bold text-gray-500">
                追加予定
              </span>
            </div>

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

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold">生活費・買い物</h3>
              <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-bold text-gray-500">
                追加予定
              </span>
            </div>

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

      <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-xl font-bold">ヨサンメモについて</h2>
        <div className="space-y-3 text-sm leading-7 text-gray-700">
          <p>
            ヨサンメモは、仕事や暮らしのお金に関する計算を手軽に確認できる計算ツールサイトです。
          </p>
          <p>
            手取り、時給、扶養内勤務など、日常で気になる金額をなるべくシンプルに確認できるようにしています。
          </p>
          <p>
            計算結果は目安です。税金、社会保険、扶養の判定などは条件によって変わるため、正確な判断が必要な場合は勤務先や専門窓口に確認してください。
          </p>
        </div>
      </section>
    </main>
  );
}
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "ヨサンメモ",
  description:
    "手取り、賞与、時給、扶養内勤務、源泉徴収、生活費など仕事や暮らしのお金をサクッと確認できる計算ツールサイトです。",
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
          手取り、賞与、時給、扶養内勤務、源泉徴収、生活費などをかんたんに確認できる計算ツール集です。
          <br />
          毎月のお金や働き方に関する目安を、なるべくシンプルに見える化できます。
        </p>
      </section>

      <section className="mb-8">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">よく使う計算ツール</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            給与・賞与・税金・生活費など、使う場面が多い計算ツールをまとめています。
          </p>
        </div>

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
              月給の額面から、社会保険料や税金を差し引いた手取り額を概算できます。
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
              ボーナスの額面から、社会保険料・所得税を引いた手取り額を概算できます。
            </p>
          </Link>

          <Link
            href="/withholding-tax"
            className="block rounded-xl border border-blue-100 bg-white p-4 shadow-sm transition hover:bg-blue-50"
          >
            <div className="mb-2 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
              フリーランス向け
            </div>
            <div className="font-bold">源泉徴収計算機</div>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              報酬額から源泉徴収税額と、差し引き後の入金額を概算できます。
            </p>
          </Link>

          <Link
            href="/monthly-expense"
            className="block rounded-xl border border-blue-100 bg-white p-4 shadow-sm transition hover:bg-blue-50"
          >
            <div className="mb-2 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-bold text-blue-700">
              生活費・買い物
            </div>
            <div className="font-bold">月の出費計算機</div>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              月の収入と支出を入力して、今月残りそうなお金を概算できます。
            </p>
          </Link>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-bold">カテゴリから探す</h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            給与、フリーランス、生活費など、知りたい内容に合わせて計算ツールを選べます。
          </p>
        </div>

        <div className="grid gap-6">
          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">給与・働き方</h3>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  給与、賞与、時給、扶養内勤務などの目安を確認できます。
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
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
                  月給の額面から手取り額を概算できます。
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
                  時給、勤務時間、勤務日数から月収・年収を計算できます。
                </p>
              </Link>

              <Link
                href="/dependent-work-limit"
                className="block rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:bg-blue-50"
              >
                <div className="font-bold">扶養内勤務シミュレーター</div>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  扶養内で働ける時間や、月に働ける目安を逆算できます。
                </p>
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">フリーランス向け</h3>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  報酬、経費、源泉徴収など、個人で働く人向けの計算ツールです。
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                公開中
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Link
                href="/freelance-income"
                className="block rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:bg-blue-50"
              >
                <div className="font-bold">フリーランス報酬計算機</div>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  売上と経費から月の利益・年間利益を概算できます。
                </p>
              </Link>

              <Link
                href="/withholding-tax"
                className="block rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:bg-blue-50"
              >
                <div className="font-bold">源泉徴収計算機</div>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  報酬額から源泉徴収税額と差引入金額を概算できます。
                </p>
              </Link>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold">生活費・買い物</h3>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                  日々の買い物、消費税、毎月の出費などを確認できます。
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-green-100 px-2 py-1 text-xs font-bold text-green-700">
                公開中
              </span>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <Link
                href="/consumption-tax"
                className="block rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:bg-blue-50"
              >
                <div className="font-bold">消費税計算機</div>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  税込・税抜価格と消費税額をかんたんに計算できます。
                </p>
              </Link>

              <Link
                href="/monthly-expense"
                className="block rounded-xl border border-gray-200 bg-gray-50 p-4 transition hover:bg-blue-50"
              >
                <div className="font-bold">月の出費計算機</div>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  月の収入と支出から、今月残りそうなお金を概算できます。
                </p>
              </Link>
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
            給与の手取り、賞与の手取り、時給からの月収、扶養内で働ける時間、源泉徴収、生活費など、日常で気になる金額をなるべくシンプルに確認できるようにしています。
          </p>
          <p>
            家計簿や税務ソフトのように細かく管理する前に、「ざっくりどのくらいになるか」を確認したい場面で使いやすいサイトを目指しています。
          </p>
          <p>
            計算結果は目安です。税金、社会保険、扶養の判定、源泉徴収の扱いなどは条件によって変わるため、正確な判断が必要な場合は勤務先や専門窓口に確認してください。
          </p>
        </div>
      </section>
    </main>
  );
}
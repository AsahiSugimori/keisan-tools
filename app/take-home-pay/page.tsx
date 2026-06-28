import type { Metadata } from "next";
import BackLink from "../../components/BackLink";
import RelatedTools from "../../components/RelatedTools";
import TakeHomePayCalculator from "../../components/TakeHomePayCalculator";

export const metadata: Metadata = {
  title: "ヨサンメモ（額面→手取り計算機）",
  description:
    "月給から社会保険料、所得税、住民税を差し引いた手取り額を概算できます。",
};

export default function Page() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-4">
        <BackLink />
      </div>

      <TakeHomePayCalculator />

      <RelatedTools
        tools={[
          {
            href: "/bonus-take-home-pay",
            title: "賞与→手取り計算機",
            description: "ボーナス額面から、おおよその手取り額を確認できます。",
          },
          {
            href: "/monthly-expense",
            title: "月の出費計算機",
            description: "月の収入と支出から、今月残りそうなお金を概算できます。",
          },
          {
            href: "/hourly-to-monthly",
            title: "時給→月給計算機",
            description: "時給、勤務時間、勤務日数から月収や年収を計算できます。",
          },
          {
            href: "/dependent-work-limit",
            title: "扶養内勤務シミュレーター",
            description: "扶養内で働ける時間や、月の勤務時間の目安を逆算できます。",
          },
        ]}
      />
    </>
  );
}
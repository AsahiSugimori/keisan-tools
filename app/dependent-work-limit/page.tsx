import type { Metadata } from "next";
import BackLink from "../../components/BackLink";
import RelatedTools from "../../components/RelatedTools";
import DependentWorkLimitCalculator from "../../components/DependentWorkLimitCalculator";

export const metadata: Metadata = {
  title: "ヨサンメモ（扶養内勤務シミュレーター）",
  description:
    "時給、交通費、週の勤務日数から、扶養範囲内で働くための月の勤務時間や1日あたりの勤務時間を逆算できます。",
};

export default function Page() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-4">
        <BackLink />
      </div>

      <DependentWorkLimitCalculator />

      <RelatedTools
        tools={[
          {
            href: "/hourly-to-monthly",
            title: "時給→月給計算機",
            description: "時給、勤務時間、勤務日数から月収や年収を計算できます。",
          },
          {
            href: "/take-home-pay",
            title: "額面→手取り計算機",
            description: "月給の額面から、おおよその手取り額を確認できます。",
          },
          {
            href: "/monthly-expense",
            title: "月の出費計算機",
            description: "月の収入と支出から、今月残りそうなお金を概算できます。",
          },
          {
            href: "/bonus-take-home-pay",
            title: "賞与→手取り計算機",
            description: "ボーナス額面から、おおよその手取り額を確認できます。",
          },
        ]}
      />
    </>
  );
}
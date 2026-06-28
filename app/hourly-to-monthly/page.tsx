import type { Metadata } from "next";
import BackLink from "../../components/BackLink";
import RelatedTools from "../../components/RelatedTools";
import HourlyToMonthlyCalculator from "../../components/HourlyToMonthlyCalculator";

export const metadata: Metadata = {
  title: "ヨサンメモ（時給→月給計算機）",
  description:
    "時給、1日の労働時間、月の勤務日数、交通費、残業時間から月収・年収を無料で計算できます。",
};

export default function Page() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-4">
        <BackLink />
      </div>

      <HourlyToMonthlyCalculator />

      <RelatedTools
        tools={[
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
            href: "/dependent-work-limit",
            title: "扶養内勤務シミュレーター",
            description: "扶養内で働ける時間や、月の勤務時間の目安を逆算できます。",
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
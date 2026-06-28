import type { Metadata } from "next";
import BackLink from "../../components/BackLink";
import RelatedTools from "../../components/RelatedTools";
import MonthlyExpenseCalculator from "../../components/MonthlyExpenseCalculator";

export const metadata: Metadata = {
  title: "ヨサンメモ（月の出費計算機）",
  description:
    "月の収入、固定費、変動費、カード支払いから支出合計と残るお金を概算できます。",
};

export default function Page() {
  return (
    <>
      <div className="mx-auto max-w-4xl px-4 pt-4">
        <BackLink />
      </div>

      <MonthlyExpenseCalculator />

      <RelatedTools
        tools={[
          {
            href: "/take-home-pay",
            title: "額面→手取り計算機",
            description: "月給の額面から、おおよその手取り額を確認できます。",
          },
          {
            href: "/bonus-take-home-pay",
            title: "賞与→手取り計算機",
            description: "ボーナスの額面から、おおよその手取り額を確認できます。",
          },
          {
            href: "/hourly-to-monthly",
            title: "時給→月給計算機",
            description: "時給、勤務時間、勤務日数から月収や年収を計算できます。",
          },
          {
            href: "/consumption-tax",
            title: "消費税計算機",
            description: "税込・税抜価格と消費税額をかんたんに計算できます。",
          },
        ]}
      />
    </>
  );
}
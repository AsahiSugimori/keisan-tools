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
            description: "月の手取り額を概算できます。",
          },
          {
            href: "/bonus-take-home-pay",
            title: "賞与→手取り計算機",
            description: "ボーナスの手取り額を概算できます。",
          },
        ]}
      />
    </>
  );
}

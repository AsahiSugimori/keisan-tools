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
            description: "ボーナス額面から手取り額を概算できます。",
          },
          {
            href: "/monthly-expense",
            title: "月の出費計算機",
            description: "毎月の支出と残るお金を整理できます。",
          },
        ]}
      />
    </>
  );
}
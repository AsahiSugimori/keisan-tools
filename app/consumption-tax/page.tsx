import type { Metadata } from "next";
import BackLink from "../../components/BackLink";
import RelatedTools from "../../components/RelatedTools";
import ConsumptionTaxCalculator from "../../components/ConsumptionTaxCalculator";

export const metadata: Metadata = {
  title: "ヨサンメモ（消費税計算機）",
  description:
    "税込価格、税抜価格、消費税額をかんたんに計算できます。10%・8%・任意の税率に対応しています。",
};

export default function Page() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-4">
        <BackLink />
      </div>
      <ConsumptionTaxCalculator />
      <RelatedTools
        tools={[
          {
            href: "/withholding-tax",
            title: "源泉徴収計算機",
            description: "報酬額から源泉徴収税額と差引入金額を概算できます。",
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

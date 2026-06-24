import type { Metadata } from "next";
import BackLink from "../../components/BackLink";
import RelatedTools from "../../components/RelatedTools";
import WithholdingTaxCalculator from "../../components/WithholdingTaxCalculator";

export const metadata: Metadata = {
  title: "ヨサンメモ（源泉徴収計算機）",
  description:
    "報酬額から源泉徴収税額、消費税、差引入金額を概算できます。",
};

export default function Page() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-4">
        <BackLink />
      </div>
      <WithholdingTaxCalculator />
      <RelatedTools
        tools={[
          {
            href: "/freelance-income",
            title: "フリーランス報酬計算機",
            description: "売上と経費から月の利益・年間利益を概算できます。",
          },
          {
            href: "/consumption-tax",
            title: "消費税計算機",
            description: "税込・税抜価格と消費税額を計算できます。",
          },
        ]}
      />
    </>
  );
}

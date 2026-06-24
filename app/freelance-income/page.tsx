import type { Metadata } from "next";
import BackLink from "../../components/BackLink";
import RelatedTools from "../../components/RelatedTools";
import FreelanceIncomeCalculator from "../../components/FreelanceIncomeCalculator";

export const metadata: Metadata = {
  title: "ヨサンメモ（フリーランス報酬計算機）",
  description:
    "月の売上と経費から、フリーランスや副業の利益目安、年間利益、必要な売上を計算できます。",
};

export default function Page() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-4">
        <BackLink />
      </div>
      <FreelanceIncomeCalculator />
      <RelatedTools
        tools={[
          {
            href: "/withholding-tax",
            title: "源泉徴収計算機",
            description: "報酬額から源泉徴収税額と差引入金額を概算できます。",
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

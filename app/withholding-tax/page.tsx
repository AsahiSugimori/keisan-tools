import type { Metadata } from "next";
import BackLink from "../../components/BackLink";
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
    </>
  );
}

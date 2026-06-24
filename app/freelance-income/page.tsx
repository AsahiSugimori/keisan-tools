import type { Metadata } from "next";
import BackLink from "../../components/BackLink";
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
    </>
  );
}

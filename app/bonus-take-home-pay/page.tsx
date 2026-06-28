import type { Metadata } from "next";
import BackLink from "../../components/BackLink";
import RelatedTools from "../../components/RelatedTools";
import BonusTakeHomePayCalculator from "../../components/BonusTakeHomePayCalculator";

export const metadata: Metadata = {
  title: "ヨサンメモ（賞与→手取り計算機）",
  description:
    "賞与額面から社会保険料、所得税を差し引いた賞与の手取り額を概算できます。",
};

export default function Page() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-4">
        <BackLink />
      </div>

      <BonusTakeHomePayCalculator />

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
            href: "/withholding-tax",
            title: "源泉徴収計算機",
            description: "報酬額から源泉徴収税額と差し引き後の入金額を概算できます。",
          },
          {
            href: "/hourly-to-monthly",
            title: "時給→月給計算機",
            description: "時給、勤務時間、勤務日数から月収や年収を計算できます。",
          },
        ]}
      />
    </>
  );
}
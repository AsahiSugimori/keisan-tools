import type { Metadata } from "next";
import BackLink from "../../components/BackLink";
import DependentWorkLimitCalculator from "../../components/DependentWorkLimitCalculator";

export const metadata: Metadata = {
  title: "ヨサンメモ（扶養内勤務シミュレーター）",
  description:
    "時給、交通費、週の勤務日数から、扶養範囲内で働くための月の勤務時間や1日あたりの勤務時間を逆算できます。",
};

export default function Page() {
  return (
    <>
      <div className="mx-auto max-w-3xl px-4 pt-4">
        <BackLink />
      </div>
      <DependentWorkLimitCalculator />
    </>
  );
}
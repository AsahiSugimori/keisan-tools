import type { Metadata } from "next";
import BackLink from "../../components/BackLink";
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
    </>
  );
}
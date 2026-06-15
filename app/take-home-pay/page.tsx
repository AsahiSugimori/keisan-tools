import type { Metadata } from "next";
import TakeHomePayCalculator
  from "../../components/TakeHomePayCalculator";

export const metadata: Metadata = {
  title: "サクミル（額面→手取り計算機）",
  description:
    "月給から社会保険料、所得税、住民税を差し引いた手取り額を概算できます。",
};

export default function Page() {
  return <TakeHomePayCalculator />;
}
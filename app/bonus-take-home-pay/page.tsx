import type { Metadata } from "next";
import BonusTakeHomePayCalculator from "../../components/BonusTakeHomePayCalculator";

export const metadata: Metadata = {
  title: "ヨサンメモ（賞与→手取り計算機）",
  description:
    "賞与額面から社会保険料、所得税を差し引いた賞与の手取り額を概算できます。",
};

export default function Page() {
  return <BonusTakeHomePayCalculator />;
}

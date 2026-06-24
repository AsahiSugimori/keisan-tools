import type { Metadata } from "next";
import BackLink from "../../components/BackLink";
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
    </>
  );
}

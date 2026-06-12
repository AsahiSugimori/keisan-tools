import type { Metadata } from "next";
import HourlyToMonthlyCalculator
  from "../../components/HourlyToMonthlyCalculator";

export const metadata: Metadata = {
  title: "時給→月給計算機 | 月収・年収を無料計算",
  description:
    "時給、1日の労働時間、月の勤務日数、交通費、残業時間から月収・年収を無料で計算できます。",
};

export default function Page() {
  return <HourlyToMonthlyCalculator />;
}
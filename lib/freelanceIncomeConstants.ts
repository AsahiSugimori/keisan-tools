/**
 * フリーランス報酬計算機の初期値・上限値・固定値
 */

/** 初期値(月の売上・税抜) */
export const defaultMonthlySales = 300000;

/** 初期値(月の経費) */
export const defaultMonthlyExpenses = 50000;

/** 初期値(目標月利益) */
export const defaultTargetMonthlyProfit = 250000;

/** 初期値(消費税を考慮するか) */
export const defaultIncludeConsumptionTax = true;

/** 上限値(月の売上・税抜) */
export const maxMonthlySales = 100000000;

/** 上限値(月の経費) */
export const maxMonthlyExpenses = 100000000;

/** 上限値(目標月利益) */
export const maxTargetMonthlyProfit = 100000000;

/** 金額の最小値 */
export const minMoneyValue = 0;

/** 1年の月数 */
export const monthsPerYear = 12;

/** 消費税率 */
export const consumptionTaxRate = 0.1;

/** localStorageキー(月の売上・税抜) */
export const monthlySalesStorageKey = "freelanceIncomeMonthlySales";

/** localStorageキー(月の経費) */
export const monthlyExpensesStorageKey = "freelanceIncomeMonthlyExpenses";

/** localStorageキー(目標月利益) */
export const targetMonthlyProfitStorageKey = "freelanceIncomeTargetMonthlyProfit";

/** localStorageキー(消費税を考慮するか) */
export const includeConsumptionTaxStorageKey = "freelanceIncomeIncludeConsumptionTax";

/**
 * 源泉徴収計算機の初期値・上限値・固定値
 */

/**
 * 消費税率タイプ
 */
export type ConsumptionTaxRateType = "rate10" | "rate8" | "rate0";

/**
 * 源泉徴収対象額の扱い
 */
export type WithholdingTargetMode = "taxExcluded" | "taxIncluded";

/**
 * 消費税率の選択肢
 */
export const consumptionTaxRateOptions: {
  type: ConsumptionTaxRateType;
  label: string;
  rate: number;
}[] = [
  {
    type: "rate10",
    label: "10%",
    rate: 0.1,
  },
  {
    type: "rate8",
    label: "8%",
    rate: 0.08,
  },
  {
    type: "rate0",
    label: "0%",
    rate: 0,
  },
];

/**
 * 源泉徴収対象額の扱い表示名
 */
export const withholdingTargetModeLabels: Record<WithholdingTargetMode, string> = {
  taxExcluded: "税抜の報酬額を対象にする",
  taxIncluded: "税込の請求額を対象にする",
};

/**
 * 初期値(報酬額・税抜)
 */
export const defaultRewardAmount = 100000;

/**
 * 上限値(報酬額・税抜)
 */
export const maxRewardAmount = 100000000;

/**
 * 初期値(消費税率)
 */
export const defaultConsumptionTaxRateType: ConsumptionTaxRateType = "rate10";

/**
 * 初期値(源泉徴収対象額の扱い)
 */
export const defaultWithholdingTargetMode: WithholdingTargetMode = "taxExcluded";

/**
 * 金額の最小値
 */
export const minMoneyValue = 0;

/**
 * 源泉徴収の境界額
 */
export const withholdingBorderAmount = 1000000;

/**
 * 100万円以下部分の源泉徴収率
 */
export const standardWithholdingTaxRate = 0.1021;

/**
 * 100万円超部分の源泉徴収率
 */
export const excessWithholdingTaxRate = 0.2042;

/**
 * localStorageキー(報酬額・税抜)
 */
export const rewardAmountStorageKey = "withholdingTaxRewardAmount";

/**
 * localStorageキー(消費税率)
 */
export const consumptionTaxRateTypeStorageKey = "withholdingTaxConsumptionTaxRateType";

/**
 * localStorageキー(源泉徴収対象額の扱い)
 */
export const withholdingTargetModeStorageKey = "withholdingTaxTargetMode";

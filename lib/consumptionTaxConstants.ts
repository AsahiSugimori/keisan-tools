/**
 * 消費税計算機の初期値・上限値・固定値
 */

/**
 * 計算方法
 */
export type ConsumptionTaxCalculationMode =
  | "taxExcludedToIncluded"
  | "taxIncludedToExcluded";

/**
 * 税率タイプ
 */
export type ConsumptionTaxRateType = "standard10" | "reduced8" | "custom";

/**
 * 計算方法表示名
 */
export const consumptionTaxCalculationModeLabels: Record<
  ConsumptionTaxCalculationMode,
  string
> = {
  taxExcludedToIncluded: "税抜 → 税込",
  taxIncludedToExcluded: "税込 → 税抜",
};

/**
 * 税率タイプ表示名
 */
export const consumptionTaxRateTypeLabels: Record<
  ConsumptionTaxRateType,
  string
> = {
  standard10: "標準税率 10%",
  reduced8: "軽減税率 8%",
  custom: "任意の税率",
};

/**
 * 初期値(金額)
 */
export const defaultConsumptionTaxAmount = 1000;

/**
 * 上限値(金額)
 */
export const maxConsumptionTaxAmount = 1000000000;

/**
 * 初期値(計算方法)
 */
export const defaultConsumptionTaxCalculationMode: ConsumptionTaxCalculationMode =
  "taxExcludedToIncluded";

/**
 * 初期値(税率タイプ)
 */
export const defaultConsumptionTaxRateType: ConsumptionTaxRateType =
  "standard10";

/**
 * 初期値(任意の税率%)
 */
export const defaultCustomConsumptionTaxRatePercent = 10;

/**
 * 上限値(任意の税率%)
 */
export const maxCustomConsumptionTaxRatePercent = 100;

/**
 * 標準税率
 */
export const standardConsumptionTaxRatePercent = 10;

/**
 * 軽減税率
 */
export const reducedConsumptionTaxRatePercent = 8;

/**
 * 金額の最小値
 */
export const minConsumptionTaxValue = 0;

/**
 * パーセント変換用の除数
 */
export const consumptionTaxPercentRateDivisor = 100;

/**
 * localStorageキー(金額)
 */
export const consumptionTaxAmountStorageKey = "consumptionTaxAmount";

/**
 * localStorageキー(計算方法)
 */
export const consumptionTaxCalculationModeStorageKey =
  "consumptionTaxCalculationMode";

/**
 * localStorageキー(税率タイプ)
 */
export const consumptionTaxRateTypeStorageKey = "consumptionTaxRateType";

/**
 * localStorageキー(任意の税率)
 */
export const customConsumptionTaxRateStorageKey =
  "customConsumptionTaxRate";

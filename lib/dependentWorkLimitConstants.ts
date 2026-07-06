/**
 * 扶養内勤務シミュレーターの年収上限タイプ
 */
export type AnnualLimitType =
  | "limit103"
  | "limit106"
  | "limit123"
  | "limit130"
  | "limit150"
  | "limit160"
  | "custom";

/**
 * 年収上限の選択肢
 */
export type AnnualLimitOption = {
  type: AnnualLimitType;
  label: string;
  amount: number;
};

/**
 * 初期値(時給)
 */
export const defaultHourlyWage = 1200;

/**
 * 上限値(時給)
 */
export const maxHourlyWage = 100000;

/**
 * 初期値(月の交通費)
 */
export const defaultTransportationCost = 0;

/**
 * 上限値(月の交通費)
 */
export const maxTransportationCost = 100000;

/**
 * 初期値(週の勤務日数)
 */
export const defaultWorkingDaysPerWeek = 3;

/**
 * 上限値(週の勤務日数)
 */
export const maxWorkingDaysPerWeek = 7;

/**
 * 初期値(任意の年収上限)
 */
export const defaultCustomAnnualLimit = 1300000;

/**
 * 上限値(任意の年収上限)
 */
export const maxCustomAnnualLimit = 10000000;

/**
 * 初期値(年収上限タイプ)
 */
export const defaultAnnualLimitType: AnnualLimitType = "limit130";

/**
 * 初期値(交通費を年収上限に含めるか)
 */
export const defaultIncludeTransportationCost = true;

/**
 * 1年の月数
 */
export const monthsPerYear = 12;

/**
 * 1年の週数
 */
export const weeksPerYear = 52;

/**
 * 1か月の平均週数
 */
export const averageWeeksPerMonth = weeksPerYear / monthsPerYear;

/**
 * 金額・時間の最小値
 */
export const minValue = 0;

/**
 * 年収上限の選択肢
 */
export const annualLimitOptions: AnnualLimitOption[] = [
  {
    type: "limit103",
    label: "103万円（以前から使われる扶養目安）",
    amount: 1030000,
  },
  {
    type: "limit106",
    label: "106万円（社会保険加入の旧目安）",
    amount: 1060000,
  },
  {
    type: "limit123",
    label: "123万円（税制改正後の扶養目安）",
    amount: 1230000,
  },
  {
    type: "limit130",
    label: "130万円（社会保険の扶養目安）",
    amount: 1300000,
  },
  {
    type: "limit150",
    label: "150万円（配偶者特別控除などの目安）",
    amount: 1500000,
  },
  {
    type: "limit160",
    label: "160万円（所得税がかかり始める目安）",
    amount: 1600000,
  },
  {
    type: "custom",
    label: "任意入力",
    amount: defaultCustomAnnualLimit,
  },
];

/**
 * localStorageキー(時給)
 */
export const hourlyWageStorageKey = "dependentWorkLimitHourlyWage";

/**
 * localStorageキー(月の交通費)
 */
export const transportationCostStorageKey =
  "dependentWorkLimitTransportationCost";

/**
 * localStorageキー(週の勤務日数)
 */
export const workingDaysPerWeekStorageKey =
  "dependentWorkLimitWorkingDaysPerWeek";

/**
 * localStorageキー(年収上限タイプ)
 */
export const annualLimitTypeStorageKey = "dependentWorkLimitAnnualLimitType";

/**
 * localStorageキー(任意の年収上限)
 */
export const customAnnualLimitStorageKey = "dependentWorkLimitCustomAnnualLimit";

/**
 * localStorageキー(交通費を年収上限に含めるか)
 */
export const includeTransportationCostStorageKey =
  "dependentWorkLimitIncludeTransportationCost";
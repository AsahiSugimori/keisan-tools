/**
 * 年齢区分
 */
export type AgeGroup = "under40" | "over40";

/**
 * 健康保険の種類
 */
export type HealthInsuranceType = "kyoukaikenpo" | "itsKenpo" | "custom";

/**
 * 社会保険料の計算方法
 */
export type SocialInsuranceCalculationMode =
  | "grossMonthlySalary"
  | "standardMonthlyRemuneration";

/**
 * 関東の都道府県
 */
export type Prefecture =
  | "ibaraki"
  | "tochigi"
  | "gunma"
  | "saitama"
  | "chiba"
  | "tokyo"
  | "kanagawa";

/**
 * 給与所得控除の計算区分
 */
export type SalaryIncomeDeductionBracket = {
  maxYearlyGrossSalary: number;
  rate: number;
  deduction: number;
};

/**
 * 所得税の計算区分
 */
export type IncomeTaxBracket = {
  maxTaxableIncome: number;
  rate: number;
  deduction: number;
};

/**
 * 都道府県表示名
 */
export const prefectureLabels: Record<Prefecture, string> = {
  ibaraki: "茨城県",
  tochigi: "栃木県",
  gunma: "群馬県",
  saitama: "埼玉県",
  chiba: "千葉県",
  tokyo: "東京都",
  kanagawa: "神奈川県",
};

/**
 * 健康保険の種類表示名
 */
export const healthInsuranceTypeLabels: Record<HealthInsuranceType, string> = {
  kyoukaikenpo: "協会けんぽ",
  itsKenpo: "関東ITソフトウェア健康保険組合",
  custom: "その他の健康保険組合",
};

/**
 * 社会保険料の計算方法表示名
 */
export const socialInsuranceCalculationModeLabels: Record<
  SocialInsuranceCalculationMode,
  string
> = {
  grossMonthlySalary: "額面月給から概算",
  standardMonthlyRemuneration: "標準報酬月額を直接入力",
};

/**
 * 初期値(額面月給)
 */
export const defaultGrossMonthlySalary = 300000;

/**
 * 上限値(額面月給)
 */
export const maxGrossMonthlySalary = 10000000;

/**
 * 初期値(標準報酬月額)
 */
export const defaultStandardMonthlyRemuneration = 300000;

/**
 * 上限値(標準報酬月額)
 */
export const maxStandardMonthlyRemuneration = 2000000;

/**
 * 初期値(健康保険本人負担率%)
 */
export const defaultCustomHealthInsuranceRatePercent = 4.75;

/**
 * 初期値(介護保険本人負担率%)
 */
export const defaultCustomCareInsuranceRatePercent = 0.9;

/**
 * 上限値(健康保険本人負担率%)
 */
export const maxCustomHealthInsuranceRatePercent = 20;

/**
 * 上限値(介護保険本人負担率%)
 */
export const maxCustomCareInsuranceRatePercent = 10;

/**
 * 初期値(都道府県)
 */
export const defaultPrefecture: Prefecture = "saitama";

/**
 * 初期値(健康保険の種類)
 */
export const defaultHealthInsuranceType: HealthInsuranceType = "kyoukaikenpo";

/**
 * 初期値(社会保険料の計算方法)
 */
export const defaultSocialInsuranceCalculationMode: SocialInsuranceCalculationMode =
  "grossMonthlySalary";

/**
 * 初期値(年齢区分)
 */
export const defaultAgeGroup: AgeGroup = "under40";

/**
 * 初期値(住民税を引くか)
 */
export const defaultIncludeResidentTax = true;

/**
 * 1年の月数
 */
export const monthsPerYear = 12;

/**
 * 金額の最小値
 */
export const minMoneyValue = 0;

/**
 * パーセント変換用の除数
 */
export const percentRateDivisor = 100;

/**
 * 課税所得の丸め単位
 */
export const taxableIncomeRoundingUnit = 1000;

/**
 * 令和7年度 協会けんぽの健康保険料率
 *
 * 会社負担と本人負担を合わせた全体料率。
 * 本人負担分は計算時に2分の1として扱う。
 */
export const kyoukaiKenpoHealthInsuranceRates: Record<Prefecture, number> = {
  ibaraki: 0.0967,
  tochigi: 0.0982,
  gunma: 0.0977,
  saitama: 0.0976,
  chiba: 0.0979,
  tokyo: 0.0991,
  kanagawa: 0.0992,
};

/**
 * 協会けんぽの介護保険料率
 *
 * 会社負担と本人負担を合わせた全体料率。
 * 本人負担分は計算時に2分の1として扱う。
 */
export const kyoukaiKenpoCareInsuranceRate = 0.0159;

/**
 * 関東ITソフトウェア健康保険組合の健康保険本人負担率
 */
export const itsKenpoEmployeeHealthInsuranceRate = 0.0475;

/**
 * 関東ITソフトウェア健康保険組合の介護保険本人負担率
 */
export const itsKenpoEmployeeCareInsuranceRate = 0.009;

/**
 * 厚生年金の本人負担率
 */
export const welfarePensionEmployeeRate = 0.0915;

/**
 * 雇用保険の本人負担率
 */
export const employmentInsuranceEmployeeRate = 0.0055;

/**
 * 所得税の基礎控除額
 */
export const incomeTaxBasicDeduction = 580000;

/**
 * 住民税の基礎控除額
 */
export const residentTaxBasicDeduction = 430000;

/**
 * 住民税の所得割
 */
export const residentTaxIncomeRate = 0.1;

/**
 * 住民税の均等割・森林環境税の概算
 */
export const residentTaxFlatAmount = 5000;

/**
 * 復興特別所得税率
 */
export const specialIncomeTaxRate = 1.021;

/**
 * 給与所得控除の区分
 */
export const salaryIncomeDeductionBrackets: SalaryIncomeDeductionBracket[] = [
  {
    maxYearlyGrossSalary: 1625000,
    rate: 0,
    deduction: 650000,
  },
  {
    maxYearlyGrossSalary: 1800000,
    rate: 0.4,
    deduction: -100000,
  },
  {
    maxYearlyGrossSalary: 3600000,
    rate: 0.3,
    deduction: 80000,
  },
  {
    maxYearlyGrossSalary: 6600000,
    rate: 0.2,
    deduction: 440000,
  },
  {
    maxYearlyGrossSalary: 8500000,
    rate: 0.1,
    deduction: 1100000,
  },
  {
    maxYearlyGrossSalary: Number.POSITIVE_INFINITY,
    rate: 0,
    deduction: 1950000,
  },
];

/**
 * 所得税の速算表
 */
export const incomeTaxBrackets: IncomeTaxBracket[] = [
  {
    maxTaxableIncome: 1949000,
    rate: 0.05,
    deduction: 0,
  },
  {
    maxTaxableIncome: 3299000,
    rate: 0.1,
    deduction: 97500,
  },
  {
    maxTaxableIncome: 6949000,
    rate: 0.2,
    deduction: 427500,
  },
  {
    maxTaxableIncome: 8999000,
    rate: 0.23,
    deduction: 636000,
  },
  {
    maxTaxableIncome: 17999000,
    rate: 0.33,
    deduction: 1536000,
  },
  {
    maxTaxableIncome: 39999000,
    rate: 0.4,
    deduction: 2796000,
  },
  {
    maxTaxableIncome: Number.POSITIVE_INFINITY,
    rate: 0.45,
    deduction: 4796000,
  },
];

/**
 * localStorageキー(額面月給)
 */
export const grossMonthlySalaryStorageKey = "takeHomeGrossMonthlySalary";

/**
 * localStorageキー(標準報酬月額)
 */
export const standardMonthlyRemunerationStorageKey =
  "takeHomeStandardMonthlyRemuneration";

/**
 * localStorageキー(都道府県)
 */
export const prefectureStorageKey = "takeHomePrefecture";

/**
 * localStorageキー(健康保険の種類)
 */
export const healthInsuranceTypeStorageKey = "takeHomeHealthInsuranceType";

/**
 * localStorageキー(社会保険料の計算方法)
 */
export const socialInsuranceCalculationModeStorageKey =
  "takeHomeSocialInsuranceCalculationMode";

/**
 * localStorageキー(健康保険本人負担率)
 */
export const customHealthInsuranceRateStorageKey =
  "takeHomeCustomHealthInsuranceRate";

/**
 * localStorageキー(介護保険本人負担率)
 */
export const customCareInsuranceRateStorageKey =
  "takeHomeCustomCareInsuranceRate";

/**
 * localStorageキー(年齢区分)
 */
export const ageGroupStorageKey = "takeHomeAgeGroup";

/**
 * localStorageキー(住民税を引くか)
 */
export const includeResidentTaxStorageKey = "takeHomeIncludeResidentTax";
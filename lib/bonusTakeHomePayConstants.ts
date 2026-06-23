/**
 * 賞与→手取り計算機の初期値・上限値・固定値
 */

/** 源泉徴収税率表の1行 */
export type BonusWithholdingTaxRateRow = {
  rate: number;
  ranges: { min: number; max: number | null }[];
};

/** 初期値(賞与額面) */
export const defaultGrossBonus = 300000;

/** 上限値(賞与額面) */
export const maxGrossBonus = 10000000;

/** 初期値(前月給与・社会保険料等控除後) */
export const defaultPreviousMonthlySalaryAfterSocialInsurance = 250000;

/** 上限値(前月給与・社会保険料等控除後) */
export const maxPreviousMonthlySalaryAfterSocialInsurance = 5000000;

/** 初期値(扶養親族等の数) */
export const defaultDependentCount = 0;

/** 扶養親族等の数の最大値 */
export const maxDependentCount = 7;

/** 金額の最小値 */
export const minBonusMoneyValue = 0;

/** 標準賞与額の丸め単位 */
export const standardBonusRoundingUnit = 1000;

/** 健康保険の標準賞与額上限(年度累計の簡易上限) */
export const healthInsuranceStandardBonusLimit = 5730000;

/** 厚生年金の標準賞与額上限(1か月あたり) */
export const welfarePensionStandardBonusLimit = 1500000;

/** localStorageキー(賞与額面) */
export const grossBonusStorageKey = "bonusTakeHomeGrossBonus";

/** localStorageキー(前月給与・社会保険料等控除後) */
export const previousMonthlySalaryAfterSocialInsuranceStorageKey =
  "bonusTakeHomePreviousMonthlySalaryAfterSocialInsurance";

/** localStorageキー(扶養親族等の数) */
export const dependentCountStorageKey = "bonusTakeHomeDependentCount";

/** localStorageキー(都道府県) */
export const bonusPrefectureStorageKey = "bonusTakeHomePrefecture";

/** localStorageキー(健康保険の種類) */
export const bonusHealthInsuranceTypeStorageKey = "bonusTakeHomeHealthInsuranceType";

/** localStorageキー(年齢区分) */
export const bonusAgeGroupStorageKey = "bonusTakeHomeAgeGroup";

/** localStorageキー(健康保険本人負担率) */
export const bonusCustomHealthInsuranceRateStorageKey =
  "bonusTakeHomeCustomHealthInsuranceRate";

/** localStorageキー(介護保険本人負担率) */
export const bonusCustomCareInsuranceRateStorageKey =
  "bonusTakeHomeCustomCareInsuranceRate";

/**
 * 令和7年分 賞与に対する源泉徴収税額の算出率の表(甲欄)
 * ranges は扶養親族等の数 0〜7人以上 の順。
 */
export const bonusWithholdingTaxRateRows: BonusWithholdingTaxRateRow[] = [
  { rate: 0, ranges: [{ min: 0, max: 68000 }, { min: 0, max: 94000 }, { min: 0, max: 133000 }, { min: 0, max: 171000 }, { min: 0, max: 210000 }, { min: 0, max: 243000 }, { min: 0, max: 275000 }, { min: 0, max: 308000 }] },
  { rate: 0.02042, ranges: [{ min: 68000, max: 79000 }, { min: 94000, max: 243000 }, { min: 133000, max: 269000 }, { min: 171000, max: 295000 }, { min: 210000, max: 300000 }, { min: 243000, max: 300000 }, { min: 275000, max: 333000 }, { min: 308000, max: 372000 }] },
  { rate: 0.04084, ranges: [{ min: 79000, max: 252000 }, { min: 243000, max: 282000 }, { min: 269000, max: 312000 }, { min: 295000, max: 345000 }, { min: 300000, max: 378000 }, { min: 300000, max: 406000 }, { min: 333000, max: 431000 }, { min: 372000, max: 456000 }] },
  { rate: 0.06126, ranges: [{ min: 252000, max: 300000 }, { min: 282000, max: 338000 }, { min: 312000, max: 369000 }, { min: 345000, max: 398000 }, { min: 378000, max: 424000 }, { min: 406000, max: 450000 }, { min: 431000, max: 476000 }, { min: 456000, max: 502000 }] },
  { rate: 0.08168, ranges: [{ min: 300000, max: 334000 }, { min: 338000, max: 365000 }, { min: 369000, max: 393000 }, { min: 398000, max: 417000 }, { min: 424000, max: 444000 }, { min: 450000, max: 472000 }, { min: 476000, max: 499000 }, { min: 502000, max: 523000 }] },
  { rate: 0.1021, ranges: [{ min: 334000, max: 363000 }, { min: 365000, max: 394000 }, { min: 393000, max: 420000 }, { min: 417000, max: 445000 }, { min: 444000, max: 470000 }, { min: 472000, max: 496000 }, { min: 499000, max: 521000 }, { min: 523000, max: 545000 }] },
  { rate: 0.12252, ranges: [{ min: 363000, max: 395000 }, { min: 394000, max: 422000 }, { min: 420000, max: 450000 }, { min: 445000, max: 477000 }, { min: 470000, max: 503000 }, { min: 496000, max: 525000 }, { min: 521000, max: 547000 }, { min: 545000, max: 571000 }] },
  { rate: 0.14294, ranges: [{ min: 395000, max: 426000 }, { min: 422000, max: 455000 }, { min: 450000, max: 484000 }, { min: 477000, max: 510000 }, { min: 503000, max: 534000 }, { min: 525000, max: 557000 }, { min: 547000, max: 582000 }, { min: 571000, max: 607000 }] },
  { rate: 0.16336, ranges: [{ min: 426000, max: 520000 }, { min: 455000, max: 520000 }, { min: 484000, max: 520000 }, { min: 510000, max: 544000 }, { min: 534000, max: 570000 }, { min: 557000, max: 597000 }, { min: 582000, max: 623000 }, { min: 607000, max: 650000 }] },
  { rate: 0.18378, ranges: [{ min: 520000, max: 601000 }, { min: 520000, max: 617000 }, { min: 520000, max: 632000 }, { min: 544000, max: 647000 }, { min: 570000, max: 662000 }, { min: 597000, max: 677000 }, { min: 623000, max: 693000 }, { min: 650000, max: 708000 }] },
  { rate: 0.2042, ranges: [{ min: 601000, max: 678000 }, { min: 617000, max: 699000 }, { min: 632000, max: 721000 }, { min: 647000, max: 745000 }, { min: 662000, max: 768000 }, { min: 677000, max: 792000 }, { min: 693000, max: 815000 }, { min: 708000, max: 838000 }] },
  { rate: 0.22462, ranges: [{ min: 678000, max: 708000 }, { min: 699000, max: 733000 }, { min: 721000, max: 757000 }, { min: 745000, max: 782000 }, { min: 768000, max: 806000 }, { min: 792000, max: 831000 }, { min: 815000, max: 856000 }, { min: 838000, max: 880000 }] },
  { rate: 0.24504, ranges: [{ min: 708000, max: 745000 }, { min: 733000, max: 771000 }, { min: 757000, max: 797000 }, { min: 782000, max: 823000 }, { min: 806000, max: 849000 }, { min: 831000, max: 875000 }, { min: 856000, max: 900000 }, { min: 880000, max: 926000 }] },
  { rate: 0.26546, ranges: [{ min: 745000, max: 788000 }, { min: 771000, max: 814000 }, { min: 797000, max: 841000 }, { min: 823000, max: 868000 }, { min: 849000, max: 896000 }, { min: 875000, max: 923000 }, { min: 900000, max: 950000 }, { min: 926000, max: 978000 }] },
  { rate: 0.28588, ranges: [{ min: 788000, max: 846000 }, { min: 814000, max: 874000 }, { min: 841000, max: 902000 }, { min: 868000, max: 931000 }, { min: 896000, max: 959000 }, { min: 923000, max: 987000 }, { min: 950000, max: 1015000 }, { min: 978000, max: 1043000 }] },
  { rate: 0.3063, ranges: [{ min: 846000, max: 914000 }, { min: 874000, max: 944000 }, { min: 902000, max: 975000 }, { min: 931000, max: 1005000 }, { min: 959000, max: 1036000 }, { min: 987000, max: 1066000 }, { min: 1015000, max: 1096000 }, { min: 1043000, max: 1127000 }] },
  { rate: 0.32672, ranges: [{ min: 914000, max: 1312000 }, { min: 944000, max: 1336000 }, { min: 975000, max: 1360000 }, { min: 1005000, max: 1385000 }, { min: 1036000, max: 1409000 }, { min: 1066000, max: 1434000 }, { min: 1096000, max: 1458000 }, { min: 1127000, max: 1482000 }] },
  { rate: 0.35735, ranges: [{ min: 1312000, max: 1521000 }, { min: 1336000, max: 1526000 }, { min: 1360000, max: 1526000 }, { min: 1385000, max: 1538000 }, { min: 1409000, max: 1555000 }, { min: 1434000, max: 1555000 }, { min: 1458000, max: 1555000 }, { min: 1482000, max: 1583000 }] },
  { rate: 0.38798, ranges: [{ min: 1521000, max: 2621000 }, { min: 1526000, max: 2645000 }, { min: 1526000, max: 2669000 }, { min: 1538000, max: 2693000 }, { min: 1555000, max: 2716000 }, { min: 1555000, max: 2740000 }, { min: 1555000, max: 2764000 }, { min: 1583000, max: 2788000 }] },
  { rate: 0.41861, ranges: [{ min: 2621000, max: 3495000 }, { min: 2645000, max: 3527000 }, { min: 2669000, max: 3559000 }, { min: 2693000, max: 3590000 }, { min: 2716000, max: 3622000 }, { min: 2740000, max: 3654000 }, { min: 2764000, max: 3685000 }, { min: 2788000, max: 3717000 }] },
  { rate: 0.45945, ranges: [{ min: 3495000, max: null }, { min: 3527000, max: null }, { min: 3559000, max: null }, { min: 3590000, max: null }, { min: 3622000, max: null }, { min: 3654000, max: null }, { min: 3685000, max: null }, { min: 3717000, max: null }] },
];

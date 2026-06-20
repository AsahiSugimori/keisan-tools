"use client";

import { useEffect, useRef, useState } from "react";
import {
  type AgeGroup,
  type HealthInsuranceType,
  type Prefecture,
  type SocialInsuranceCalculationMode,
  ageGroupStorageKey,
  customCareInsuranceRateStorageKey,
  customHealthInsuranceRateStorageKey,
  defaultAgeGroup,
  defaultCustomCareInsuranceRatePercent,
  defaultCustomHealthInsuranceRatePercent,
  defaultEstimatedAnnualBonus,
  defaultGrossMonthlySalary,
  defaultHealthInsuranceType,
  defaultIncludeResidentTax,
  defaultPrefecture,
  defaultSocialInsuranceCalculationMode,
  defaultStandardMonthlyRemuneration,
  employmentInsuranceEmployeeRate,
  estimatedAnnualBonusStorageKey,
  grossMonthlySalaryStorageKey,
  healthInsuranceTypeLabels,
  healthInsuranceTypeStorageKey,
  incomeTaxBasicDeduction,
  incomeTaxBrackets,
  includeResidentTaxStorageKey,
  itsKenpoEmployeeCareInsuranceRate,
  itsKenpoEmployeeHealthInsuranceRate,
  kyoukaiKenpoCareInsuranceRate,
  kyoukaiKenpoHealthInsuranceRates,
  maxCustomCareInsuranceRatePercent,
  maxCustomHealthInsuranceRatePercent,
  maxEstimatedAnnualBonus,
  maxGrossMonthlySalary,
  maxStandardMonthlyRemuneration,
  minMoneyValue,
  monthsPerYear,
  percentRateDivisor,
  prefectureLabels,
  prefectureStorageKey,
  residentTaxBasicDeduction,
  residentTaxFlatAmount,
  residentTaxIncomeRate,
  salaryIncomeDeductionBrackets,
  socialInsuranceCalculationModeLabels,
  socialInsuranceCalculationModeStorageKey,
  specialIncomeTaxRate,
  standardMonthlyRemunerationStorageKey,
  taxableIncomeRoundingUnit,
  welfarePensionEmployeeRate,
} from "../lib/takeHomePayConstants";
import NumberInput from "./NumberInput";

/**
 * 概算手取り計算結果
 */
type TakeHomePayResult = {
  healthInsurance: number;
  careInsurance: number;
  welfarePension: number;
  employmentInsurance: number;
  incomeTax: number;
  residentTax: number;
  totalDeduction: number;
  monthlyTakeHomePay: number;
  yearlyGrossSalary: number;
  yearlyTakeHomePay: number;
};

/**
 * 金額を0円以上の整数に丸める
 *
 * @param value 金額
 * @returns 0円以上の整数
 */
function floorMoney(value: number): number {
  return Math.max(minMoneyValue, Math.floor(value));
}

/**
 * パーセント文字列を小数の料率に変換する
 *
 * @param valueText パーセント文字列
 * @returns 小数の料率
 */
function parsePercentRate(valueText: string): number {
  return Math.max(minMoneyValue, Number(valueText) || minMoneyValue) / percentRateDivisor;
}

/**
 * 給与所得控除額を計算する
 *
 * @param yearlyGrossSalary 額面年収
 * @returns 給与所得控除額
 */
function calculateSalaryIncomeDeduction(yearlyGrossSalary: number): number {
  const bracket = salaryIncomeDeductionBrackets.find(
    (value) => yearlyGrossSalary <= value.maxYearlyGrossSalary
  );

  if (bracket === undefined) {
    return minMoneyValue;
  }

  if (bracket.rate === minMoneyValue) {
    return bracket.deduction;
  }

  return yearlyGrossSalary * bracket.rate + bracket.deduction;
}

/**
 * 所得税額を計算する
 *
 * @param taxableIncome 課税所得
 * @returns 所得税額
 */
function calculateIncomeTax(taxableIncome: number): number {
  const roundedTaxableIncome =
    Math.floor(Math.max(minMoneyValue, taxableIncome) / taxableIncomeRoundingUnit) *
    taxableIncomeRoundingUnit;

  if (roundedTaxableIncome <= minMoneyValue) {
    return minMoneyValue;
  }

  const bracket = incomeTaxBrackets.find(
    (value) => roundedTaxableIncome <= value.maxTaxableIncome
  );

  if (bracket === undefined) {
    return minMoneyValue;
  }

  return roundedTaxableIncome * bracket.rate - bracket.deduction;
}

/**
 * 健康保険の本人負担率を取得する
 *
 * @param healthInsuranceType 健康保険の種類
 * @param prefecture 都道府県
 * @param customHealthInsuranceEmployeeRate カスタム健康保険本人負担率
 * @returns 健康保険の本人負担率
 */
function getEmployeeHealthInsuranceRate(
  healthInsuranceType: HealthInsuranceType,
  prefecture: Prefecture,
  customHealthInsuranceEmployeeRate: number
): number {
  if (healthInsuranceType === "kyoukaikenpo") {
    return kyoukaiKenpoHealthInsuranceRates[prefecture] / 2;
  }

  if (healthInsuranceType === "itsKenpo") {
    return itsKenpoEmployeeHealthInsuranceRate;
  }

  return customHealthInsuranceEmployeeRate;
}

/**
 * 介護保険の本人負担率を取得する
 *
 * @param healthInsuranceType 健康保険の種類
 * @param customCareInsuranceEmployeeRate カスタム介護保険本人負担率
 * @returns 介護保険の本人負担率
 */
function getEmployeeCareInsuranceRate(
  healthInsuranceType: HealthInsuranceType,
  customCareInsuranceEmployeeRate: number
): number {
  if (healthInsuranceType === "kyoukaikenpo") {
    return kyoukaiKenpoCareInsuranceRate / 2;
  }

  if (healthInsuranceType === "itsKenpo") {
    return itsKenpoEmployeeCareInsuranceRate;
  }

  return customCareInsuranceEmployeeRate;
}

/**
 * 会社員の概算手取りを計算する
 *
 * @param grossMonthlySalary 額面月給
 * @param socialInsuranceCalculationMode 社会保険料の計算方法
 * @param standardMonthlyRemuneration 標準報酬月額
 * @param prefecture 都道府県
 * @param healthInsuranceType 健康保険の種類
 * @param customHealthInsuranceEmployeeRate カスタム健康保険本人負担率
 * @param customCareInsuranceEmployeeRate カスタム介護保険本人負担率
 * @param ageGroup 年齢区分
 * @param includeResidentTax 住民税を引くか
 * @returns 概算手取り計算結果
 */
function calculateEmployeeTakeHomePay(
  grossMonthlySalary: number,
  socialInsuranceCalculationMode: SocialInsuranceCalculationMode,
  standardMonthlyRemuneration: number,
  prefecture: Prefecture,
  healthInsuranceType: HealthInsuranceType,
  customHealthInsuranceEmployeeRate: number,
  customCareInsuranceEmployeeRate: number,
  ageGroup: AgeGroup,
  includeResidentTax: boolean
): TakeHomePayResult {
  /** 健康保険本人負担率 */
  const healthInsuranceRate = getEmployeeHealthInsuranceRate(
    healthInsuranceType,
    prefecture,
    customHealthInsuranceEmployeeRate
  );
  /** 介護保険本人負担率 */
  const careInsuranceRate = getEmployeeCareInsuranceRate(
    healthInsuranceType,
    customCareInsuranceEmployeeRate
  );
  /** 社会保険料の計算基準額 */
  const socialInsuranceBaseAmount =
    socialInsuranceCalculationMode === "standardMonthlyRemuneration"
      ? standardMonthlyRemuneration
      : grossMonthlySalary;
  /** 計算結果(健康保険料) */
  const healthInsurance = floorMoney(socialInsuranceBaseAmount * healthInsuranceRate);
  /** 計算結果(介護保険料) */
  const careInsurance =
    ageGroup === "over40" ? floorMoney(socialInsuranceBaseAmount * careInsuranceRate) : 0;
  /** 計算結果(厚生年金保険料) */
  const welfarePension = floorMoney(socialInsuranceBaseAmount * welfarePensionEmployeeRate);
  /** 計算結果(雇用保険料) */
  const employmentInsurance = floorMoney(grossMonthlySalary * employmentInsuranceEmployeeRate);
  /** 計算結果(額面年収) */
  const yearlyGrossSalary = grossMonthlySalary * monthsPerYear;
  /** 計算結果(年間社会保険料) */
  const yearlySocialInsurance =
    (healthInsurance + careInsurance + welfarePension + employmentInsurance) *
    monthsPerYear;
  /** 計算結果(給与所得控除) */
  const salaryIncomeDeduction = calculateSalaryIncomeDeduction(yearlyGrossSalary);
  /** 計算結果(給与所得) */
  const salaryIncome = Math.max(minMoneyValue, yearlyGrossSalary - salaryIncomeDeduction);
  /** 計算結果(所得税の課税所得) */
  const incomeTaxTaxableIncome = Math.max(
    minMoneyValue,
    salaryIncome - yearlySocialInsurance - incomeTaxBasicDeduction
  );
  /** 計算結果(年間所得税) */
  const yearlyIncomeTax = calculateIncomeTax(incomeTaxTaxableIncome);
  /** 計算結果(復興特別所得税を含む年間所得税) */
  const yearlyIncomeTaxWithSpecialTax = floorMoney(yearlyIncomeTax * specialIncomeTaxRate);
  /** 計算結果(月間所得税) */
  const incomeTax = floorMoney(yearlyIncomeTaxWithSpecialTax / monthsPerYear);
  /** 計算結果(住民税の課税所得) */
  const residentTaxTaxableIncome = Math.max(
    minMoneyValue,
    salaryIncome - yearlySocialInsurance - residentTaxBasicDeduction
  );
  /** 計算結果(年間住民税所得割) */
  const yearlyResidentTaxIncomeBased = floorMoney(
    residentTaxTaxableIncome * residentTaxIncomeRate
  );
  /** 計算結果(月間住民税) */
  const residentTax = includeResidentTax
    ? floorMoney((yearlyResidentTaxIncomeBased + residentTaxFlatAmount) / monthsPerYear)
    : 0;
  /** 計算結果(月間控除合計) */
  const totalDeduction =
    healthInsurance +
    careInsurance +
    welfarePension +
    employmentInsurance +
    incomeTax +
    residentTax;
  /** 計算結果(月間手取り) */
  const monthlyTakeHomePay = floorMoney(grossMonthlySalary - totalDeduction);
  /** 計算結果(年間手取り) */
  const yearlyTakeHomePay = monthlyTakeHomePay * monthsPerYear;

  return {
    healthInsurance,
    careInsurance,
    welfarePension,
    employmentInsurance,
    incomeTax,
    residentTax,
    totalDeduction,
    monthlyTakeHomePay,
    yearlyGrossSalary,
    yearlyTakeHomePay,
  };
}

export default function TakeHomePayCalculator() {
  /** 額面月給入力欄参照 */
  const grossMonthlySalaryInputRef = useRef<HTMLInputElement>(null);
  /** 賞与見込み入力欄参照 */
  const estimatedAnnualBonusInputRef = useRef<HTMLInputElement>(null);
  /** 入力文字列(額面月給) */
  const [grossMonthlySalaryText, setGrossMonthlySalaryText] = useState(
    String(defaultGrossMonthlySalary)
  );
  /** 入力文字列(賞与見込み・年額) */
  const [estimatedAnnualBonusText, setEstimatedAnnualBonusText] = useState(
    String(defaultEstimatedAnnualBonus)
  );
  /** 入力文字列(標準報酬月額) */
  const [standardMonthlyRemunerationText, setStandardMonthlyRemunerationText] =
    useState(String(defaultStandardMonthlyRemuneration));
  /** 入力文字列(健康保険本人負担率) */
  const [customHealthInsuranceRateText, setCustomHealthInsuranceRateText] =
    useState(String(defaultCustomHealthInsuranceRatePercent));
  /** 入力文字列(介護保険本人負担率) */
  const [customCareInsuranceRateText, setCustomCareInsuranceRateText] =
    useState(String(defaultCustomCareInsuranceRatePercent));
  /** 計算用確定値(額面月給) */
  const [grossMonthlySalary, setGrossMonthlySalary] = useState(defaultGrossMonthlySalary);
  /** 計算用確定値(賞与見込み・年額) */
  const [estimatedAnnualBonus, setEstimatedAnnualBonus] = useState(
    defaultEstimatedAnnualBonus
  );
  /** 計算用確定値(標準報酬月額) */
  const [standardMonthlyRemuneration, setStandardMonthlyRemuneration] = useState(
    defaultStandardMonthlyRemuneration
  );
  /** 計算用確定値(健康保険本人負担率) */
  const [customHealthInsuranceRate, setCustomHealthInsuranceRate] = useState(
    defaultCustomHealthInsuranceRatePercent / percentRateDivisor
  );
  /** 計算用確定値(介護保険本人負担率) */
  const [customCareInsuranceRate, setCustomCareInsuranceRate] = useState(
    defaultCustomCareInsuranceRatePercent / percentRateDivisor
  );
  /** 計算用確定値(都道府県) */
  const [prefecture, setPrefecture] = useState<Prefecture>(defaultPrefecture);
  /** 計算用確定値(健康保険の種類) */
  const [healthInsuranceType, setHealthInsuranceType] =
    useState<HealthInsuranceType>(defaultHealthInsuranceType);
  /** 計算用確定値(社会保険料の計算方法) */
  const [socialInsuranceCalculationMode, setSocialInsuranceCalculationMode] =
    useState<SocialInsuranceCalculationMode>(defaultSocialInsuranceCalculationMode);
  /** 計算用確定値(年齢区分) */
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(defaultAgeGroup);
  /** 計算用確定値(住民税を引くか) */
  const [includeResidentTax, setIncludeResidentTax] = useState(defaultIncludeResidentTax);

  /**
   * 保存済み入力値を読み込む
   */
  useEffect(() => {
    const savedGrossMonthlySalary = localStorage.getItem(grossMonthlySalaryStorageKey);
    const savedEstimatedAnnualBonus = localStorage.getItem(
      estimatedAnnualBonusStorageKey
    );
    const savedStandardMonthlyRemuneration = localStorage.getItem(
      standardMonthlyRemunerationStorageKey
    );
    const savedPrefecture = localStorage.getItem(prefectureStorageKey);
    const savedHealthInsuranceType = localStorage.getItem(healthInsuranceTypeStorageKey);
    const savedSocialInsuranceCalculationMode = localStorage.getItem(
      socialInsuranceCalculationModeStorageKey
    );
    const savedCustomHealthInsuranceRate = localStorage.getItem(
      customHealthInsuranceRateStorageKey
    );
    const savedCustomCareInsuranceRate = localStorage.getItem(
      customCareInsuranceRateStorageKey
    );
    const savedAgeGroup = localStorage.getItem(ageGroupStorageKey);
    const savedIncludeResidentTax = localStorage.getItem(includeResidentTaxStorageKey);

    if (savedGrossMonthlySalary !== null) {
      setGrossMonthlySalaryText(savedGrossMonthlySalary);
      setGrossMonthlySalary(Number(savedGrossMonthlySalary));
    }

    if (savedEstimatedAnnualBonus !== null) {
      setEstimatedAnnualBonusText(savedEstimatedAnnualBonus);
      setEstimatedAnnualBonus(Number(savedEstimatedAnnualBonus));
    }

    if (savedStandardMonthlyRemuneration !== null) {
      setStandardMonthlyRemunerationText(savedStandardMonthlyRemuneration);
      setStandardMonthlyRemuneration(Number(savedStandardMonthlyRemuneration));
    }

    if (
      savedPrefecture === "ibaraki" ||
      savedPrefecture === "tochigi" ||
      savedPrefecture === "gunma" ||
      savedPrefecture === "saitama" ||
      savedPrefecture === "chiba" ||
      savedPrefecture === "tokyo" ||
      savedPrefecture === "kanagawa"
    ) {
      setPrefecture(savedPrefecture);
    }

    if (
      savedHealthInsuranceType === "kyoukaikenpo" ||
      savedHealthInsuranceType === "itsKenpo" ||
      savedHealthInsuranceType === "custom"
    ) {
      setHealthInsuranceType(savedHealthInsuranceType);
    }

    if (
      savedSocialInsuranceCalculationMode === "grossMonthlySalary" ||
      savedSocialInsuranceCalculationMode === "standardMonthlyRemuneration"
    ) {
      setSocialInsuranceCalculationMode(savedSocialInsuranceCalculationMode);
    }

    if (savedCustomHealthInsuranceRate !== null) {
      setCustomHealthInsuranceRateText(savedCustomHealthInsuranceRate);
      setCustomHealthInsuranceRate(parsePercentRate(savedCustomHealthInsuranceRate));
    }

    if (savedCustomCareInsuranceRate !== null) {
      setCustomCareInsuranceRateText(savedCustomCareInsuranceRate);
      setCustomCareInsuranceRate(parsePercentRate(savedCustomCareInsuranceRate));
    }

    if (savedAgeGroup === "under40" || savedAgeGroup === "over40") {
      setAgeGroup(savedAgeGroup);
    }

    if (savedIncludeResidentTax !== null) {
      setIncludeResidentTax(savedIncludeResidentTax === "true");
    }
  }, []);

  /**
   * 「額面月給」の入力文字列を検証し、計算用の「額面月給」に反映する
   */
  const commitGrossMonthlySalary = () => {
    const value = Math.min(
      maxEstimatedAnnualBonus,
  maxGrossMonthlySalary,
      Math.max(minMoneyValue, Number(grossMonthlySalaryText) || minMoneyValue)
    );

    setGrossMonthlySalary(value);
    setGrossMonthlySalaryText(String(value));
    localStorage.setItem(grossMonthlySalaryStorageKey, String(value));
  };

  /**
   * 「賞与見込み」の入力文字列を検証し、計算用の「賞与見込み」に反映する
   */
  const commitEstimatedAnnualBonus = () => {
    const value = Math.min(
      maxEstimatedAnnualBonus,
      Math.max(minMoneyValue, Number(estimatedAnnualBonusText) || minMoneyValue)
    );

    setEstimatedAnnualBonus(value);
    setEstimatedAnnualBonusText(String(value));
    localStorage.setItem(estimatedAnnualBonusStorageKey, String(value));
  };

  /**
   * 「標準報酬月額」の入力文字列を検証し、計算用の「標準報酬月額」に反映する
   */
  const commitStandardMonthlyRemuneration = () => {
    const value = Math.min(
      maxStandardMonthlyRemuneration,
      Math.max(minMoneyValue, Number(standardMonthlyRemunerationText) || minMoneyValue)
    );

    setStandardMonthlyRemuneration(value);
    setStandardMonthlyRemunerationText(String(value));
    localStorage.setItem(standardMonthlyRemunerationStorageKey, String(value));
  };

  /**
   * 「健康保険本人負担率」の入力文字列を検証し、計算用の「健康保険本人負担率」に反映する
   */
  const commitCustomHealthInsuranceRate = () => {
    const value = Math.min(
      maxCustomHealthInsuranceRatePercent,
      Math.max(minMoneyValue, Number(customHealthInsuranceRateText) || minMoneyValue)
    );

    setCustomHealthInsuranceRateText(String(value));
    setCustomHealthInsuranceRate(value / percentRateDivisor);
    localStorage.setItem(customHealthInsuranceRateStorageKey, String(value));
  };

  /**
   * 「介護保険本人負担率」の入力文字列を検証し、計算用の「介護保険本人負担率」に反映する
   */
  const commitCustomCareInsuranceRate = () => {
    const value = Math.min(
      maxCustomCareInsuranceRatePercent,
      Math.max(minMoneyValue, Number(customCareInsuranceRateText) || minMoneyValue)
    );

    setCustomCareInsuranceRateText(String(value));
    setCustomCareInsuranceRate(value / percentRateDivisor);
    localStorage.setItem(customCareInsuranceRateStorageKey, String(value));
  };

  /**
   * 「都道府県」を変更する
   *
   * @param value 都道府県
   */
  const changePrefecture = (value: Prefecture) => {
    setPrefecture(value);
    localStorage.setItem(prefectureStorageKey, value);
  };

  /**
   * 「健康保険の種類」を変更する
   *
   * @param value 健康保険の種類
   */
  const changeHealthInsuranceType = (value: HealthInsuranceType) => {
    setHealthInsuranceType(value);
    localStorage.setItem(healthInsuranceTypeStorageKey, value);
  };

  /**
   * 「社会保険料の計算方法」を変更する
   *
   * @param value 社会保険料の計算方法
   */
  const changeSocialInsuranceCalculationMode = (
    value: SocialInsuranceCalculationMode
  ) => {
    setSocialInsuranceCalculationMode(value);
    localStorage.setItem(socialInsuranceCalculationModeStorageKey, value);
  };

  /**
   * 「年齢区分」を変更する
   *
   * @param value 年齢区分
   */
  const changeAgeGroup = (value: AgeGroup) => {
    setAgeGroup(value);
    localStorage.setItem(ageGroupStorageKey, value);
  };

  /**
   * 「住民税を引くか」を変更する
   *
   * @param value 住民税を引くか
   */
  const changeIncludeResidentTax = (value: boolean) => {
    setIncludeResidentTax(value);
    localStorage.setItem(includeResidentTaxStorageKey, String(value));
  };

  /**
   * 入力値を初期状態に戻す
   */
  const resetInputs = () => {
    setGrossMonthlySalaryText(String(defaultGrossMonthlySalary));
    setEstimatedAnnualBonusText(String(defaultEstimatedAnnualBonus));
    setStandardMonthlyRemunerationText(String(defaultStandardMonthlyRemuneration));
    setCustomHealthInsuranceRateText(String(defaultCustomHealthInsuranceRatePercent));
    setCustomCareInsuranceRateText(String(defaultCustomCareInsuranceRatePercent));
    setGrossMonthlySalary(defaultGrossMonthlySalary);
    setEstimatedAnnualBonus(defaultEstimatedAnnualBonus);
    setStandardMonthlyRemuneration(defaultStandardMonthlyRemuneration);
    setCustomHealthInsuranceRate(
      defaultCustomHealthInsuranceRatePercent / percentRateDivisor
    );
    setCustomCareInsuranceRate(defaultCustomCareInsuranceRatePercent / percentRateDivisor);
    setPrefecture(defaultPrefecture);
    setHealthInsuranceType(defaultHealthInsuranceType);
    setSocialInsuranceCalculationMode(defaultSocialInsuranceCalculationMode);
    setAgeGroup(defaultAgeGroup);
    setIncludeResidentTax(defaultIncludeResidentTax);

    localStorage.removeItem(grossMonthlySalaryStorageKey);
    localStorage.removeItem(estimatedAnnualBonusStorageKey);
    localStorage.removeItem(standardMonthlyRemunerationStorageKey);
    localStorage.removeItem(prefectureStorageKey);
    localStorage.removeItem(healthInsuranceTypeStorageKey);
    localStorage.removeItem(socialInsuranceCalculationModeStorageKey);
    localStorage.removeItem(customHealthInsuranceRateStorageKey);
    localStorage.removeItem(customCareInsuranceRateStorageKey);
    localStorage.removeItem(ageGroupStorageKey);
    localStorage.removeItem(includeResidentTaxStorageKey);
  };

  /** 健康保険本人負担率 */
  const employeeHealthInsuranceRate = getEmployeeHealthInsuranceRate(
    healthInsuranceType,
    prefecture,
    customHealthInsuranceRate
  );
  /** 介護保険本人負担率 */
  const employeeCareInsuranceRate = getEmployeeCareInsuranceRate(
    healthInsuranceType,
    customCareInsuranceRate
  );
  /** 計算結果 */
  const result = calculateEmployeeTakeHomePay(
    grossMonthlySalary,
    socialInsuranceCalculationMode,
    standardMonthlyRemuneration,
    prefecture,
    healthInsuranceType,
    customHealthInsuranceRate,
    customCareInsuranceRate,
    ageGroup,
    includeResidentTax
  );
  /** 賞与込み額面年収 */
  const yearlyGrossSalaryWithBonus = result.yearlyGrossSalary + estimatedAnnualBonus;
  /** 賞与を単純加算した年間手取り目安 */
  const yearlyTakeHomePayWithBonusSimple = result.yearlyTakeHomePay + estimatedAnnualBonus;

  return (
    <main className="mx-auto max-w-3xl p-4">
      <h1 className="mb-6 text-center text-3xl font-bold">
        額面→手取り計算機
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 入力エリア */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">
            入力項目
          </h2>

          {/* 入力項目(額面月給) */}
          <NumberInput
            label="額面月給（円）"
            value={grossMonthlySalaryText}
            maxValue={maxGrossMonthlySalary}
            inputRef={grossMonthlySalaryInputRef}
            onChange={setGrossMonthlySalaryText}
            onCommit={commitGrossMonthlySalary}
            onEnter={() => {
              estimatedAnnualBonusInputRef.current?.focus();
            }}
          />

          {/* 入力項目(賞与見込み) */}
          <NumberInput
            label="賞与見込み（年額・円）"
            value={estimatedAnnualBonusText}
            maxValue={maxEstimatedAnnualBonus}
            inputRef={estimatedAnnualBonusInputRef}
            onChange={setEstimatedAnnualBonusText}
            onCommit={commitEstimatedAnnualBonus}
            onEnter={() => {
              estimatedAnnualBonusInputRef.current?.blur();
            }}
          />

          <p className="mt-1 text-xs leading-6 text-gray-500">
            賞与がある場合は、年間の見込み額を入力してください。賞与の社会保険料・所得税は別計算になるため、年間手取りは簡易目安です。
          </p>

          {/* 入力項目(社会保険料の計算方法) */}
          <div className="mt-4">
            <label className="mb-1 block font-bold">
              社会保険料の計算方法
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              value={socialInsuranceCalculationMode}
              onChange={(event) => {
                changeSocialInsuranceCalculationMode(
                  event.target.value as SocialInsuranceCalculationMode
                );
              }}
            >
              <option value="grossMonthlySalary">
                {socialInsuranceCalculationModeLabels.grossMonthlySalary}
              </option>
              <option value="standardMonthlyRemuneration">
                {socialInsuranceCalculationModeLabels.standardMonthlyRemuneration}
              </option>
            </select>
            <p className="mt-2 text-xs leading-6 text-gray-500">
              給与明細などで標準報酬月額が分かる場合は、直接入力すると社会保険料の精度が上がります。
            </p>
          </div>

          {/* 入力項目(標準報酬月額) */}
          {socialInsuranceCalculationMode === "standardMonthlyRemuneration" && (
            <NumberInput
              label="標準報酬月額（円）"
              value={standardMonthlyRemunerationText}
              maxValue={maxStandardMonthlyRemuneration}
              onChange={setStandardMonthlyRemunerationText}
              onCommit={commitStandardMonthlyRemuneration}
            />
          )}

          {/* 入力項目(健康保険の種類) */}
          <div className="mt-4">
            <label className="mb-1 block font-bold">
              健康保険の種類
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              value={healthInsuranceType}
              onChange={(event) => {
                changeHealthInsuranceType(event.target.value as HealthInsuranceType);
              }}
            >
              <option value="kyoukaikenpo">協会けんぽ</option>
              <option value="itsKenpo">関東ITソフトウェア健康保険組合</option>
              <option value="custom">その他の健康保険組合</option>
            </select>
          </div>

          {/* 入力項目(都道府県) */}
          {healthInsuranceType === "kyoukaikenpo" && (
            <div className="mt-4">
              <label className="mb-1 block font-bold">
                都道府県
              </label>
              <select
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
                value={prefecture}
                onChange={(event) => {
                  changePrefecture(event.target.value as Prefecture);
                }}
              >
                <option value="ibaraki">茨城県</option>
                <option value="tochigi">栃木県</option>
                <option value="gunma">群馬県</option>
                <option value="saitama">埼玉県</option>
                <option value="chiba">千葉県</option>
                <option value="tokyo">東京都</option>
                <option value="kanagawa">神奈川県</option>
              </select>
              <p className="mt-2 text-xs leading-6 text-gray-500">
                協会けんぽの場合、選択した都道府県の料率をもとに計算します。
              </p>
            </div>
          )}

          {/* 入力項目(その他の健康保険組合) */}
          {healthInsuranceType === "custom" && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block font-bold">
                  健康保険 本人負担率（%）
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  inputMode="decimal"
                  value={customHealthInsuranceRateText}
                  onBlur={commitCustomHealthInsuranceRate}
                  onChange={(event) => {
                    setCustomHealthInsuranceRateText(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      commitCustomHealthInsuranceRate();
                      event.currentTarget.blur();
                    }
                  }}
                />
              </div>

              <div>
                <label className="mb-1 block font-bold">
                  介護保険 本人負担率（%）
                </label>
                <input
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                  inputMode="decimal"
                  value={customCareInsuranceRateText}
                  onBlur={commitCustomCareInsuranceRate}
                  onChange={(event) => {
                    setCustomCareInsuranceRateText(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      commitCustomCareInsuranceRate();
                      event.currentTarget.blur();
                    }
                  }}
                />
                <p className="mt-2 text-xs leading-6 text-gray-500">
                  40歳未満の場合、介護保険は計算結果に反映されません。
                </p>
              </div>
            </div>
          )}

          {/* 入力項目(年齢区分) */}
          <div className="mt-4">
            <label className="mb-1 block font-bold">
              年齢区分
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              value={ageGroup}
              onChange={(event) => {
                changeAgeGroup(event.target.value as AgeGroup);
              }}
            >
              <option value="under40">40歳未満</option>
              <option value="over40">40歳以上</option>
            </select>
          </div>

          {/* 入力項目(住民税) */}
          <label className="mt-4 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={includeResidentTax}
              onChange={(event) => {
                changeIncludeResidentTax(event.target.checked);
              }}
            />
            住民税を差し引く
          </label>

          <p className="mt-2 text-xs leading-6 text-gray-500">
            新卒1年目など、住民税がまだ給与から引かれていない場合はチェックを外してください。
          </p>
        </div>

        {/* 結果エリア */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow">
          <h2 className="mb-4 text-xl font-bold">
            計算結果
          </h2>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>額面月給</span>
              <span>{grossMonthlySalary.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between">
              <span>賞与見込み（年額）</span>
              <span>{estimatedAnnualBonus.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between">
              <span>社会保険料の計算方法</span>
              <span>{socialInsuranceCalculationModeLabels[socialInsuranceCalculationMode]}</span>
            </div>

            {socialInsuranceCalculationMode === "standardMonthlyRemuneration" && (
              <div className="flex justify-between">
                <span>標準報酬月額</span>
                <span>{standardMonthlyRemuneration.toLocaleString()}円</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>健康保険</span>
              <span>{healthInsuranceTypeLabels[healthInsuranceType]}</span>
            </div>

            {healthInsuranceType === "kyoukaikenpo" && (
              <div className="flex justify-between">
                <span>都道府県</span>
                <span>{prefectureLabels[prefecture]}</span>
              </div>
            )}

            <div className="flex justify-between text-sm text-gray-500">
              <span>健康保険本人負担率</span>
              <span>{(employeeHealthInsuranceRate * percentRateDivisor).toFixed(3)}%</span>
            </div>

            <div className="flex justify-between text-sm text-gray-500">
              <span>介護保険本人負担率</span>
              <span>{(employeeCareInsuranceRate * percentRateDivisor).toFixed(3)}%</span>
            </div>

            <hr />

            <div className="flex justify-between">
              <span>健康保険</span>
              <span>-{result.healthInsurance.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between">
              <span>介護保険</span>
              <span>-{result.careInsurance.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between">
              <span>厚生年金</span>
              <span>-{result.welfarePension.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between">
              <span>雇用保険</span>
              <span>-{result.employmentInsurance.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between">
              <span>所得税</span>
              <span>-{result.incomeTax.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between">
              <span>住民税</span>
              <span>-{result.residentTax.toLocaleString()}円</span>
            </div>

            <hr />

            <div className="flex justify-between font-bold">
              <span>控除合計</span>
              <span>-{result.totalDeduction.toLocaleString()}円</span>
            </div>

            <div className="mt-6 rounded-lg bg-blue-50 p-4 text-center">
              <div className="text-sm text-gray-600">
                概算手取り
              </div>

              <div className="mt-2 text-3xl font-bold">
                {result.monthlyTakeHomePay.toLocaleString()}円
              </div>
            </div>

            <div className="mt-4 flex justify-between">
              <span>賞与なし額面年収</span>
              <span>{result.yearlyGrossSalary.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between font-bold">
              <span>賞与込み額面年収</span>
              <span>{yearlyGrossSalaryWithBonus.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between">
              <span>月給分の概算年間手取り</span>
              <span>{result.yearlyTakeHomePay.toLocaleString()}円</span>
            </div>

            <div className="flex justify-between font-bold">
              <span>賞与込み年間手取り目安</span>
              <span>{yearlyTakeHomePayWithBonusSimple.toLocaleString()}円</span>
            </div>

            <p className="text-xs leading-6 text-gray-500">
              賞与込み年間手取り目安は、賞与見込みを単純加算した簡易表示です。賞与から引かれる社会保険料・所得税は別途変わります。
            </p>
          </div>

          <button
            className="mt-6 w-full rounded-lg bg-gray-200 px-4 py-2 font-bold hover:bg-gray-300"
            onClick={resetInputs}
          >
            入力内容をリセット
          </button>
        </div>
      </div>

      {/* 注意書き・補足説明 */}
      <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5 shadow">
        <h2 className="mb-4 text-xl font-bold">この計算機について</h2>

        <div className="space-y-4 text-sm leading-7 text-gray-700">
          <div>
            <h3 className="font-bold text-gray-900">計算できる内容</h3>
            <p>
              会社員の月給（額面）から、社会保険料・所得税・住民税を差し引いた概算手取り額を計算できます。賞与見込みを入力すると、賞与込みの額面年収と年間手取り目安も確認できます。
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900">計算に含めているもの</h3>
            <p>
              健康保険、介護保険、厚生年金、雇用保険、所得税、住民税を概算で計算しています。
            </p>
            <p>
              協会けんぽは選択した都道府県の料率、関東ITソフトウェア健康保険組合は令和7年度の本人負担率をもとに計算しています。
            </p>
            <p>
              その他の健康保険組合を選ぶ場合は、給与明細や会社の案内に記載された本人負担率を入力してください。
            </p>
            <p>
              標準報酬月額を直接入力した場合、健康保険・介護保険・厚生年金は標準報酬月額をもとに計算します。
            </p>
            <p>
              厚生年金は本人負担9.15%、雇用保険は一般の事業の労働者負担0.55%として計算しています。
            </p>
          </div>

          <div>
            <h3 className="font-bold text-gray-900">注意事項</h3>
            <p>この計算結果は概算です。</p>
            <p>
              実際の手取り額は、勤務先、加入している健康保険、標準報酬月額、扶養人数、賞与、各種控除などによって異なります。賞与の手取りは月給とは計算方法が異なるため、このページでは簡易目安として表示しています。
            </p>
            <p>
              住民税は前年の所得をもとに計算されるため、新卒1年目などは給与から引かれていない場合があります。
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}